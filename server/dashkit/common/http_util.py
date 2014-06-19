"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Helper functions for Http-related stuff."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json


def GetHttpErrorResponse(err):
  """Extracts the reason string from an HttpError.

  This functionality is encapsulated in the HttpError private member
  _get_reason().  See third_party.py.apiclient.errors.HttpError for more.  It
  is used in exception handling to distinguish specific error types.

  Args:
    err: The HttpError that was thrown.

  Returns:
    A string representing the error response code.
  """
  try:
    data = json.loads(err.content)
    return data['error']['message']
  except (ValueError, KeyError):
    return None
