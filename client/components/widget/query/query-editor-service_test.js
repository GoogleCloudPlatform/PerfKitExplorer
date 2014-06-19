/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Tests for the QueryEditor service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.dashkit.explorer.application.module');

goog.require('goog.date');


describe('TestQueryServices', function() {
  var svc;

  beforeEach(module('explorer'));

  beforeEach(inject(function($injector, queryEditorService) {
    svc = queryEditorService;
  }));

  describe('QueryEditorService', function() {
  });

});
