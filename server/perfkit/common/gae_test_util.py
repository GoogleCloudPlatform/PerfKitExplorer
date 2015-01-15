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

Helper functions and add-ons for Google App Engine related stuff."""

import os


ADMIN_USER_ENV = {
  'USER_EMAIL': 'admin@mydomain.com',
  'USER_ID': 'admin',
  'USER_IS_ADMIN': 1
}

NORMAL_USER_ENV = {
  'USER_EMAIL': 'normie@mydomain.com',
  'USER_ID': 'normie',
  'USER_IS_ADMIN': 0
}


def SetCurrentUser(testbed, is_admin=False):
  if is_admin:
    testbed.setup_env(overwrite=True, **ADMIN_USER_ENV)
  else:
    testbed.setup_env(overwrite=True, **NORMAL_USER_ENV)
