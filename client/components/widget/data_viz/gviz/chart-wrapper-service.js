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
 * @fileoverview chartWrapperService is an angular service used to create
 * instances of google.visualization.ChartWrapper. It also provides some helper
 * methods around ChartWrapper.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');

goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartWrapper');
goog.require('p3rf.perfkit.explorer.models.ChartModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ChartModel = explorer.models.ChartModel;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {function(new:google.visualization.ChartWrapper)} GvizChartWrapper
 * @constructor
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.ChartWrapperService = function($http,
    GvizChartWrapper) {
  /**
   * @private
   */
  this.http_ = $http;

  /**
   * @type {function(new:google.visualization.ChartWrapper)}
   * @private
   */
  this.GvizChartWrapper_ = GvizChartWrapper;

  /**
   * @type {Array<{{title: string, className: string}}>
   * @export
   */
  this.allCharts = [];

  this.loadCharts();
};
var ChartWrapperService = (
    explorer.components.widget.data_viz.gviz.ChartWrapperService);


/**
 * Loads a list of available charts from a JSON file.
 */
ChartWrapperService.prototype.loadCharts = function() {
  this.http_.get('/static/components/widget/data_viz/gviz/gviz-charts.json').
      success(angular.bind(this, function(response) {
        $.merge(this.allCharts, response);
      })).
      error(angular.bind(this, function(response) {
        while (this.allCharts.length > 0) {
          this.allCharts.pop();
        }
      }));
};

/**
 * Returns a new instance of a google.visualization.ChartWrapper.
 *
 * @param {?string=} opt_chartType
 * @param {*=} opt_gvizOptions
 * @param {?google.visualization.DataTable=} opt_dataTable
 * @return {google.visualization.ChartWrapper}
 */
ChartWrapperService.prototype.create = function(
    opt_chartType, opt_gvizOptions, opt_dataTable) {
  var chartWrapper = new this.GvizChartWrapper_();
  if (opt_chartType) {
    chartWrapper.setChartType(opt_chartType);
  }
  if (opt_gvizOptions) {
    chartWrapper.setOptions(opt_gvizOptions);
  }
  if (opt_dataTable) {
    chartWrapper.setDataTable(opt_dataTable);
  }
  return chartWrapper;
};


/**
 * Returns a ChartModel object based on the ChartWrapper configuration.
 *
 * @param {google.visualization.ChartWrapper} gvizChartWrapper
 * @return {ChartModel}
 */
ChartWrapperService.prototype.getChartModel = function(gvizChartWrapper) {
  var model = new ChartModel();
  model.chartType = gvizChartWrapper.getChartType();
  model.options = gvizChartWrapper.getOptions();
  return model;
};

});  // goog.scope
