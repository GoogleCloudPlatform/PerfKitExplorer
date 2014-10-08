"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

GAE Model for the datastore."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import json
import logging

from google.appengine.api import users
from google.appengine.ext import ndb

import dashboard_fields as fields


DEFAULT_DASHBOARD_TITLE = 'Untitled Dashboard'
DEFAULT_DOMAIN = 'google.com'


class Error(Exception):
  pass


class InitializeError(Error):
  pass


class SecurityError(Error):
  pass


class UserValidator(ndb.Model):
  user = ndb.UserProperty(required=True)

  @classmethod
  def GetUserFromEmail(cls, email):
    """Return a stable user_id string based on an email address.

    Args:
      email: Email address of the user.

    Returns:
      A GAE User instance, or None if the email doesn't resolve.
    """
    u = users.User(email)
    key = UserValidator(user=u).put()
    obj = UserValidator.get(key)
    user = obj.user
    obj.delete()

    if not user.user_id():
      return None

    return user

  @classmethod
  def GetUsersFromEmails(cls, emails):
    """Return a list of GAE Users based on a list of email addresses.  Also returns a list of invalid email addresses.

    Args:
      emails: An array of strings, each representing an email address of a valid GAE User.

    Returns:
      * A list of GAE Users.
      * A list of email addresses that failed to validate.
    """
    return_users = []
    return_failed_emails = []

    for email in emails:
      user = cls.GetUserFromEmail(email)

      if user:
        return_users.append(user)
      else:
        return_failed_emails.append(email)

    return return_users, return_failed_emails


