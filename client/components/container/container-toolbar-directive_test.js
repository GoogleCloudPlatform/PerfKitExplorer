/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Tests for ContainerToolbarDirective, which encapsulates the
 * state for the container toolbar.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.container.ContainerToolbarDirective');

describe('ContainerToolbarDirective', function() {
  var scope, $compile, $timeout, uiConfig;
  var containerService, dashboardService;

  const explorer = p3rf.perfkit.explorer;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_,
      _containerService_, _dashboardService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;

    dashboardService = _dashboardService_;
    containerService = _containerService_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        var directiveElement = angular.element(
            '<container-toolbar />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain an element to', function() {
    var actualElement, actualController;

    beforeEach(inject(function() {
      actualElement = angular.element('<container-toolbar />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('containerToolbar');
    }));

    it('show the add container dropdown button', function() {
      var targetElement = actualElement.find(
          'button.container-add');
      expect(targetElement.length).toBe(1);
    });

    it('list the add container options', function() {
      var targetElement = actualElement.find(
          'ul.container-add-dropdown');
      expect(targetElement.length).toBe(1);
    });

    it('add a container at the top', function() {
      var targetElement = actualElement.find(
          'li.container-add-top');
      expect(targetElement.length).toBe(1);

      spyOn(containerService, 'insertAt');
      targetElement.click();
      expect(containerService.insertAt).toHaveBeenCalledWith(0);
    });

    it('add a container before the selected one', function() {
      var targetElement = actualElement.find(
          'li.container-add-before');
      expect(targetElement.length).toBe(1);

      spyOn(containerService, 'insertBefore');
      targetElement.click();
      expect(containerService.insertBefore).toHaveBeenCalled();
    });

    it('add a container after the selected one', function() {
      var targetElement = actualElement.find(
          'li.container-add-after');
      expect(targetElement.length).toBe(1);

      spyOn(containerService, 'insertAfter');
      targetElement.click();
      expect(containerService.insertAfter).toHaveBeenCalled();
    });

    it('add a container at the bottom', function() {
      var targetElement = actualElement.find(
          'li.container-add-bottom');
      expect(targetElement.length).toBe(1);

      spyOn(containerService, 'insert');
      targetElement.click();
      expect(containerService.insert).toHaveBeenCalled();
    });

    it('move the selected container up', function() {
      var targetElement = actualElement.find(
          'button.container-move-up');
      expect(targetElement.length).toBe(1);

      spyOn(containerService, 'movePrevious');
      targetElement.click();
      expect(containerService.movePrevious).toHaveBeenCalled();
    });

    it('move the selected container down', function() {
      var targetElement = actualElement.find(
          'button.container-move-down');
      expect(targetElement.length).toBe(1);

      spyOn(containerService, 'moveNext');
      targetElement.click();
      expect(containerService.moveNext).toHaveBeenCalled();
    });

    it('remove the selected container', function() {
      var targetElement = actualElement.find(
          'button.container-remove');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'removeSelectedContainer');
      targetElement.click();
      expect(actualController.removeSelectedContainer).toHaveBeenCalled();
    });

    it('call the remove method when the user confirms the deletion', function() {
      var targetElement = actualElement.find(
          'button.container-remove');
      expect(targetElement.length).toBe(1);

      spyOn(window, 'confirm').and.returnValue(true);

      spyOn(containerService, 'remove');
      targetElement.click();
      expect(containerService.remove).toHaveBeenCalled();
    });

    it('do nothing when the user does not confirm the deletion', function() {
      var targetElement = actualElement.find(
          'button.container-remove');
      expect(targetElement.length).toBe(1);

      spyOn(window, 'confirm').and.returnValue(false);

      spyOn(containerService, 'remove');
      targetElement.click();
      expect(containerService.remove).not.toHaveBeenCalled();
    });

  });
});
