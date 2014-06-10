"""Tests for data handlers in the Dashkit Explorer application."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import json
import webtest
import unittest

from p3rf.dashkit.data_clients import big_query_client
from p3rf.dashkit.data_clients import credentials_lib
from p3rf.dashkit.data_clients import data_source_config as config
from p3rf.dashkit.explorer.server.handlers import base
from p3rf.dashkit.explorer.server.handlers import data


# TODO: Add a mock data_client to eliminate live data connections.
# TODO: Add fuzz/null testing for required parameters. (low pri)
class DataTest(unittest.TestCase):

  def setUp(self):
    super(DataTest, self).setUp()

    data.DATASET_NAME = 'samples_mart_mockdata'
    base.DEFAULT_ENVIRONMENT = config.Environments.TESTING

    self.app = webtest.TestApp(data.app)

    # Rewrite the DataHandlerUtil methods to return local clients.
    data.DataHandlerUtil.GetDataClient = self._GetTestDataClient

  def _GetTestDataClient(self, env):
    # Ignore env and hardcode to testing.
    env = env
    return big_query_client.BigQueryClient(
        env=config.Environments.TESTING,
        credential_file=credentials_lib.DEFAULT_CREDENTIALS)

  def testUrlHandlers(self):
    """Verifies that URLs resolve to the correct handlers."""
    self.expect(data.FieldDataHandler.get).any_args()
    self.app.get('/data/fields')

    self.expect(data.MetadataDataHandler.get).any_args()
    self.app.get('/data/metadata')

    self.expect(data.SqlDataHandler.post).any_args()
    self.app.post(url='/data/sql')

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

    expected_result = {
        'results': {'cols': [{'id': 'product_name',
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
                                    {'v': 6.872222222222222}]}]}}

    resp = self.app.post(url='/data/sql',
                         status=200,
                         params=[('query', sql)])
    self.assertEqual(resp.json, expected_result)


if __name__ == '__main__':
  unittest.main()
