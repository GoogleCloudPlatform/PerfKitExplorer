"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

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


_TEMPLATES_PATH = os.path.join(os.path.dirname(__file__), 'templates')
_JINJA_ENVIRONMENT = jinja2.Environment(
    autoescape=True, extensions=['jinja2.ext.autoescape'],
    variable_start_string='[[', variable_end_string=']]',
    loader=jinja2.FileSystemLoader(_TEMPLATES_PATH))
DEFAULT_ENVIRONMENT = 'prod'
ANALYTICS_KEY = ''


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

  def GetIntegerParam(self, param_name, required=True, default=None):
    str_value = self.GetStringParam(param_name, required)

    if str_value:
      try:
        return int(str_value)
      except ValueError:
        message = ('The "{param:}" parameter must be an integer.  '
                   'Found "{value}".').format(param=param_name, value=str_value)
        raise InitializeError(message)
    else:
      return default

  def GetJsonParam(self, param_name, required=True, default=None):
    str_value = self.GetStringParam(param_name, required)

    if str_value:
      try:
        return json.loads(str_value)
      except ValueError:
        message = ('The "{param:}" parameter must be valid JSON.  '
                   'Found:\n{value}').format(param=param_name, value=str_value)
        raise InitializeError(message)
    else:
      return default

  def GetStringParam(self, param_name, required=True, default=None):
    str_value = self.request.get(param_name)

    if str_value:
      return str(str_value)
    else:
      if not required:
        return default
      else:
        message = ('The "{param:}" parameter is required.').format(
            param=param_name)
        raise InitializeError(message)

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
    template_values['current_user_email'] = users.get_current_user().email()
    template_values['current_user_admin'] = str(
        users.is_current_user_admin()).lower()
    template_values['default_query_project_id'] = data_source_config.Services.GetServiceUri(
      DEFAULT_ENVIRONMENT, 'project_id')
    template_values['analytics_id'] = ANALYTICS_KEY

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
      self.response.headers["Content-Disposition"] = 'attachment; filename=' + filename

    self.response.out.write(_JsonEncoder(sort_keys=True).encode(data))
