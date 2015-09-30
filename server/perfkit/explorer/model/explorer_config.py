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

GAE Model for the datastore."""

__author__ = 'jmuharsky@gmail.com (Joe Allan Muharsky)'

from google.appengine.api import users
from google.appengine.ext import ndb


DEFAULT_PROJECT = 'unset'
DEFAULT_DATASET = 'samples_mart'
DEFAULT_TABLE = 'results'
DEFAULT_ANALYTICS_KEY = ''
DEFAULT_CACHE_DURATION = 0

GLOBAL_CONFIG_KEY = 'perfkit.explorer.config'



class Error(Exception):
  pass


class InitializeError(Error):
  pass


class SecurityError(Error):
  pass


class ExplorerConfigModel(ndb.Model):
  """Models the data/service config for explorer."""

  default_project = ndb.StringProperty(default=DEFAULT_PROJECT)
  default_dataset = ndb.StringProperty(default=DEFAULT_DATASET)
  default_table = ndb.StringProperty(default=DEFAULT_TABLE)
  analytics_key = ndb.StringProperty(default=DEFAULT_ANALYTICS_KEY)
  cache_duration = ndb.IntegerProperty(default=DEFAULT_CACHE_DURATION)

  restrict_save_to_admin = ndb.BooleanProperty(default=True)
  restrict_view_to_admin = ndb.BooleanProperty(default=True)
  restrict_query_to_admin = ndb.BooleanProperty(default=True)

  def Load(self, data):
    """Sets the properties of the current config according to the provided data.

    Args:
      data: A JSON object containing one or more config values.
    """
    if not users.is_current_user_admin():
      raise SecurityError('You must be an administrator to modify config.')

    self.populate(**data)
    self.put()

  @classmethod
  def Get(cls):
    """Returns the global config, and creates it if necessary.

    Returns:
      An ExplorerConfigModel instance.
    """
    return cls.get_or_insert(GLOBAL_CONFIG_KEY)

  @classmethod
  def Update(cls, data):
    """Modifies the global config, and creates it if necessary.

    Args:
      data: A JSON object containing one or more config values.
    """
    config_row = cls.Get()

    config_row.Load(data)
