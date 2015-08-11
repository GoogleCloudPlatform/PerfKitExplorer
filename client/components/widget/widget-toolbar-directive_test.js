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
 * @fileoverview Tests for WidgetToolbarDirective, which encapsulates the
 * state for the widget toolbar.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetToolbarDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');

describe('WidgetToolbarDirective', function() {
  var scope, $compile, $timeout, uiConfig;
  var containerService, dashboardService, explorerService;

  const explorer = p3rf.perfkit.explorer;
  const ChartWidgetConfig = explorer.models.ChartWidgetConfig;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_,
      _dashboardService_, _containerService_, _explorerService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;

    containerService = _containerService_;
    dashboardService = _dashboardService_;
    explorerService = _explorerService_;

    explorerService.newDashboard();

    scope.$digest();
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        var directiveElement = angular.element(
            '<widget-toolbar />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain an element to', function() {
    var actualElement, actualController, actualWidget;

    beforeEach(inject(function() {
      actualElement = angular.element('<widget-toolbar />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('widgetToolbar');
    }));

    it('refresh the widget\'s data', function() {
      var targetElement = actualElement.find(
          'button.widget-refresh');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'refreshSelectedWidget');
      targetElement.click();
      expect(actualController.refreshSelectedWidget).toHaveBeenCalled();
    });

    it('show the insert widget options', function() {
      var targetElement = actualElement.find(
          'button.widget-insert');
      expect(targetElement.length).toBe(1);
    });

    it('list the insert widget options', function() {
      var targetElement = actualElement.find(
          'ul.widget-insert-dropdown');
      expect(targetElement.length).toBe(1);
    });

    it('insert a widget at the start of the container', function() {
      var targetElement = actualElement.find(
          'li.widget-insert-first');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'insertWidgetAt');
      targetElement.click();
      expect(actualController.insertWidgetAt).toHaveBeenCalledWith(0);
    });

    it('insert a widget before the selected one', function() {
      var targetElement = actualElement.find(
          'li.widget-insert-before');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'insertWidgetBeforeSelected');
      targetElement.click();
      expect(actualController.insertWidgetBeforeSelected).toHaveBeenCalled();
    });

    it('insert a widget after the selected one', function() {
      var targetElement = actualElement.find(
          'li.widget-insert-after');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'insertWidgetAfterSelected');
      targetElement.click();
      expect(actualController.insertWidgetAfterSelected).toHaveBeenCalled();
    });

    it('insert a widget at the end of the container', function() {
      var targetElement = actualElement.find(
          'li.widget-insert-last');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'insertWidget');
      targetElement.click();
      expect(actualController.insertWidget).toHaveBeenCalled();
    });

    describe('move the selected widget to the', function() {
      var selectedContainer, selectedWidget;

      beforeEach(inject(function() {
        selectedContainer = containerService.insert();
        dashboardService.selectWidget(
            dashboardService.addWidget(selectedContainer),
            selectedContainer);
      }));

      it('previous container', function() {
        var targetElement = actualElement.find(
            'button.widget-move-previous-container');
        expect(targetElement.length).toBe(1);

        spyOn(actualController, 'moveWidgetToPreviousContainer');
        targetElement.click();
        expect(actualController.moveWidgetToPreviousContainer).toHaveBeenCalled();
      });

      it('next position', function() {
        var targetElement = actualElement.find(
            'button.widget-move-next');
        expect(targetElement.length).toBe(1);

        spyOn(actualController, 'moveWidgetToNext');
        targetElement.click();
        expect(actualController.moveWidgetToNext).toHaveBeenCalled();
      });

      it('previous position', function() {
        var targetElement = actualElement.find(
            'button.widget-move-previous');
        expect(targetElement.length).toBe(1);

        spyOn(actualController, 'moveWidgetToPrevious');
        targetElement.click();
        expect(actualController.moveWidgetToPrevious).toHaveBeenCalled();
      });

      it('next container', function() {
        var targetElement = actualElement.find(
            'button.widget-move-next-container');
        expect(targetElement.length).toBe(1);

        spyOn(actualController, 'moveWidgetToNextContainer');
        targetElement.click();
        expect(actualController.moveWidgetToNextContainer).toHaveBeenCalled();
      });

      it('show the widget sql panel', function() {
        var targetElement = actualElement.find(
            'button.widget-sql-show');
        expect(targetElement.length).toBe(1);

        spyOn(explorerService, 'viewSql');
        targetElement.click();
        expect(explorerService.viewSql).toHaveBeenCalled();
      });

      it('use the sql builder', function() {
        var targetElement = actualElement.find(
            'button.widget-sql-build');
        expect(targetElement.length).toBe(1);

        spyOn(explorerService, 'restoreBuilder');
        targetElement.click();
        expect(explorerService.restoreBuilder).toHaveBeenCalled();
      });

      it('show the widget json panel', function() {
        var targetElement = actualElement.find(
            'button.widget-json-show');
        expect(targetElement.length).toBe(1);

        spyOn(explorerService, 'editJson');
        targetElement.click();
        expect(explorerService.editJson).toHaveBeenCalled();
      });

      it('remove the selected widget', function() {
        var targetElement = actualElement.find(
            'button.widget-delete');
        expect(targetElement.length).toBe(1);

        spyOn(actualController, 'removeSelectedWidget');
        targetElement.click();
        expect(actualController.removeSelectedWidget).toHaveBeenCalled();
      });
    });
  });
});
