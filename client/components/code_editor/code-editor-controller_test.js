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
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');

describe('CodeEditorCtrl', function() {
  const explorer = p3rf.perfkit.explorer;
  const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  const ExplorerStateService = explorer.components.explorer.ExplorerStateService;
  const WidgetType = explorer.models.WidgetType;

  var ctrl, scope, rootScope, dashboardSvc, widgetFactorySvc, explorerStateSvc;
  var container, widget;
  var $state;
  var ctrlPrototype =
      explorer.components.code_editor.CodeEditorCtrl.prototype;

  beforeEach(module('explorer'));

  beforeEach(inject(function(
      $rootScope, $controller, _dashboardService_, _explorerStateService_,
      _widgetFactoryService_, errorService, _$state_) {
    errorService.logToConsole = false;

    dashboardSvc = _dashboardService_;
    explorerStateSvc = _explorerStateService_;
    widgetFactorySvc = _widgetFactoryService_;
    $state = _$state_;

    rootScope = $rootScope;
    scope = $rootScope.$new();

    // Spies on watches called functions
    spyOn(ctrlPrototype, 'saveJsonToText').and.callThrough();
    spyOn(ctrlPrototype, 'saveTextToJson').and.callThrough();

    ctrl = $controller(
        explorer.components.code_editor.CodeEditorCtrl,
        {$scope: scope});

    dashboardSvc.newDashboard();
    rootScope.$apply();

    container = explorerStateSvc.containers.selected;
    widget = explorerStateSvc.widgets.selected;

    explorerStateSvc.selectWidget(null, null);
    scope.$digest();
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

    beforeEach(inject(function() {
      ctrl.saveJsonToText.calls.reset();
    }));

    it('should be called when the selected object changed.',
        function() {
          expect(ctrl.saveJsonToText.calls.count()).toEqual(0);

          explorerStateSvc.selectWidget(container.model.id, widget.model.id);
          rootScope.$apply();

          expect(ctrl.saveJsonToText.calls.count()).toEqual(1);

          explorerStateSvc.widgets.selected.model.chart.options.title =
              'fake title';
          rootScope.$apply();
          expect(ctrl.saveJsonToText.calls.count()).toEqual(2);
        }
    );

    it('should update the currentJson property with the content of the ' +
       'current object.',
        function() {
          dashboardSvc.newDashboard();
          rootScope.$apply();

          var newWidget = new ChartWidgetConfig(widgetFactorySvc);
          newWidget.model.title = 'Expected Title';

          explorerStateSvc.widgets.all[newWidget.model.id] = newWidget;

          explorerStateSvc.selectWidget(null, newWidget.model.id);

          rootScope.$apply();

          ctrl.saveJsonToText();

          expect(ctrl.currentJson.text).
              toBe(angular.toJson(newWidget.model, true));
        }
    );
  });

  describe('saveTextToJson', function() {

    beforeEach(inject(function() {
      ctrl.saveTextToJson.calls.reset();
    }));

    it('should be called when the currentJson reference changed.',
        function() {
          rootScope.$apply();
          expect(ctrl.saveTextToJson.calls.count()).toEqual(0);
          ctrl.currentJson.text = 'fake model 1';
          rootScope.$apply();
          expect(ctrl.saveTextToJson.calls.count()).toEqual(1);

          ctrl.currentJson.text = 'fake model 2';
          rootScope.$apply();
          expect(ctrl.saveTextToJson.calls.count()).toEqual(2);
        }
    );

    it('should update the current object with the content of the currentJson ' +
        'property.',
        function() {
          dashboardSvc.newDashboard();
          rootScope.$apply();

          var model = {obj: 'model'};
          ctrl.currentJson.text = angular.toJson(model, true);

          ctrl.saveTextToJson();
          rootScope.$apply();

          expect(dashboardSvc.selectedWidget.model).
              toEqual(model);
        }
    );

    it('should catch the errors coming from invalid JSON.', function() {
      dashboardSvc.selectedWidget =
          new ChartWidgetConfig(widgetFactorySvc);
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