class Dashboard(ndb.Model):
  """Models a Dashboard definition (as JSON).

  Tracks the contents of the dashboard (data, stored as JSON string), plus the
  user who created and last modified the dashboard.
  """

  created_by = ndb.UserProperty()
  modified_by = ndb.UserProperty()
  writers = ndb.UserProperty(repeated=True)
  title = ndb.StringProperty(default='')
  data = ndb.TextProperty(default='')
  public = ndb.BooleanProperty(default=False)

  @staticmethod
  def GetDashboard(dashboard_id, required=True):
    """Returns a Dashboard model for the provided dashboard_id.

    Args:
      dashboard_id: An integer key for a dashboard.
      required: Determines the behavior when the id is not found.  If false,
          None will be returned.  If true, an InitializeError will be raised.

    Returns:
      A Dashboard model instance.

    Raises:
      InitializeError: If the ID is not found, and required is True.
    """
    dashboard_row = Dashboard.get_by_id(dashboard_id)

    if not dashboard_row and required:
      message = 'No dashboard with ID {id} was found.'.format(id=dashboard_id)
      raise InitializeError(message)

    return dashboard_row

  @staticmethod
  def CopyDashboard(dashboard_id, title=None):
    """Creates a copy of a dashboard, and optionally renames it.

    Args:
      dashboard_id: An integer key for a dashboard.
      title: If provided, will be used as the title for the new dashboard.

    Returns:
      The id of the newly-created dashboard.

    Raises:
      InitializeError: If the ID is not found.
    """
    dashboard_row = Dashboard.get_by_id(dashboard_id)

    if not dashboard_row:
      message = 'No dashboard with ID {id} was found.'.format(id=dashboard_id)
      raise InitializeError(message)

    data = dashboard_row.GetDashboardData()

    new_dashboard = Dashboard()
    new_dashboard.created_by = users.get_current_user()

    if title:
      new_dashboard.title = title
      data[fields.TITLE] = title
    else:
      new_dashboard.title = dashboard_row.title

    new_dashboard.data = json.dumps(data)
    return new_dashboard.put().id()

  @staticmethod
  def RenameDashboard(dashboard_id, new_name):
    """Renames a dashboard.

    Args:
      dashboard_id: An integer key for a dashboard.
      new_name: The new title to use for the dashboard.

    Raises:
      InitializeError: If the ID is not found.
    """
    dashboard_row = Dashboard.get_by_id(dashboard_id)

    if not dashboard_row:
      message = 'No dashboard with ID {id} was found.'.format(id=dashboard_id)
      raise InitializeError(message)

    data = dashboard_row.GetDashboardData()

    data[fields.TITLE] = new_name
    dashboard_row.title = new_name

    dashboard_row.data = json.dumps(data)
    dashboard_row.put()

  @staticmethod
  def EditDashboardOwner(dashboard_id, owner_email):
    """Renames a dashboard.

    Args:
      dashboard_id: An integer key for a dashboard.
      owner_email: The email address of the new owner.  DEFAULT_DOMAIN will be
          applied if no domain (@) is present.

    Raises:
      InitializeError: If the ID is not found.
    """
    dashboard_row = Dashboard.get_by_id(dashboard_id)

    if not dashboard_row:
      message = 'No dashboard with ID {id} was found.'.format(id=dashboard_id)
      raise InitializeError(message)

    owner_email = Dashboard.GetCanonicalEmail(owner_email)
    new_owner = UserValidator.GetUserFromEmail(owner_email)

    if not new_owner:
      message = 'No owner with email ' + owner_email + ' was found.'.format(
          email=owner_email)
      raise InitializeError(message)

    data = dashboard_row.GetDashboardData()
    data['owner'] = new_owner.email()

    dashboard_row.created_by = new_owner
    dashboard_row.modified_by = new_owner
    dashboard_row.data = json.dumps(data)

    dashboard_row.put()

  def writersChanged(self, new_writers):
    """Returns True if the owner or writers have changed, False if not.

    Args:
      new_contributors: A list of objects that contain email addresses.
    """
    old_emails = [user.email() for user in self.writers]
    new_emails = [user.get('email') for user in new_writers]

    return cmp(old_emails, new_emails) != 0


  def isOwner(self):
    """Returns True if the current user is an admin, or the owner.

    Args:
      user: A GAE user object.

    Returns:
      True if the provided user is an owner or admin for the current dashboard.  Otherwise, false.
    """
    return (
      users.is_current_user_admin() or
      users.get_current_user() == self.created_by)

  def isContributor(self):
    """Returns True if any of the data.contributors email addresses is the current user.

    Args:
      user: A GAE user object.

    Returns:
      True if the provided email address exists in data.contributors.  Otherwise, false.
    """
    data = self.GetDashboardData()
    email = users.get_current_user().email().lower()

    for user in self.writers:
      if user.email().lower() == email:
        return True

    return False

  def canEdit(self):
    """Returns True if the current user is an admin, the owner or a contributor.

    Args:
      user: A GAE user object.

    Returns:
      True if the provided user is an owner, admin or contributor for the current dashboard.  Otherwise, false.
    """
    return (self.isOwner() or self.isContributor())

  def GetDashboardData(self):
    """Returns a JSON representation of the 'data' field.

    Returns:
      A JSON object representation of the dashboard's data.

    Raises:
      InitializeError: If the data field contains invalid JSON or doesn't exist.
    """
    str_value = self.data

    if str_value:
      try:
        return json.loads(str_value)
      except ValueError:
        message = ('The "data" field in dashboard row {id} must be valid JSON.'
                   '  Found:\n{value}').format(id=self.key().id(),
                                               value=str_value)
        raise InitializeError(message)
    else:
      message = 'The "data" field in dashboard row {id} is required.'.format(
          id=self.key().id())
      raise InitializeError(message)

  @staticmethod
  def GetDashboardTitle(dashboard_data):
    """Returns the Dashboard's title, and sets it to a default if not provided.

    Args:
      dashboard_data: A JSON representation of the dashboard.

    Returns:
      The title of the dashboard.
    """
    if fields.TITLE in dashboard_data:
      title = dashboard_data[fields.TITLE]
    else:
      dashboard_data[fields.TITLE] = DEFAULT_DASHBOARD_TITLE
      title = DEFAULT_DASHBOARD_TITLE

    return title

  @staticmethod
  def GetDashboardOwner(owner_string):
    """Returns the Dashboard's owner, and sets it to a default if not provided.

    Args:
      owner_string: A string that represents the user.

    Returns:
      A GAE User object representing the owner of the dashboard.
    """
    if owner_string:
      owner = UserValidator.GetUserFromEmail(owner_string)
      if not owner:
        raise users.UserNotFoundError()
    else:
      return users.get_current_user()

    return owner

  @staticmethod
  def GetCanonicalEmail(owner):
    """Returns a domain-specified email address based on an owner string.

    Args:
      owner: An owner name, which may or may not contain a domain.

    Returns:
      An email address.  If owner_name does not contain a domain, then
          DEFAULT_OWNER_DOMAIN is applied.
    """
    # TODO: Remove this or update to use GAE app's default domain before
    #     public release.
    if '@' not in owner:
      owner = '{user}@{domain}'.format(user=owner, domain=DEFAULT_DOMAIN)

    return owner
