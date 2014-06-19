/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Test for multibox, an angular directive that provides insert
 * row and popup behavior for lists of data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

describe('multibox', function() {
  'use strict';

  var scope, element, $compile, $timeout, $httpBackend;

  beforeEach(module('ui.multibox'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_, _$httpBackend_) {
        scope = _$rootScope_.$new();
        $compile = _$compile_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET(
            'static/components/multibox/multibox-directive.html').respond(
            'FOO');
      }));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<span ui-multibox></span>');

    scope = $rootScope;
    $compile(element)(scope);
    scope.$digest();
  }));

  it('should compile when used on an attribute', function() {
    function compile() {
      $compile('<span ui-multibox></span>')(scope);
    }

    expect(compile).not.toThrow();
  });

  it('should show only the insertion row when initialized', function() {
    var insertRow = element.find('.multibox-insert-row');
    expect(insertRow).not.toBeNull();
  });

});
