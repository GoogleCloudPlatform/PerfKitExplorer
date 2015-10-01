"""Copyright 2015 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Utility methods for the Explorer security config.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import logging

from google.appengine.api import users

from perfkit.explorer.model import explorer_config


class ExplorerConfigUtil():
  @classmethod
  def CanSave(cls, config=None):
    """Returns True if the current user is allowed to save dashboards, otherwise false."""
    if users.is_current_user_admin():
      return True

    config = config or explorer_config.ExplorerConfigModel.Get()
    return config.grant_save_to_public

  @classmethod
  def CanView(cls, config=None):
    """Returns True if the current user is allowed to view dashboards, otherwise false."""
    if users.is_current_user_admin():
      return True

    config = config or explorer_config.ExplorerConfigModel.Get()
    return config.grant_view_to_public

  @classmethod
  def CanQuery(cls, config=None):
    """Returns True if the current user is allowed to run custom queries, otherwise false."""
    if users.is_current_user_admin():
      return True

    config = config or explorer_config.ExplorerConfigModel.Get()
    return config.grant_query_to_public
