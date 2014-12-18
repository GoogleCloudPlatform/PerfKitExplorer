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

GAE Model for PerfKit settings."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

from google.appengine.ext import db


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
