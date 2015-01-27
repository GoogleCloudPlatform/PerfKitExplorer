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
import urllib
import webapp2


class MainPageHandler(base.RequestHandlerBase):
  """Http handler for the default page.  Redirects to the admin page."""

  def get(self):
    """Request handler for GET operations."""
    self.redirect('/dashboard-admin', True)


class ExplorePageHandler(base.RequestHandlerBase):
  """Http handler for the Dashboard Explorer HTML page."""

  def get(self):
    """Request handler for GET operations."""
    self.RenderHtml('explorer.html', {})


class ReviewPageHandler(base.RequestHandlerBase):
  """Http handler for the review url.  Redirects to the Explorer page."""

  def get(self):
    """Request handler for GET operations."""
    url = '/explore?' + urllib.urlencode(self.request.params)
    self.redirect(url, True)


class DashboardAdminPageHandler(base.RequestHandlerBase):
  """Http handler for the Dashboard Admin HTML page."""

  def get(self):
    """Request handler for GET operations."""
    self.RenderHtml('dashboard-admin.html', {})


# Main WSGI app as specified in app.yaml
app = webapp2.WSGIApplication(
    [('/', MainPageHandler),
     ('/explore', ExplorePageHandler),
     ('/review', ReviewPageHandler),
     ('/dashboard-admin', DashboardAdminPageHandler)], debug=True)
