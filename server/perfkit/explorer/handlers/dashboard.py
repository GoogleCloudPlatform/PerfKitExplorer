"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Main entry module for dashboard data specified in app.yaml.

This module contains the Http handlers for dashboard data requests (as JSON) in
the Perfkit Explorer application (as well as other consumers).  GAE's data store
is used to store, retrieve and manage JSON representations of Explorer
dashboards.

The following API is supported:

GET methods: (can be POSTed)
  /dashboard/view?id={number} - Returns JSON for the specified dashboard.
  /dashboard/delete?id={number} - Deletes the specified dashboard.
  /dashboard/copy?id={number}&title={?string=} - Copies the specified dashboard
      and optionally renames it.
  /dashboard/edit-owner?id={number}&email={string} - Modifies the owner
      of the specified dashboard based on an email address.
  /dashboard/rename?id={number}&title={string} - Modifies the title of the
      specified dashboard.

POST methods:
  /dashboard/create - Returns the dashboard JSON with the ID added.
  /dashboard/edit?id={number} - Returns status 200 if successful.

  * note that all POST methods contain a parameter fields.DATA that contains the
    dashboard JSON.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json
import logging

import base
from perfkit.explorer.model import dashboard as dashboard_model
from perfkit.explorer.model import dashboard_fields as fields
from perfkit.explorer.model import error_fields
from perfkit.explorer.util import user_validator

import webapp2

from google.appengine.api import users
from google.appengine.ext import ndb


class ViewDashboardHandler(base.RequestHandlerBase):
  """Http handler for getting a dashboard definition.

  This GET method is used to retrieve the JSON for a dashboard by its numeric
  id.

  Supported Modes: GET, POST
  GET parameters:
    id: int.  The unique numeric identifier for the dashboard.  This value is
        required.

  Returns:
    JSON representation of the dashboard, as a string.
  """

  def get(self):
    """Request handler for GET operations."""
    try:
      dashboard_id = self.GetIntegerParam(fields.ID)
      row = dashboard_model.Dashboard.GetDashboard(dashboard_id)
      data = row.GetDashboardData()
      filename = self.GetStringParam('filename', required=False)

      self.RenderJson(data, filename=filename)
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)

  def post(self):
    self.get()


class CreateDashboardHandler(base.RequestHandlerBase):
  """Http handler for creating a dashboard definition.

  This POST method is used to save a JSON definition of a dashboard, and returns
  a JSON packet with the selected ID.

  Supported Modes: POST
  POST parameters:
    data: string.  The Json representation of the dashboard.

  Returns:
    A JSON dict containing the id of the dashboard.
  """

  def post(self):
    """Request handler for POST operations."""

    try:
      owner_email = None
      data = self.GetJsonParam(fields.DATA)

      owner_email = data.get(fields.OWNER)

      title = dashboard_model.Dashboard.GetDashboardTitle(data)
      owner = dashboard_model.Dashboard.GetDashboardOwner(owner_email)

      dashboard = dashboard_model.Dashboard()
      dashboard.created_by = users.get_current_user()
      dashboard.title = title
      dashboard_id = dashboard.put().integer_id()

      # Now that we have an ID, save the data with an ID attached.
      data[fields.ID] = str(dashboard_id)
      data[fields.OWNER] = owner_email or owner.email()
      dashboard.data = json.dumps(data)
      dashboard.put()

      self.RenderJson(data)
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)


class UploadDashboardHandler(base.RequestHandlerBase):
  """Http handler for uploading a dashboard definition.

  This POST method is used to upload a file from the requester's computer, and

  Supported Modes: POST
  POST parameters:
    data: string.  The Json representation of the dashboard.

  Returns:
    A JSON dict containing the id of the dashboard.
  """

  def post(self):
    """Request handler for POST operations."""

    try:
      owner_email = None
      data = self.GetJsonParam(fields.DATA)

      if fields.OWNER in data:
        owner_email = data[fields.OWNER]

      title = dashboard_model.Dashboard.GetDashboardTitle(data)
      created_by = dashboard_model.Dashboard.GetDashboardOwner(owner_email)

      dashboard = dashboard_model.Dashboard()
      dashboard.created_by = created_by
      dashboard.title = title
      dashboard_id = dashboard.put().integer_id()

      # Now that we have an ID, save the data with an ID attached.
      data[fields.ID] = str(dashboard_id)
      data[fields.OWNER] = created_by.email()
      dashboard.data = json.dumps(data)
      dashboard.put()

      self.RenderJson(data)
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)


