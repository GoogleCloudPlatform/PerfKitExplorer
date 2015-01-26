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

Unit tests for ExplorerQueryBase."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import pytest
import unittest

from perfkit import test_util

from perfkit.explorer.samples_mart import explorer_method


class ExplorerQueryTest(unittest.TestCase):
  """Tests event structure and storage of the ExploreMethod abstract class."""

  def setUp(self):
    test_util.SetConfigPaths()
    self._setUpConstants()

  @pytest.mark.explorer
  def testExecuteWithResult(self):
    """Verifies that the data_client's result is transformed and returned."""
    self.maxDiff = 1024

    data_client = test_util.GetDataClient(mocked=True)
    data_client.mock_reply = self.EXPECTED_RESULT.copy()
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=self.EXPECTED_DATASET)

    method.tables = [self.EXPECTED_TABLE_NAME]
    method.fields = self.EXPECTED_FIELDS
    actual = method.Execute()
    expected = self.EXPECTED_PROCESSED_RESULT

    self.assertEqual(actual, expected)

  @pytest.mark.explorer
  def testExecuteRequiredOnly(self):
    """Tests execution of a method specifying only required parameters."""
    data_client = test_util.GetDataClient(mocked=True)
    data_client.mock_reply = self.EXPECTED_RESULT.copy()
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=self.EXPECTED_DATASET)

    method.tables = [self.EXPECTED_TABLE_NAME]
    method.fields = self.EXPECTED_FIELDS

    expected_sql = (self.EXPECTED_SQL_BASE +
                    self.EXPECTED_SQL_LIMIT)
    actual_sql = method.GetSql()

    self.assertEqual(actual_sql, expected_sql)

  @pytest.mark.explorer
  def testExecuteAllOptions(self):
    """Tests execution of a method with filters, groups and order specified."""
    data_client = test_util.GetDataClient(mocked=True)
    data_client.mock_reply = self.EXPECTED_RESULT.copy()
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=self.EXPECTED_DATASET)

    method.tables = [self.EXPECTED_TABLE_NAME]
    method.fields = self.EXPECTED_FIELDS
    method.orders = self.EXPECTED_ORDERS
    method.wheres = self.EXPECTED_WHERES
    method.groups = self.EXPECTED_GROUPS

    actual = method.Execute()
    expected = self.EXPECTED_PROCESSED_RESULT

    self.assertEqual(actual, expected)
    self.assertEqual(actual['schema'], expected['schema'])
    self.assertEqual(actual['rows'], expected['rows'])

    expected_sql = (self.EXPECTED_SQL_BASE +
                    self.EXPECTED_SQL_WHERE +
                    self.EXPECTED_SQL_GROUP_BY +
                    self.EXPECTED_SQL_ORDER_BY +
                    self.EXPECTED_SQL_LIMIT)
    actual_sql = method.GetSql()

    self.assertEqual(actual_sql, expected_sql)

  @pytest.mark.explorer
  def testExecuteNoFields(self):
    """Tests execution of a method without specifying fields."""
    data_client = test_util.GetDataClient(mocked=True)
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=self.EXPECTED_DATASET)

    method.tables = [self.EXPECTED_TABLE_NAME]
    self.assertRaisesRegexp(
        explorer_method.ArgumentError,
        'The \'fields\' list is required.',
        method.Execute)

  def _setUpConstants(self):
    self.EXPECTED_RESULT = {
        'jobReference': None,
        'totalRows': 2,
        'schema': {'fields': [{'name': 'field1', 'type': 'STRING'},
                              {'name': 'field2', 'type': 'INTEGER'},
                              {'name': 'alias3', 'type': 'FLOAT'},
                              {'name': 'alias4', 'type': 'BOOLEAN'}]},
        'rows': [{'f': [{'v': 'value1-1'},
                        {'v': '3560000000'},
                        {'v': '52.6'},
                        {'v': 'True'}]},
                 {'f': [{'v': 'value2-1'},
                        {'v': '22'},
                        {'v': '15.5234'},
                        {'v': 'False'}]}]}

    self.EXPECTED_PROCESSED_RESULT = {
        'jobReference': None,
        'totalRows': 2,
        'schema': {'fields': [{'name': 'field1', 'type': 'STRING'},
                              {'name': 'field2', 'type': 'INTEGER'},
                              {'name': 'alias3', 'type': 'FLOAT'},
                              {'name': 'alias4', 'type': 'BOOLEAN'}]},
        'rows': [{'field1': 'value1-1',
                  'field2': 3560000000,
                  'alias3': 52.6,
                  'alias4': True},
                 {'field1': 'value2-1',
                  'field2': 22,
                  'alias3': 15.5234,
                  'alias4': False}]}

    self.EXPECTED_FIELDS = ['field1',
                            'field2',
                            'field3 AS alias3']

    self.EXPECTED_DATASET = 'dataset1'

    self.EXPECTED_TABLE_NAME = 'table1'
    self.EXPECTED_TABLES = ['dataset1.table1']

    self.EXPECTED_WHERES = ['field4 = \'string-value\'']

    self.EXPECTED_GROUPS = ['field1',
                            'field2']

    self.EXPECTED_ORDERS = ['alias3',
                            'field2',
                            'field1']


    self.EXPECTED_SQL_BASE = (
        'SELECT\n\tfield1,\n\tfield2,\n\tfield3 AS alias3\n'
        'FROM dataset1.table1\n')

    self.EXPECTED_SQL_LIMIT = 'LIMIT 2000'

    self.EXPECTED_SQL_WHERE = 'WHERE\n\tfield4 = \'string-value\'\n'

    self.EXPECTED_SQL_GROUP_BY = 'GROUP BY\n\tfield1,\n\tfield2\n'

    self.EXPECTED_SQL_ORDER_BY = 'ORDER BY\n\talias3,\n\tfield2,\n\tfield1\n'

if __name__ == '__main__':
  unittest.main()
