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

Main entry module for the common GQL (GAE DataStore) handler.

This module contains the Http handlers for GQL/DataStore requests (as JSON)
in the Perfkit Explorer application (as well as other consumers).

The following API is supported:

GET     /data/gql - Returns the results of the provided GQL query.
"""

__author__ = 'jmuharsky@gmail.com (Joe Allan Muharsky)'

import base
import json
import logging
import urllib

import webapp2

from google.appengine.ext import ndb

from perfkit.common import http_util
from perfkit.common import gae_datastore_result_util as util

# All DataStore entities that you want to query must be imported here down to
# the class name.
from perfkit.explorer.model.explorer_config import ExplorerConfigModel
from perfkit.explorer.model.dashboard import Dashboard

from google.appengine.api import urlfetch

class GqlHandler(base.RequestHandlerBase):
  """Http handler for returning the results of a GQL query.

  Returns:
      JSON representation of the dataset.
  """

  def get(self):
    """Handles a GET request."""
    try:
      query_gql = http_util.GetStringParam(self.request, 'query')
      query_url = http_util.GetStringParam(self.request, 'url', False)

      self.ExecuteQuery(query_gql, query_url)

    except http_util.ParameterError as err:
      self.RenderJson(
          data={'error': err.message}, status=500)

  def post(self):
    """Handles a POST request."""
    request_data = json.loads(self.request.body)
    query_gql = request_data.get('query')
    query_url = request_data.get('url')

    self.ExecuteQuery(query_gql, query_url)

  def ExecuteQuery(self, query_gql, url=None):
    try:
      if url:
        form_fields = {"query": query_gql}
        form_data = urllib.urlencode(form_fields)
        response = urlfetch.fetch(url=url,
            payload=form_data,
            method=urlfetch.POST,
            headers={'Content-Type': 'application/x-www-form-urlencoded'})
        logging.error(response)
        results = json.loads(response.content)
      else:
        query = ndb.gql(query_gql)
        results = query.fetch()
        data = [result.to_dict() for result in results]
        data = util.ResultFormatter.FormatGQLResult(data)

      self.RenderJson(data)
    except Exception as err:
      self.RenderJson(
          data={'error': err.message}, status=500)


# Main WSGI app as specified in app.yaml
app = webapp2.WSGIApplication(
    [('/data/gql', GqlHandler)])
