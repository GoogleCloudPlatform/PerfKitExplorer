"""Provides a mock BigQueryClient that allows the tester to control the reply.

Presently, this class is used for mocking queries and replies.  Future revisions
will support mocking of additional behavior.
"""

__author__ = "joemu@google.com (Joe Allan Muharsky)"

import big_query_client
import credentials_lib


class MockBigQueryClient(big_query_client.BigQueryClient):
  """Mock data client for tests."""

  def __init__(self, credential_file=None, env=None):
    """Default initialization."""
    self.last_query = None
    self.last_reply = None
    self.last_request = None
    self.mock_reply = None
    self.use_cache = False

    self.env = env
    credential_file = credential_file or credentials_lib.DEFAULT_CREDENTIALS

    super(MockBigQueryClient, self).__init__(credential_file=credential_file,
                                             env=env)

  def Query(self, query, timeout=None, max_results_per_page=None,
            use_cache=False):
    if use_cache and (self.last_query == query):
      return self.last_reply

    self.last_query = query

    return super(MockBigQueryClient, self).Query(query, timeout,
                                                 max_results_per_page)

  def _ExecuteRequestWithRetries(self, request):
    self.last_request = request

    self.last_reply = self.mock_reply
    return self.mock_reply

  def HasCache(self):
    return self.use_cache
