"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

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


class Explore2PageHandler(base.RequestHandlerBase):
  """Http handler for the Report HTML page."""

  def get(self):
    """Request handler for GET operations."""
    self.RenderHtml('explorer2.html', {})


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
     ('/explore2', Explore2PageHandler),
     ('/dashboard-admin', DashboardAdminPageHandler)], debug=True)
