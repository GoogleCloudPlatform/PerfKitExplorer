"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

A client for accessing Big Query.

Authentication is performed using the App Engine's credentials so this code
should be run from inside a GAE app.

Code in this module is based heavily off the documented example found here:
https://developers.google.com/bigquery/docs/import#storageimport
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import hashlib
import logging

import httplib2
from oauth2client.appengine import AppAssertionCredentials

from google.appengine.api import memcache

import big_query_client

DEFAULT_CACHE_DURATION = 3600


class GaeBigQueryClient(big_query_client.BigQueryClient):
  """Client for interacting with BigQuery, within app engine authentication."""

  def __init__(self, env=None, project_id=None):
    """Overrides the default init to remove the need for credentials."""
    super(GaeBigQueryClient, self).__init__(
        credential_file='',
        env=env,
        project_id=project_id)

  def _InitializeHttp(self):
    """Initializes the http provider."""
    self._credentials = AppAssertionCredentials(scope=big_query_client.SCOPE)
    self._http = self._credentials.authorize(httplib2.Http())

  def _GetFromCache(self, key):
    """Retrieves a value from the cache based on a key.

    Args:
      key: A unique key that identifies the item in the cache.

    Returns:
      Cached data if found, None if not.
    """
    return memcache.get(key)

  def _AddToCache(self, key, value, duration=None):
    """Adds a value to the cache.

    Args:
      key: A unique key that identifies the item in the cache.
      value: The value to store.
      duration: The length of time (in seconds) to store the cached value.
    """
    memcache.add(key, value, duration or DEFAULT_CACHE_DURATION)

  def Query(self, query, timeout=None, cache_duration=None, use_cache=True):
    """Returns cached data, or issues a Big Query and returns the response.

    Note that multiple pages of data will be loaded returned as a single data
    set.

    Args:
      query: The query to issue.
      timeout: The length of time (in seconds) to wait before checking for job
          completion.
      cache_duration: The length of time (in seconds) to store the result in
          the cache.
      use_cache: If false, do not use the cache.

    Returns:
      The query results.  See big query's docs for the results format:
      http://goto.google.com/big_query_query_results
    """
    if not use_cache:
      return super(GaeBigQueryClient, self).Query(query, timeout)

    query_hash = hashlib.md5(self.project_id + query).hexdigest()
    data = self._GetFromCache(query_hash)

    if data is None:
      data = super(GaeBigQueryClient, self).Query(query, timeout)
      try:
        self._AddToCache(query_hash, data, cache_duration)
      except ValueError, err:
        logging.error('Failed to save results to the cache: %s', err)
    else:
      logging.info('Cache hit for the following query to Big Query:\n%s',
                   query)

    return data

  @staticmethod
  def HasCache():
    """Returns true as the gae client has a cache."""
    return True

