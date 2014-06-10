"""Methods for creating data clients and navigators with default config."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

from datetime import datetime

from dashkit.common import big_query_client
from dashkit.common import credentials_lib
from dashkit.common import data_source_config
from dashkit.common import mock_big_query_client

# Default date ranges, currently chosen arbitrarily.
# TODO: Update these values to coincide with official Mock Data.
MIN_SAMPLE_DATE = datetime(2012, 12, 13)
MAX_SAMPLE_DATE = datetime(2012, 12, 22)
CONTEXT_DATE = datetime(2012, 12, 15)


def GetDataClient(mocked=False):
  """Returns a BigQueryClient with default credentials in the testing env."""
  if mocked:
    return mock_big_query_client.MockBigQueryClient(
        credential_file=credentials_lib.DEFAULT_CREDENTIALS,
        env=data_source_config.Environments.TESTING)
  else:
    return big_query_client.BigQueryClient(
        credential_file=credentials_lib.DEFAULT_CREDENTIALS,
        env=data_source_config.Environments.TESTING)
