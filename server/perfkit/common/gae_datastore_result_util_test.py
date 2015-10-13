"""Copyright 2015 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Unit test for gae_datastore_result_util."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import unittest
import logging

import gae_datastore_result_util as util


class GAEDataStoreResultUtilTest(unittest.TestCase):

  def testFormatGqlResult(self):
    source_data = [
      {'color': 'blue', 'shape': 'circle'},
      {'color': 'red', 'shape': 'square'}
    ]

    expected_data = [
      ['color', 'shape'],
      ['blue', 'circle'],
      ['red', 'square']
    ]

    logging.error(util)
    actual = util.ResultFormatter.FormatGQLResult(source_data)

    self.assertEqual(actual, expected_data)


if __name__ == '__main__':
  unittest.main()
