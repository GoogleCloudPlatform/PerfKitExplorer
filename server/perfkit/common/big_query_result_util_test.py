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

Unit test for big_query_client_result_util."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import unittest

import big_query_result_util as util


class BigQueryClientResultUtilTest(unittest.TestCase):

  def testRowsToTemplateFormat(self):
    source_data = {
        'schema': {
            'fields': [{'name': 'string1', 'type': 'STRING'},
                       {'name': 'int1', 'type': 'INTEGER'},
                       {'name': 'float1', 'type': 'FLOAT'},
                       {'name': 'bool1', 'type': 'BOOLEAN'}]},
        'rows': [{'f': [{'v': 'foo'},
                        {'v': 23},
                        {'v': -42.35},
                        {'v': True}]},
                 {'f': [{'v': 'bar'},
                        {'v': 31},
                        {'v': 15.35},
                        {'v': False}]}]}

    expected_data = [{'string1': 'foo',
                      'int1': 23,
                      'float1': -42.35,
                      'bool1': True},
                     {'string1': 'bar',
                      'int1': 31,
                      'float1': 15.35,
                      'bool1': False}]

    actual = util.ReplyFormatter.RowsToTemplateFormat(source_data)

    self.assertEqual(actual, expected_data)

  def testRowsToDataTableFormat(self):
    source_data = {
        'schema': {
            'fields': [{'name': 'string1', 'type': 'STRING'},
                       {'name': 'int1', 'type': 'INTEGER'},
                       {'name': 'float1', 'type': 'FLOAT'},
                       {'name': 'bool1', 'type': 'BOOLEAN'}]},
        'rows': [{'f': [{'v': 'foo'},
                        {'v': 23},
                        {'v': -42.35},
                        {'v': True}]},
                 {'f': [{'v': 'bar'},
                        {'v': 31},
                        {'v': 15.35},
                        {'v': False}]}]}

    expected_data = {
        'cols': [{'id': 'string1', 'label': 'string1', 'type': 'string'},
                 {'id': 'int1', 'label': 'int1', 'type': 'number'},
                 {'id': 'float1', 'label': 'float1', 'type': 'number'},
                 {'id': 'bool1', 'label': 'bool1', 'type': 'boolean'}
                ],
        'rows': [{'c': [{'v': 'foo'}, {'v': 23}, {'v': -42.35}, {'v': True}]},
                 {'c': [{'v': 'bar'}, {'v': 31}, {'v': 15.35}, {'v': False}]}
                ]
    }

    actual = util.ReplyFormatter.RowsToDataTableFormat(source_data)

    self.assertEqual(actual, expected_data)

  def testConvertValuesToTypedData(self):
    source_data = {
        'schema': {
            'fields': [{'name': 'string1', 'type': 'STRING'},
                       {'name': 'int1', 'type': 'INTEGER'},
                       {'name': 'float1', 'type': 'FLOAT'},
                       {'name': 'bool1', 'type': 'BOOLEAN'}]},
        'rows': [{'f': [{'v': 'foo'},
                        {'v': '23'},
                        {'v': '-42.35'},
                        {'v': 'False'}]}]}

    expected_values = [{'v': 'foo'},
                       {'v': 23},
                       {'v': -42.35},
                       {'v': False}]

    util.ReplyFormatter.ConvertValuesToTypedData(source_data)

    self.assertEqual(source_data['rows'][0]['f'], expected_values)

  def testGetTypedValue(self):
    self.assertEqual('foo',
                     util.GetTypedValue('STRING', 'foo'))

    self.assertEqual(23,
                     util.GetTypedValue('INTEGER', '23'))

    self.assertEqual(-42.35,
                     util.GetTypedValue('FLOAT', '-42.35'))

    self.assertEqual(False,
                     util.GetTypedValue('BOOLEAN', 'false'))

    self.assertRaises(util.NotSupportedError,
                      util.GetTypedValue, 'UNSUPPORTED', '50')


if __name__ == '__main__':
  unittest.main()
