"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Unit tests for LabelManager."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import label_manager
import unittest


SOURCE_RAW_DATA = [
    {'count': 3,
     'labels': '|color:blue|,|size:large|,|shape:circle|,|state:solid|'},
    {'count': 1,
     'labels': '|shape:circle|,|color:red|,|size:small|,|state:gas|'},
    {'count': 1,
     'labels': '|color:green|,|shape:circle|,|size:large|,|color:red|'}
]

EXPECTED_DATA = [
    {'name': 'color',
     'count': 6,
     'values': [
         {'name': 'blue', 'count': 3},
         {'name': 'red', 'count': 2},
         {'name': 'green', 'count': 1},
     ]},
    {'name': 'shape',
     'count': 5,
     'values': [
         {'name': 'circle', 'count': 5},
     ]},
    {'name': 'size',
     'count': 5,
     'values': [
         {'name': 'large', 'count': 4},
         {'name': 'small', 'count': 1},
     ]},
    {'name': 'state',
     'count': 4,
     'values': [
         {'name': 'solid', 'count': 3},
         {'name': 'gas', 'count': 1},
     ]},
]


class LabelManagerTest(unittest.TestCase):
  """Tests event structure and storage of the LabelManager class."""

  def _GetManager(self, data=None):
    labels = label_manager.LabelManager()

    if data:
      for row in data:
        labels.ImportString(src=row['labels'], count=row['count'])

    return labels

  def testInitialize(self):
    """Tests basic execution of a method."""
    actual = label_manager.LabelManager()

    self.assertEqual(actual.labels, [])

  def testVerifyLabels(self):
    actual = self._GetManager(SOURCE_RAW_DATA)

    self.assertEqual(len(actual.labels), 4)
    self.assertEqual(actual.labels, EXPECTED_DATA)
    self.assertEqual(actual.GetLabel('color')['count'], 6)

  def testBadLabelFormat(self):
    badstart_src = [{'count': 1,
                     'labels': 'shape:circle|,|color:blue|,|important|'}]
    badend_src = [{'count': 1,
                   'labels': '|shape:circle|,|color:blue|,|important'}]

    self.assertRaises(
        label_manager.UnexpectedFormatError,
        self._GetManager,
        data=badstart_src)

    self.assertRaises(
        label_manager.UnexpectedFormatError,
        self._GetManager,
        data=badend_src)

  def testVerifyValues(self):
    actual = self._GetManager(SOURCE_RAW_DATA)

    self.assertEqual(actual.labels, EXPECTED_DATA)
    label = actual.GetLabel('state')
    self.assertIsNotNone(label)

    self.assertIsNotNone(label['values'])
    self.assertEqual(len(label['values']), 2)

    value = actual.GetValue(label, 'solid')
    self.assertIsNotNone(value)
    self.assertEqual(value['count'], 3)

    value = actual.GetValue(label, 'gas')
    self.assertIsNotNone(value)
    self.assertEqual(value['count'], 1)

  def testAddLabel(self):
    mgr = label_manager.LabelManager()
    expected_label1 = 'label1'
    expected_label2 = 'label2'
    expected_value1 = 'value1'
    expected_value2 = 'value2'

    self.assertEqual(len(mgr.labels), 0)

    mgr.AddLabel(expected_label1)
    self.assertEqual(
        mgr.labels,
        [{'name': 'label1', 'count': 1,
          'values': []}])

    mgr.AddLabel(expected_label1, expected_value1)
    self.assertEqual(
        mgr.labels,
        [{'name': 'label1', 'count': 2,
          'values': [{'name': 'value1', 'count': 1}]}])

    mgr.AddLabel(expected_label1, expected_value1, 3)
    self.assertEqual(
        mgr.labels,
        [{'name': 'label1', 'count': 5,
          'values': [{'name': 'value1', 'count': 4}]}])

    mgr.AddLabel(expected_label1, expected_value2)
    self.assertEqual(
        mgr.labels,
        [{'name': 'label1', 'count': 6,
          'values': [{'name': 'value1', 'count': 4},
                     {'name': 'value2', 'count': 1}]}])

    mgr.AddLabel(expected_label2, expected_value1, 3)
    self.assertEqual(
        mgr.labels,
        [{'name': 'label1', 'count': 6,
          'values': [{'name': 'value1', 'count': 4},
                     {'name': 'value2', 'count': 1}]},
         {'name': 'label2', 'count': 3,
          'values': [{'name': 'value1', 'count': 3}]}])


if __name__ == '__main__':
  unittest.main()
