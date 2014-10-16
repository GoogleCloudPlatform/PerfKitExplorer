"""Copyright 2014 Google Inc. All rights reserved.

Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://developers.google.com/open-source/licenses/bsd

Utility methods for GAE User validation.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'


import logging

from google.appengine.api import users
from google.appengine.ext import db

class UserValidator(db.Model):
  user = db.UserProperty(required=True)

  @classmethod
  def GetUserFromEmail(cls, email):
    """Return a GAE User based on an email address.

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
      logging.error('User %s not found.', email)
      return None

    return user
