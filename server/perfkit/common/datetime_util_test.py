"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Unit test & usage docs for the datetime_util package methods."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

from datetime import datetime

import unittest

import datetime_util

SAMPLE_AS_TIMESTAMP = 1352678400
SAMPLE_AS_DATETIME = datetime(2012, 11, 12)


class DateTimeUtilTest(unittest.TestCase):
  """Tests the methods in the datetime_util package."""

  def testTimestampToDateTime(self):
    """Verifies conversion from an integer timestamp to a datetime."""
    actual_datetime = datetime_util.TimestampToDateTime(SAMPLE_AS_TIMESTAMP)
    self.assertEqual(actual_datetime, SAMPLE_AS_DATETIME)

  def testDateTimeToTimestamp(self):
    """Verifies conversion from an integer timestamp to a datetime."""
    actual_timestamp = datetime_util.DateTimeToTimestamp(SAMPLE_AS_DATETIME)

    self.assertEqual(actual_timestamp, SAMPLE_AS_TIMESTAMP)

  def testDateTimeWithoutTime(self):
    """Verifies returning a datetime, stripped of it's time specifier."""
    source_datetime = datetime(2012, 12, 1, 11, 32, 56)
    expected_datetime = datetime(2012, 12, 1)

    actual_datetime = datetime_util.DateTimeWithoutTime(source_datetime)
    self.assertEqual(actual_datetime, expected_datetime)

  def testStringToDateTime(self):
    """Verifies converting a string to a DateTime with default format."""
    provided_datetime = '2012-11-01'
    expected_datetime = datetime(2012, 11, 1)

    actual_datetime = datetime_util.StringToDateTime(provided_datetime)
    self.assertEqual(actual_datetime, expected_datetime)

  def testStringToDateTimeWithCustomFormat(self):
    """Verifies converting a string to a DateTime with a custom formatter."""
    provided_datetime = '11-01-2012'
    expected_datetime = datetime(2012, 11, 1)

    actual_datetime = datetime_util.StringToDateTime(
        provided_datetime)
    self.assertEqual(actual_datetime, expected_datetime)

  def testInvalidStringToDateTime(self):
    """Verifies behavior converting an invalid string with default format."""
    provided_datetime = 'INVALID_STRING'

    self.assertRaisesRegexp(
        ValueError,
        'unknown string format',
        datetime_util.StringToDateTime, provided_datetime)


if __name__ == '__main__':
  unittest.main()
