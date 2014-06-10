"""Main entry module for pages specified in app.yaml.

This module contains the Http handlers for HTML page requests in the Dashkit
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