class EditDashboardHandler(base.RequestHandlerBase):
  """Http handler for modifying a dashboard definition.

  This POST method is used to save a JSON definition of a dashboard matching
  the provided ID.

  Supported Modes: POST
  POST parameters:
    id: number.  The ID of the dashboard.
    data: string.  The Json representation of the dashboard.
  """

  def post(self):
    """Request handler for POST operations."""
    current_owner_email = None

    try:
      dashboard_id = self.GetIntegerParam(fields.ID)
      row = dashboard_model.Dashboard.GetDashboard(dashboard_id)

      if (not row.canEdit()):
        msg = ('You are not an owner or writer for this dashboard, and cannot modify it.  Contact '
               '{owner} for access.'
               .format(owner=row.created_by.email()))
        self.RenderJson(
            data={error_fields.MESSAGE: msg},
            status=403)
        return

      data = self.GetJsonParam(fields.DATA)
      title = dashboard_model.Dashboard.GetDashboardTitle(data)
      if fields.OWNER in data:
        current_owner_email = data[fields.OWNER]

      try:
        new_owner = dashboard_model.Dashboard.GetDashboardOwner(
            current_owner_email)
      except users.UserNotFoundError:
        new_owner = users.get_current_user()
        data[fields.OWNER] = new_owner.email()
        warning = (
            'The user {current} does not exist.  Owner set to {new}.'.format(
                current=current_owner_email, new=new_owner.email()))
        logging.error(warning)
        data[error_fields.WARNINGS] = [warning]

      if not 'writers' in data:
        data['writers'] = []

      new_writers = data.get('writers')
      writers_changed = row.writersChanged(data.get('writers'))
      owners_changed = (data[fields.OWNER] != new_owner.email())

      if owners_changed or writers_changed:
        if (not row.isOwner()):
          msg = ('You are not an owner of this dashboard, and cannot transfer ownership.  Contact '
                 '{owner} for reassignment if this is in error.'
                 .format(owner=row.created_by.email()))
          self.RenderJson(
              data={error_fields.MESSAGE: msg},
              status=403)
          return

        if owners_changed:
          data[fields.OWNER] = new_owner.email()

        if writers_changed:
          row.writers = [writer['email'] for writer in new_writers]

      row.data = json.dumps(data)
      row.title = title
      row.owner = new_owner
      row.modified_by = users.get_current_user()
      row.put()
      self.RenderJson(data)
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)


class CopyDashboardHandler(base.RequestHandlerBase):
  """Http handler for copying a dashboard definition.

  This POST method is used to make a copy of a dashboard matching
  the provided ID.

  Supported Modes: POST
  POST parameters:
    id: number.  The ID of the dashboard.
    title: string.  If provided, the new title of the dashboard.

  Reply:
    The ID of the new dashboard.
  """

  def get(self):
    """Request handler for POST operations."""

    try:
      dashboard_id = self.GetIntegerParam(fields.ID)
      title = self.GetStringParam(fields.TITLE, False)

      new_id = dashboard_model.Dashboard.CopyDashboard(dashboard_id, title)
      self.RenderJson(data={fields.ID: new_id})
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)

  def post(self):
    self.get()


class RenameDashboardHandler(base.RequestHandlerBase):
  """Http handler for copying a dashboard definition.

  This POST method is used to make a copy of a dashboard matching
  the provided ID.

  Supported Modes: POST
  POST parameters:
    id: number.  The ID of the dashboard.
    title: string.  The new title of the dashboard.
  """

  def get(self):
    """Request handler for POST operations."""
    dashboard_id = self.GetIntegerParam(fields.ID)
    row = dashboard_model.Dashboard.GetDashboard(dashboard_id)

    if (not row.canEdit()):
      msg = ('You are not an owner or writer for this dashboard, and cannot modify it.  Contact '
             '{owner} for access.'
             .format(owner=row.created_by.email()))
      self.RenderJson(
          data={error_fields.MESSAGE: msg},
          status=403)
      return

    try:
      title = self.GetStringParam(fields.TITLE)
      dashboard_model.Dashboard.RenameDashboard(dashboard_id, title)
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)

  def post(self):
    self.get()


