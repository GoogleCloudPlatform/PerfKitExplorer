/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
