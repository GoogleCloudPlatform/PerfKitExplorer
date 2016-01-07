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


import datetime

import mock
import json
import os
import webtest
import unittest

from google.appengine.api import users
from google.appengine.ext import testbed

from perfkit.explorer.handlers import dashboard
from perfkit.explorer.model import dashboard as dashboard_model
from perfkit.explorer.model import explorer_config
from perfkit.explorer.util import user_validator

DEFAULT_USERS = [{'id': '1', 'email': 'test01@mydomain.com'},
                 {'id': '2', 'email': 'newowner@mydomain.com'}]


class DashboardTest(unittest.TestCase):

  def setUp(self):
    super(DashboardTest, self).setUp()

    self.app = webtest.TestApp(dashboard.app)

    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

    self.config = explorer_config.ExplorerConfigModel.Get()
    self.config.grant_view_to_public = True
    self.config.grant_save_to_public = True
    self.config.put()

    os.environ['USER_EMAIL'] = DEFAULT_USERS[0]['email']
    os.environ['USER_ID'] = DEFAULT_USERS[0]['id']
    dashboard_model.DEFAULT_DOMAIN = 'mydomain.com'

    p = mock.patch(dashboard_model.__name__ + '.datetime')
    self.mock_datetime = p.start()
    self.addCleanup(p.stop)
    self.mock_datetime.datetime.now.return_value = datetime.datetime.now()

    DashboardTest.original_getDashboardOwner = (
        dashboard_model.Dashboard.GetDashboardOwner)
    dashboard_model.Dashboard.GetDashboardOwner = (
        DashboardTest.mockGetDashboardOwner)

  @classmethod
  def mockGetDashboardOwner(cls, owner_string):
    if owner_string:
      owner_email = dashboard_model.Dashboard.GetCanonicalEmail(
          owner_string)
    else:
      owner_email = DEFAULT_USERS[0]['email']

    try:
      next(
          obj for (index, obj) in
          enumerate(DEFAULT_USERS) if obj['email'] == owner_email)
      return users.User(owner_email)
    except StopIteration:
      raise users.UserNotFoundError()

  def assertJsonEqual(self, actual, expected):
    if isinstance(actual, basestring):
      actual = json.loads(actual)

    if isinstance(expected, basestring):
      expected = json.loads(expected)

    return self.assertEquals(actual, expected)

  def tearDown(self):
    dashboard_model.Dashboard.GetDashboardOwner = (
        DashboardTest.original_getDashboardOwner)
    self.testbed.deactivate()

  def testViewDashboard(self):
    provided_data = '{"title": "foo"}'
    expected_data = {'title': 'foo'}

    dashboard_id = dashboard_model.Dashboard(data=provided_data).put().id()
    resp = self.app.get(url='/dashboard/view',
                        params=[('id', dashboard_id)])
    self.assertDictEqual(resp.json, expected_data)

  def testDeleteDashboard(self):
    original_data = '{"title": "foo"}'

    dashboard_id = dashboard_model.Dashboard(
        created_by=users.get_current_user(),
        data=original_data).put().id()

    self.app.post(url='/dashboard/delete',
                  status=200,
                  params=[('id', dashboard_id)])
    stored_dashboard = dashboard_model.Dashboard.get_by_id(dashboard_id)
    self.assertIsNone(stored_dashboard)

  def testCreateDashboard(self):
    provided_data = '{"title": "foo"}'
    expected_response = {'id': '1', 'title': 'foo',
                         'owner': DEFAULT_USERS[0]['email']}
    expected_created_date = datetime.datetime(2014, 2, 20, 2, 36, 10)
    self.mock_datetime.datetime.now.return_value = expected_created_date

    resp = self.app.post(url='/dashboard/create',
                         params=[('data', provided_data)])
    self.assertDictEqual(resp.json, expected_response)

    stored_dashboard = dashboard_model.Dashboard.get_by_id(1)
    self.assertEqual(stored_dashboard.created_date, expected_created_date)
    self.assertEqual(stored_dashboard.modified_date, expected_created_date)

  def testCopyDashboard(self):
    provided_data = '{{"title": "foo", "owner": "{owner:}"}}'.format(
        owner=DEFAULT_USERS[0]['email'])

    dashboard_id = dashboard_model.Dashboard(
        created_by=users.get_current_user(),
        data=provided_data).put().id()

    resp = self.app.post(url='/dashboard/copy',
                         params=[('id', dashboard_id)])
    new_id = resp.json['id']
    expected_response = {'id': new_id}

    self.assertNotEqual(new_id, dashboard_id)
    self.assertDictEqual(resp.json, expected_response)

  def testCopyAndRenameDashboard(self):
    provided_data = '{{"title": "foo", "owner": "{owner:}"}}'.format(
        owner=DEFAULT_USERS[0]['email'])
    new_title = 'bar'

    dashboard_id = dashboard_model.Dashboard(
        created_by=users.get_current_user(),
        data=provided_data).put().id()

    resp = self.app.post(url='/dashboard/copy',
                         params=[('id', dashboard_id),
                                 ('title', new_title)])
    new_id = resp.json['id']
    expected_response = {'id': new_id}

    self.assertNotEqual(new_id, dashboard_id)
    self.assertDictEqual(resp.json, expected_response)

  def testGetUserEmailFromOwner(self):
    expected_email = 'test01@google.com'
    actual_user = user_validator.UserValidator.GetUserFromEmail(
        'test01@google.com')
    self.assertEquals(actual_user.email(), expected_email)

  def testGetCanonicalEmail(self):
    expected_email = 'test01@mydomain.com'
    actual_email = dashboard_model.Dashboard.GetCanonicalEmail('test01')
    self.assertEquals(actual_email, expected_email)

  def testEditDashboard(self):
    original_data = '{"title": "foo"}'

    dashboard_id = dashboard_model.Dashboard(
        created_by=users.get_current_user(),
        data=original_data).put().id()

    updated_data = {"id": dashboard_id, "writers": [], "title": "bar",
                    "owner": DEFAULT_USERS[0]['email']}
    self.app.post(url='/dashboard/edit',
                  status=200,
                  params=[('id', dashboard_id),
                          ('data', json.dumps(updated_data))])
    stored_dashboard = dashboard_model.Dashboard.get_by_id(dashboard_id)

    self.assertJsonEqual(stored_dashboard.data, updated_data)

  def testEditDashboardOwner(self):
    original_data = '{"title": "untitled"}'
    new_owner = 'newowner@mydomain.com'

    expected_created_date = datetime.datetime(2014, 2, 20, 2, 36, 10)
    self.mock_datetime.datetime.now.return_value = expected_created_date

    stored_dashboard = dashboard_model.Dashboard(
        created_by=users.get_current_user(),
        data=original_data)
    dashboard_id = stored_dashboard.put().id()

    self.assertEqual(stored_dashboard.created_date, expected_created_date)
    self.assertEqual(stored_dashboard.modified_date, expected_created_date)

    expected_modified_date = datetime.datetime(2015, 10, 15, 5, 7, 42)
    self.mock_datetime.datetime.now.return_value = expected_modified_date

    updated_data = (
        '{{"title": "untitled", "owner": "{owner:}"}}').format(
        owner=new_owner)
    self.app.post(url='/dashboard/edit-owner',
                  status=200,
                  params=[('id', dashboard_id),
                          ('email', new_owner)])
    stored_dashboard = dashboard_model.Dashboard.get_by_id(dashboard_id)
    self.assertJsonEqual(stored_dashboard.data, updated_data)
    self.assertEqual(stored_dashboard.created_date, expected_created_date)
    self.assertEqual(stored_dashboard.modified_date, expected_modified_date)

  def testEditDashboardOwnerWithoutDomain(self):
    nodomain_owner = 'newowner'
    new_owner = 'newowner@mydomain.com'

    original_data = '{{"title": "untitled", "owner": "{owner:}"}}'.format(
        owner=nodomain_owner)
    dashboard_id = dashboard_model.Dashboard(
        created_by=users.get_current_user(),
        data=original_data).put().id()
    expected_data = (
        '{{"title": "untitled", "owner": "{owner:}"}}').format(
        owner=new_owner)

    self.app.post(url='/dashboard/edit-owner',
                  status=200,
                  params=[('id', dashboard_id),
                          ('email', nodomain_owner)])
    stored_dashboard = dashboard_model.Dashboard.get_by_id(dashboard_id)
    self.assertJsonEqual(stored_dashboard.data, expected_data)

  def testViewDashboardMissingParameters(self):
    expected_response = {'message': 'The "id" parameter is required.'}

    resp = self.app.get(url='/dashboard/view', status=400)
    self.assertEqual(resp.json, expected_response)

  def testCreateDashboardMissingParameters(self):
    expected_response = {'message': 'The "data" parameter is required.'}

    resp = self.app.post(url='/dashboard/create', status=400)
    self.assertEqual(resp.json, expected_response)

  def testEditDashboardMissingParameters(self):
    expected_response_id = {'message': 'The "id" parameter is required.'}
    expected_response_data = {
        'message': 'The "data" parameter is required.'}

    resp = self.app.post(url='/dashboard/edit', status=400)
    self.assertEqual(resp.json, expected_response_id)

    dashboard_model.Dashboard(created_by=users.get_current_user()).put()

    resp = self.app.post(url='/dashboard/edit',
                         status=400,
                         params=[('id', 1)])
    self.assertEqual(resp.json, expected_response_data)

  def testViewDashboardInvalidParameters(self):
    expected_response = {'message': ('The "id" parameter must be an '
                                     'integer.  Found "invalid".')}

    resp = self.app.get(url='/dashboard/view',
                        status=400,
                        params=[('id', 'invalid')])
    self.assertEqual(resp.json, expected_response)

  def testCreateDashboardInvalidParameters(self):
    message = 'The "data" parameter must be valid JSON.  Found:\ninvalid'
    expected_response = {'message': message}

    resp = self.app.post(url='/dashboard/create',
                         status=400,
                         params=[('data', 'invalid')])
    self.assertEqual(resp.json, expected_response)

  def testEditDashboardInvalidParameters(self):
    message = 'The "id" parameter must be an integer.  Found "invalid".'
    expected_response = {'message': message}

    dashboard_model.Dashboard(created_by=users.get_current_user()).put()

    resp = self.app.post(url='/dashboard/edit',
                         status=400,
                         params=[('id', 'invalid'),
                                 ('data', {'data': 'valid'})])
    self.assertEqual(resp.json, expected_response)

    message = 'The "data" parameter must be valid JSON.  Found:\ninvalid'
    expected_response = {'message': message}

    resp = self.app.post(url='/dashboard/edit',
                         status=400,
                         params=[('id', 1),
                                 ('data', 'invalid')])
    self.assertEqual(resp.json, expected_response)

  def testViewDashboardMissingId(self):
    expected_response = {'message': 'No dashboard with ID 1 was found.'}

    resp = self.app.get(url='/dashboard/view',
                        status=400,
                        params=[('id', 1)])
    self.assertEqual(resp.json, expected_response)

  def testEditDashboardMissingId(self):
    expected_response = {'message': 'No dashboard with ID 1 was found.'}

    resp = self.app.post(url='/dashboard/edit',
                         status=400,
                         params=[('id', 1),
                                 ('data', '{"foo": "bar"}')])
    self.assertEqual(resp.json, expected_response)

  def testViewDashboardInvalidData(self):
    provided_data = 'INVALID'
    message = ('The "data" field in dashboard row 1 must be valid JSON.  '
               'Found:\nINVALID')
    expected_response = {'message': message}

    dashboard_id = dashboard_model.Dashboard(data=provided_data).put().id()
    resp = self.app.get(url='/dashboard/view',
                        status=400,
                        params=[('id', dashboard_id)])
    self.assertDictEqual(resp.json, expected_response)

  def testListDashboards(self):
    provided_data_1 = '{{"title": "foo", "owner": "{owner:}"}}'.format(
        owner=DEFAULT_USERS[0]['email'])
    provided_data_2 = '{{"title": "boo", "owner": "{owner:}"}}'.format(
        owner=DEFAULT_USERS[0]['email'])
    expected_titles = ['bar', 'foo']

    dashboard_model.Dashboard(data=provided_data_1, title='foo').put()
    dashboard_model.Dashboard(data=provided_data_2, title='bar').put()

    resp = self.app.get(url='/dashboard/list',
                        status=200)
    self.assertEqual(len(resp.json['data']), 2)
    self.assertEqual(
        [dashboard['title'] for dashboard in resp.json['data']],
        expected_titles)

  def testListDashboardWithoutOwner(self):
    provided_data = '{"title": "foo"}'
    expected_titles = ['foo']

    dashboard_id = dashboard_model.Dashboard(
        data=provided_data, title='foo').put().id()

    resp = self.app.get(url='/dashboard/list',
                        status=200)
    self.assertEqual(len(resp.json['data']), 1)
    self.assertEqual(
        [dashboard['title'] for dashboard in resp.json['data']],
        expected_titles)


if __name__ == '__main__':
  unittest.main()
