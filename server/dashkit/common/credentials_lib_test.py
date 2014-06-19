"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Unit test for credentials_lib."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import logging

import unittest

import big_query_client
import credentials_lib
import data_source_config as config


class CredentialsLibTest(unittest.TestCase):

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
      logging.info('Using Credentials for %s', env)
      client = big_query_client.BigQueryClient(
          credentials_lib.DEFAULT_CREDENTIALS, env)
      response = client.TableExists('samples_mart', 'results')

      self.assertTrue(response)


if __name__ == '__main__':
  unittest.main()
