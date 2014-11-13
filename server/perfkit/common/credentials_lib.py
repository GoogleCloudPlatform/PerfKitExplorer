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

Library for loading credentials files."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import logging
import shutil
import tempfile

from apiclient import discovery
import data_source_config as config
import httplib2
from oauth2client import multistore_file


DEFAULT_CREDENTIALS = ('credentials.json')
CREDENTIALS_SCOPE = ('https://www.googleapis.com/auth/devstorage.read_write '
                     'https://www.googleapis.com/auth/bigquery')


class Error(Exception):
  pass


class CredentialKeyError(Error):
  pass


def GetAuthorizedCredentials(credential_path, env):
  """Builds authorized credentials used for talking to apiary services.

  As the file are stored in the repo and are frequently read only, we copy the
  credentials file to a temp file that is writable.  We need the file to be
  writable so we can update the access token in the file.  Otherwise we ask
  apiary for a access token each time we need to auth, this can lead to us
  exceeding apiary's rate limits.

  Args:
    credential_path: The path to a credentials file.
    env: What environment to authorize access for.  The master set of
        environments can be found in data_source_config.py.

  Returns:
    An authorized credentials object that can be used to build client libraries
    and issue authorized requests to apiary services.

  Raises:
    CredentialKeyError: If the env value passed is not a valid environment.
  """
  if env not in config.Environments.All():
    raise CredentialKeyError(
        '%s is not a valid environment.  The valid environments are %s' %
        (env, config.Environments.All()))

  try:
    cred_to_use = _CopyCredentialsToTemp(credential_path)
  except IOError:
    logging.error(
        'Unable to copy credential files to a writable location.')
    raise

  client_id = '%s.apps.googleusercontent.com' % config.Services.GetServiceUri(
      env, config.Services.PROJECT_ID)
  user_agent = '%s_perfkit_client/1.0' % env

  storage = multistore_file.get_credential_storage(
      cred_to_use, client_id, user_agent, CREDENTIALS_SCOPE)
  credentials = storage.get()

  if not credentials:
    msg = (
        'Could not find credentials.\ncred_to_use: %s\nclient_id: %s\n'
        'user_agent: %s\nscope: %s') % (cred_to_use, client_id, user_agent,
            CREDENTIALS_SCOPE)
    raise Error(msg)

  return credentials.authorize(httplib2.Http(timeout=config.DEFAULT_TIMEOUT))


def _CopyCredentialsToTemp(src_path):
  """Copies credentials to a writable temp file."""
  # TODO: Make sure using different temporary files each time
  # is sufficient.  This is a simpler solution than using the same file, but it
  # may not sufficiently lower the number of calls we issue to apiary.
  temp_file = tempfile.NamedTemporaryFile(delete=False)
  shutil.copyfile(src_path, temp_file.name)
  return temp_file.name


def BuildAnonymousDiscovery(service_name, version, env):
  """Build a discovery doc for an anonymous user.

  This still requires knowing the API key for a project.  This API key is used
  for quota control and not for ACLs any valid API key will work so this does
  not provide security benefits.

  Args:
    service_name: string, name of the service.
    version: string, the version of the service.
    env: string, What environment to authorize access for.  The master set of
        environments can be found in data_source_config.py.

  Returns:
    A Resource object with methods for interacting with the service.
  """
  api_key = config.Services.GetServiceUri(env, config.Services.API_KEY)
  return discovery.build(service_name, version, developerKey=api_key)
