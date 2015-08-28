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
 * @fileoverview Tests for ColumnStyleToolbarDirective, which encapsulates the
 * state for the container toolbar.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleToolbarDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');


describe('ColumnStyleToolbarDirective', function() {
  var scope, $compile, $timeout, uiConfig;
  var arrayUtilService, columnStyleService, dashboardService, widgetFactoryService;
  var providedColumn;

  const explorer = p3rf.perfkit.explorer;
  const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  const ColumnStyleModel = explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_, $httpBackend,
      _arrayUtilService_, _columnStyleService_, _dashboardService_,
      _widgetFactoryService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;

    arrayUtilService = _arrayUtilService_;
    columnStyleService = _columnStyleService_;
    dashboardService = _dashboardService_;
    widgetFactoryService = _widgetFactoryService_;

    scope.widgetConfig = new ChartWidgetConfig(widgetFactoryService);
    providedColumn = columnStyleService.addColumn(scope.widgetConfig.model);

    $httpBackend.expectGET(
        '/static/components/widget/data_viz/gviz/gviz-charts.json')
      .respond({});
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        var directiveElement = angular.element(
            '<column-style-toolbar ng-model="widgetConfig" />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain an element to', function() {
    var actualElement, actualController;

    beforeEach(inject(function() {
      actualElement = angular.element('<column-style-toolbar ng-model="widgetConfig" />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('columnStyleToolbar');
    }));

    it('show the add column dropdown button', function() {
      var targetElement = actualElement.find(
          'button.column-add');
      expect(targetElement.length).toBe(1);
    });

    it('list the add column options', function() {
      var targetElement = actualElement.find(
          'ul.column-add-dropdown');
      expect(targetElement.length).toBe(1);
    });

    it('add a column at the top', function() {
      var targetElement = actualElement.find(
          'li.column-add-top');
      expect(targetElement.length).toBe(1);

      spyOn(arrayUtilService, 'insertAt');
      targetElement.click();
      expect(arrayUtilService.insertAt).toHaveBeenCalledWith(
          scope.widgetConfig.model.chart.columns, new ColumnStyleModel(), 0);
    });

    it('add a column before the selected one', function() {
      var targetElement = actualElement.find(
          'li.column-add-before');
      expect(targetElement.length).toBe(1);
      columnStyleService.selectedColumn = providedColumn;

      spyOn(arrayUtilService, 'insertBefore');
      targetElement.click();
      expect(arrayUtilService.insertBefore).toHaveBeenCalledWith(
          scope.widgetConfig.model.chart.columns,
          new ColumnStyleModel(),
          columnStyleService.selectedColumn);
    });

    it('add a column after the selected one', function() {
      var targetElement = actualElement.find(
          'li.column-add-after');
      expect(targetElement.length).toBe(1);
      columnStyleService.selectedColumn = providedColumn;

      spyOn(arrayUtilService, 'insertAfter');
      targetElement.click();
      expect(arrayUtilService.insertAfter).toHaveBeenCalledWith(
          scope.widgetConfig.model.chart.columns,
          new ColumnStyleModel(),
          columnStyleService.selectedColumn);
    });

    it('add a column at the bottom', function() {
      var targetElement = actualElement.find(
          'li.column-add-bottom');
      expect(targetElement.length).toBe(1);
      columnStyleService.selectedColumn = providedColumn;

      spyOn(columnStyleService, 'addColumn');
      targetElement.click();
      expect(columnStyleService.addColumn).toHaveBeenCalledWith(
          scope.widgetConfig.model);
    });

    it('move the selected column up', function() {
      var targetElement = actualElement.find(
          'button.column-move-up');
      expect(targetElement.length).toBe(1);
      columnStyleService.selectedColumn = providedColumn;

      spyOn(arrayUtilService, 'movePrevious');
      spyOn(dashboardService, 'refreshWidget');

      targetElement.click();

      expect(arrayUtilService.movePrevious).toHaveBeenCalledWith(
          scope.widgetConfig.model.chart.columns,
          providedColumn);
      expect(dashboardService.refreshWidget).toHaveBeenCalledWith(
          scope.widgetConfig);
    });

    it('move the selected column down', function() {
      var targetElement = actualElement.find(
          'button.column-move-down');
      expect(targetElement.length).toBe(1);
      columnStyleService.selectedColumn = providedColumn;

      spyOn(arrayUtilService, 'moveNext');
      spyOn(dashboardService, 'refreshWidget');

      targetElement.click();

      expect(arrayUtilService.moveNext).toHaveBeenCalledWith(
          scope.widgetConfig.model.chart.columns,
          providedColumn);
      expect(dashboardService.refreshWidget).toHaveBeenCalledWith(
          scope.widgetConfig);
    });

    it('remove the selected column', function() {
      var targetElement = actualElement.find(
          'button.column-remove');
      expect(targetElement.length).toBe(1);
      columnStyleService.selectedColumn = providedColumn;

      spyOn(columnStyleService, 'removeColumn');
      targetElement.click();
      expect(columnStyleService.removeColumn).toHaveBeenCalledWith(
          scope.widgetConfig, providedColumn);
    });

  });
});
