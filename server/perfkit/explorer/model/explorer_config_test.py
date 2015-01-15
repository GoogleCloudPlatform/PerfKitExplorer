import unittest

from google.appengine.ext import testbed

from perfkit.explorer.model import explorer_config


ADMIN_USER = {
  'USER_EMAIL': 'admin@example.com',
  'USER_ID': '123',
  'USER_IS_ADMIN': '1'}

NORMAL_USER = {
  'USER_EMAIL': 'user@example.com',
  'USER_ID': '456',
  'USER_IS_ADMIN': '0'}


class ExplorerConfigModelTest(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_user_stub()

  def tearDown(self):
    self.testbed.deactivate()

  def setAdminStatus(self, is_admin):
    if is_admin:
      user_env = ADMIN_USER
    else:
      user_env = NORMAL_USER

    self.testbed.setup_env(overwrite = True, **user_env)

  def testGetDefault(self):
    self.setAdminStatus(is_admin=False)

    expected_config = {
        'default_project': explorer_config.DEFAULT_PROJECT,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION
    }

    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testUpdateRejectForNonAdmin(self):
    self.setAdminStatus(is_admin=False)

    provided_data = {'default_project': 'MODIFIED_PROJECT'}

    self.assertRaises(
      explorer_config.SecurityError,
      explorer_config.ExplorerConfigModel.Update,
      provided_data)

  def testUpdateDefault(self):
    self.setAdminStatus(is_admin=True)

    provided_project = 'MODIFIED_PROJECT'
    provided_data = {'default_project': provided_project}

    expected_config = {
        'default_project': provided_project,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION
    }

    explorer_config.ExplorerConfigModel.Update(provided_data)
    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testUpdateExisting(self):
    self.setAdminStatus(is_admin=True)

    provided_project = 'MODIFIED_PROJECT'
    provided_data = {'default_project': provided_project}

    expected_config = {
        'default_project': provided_project,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION
    }

    initial_config = explorer_config.ExplorerConfigModel.Get()
    self.assertEquals(
        initial_config.default_project, explorer_config.DEFAULT_PROJECT)

    explorer_config.ExplorerConfigModel.Update(provided_data)

    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(expected_config, actual_config)

  def testLoad(self):
    self.setAdminStatus(is_admin=True)
    provided_project = 'MODIFIED_PROJECT'
    provided_data = {'default_project': provided_project}

    expected_config = {
        'default_project': provided_project,
        'default_dataset': explorer_config.DEFAULT_DATASET,
        'default_table': explorer_config.DEFAULT_TABLE,
        'analytics_key': explorer_config.DEFAULT_ANALYTICS_KEY,
        'cache_duration': explorer_config.DEFAULT_CACHE_DURATION
    }

    initial_config_row = explorer_config.ExplorerConfigModel.Get()
    self.assertEquals(
        initial_config_row.default_project, explorer_config.DEFAULT_PROJECT)

    initial_config_row.Load(provided_data)

    actual_config = explorer_config.ExplorerConfigModel.Get().to_dict()

    self.assertEquals(initial_config_row.to_dict(), actual_config)
    self.assertEquals(expected_config, actual_config)
