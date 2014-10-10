from google.appengine.api import users
from google.appengine.ext import db

class UserValidator(db.Model):
  user = db.UserProperty(required=True)

  @staticmethod
  def GetUserFromEmail(email):
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
      logging.error('User %s not found.', email)
      return None

    return user
