"""Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Base class for Perfkit Explorer-related queries.

ExplorerQueryBase provides Explorer queries with a behavioral model
of constructing SQL, executing a query, reformatting the BQ results,
and optionally processing the dataset for calculated or additional data.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import logging

from perfkit.common import big_query_client
from perfkit.common import big_query_result_util as result_util
from perfkit.common import datetime_util


DEFAULT_MAX_ROWS = 2000
SEPARATOR_WITH_INDENT = ',\n  '


class Error(Exception):
  pass


class ArgumentError(Error):
  pass


class ExplorerQueryBase(object):
  """Base class for an Explorer query.  See docstring for more."""
  # TODO: Update implementing classes to be data-driven configuration
  #              rather than hard-coded modules.

  def __init__(self, data_client=None, project_name=None, dataset_name=None):
    """Create credentials and storage service.

    If a data_client is not provided, a credential_file will be used to get
    a data connection.

    Args:
      data_client: A class that provides data connectivity.  Typically a
          BigQueryClient instance or specialization.
      project_name: The name of the BigQuery project that contains the results.
      dataset_name: The name of the BigQuery dataset that contains the results.
    """
    self._data_client = data_client
    self.project_name = project_name
    self.dataset_name = dataset_name or big_query_client.DATASET_ID

    self._Initialize()

  @property
  def data_client(self):
    """Returns the class that provides data connectivity."""
    return self._data_client

  def _TransformRowsToTemplate(self, reply):
    """Converts the rows data to a template-friendly format.

    Args:
      reply: The BigQuery reply that will be processed.  The 'rows' list will
          be replaced with a reformatted list.
    """
    reply['rows'] = result_util.ReplyFormatter.RowsToTemplateFormat(reply=reply)

  def _Initialize(self):
    """Initializes the default behavior of the query."""
    self.max_rows = DEFAULT_MAX_ROWS
    self.tables = []
    self.fields = []
    self.groups = []
    self.wheres = []
    self.orders = []
    self.reply_processors = [self._TransformRowsToTemplate]

  def Execute(self):
    """Return a list of metrics for review.

    Raises:
      ArgumentError: Raised when the fields or tables are not defined.

    Returns:
      A BigQuery result.
    """
    if not self.fields:
      raise ArgumentError('The \'fields\' list is required.')

    if not self.tables:
      raise ArgumentError('The \'tables\' list is required.')

    sql = self.GetSql()
    reply = self._data_client.Query(query=sql, project_id=self.project_name)
    for processor in self.reply_processors:
      processor(reply=reply)

    return reply

  @staticmethod
  def GetTimestampFromFilterExpression(date_filter, last_second=False):
    """Returns a TIMESTAMP-returning expression based on a date filter.

    Args:
      date_filter: A date filter clause, containing a type and value.
      last_second: Determines whether to use the first or last second of a
          day.  This is used to calculate end dates inclusive of all timestamps
          within them.

    Returns:
      A BQSQL expression representing the appropriate filter.
    """
    # TODO: Improve support for 'higher level' expressions like last
    # quarter, last week, current quarter, etc.
    if date_filter['filter_type'] == 'CUSTOM':
      if 'specify_time' in date_filter and date_filter['specify_time']:
        date = datetime_util.StringToDateTime(date_filter['text'])
      elif last_second:
        date = datetime_util.StringToLastSecond(date_filter['text'])
      else:
        date = datetime_util.StringToFirstSecond(date_filter['text'])

      date_bqstring = date.strftime('%Y-%m-%d %X.%f %z').strip()
      logging.error(date_bqstring)
      return 'TIMESTAMP(\'{date:}\')'.format(date=date_bqstring)
    else:
      return 'DATE_ADD(CURRENT_TIMESTAMP(), -{interval:}, \'{unit:}\')'.format(
          interval=date_filter['filter_value'],
          unit=date_filter['filter_type'])

  def GetSql(self):
    """Creates a SQL statement from the current config and parameters.

    Returns:
      A BigQuery SQL statement.
    """
    qualified_tables = []
    for table in self.tables:
      # If the table name contains a ., ignore the dataset_name
      if '.' in table:
        qualified_tables.append(table)
      else:
        qualified_tables.append('{dataset}.{table}'.format(
            dataset=self.dataset_name,
            table=table))

    return big_query_client.BigQueryClient.FormatQuery(
        select_args=self.fields,
        from_args=qualified_tables,
        where_args=self.wheres,
        group_args=self.groups,
        order_args=self.orders,
        row_limit=self.max_rows)
