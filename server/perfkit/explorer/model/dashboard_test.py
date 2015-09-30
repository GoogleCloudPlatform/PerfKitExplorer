import unittest

from google.appengine.ext import testbed

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
