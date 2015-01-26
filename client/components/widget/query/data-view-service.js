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
 *     "sort_columns": false,
 *     "sort_column_start": null
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

  if (model.sort_columns) {
    try {
      view.setColumns(this.getSortedColumns(dataTable, model.sort_column_start))
    } catch (e) {
      // Catch errors when the columns property is invalid
      return {error: {property: 'columns', message: e.message}};
    }
  } else if (model.columns && model.columns.length > 0) {
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

/**
 * Returns an array of DataView initializer objects corresponding to the
 * parameters provided (columns filtering, rows filtering and sorting) applied
 * to the DataTable provided.
 *
 * @param {!google.visualization.DataTable} dataTable
 * @param {?number} sortColumnStart The index of the column to begin sorting at.  This can be used to fix the first
 *    few columns of a tabular report.
 * @return {!(Array.<Object>|{error: {property: string, message: string}})}
 */
DataViewService.prototype.getSortedColumns = function(dataTable, sortColumnStart) {
  sortColumnStart = sortColumnStart || 0;

  if (sortColumnStart >= dataTable.getNumberOfColumns()) {
    throw 'sortColumnStart must be greater than or equal to the total column count.';
  }

  var allColumnNames = [];
  var outputColumns = [];
  var sortableColumnNames = [];

  for (var i = 0; i < dataTable.getNumberOfColumns(); ++i) {
    var columnName = dataTable.getColumnLabel(i);
    allColumnNames.push(columnName);

    if (i < sortColumnStart) {
      outputColumns.push(i);
    } else {
      sortableColumnNames.push(columnName);
    }
  }

  sortableColumnNames.sort();

  for (var i = 0; i < sortableColumnNames.length; ++i) {
    sortableIndex = allColumnNames.indexOf(sortableColumnNames[i]);

    if (sortableIndex == -1) {
      throw 'sortableColumn not found.';
    }

    outputColumns.push(sortableIndex);
  }

  return outputColumns;
};

});  // goog.scope
