import unittest

from perfkit.common import http_util


class MockRequest(object):
  values = {}

  def __init__(self, values):
    self.values = values

  def get(self, key, default=None):
    return self.values.get(key) or default


class DashboardTest(unittest.TestCase):

  def testGetString(self):
    expectedValue = 'TEST_VALUE'

    params = MockRequest({
        'name': expectedValue
    })

    actualValue = http_util.GetStringParam(params, 'name')
    self.assertEqual(expectedValue, actualValue)

  def testGetStringNotProvided(self):
    expectedValue = 'TEST_VALUE'

    params = MockRequest({
        'name': expectedValue
    })

    actualValue = http_util.GetStringParam(params, 'name')
    self.assertEqual(expectedValue, actualValue)

  def testGetStringDefault(self):
    expectedValue = 'TEST_VALUE'

    params = MockRequest({})

    actualValue = http_util.GetStringParam(params, 'name',
                                           default=expectedValue)
    self.assertEqual(expectedValue, actualValue)

  def testGetStringOptional(self):
    expectedValue = None

    params = MockRequest({})

    actualValue = http_util.GetStringParam(params, 'name', required=False)
    self.assertEqual(expectedValue, actualValue)

  def testGetStringRequiredNotProvided(self):
    params = MockRequest({
        'existing': 'value'
    })

    self.assertRaises(http_util.ParameterError,
                      http_util.GetStringParam,
                      params, 'name', True)

  def testGetStringRequiredDefaultOverride(self):
    expectedValue = 'TEST_VALUE'
    params = MockRequest({})

    self.assertEqual(expectedValue,
                     http_util.GetStringParam(
<<<<<<< HEAD
                       params, 'name', True, expectedValue))
=======
                         params, 'name', True, expectedValue))
>>>>>>> 2d825fa... =Move conversion functions to http_util, fix tests in dashboard, pages and http_util tests.

  def testGetBooleanTrue(self):
    providedValue = '1'
    expectedValue = True

    params = MockRequest({'isopen': providedValue})

    self.assertEquals(expectedValue,
                      http_util.GetBoolParam(params, 'isopen'))

  def testGetBooleanFalse(self):
    providedValue = '0'
    expectedValue = False

    params = MockRequest({'isopen': providedValue})

    self.assertEquals(expectedValue,
                      http_util.GetBoolParam(params, 'isopen'))

  def testGetBooleanInvalid(self):
    providedValue = 'invalid'

    params = MockRequest({'isopen': providedValue})

    self.assertRaises(http_util.ParameterError,
                      http_util.GetBoolParam,
                      params, 'isopen')

  def testGetJSON(self):
    providedValue = '{"name": "value"}'
    expectedValue = {'name': 'value'}

    params = MockRequest({'data': providedValue})

    self.assertEquals(expectedValue,
                      http_util.GetJsonParam(params, 'data'))

  def testGetJSONInvalid(self):
    providedValue = 'invalid'

    params = MockRequest({'data': providedValue})

    self.assertRaises(http_util.ParameterError,
                      http_util.GetJsonParam,
                      params, 'data')
