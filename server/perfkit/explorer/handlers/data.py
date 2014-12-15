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

Main entry module for data specified in app.yaml.

This module contains the Http handlers for data requests (as JSON) in the
Perfkit Explorer application (as well as other consumers).  Data URL's are
prefixed with /data/{source} in the REST API, and in general the entities are
referenced with GET requests.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json

import base

from perfkit.common import big_query_client
from perfkit.common import big_query_result_util as result_util
from perfkit.common import big_query_result_pivot
from perfkit.common import data_source_config
from perfkit.common import gae_big_query_client
from perfkit.common import http_util
from perfkit.explorer.samples_mart import explorer_method
from perfkit.explorer.samples_mart import product_labels

import webapp2

from google.appengine.api import urlfetch

DATASET_NAME = 'samples_mart'
URLFETCH_TIMEOUT = 50

urlfetch.set_default_fetch_deadline(URLFETCH_TIMEOUT)


class DataHandlerUtil(object):
  """Class used to allow us to replace clients with test versions."""

  # TODO: Refactor this out into a generic class capable of choosing
  # the appropriate data_client for tests and/or product code.
  @classmethod
  def GetDataClient(cls, env):
    """Returns an instance of a data client for the specified environment.

    This is used for testability and GAE support purposes to replace the
    default GAE-enabled data client with a "local" one for running unit
    tests.

    Args:
      env: The environment to connect to.  For more detail, see
          perfkit.data_clients.data_source_config.Environments.

    Returns:
      A valid data client.
    """
    return gae_big_query_client.GaeBigQueryClient(env=env)


class FieldDataHandler(base.RequestHandlerBase):
  """Http handler for getting a list of distinct Field values (/data/fields).

  This handler allows start/end date, project_name, test and metric to be
  supplied as GET parameters for filtering, and field_name determines the
  field to return.  It returns, and returns an array of dicts in the
  following format:
    [{'value': 'time-to-complete'},
     {'value': 'weight'}]
  """

  def get(self):
    """Request handler for GET operations."""
    urlfetch.set_default_fetch_deadline(URLFETCH_TIMEOUT)
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    filters = http_util.GetJsonParam(self.request, 'filters')
=======
    filters = http_util.RequestUtil.GetJsonParam('filters')
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
=======
    filters = http_util.GetJsonParam('filters')
>>>>>>> ca25a76... =Removed bad class references.
=======
    filters = http_util.GetJsonParam(self.request, 'filters')
>>>>>>> 67dff71... =Fix requests.

    start_date = filters['start_date']
    end_date = filters['end_date']
    product_name = filters['product_name']
    test = filters['test']
    metric = filters['metric']
    field_name = self.request.GET.get('field_name')

    client = DataHandlerUtil.GetDataClient(self.env)
    query = explorer_method.ExplorerQueryBase(data_client=client,
                                              dataset_name=DATASET_NAME)
    query.fields = [field_name + ' AS name']
    query.tables = ['lookup_field_cube']
    query.wheres = []

    if start_date:
      query.wheres.append(
          'day_timestamp >= %s' %
          (explorer_method.ExplorerQueryBase
           .GetTimestampFromFilterExpression(
               start_date)))

    if end_date:
      query.wheres.append(
          'day_timestamp <= %s' %
          (explorer_method.ExplorerQueryBase
           .GetTimestampFromFilterExpression(
               end_date)))

    if product_name and field_name != 'product_name':
      query.wheres.append('product_name = "%s"' % product_name)

    if test and field_name not in ['test', 'product_name']:
      query.wheres.append('test = "%s"' % test)

    if metric and field_name not in ['metric', 'test', 'product_name']:
      query.wheres.append('metric = "%s"' % metric)

    query.groups = ['name']
    query.orders = ['name']

    response = query.Execute()
    data = {'rows': response['rows']}

    self.RenderJson(data)


class MetadataDataHandler(base.RequestHandlerBase):
  """Http handler for getting a list of Metadata (Label/Values).

  This handler requires project_name and test to be supplied as GET
  parameters, and returns an array of dicts in the following format:
    [{'label': 'time-to-complete'},
     {'label': 'weight', 'value': '20'}]
  """

  def get(self):
    """Request handler for GET operations."""
    urlfetch.set_default_fetch_deadline(URLFETCH_TIMEOUT)
    client = DataHandlerUtil.GetDataClient(self.env)
    query = product_labels.ProductLabelsQuery(data_client=client,
                                              dataset_name=DATASET_NAME)
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    filters = http_util.GetJsonParam(self.request, 'filters')
=======
    filters = http_util.RequestUtil.GetJsonParam('filters')
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
=======
    filters = http_util.GetJsonParam('filters')
>>>>>>> ca25a76... =Removed bad class references.
=======
    filters = http_util.GetJsonParam(self.request, 'filters')
>>>>>>> 67dff71... =Fix requests.

    start_date = None
    if 'start_date' in filters and filters['start_date']:
      start_date = filters['start_date']

    end_date = None
    if 'end_date' in filters and filters['end_date']:
      end_date = filters['end_date']

    response = query.Execute(
        start_date=start_date,
        end_date=end_date,
        product_name=filters['product_name'],
        test=filters['test'],
        metric=filters['metric'])

    self.RenderJson({'labels': response['labels']})


class SqlDataHandler(base.RequestHandlerBase):
  """Http handler for returning the results of a SQL statement (/data/sql).

  This handler will look for a SQL query in the POST data with the parameter
  name 'query'.  This query will be executed, and the result returned as
  Json.

  This handler returns an array of arrays in the following format:
    [['product_name', 'test', 'min', 'avg'],
     ['widget-factory', 'create-widget', 2.2, 3.1]]
  """

  def post(self):
    """Request handler for POST operations."""
    try:
      urlfetch.set_default_fetch_deadline(URLFETCH_TIMEOUT)
      client = DataHandlerUtil.GetDataClient(self.env)
      request_data = json.loads(self.request.body)
      query = request_data['datasource']['query']
      config = request_data['datasource']['config']
      cache_duration = data_source_config.Services.GetServiceUri(
          self.env, data_source_config.Services.CACHE_DURATION) or None

      response = client.Query(query, cache_duration=cache_duration)

      if config['results'].get('pivot'):
        pivot_config = config['results']['pivot_config']

        transformer = big_query_result_pivot.BigQueryPivotTransformer(
            reply=response,
            rows_name=pivot_config['row_field'],
            columns_name=pivot_config['column_field'],
            values_name=pivot_config['value_field'])
        transformer.Transform()

      self.RenderJson({
          'results': result_util.ReplyFormatter.RowsToDataTableFormat(
              response)})

    # If 'expected' errors occur (specifically dealing with SQL problems),
    # return JSON with descriptive text so that we can give the user a
    # constructive error message.
    # TODO: Formalize error reporting/handling across the application.
    except (big_query_client.BigQueryError, ValueError) as err:
      self.RenderJson({'error': err.message})

  def get(self):
    """Request handler for GET operations."""
    self.post()


# Main WSGI app as specified in app.yaml
app = webapp2.WSGIApplication(
    [('/data/fields', FieldDataHandler),
     ('/data/metadata', MetadataDataHandler),
     ('/data/sql', SqlDataHandler)])
