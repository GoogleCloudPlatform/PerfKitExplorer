import json
import unittest

from google.appengine.api import users
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

  def testContainsQuerySingleMatch(self):
    provided_data = {
        "type": "sample",
        "children": [
            {
                "container": {
                    "children": [{
                        "datasource": {
                            "query": "SELECT foo FROM bar"
                        }
                    }]
                }
            }
        ]
    }
    provided_query_regex = '.*FROM bar.*'
    expected_count = 1

    actual_dashboard = dashboard.Dashboard(data=json.dumps(provided_data))
    actual_matchcount = actual_dashboard.ContainsQuery(provided_query_regex)

    self.assertEquals(expected_count, actual_matchcount)

  def testContainsQueryMultipleMatch(self):
    provided_data = {
        "type": "sample",
        "children": [
            {
                "container": {
                    "children": [
                        {
                            "datasource": {
                                "query": "SELECT foo FROM bar"
                            }
                        },
                        {
                            "datasource": {
                                "query": "SELECT foo FROM rebar"
                            }
                        },
                        {
                            "datasource": {
                                "query": "SELECT foo FROM bar2"
                            }
                        }
                    ]
                }
            }
        ]
    }
    provided_query_regex = '.*FROM bar.*'
    expected_count = 2

    actual_dashboard = dashboard.Dashboard(data=json.dumps(provided_data))
    actual_matchcount = actual_dashboard.ContainsQuery(provided_query_regex)

    self.assertEquals(expected_count, actual_matchcount)

  def testContainsQueryNoMatch(self):
    provided_data = {
        "type": "sample",
        "children": [
            {
                "container": {
                    "children": [{
                        "datasource": {
                            "query": "SELECT foo FROM rebar"
                        }
                    }]
                }
            }
        ]
    }
    provided_query_regex = '.*FROM bar.*'
    expected_count = 0

    actual_dashboard = dashboard.Dashboard(data=json.dumps(provided_data))
    actual_matchcount = actual_dashboard.ContainsQuery(provided_query_regex)

    self.assertEquals(expected_count, actual_matchcount)

  def testListDashboardsWithOwner(self):
    provided_data = '{"type": "sample"}'
    owner_user = users.User('owned_email@mydomain.com')

    owned_dashboard_id = dashboard.Dashboard(
        data=provided_data,
        created_by=owner_user
    ).put().id()

    unowned_dashboard_id = dashboard.Dashboard(
        data=provided_data,
        created_by=users.User('unowned_email@mydomain.com')
    ).put().id()

    actual_dashboards = dashboard.Dashboard.ListDashboards(owner_user)

    self.assertEquals(len(actual_dashboards), 1)
    self.assertEquals(actual_dashboards[0].key.id(), owned_dashboard_id)

  def testListDashboardsNoOwner(self):
    provided_data = '{"type": "sample"}'

    owned_dashboard_id = dashboard.Dashboard(
        data=provided_data,
        created_by=users.User('owned_email@mydomain.com')
    ).put().id()

    unowned_dashboard_id = dashboard.Dashboard(
        data=provided_data,
        created_by=users.User('unowned_email@mydomain.com')
    ).put().id()

    actual_dashboards = dashboard.Dashboard.ListDashboards()

    self.assertEquals(len(actual_dashboards), 2)
    self.assertEquals(actual_dashboards[0].key.id(), owned_dashboard_id)
    self.assertEquals(actual_dashboards[1].key.id(), unowned_dashboard_id)

  def testListDashboardsMatchingQuery(self):
    matching_dashboard = {
        "type": "sample",
        "children": [
            {
                "container": {
                    "children": [{
                        "datasource": {
                            "query": "SELECT foo FROM bar"
                        }
                    }]
                }
            }
        ]
    }
    unmatching_dashboard = {
        "type": "sample",
        "children": [
            {
                "container": {
                    "children": [{
                        "datasource": {
                            "query": "SELECT foo FROM rebar"
                        }
                    }]
                }
            }
        ]
    }
    provided_query_regex = '.*FROM bar.*'
    expected_count = 1

    matching_dashboard_id = dashboard.Dashboard(
        data=json.dumps(matching_dashboard)).put().id()
    dashboard.Dashboard(data=json.dumps(unmatching_dashboard)).put()

    actual_dashboards = dashboard.Dashboard.ListDashboards(
        query_regex=provided_query_regex)

    self.assertEquals(expected_count, len(actual_dashboards))
    self.assertEquals(actual_dashboards[0].key.id(), matching_dashboard_id)

  def testGetDashboardOptional(self):
    nonexistent_id = 12345

    actual_dashboard = dashboard.Dashboard.GetDashboard(nonexistent_id, False)

    self.assertIsNone(actual_dashboard)

  def testGetDashboardNotProvided(self):
    nonexistent_id = 12345

    self.assertRaises(dashboard.InitializeError,
                      dashboard.Dashboard.GetDashboard, nonexistent_id)
