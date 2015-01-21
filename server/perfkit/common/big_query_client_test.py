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

Unit test for big_query_client_test.

Temp tables from tests are created in the dataset specified by TEMP_DATASET_ID,
by default 'samples_mart_temp'.  They are expected to be cleaned up, either
during the test, or in the tearDown.  If samples_mart_temp is filling up with
tables, this may be indicative of customer-facing service failures.  If tests
are not running, you can use the BQ UI to delete and re-create the dataset.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import hashlib
import logging
import random
import time
import unittest

from apiclient.errors import HttpError
import httplib2
import mox
import pytest

from perfkit import test_util
from perfkit.common import big_query_client
from perfkit.common import credentials_lib
from perfkit.common import data_source_config


TEMP_DATASET_ID = big_query_client.TEMP_DATASET_ID


def BuildHttpError(status):
  """Build a HttpError with the specified failure status."""
  response = httplib2.Response(
      {'status': status, 'content-type': 'application/json'})
  return HttpError(response, '{}')


class MockRequest(object):
  """Mock request, used to test _ExecuteRequestWithRetries."""

  def __init__(self):
    self.request_count = 0
    self.errors = []

  # Override default execute() behavior.  If an error is on the stack, pop and
  # raise it.
  def execute(self):
    self.request_count += 1
    if self.errors:
      raise self.errors.pop()


