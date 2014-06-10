"""WSGI middleware configuration."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import sys
from google.appengine.ext.appstats import recording


sys.path.insert(0, 'server/third_party')
sys.path.insert(0, 'server')


# Inline imports as required by the dev_appserver automatic module reloading
# magic and lowercase function used by App Engine.
def webapp_add_wsgi_middleware(app):
  """Adds RPC performance profiling to the GAE application.

  See the docs at the following link for more information:
    https://developers.google.com/appengine/docs/python/tools/appstats

  Args:
    app: The GAE application that will be extended for appstats recording.

  Returns:
    An Appstats-enabled WSGI application.
  """
  app = recording.appstats_wsgi_middleware(app)
  return app
