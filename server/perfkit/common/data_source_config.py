"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

A module containing data source configuration for Perfkit.

Each environment
is a collection of services required to support the system.  For example,
the prod environment is where Cloud and end-users will record their data, while
testing is used by the Perfkit team to test out new implementations of the
pipeline.

Design and more detail on supported environments can be found at:
https://goto.google.com/perfkit-environments
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import os
import json
import logging


# Specifies the timeout for individual requests (in seconds) for Cloud Storage
# operations.  Note that this represents the timeout for uploading a single
# chunk of data.  cloud_storage_data_client.DEFAULT_CHUNK_SIZE determines the
# size of each request, and defaults to 1MB.
DEFAULT_TIMEOUT = 100

CONFIG_FILE = 'config/data_source_config.json'


class Error(Exception):
  pass


class Environments(object):
  """Class to enumerate constants for supported environments."""

  PRODUCTION = 'prod'
  TESTING = 'testing'

  @classmethod
  def All(cls):
    """Returns all known environments."""
    return [cls.PRODUCTION, cls.TESTING]


class Services(object):
  """Class to enumerate constants for supported services."""

  LABEL = 'services'

  ANALYTICS_KEY = 'analytics-key'
  API_KEY = 'api_key'
  DATA_QUEUE = 'data-queue'
  DATA_STORE = 'data-store'
  PROJECT_ID = 'project_id'
  PROJECT_NAME = 'project_name'
  SAMPLES_MART = 'samples-mart'

  @classmethod
  def All(cls):
    """Returns all known services."""
    return [cls.API_KEY, cls.DATA_QUEUE, cls.DATA_STORE, cls.PROJECT_ID,
            cls.PROJECT_NAME, cls.SAMPLES_MART, cls.ANALYTICS_KEY]

  @classmethod
  def GetServiceData(cls):
    """Returns the data about environments and services as a dictionary."""
    contents = None

    with open(os.path.abspath(CONFIG_FILE), 'rb') as f:
      contents = f.read()
      f.close()

    return json.loads(contents)

  @classmethod
  def GetServiceUri(cls, environment_name, service_name):
    """Resolves a service uri for a given environment and service name.

    Args:
      environment_name: The environment name must exist in Environments.All()
      service_name: The service must name exist in Services.All()

    Raises:
      Error: Environment was not provided or found.

    Returns:
      The name/uri of a service for the provided environment.
    """
    error_base_msg = ('GetServiceUri(environment: \'%s\', service: \'%s\''
                      ') failed: ' % (environment_name, service_name))

    if not environment_name:
      raise Error(error_base_msg + 'Environment name not provided.')

    if environment_name not in Environments.All():
      raise Error(error_base_msg + 'Environment name not supported.')

    if not service_name:
      raise Error(error_base_msg + 'Service name not provided.')

    if service_name not in cls.All():
      raise Error(error_base_msg + 'Service name not supported.')

    configuration = cls.GetServiceData()

    if environment_name not in configuration:
      raise Error(error_base_msg + 'Environment name not found.')

    environment = configuration[environment_name]

    if service_name not in environment:
      raise Error(error_base_msg + 'Service name not found.')

    return environment[service_name]


class Constants(object):
  """Class containing constants that don't fit into the above categories."""
  SAMPLES_MART_DATASET = 'samples_mart'
  RESULTS_TABLE = 'results'
  UPLOAD_REQUEST_VERSION = '1'