class EditDashboardOwnerHandler(base.RequestHandlerBase):
  """Http handler for transferring ownership of a dashboard.

  This POST method is used to make a copy of a dashboard matching
  the provided ID.

  Supported Modes: POST
  POST parameters:
    id: number.  The ID of the dashboard.
    email: string.  The email of the new owner.
  """

  def get(self):
    """Request handler for POST operations."""

    try:
      dashboard_id = self.GetIntegerParam(fields.ID)
      row = dashboard_model.Dashboard.GetDashboard(dashboard_id)

      if (not row.isOwner()):
        msg = ('You are not an owner of this dashboard, and cannot transfer ownership.  Contact '
               '{owner} for reassignment if this is in error.'
               .format(owner=row.created_by.email()))
        self.RenderJson(
            data={error_fields.MESSAGE: msg},
            status=403)
        return
      email = self.GetStringParam(fields.EMAIL)

      dashboard_model.Dashboard.EditDashboardOwner(dashboard_id, email)
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      logging.error('EditDashboardOwnerHandler() failed:')
      logging.error(err)
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)

  def post(self):
    self.get()


class DeleteDashboardHandler(base.RequestHandlerBase):
  """Http handler for deleting a dashboard definition.

  This GET method is used to delete a dashboard.

  Supported Modes: POST, GET
  GET parameters:
    id: number.  The ID of the dashboard.
  """

  def get(self):
    """Request handler for POST operations."""
    try:
      dashboard_id = self.GetIntegerParam(fields.ID)

      row = dashboard_model.Dashboard.GetDashboard(dashboard_id)

      if not(row.isOwner()):
        msg = ('This dashboard is owned by {owner}, and cannot be modified.'
               .format(owner=row.created_by.email()))
        self.RenderJson(
            data={error_fields.MESSAGE: msg},
            status=403)
        return

      row.key.delete()
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err.message}, status=400)

  def post(self):
    self.get()


class ListDashboardHandler(base.RequestHandlerBase):
  """Http handler for returning a list of dashboard ID's, titles and owners.

  Supported Modes: GET
  GET parameters:
    owner: string.  The owner, if any, to filter on.
    mine: boolean.  If true, only returns dashboards owned by the current user.
  """

  def get(self):
    """Request handler for GET operations."""

    try:
      mine = self.request.get(fields.MINE)
      owner = self.request.get(fields.OWNER)

      query = dashboard_model.Dashboard.query()

      filter_property = ndb.GenericProperty(fields.CREATED_BY)
      if owner:
        owner_user = user_validator.UserValidator.GetUserFromEmail(owner)

        if owner_user:
          query = query.filter(filter_property == owner_user)
        else:
          self.RenderJson({fields.DATA: []})
          return
      elif mine:
        query = query.filter(filter_property == users.get_current_user())

      query = query.order(dashboard_model.Dashboard.title)
      results = query.fetch(limit=1000)

      response = []
      for result in results:
        response.append({
            fields.ID: result.key.integer_id(),
            fields.OWNER: result.created_by.email(),
            fields.TITLE: (result.title or
                           dashboard_model.DEFAULT_DASHBOARD_TITLE)})

      self.RenderJson({fields.DATA: response})
    except (base.InitializeError, dashboard_model.InitializeError) as err:
      self.RenderJson(data={error_fields.MESSAGE: err}, status=400)

  def post(self):
    self.get()


# Main WSGI app as specified in app.yaml
app = webapp2.WSGIApplication(
    [('/dashboard/copy', CopyDashboardHandler),
     ('/dashboard/create', CreateDashboardHandler),
     ('/dashboard/delete', DeleteDashboardHandler),
     ('/dashboard/edit', EditDashboardHandler),
     ('/dashboard/edit-owner', EditDashboardOwnerHandler),
     ('/dashboard/list', ListDashboardHandler),
     ('/dashboard/rename', RenameDashboardHandler),
     ('/dashboard/view', ViewDashboardHandler)])
