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
 * @fileoverview WidgetEditorService is an angular service used to provide
 * and edit configuration for charts (GvizChartConfig). It uses the
 * google.visualization ChartEditor to provide a basic UX
 * (similar to Google Spreadsheets).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.WidgetEditorService');

goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.GvizEvents');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartEditor');
goog.require('p3rf.perfkit.explorer.models.ChartModel');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartModel = explorer.models.ChartModel;
const ChartWrapperService = (
    explorer.components.widget.data_viz.gviz.ChartWrapperService);



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.$q} $q
 * @param {!angular.Scope} $rootScope
 * @param {ChartWrapperService} chartWrapperService
 * @param {function(new:google.visualization.ChartEditor)} GvizChartEditor
 * @param {*} gvizEvents
 * @constructor
 * @ngInject
 */
explorer.components.widget.data_viz.WidgetEditorService = function(
    $q, $rootScope, chartWrapperService, GvizChartEditor, gvizEvents) {
  /**
   * @type {!angular.$q}
   * @private
   */
  this.q_ = $q;

  /**
   * @type {!angular.Scope}
   * @private
   */
  this.rootScope_ = $rootScope;

  /**
   * @type {ChartWrapperService}
   * @private
   */
  this.chartWrapperService_ = chartWrapperService;

  /**
   * @type {function(new:google.visualization.ChartEditor)}
   * @private
   */
  this.GvizChartEditor_ = GvizChartEditor;

  /**
   * @type {*}
   * @private
   */
  this.gvizEvents_ = gvizEvents;
};
const WidgetEditorService = (
    explorer.components.widget.data_viz.WidgetEditorService);


/**
 * Opens a google.visualization ChartEditor with the parameters provided.
 * When the editor is closed, it resolves a promise with the new chart
 * configuration.
 *
 * @param {ChartModel} chartModel
 * @param {google.visualization.DataTable} dataTable
 * @return {angular.$q.Promise.<ChartModel>}
 */
WidgetEditorService.prototype.showEditor = function(chartModel, dataTable) {
  let deferred = this.q_.defer();

  let editorClosed = function() {
    let newChartWrapper = editor.getChartWrapper();
    let newChartConfig =
        this.chartWrapperService_.getChartModel(newChartWrapper);

    this.rootScope_.$apply(function() {
      deferred.resolve(newChartConfig);
    });
  };

  let editor = new this.GvizChartEditor_();
  // TODO: Investigate if we have to unlisten this event.
  this.gvizEvents_.addListener(editor, 'ok', angular.bind(this, editorClosed));

  // Create a new chart wrapper based on the chart configuration
  let chartWrapper = this.chartWrapperService_.create(chartModel.chartType,
      chartModel.options, dataTable);
  editor.openDialog(chartWrapper);

  return deferred.promise;
};

});  // goog.scope
