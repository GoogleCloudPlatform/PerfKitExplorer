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
 * @fileoverview Primary module for the Explorer application.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.application.module');

goog.require('p3rf.perfkit.explorer.components.alert.AlertLogDirective');
goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorCtrl');
goog.require('p3rf.perfkit.explorer.components.codemirror.CodeMirrorDirective');
goog.require('p3rf.perfkit.explorer.components.config.ConfigDialogCtrl');
goog.require('p3rf.perfkit.explorer.components.config.ConfigDirective');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.container.ContainerConfigDirective');
goog.require('p3rf.perfkit.explorer.components.container.ContainerDirective');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfigDirective');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardCtrl');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionService');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageCtrl');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageService');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.FileUploadDialogCtrl');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerCtrl');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerHeaderDirective');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerPageDirective');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.layout.ResizeDirective');
goog.require('p3rf.perfkit.explorer.components.layout.ResizeService');
goog.require('p3rf.perfkit.explorer.components.multibox.MultiboxDirective');
goog.require('p3rf.perfkit.explorer.components.popupbox.PopupboxDirective');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.util.GetByPropertyFilter');
goog.require('p3rf.perfkit.explorer.components.util.FileModelDirective');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.WidgetEditorCtrl');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.WidgetEditorService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartConfigDirective');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartEditor');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartWrapper');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataTable');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataView');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.gvizChart');
goog.require('p3rf.perfkit.explorer.components.widget.perfkitWidget');
goog.require('p3rf.perfkit.explorer.components.widget.query.DataViewService');
goog.require('p3rf.perfkit.explorer.components.widget.query.FieldCubeDataService');
goog.require('p3rf.perfkit.explorer.components.widget.query.MetadataPickerDirective');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryEditorCtrl');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryEditorDirective');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryEditorService');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryResultDataService');
goog.require('p3rf.perfkit.explorer.components.widget.query.RelativeDatepickerDirective');
goog.require('p3rf.perfkit.explorer.components.widget.query.WidgetEditorDirective');
goog.require('p3rf.perfkit.explorer.mocks.mocks');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryBuilderService');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var requiredModules = [
  'ui.codemirror', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize',
  'ui.grid.resizeColumns', 'ui.grid.selection'];

var useMockData = (
    explorer.mocks.mocks.isMockParamTrue());
if (useMockData) {
  // This module override $http with a mock backend
  // See http://docs.angularjs.org/api/ngMockE2E.$httpBackend
  requiredModules.push('ngMockE2E');
}


/**
 * The main module for the Explorer app.
 */
explorer.application.module = angular.module('explorer', requiredModules);

explorer.application.module.config(
    function($locationProvider) {
      // See http://docs.angularjs.org/guide/dev_guide.services.$location
      $locationProvider.html5Mode(true).hashPrefix('!');
    });


if (useMockData) {
  explorer.mocks.mocks.addMocks(explorer.application.module);
}


/**
 * Register all filters.
 */
explorer.application.module.filter('getByProperty',
    function() {
      return explorer.components.util.GetByPropertyFilter;
    });


/**
 * Register all services.
 */
explorer.application.module.service('arrayUtilService',
    explorer.components.util.ArrayUtilService);
explorer.application.module.service('explorerService',
    explorer.components.explorer.ExplorerService);
explorer.application.module.service('configService',
  explorer.components.config.ConfigService);
explorer.application.module.service('dashboardDataService',
    explorer.components.dashboard.DashboardDataService);
explorer.application.module.service('dashboardService',
    explorer.components.dashboard.DashboardService);
explorer.application.module.service('dashboardVersionService',
    explorer.components.dashboard.DashboardVersionService);
explorer.application.module.service('errorService',
    explorer.components.error.ErrorService);
explorer.application.module.service('resizeService',
    explorer.components.layout.ResizeService);
explorer.application.module.service('queryEditorService',
    explorer.components.widget.query.QueryEditorService);
explorer.application.module.service('queryResultDataService',
    explorer.components.widget.query.QueryResultDataService);
explorer.application.module.factory('GvizChartWrapper',
    explorer.components.widget.data_viz.gviz.getGvizChartWrapper);
