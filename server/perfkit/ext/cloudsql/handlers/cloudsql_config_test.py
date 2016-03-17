"""Copyright 2016 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Tests for cloudsql config handlers in the Perfkit Cloudsql application."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import json
import webtest
import unittest

from google.appengine.ext import testbed

from perfkit.common import gae_test_util
from perfkit.ext.cloudsql.handlers import cloudsql_config
from perfkit.ext.cloudsql.models import cloudsql_config as cloudsql_config_model


PROVIDED_USERNAME = 'PROVIDED USERNAME'
PROVIDED_PASSWORD = 'PROVIDED PASSWORD'


class CloudsqlConfigTest(unittest.TestCase):

  def setUp(self):
    super(CloudsqlConfigTest, self).setUp()

    self.app = webtest.TestApp(cloudsql_config.app)

    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDefault(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    expected_data = {
        'username': None,
        'password': None
    }

    resp = self.app.get(url='/cloudsql/config')
    self.assertDictEqual(resp.json, expected_data)

  def testPostDefault(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    expected_data = {
        'username': PROVIDED_USERNAME,
        'password': PROVIDED_PASSWORD
    }

    self.app.post(url='/cloudsql/config', params=json.dumps(expected_data))
    resp = self.app.get(url='/cloudsql/config')
    self.assertDictEqual(resp.json, expected_data)

if __name__ == '__main__':
  unittest.main()
