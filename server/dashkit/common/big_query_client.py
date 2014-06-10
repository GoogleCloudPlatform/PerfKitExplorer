"""A client for accessing Big Query.

Authentication is performed using a checked in credentials file with entries
for various environments.

Clients looking to do other forms of authentication should inherit from this
class and overwrite the __init__ method.

Code in this module is based heavily off the documented example found here:
https://developers.google.com/bigquery/loading-data-into-bigquery#storageimport
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import hashlib
import json
import logging
import pkgutil
import random
import time
import uuid

from apiclient.discovery import build_from_document
from apiclient.errors import HttpError

import big_query_result_util as result_util
import credentials_lib
import data_source_config as config
import http_util


DISCOVERY_FILE = 'config/big_query_v2_rest.json'


# TODO: Remove methods that aren't useful for Explorer (a lot of them are
#     focused on the processor/import routines.
# BigQuery API Settings
SCOPE = 'https://www.googleapis.com/auth/bigquery'
DATASET_ID = 'samples_mart'
TEMP_DATASET_ID = 'samples_mart_temp'
DEFAULT_QUERY_TIMEOUT = 60
TARGET_TABLE_ID = 'results'
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

SLEEP_BETWEEN_RETRIES = 10  # In seconds
SLEEP_BETWEEN_POLLS = 5  # In seconds

# A seed value used for doing random sampling.  We want to use a consistent
# seed so refreshing a graph doesn't change the graph.
RANDOM_SAMPLE_SEED = 0.8591313996314685


class BqStates(object):
  """Known BQ States."""
  DONE = 'DONE'


class BqErrorMsgs(object):
  """Known BQ Error Msgs."""
  ALREADY_EXISTS = 'Already Exists'


class Error(Exception):
  pass


class BigQueryError(Error):

  def __init__(self, message, query=None):
    self.message = message
    self.query = query
    super(BigQueryError, self).__init__(message)


class NoTableError(Error):

  def __init__(self, project_id, dataset_name, table_name):
    self.project_id = project_id
    self.dataset_name = dataset_name
    self.table_name = table_name

    message = (
        'Table [{project_id}:{dataset_name}.{table_name}] '
        'was not found.').format(
            project_id=project_id,
            dataset_name=dataset_name,
            table_name=table_name)
    super(NoTableError, self).__init__(message)


class BigQueryResultError(Error):

  def __init__(self, message, result):
    self._result = result

    super(BigQueryResultError, self).__init__(message)

  @property
  def result(self):
    return self._result


class SamplingError(Error):
  pass


class BigQueryImportError(Error):
  """Exception raised when a Big Query import fails.

  Attributes:
    msg: The Error message.
    bq_error_message: The error message returned by Big Query.  This is useful
        to determine things like if the import job already exists.  This may
        be None if the Http request failed.
  """

  def __init__(self, msg, bq_error_message):
    super(BigQueryImportError, self).__init__(msg)
    self.bq_error_message = bq_error_message


class CredentialKeyError(Error):
  pass


class BigQueryClient(object):
  """Client for interacting with BigQuery, using checked in credentials."""

  # Errors to retry.  List includes system errors(500, 503) and an
  # authentication error(401)
  RETRYABLE_ERRORS = [401, 500, 503]

  def __init__(self, credential_file, env, project_id=None):
    """Obtain service account credentials and authorize HTTP connection.

    Load a JSON credential file and create credentials objects.
    Args:
      credential_file: A file path string for the credentials JSON file.
      env: A constant in data_source_config.Environments for Dashkit
          (e.g, PRODUCTION or TESTING).
      project_id: The project ID to use.  If not provided, it will be derived
          from the environment.

    Raises:
      CredentialKeyError: when |stage| does not exist in the key of JSON dict.
    """
    self._credential_file = credential_file
    self.env = env
    self.project_id = (project_id or
                       config.Services.GetServiceUri(
                           self.env, config.Services.PROJECT_ID))

    self._InitializeHttp()
    self._InitializeService()

  def _InitializeHttp(self):
    """Sets the http handler for the client."""
    self._http = credentials_lib.GetAuthorizedCredentials(
        self._credential_file, self.env)

  def _InitializeService(self):
    """Creates a new API service for interacting with BigQuery."""
    document = None

    with open(DISCOVERY_FILE, 'rb') as f:
      document = f.read()
      f.close()

    self.service = build_from_document(document, http=self._http)

  @staticmethod
  def BuildJobIdString(files, import_round, import_try):
    """Builds a job id string based on the files to load.

    This string is designed to be informative to a human, and globally unique.

    Args:
      files: A list of sorted file names that will be loaded into Big Query.
          The job id string contains both the first and last file in this list
          and a hash of the list.
      import_round: An integer that is incremented each time we reimport data.
          The function of this value is to prevent duplicate job_ids when we
          reimport data as job_ids must be unique.
      import_try: The number of times we've tried to import this file.

    Returns:
      A job id string of the form
      load_job_ImportRound_ImportTry_FirstFile_LastFile_HashOfFiles,
      for example:
      load_job_0_1_000100_000200_f23ca429
    """
    hasher = hashlib.sha1()
    hasher.update(''.join(files))
    hashed_file_names = hasher.hexdigest()
    job_id = 'load_job_%s_%s_%s_%s_%s' % (import_round, import_try, files[0],
                                          files[-1], hashed_file_names)
    # Remove characters not allowed in a job_id.  Only alphanumeric, -, and _
    # are allowed
    job_id = job_id.replace('://', '-')
    job_id = job_id.replace('/', '-')
    return job_id

  def _ExecuteRequestWithRetries(self, request, num_tries=5):
    """Executes a request and retries certain failures.

    Failures are retried if they are in the list of RETRYABLE_ERRORS

    Args:
      request: The request to issue to big query.  It must be an object with
          an execute method.
      num_tries: The number of times to attempt the request.

    Returns:
      The results of the request.
    """
    for _ in xrange(num_tries -1):
      try:
        return request.execute()
      except HttpError as e:
        if e.resp['status'] not in self.RETRYABLE_ERRORS:
          raise

    return request.execute()

  def LoadData(self, source_uris, job_id=None,
               source_format='NEWLINE_DELIMITED_JSON',
               schema=None,
               destination_dataset=DATASET_ID,
               destination_table=TARGET_TABLE_ID,
               write_disposition='WRITE_APPEND'):
    """Loads data into a big query table from JSON files.

    Args:
      source_uris: A list of uris of the files to import.  Uris should be in
          the form gs://bucket/object.  These files should contain 1 or more
          newline separated JSON files.
      job_id: An id to create the load data job with.  If this job_id is
          already in use, the job is not created.
      source_format: Specifies the format of the data.  Supported values are
          NEWLINE_DELIMITED_JSON and CSV.
      schema: If provided, describes the schema of the target table.  This
          should be provided when you expect to be creating the table rather
          then appending to it.  (via write_disposition)
      destination_dataset: The dataset that contains the target table.
      destination_table: The name of the table that will receive the data.
      write_disposition: Describes how to handle existing tables.  The two
          typical values here are
          WRITE_APPEND - Add records to the table if it already exists.
          WRITE_TRUNCATE - Replace the table if it exists.
    """
    job_id = self.LoadDataAsync(source_uris, job_id=job_id,
                                source_format=source_format,
                                schema=schema,
                                destination_dataset=destination_dataset,
                                destination_table=destination_table,
                                write_disposition=write_disposition)
    self.PollImportStatus(source_uris, job_id, blocking=True)

  def LoadDataAsync(self, source_uris, job_id=None,
                    source_format='NEWLINE_DELIMITED_JSON',
                    schema=None,
                    destination_dataset=DATASET_ID,
                    destination_table=TARGET_TABLE_ID,
                    write_disposition='WRITE_APPEND'):
    """Loads data into a big query table from JSON files.

    This method does not wait for the import to complete, rather it
    returns a job_id that a user can poll to check the status of the import.

    Args:
      source_uris: A list of uris of the files to import.  Uris should be in
          the form gs://bucket/object.  These files should contain 1 or more
          newline separated JSON files.
      job_id: An id to create the load data job with.  If this job_id is
          already in use, the job is not created.
      source_format: Specifies the format of the data.  Supported values are
          NEWLINE_DELIMITED_JSON and CSV.
      schema: If provided, describes the schema of the target table.  This
          should be provided when you expect to be creating the table rather
          then appending to it.  (via write_disposition)
      destination_dataset: The dataset that contains the target table.
      destination_table: The name of the table that will receive the data.
      write_disposition: Describes how to handle existing tables.  The two
          typical values here are
          WRITE_APPEND - Add records to the table if it already exists.
          WRITE_TRUNCATE - Replace the table if it exists.

    Returns:
      The import job id, a user can poll this to see when the import task
      completes.
    """
    try:
      job_collection = self.service.jobs()
      job_data = {
          'projectId': self.project_id,
          'configuration': {
              'load': {
                  'sourceUris': source_uris,
                  'sourceFormat': source_format,
                  'destinationTable': {
                      'projectId': self.project_id,
                      'datasetId': destination_dataset,
                      'tableId': destination_table},
                  'maxBadRecords': 0,
                  'writeDisposition': write_disposition}}}
      if job_id:
        job_data['jobReference'] = {'jobId': job_id}
      if schema:
        job_data['configuration']['load']['schema'] = schema

      request = job_collection.insert(projectId=self.project_id, body=job_data)
      return self._ExecuteRequestWithRetries(request)['jobReference']['jobId']
    except HttpError as e:
      raise BigQueryImportError(
          'Importing the following data failed with the following HTTP error'
          '\nerror:%s\ndata_files:%s' % (e, source_uris), str(e))

  # TODO: Create a generic PollJobStatus that can be shared across
  # big query methods.
  def PollImportStatus(self, source_uris, job_id, blocking=True):
    """Checks the status of an import based on a job_id.

    Args:
      source_uris: A list of uris of the files to import.  Uris should be in
          the form gs://bucket/object.  These files should contain 1 or more
          newline separated JSON files.
      job_id: The import job_id, used for checking the import status.
      blocking: If True, wait until the import completes.  If False returns
          after checking the status once regardless of the import status.

    Returns:
      True if the status state is DONE, otherwise returns False.
    """
    try:
      job_collection = self.service.jobs()
      first_pass = True
      # If blocking ping for status until it is done, with a short pause
      # between calls.
      while blocking or first_pass:
        first_pass = False

        request = job_collection.get(projectId=self.project_id, jobId=job_id)
        status = self._ExecuteRequestWithRetries(request)
        if 'DONE' == status['status']['state']:
          if 'errorResult' in status['status']:
            raise BigQueryImportError(
                'Importing the following data failed with the following status'
                '\nstatus:%s\ndata_files:%s' %
                (status, source_uris),
                status['status']['errorResult']['message'])
          else:
            logging.info('Upload complete.')
            return True

        if blocking:
          logging.info('Waiting for the import to complete...')
          time.sleep(SLEEP_BETWEEN_RETRIES)

      return False

    except HttpError as e:
      raise BigQueryError(
          'Checking the status of an import for the following data failed '
          'with the following Http error \nerror:%s\ndata_files:%s' %
          (e, source_uris))

  def Insert(self, body):
    """Executes an insert job, and waits for completion.

    Insert jobs in BigQuery are used to execute asynchronous operations.  The
    type of job determines the operation taking place, and includes load (from
    GZip/JSON file), query (doesn't return results, but can target a destination
    table instead), extract (from BigQuery to Cloud Storage), and copy (one
    table to another).

    More documentation on insert jobs in BigQuery can be found at:
        https://developers.google.com/bigquery/docs/reference/v2/jobs/insert

    Args:
      body: A JSON object describing the body of the job request.  See the docs
          noted above for details on supported configuration.

    Returns:
      The reply JSON from the BigQuery request.

    Raises:
      BigQueryError: If there is an errorResult in the completed job.
    """
    job_collection = self.service.jobs()
    logging.debug('Issuing Insert job with body: {%s}', body)
    request = job_collection.insert(projectId=self.project_id,
                                    body=body)
    query_reply = self._ExecuteRequestWithRetries(request)

    job_reference = query_reply['jobReference']

    while query_reply['status']['state'] == 'RUNNING':
      logging.debug('Waiting for job to complete...')
      time.sleep(SLEEP_BETWEEN_POLLS)
      request = job_collection.get(
          projectId=self.project_id,
          jobId=job_reference['jobId'])
      query_reply = self._ExecuteRequestWithRetries(request)

    if 'errorResult' in query_reply['status']:
      logging.error('** BigQueryClient.Insert() failed.  Response: ')
      logging.error(json.dumps(query_reply, indent=4))

      msg = 'Insert job failed due to {reason}:\n  {message}'.format(
          reason=query_reply['status']['errorResult']['reason'],
          message=query_reply['status']['errorResult']['message'])
      raise BigQueryError(msg)

    return query_reply

  # TODO: Add support for typing the values returned in each page based
  # on table schema.
  def ListTableData(self, dataset_name, table_name, page_callback,
                    max_results_per_page=None):
    """Lists the data in a table. optionally from a specific row/index.

    page_callback(response) is called for each page of data returned.  For more
    information on the response body for tabledata.list, see below.
      https://developers.google.com/bigquery/docs/reference/v2/tabledata/list

    Args:
      dataset_name: The dataset that contains the table to read.
      table_name: The table name to read.
      page_callback: The function called for each page, with params listed
          below.
          reply- The reply from the last TableData.List() call.
      max_results_per_page: The maximum results returned per page.  Most
          callers shouldn't need to set this as this method combines the
          results of all the pages of data into a single response.
    """
    tabledata_job = self.service.tabledata()
    page_token = None

    try:
      while True:
        reply = tabledata_job.list(projectId=self.project_id,
                                   datasetId=dataset_name,
                                   tableId=table_name,
                                   pageToken=page_token,
                                   maxResults=max_results_per_page).execute()
        if 'rows' not in reply:
          break

        page_callback(reply)

        if 'pageToken' in reply:
          page_token = reply['pageToken']
        else:
          break
    except HttpError as err:
      logging.error('Error in ListTableData:\n%s', err.content)

  def QueryLargeResults(self, query, page_callback, temp_dataset_name=None,
                        temp_table_name=None):
    """Issues a query that supports an arbitrary result size.

    Normal Query jobs are limited to 128Mb, while this method allows processing
    of queries of unbounded size.  It fires a page_callback for each page of
    data returned.  The table describes by temp_dataset_name.temp_table_name is
    deleted once all pages in the result set have been returned.
    page_callback(response) is called for each page of data returned.  For more
    information on the response body for tabledata.list, see the link below.
    https://developers.google.com/bigquery/docs/reference/v2/tabledata/list.

    Args:
      query: The query to issue.
      page_callback: A function called for each page, with params listed below.
          reply- The reply from the last TableData.List() call.
      temp_dataset_name: The dataset that holds the query results table.  If
          not provided, TEMP_DATASET_ID is used.
      temp_table_name: The name of the query results table.  If not provided,
          BQ_TEMP_{new_guid} is used as the table name.
    """
    try:
      temp_dataset_name = temp_dataset_name or TEMP_DATASET_ID

      if not temp_table_name:
        temp_table_name = 'BQ_TEMP_%s' % self.GetRandomTableName()

      logging.info(
          'Executing BigQuery with large materialize for project %s, query:'
          '\n\n%s', self.project_id, query)

      self.QueryInto(query=query,
                     destination_dataset=temp_dataset_name,
                     destination_table=temp_table_name,
                     write_disposition='WRITE_TRUNCATE',
                     allow_large_results=True)

      self.ListTableData(dataset_name=temp_dataset_name,
                         table_name=temp_table_name,
                         page_callback=page_callback)

      self.DeleteTable(dataset_name=temp_dataset_name,
                       table_name=temp_table_name)
    except HttpError as err:
      msg = http_util.GetHttpErrorResponse(err)
      raise BigQueryError(msg, query)

  def TableExists(self, dataset_name, table_name):
    """Checks for the existence of a table.

    Args:
      dataset_name: Dataset containing the table to check for existence.
      table_name: Table to check for existence.

    Returns:
      True if a table was found, False if no table exists.
    """
    try:
      response = self.service.tables().get(projectId=self.project_id,
                                           datasetId=dataset_name,
                                           tableId=table_name).execute()
      return True
    except HttpError, err:
      msg = http_util.GetHttpErrorResponse(err)
      if msg.startswith('Not Found: Table '):
        return False
      else:
        logging.error(msg + '\n' + err.content)
        raise err

    return response is not None

  def DeleteTable(self, dataset_name, table_name):
    """Deletes a table if it exists.

    Rather than checking for the table's existence (which would cause two
    round-trips for a successful delete), this method just suppresses any
    Errors thrown due to the table not existing, and returns False instead.

    Args:
      dataset_name: Dataset containing the table to delete.
      table_name: Table to delete.

    Returns:
      True if a table was deleted, False if no table existed.
    """
    try:
      self.service.tables().delete(projectId=self.project_id,
                                   datasetId=dataset_name,
                                   tableId=table_name).execute()
      return True
    except HttpError, err:
      msg = http_util.GetHttpErrorResponse(err)
      if msg.startswith('Not Found: Table '):
        return False
      else:
        logging.error(msg + '\n' + err.content)
        raise err

  def Query(self, query, timeout=None, max_results_per_page=None):
    """Issues a query to Big Query and returns the response.

    Note that multiple pages of data will be loaded returned as a single data
    set.

    Args:
      query: The query to issue.
      timeout: The length of time (in seconds) to wait before checking for job
          completion.
      max_results_per_page: The maximum results returned per page.  Most
          callers shouldn't need to set this as this method combines the
          results of all the pages of data into a single response.

    Returns:
      The query results.  See big query's docs for the results format:
      http://goto.google.com/big_query_query_results
    """
    try:
      timeout_ms = (timeout or DEFAULT_QUERY_TIMEOUT) * 1000
      job_collection = self.service.jobs()
      query_data = {'query': query, 'timeoutMs': timeout_ms}
      if max_results_per_page:
        query_data['maxResults'] = max_results_per_page
      logging.info('Executing BigQuery for project %s, query:\n\n%s',
                   self.project_id, query_data)
      request = job_collection.query(projectId=self.project_id,
                                     body=query_data)
      query_reply = self._ExecuteRequestWithRetries(request)

      if 'jobReference' not in query_reply:
        logging.error('big_query_client.Query() failed: invalid JSON.\n'
                      'Query Reply:\n%s\n', query_reply)
        return query_reply

      job_reference = query_reply['jobReference']

      if 'rows' in query_reply:
        rows = query_reply['rows']
      else:
        rows = []

      while('rows' in query_reply and
            len(rows) < int(query_reply['totalRows'])):
        query_reply = self._ExecuteRequestWithRetries(
            job_collection.getQueryResults(
                projectId=self.project_id,
                jobId=job_reference['jobId'],
                timeoutMs=timeout_ms,
                startIndex=len(rows)))
        if 'rows' in query_reply:
          rows += query_reply['rows']

      query_reply['rows'] = rows
      result_util.ReplyFormatter.ConvertValuesToTypedData(query_reply)
      return query_reply
    except HttpError as err:
      msg = http_util.GetHttpErrorResponse(err)
      logging.error(msg)
      logging.error(query)

      raise BigQueryError(msg, query)

  def CopyTable(self,
                source_table,
                source_dataset,
                destination_table,
                destination_dataset=None,
                create_disposition='CREATE_IF_NEEDED',
                write_disposition='WRITE_TRUNCATE'):
    """Copies the contents and schema from one table to another.

    Documentation on copying tables can be found at:
      https://developers.google.com/bigquery/docs/tables#copyingtable
    Documentation on write/create dispositions can be found at:
      https://developers.google.com/bigquery/docs/reference/v2/jobs#importing

    Args:
      source_table: The name of the table to copy from.
      source_dataset: The dataset that contains the table to copy from.
      destination_table: The name of the table to copy into.
      destination_dataset: The dataset that will be copied into.  If not
          specified, source_dataset is used.
      create_disposition: Describes the behavior to take when the table does
          not already exist.  Defaults to 'CREATE_IF_NEEDED'.
      write_disposition: Describes the behavior to take when the table already
          exists.  Defaults to 'WRITE_TRUNCATE', which overwrites existing data.

    Raises:
      NoTableError: The source table did not exist.

    Returns:
      The reply JSON from the BigQuery request.
    """
    destination_dataset = destination_dataset or source_dataset

    if not self.TableExists(dataset_name=source_dataset,
                            table_name=source_table):
      raise NoTableError(self.project_id, source_dataset, source_table)

    job_config = {
        'configuration': {'copy': {
            'sourceTable': {
                'projectId': self.project_id,
                'datasetId': source_dataset,
                'tableId': source_table
            },
            'destinationTable': {
                'projectId': self.project_id,
                'datasetId': destination_dataset,
                'tableId': destination_table
            },
            'createDisposition': create_disposition,
            'writeDisposition': write_disposition
        }}}

    return self.Insert(job_config)

  def QueryInto(self, query, destination_dataset, destination_table,
                write_disposition, allow_large_results=False):
    """Issues a query and saves the results to a table.

    Args:
      query: The query to issue.
      destination_dataset: The target dataset to save the results to.
      destination_table: The target table to save the results to.
      write_disposition: Describes the behavior to take when the table already
          exists.
      allow_large_results: If True, uses the large result materialization
          feature in BigQuery.  This is an experimental feature, and takes
          longer to process than without this bit set, so it should only be
          used if necessary.

    Returns:
      The reply JSON from the BigQuery request.
    """
    try:
      job_config = {
          'configuration': {'query': {
              'query': query,
              'destinationTable': {
                  'projectId': self.project_id,
                  'datasetId': destination_dataset,
                  'tableId': destination_table
              },
              'writeDisposition': write_disposition,
              'allowLargeResults': allow_large_results
          }}}

      return self.Insert(job_config)
    except HttpError as e:
      raise BigQueryError(
          'Issuing the following query failed with the following Http error'
          '\nerror:%s\nquery:%s' % (e, query))

  @classmethod
  def SampleQueryResultsMax(cls, query_results, max_results):
    """Down samples a query results so there are roughly max results.

    Returns the data in the same format.  See query method for the expected
    format.  If there are more than max_results, exactly max_results will be
    returned.  We use a consistent seed so calling this method multiple times
    with the same args will give the same result.

    Args:
      query_results: The query result that you want to downsample.
      max_results: integer, The maximum number of results to return.  This
          should be a non negative integer.

    Raises:
      SamplingError: If there is conflicting information about the number of
          rows in a result or max_results is less than 0 or greater than 1.

    Returns:
      The downsampled results.
    """
    total_results = int(query_results['totalRows'])

    if total_results != len(query_results['rows']):
      raise SamplingError(
          'There were %s rows of results but we were expecting %s rows.' %
          (len(query_results['rows']), total_results))

    if max_results < 0 or max_results > total_results:
      raise SamplingError(
          'The max_results to return from sampling must be between 0 and the '
          'total number of rows, %s, inclusive.  Instead it was %s.' %
          (total_results, max_results))

    if total_results <= max_results:
      return query_results

    random.seed(RANDOM_SAMPLE_SEED)
    query_results['rows'] = random.sample(query_results['rows'], max_results)
    query_results['totalRows'] = len(query_results['rows'])
    return query_results

  @classmethod
  def SampleQueryResultsFraction(cls, query_results, sample_rate):
    """Down samples a query results keep only the sample_rate fraction.

    Returns the data in the same format.  See query method for the expected
    format.  Exactly sample_rate * number of results will be returned.  We use
    a consistent seed so calling this method multiple times with the same args
    will give the same result.

    Args:
      query_results: The query result that you want to downsample.
      sample_rate: float, The fraction of data to keep.  Should be between 0
          and 1 inclusive.

    Raises:
      SamplingError: If sample rate is greater than 1 or less than 0

    Returns:
      The downsampled results.
    """
    if sample_rate < 0 or sample_rate > 1:
      raise SamplingError(
          'The sample_rate must be between 0 and 1 inclusive.  Instead it was '
          '%s.' % sample_rate)

    if sample_rate == 1:
      return query_results

    return cls.SampleQueryResultsMax(
        query_results, query_results['totalRows'] * sample_rate)

  def GetJobByID(self, job_id):
    """Gets a job from Big Query based on the job_id."""
    request = self.service.jobs().get(jobId=job_id, projectId=self.project_id)
    return self._ExecuteRequestWithRetries(request)

  @classmethod
  def FormatDataForTemplates(cls, source_data):
    """Reformats BigQuery data to be a formal dictionary of field/values.

    BigQuery by default returns row data as a generic collection of values:
        {'schema':{
            'fields':[{'name':'col1'},
                      {'name':'col2'}]},
         'rows':[{'f':[{'v':'foo'},
                       {'v':'bar'}]}]}

    This is helpful for binding, but not templates (Django, Soy).  This
    function transforms rows into a formal dictionary:
        {'schema':{
            'fields':[{'name':'col1'},
                      {'name':'col2'}]},
         'rows':[{'col1':'foo', 'col2':'bar'}]}

    Args:
      source_data: The BigQuery reply object.

    Returns:
      A BigQuery result, with the rows section refactored with field names.
    """
    target_rows = []
    fields = source_data['schema']['fields']

    for source_row in source_data['rows']:
      target_row = {}
      ctr = 0
      source_values = source_row['f']

      for field in fields:
        field_name = field['name']
        field_value_dict = source_values[ctr]
        field_value = field_value_dict['v']

        target_row[field_name] = field_value
        ctr += 1

      target_rows.append(target_row)

    source_data['rows'] = target_rows

    return source_data

  @classmethod
  def GetRandomTableName(cls):
    """Returns a random table name, used for temp and test tables.

    Tests use temp tables to verify behavior of destructive/modifying
    operations, and large queries use them to store results as they are listed
    back to the user.  This method provides guaranteed-unique table names
    suitable for use in BigQuery.

    Returns:
      A unique string containing numbers, letters and underscores.
    """
    return str(uuid.uuid4()).replace('-', '_')

  @staticmethod
  def FormatQuery(select_args, from_args,
                  where_args=None, group_args=None, order_args=None,
                  row_limit=None):
    """Returns a formatted query string based on provided arguments.

    Args:
        select_args: A list of fields to select.
        from_args: A list of qualified table names.
        where_args: A list of where clauses.
        group_args: A list of group by fields.
        order_args: A list of order by clauses.
        row_limit: The max # of rows to return.

    Returns:
      A string containing a formatted query for Big Query.
    """
    query = []

    query.append('SELECT')
    select_args = ['\t' + select_arg for select_arg in select_args]
    query.append(',\n'.join(select_args))

    if len(from_args) == 1:
      query.append('FROM ' + from_args[0])
    else:
      query.append('FROM')
      from_args = ['\t' + from_arg for from_arg in from_args]
      query.append(',\n'.join(from_args))

    if where_args:
      query.append('WHERE')
      where_args = ['\t' + where_arg for where_arg in where_args]
      query.append(' AND\n'.join(where_args))

    if group_args:
      query.append('GROUP BY')
      group_args = ['\t' + group_arg for group_arg in group_args]
      query.append(',\n'.join(group_args))

    if order_args:
      query.append('ORDER BY')
      order_args = ['\t' + order_arg for order_arg in order_args]
      query.append(',\n'.join(order_args))

    if row_limit:
      query.append('LIMIT {}'.format(row_limit))

    return '\n'.join(query)

  @staticmethod
  def HasCache():
    """Returns false as the base client doesn't have a cache."""
    return False
