"""Copyright 2016 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Main entry module for cloudsql config data specified in app.yaml.

This module contains the Http handlers for config data requests (as JSON)
in the Perfkit Explorer application's cloud sql extension.  GAE's data
store is used to store, retrieve and manage JSON representations of Explorer
configs.  At present, only a global config is supported.

The following API is supported:

GET     /cloudsql/config - Returns the global config.
POST    /cloudsql/config - Updates the global config based on the request data.
"""

__author__ = 'jmuharsky@gmail.com (Joe Allan Muharsky)'

import json

from perfkit.explorer.handlers import base
from perfkit.explorer.model import error_fields
from perfkit.ext.cloudsql.models import cloudsql_config

import webapp2


class CloudsqlConfigHandler(base.RequestHandlerBase):
  """Http handler for getting the global config.

  Returns:
      JSON representation of the global config.
  """

  def get(self):
    """Returns the global config."""
    try:
      data = cloudsql_config.CloudsqlConfigModel.Get().to_dict()

      self.RenderJson(data)
    except Exception as err:
      self.RenderJson(
          data={error_fields.MESSAGE: err.message}, status=500)

  def post(self):
    """Updates the global config based on the request body."""
    try:
      data = json.loads(self.request.body)
      cloudsql_config.CloudsqlConfigModel.Update(data)
    except Exception as err:
      self.RenderJson(
          data={error_fields.MESSAGE: err.message}, status=500)


# Main WSGI app as specified in app.yaml
app = webapp2.WSGIApplication(
    [('/cloudsql/config', CloudsqlConfigHandler)])
