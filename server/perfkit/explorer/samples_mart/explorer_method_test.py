"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Unit tests for ExplorerQueryBase."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import pytest
import unittest

import explorer_method
import test_util


EXPECTED_RESULT = {
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

EXPECTED_PROCESSED_RESULT = {
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

EXPECTED_FIELDS = ['field1',
                   'field2',
                   'field3 AS alias3']

EXPECTED_DATASET = 'dataset1'

EXPECTED_TABLE_NAME = 'table1'
EXPECTED_TABLES = ['dataset1.table1']

EXPECTED_WHERES = ['field4 = \'string-value\'']

EXPECTED_GROUPS = ['field1',
                   'field2']

EXPECTED_ORDERS = ['alias3',
                   'field2',
                   'field1']

EXPECTED_SQL_BASE = (
    'SELECT\n\tfield1,\n\tfield2,\n\tfield3 AS alias3\n'
    'FROM dataset1.table1\n')

EXPECTED_SQL_LIMIT = 'LIMIT 2000'

EXPECTED_SQL_WHERE = 'WHERE\n\tfield4 = \'string-value\'\n'

EXPECTED_SQL_GROUP_BY = 'GROUP BY\n\tfield1,\n\tfield2\n'

EXPECTED_SQL_ORDER_BY = 'ORDER BY\n\talias3,\n\tfield2,\n\tfield1\n'


class ExplorerQueryTest(unittest.TestCase):
  """Tests event structure and storage of the ExploreMethod abstract class."""

  @pytest.mark.explorer
  def testExecuteWithResult(self):
    """Verifies that the data_client's result is transformed and returned."""
    self.maxDiff = 1024
    data_client = test_util.GetDataClient(mocked=True)
    data_client.mock_reply = EXPECTED_RESULT.copy()
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=EXPECTED_DATASET)

    method.tables = [EXPECTED_TABLE_NAME]
    method.fields = EXPECTED_FIELDS
    actual = method.Execute()
    expected = EXPECTED_PROCESSED_RESULT

    self.assertEqual(actual, expected)

  @pytest.mark.explorer
  def testExecuteRequiredOnly(self):
    """Tests execution of a method specifying only required parameters."""
    data_client = test_util.GetDataClient(mocked=True)
    data_client.mock_reply = EXPECTED_RESULT.copy()
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=EXPECTED_DATASET)

    method.tables = [EXPECTED_TABLE_NAME]
    method.fields = EXPECTED_FIELDS

    expected_sql = (EXPECTED_SQL_BASE +
                    EXPECTED_SQL_LIMIT)
    actual_sql = method.GetSql()

    self.assertEqual(actual_sql, expected_sql)

  @pytest.mark.explorer
  def testExecuteAllOptions(self):
    """Tests execution of a method with filters, groups and order specified."""
    data_client = test_util.GetDataClient(mocked=True)
    data_client.mock_reply = EXPECTED_RESULT.copy()
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=EXPECTED_DATASET)

    method.tables = [EXPECTED_TABLE_NAME]
    method.fields = EXPECTED_FIELDS
    method.orders = EXPECTED_ORDERS
    method.wheres = EXPECTED_WHERES
    method.groups = EXPECTED_GROUPS

    actual = method.Execute()
    expected = EXPECTED_PROCESSED_RESULT

    self.assertEqual(actual, expected)
    self.assertEqual(actual['schema'], expected['schema'])
    self.assertEqual(actual['rows'], expected['rows'])

    expected_sql = (EXPECTED_SQL_BASE +
                    EXPECTED_SQL_WHERE +
                    EXPECTED_SQL_GROUP_BY +
                    EXPECTED_SQL_ORDER_BY +
                    EXPECTED_SQL_LIMIT)
    actual_sql = method.GetSql()

    self.assertEqual(actual_sql, expected_sql)

  @pytest.mark.explorer
  def testExecuteNoFields(self):
    """Tests execution of a method without specifying fields."""
    data_client = test_util.GetDataClient(mocked=True)
    method = explorer_method.ExplorerQueryBase(
        data_client=data_client,
        dataset_name=EXPECTED_DATASET)

    method.tables = [EXPECTED_TABLE_NAME]
    self.assertRaisesRegexp(
        explorer_method.ArgumentError,
        'The \'fields\' list is required.',
        method.Execute)


if __name__ == '__main__':
  unittest.main()
