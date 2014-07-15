"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

GAE Model for PerfKit settings."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json

from google.appengine.api import users
from google.appengine.ext import db

import dashboard_fields as fields


DEFAULT_SETTINGS_ID = 'PERFKIT_SCOPE'


class Error(Exception):
  pass


class Settings(db.Model):
  """Models PerfKit Explorer settings.

  For the time being, a single record will be used to store settings.  In the
  future, there may be multiple rows per user/project/etc.
  """

  default_bq_project = db.StringProperty(default='')

  @staticmethod
  def GetDefaultSettings():
    """Returns the Default Explorer Settings.

    Returns:
      An object representing the current settings.
    """
    settings_row = Settings.get_by_id(DEFAULT_SETTINGS_ID)

    if not settings_row:
      settings_row = Settings()
      settings_row.id = DEFAULT_SETTINGS_ID

    return settings_row
