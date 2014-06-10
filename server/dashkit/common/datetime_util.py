"""Utility functions for dealing with dates in the Explorer app."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import calendar
from datetime import datetime
from dateutil import parser


DATETIME_FORMAT = '%Y-%m-%d'


def TimestampToDateTime(value):
  """Returns a datetime from an integer timestamp.

  Args:
    value: An integer representing the number of seconds since the epoch.

  Returns:
    A datetime presentation of the timestamp.
  """
  return datetime.utcfromtimestamp(float(value))


def DateTimeToTimestamp(value):
  """Returns an integer timestamp from a datetime.

  Args:
    value: The datetime to convert.

  Returns:
    An integer representing the number of seconds since the epoch.
  """
  return int(calendar.timegm(value.timetuple()))


def DateTimeWithoutTime(value):
  """Returns a datetime value, stripped of the time component.

  Args:
    value: A datetime to convert.

  Returns:
    A datetime with the time set to midnight (00:00).
  """
  return datetime(value.year, value.month, value.day)


def StringToDateTime(value):
  """Returns a datetime from a string.

  Args:
    value: The string to convert.

  Returns:
    A datetime based on the supplied value.
  """
  return parser.parse(value)


def StringToFirstSecond(value, overwrite_time=False):
  """Returns a datetime with the time value 00:00:00 from a string.

  Args:
    value: The string to convert.
    overwrite_time: If True, the time will be overwritten, even if provided.
        If false, if the time is specified it will be preserved.

  Returns:
    A datetime based on the supplied value.
  """
  date = StringToDateTime(value)

  if overwrite_time or not date.hour:
    return datetime(date.year, date.month, date.day, 0, 0, 0, 0)
  else:
    return date


def StringToLastSecond(value, overwrite_time=False):
  """Returns a datetime representing the last millisecond of a date.

  Args:
    value: The string to convert.
    overwrite_time: If True, the time will be overwritten, even if provided.
        If false, if the time is specified it will be preserved.

  Returns:
    A datetime based on the supplied value.
  """
  date = StringToDateTime(value)

  if overwrite_time or not date.hour:
    return datetime(date.year, date.month, date.day, 23, 59, 59, 999999)
  else:
    return date
