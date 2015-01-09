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
 * @fileoverview Tests for the CodeEditor controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorCtrl');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');

describe('CodeEditorCtrl', function() {
  var explorer = p3rf.perfkit.explorer;
  var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  var WidgetType = explorer.models.WidgetType;
  var ctrl, scope, rootScope, dashboardService, widgetFactoryService;
  var ctrlPrototype =
      explorer.components.code_editor.CodeEditorCtrl.prototype;

  beforeEach(module('explorer'));

  beforeEach(inject(function($rootScope, $controller, _dashboardService_,
      _widgetFactoryService_) {
        dashboardService = _dashboardService_;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        widgetFactoryService = _widgetFactoryService_;

        // Spies on watches called functions
        spyOn(ctrlPrototype, 'saveJsonToText').and.callThrough();
        spyOn(ctrlPrototype, 'saveTextToJson').and.callThrough();

        ctrl = $controller(
            explorer.components.code_editor.CodeEditorCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboard).toBeDefined();
    expect(ctrl.dashboard).not.toBeNull();
    expect(ctrl.currentJson).toEqual({text: null});
    expect(ctrl.errors).toEqual([]);
    expect(ctrl.openCodeEditor).not.toBeNull();
    expect(typeof ctrl.openCodeEditor).toBe('function');
    expect(ctrl.closeCodeEditor).not.toBeNull();
    expect(typeof ctrl.closeCodeEditor).toBe('function');
  });

  describe('saveJsonToText', function() {

    it('should be called when the selected object changed.',
        function() {
          expect(ctrlPrototype.saveJsonToText.calls.count()).toEqual(0);
          rootScope.$apply();
          expect(ctrlPrototype.saveJsonToText.calls.count()).toEqual(1);
          dashboardService.selectedWidget =
              new ChartWidgetConfig(widgetFactoryService);
          rootScope.$apply();
          expect(ctrlPrototype.saveJsonToText.calls.count()).toEqual(2);

          dashboardService.selectedWidget.model.chart.options.title =
              'fake title';
          rootScope.$apply();
          expect(ctrlPrototype.saveJsonToText.calls.count()).toEqual(3);
        }
    );

    it('should update the currentJson property with the content of the ' +
       'current object.',
        function() {
          var chart = new ChartWidgetConfig(widgetFactoryService);
          chart.model.title = 'fake title';

          dashboardService.selectedWidget = chart;
          ctrl.saveJsonToText();
          expect(ctrl.currentJson.text).
              toBe(angular.toJson(chart.model, true));
        }
    );
  });

  describe('saveTextToJson', function() {

    it('should be called when the currentJson reference changed.',
        function() {
          rootScope.$apply();
          expect(ctrlPrototype.saveTextToJson.calls.count()).toEqual(1);
          ctrl.currentJson.text = 'fake model 1';
          rootScope.$apply();
          expect(ctrlPrototype.saveTextToJson.calls.count()).toEqual(2);

          ctrl.currentJson.text = 'fake model 2';
          rootScope.$apply();
          expect(ctrlPrototype.saveTextToJson.calls.count()).toEqual(3);
        }
    );

    it('should update the current object with the content of the currentJson ' +
        'property.',
        function() {
          var model = {obj: 'model'};
          dashboardService.selectedWidget =
              new ChartWidgetConfig(widgetFactoryService);
          ctrl.currentJson.text = angular.toJson(model, true);

          ctrl.saveTextToJson();
          expect(dashboardService.selectedWidget.model).
              toEqual(model);
        }
    );

    it('should catch the errors coming from invalid JSON.', function() {
      dashboardService.selectedWidget =
          new ChartWidgetConfig(widgetFactoryService);
      ctrl.currentJson.text = '{badjson:}';

      function SaveTextToJson() {
        ctrl.saveTextToJson();
      }

      expect(SaveTextToJson).not.toThrow();
    });
  });

  describe('openCodeEditor', function() {

    it('should set isOpen to true.', function() {
      expect(ctrl.settings.isOpen).toBeFalsy();
      ctrl.openCodeEditor();
      expect(ctrl.settings.isOpen).toBeTruthy();
    });
  });

  describe('closeCodeEditor', function() {

    it('should set isOpen to false.', function() {
      ctrl.settings.isOpen = true;
      ctrl.closeCodeEditor();
      expect(ctrl.settings.isOpen).toBeFalsy();
    });
  });
});
