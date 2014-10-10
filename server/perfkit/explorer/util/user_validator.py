from google.appengine.api import users
from google.appengine.ext import db

class UserValidator(db.Model):
  user = db.UserProperty(required=True)

  @classmethod
  def GetUserFromEmail(email):
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

  @classmethod
  def GetUsersFromEmails(emails):
    """Returns a list of GAE Users based on a list of email addresses.

    Args:
      emails: An array of strings representing user email addresses.

    Returns:
      A list of GAE Users.
    """
    result = []

    for email in emails:
      user = cls.GetUserFromEmail(email)

      if user:
        result.append(user)

    return result
