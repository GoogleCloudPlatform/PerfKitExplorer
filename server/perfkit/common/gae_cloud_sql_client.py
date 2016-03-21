"""Copyright 2016 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A client for accessing Cloud SQL from appengine.
"""

__author__ = 'klausw@google.com (Klaus Weidner)'

import MySQLdb
import datetime
import logging
import os

from perfkit.common import big_query_client

# Setting up readonly user rights, assumes the 'readonly' user already exists:
#
# mysql> revoke all privileges, grant option from readonly@localhost;
# mysql> grant select on mystuff.* to readonly@localhost;
# mysql> show grants for readonly@localhost;
#------------------------------------------------------------------------------+
# Grants for readonly@localhost                                                |
#------------------------------------------------------------------------------+
# GRANT USAGE ON *.* TO 'readonly'@'localhost' IDENTIFIED BY PASSWORD <secret> |
# GRANT SELECT ON `mystuff`.* TO 'readonly'@'localhost'                        |
#------------------------------------------------------------------------------+

# TODO(klausw): The password isn't needed according to docs, but I can't get it
# working without it. A hardcoded password seems ok in this case since access
# is limited to 'localhost' and also restricted by appengine application ID.
DB_USER = 'readonly'
DB_PASSWORD = 'appengine'

SQL_TYPE_TO_BQ_TYPE = {
  MySQLdb.FIELD_TYPE.VARCHAR: 'STRING',
  MySQLdb.FIELD_TYPE.CHAR: 'STRING',
  MySQLdb.FIELD_TYPE.STRING: 'STRING',
  MySQLdb.FIELD_TYPE.TINY: 'INTEGER',
  MySQLdb.FIELD_TYPE.SHORT: 'INTEGER',
  MySQLdb.FIELD_TYPE.LONG: 'INTEGER',
  MySQLdb.FIELD_TYPE.LONGLONG: 'INTEGER',
  MySQLdb.FIELD_TYPE.FLOAT: 'FLOAT',
  MySQLdb.FIELD_TYPE.DOUBLE: 'FLOAT',
  MySQLdb.FIELD_TYPE.DATE: 'TIMESTAMP',
  MySQLdb.FIELD_TYPE.DATETIME: 'TIMESTAMP',
}


class CloudSqlError(big_query_client.BigQueryError):
  def __init__(self, message, query=None):
    super(CloudSqlError, self).__init__(message, query)


def ConvertCloudSqlToBigQuery(rows_in, schema_tuples):
  """Converts data returned by Cloud SQL to BigQuery result format.

  Args:
    rows_in: Sequence of tuples, each contains data for one row. Example:
        ((1456530028.0, u'GCP', u'n1-standard-64', u'us-central1-c', 834.0),
         (1456530088.4, u'GCP', u'n1-standard-64', u'us-central1-c', 818.0),
         (1456530039.2, u'GCP', u'n1-standard-4', u'europe-west1-b', 586.0))
    schema_tuples: Schema data including column names and types. Example:
        (('timestamp', 5, 17, 22, 22, 31, 1),
         ('cloud', 254, 3, 36, 36, 31, 1),
         ('machine_type', 254, 14, 42, 42, 0, 1),
         ('zone', 254, 14, 66, 66, 0, 1),
         ('value', 5, 4, 22, 22, 31, 1))
  Returns:
    Dict containing rows, schema, and other metadata as used by the BigQuery
    backend.
  """
  # TODO(klausw): refactor to use a more neutral common format.
  fields = []
  for field in schema_tuples:
    fields.append({
        'name': field[0],
        'type': SQL_TYPE_TO_BQ_TYPE.get(field[1], 'STRING'),
        'mode': 'NULLABLE',
    })

  rows_out = []
  for row in rows_in:
    row_out = []
    for val in row:
      # Convert datetime objects to isoformat strings. This assumes
      # that the server runs in UTC to create appropriate naive
      # objects and strings.
      if isinstance(val, datetime.datetime):
        val = val.isoformat(' ')
      elif isinstance(val, datetime.date):
        val = datetime.datetime.fromordinal(val.toordinal()).isoformat(' ')
      row_out.append({'v': val})
    rows_out.append({'f': row_out})

  result = {'schema': {'fields': fields},
            'rows': rows_out}
  result['jobReference'] = {'jobId': '0'}
  result['totalRows'] = len(rows_in)

  return result


class GaeCloudSqlClient(object):
  """Client for Cloud SQL from Appengine.

  The client instances are *not* thread safe. Concurrent use
  can lead to odd errors such as getting results for the
  wrong query, or 'Lost Connection to MySQL server' errors.
  """
  shared_instance = None

  def __init__(self, instance=None, db_name=None,
               db_user=DB_USER, db_password=DB_PASSWORD):
    if not instance:
      raise CloudSqlError('Cloud SQL client: missing instance name')
    if not db_name:
      raise CloudSqlError('Cloud SQL client: missing db name')
    if os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/'):
      self.db = MySQLdb.connect(
          unix_socket='/cloudsql/' + instance, db=db_name, user=db_user,
          passwd=db_password, charset='utf8')
    else:
      self.db = MySQLdb.connect(
          host='127.0.0.1', port=3306, db=DB_NAME, user=DB_USER,
          passwd=DB_PASSWORD, charset='utf8')

  def Query(self, query, timeout=None, cache_duration=None, use_cache=True):
    # TODO(klausw): set up a per-backend connection pool to make
    # this class suitable for multithreaded use?

    cursor = self.db.cursor()
    try:
      cursor.execute(query)
    except MySQLdb.Error as err:
      message = err.message
      # Extra paranoia since err.message isn't set consistently.
      # Try to ensure we have a useful error getting reported.
      if not message:
        message = str(err)
      logging.error('MySQL error: %s', message)
      if not message:
        # This shouldn't happen, but if for some reason we didn't
        # get a message at all just re-throw and hope for the best.
        # Converting to BigQueryError would lose stack information.
        raise err
      raise CloudSqlError(message, query)

    rows_in = cursor.fetchall()
    schema_tuples = cursor.description

    return ConvertCloudSqlToBigQuery(rows_in, schema_tuples)
