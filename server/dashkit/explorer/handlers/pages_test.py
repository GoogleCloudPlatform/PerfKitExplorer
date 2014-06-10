"""Tests for p3rf.dashkit.explorer.pages."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import datetime
import webtest
import unittest

from dashkit.explorer.handlers import base
from dashkit.explorer.handlers import pages


class JsonEncoderTest(unittest.TestCase):
  def testEncodeDatetime(self):
    self.encoder = base._JsonEncoder(sort_keys=True)
    self.dt = datetime.datetime(2008, 9, 15, 12, 30, 00)

    self.assertEqual('"2008-09-15T12:30:00Z"', self.encoder.encode(self.dt))


class PagesTest(unittest.TestCase):
  # TODO: Add more automated validation of parameters and Http Responses.
  # For the time being, manual testing is used to validate this.

  def setUp(self):
    super(PagesTest, self).setUp()
    self.app = webtest.TestApp(pages.app)

  def testUrlHandlers(self):
    self.expect(pages.MainPageHandler.get).any_args()
    self.app.get('/')

    self.expect(pages.ComparePageHandler.get).any_args()
    self.app.get('/compare')

    self.expect(pages.ExplorePageHandler.get).any_args()
    self.app.get('/explore')

    self.expect(pages.ExplorePageHandler.get).any_args()
    self.app.get('/review')

  def testDefaultPage(self):
    # TODO: Add a token to each page that can be used to better validate
    # behavior.
    resp = self.app.get(url='/', status=301)

    self.assertIsNotNone(resp.html)

  def testComparePage(self):
    # TODO: Add a token to each page that can be used to better validate
    # behavior.
    resp = self.app.get(url='/compare', status=200)

    self.assertIsNotNone(resp.html)

  def testExplorePage(self):
    # TODO: Add a token to each page that can be used to better validate
    # behavior.
    resp = self.app.get(url='/explore', status=200)

    self.assertIsNotNone(resp.html)


if __name__ == '__main__':
  unittest.main()