class BigQueryClientTest(unittest.TestCase):

  def setUp(self):
    self.mox = mox.Mox()

    test_util.SetConfigPaths()

    self.client = big_query_client.BigQueryClient(
        credentials_lib.DEFAULT_CREDENTIALS,
        data_source_config.Environments.TESTING)

    self.temp_tables = set()

  def tearDown(self):
    self.mox.UnsetStubs()

    # For now, if any tables were left around due to failed tests, delete them.
    # If these tables turn out to be useful for debugging purposes, this
    # may be updated to move them to a different dataset.
    for table_ref in self.temp_tables:
      dataset_name = table_ref[0]
      table_name = table_ref[1]

      logging.error('Unexpected temp table remaining at test end: %s.%s',
                    dataset_name, table_name)
      self.client.DeleteTable(dataset_name=dataset_name, table_name=table_name)

  # TODO: Move to a utility class for managing and deleting temp tables.
  def AddTempTableRef(self):
    """Adds a reference to a temp table to a tracking dictionary.

    This is used to maintain a list of tables created during testing, so that
    they can be cleaned up at the end of the run in the event of a test failure.
    TEMP_DATASET_ID will be used as the dataset.

    Returns:
      A string that is a unique name for a table.
    """
    table_name = self.client.GetRandomTableName()
    # table_name should be guaranteed random.
    self.assertFalse((TEMP_DATASET_ID, table_name) in self.temp_tables)
    self.temp_tables.add((TEMP_DATASET_ID, table_name))

    return table_name

  # TODO: Move to a utility class for managing and deleting temp tables.
  def RemoveTempTableRef(self, table_name):
    """Removes a reference from a temp table from the tracking dictionary.

    This method should be called when a test has verified or expects that the
    temp table has been cleaned up.  It verifies that the referenced table
    was recorded in the first place (via AddTempTableRef()), and that it does
    not exist in BigQuery.  If either of these conditions fails, it is an
    indicator of a test or product issue.  Temp tables are expected to be
    stored in the dataset specified by TEMP_DATASET_ID.

    Args:
      table_name: The name of the temp table to delete.
    """
    self.assertTrue((TEMP_DATASET_ID, table_name) in self.temp_tables)
    self.assertFalse(
        self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                table_name=table_name),
        'Expected table {dataset}.{table} to be deleted.  Table found.'.format(
            dataset=TEMP_DATASET_ID,
            table=table_name))
    self.temp_tables.discard((TEMP_DATASET_ID, table_name))

  @pytest.mark.integration
  def testQuery(self):
    query = ('SELECT number, letter, symbol '
             'FROM unit_test_data.query_test '
             'WHERE number <> 1')
    rows = self.client.Query(query, max_results_per_page=100)['rows']
    expected_rows = [{u'f': [{u'v': 2}, {u'v': u'b'}, {u'v': u'@'}]},
                     {u'f': [{u'v': 3}, {u'v': u'c'}, {u'v': u'#'}]}]
    self.assertEquals(expected_rows, rows)

  @pytest.mark.integration
  def testQueryMultiPage(self):
    query = ('SELECT number, letter, symbol '
             'FROM unit_test_data.query_test '
             'WHERE number <> 1')
    rows = self.client.Query(query, max_results_per_page=1)['rows']
    expected_rows = [{u'f': [{u'v': 2}, {u'v': u'b'}, {u'v': u'@'}]},
                     {u'f': [{u'v': 3}, {u'v': u'c'}, {u'v': u'#'}]}]
    self.assertEquals(expected_rows, rows)

  @pytest.mark.integration
  def testCopyTable(self):
    table_name = self.AddTempTableRef()

    self.client.CopyTable(source_dataset='unit_test_data',
                          source_table='query_test',
                          destination_dataset=TEMP_DATASET_ID,
                          destination_table=table_name)

    def _CallbackHandler(reply):
      rows = reply['rows']
      expected_rows = [{u'f': [{u'v': '1'}, {u'v': u'a'}, {u'v': u'!'}]},
                       {u'f': [{u'v': '2'}, {u'v': u'b'}, {u'v': u'@'}]},
                       {u'f': [{u'v': '3'}, {u'v': u'c'}, {u'v': u'#'}]}]
      self.assertEquals(expected_rows, rows)

    self.client.ListTableData(dataset_name=TEMP_DATASET_ID,
                              table_name=table_name,
                              page_callback=_CallbackHandler)

    self.client.DeleteTable(dataset_name=TEMP_DATASET_ID,
                            table_name=table_name)
    time.sleep(30)

    self.RemoveTempTableRef(table_name=table_name)

  @pytest.mark.integration
  def testCopyTableMissingSource(self):
    destination_table = self.client.GetRandomTableName()
    source_table = self.client.GetRandomTableName()

    self.assertFalse(
        self.client.TableExists(dataset_name='unit_test_data',
                                table_name=source_table),
        'The source table was found, and should not exist for this test.')

    self.assertRaises(
        big_query_client.NoTableError,
        self.client.CopyTable,
        source_dataset='unit_test_data',
        source_table=source_table,
        destination_dataset=TEMP_DATASET_ID,
        destination_table=destination_table)

  @pytest.mark.integration
  def testDeleteTable(self):
    table_name = self.AddTempTableRef()

    # Initially, the table should not exist.
    self.assertFalse(self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                             table_name=table_name))

    # Delete should gracefully return false in this case.
    self.assertFalse(self.client.DeleteTable(dataset_name=TEMP_DATASET_ID,
                                             table_name=table_name))

    # Make a copy of the results table, and store it as the target table.
    self.client.CopyTable(source_table='results',
                          source_dataset='samples_mart_testdata',
                          destination_table=table_name,
                          destination_dataset=TEMP_DATASET_ID)

    # Delete the table.
    self.assertTrue(self.client.DeleteTable(dataset_name=TEMP_DATASET_ID,
                                            table_name=table_name))

    self.assertFalse(self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                             table_name=table_name))

    self.RemoveTempTableRef(table_name)

  @pytest.mark.integration
  def testTableExists(self):
    table_name = self.AddTempTableRef()

    # Initially, the table should not exist.
    self.assertFalse(self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                             table_name=table_name))

    # Make a copy of the results table, and store it as the target table.
    self.client.CopyTable(source_table='results',
                          source_dataset='samples_mart_testdata',
                          destination_table=table_name,
                          destination_dataset=TEMP_DATASET_ID)

    # Verify the table exists.
    self.assertTrue(self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                            table_name=table_name))

    # Delete the table.
    self.client.DeleteTable(dataset_name=TEMP_DATASET_ID,
                            table_name=table_name)

    # Verify the table no longer exists.
    self.assertFalse(self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                             table_name=table_name))

  @pytest.mark.integration
  def testListTableData(self):
    def VerifyListTable(reply):
      self.assertEquals(len(reply['rows']), 3)
      # Verify the first and last row/column values.
      self.assertEquals(reply['rows'][0]['f'][0]['v'], '1')
      self.assertEquals(reply['rows'][2]['f'][2]['v'], '#')

    self.client.ListTableData(dataset_name='unit_test_data',
                              table_name='query_test',
                              page_callback=VerifyListTable)

  @pytest.mark.integration
  def testListTableDataMultiPage(self):
    self.page_counter = 0

    def VerifyListTable(reply):
      expected_reply_rows = [
          [{u'f': [{u'v': '1'}, {u'v': u'a'}, {u'v': u'!'}]},
           {u'f': [{u'v': '2'}, {u'v': u'b'}, {u'v': u'@'}]}],
          [{u'f': [{u'v': '3'}, {u'v': u'c'}, {u'v': u'#'}]}]]

      self.assertTrue(self.page_counter <= len(expected_reply_rows),
                      'Extra pages encountered.')

      expected_rows = expected_reply_rows[self.page_counter]
      self.page_counter += 1

      self.assertEquals(expected_rows, reply['rows'])

    self.client.ListTableData(dataset_name='unit_test_data',
                              table_name='query_test',
                              page_callback=VerifyListTable,
                              max_results_per_page=2)

    self.assertEquals(self.page_counter, 2)

  @pytest.mark.integration
  def testQueryLargeResults(self):
    def _CallbackHandler(reply):
      self.assertEquals(len(reply['rows']), 2)
      # Verify the first and last row/column values.
      self.assertEquals(reply['rows'][0]['f'][0]['v'], '2')
      self.assertEquals(reply['rows'][-1]['f'][-1]['v'], '#')

    query = ('SELECT number, letter, symbol '
             'FROM unit_test_data.query_test '
             'WHERE number <> 1')
    self.client.QueryLargeResults(query=query,
                                  page_callback=_CallbackHandler)

  @pytest.mark.integration
  def testQueryLargeResultsExplicitTable(self):
    """Verifies that the BigQuery works with a specific table name.

    This also verifies that the table is cleaned up after the query is done.
    """
    query = ('SELECT number, letter, symbol '
             'FROM unit_test_data.query_test')
    temp_table_name = self.AddTempTableRef()

    self.assertFalse(self.client.TableExists(
        dataset_name=TEMP_DATASET_ID,
        table_name=temp_table_name))

    def _CallbackHandler(unused_reply):
      # Assert to suppress unused parameter lint warning.
      self.assertIsNotNone(unused_reply)

      # Verify that the temp table exists.
      self.assertTrue(self.client.TableExists(
          dataset_name=TEMP_DATASET_ID,
          table_name=temp_table_name))

    self.client.QueryLargeResults(query=query,
                                  page_callback=_CallbackHandler,
                                  temp_dataset_name=TEMP_DATASET_ID,
                                  temp_table_name=temp_table_name)

    self.assertFalse(self.client.TableExists(dataset_name=TEMP_DATASET_ID,
                                             table_name=temp_table_name))

    self.RemoveTempTableRef(table_name=temp_table_name)

  @pytest.mark.integration
  def testQueryInto(self):
    query = 'SELECT number, letter, symbol FROM unit_test_data.query_test'
    table_name = self.AddTempTableRef()

    self.client.QueryInto(query,
                          destination_dataset=TEMP_DATASET_ID,
                          destination_table=table_name,
                          write_disposition='WRITE_TRUNCATE')

    def _CallbackHandler(reply):
      rows = reply['rows']
      expected_rows = [{u'f': [{u'v': '1'}, {u'v': u'a'}, {u'v': u'!'}]},
                       {u'f': [{u'v': '2'}, {u'v': u'b'}, {u'v': u'@'}]},
                       {u'f': [{u'v': '3'}, {u'v': u'c'}, {u'v': u'#'}]}]
      self.assertEquals(expected_rows, rows)

    self.client.ListTableData(dataset_name=TEMP_DATASET_ID,
                              table_name=table_name,
                              page_callback=_CallbackHandler)

    self.client.DeleteTable(dataset_name=TEMP_DATASET_ID,
                            table_name=table_name)

    self.RemoveTempTableRef(table_name=table_name)

  @pytest.mark.query
  def testSampleQueryResultsMaxErrors(self):
    query_results = {'totalRows': 50, 'rows': [0] * 100}
    self.assertRaises(big_query_client.SamplingError,
                      self.client.SampleQueryResultsMax, query_results, 50)

    query_results = {'totalRows': 100, 'rows': [0] * 100}
    self.assertRaises(big_query_client.SamplingError,
                      self.client.SampleQueryResultsMax, query_results, -1)
    self.assertRaises(big_query_client.SamplingError,
                      self.client.SampleQueryResultsMax, query_results, 200)

  @pytest.mark.query
  def testSampleQueryResultsMaxBelow(self):
    query_results = {'totalRows': 5, 'rows': range(5)}
    sampled_results = self.client.SampleQueryResultsMax(query_results, 5)

    self.assertEquals(query_results, sampled_results)

  @pytest.mark.query
  def testSampleQueryResultsMax(self):
    self.mox.StubOutWithMock(random, 'sample')

    query_results = {'totalRows': 5, 'rows': range(5)}
    random.sample(query_results['rows'], 3).AndReturn([1, 3, 4])

    self.mox.ReplayAll()

    results = self.client.SampleQueryResultsMax(query_results, 3)

    self.mox.VerifyAll()

    self.assertEquals({'totalRows': 3, 'rows': [1, 3, 4]}, results)

  @pytest.mark.query
  def testSampleQueryResultsMaxCount(self):
    query_results = {'totalRows': 100, 'rows': range(100)}

    results = self.client.SampleQueryResultsMax(query_results, 10)

    self.assertEquals(10, len(results['rows']))
    self.assertEquals(10, results['totalRows'])

  @pytest.mark.query
  def testSampleQueryResultsMaxRepeatable(self):
    query_results = {'totalRows': 100, 'rows': range(100)}

    first_results = self.client.SampleQueryResultsMax(query_results, 10)
    second_results = self.client.SampleQueryResultsMax(query_results, 10)

    self.assertEquals(first_results, second_results)

  @pytest.mark.query
  def testSampleQueryResultsFractionErrors(self):
    query_results = {'totalRows': 100, 'rows': [0] * 100}
    self.assertRaises(big_query_client.SamplingError,
                      self.client.SampleQueryResultsFraction, query_results,
                      1.1)
    self.assertRaises(big_query_client.SamplingError,
                      self.client.SampleQueryResultsFraction, query_results,
                      -1)

  @pytest.mark.query
  def testSampleQueryResultsFraction(self):
    self.mox.StubOutWithMock(big_query_client.BigQueryClient,
                             'SampleQueryResultsMax')

    query_results = {'totalRows': 5, 'rows': range(5)}
    expected_results = {'totalRows': 2, 'rows': [2, 3]}
    big_query_client.BigQueryClient.SampleQueryResultsMax(
        query_results, 3).AndReturn(expected_results)

    self.mox.ReplayAll()

    results = self.client.SampleQueryResultsFraction(query_results, .6)

    self.mox.VerifyAll()

    self.assertEquals(expected_results, results)

  @pytest.mark.jobs
  def testBuildJobId(self):
    files = ['gs://perfkit_test_data/0000000099995',
             'gs://perfkit_test_data/0000000099996',
             'gs://perfkit_test_data/0000000099997']
    hasher = hashlib.sha1()
    hasher.update(''.join(files))
    hashed_file_names = hasher.hexdigest()
    expected_id = ('load_job_0_0_gs-perfkit_test_data-0000000099995_'
                   'gs-perfkit_test_data-0000000099997_' + hashed_file_names)
    actual_id = big_query_client.BigQueryClient.BuildJobIdString(files, 0, 0)
    self.assertEquals(expected_id, actual_id)

    files = ['gs://perfkit_test_data/0000000099995']
    hasher = hashlib.sha1()
    hasher.update(''.join(files))
    hashed_file_names = hasher.hexdigest()
    expected_id = ('load_job_2_3_gs-perfkit_test_data-0000000099995_'
                   'gs-perfkit_test_data-0000000099995_' + hashed_file_names)
    actual_id = big_query_client.BigQueryClient.BuildJobIdString(files, 2, 3)
    self.assertEquals(expected_id, actual_id)

  @pytest.mark.formatting
  def testFormatDataForTemplates(self):
    source_data = {
        'schema': {
            'fields': [{'name': 'col1'},
                       {'name': 'col2'}]},
        'rows': [{'f': [{'v': 'foo'},
                        {'v': 'bar'}]}]}

    expected_data = {
        'schema': {
            'fields': [{'name': 'col1'},
                       {'name': 'col2'}]},
        'rows': [{'col1': 'foo', 'col2': 'bar'}]}

    big_query_client.BigQueryClient.FormatDataForTemplates(source_data)

    self.assertEqual(source_data, expected_data)

  @pytest.mark.integration
  def testGetByJobId(self):
    job = self.client.GetJobByID('job_95d2c143954e4975a7c9c0731203a91a')
    self.assertEquals('1354925437485', job['statistics']['endTime'])

  @pytest.mark.execute
  def testExecuteRequestWithRetriesPass(self):
    request = MockRequest()

    self.client._ExecuteRequestWithRetries(request, num_tries=1)
    self.assertEquals(1, request.request_count)

  @pytest.mark.execute
  def testExecuteRequestWithRetriesPassAfterRetry(self):
    request = MockRequest()

    request.errors = [HttpError(
        {'status': big_query_client.BigQueryClient.RETRYABLE_ERRORS[0]},
        'message')]

    self.client._ExecuteRequestWithRetries(request, num_tries=2)
    self.assertEquals(2, request.request_count)

  @pytest.mark.execute
  def testExecuteRequestWithRetriesErrorAndNoRetries(self):
    request = MockRequest()

    request.errors = [HttpError(
        {'status': big_query_client.BigQueryClient.RETRYABLE_ERRORS[0]},
        'message')]

    self.assertRaises(
        HttpError, self.client._ExecuteRequestWithRetries, request,
        num_tries=1)

  @pytest.mark.execute
  def testExecuteRequestWithRetriesNonRetryableError(self):
    request = MockRequest()

    request.errors = [HttpError({'status': 999}, 'message')]

    self.assertRaises(
        HttpError, self.client._ExecuteRequestWithRetries, request,
        num_tries=2)

  @pytest.mark.formatting
  def testFormatQueryAllOptionalArgs(self):
    select_args = ['test', 'metric as other_thing']
    from_args = ['samples_mart.results']
    where_args = ['target<>""', 'owner="jeffsl"']
    group_args = ['test', 'other_thing']
    order_args = ['test', 'other_sort']
    row_limit = 1000

    expected_query = (
        'SELECT\n\ttest,\n\tmetric as other_thing\n'
        'FROM samples_mart.results\n'
        'WHERE\n\ttarget<>"" AND\n\towner="jeffsl"\n'
        'GROUP BY\n\ttest,\n\tother_thing\n'
        'ORDER BY\n\ttest,\n\tother_sort\n'
        'LIMIT 1000')

    query = big_query_client.BigQueryClient.FormatQuery(
        select_args=select_args,
        from_args=from_args,
        where_args=where_args,
        group_args=group_args,
        order_args=order_args,
        row_limit=row_limit)

    self.assertEquals(expected_query, query)

  @pytest.mark.formatting
  def testFormatQueryNoOptionalArgs(self):
    select_args = ['test', 'metric as other_thing']
    from_args = ['samples_mart.results']

    expected_query = (
        'SELECT\n\ttest,\n\tmetric as other_thing\n'
        'FROM samples_mart.results')

    query = big_query_client.BigQueryClient.FormatQuery(select_args, from_args)

    self.assertEquals(expected_query, query)


if __name__ == '__main__':
  unittest.main()
