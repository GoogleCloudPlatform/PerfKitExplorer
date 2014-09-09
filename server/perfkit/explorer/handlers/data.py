"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Main entry module for data specified in app.yaml.

This module contains the Http handlers for data requests (as JSON) in the
Perfkit Explorer application (as well as other consumers).  Data URL's are
prefixed with /data/{source} in the REST API, and in general the entities are
referenced with GET requests.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json
import logging

import base

from perfkit.common import big_query_client
from perfkit.common import big_query_result_util as result_util
from perfkit.common import big_query_result_pivot
from perfkit.common import gae_big_query_client
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

    This is used for testability and GAE support purposes to replace the default
    GAE-enabled data client with a "local" one for running unit tests.

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
  supplied as GET parameters for filtering, and field_name determines the field
  to return.  It returns, and returns an array of dicts in the following format:
    [{'value': 'time-to-complete'},
     {'value': 'weight'}]
  """

  def get(self):
    """Request handler for GET operations."""
    urlfetch.set_default_fetch_deadline(URLFETCH_TIMEOUT)
    filters = self.GetJsonParam('filters')

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
          explorer_method.ExplorerQueryBase.GetTimestampFromFilterExpression(
              start_date))

    if end_date:
      query.wheres.append(
          'day_timestamp <= %s' %
          explorer_method.ExplorerQueryBase.GetTimestampFromFilterExpression(
              end_date))

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

  This handler requires project_name and test to be supplied as GET parameters,
  and returns an array of dicts in the following format:
    [{'label': 'time-to-complete'},
     {'label': 'weight', 'value': '20'}]
  """

  def post(self):
    """Request handler for GET operations."""
    urlfetch.set_default_fetch_deadline(URLFETCH_TIMEOUT)
    client = DataHandlerUtil.GetDataClient(self.env)
    query = product_labels.ProductLabelsQuery(data_client=client,
                                              dataset_name=DATASET_NAME)
    request_data = json.loads(self.request.body)
    logging.error(request_data)
    filters = request_data['filters']

    response = query.Execute(
        start_date=filters['start_date'],
        end_date=filters['end_date'],
        product_name=filters['product_name'],
        test=filters['test'],
        metric=filters['metric'])

    self.RenderJson({'labels': response['labels']})


class SqlDataHandler(base.RequestHandlerBase):
  """Http handler for returning the results of a SQL statement (/data/sql).

  This handler will look for a SQL query in the POST data with the parameter
  name 'query'.  This query will be executed, and the result returned as Json.

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
      response = client.Query(query)

      if config['results']['pivot']:
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
