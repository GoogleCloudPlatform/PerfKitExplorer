/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Test for popupbox, an angular directive that provides
 * popup behavior for text boxes and other single-entry elements.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

describe('popupbox', function() {
  'use strict';

  var scope, element, $compile, $timeout, $httpBackend;

  beforeEach(module('ui.popupbox'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_, _$httpBackend_) {
        scope = _$rootScope_.$new();
        $compile = _$compile_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET(
            'components/popupbox/popupbox-directive.html').respond(
            'FOO');
      }));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<span ui-popupbox></span>');

    scope = $rootScope;
    $compile(element)(scope);
    scope.$digest();
  }));

  it('should compile when used on an attribute', function() {
    function compile() {
      $compile('<span ui-popupbox></span>')(scope);
    }

    expect(compile).not.toThrow();
  });

});
