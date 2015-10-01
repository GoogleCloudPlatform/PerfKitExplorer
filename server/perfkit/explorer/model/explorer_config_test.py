import unittest

from google.appengine.ext import ndb
from google.appengine.ext import testbed

from perfkit.common import gae_test_util
from perfkit.explorer.model import explorer_config


class ExplorerConfigModelTest(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

  def tearDown(self):
    self.testbed.deactivate()

  def testGetDefault(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)

    expected_config = {
        'default_project': explorer_config.DEFAULT_PROJECT,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION,
        'grant_save_to_public': False,
        'grant_view_to_public': False,
        'grant_query_to_public': False,
    }

    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testUpdateRejectForNonAdmin(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=False)

    provided_data = {'default_project': 'MODIFIED_PROJECT'}

    self.assertRaises(
        explorer_config.SecurityError,
        explorer_config.ExplorerConfigModel.Update,
        provided_data)

  def testUpdateDefault(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    provided_project = 'MODIFIED_PROJECT'
    provided_data = {
        'default_project': provided_project,
        'grant_save_to_public': True
    }

    expected_config = {
        'default_project': provided_project,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION,
        'grant_save_to_public': True,
        'grant_view_to_public': False,
        'grant_query_to_public': False,
    }

    explorer_config.ExplorerConfigModel.Update(provided_data)
    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testUpdateExisting(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)

    provided_project = 'EXPECTED_PROJECT'
    provided_data = {
        'default_project': provided_project,
        'grant_view_to_public': True
    }

    initial_config = explorer_config.ExplorerConfigModel.Get()
    self.assertNotEqual(initial_config.default_project, provided_project)
    expected_config = {
        'default_project': provided_project,
        'default_dataset': initial_config.default_dataset,
        'default_table': initial_config.default_table,
        'analytics_key': initial_config.analytics_key,
        'cache_duration': initial_config.cache_duration,
        'grant_save_to_public': False,
        'grant_view_to_public': True,
        'grant_query_to_public': False,
    }

    explorer_config.ExplorerConfigModel.Update(provided_data)

    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testLoad(self):
    gae_test_util.setCurrentUser(self.testbed, is_admin=True)
    provided_project = 'MODIFIED_PROJECT'
    provided_data = {
        'default_project': provided_project,
        'grant_query_to_public': True,
    }

    expected_config = {
        'default_project': provided_project,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION,
        'grant_save_to_public': False,
        'grant_view_to_public': False,
        'grant_query_to_public': True,
    }

    initial_config_row = explorer_config.ExplorerConfigModel.Get()
    self.assertEquals(
        initial_config_row.default_project, explorer_config.DEFAULT_PROJECT)

    initial_config_row.Load(provided_data)

    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(initial_config_row.to_dict(), actual_config)
    self.assertEquals(expected_config, actual_config)
