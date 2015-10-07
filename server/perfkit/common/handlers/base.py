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

Base class and utility functions for GAE Http requests.

This module provides utility functions for http handlers, and
extends webapp2.RequestHandler for improved support of version-specific script
paths and authentication.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import datetime
import json
import logging
import os

import webapp2

from google.appengine.api import users


class JsonEncoder(json.JSONEncoder):
  """Json encoder for handling application domain objects."""

  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.isoformat() + ('' if obj.utcoffset() else 'Z')
    elif isinstance(obj, users.User):
      # Expose only a few fields from user.
      try:
        return {'gaianame': obj.user_login, 'full_name': obj.full_name}
      except AttributeError:
        return {'gaianame': obj.email(), 'full_name': obj.user_id()}
    else:
      return super(JsonEncoder, self).default(obj)


class RequestHandlerBase(webapp2.RequestHandler):
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

    self.response.out.write(JsonEncoder(sort_keys=True).encode(data))
