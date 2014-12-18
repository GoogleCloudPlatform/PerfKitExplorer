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
    expected_value = 'TEST_VALUE'

    params = MockRequest({
        'name': expected_value
    })

    actual_value = http_util.GetStringParam(params, 'name')
    self.assertEqual(expected_value, actual_value)

  def testGetStringNotProvided(self):
    expected_value = 'TEST_VALUE'

    params = MockRequest({
        'name': expected_value
    })

    actual_value = http_util.GetStringParam(params, 'name')
    self.assertEqual(expected_value, actual_value)

  def testGetStringDefault(self):
    expected_value = 'TEST_VALUE'

    params = MockRequest({})

    actual_value = http_util.GetStringParam(params, 'name',
                                           default=expected_value)
    self.assertEqual(expected_value, actual_value)

  def testGetStringOptional(self):
    expected_value = None

    params = MockRequest({})

    actual_value = http_util.GetStringParam(params, 'name', required=False)
    self.assertEqual(expected_value, actual_value)

  def testGetStringRequiredNotProvided(self):
    params = MockRequest({
        'existing': 'value'
    })

    self.assertRaises(http_util.ParameterError,
                      http_util.GetStringParam,
                      params, 'name', True)

  def testGetStringRequiredDefaultOverride(self):
    expected_value = 'TEST_VALUE'
    params = MockRequest({})

    self.assertEqual(expected_value,
                     http_util.GetStringParam(
                         params, 'name', True, expected_value))

  def testGetBooleanTrue(self):
    providedValue = '1'
    expected_value = True

    params = MockRequest({'isopen': providedValue})

    self.assertEquals(expected_value,
                      http_util.GetBoolParam(params, 'isopen'))

  def testGetBooleanFalse(self):
    providedValue = '0'
    expected_value = False

    params = MockRequest({'isopen': providedValue})

    self.assertEquals(expected_value,
                      http_util.GetBoolParam(params, 'isopen'))

  def testGetBooleanInvalid(self):
    providedValue = 'invalid'

    params = MockRequest({'isopen': providedValue})

    self.assertRaises(http_util.ParameterError,
                      http_util.GetBoolParam,
                      params, 'isopen')

  def testGetJSON(self):
    providedValue = '{"name": "value"}'
    expected_value = {'name': 'value'}

    params = MockRequest({'data': providedValue})

    self.assertEquals(expected_value,
                      http_util.GetJsonParam(params, 'data'))

  def testGetJSONInvalid(self):
    providedValue = 'invalid'

    params = MockRequest({'data': providedValue})

    self.assertRaises(http_util.ParameterError,
                      http_util.GetJsonParam,
                      params, 'data')
