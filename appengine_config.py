"""Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

WSGI middleware configuration."""

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
