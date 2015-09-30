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

Tests for explorer config util functions in the Perfkit Explorer application."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import json
import webtest
import unittest

from google.appengine.ext import testbed

from perfkit.common import gae_test_util
from perfkit.explorer.model import dashboard
from perfkit.explorer.model import explorer_config as explorer_config_model
from perfkit.explorer.util import explorer_config_util


class ExplorerConfigTest(unittest.TestCase):

  def setUp(self):
    super(ExplorerConfigTest, self).setUp()

    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

    self.config = explorer_config_model.ExplorerConfigModel.Get()

  def tearDown(self):
    self.testbed.deactivate()

  def testCanSaveTrueForAdminWhenRestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    self.config.restrict_save_to_admin = True

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanSave(self.config), True)

  def testCanSaveTrueForAdminWhenUnrestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    self.config.restrict_save_to_admin = False

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanSave(self.config), True)

  def testCanSaveFalseForNonAdminWhenRestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)
    self.config.restrict_save_to_admin = True

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanSave(self.config), False)

  def testCanSaveTrueForNonAdminWhenUnrestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)
    self.config.restrict_save_to_admin = False

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanSave(self.config), True)

  def testCanViewTrueForAdminWhenRestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    self.config.restrict_view_to_admin = True

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanView(self.config), True)

  def testCanViewTrueForAdminWhenUnrestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    self.config.restrict_view_to_admin = False

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanView(self.config), True)

  def testCanViewFalseForNonAdminWhenRestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)
    self.config.restrict_view_to_admin = True

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanView(self.config), False)

  def testCanViewTrueForNonAdminWhenUnrestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)
    self.config.restrict_view_to_admin = False

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanView(self.config), True)

  def testCanQueryTrueForAdminWhenRestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    self.config.restrict_query_to_admin = True

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanQuery(self.config), True)

  def testCanQueryTrueForAdminWhenUnrestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    self.config.restrict_query_to_admin = False

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanQuery(self.config), True)

  def testCanQueryFalseForNonAdminWhenRestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)
    self.config.restrict_query_to_admin = True

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanQuery(self.config), False)

  def testCanQueryTrueForNonAdminWhenUnrestricted(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)
    self.config.restrict_query_to_admin = False

    self.assertEqual(
        explorer_config_util.ExplorerConfigUtil.CanQuery(self.config), True)

if __name__ == '__main__':
  unittest.main()
