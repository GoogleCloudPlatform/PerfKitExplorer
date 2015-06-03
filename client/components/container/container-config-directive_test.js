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
 * @fileoverview Tests for ContainerConfigDirective, which encapsulates the UX for
 * configuring container properties.
 * 
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.container.ContainerConfigDirective');
goog.require('p3rf.perfkit.explorer.components.container.ContainerModel');

describe('ContainerConfigDirective', function() {
  var scope, $compile, $httpBackend;

  var explorer = p3rf.perfkit.explorer;
  var ContainerModel = explorer.components.container.ContainerModel;

  var TEMPLATE_CONTAINER_CONFIG = (
    '/static/components/container/container-config-directive.html');

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
  }));
  
  beforeEach(inject(function() {
    scope.mockModel = new ContainerModel();
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        $httpBackend.expectGET(TEMPLATE_CONTAINER_CONFIG).respond(200);
        var directiveElement = angular.element(
            '<container-config ng-model="mockModel" />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var directiveElement;

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_CONTAINER_CONFIG).respond(200);
      directiveElement = angular.element(
          '<container-config ng-model="mockModel" />');

      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('the container height', function() {
      var targetElement = directiveElement.find(
          'input.container-height');
      expect(targetElement.length).toBe(1);
    });
  });

  describe('should reflect the ngModel state for', function() {
    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_CONTAINER_CONFIG).respond(200);
      directiveElement = angular.element(
          '<container-config ng-model="mockModel" />');

      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('the container height', function() {
      var actualElement = directiveElement.find('input.container-height')[0];

      expect(actualElement.value).toBe('250');

      scope.mockModel.height = 42;
      scope.$digest();

      expect(actualElement.value).toBe('42');
    });

  });
});
