import unittest

from google.appengine.ext import testbed

from perfkit.explorer.model import dashboard


class DashboardTest(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDashboard(self):
    provided_data = '{"type": "sample"}'

    dashboard_id = dashboard.Dashboard(data=provided_data).put().id()
    actual_dashboard = dashboard.Dashboard.GetDashboard(dashboard_id)

    self.assertEquals(provided_data, actual_dashboard.data)

  def testGetDashboardOptional(self):
    nonexistent_id = 12345

    actual_dashboard = dashboard.Dashboard.GetDashboard(nonexistent_id, False)

    self.assertIsNone(actual_dashboard)

  def testGetDashboardNotProvided(self):
    nonexistent_id = 12345

    self.assertRaises(dashboard.InitializeError,
                      dashboard.Dashboard.GetDashboard, nonexistent_id)
