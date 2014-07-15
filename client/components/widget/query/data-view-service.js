/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview dataViewService is an angular service used to create
 * gviz DataView initializer objects corresponding to a specific configuration.
 * This configuration is represented by the class DataViewModel and looks like
 * a simple JSON object.
 *
 * See documentation on DataView:
 * https://developers.google.com/chart/interactive/docs/reference#DataView
 *
 * Sample JSON configuration object (or DataViewModel):
 * {
 *     "columns": [
 *         0,
 *         1,
 *         2
 *     ],
 *     "filter": [
 *         {
 *             "column": 1,
 *             "minValue": 0,
 *             "maxValue": 0.5
 *         }
 *     ],
 *     "sort": [
 *         {
 *             "column": 1
 *         }
 *     ]
 * }
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.DataViewService');

goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataView');
goog.require('p3rf.perfkit.explorer.models.DataViewModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var DataViewModel = explorer.models.DataViewModel;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {function(new:google.visualization.DataView, ...)} GvizDataView
 * @constructor
 * @ngInject
 */
explorer.components.widget.query.DataViewService = function(GvizDataView) {
  /**
   * @type {function(new:google.visualization.DataView, ...)}
   * @private
   */
  this.GvizDataView_ = GvizDataView;
};
var DataViewService = explorer.components.widget.query.DataViewService;


/**
 * Returns an array of DataView initializer objects corresponding to the
 * parameters provided (columns filtering, rows filtering and sorting) applied
 * to the DataTable provided.
 *
 * @param {!google.visualization.DataTable} dataTable
 * @param {!DataViewModel} model
 * @return {!(Array.<Object>|{error: {property: string, message: string}})}
 */
DataViewService.prototype.create = function(dataTable, model) {
  var view = new this.GvizDataView_(dataTable);
  var sortedViewJson;

  if (model.filter && model.filter.length > 0) {
    try {
      var filteredRows = view.getFilteredRows(model.filter);
      view.setRows(filteredRows);
    } catch (e) {
      // Catch errors when the filter property is invalid
      return {error: {property: 'filter', message: e.message}};
    }
  }

  if (model.sort && model.sort.length > 0) {
    try {
      var sortedRows = view.getSortedRows(model.sort);
      // sortedRows are not applied to the view because it will conflict with
      // filteredRows. sortedRows are given as a second DataView initializer
      // object.
      sortedViewJson = { rows: sortedRows };
    } catch (e) {
      // Catch errors when the sort property is invalid
      return {error: {property: 'sort', message: e.message}};
    }
  }

  if (model.columns && model.columns.length > 0) {
    try {
      view.setColumns(model.columns);
    } catch (e) {
      // Catch errors when the columns property is invalid
      return {error: {property: 'columns', message: e.message}};
    }
  }

  var viewJson = angular.fromJson(view.toJSON());
  return sortedViewJson ?
      [viewJson, sortedViewJson] : [viewJson];
};

});  // goog.scope
