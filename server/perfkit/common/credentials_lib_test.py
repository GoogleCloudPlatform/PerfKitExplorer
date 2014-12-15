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

Unit test for credentials_lib."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import logging

import unittest

from perfkit import test_util
<<<<<<< HEAD
from perfkit.common import big_query_client
from perfkit.common import credentials_lib
from perfkit.common import data_source_config as config
=======

import big_query_client
import credentials_lib
import data_source_config as config
>>>>>>> 6f4ba1e... =Add util to credentials_lib


class CredentialsLibTest(unittest.TestCase):

  def setUp(self):
    test_util.SetConfigPaths()

  def testGetAuthorizedCredentials(self):
    for env in config.Environments.All():
      logging.info('Getting Authorized Credentials for %s', env)
      credentials_lib.GetAuthorizedCredentials(
          credentials_lib.DEFAULT_CREDENTIALS, env)

  def testUseCredentials(self):
    """Makes sure credentials are valid.

    Only tests reading from google storage, not other scopes.
    """
    for env in config.Environments.All():
      logging.info('*** Using Credentials for %s', env)
      client = big_query_client.BigQueryClient(
          credentials_lib.DEFAULT_CREDENTIALS, env)
      response = client.TableExists('samples_mart', 'results')

      self.assertTrue(response)


if __name__ == '__main__':
  unittest.main()
