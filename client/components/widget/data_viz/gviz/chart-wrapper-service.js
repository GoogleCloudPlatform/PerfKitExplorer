/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview chartWrapperService is an angular service used to create
 * instances of google.visualization.ChartWrapper. It also provides some helper
 * methods around ChartWrapper.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');

goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.getGvizChartWrapper');
goog.require('p3rf.dashkit.explorer.models.ChartModel');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var ChartModel = explorer.models.ChartModel;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {function(new:google.visualization.ChartWrapper)} GvizChartWrapper
 * @constructor
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.ChartWrapperService = function(
    GvizChartWrapper) {
  /**
   * @type {function(new:google.visualization.ChartWrapper)}
   * @private
   */
  this.GvizChartWrapper_ = GvizChartWrapper;
};
var ChartWrapperService = (
    explorer.components.widget.data_viz.gviz.ChartWrapperService);


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
