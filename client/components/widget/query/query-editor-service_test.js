/**
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
