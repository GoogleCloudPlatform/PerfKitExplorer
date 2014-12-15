import unittest
<<<<<<< HEAD
<<<<<<< HEAD

<<<<<<< HEAD
from google.appengine.ext import testbed

from perfkit.explorer.model import dashboard
=======
=======

>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
from google.appengine.api import memcache
from google.appengine.ext import ndb
=======
>>>>>>> 083b3ae... =Fix flake8 issues.
from google.appengine.ext import testbed

<<<<<<< HEAD

class VersionedDataModel(ndb.Model):
  """A model class used for testing."""
  data = ndb.JsonProperty()
  version = ndb.IntegerProperty()


class VersionedEntity(ndb.Model):
  current_data = lambda self: self.getCurrentData()
  current_version = ndb.IntegerProperty(default=0, required=True)
  versions = ndb.StructuredProperty(VersionedDataModel, repeated=True)


  def __init__(self, *args, **kwargs):
    super(VersionedEntity, self).__init__(*args, **kwargs)
    self.addVersion(version=1, data={'title': 'Original Version'})


  def addVersion(self, data, version=None):
    if version:
      self.current_version = version
    else:
      self.current_version = self.current_version + 1

    self.versions.append(VersionedDataModel(version=self.current_version, data=data))


  def getCurrentData(self):
    if self.current_version:
      raise NotImplementedError()
    else:
      return None
>>>>>>> 426b929... Merge changes from stash.
=======
from perfkit.explorer.model import dashboard
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.


class DashboardTest(unittest.TestCase):

  def setUp(self):
<<<<<<< HEAD
<<<<<<< HEAD
    self.testbed = testbed.Testbed()
    self.testbed.activate()

=======
    # First, create an instance of the Testbed class.
=======
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
    self.testbed = testbed.Testbed()
    self.testbed.activate()
<<<<<<< HEAD
    # Next, declare which service stubs you want to use.
>>>>>>> 426b929... Merge changes from stash.
=======

>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

  def tearDown(self):
    self.testbed.deactivate()

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
  def testGetDashboard(self):
    provided_data = '{"type": "sample"}'

    dashboard_id = dashboard.Dashboard(data=provided_data).put().id()
    actual_dashboard = dashboard.Dashboard.GetDashboard(dashboard_id)

    self.assertEquals(provided_data, actual_dashboard.data)

  def testGetDashboardOptional(self):
    nonexistent_id = 12345
<<<<<<< HEAD
<<<<<<< HEAD
=======
    provided_data = '{"type": "sample"}'
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
=======
>>>>>>> 083b3ae... =Fix flake8 issues.

    actual_dashboard = dashboard.Dashboard.GetDashboard(nonexistent_id, False)

    self.assertIsNone(actual_dashboard)
<<<<<<< HEAD

  def testGetDashboardNotProvided(self):
    nonexistent_id = 12345

    self.assertRaises(dashboard.InitializeError,
                      dashboard.Dashboard.GetDashboard, nonexistent_id)
=======
  def testInsertEntity(self):
    dashboard = VersionedEntity()
    provided_data = {'title': 'New Version'}
=======
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.

  def testGetDashboardNotProvided(self):
    nonexistent_id = 12345

<<<<<<< HEAD
>>>>>>> 426b929... Merge changes from stash.
=======
    self.assertRaises(dashboard.InitializeError,
                      dashboard.Dashboard.GetDashboard, nonexistent_id)
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.
