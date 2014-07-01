"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Tests for big_query_result_pivot.
"""

import unittest

import big_query_result_pivot


class BigQueryResultPivotTest(unittest.TestCase):

  def testTransformWithDuplicateValues(self):
    reply = {
        'schema': {'fields': [
            {'name': 'date', 'type': 'STRING', 'mode': 'REQUIRED'},
            {'name': 'size', 'type': 'STRING', 'mode': 'REQUIRED'},
            {'name': 'cost', 'type': 'INTEGER', 'mode': 'REQUIRED'}
        ]},
        'rows': [
            {'f': [{'v': 'Jan 1'}, {'v': 'small'}, {'v': 25}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'medium'}, {'v': 32}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'large'}, {'v': 45}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'small'}, {'v': 25}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'medium'}, {'v': 35}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'large'}, {'v': 52}]},
        ]
    }

    pivot = big_query_result_pivot.BigQueryPivotTransformer(
        reply=reply, rows_name='date', columns_name='size', values_name='cost')
    self.assertRaises(big_query_result_pivot.DuplicateValueError,
                      pivot.Transform)

  def testTransform(self):
    reply = {
        'schema': {'fields': [
            {'name': 'date', 'type': 'STRING', 'mode': 'REQUIRED'},
            {'name': 'size', 'type': 'STRING', 'mode': 'REQUIRED'},
            {'name': 'cost', 'type': 'INTEGER', 'mode': 'REQUIRED'}
        ]},
        'rows': [
            {'f': [{'v': 'Jan 1'}, {'v': 'small'}, {'v': 25}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'medium'}, {'v': 32}]},
            {'f': [{'v': 'Jan 1'}, {'v': 'large'}, {'v': 45}]},
            {'f': [{'v': 'Feb 1'}, {'v': 'small'}, {'v': 25}]},
            {'f': [{'v': 'Feb 1'}, {'v': 'medium'}, {'v': 35}]},
            {'f': [{'v': 'Feb 1'}, {'v': 'large'}, {'v': 52}]},
        ]
    }

    expected_schema = {'fields': [
        {'name': 'date', 'type': 'STRING', 'mode': 'REQUIRED'},
        {'name': 'small', 'type': 'INTEGER', 'mode': 'NULLABLE'},
        {'name': 'medium', 'type': 'INTEGER', 'mode': 'NULLABLE'},
        {'name': 'large', 'type': 'INTEGER', 'mode': 'NULLABLE'}
    ]}
    expected_rows = [
        {'f': [{'v': 'Jan 1'}, {'v': 25}, {'v': 32}, {'v': 45}]},
        {'f': [{'v': 'Feb 1'}, {'v': 25}, {'v': 35}, {'v': 52}]}
    ]

    pivot = big_query_result_pivot.BigQueryPivotTransformer(
        reply=reply, rows_name='date', columns_name='size', values_name='cost')
    pivot.Transform()

    self.assertNotEqual(
        len(pivot.transformed_schema['fields']), 0,
        'No fields were returned.')

    actual_row_column = pivot.transformed_schema['fields'][0]
    expected_row_column = expected_schema['fields'][0]

    self.assertDictEqual(
        actual_row_column,
        expected_row_column)

    self.assertListEqual(
        pivot.transformed_schema['fields'], expected_schema['fields'])

    self.assertListEqual(
        pivot.transformed_rows, expected_rows)


if __name__ == '__main__':
  googletest.main()
