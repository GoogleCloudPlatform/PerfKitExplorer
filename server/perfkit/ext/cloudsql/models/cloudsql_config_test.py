import unittest

from google.appengine.ext import ndb
from google.appengine.ext import testbed

from perfkit.common import gae_test_util
from perfkit.ext.cloudsql.models import cloudsql_config


class CloudsqlConfigModelTest(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDefault(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    expected_config = {
        'username': None,
        'password': None
    }

    actual_config = cloudsql_config.CloudsqlConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testGetRejectForNonAdmin(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)

    self.assertRaises(
        cloudsql_config.SecurityError,
        cloudsql_config.CloudsqlConfigModel.Get)

  def testUpdateRejectForNonAdmin(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)

    provided_data = {'username': 'MODIFIED_USERNAME'}

    self.assertRaises(
        cloudsql_config.SecurityError,
        cloudsql_config.CloudsqlConfigModel.Update,
        provided_data)

  def testUpdateDefault(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    provided_username = 'MODIFIED_USERNAME'
    provided_data = {
        'username': provided_username
    }

    expected_config = {
        'username': provided_username,
        'password': None
    }

    cloudsql_config.CloudsqlConfigModel.Update(provided_data)
    actual_config = cloudsql_config.CloudsqlConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testUpdateExisting(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    provided_username = 'MODIFIED_USERNAME'
    provided_password = 'MODIFIED_PASSWORD'

    provided_data = {
        'username': provided_username,
        'password': provided_password
    }

    initial_config = cloudsql_config.CloudsqlConfigModel.Get()
    self.assertNotEqual(initial_config.username, provided_username)
    expected_config = {
        'username': provided_username,
        'password': provided_password
    }

    cloudsql_config.CloudsqlConfigModel.Update(provided_data)

    actual_config = cloudsql_config.CloudsqlConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testLoad(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    provided_username = 'MODIFIED_USERNAME'
    provided_password = 'MODIFIED_PASSWORD'

    provided_data = {
        'username': provided_username,
        'password': provided_password
    }

    expected_config = {
        'username': provided_username,
        'password': provided_password
    }

    initial_config_row = cloudsql_config.CloudsqlConfigModel.Get()
    self.assertIsNone(initial_config_row.username, None)

    initial_config_row.Load(provided_data)

    actual_config = cloudsql_config.CloudsqlConfigModel.Get().to_dict()

    self.assertEquals(initial_config_row.to_dict(), actual_config)
    self.assertEquals(expected_config, actual_config)
