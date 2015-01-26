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
 * @fileoverview Tests for the WidgetEditor controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.WidgetEditorCtrl');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');

describe('WidgetEditorCtrl', function() {
  var explorer = p3rf.perfkit.explorer;
  var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  var WidgetConfig = explorer.models.WidgetConfig;
  var WidgetType = explorer.models.WidgetType;
  var ctrl, scope, rootScope, dashboardService, showEditorDeferred,
      widgetEditorServiceMock, widgetFactoryService;
  var ctrlPrototype =
      explorer.components.widget.data_viz.WidgetEditorCtrl.prototype;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));

  beforeEach(module(function($provide) {
    var widgetEditorService = function($q) {
      // Mock showEditor promise
      showEditorDeferred = $q.defer();

      widgetEditorServiceMock = {
        showEditor: jasmine.createSpy().
            and.returnValue(showEditorDeferred.promise)
      };
      return widgetEditorServiceMock;
    };

    $provide.service('widgetEditorService', widgetEditorService);
  }));

  beforeEach(inject(function($rootScope, $controller, _dashboardService_,
      _widgetFactoryService_) {
        dashboardService = _dashboardService_;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        widgetFactoryService = _widgetFactoryService_;

        // Spies on watches called functions
        spyOn(ctrlPrototype, 'updateSelectedChart').and.callThrough();

        ctrl = $controller(
            explorer.components.widget.data_viz.WidgetEditorCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboard).toBeDefined();
    expect(ctrl.dashboard).not.toBeNull();
    expect(ctrl.selectedChart).toBeNull();
    expect(ctrl.errors).toEqual([]);
    expect(ctrl.openChartEditor).not.toBeNull();
    expect(typeof ctrl.openChartEditor).toBe('function');
  });

  describe('updateSelectedChart', function() {

    it('should be called when the selected widget reference changed.',
        function() {
          expect(ctrlPrototype.updateSelectedChart.calls.count()).toEqual(0);
          dashboardService.selectedWidget =
              new ChartWidgetConfig(widgetFactoryService);
          rootScope.$apply();
          expect(ctrlPrototype.updateSelectedChart.calls.count()).toEqual(1);

          dashboardService.selectedWidget =
              new ChartWidgetConfig(widgetFactoryService);
          rootScope.$apply();
          expect(ctrlPrototype.updateSelectedChart.calls.count()).toEqual(2);
        }
    );

    describe('The selected chart ', function() {

      it('should be the selected widget when the selected widget is a chart.',
          function() {
            var chart = new ChartWidgetConfig(widgetFactoryService);

            dashboardService.selectedWidget = chart;
            ctrl.updateSelectedChart();

            expect(ctrl.selectedChart).toBe(chart);
          }
      );

      it('should be null when the selected widget is not a chart.',
          function() {
            ctrl.selectedChart = {};
            var widget = new WidgetConfig(widgetFactoryService);

            dashboardService.selectedWidget = widget;
            ctrl.updateSelectedChart();

            expect(ctrl.selectedChart).toBeNull();
          }
      );

      it('should be null when there is no selected widget.',
          function() {
            ctrl.selectedChart = {};

            dashboardService.selectedWidget = null;
            ctrl.updateSelectedChart();

            expect(ctrl.selectedChart).toBeNull();
          }
      );
    });
  });

  describe('openWidgetEditor', function() {

    it('should show the WidgetEditor and update the selected chart ' +
       'configuration.',
        function() {
          var config = {obj: 'fake config'};
          dashboardService.selectedWidget =
              new ChartWidgetConfig(widgetFactoryService);
          rootScope.$apply();

          ctrl.openChartEditor_({});
          expect(widgetEditorServiceMock.showEditor).toHaveBeenCalledWith(
              dashboardService.selectedWidget.model.chart,
              jasmine.any(Object));

          showEditorDeferred.resolve(config);
          rootScope.$apply();
          expect(dashboardService.selectedWidget.model.chart).toBe(config);
        }
    );
  });
});
