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

Tests for data handlers in the Perfkit Explorer application."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import json
import webtest
import unittest

from google.appengine.ext import testbed

from perfkit.explorer.handlers import explorer_config
from perfkit.explorer.model import explorer_config as explorer_config_model


class ExplorerConfigTest(unittest.TestCase):

  def setUp(self):
    super(ExplorerConfigTest, self).setUp()

    self.app = webtest.TestApp(explorer_config.app)

    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDefault(self):
    expected_data = {
        'default_project': explorer_config_model.DEFAULT_PROJECT,
        'default_dataset': explorer_config_model.DEFAULT_DATASET,
        'default_table': explorer_config_model.DEFAULT_TABLE,
        'analytics_key': explorer_config_model.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config_model.DEFAULT_CACHE_DURATION
    }

    resp = self.app.get(url='/config')
    self.assertDictEqual(resp.json, expected_data)

  def testPostDefault(self):
    provided_project = 'PROVIDED_PROJECT'
    expected_data = {
        'default_project': provided_project,
        'default_dataset': explorer_config_model.DEFAULT_DATASET,
        'default_table': explorer_config_model.DEFAULT_TABLE,
        'analytics_key': explorer_config_model.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config_model.DEFAULT_CACHE_DURATION
    }

    self.app.post(url='/config', params=json.dumps(expected_data))
    resp = self.app.get(url='/config')
    self.assertDictEqual(resp.json, expected_data)

if __name__ == '__main__':
  unittest.main()
