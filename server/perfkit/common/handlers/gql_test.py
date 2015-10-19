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

Tests for GQL handlers in the Perfkit Explorer application."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import json
import logging
import webtest
import unittest

from google.appengine.ext import testbed

from perfkit.common import gae_test_util
from perfkit.common.handlers import gql

from perfkit.explorer.model import dashboard


class GqlHandlerTest(unittest.TestCase):

  def setUp(self):
    super(GqlHandlerTest, self).setUp()

    self.app = webtest.TestApp(gql.app)

    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    self.existing_dashboard = dashboard.Dashboard(
      title='TEST TITLE'
    )
    self.existing_dashboard.put()

    self.expected_data = [[
      {u'id': u'modified_by', u'label': u'modified_by'},
      {u'id': u'title', u'label': u'title'},
      {u'id': u'created_by', u'label': u'created_by'},
      {u'id': u'writers', u'label': u'writers'},
      {u'id': u'data', u'label': u'data'},
      {u'id': u'public', u'label': u'public'}],
      [None, u'TEST TITLE', None, [], u'', False]]

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDefault(self):
    provided_params = {
        'query': 'SELECT * FROM Dashboard'
    }
    logging.error(self.expected_data)

    resp = self.app.get(url='/data/gql', params=provided_params)
    self.assertEqual(resp.json, self.expected_data)

  def testPostDefault(self):
    provided_params = json.dumps({
        'query': 'SELECT * FROM Dashboard'
    })
    expected_data = [self.existing_dashboard.to_dict()]
    logging.error(self.expected_data)

    resp = self.app.post(url='/data/gql', params=provided_params)
    logging.error(resp.json)
    self.assertEqual(resp.json, self.expected_data)

if __name__ == '__main__':
  unittest.main()
