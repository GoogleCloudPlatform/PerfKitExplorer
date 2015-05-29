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
 * @fileoverview Tests for the QueryEditor controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryEditorCtrl');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');

goog.scope(function() {

describe('QueryEditorCtrl', function() {
  var explorer = p3rf.perfkit.explorer;
  var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  var WidgetConfig = explorer.models.WidgetConfig;
  var WidgetType = explorer.models.WidgetType;
  var ResultsDataStatus = explorer.models.ResultsDataStatus;
  var ctrl, scope, rootScope, dashboardService, queryEditorService, mockQuery,
      widgetFactoryService;
  var ctrlPrototype =
      explorer.components.widget.query.QueryEditorCtrl.prototype;


  var mockQuery = 'mock query';

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));

  beforeEach(inject(function($rootScope, $controller, _dashboardService_,
      _queryEditorService_, _widgetFactoryService_) {
        dashboardService = _dashboardService_;
        queryEditorService = _queryEditorService_;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        widgetFactoryService = _widgetFactoryService_;

        ctrl = $controller(
            explorer.components.widget.query.QueryEditorCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboardSvc).toBeDefined();
    expect(ctrl.dashboardSvc).not.toBeNull();

    expect(ctrl.querySvc).toBeDefined();
    expect(ctrl.querySvc).not.toBeNull();
  });

});

});  // goog.scope
