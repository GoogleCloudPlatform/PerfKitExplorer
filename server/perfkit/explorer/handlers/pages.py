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

Main entry module for pages specified in app.yaml.

This module contains the Http handlers for HTML page requests in the Perfkit
Explorer application.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import base
import webapp2


class MainPageHandler(base.RequestHandlerBase):
  """Http handler for the main Explorer HTML page."""

  def get(self):
    """Request handler for GET operations."""
    self.redirect('/dashboard-admin', True)


class ExplorePageHandler(base.RequestHandlerBase):
  """Http handler for the Report HTML page."""

  def get(self):
    """Request handler for GET operations."""
    self.RenderHtml('explorer.html', {})


class DashboardAdminPageHandler(base.RequestHandlerBase):
  """Http handler for the Report HTML page."""

  def get(self):
    """Request handler for GET operations."""
    self.RenderHtml('dashboard-admin.html', {})


# Main WSGI app as specified in app.yaml
app = webapp2.WSGIApplication(
    [('/', MainPageHandler),
     ('/review', ExplorePageHandler),
     ('/explore', ExplorePageHandler),
     ('/dashboard-admin', DashboardAdminPageHandler)], debug=True)
