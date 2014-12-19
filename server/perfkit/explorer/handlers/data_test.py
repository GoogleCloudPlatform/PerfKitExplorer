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

Tests for data handlers in the Perfkit Explorer application."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import json
import pytest
import webtest
import unittest

from perfkit import test_util
from perfkit.common import big_query_client
from perfkit.common import credentials_lib
from perfkit.common import data_source_config as config
from perfkit.explorer.handlers import base
from perfkit.explorer.handlers import data


# TODO: Change tests to verify generated SQL rather than results to remove
#     live service dependency.
# TODO: Add fuzz/null testing for required parameters. (low pri)
class DataTest(unittest.TestCase):

  def setUp(self):
    super(DataTest, self).setUp()

    data.DATASET_NAME = 'samples_mart_mockdata'
    base.DEFAULT_ENVIRONMENT = config.Environments.TESTING

    self.app = webtest.TestApp(data.app)

    test_util.SetConfigPaths()

    # Rewrite the DataHandlerUtil methods to return local clients.
    data.DataHandlerUtil.GetDataClient = self._GetTestDataClient

  def _GetTestDataClient(self, env=None):
    return big_query_client.BigQueryClient(
        env=config.Environments.TESTING,
        credential_file=credentials_lib.DEFAULT_CREDENTIALS)

  def testFieldsHandler(self):
    expected_result = [{u'name': u'jdoe'}]

    filters = {'start_date': None,
               'end_date': None,
               'product_name': 'widget-factory',
               'test': 'create-widgets',
               'metric': None}
    resp = self.app.get(url='/data/fields',
                        params=[('filters', json.dumps(filters)),
                                ('field_name', 'owner')])

    self.assertEqual(resp.json['rows'], expected_result)

  def testAllMetdataHandler(self):
    expected_result = [{u'count': 6, u'name': u'attributes',
                        u'values': [{u'count': 3, u'name': u'important'},
                                    {u'count': 3, u'name': u'interesting'}]},
                       {u'count': 5, u'name': u'perfect', u'values': []},
                       {u'count': 18, u'name': u'shape',
                        u'values': [{u'count': 13, u'name': u'circle'},
                                    {u'count': 5, u'name': u'square'}]},
                       {u'count': 15, u'name': u'size',
                        u'values': [{u'count': 10, u'name': u'large'},
                                    {u'count': 5, u'name': u'small'}]}]

    filters = {'start_date': None,
               'end_date': None,
               'product_name': None,
               'test': None,
               'metric': None}
    resp = self.app.get(url='/data/metadata',
                        params=[('filters', json.dumps(filters))])

    self.assertEqual(resp.json['labels'], expected_result)

  def testFilteredMetadataHandler(self):
    expected_result = [{u'count': 1, u'name': u'perfect', u'values': []},
                       {u'count': 3, u'name': u'shape',
                        u'values': [{u'count': 2, u'name': u'circle'},
                                    {u'count': 1, u'name': u'square'}]},
                       {u'count': 3, u'name': u'size',
                        u'values': [{u'count': 2, u'name': u'large'},
                                    {u'count': 1, u'name': u'small'}]}]

    filters = {'start_date': None,
               'end_date': None,
               'product_name': 'widget-factory',
               'test': 'create-widgets',
               'metric': 'melt-metal'}
    resp = self.app.get(url='/data/metadata',
                        params=[('filters', json.dumps(filters))])

    self.assertEqual(resp.json['labels'], expected_result)

  @pytest.mark.testing
  def testSqlHandler(self):
    sql = ('SELECT\n'
           '\tproduct_name,\n'
           '\ttest,\n'
           '\tAVG(value) AS avg,\n'
           'FROM [samples_mart_testdata.results]\n'
           'WHERE\n'
           '\ttimestamp >= 1356739200 AND\n'
           '\ttimestamp < 1356825600\n'
           'GROUP BY\n'
           '\tproduct_name,\n'
           '\ttest')

    expected_results = {'cols': [{'id': 'product_name',
                                  'label': 'product_name',
                                  'type': 'string'},
                                 {'id': 'test',
                                  'label': 'test',
                                  'type': 'string'},
                                 {'id': 'avg',
                                  'label': 'avg',
                                  'type': 'number'}],
                        'rows': [{'c': [{'v': 'widget-factory'},
                                        {'v': 'create-widgets'},
                                        {'v': 6.872222222222222}]}]}

    data = {'datasource': {'query': sql, 'config': {'results': {}}}}

    resp = self.app.post(url='/data/sql',
                         params=json.dumps(data),
                         headers={'Content-type': 'application/json',
                                  'Accept': 'text/plain'})
    self.assertEqual(resp.json['results'], expected_results)


if __name__ == '__main__':
  unittest.main()
