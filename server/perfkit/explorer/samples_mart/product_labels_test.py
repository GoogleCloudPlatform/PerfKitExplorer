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

Unit tests for the ProductLabelsQuery class."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import unittest

from .. import big_query_client
import product_labels
import test_util

EXPECTED_DATA = [
    {'name': u'attributes', 'count': 6,
     'values': [{'count': 3, 'name': u'important'},
                {'count': 3, 'name': u'interesting'}]},
    {'name': u'perfect', 'count': 5, 'values': []},
    {'name': u'shape', 'count': 18,
     'values': [{'count': 13, 'name': u'circle'},
                {'count': 5, 'name': u'square'}]},
    {'name': u'size', 'count': 15,
     'values': [{'count': 10, 'name': u'large'},
                {'count': 5, 'name': u'small'}]}]


class ProductLabelsQueryTest(unittest.TestCase):

  def setUp(self):
    big_query_client.DATASET_ID = 'samples_mart_testdata'
    self.data_client = test_util.GetDataClient(mocked=True)
    self.data_client.mock_reply = {'totalRows': 0,
                                   'jobReference': 0,
                                   'schema': {'fields': []}}

  def testExecuteAllFilters(self):
    labels = product_labels.ProductLabelsQuery(data_client=self.data_client)
    labels.Execute(
        start_date={'filter_type': 'CUSTOM', 'filter_value': '2013-01-04',
                    'text': '2013-01-04'},
        end_date={'filter_type': 'CUSTOM', 'filter_value': '2013-01-10',
                  'text': '2013-01-10'},
        product_name='widget-factory',
        test='create-widgets',
        metric='final-weight')

    expected_sql = (
        'SELECT\n'
        '\tlabel,\n'
        '\tvalue,\n'
        '\tSUM(count) AS count\n'
        'FROM samples_mart_testdata.metadata_cube\n'
        'WHERE\n'
        '\tday_timestamp >= TIMESTAMP(\'2013-01-04 00:00:00.000000\') AND\n'
        '\tday_timestamp <= TIMESTAMP(\'2013-01-10 23:59:59.999999\') AND\n'
        '\tproduct_name = "widget-factory" AND\n'
        '\ttest = "create-widgets" AND\n'
        '\tmetric = "final-weight"\n'
        'GROUP BY\n'
        '\tlabel,\n'
        '\tvalue\n'
        'ORDER BY\n'
        '\tlabel,\n'
        '\tvalue\n'
        'LIMIT 2000')
    self.assertEqual(labels.GetSql(), expected_sql)

  def testExecuteNoFilters(self):
    labels = product_labels.ProductLabelsQuery(data_client=self.data_client)
    labels.Execute()

    expected_sql = ('SELECT\n'
                    '\tlabel,\n'
                    '\tvalue,\n'
                    '\tSUM(count) AS count\n'
                    'FROM samples_mart_testdata.metadata_cube\n'
                    'GROUP BY\n'
                    '\tlabel,\n'
                    '\tvalue\n'
                    'ORDER BY\n'
                    '\tlabel,\n'
                    '\tvalue\n'
                    'LIMIT 2000')
    self.assertEqual(labels.GetSql(), expected_sql)

  def testExecuteProductOnly(self):
    labels = product_labels.ProductLabelsQuery(data_client=self.data_client)
    labels.Execute(product_name='widget-factory')

    expected_sql = ('SELECT\n'
                    '\tlabel,\n'
                    '\tvalue,\n'
                    '\tSUM(count) AS count\n'
                    'FROM samples_mart_testdata.metadata_cube\n'
                    'WHERE\n'
                    '\tproduct_name = "widget-factory"\n'
                    'GROUP BY\n'
                    '\tlabel,\n'
                    '\tvalue\n'
                    'ORDER BY\n'
                    '\tlabel,\n'
                    '\tvalue\n'
                    'LIMIT 2000')
    self.assertEqual(labels.GetSql(), expected_sql)


if __name__ == '__main__':
  unittest.main()
