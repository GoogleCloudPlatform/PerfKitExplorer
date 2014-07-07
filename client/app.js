/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Primary module for the Explorer application.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.application.module');

goog.require('p3rf.dashkit.explorer.components.code_editor.CodeEditorCtrl');
goog.require('p3rf.dashkit.explorer.components.codemirror.CodeMirrorDirective');
goog.require('p3rf.dashkit.explorer.components.container.ContainerDirective');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardCtrl');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardVersionService');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageCtrl');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.FileUploadDialogDirective');
goog.require('p3rf.dashkit.explorer.components.explorer.ExplorerCtrl');
goog.require('p3rf.dashkit.explorer.components.explorer.ExplorerHeaderDirective');
goog.require('p3rf.dashkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.dashkit.explorer.components.multibox.MultiboxDirective');
goog.require('p3rf.dashkit.explorer.components.popupbox.PopupboxDirective');
goog.require('p3rf.dashkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.dashkit.explorer.components.util.GetByPropertyFilter');
goog.require('p3rf.dashkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.WidgetEditorCtrl');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.WidgetEditorService');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.getGvizChartEditor');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.getGvizChartWrapper');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.getGvizDataTable');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.getGvizDataView');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.gvizChart');
goog.require('p3rf.dashkit.explorer.components.widget.dashkitWidget');
goog.require('p3rf.dashkit.explorer.components.widget.query.DataViewService');
goog.require('p3rf.dashkit.explorer.components.widget.query.FieldCubeDataService');
goog.require('p3rf.dashkit.explorer.components.widget.query.MetadataPickerDirective');
goog.require('p3rf.dashkit.explorer.components.widget.query.QueryEditorCtrl');
goog.require('p3rf.dashkit.explorer.components.widget.query.QueryEditorService');
goog.require('p3rf.dashkit.explorer.components.widget.query.QueryResultDataService');
goog.require('p3rf.dashkit.explorer.components.widget.query.RelativeDatepickerDirective');
goog.require('p3rf.dashkit.explorer.mocks.mocks');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryBuilderService');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var requiredModules = [
  'ui.codemirror', 'ui.bootstrap', 'ngGrid'];

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

// Override $httpProvider behavior to handle POST parameters.  Based on code at:
// http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
// TODO: Replace POST handler logic with json.loads and remove this code.
explorer.application.module.config(
    function($httpProvider) {
      // Use x-www-form-urlencoded Content-Type
      $httpProvider.defaults.headers.post['Content-Type'] =
          'application/x-www-form-urlencoded;charset=utf-8';

      // Override $http service's default transformRequest
      $httpProvider.defaults.transformRequest = [function(data) {
        /**
      * The workhorse; converts an object to x-www-form-urlencoded
      * serialization.
      * @param {Object} obj
      * @return {?string}
      */
        var param = function(obj) {
          var query = '';
          var name, value, fullSubName, subName, subValue, innerObj, i;

          for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
              for (i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
              }
            }
            else if (value instanceof Object) {
              for (subName in value)
              {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
              }
            }
            else if (value !== undefined && value !== null) {
              query += (encodeURIComponent(name) + '=' +
                  encodeURIComponent(value) + '&');
            }
          }

          return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]' ?
            param(data) : data;
      }];
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
 * Register all controllers.
 */
explorer.application.module.controller('ExplorerCtrl',
    explorer.components.explorer.ExplorerCtrl);
explorer.application.module.controller('DashboardCtrl',
    explorer.components.dashboard.DashboardCtrl);
explorer.application.module.controller('DashboardAdminPageCtrl',
    explorer.components.dashboard_admin_page.DashboardAdminPageCtrl);
explorer.application.module.controller('WidgetEditorCtrl',
    explorer.components.widget.data_viz.WidgetEditorCtrl);
explorer.application.module.controller('QueryEditorCtrl',
    explorer.components.widget.query.QueryEditorCtrl);
explorer.application.module.controller('CodeEditorCtrl',
    explorer.components.code_editor.CodeEditorCtrl);


/**
 * Register all services.
 */
explorer.application.module.service('arrayUtilService',
    explorer.components.util.ArrayUtilService);
explorer.application.module.service('explorerService',
    explorer.components.explorer.ExplorerService);
explorer.application.module.service('dashboardDataService',
    explorer.components.dashboard.DashboardDataService);
explorer.application.module.service('dashboardService',
    explorer.components.dashboard.DashboardService);
explorer.application.module.service('dashboardVersionService',
    explorer.components.dashboard.DashboardVersionService);
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
    explorer.models.dashkit_simple_builder.QueryBuilderService);


/** Register all factories. **/
explorer.application.module.factory('GvizChartEditor',
    explorer.components.widget.data_viz.gviz.getGvizChartEditor);
explorer.application.module.factory('GvizDataTable',
    explorer.components.widget.data_viz.gviz.getGvizDataTable);
explorer.application.module.factory('GvizDataView',
    explorer.components.widget.data_viz.gviz.getGvizDataView);


/** Register all directives. **/
explorer.application.module.directive('gvizChartWidget',
    explorer.components.widget.data_viz.gviz.gvizChart);
explorer.application.module.directive('container',
    explorer.components.container.ContainerDirective);
explorer.application.module.directive('metadataPicker',
    explorer.components.widget.query.MetadataPickerDirective);
explorer.application.module.directive('explorerHeader',
    explorer.components.explorer.ExplorerHeaderDirective);
explorer.application.module.directive('multibox',
    explorer.components.multibox.MultiboxDirective);
explorer.application.module.directive('popupbox',
    explorer.components.popupbox.PopupboxDirective);
explorer.application.module.directive('relativeDatepicker',
    explorer.components.widget.query.RelativeDatepickerDirective);
explorer.application.module.directive('dashkitWidget',
    explorer.components.widget.dashkitWidget);
});  // goog.scope
