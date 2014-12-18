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

Basic helper methods."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

from datetime import datetime
import os

from perfkit.common import big_query_client
from perfkit.common import credentials_lib
from perfkit.common import data_source_config
from perfkit.common import mock_big_query_client

# Default date ranges, currently chosen arbitrarily.
# TODO: Update these values to coincide with official Mock Data.
MIN_SAMPLE_DATE = datetime(2012, 12, 13)
MAX_SAMPLE_DATE = datetime(2012, 12, 22)
CONTEXT_DATE = datetime(2012, 12, 15)


def GetDataClient(mocked=False):
  """Returns a BigQueryClient with default credentials in the testing env."""
  if mocked:
    return mock_big_query_client.MockBigQueryClient(
        credential_file=credentials_lib.DEFAULT_CREDENTIALS,
        env=data_source_config.Environments.TESTING)
  else:
    return big_query_client.BigQueryClient(
        credential_file=credentials_lib.DEFAULT_CREDENTIALS,
        env=data_source_config.Environments.TESTING)


def SetConfigPaths():
  """Sets the paths to various json config files."""
  big_query_client.DISCOVERY_FILE = (
      os.path.join(GetRootPath(), 'config/big_query_v2_rest.json'))
  data_source_config.CONFIG_FILE = (
      os.path.join(GetRootPath(), 'config/data_source_config.json'))
  credentials_lib.DEFAULT_CREDENTIALS = (
      os.path.join(GetRootPath(), 'config/credentials.json'))


def GetRootPath():
  """Returns the path to the root folder.  The root folder is identified by
    having the /config folder as a child and containing an app.yaml file."""
  root_path = os.path.join(os.path.dirname(__file__), '..', '..')
  assert os.path.isfile(os.path.join(root_path, 'app.yaml'))
  assert os.path.isdir(os.path.join(root_path, 'config'))
  return root_path