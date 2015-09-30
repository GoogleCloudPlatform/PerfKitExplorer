import json
import unittest

from google.appengine.ext import testbed

from perfkit.common import gae_test_util
from perfkit.explorer.model import dashboard
from perfkit.explorer.model import explorer_config


class DashboardTest(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

    self.config = explorer_config.ExplorerConfigModel.Get()
    self.config.restrict_view_to_admin = False
    self.config.restrict_save_to_admin = False
    self.config.put()

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDashboard(self):
    provided_data = '{"type": "sample"}'

    dashboard_id = dashboard.Dashboard(data=provided_data).put().id()
    actual_dashboard = dashboard.Dashboard.GetDashboard(dashboard_id)

    self.assertEquals(provided_data, actual_dashboard.data)

  def testGetFailsForNonAdminWithRestricted(self):
    self.config.restrict_view_to_admin = True
    self.config.put()

    provided_data = '{"type": "sample"}'

    dashboard_id = dashboard.Dashboard(data=provided_data).put().id()
    self.assertRaisesRegexp(
        dashboard.SecurityError,
        'The current user is not authorized to view dashboards',
        dashboard.Dashboard.GetDashboard,
        dashboard_id)

  def testGetDashboardOptional(self):
    nonexistent_id = 12345

    actual_dashboard = dashboard.Dashboard.GetDashboard(nonexistent_id, False)

    self.assertIsNone(actual_dashboard)

  def testGetDashboardNotProvided(self):
    nonexistent_id = 12345

    self.assertRaises(dashboard.InitializeError,
                      dashboard.Dashboard.GetDashboard, nonexistent_id)

  def testCreateFailsForNonAdminWithRestricted(self):
    self.config.restrict_save_to_admin = True
    self.config.put()

    provided_data = '{"type": "sample"}'

    self.assertRaisesRegexp(
        dashboard.SecurityError,
        'The current user is not authorized to save dashboards',
        dashboard.Dashboard(data=provided_data).put)

  def testPutFailsForNonAdminWithRestricted(self):
    provided_data = '{"type": "sample"}'
    new_dashboard = dashboard.Dashboard(data=provided_data)
    new_dashboard.put()

    self.config.restrict_save_to_admin = True
    self.config.put()

    provided_data = '{"type": "updated_sample"}'

    self.assertRaisesRegexp(
        dashboard.SecurityError,
        'The current user is not authorized to save dashboards',
        new_dashboard.put)

  def testDeleteFailsForNonAdminWithRestricted(self):
    provided_data = '{"type": "sample"}'
    new_dashboard = dashboard.Dashboard(data=provided_data)
    new_dashboard.put()

    self.config.restrict_save_to_admin = True
    self.config.put()

    self.assertRaisesRegexp(
        dashboard.SecurityError,
        'The current user is not authorized to delete dashboards',
        new_dashboard.key.delete)


class DashboardIsQueryCustomTest(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

    self.config = explorer_config.ExplorerConfigModel.Get()
    self.config.restrict_view_to_admin = False
    self.config.restrict_save_to_admin = False
    self.config.put()

    self.provided_query = 'SELECT foo FROM bar'

    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    dashboard_json = json.dumps({'children': [
        {'container': {'children': [
            {'id': '1'},
            {'id': '2'}
        ]}},
        {'container': {'children': [
            {'id': '3', 'datasource': {'query': self.provided_query}},
            {'id': '4'}
        ]}}]})
    self.dashboard_model = dashboard.Dashboard(data=dashboard_json)
    self.dashboard_model.put()

    gae_test_util.setCurrentUser(self.testbed, is_admin=False)

  def tearDown(self):
    self.testbed.deactivate()

  def testIsQueryCustomFalseForUnchanged(self):
    actual_value = dashboard.Dashboard.IsQueryCustom(
        self.provided_query, self.dashboard_model.key.id(), '3')

    self.assertFalse(actual_value)

  def testIsQueryCustomTrueForNonexistentWidget(self):
    actual_value = dashboard.Dashboard.IsQueryCustom(
        self.provided_query, self.dashboard_model.key.id(), '5')

    self.assertTrue(actual_value)

  def testIsQueryCustomTrueForNonexistentDashboard(self):
    actual_value = dashboard.Dashboard.IsQueryCustom(
        self.provided_query, '5', '1')

    self.assertTrue(actual_value)

  def testIsQueryCustomTrueForModifiedQuery(self):
    custom_query = 'SELECT stuff FROM myplace'
    actual_value = dashboard.Dashboard.IsQueryCustom(
        custom_query, self.dashboard_model.key.id(), '3')

    self.assertTrue(actual_value)
