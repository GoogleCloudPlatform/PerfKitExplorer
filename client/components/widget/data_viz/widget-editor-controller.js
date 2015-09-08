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
 * @fileoverview WidgetEditorController is an angular controller used to edit
 * the configuration of the selected chart. It provides two way of editing a
 * chart, via the WidgetEditorService or via the different inputs in the
 * sidebar.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.WidgetEditorCtrl');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.WidgetEditorService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataTable');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryResultDataService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
const WidgetEditorService = (
    explorer.components.widget.data_viz.gviz.WidgetEditorService);
const DashboardService = explorer.components.dashboard.DashboardService;
const QueryResultDataService = (
    explorer.components.widget.query.QueryResultDataService);



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!DashboardService} dashboardService
 * @param {!WidgetEditorService} widgetEditorService
 * @param {!QueryResultDataService} queryResultDataService
 * @param {!function(new:google.visualization.DataTable, ...)} GvizDataTable
 * @constructor
 * @ngInject
 */
explorer.components.widget.data_viz.WidgetEditorCtrl = function($scope,
    dashboardService, widgetEditorService, queryResultDataService,
    GvizDataTable) {
  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /**
   * @type {!ChartEditorService}
   * @private
   */
  this.widgetEditorService_ = widgetEditorService;

  /**
   * @type {!QueryResultDataService}
   * @private
   */
  this.queryResultDataService_ = queryResultDataService;

  /**
   * @type {!function(new:google.visualization.DataTable, ...)}
   * @private
   */
  this.GvizDataTable_ = GvizDataTable;

  /**
   * @type {!DashboardService}
   * @export
   */
  this.dashboard = dashboardService;

  /**
   * The selected chart in the dashboard.
   *
   * @type {?ChartWidgetConfig}
   * @export
   */
  this.selectedChart = null;

  /**
   * Error messages raised by this controller.
   *
   * @type {!Array.<string>}
   * @export
   */
  this.errors = [];

  let self = this;
  $scope.$watch(
      function() { return self.dashboard.selectedWidget; },
      angular.bind(this, self.updateSelectedChart));
};
const WidgetEditorCtrl = explorer.components.widget.data_viz.WidgetEditorCtrl;


/**
 * Fetches the data of the selected chart and then opens the google
 * visualization chart editor.
 * @export
 */
WidgetEditorCtrl.prototype.openChartEditor = function() {
  let selectedChart = this.selectedChart;
  if (selectedChart) {
    let promise = this.queryResultDataService_.
        fetchResults(selectedChart.model.datasource);

    promise.then(angular.bind(this, function(dataTable) {
      this.openChartEditor_(dataTable);
    }));

    promise.then(null, angular.bind(this, function(error) {
      this.errors.push(error.message);
    }));
  }
};


/**
 * Opens the google visualization chart editor with the data and the
 * configuration of the selected chart.
 *
 * @param {google.visualization.DataTable} dataTable
 * @private
 */
WidgetEditorCtrl.prototype.openChartEditor_ = function(dataTable) {
  let selectedChart = this.selectedChart;
  let promise = this.widgetEditorService_.
      showEditor(selectedChart.model.chart, dataTable);

  promise.then(angular.bind(this, function(newGvizConfig) {
    selectedChart.model.chart = newGvizConfig;
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error.message);
  }));
};


/**
 * Checks if the selected widget is a chart and updates the selected chart
 * reference.
 */
WidgetEditorCtrl.prototype.updateSelectedChart = function() {
  let selectedWidget = this.dashboard.selectedWidget;
  // Check if the widget has a 'chart' property
  let isChart = selectedWidget && selectedWidget.model.chart;
  this.selectedChart = isChart ? selectedWidget : null;
};

});  // goog.scope
