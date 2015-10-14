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

Utility functions for dealing with AppEngine DataStore results."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import logging

from google.appengine.api import users

class ResultFormatter(object):
  """Collection of utility methods used to format BigQuery replies."""

  @classmethod
  def ResolveGQLType(cls, value):
    """Converts datastore types where necessary (such as UserProperty) to GViz-compatible types.

    Args:
      value: The value to check.

    Returns:
      A single value type for the dict.
    """
    if type(value) is users.User:
      return value.email()
    if type(value) is dict:
      props = [key for key in sorted(value.iterkeys())]
      if props:
        logging.warning('ResultFormatter.ResolveGQLType failed: Dictionary unrecognized:')
        logging.warning(value)
        return value[props[0]]
      else:
        return None
    else:
      logging.warning(type(value))
      return value


  @classmethod
  def FormatGQLResult(cls, data):
    """Transforms a DataStore GQL result to a simple array for GViz consumption.

    Args:
      data: The DataStore GQL result to transform.

    Returns:
      A GViz-ready transformed representation of the provided data.
    """
    result = []

    if data:
      # Get column names from the first row.
      columns = [{'label': attr, 'id': attr} for attr in data[0].iterkeys()]
      result.append(columns)

      for row in data:
        result.append([cls.ResolveGQLType(row.get(column['id'])) for column in columns])

    return result