explorer.application.module.service('chartWrapperService',
    explorer.components.widget.data_viz.gviz.ChartWrapperService);
explorer.application.module.service('gvizEvents',
    explorer.components.widget.data_viz.gviz.GvizEvents);
explorer.application.module.service('widgetEditorService',
    explorer.components.widget.data_viz.WidgetEditorService);
explorer.application.module.service('dataViewService',
    explorer.components.widget.query.DataViewService);
explorer.application.module.service('fieldCubeDataService',
    explorer.components.widget.query.FieldCubeDataService);
explorer.application.module.service('widgetFactoryService',
    explorer.components.widget.WidgetFactoryService);
explorer.application.module.service('queryBuilderService',
    explorer.models.perfkit_simple_builder.QueryBuilderService);
explorer.application.module.service('dashboardAdminPageService',
    explorer.components.dashboard_admin_page.DashboardAdminPageService);


/**
 * Register all controllers.
 */
explorer.application.module.controller('ConfigDialogCtrl',
    explorer.components.config.ConfigDialogCtrl);
explorer.application.module.controller('ExplorerCtrl',
    explorer.components.explorer.ExplorerCtrl);
explorer.application.module.controller('DashboardCtrl',
    explorer.components.dashboard.DashboardCtrl);
explorer.application.module.controller('DashboardAdminPageCtrl',
    explorer.components.dashboard_admin_page.DashboardAdminPageCtrl);
explorer.application.module.controller('FileUploadDialogCtrl',
    explorer.components.dashboard_admin_page.FileUploadDialogCtrl);
explorer.application.module.controller('WidgetEditorCtrl',
    explorer.components.widget.data_viz.WidgetEditorCtrl);
explorer.application.module.controller('QueryEditorCtrl',
    explorer.components.widget.query.QueryEditorCtrl);
explorer.application.module.controller('CodeEditorCtrl',
    explorer.components.code_editor.CodeEditorCtrl);


/** Register all factories. **/
explorer.application.module.factory('GvizChartEditor',
    explorer.components.widget.data_viz.gviz.getGvizChartEditor);
explorer.application.module.factory('GvizDataTable',
    explorer.components.widget.data_viz.gviz.getGvizDataTable);
explorer.application.module.factory('GvizDataView',
    explorer.components.widget.data_viz.gviz.getGvizDataView);


/** Register all directives. **/
explorer.application.module.directive('chartConfig',
    explorer.components.widget.data_viz.gviz.ChartConfigDirective);
explorer.application.module.directive('alertLog',
    explorer.components.alert.AlertLogDirective);
explorer.application.module.directive('gvizChartWidget',
    explorer.components.widget.data_viz.gviz.gvizChart);
explorer.application.module.directive('explorerConfig',
    explorer.components.config.ConfigDirective);
explorer.application.module.directive('container',
    explorer.components.container.ContainerDirective);
explorer.application.module.directive('containerConfig',
  explorer.components.container.ContainerConfigDirective)
explorer.application.module.directive('metadataPicker',
    explorer.components.widget.query.MetadataPickerDirective);
explorer.application.module.directive('resize',
    explorer.components.layout.ResizeDirective);
explorer.application.module.directive('explorerHeader',
    explorer.components.explorer.ExplorerHeaderDirective);
explorer.application.module.directive('explorerPage',
    explorer.components.explorer.ExplorerPageDirective);
explorer.application.module.directive('multibox',
    explorer.components.multibox.MultiboxDirective);
explorer.application.module.directive('popupbox',
    explorer.components.popupbox.PopupboxDirective);
explorer.application.module.directive('queryEditor',
    explorer.components.widget.query.QueryEditorDirective);
explorer.application.module.directive('relativeDatepicker',
    explorer.components.widget.query.RelativeDatepickerDirective);
explorer.application.module.directive('perfkitWidget',
    explorer.components.widget.perfkitWidget);
explorer.application.module.directive('fileModel',
    explorer.components.util.FileModelDirective);
explorer.application.module.directive('dashboardConfig',
    explorer.components.dashboard.DashboardConfigDirective);
explorer.application.module.directive('widgetEditor',
    explorer.components.widget.query.WidgetEditorDirective);
});  // goog.scope
