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

Helper functions for Http-related stuff."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json


class Error(Exception):
  pass


class ParameterError(Error):
  pass


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


def GetIntegerParam(request, param_name, required=True, default=None):
  str_value = GetStringParam(request, param_name, required, default)
  return ConvertStringToInteger(str_value, param_name)


def ConvertStringToInteger(value, param_name):
  try:
    return int(value)
  except ValueError:
    message = ('The "{param:}" parameter must be an integer.  '
               'Found "{value}".').format(param=param_name, value=value)
    raise ParameterError(message)


def GetJsonParam(request, param_name, required=True, default=None):
  return ConvertStringToJSON(
      GetStringParam(request, param_name, required, default), param_name)


def ConvertStringToJSON(value, param_name):
  try:
    return json.loads(value)
  except ValueError:
    message = ('The "{param:}" parameter must be valid JSON.  '
               'Found:\n{value}').format(param=param_name, value=value)
    raise ParameterError(message)


def GetBoolParam(request, param_name, required=True, default=None):
  return ConvertStringToBool(
      GetStringParam(request, param_name, required, default), param_name)


def ConvertStringToBool(value, param_name):
  if not value:
    return False

  values_true = ['true', '1', 1]
  values_false = ['false', '0', 0]

  if isinstance(value, str):
    value = value.lower()

  if value in values_true:
    return True
  elif value in values_false:
    return False
  else:
    message = ('The "{param:}" parameter must be a valid boolean.  '
               'Found "{value}".').format(param=param_name, value=value)
    raise ParameterError(message)


def GetStringParam(request, param_name, required=True, default=None):
  str_value = request.get(param_name)

  if str_value:
    return str(str_value)
  else:
    if default or not required:
      return default
    else:
      message = ('The "{param:}" parameter is required.').format(
          param=param_name)
      raise ParameterError(message)
<<<<<<< HEAD

=======
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
