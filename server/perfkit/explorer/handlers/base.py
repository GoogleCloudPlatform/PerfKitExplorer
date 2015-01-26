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

Base class and utility functions for Perfkit Explorer Http requests.

This module provides utility functions for Explorer http handlers, and
extends webapp2.RequestHandler for improved support of version-specific script
paths and authentication.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import datetime
import json
import os

import jinja2
import webapp2

from google.appengine.api import users

from perfkit.common import data_source_config
from perfkit.explorer.model import explorer_config


_TEMPLATES_PATH = os.path.join(os.path.dirname(__file__), 'templates')
_JINJA_ENVIRONMENT = jinja2.Environment(
    autoescape=True, extensions=['jinja2.ext.autoescape'],
    block_start_string='[%', block_end_string='%]',
    variable_start_string='[[', variable_end_string=']]',
    loader=jinja2.FileSystemLoader(_TEMPLATES_PATH))
DEFAULT_ENVIRONMENT = 'prod'


class Error(Exception):
  pass


class InitializeError(Error):
  def __init__(self, message):
    self.message = message
    super(InitializeError, self).__init__(message)


class _JsonEncoder(json.JSONEncoder):
  """Json encoder for handling application domain objects."""

  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.isoformat() + ('' if obj.utcoffset() else 'Z')
    elif isinstance(obj, users.User):
      # Expose only a few fields from user.
      return {'gaianame': obj.user_login, 'full_name': obj.full_name}
    else:
      return super(_JsonEncoder, self).default(obj)


class RequestHandlerBase(webapp2.RequestHandler):
  """Provides common functions to request handler subclasses."""

  @property
  def env(self):
    return self.request.get('env', DEFAULT_ENVIRONMENT)

  def RenderHtml(self, template_file, template_values, status=200):
    """Renders HTML given a template filename and values.

    Args:
      template_file: string. File name under templates directory.
      template_values: dict. Mapping of template variables to corresponding
          values.
      status: int. HTTP status code.
    """
    self.response.set_status(status)
    user = users.get_current_user()
    template_values['user'] = user

    # Provide a versioned static URI for templates to use.
    template_values['static_dir'] = ('/_static/%s' %
                                     os.environ['CURRENT_VERSION_ID'])
    template_values['env'] = self.env

    if users.get_current_user():
      template_values['current_user_email'] = users.get_current_user().email()
    template_values['current_user_admin'] = str(
        users.is_current_user_admin()).lower()
    current_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    template_values['analytics_key'] = current_config['analytics_key']
    template_values['initial_config'] = json.dumps(current_config)

    template = _JINJA_ENVIRONMENT.get_template(template_file)
    self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
    self.response.out.write(template.render(template_values))

  def RenderJson(self, data, status=200, filename=None):
    """Renders the provided data as JSON, using the _JsonEncoder class.

    Args:
      data: Json-serializable object.
      status: int. HTTP status code.
    """
    self.response.set_status(status)

    # Read https://wiki.corp.google.com/twiki/bin/view/Main/ISETeamJSON for
    # proper handling of JSON response.
    self.response.headers['Content-Type'] = 'application/json; charset=utf-8'

    if filename:
      self.response.headers["Content-Disposition"] = (
          'attachment; filename=' + filename)

    self.response.out.write(_JsonEncoder(sort_keys=True).encode(data))
