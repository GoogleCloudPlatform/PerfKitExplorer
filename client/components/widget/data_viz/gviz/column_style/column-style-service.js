/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview columnStyleService is an angular service used format
 * DataTable, DataView and/or Chart config based on widget config.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleService');

goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;
const ColumnStyleModel = gviz.column_style.ColumnStyleModel;
const ErrorTypes = explorer.components.error.ErrorTypes;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @export
 * @ngInject
 */
gviz.column_style.ColumnStyleService = class {
  constructor(errorService, arrayUtilService, dashboardService) {
    /** @export {!ArrayUtilService} */
    this.arrayUtilSvc = arrayUtilService;

    /** @export {!DashboardService} */
    this.dashboardSvc = dashboardService;

    /** @export {!ErrorService} */
    this.errorSvc = errorService;

    /**
     * Specifies the currently selected column in the UX.
     * @export {?ColumnStyleModel}
     */
    this.selectedColumn = null;
  }

  /**
   * Creates a new column and returns it.
   * @return {!ColumnStyleModel}
   * @export
   */
  newColumn() {
    return new ColumnStyleModel();
  }

  /**
   * Adds a new column and returns it.
   * @return {!ColumnStyleModel}
   * @export
   */
  addColumn(config) {
    let newColumn = this.newColumn();

    config.chart.columns.push(newColumn);

    return newColumn;
  }

  /**
   * Removes the provided column from the provided widget config.
   * @param {!ChartWidgetConfig} widget
   * @param {!ColumnStyleModel} column
   * @export
   */
  removeColumn(widget, column) {
    if (this.selectedColumn == column) {
      this.selectedColumn = null;
    }

    this.arrayUtilSvc.remove(widget.model.chart.columns, column);

    // Revert the label back to the column id.
    let dataTable = widget.state().datasource.data;
    if (goog.isDefAndNotNull(dataTable)) {
      let columnIndex = this.getColumnIndex(column.column_id, dataTable);

      goog.asserts.assert(columnIndex !== -1);

      dataTable.setColumnLabel(columnIndex, column.column_id);
    }
  }

  /**
   * Adds any columns present in the dataTable but not already defined.
   * @param {!ChartWidgetConfig} widget
   * @export
   */
  addColumnsFromDatasource(widget) {
    widget.model.chart.columns = this.getEffectiveColumns(
        widget.model.chart.columns,
        widget.state().datasource.data);
    this.dashboardSvc.refreshWidget(widget);
  }

  /**
   * Returns any explicitly-defined columns, followed by any additional
   * columns present in the dataTable.
   *
   * @param {!Array.<ColumnStyleModel>} columns
   * @param {!google.visualizations.DataTable} dataTable
   * @return {!Array.<!ColumnStyleModel>}
   * @export
   */
  getEffectiveColumns(columns, dataTable) {
    let effectiveColumns = [];
    let definedColumnStyles = {};
    let columnIndex = null;

    if (!goog.isDefAndNotNull(dataTable)) {
      return columns;
    }

    columns.forEach(column => {
      columnIndex = this.getColumnIndex(column.column_id, dataTable);

      if (columnIndex === -1) {
        this.errorSvc.addError(ErrorTypes.WARNING,
            'applyToDataTable warning: column \'' + column.column_id +
            '\' could not be found.');
      } else {
        definedColumnStyles[column.column_id] = true;

        effectiveColumns.push(column);
      }
    });

    for (let i=0, len=dataTable.getNumberOfColumns(); i<len; ++i) {
      let columnId = dataTable.getColumnId(i);

      if (!definedColumnStyles[columnId]) {
        effectiveColumns.push(new ColumnStyleModel(dataTable.getColumnId(i)));
      }
    }

    return effectiveColumns;
  }

  /**
   * Applies a list of column styles to the dataTable.  This includes setting
   * the label for the column, as well as other properties in the future.
   *
   * @param {!Array.<ColumnStyleModel>} columns
   * @param {!google.visualizations.DataTable} dataTable
   * @export
   */
  applyToDataTable(columns, dataTable) {
    if (!goog.isDefAndNotNull(columns)) {
      throw new Error('applyToDataTable failed: \'columns\' is required.');
    }

    if (!goog.isDefAndNotNull(dataTable)) {
      throw new Error('applyToDataTable failed: \'dataTable\' is required.');
    }

    let columnId;

    columns.forEach(column => {
      let columnIndex = this.getColumnIndex(column.column_id, dataTable);

      if (columnIndex !== -1) {
        if (!goog.string.isEmptySafe(column.title)) {
          dataTable.setColumnLabel(columnIndex, column.title);
        } else {
          dataTable.setColumnLabel(columnIndex, column.column_id);
        }
      }
    });
  }

  /**
   * Returns the index of the DataTable column matching the provided id.
   * @param {string} columnId
   * @param {!google.visualizations.DataTable} dataTable
   * @return {number} The 0-based index of the column, or -1 if not found.
   * @export
   */
  getColumnIndex(columnId, dataTable) {
    if (!goog.isDefAndNotNull(columnId)) {
      throw new Error('getColumnIndex failed: \'columnId\' is a required string.')
    }

    if (goog.isDefAndNotNull(dataTable)) {
      for (var i=0, len=dataTable.getNumberOfColumns(); i<len; ++i) {
        if (dataTable.getColumnId(i) === columnId) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Moves the provided column to the previous position.
   * @param {!ChartWidgetConfig} widget
   * @param {!ColumnStyleModel} column
   */
  movePrevious(widget, column) {
    if (!goog.isDefAndNotNull(widget)) {
      throw new Error('movePrevious failed: \'widget\' is required.')
    }

    if (!goog.isDefAndNotNull(column)) {
      throw new Error('movePrevious failed: \'column\' is required.')
    }

    this.arrayUtilSvc.movePrevious(
      widget.model.chart.columns,
      column);

    this.dashboardSvc.refreshWidget(widget);
  }

  /**
   * Moves the provided column to the next position.
   * @param {!ChartWidgetConfig} widget
   * @param {!ColumnStyleModel} column
   */
  moveNext(widget, column) {
    if (!goog.isDefAndNotNull(widget)) {
      throw new Error('moveNext failed: \'widget\' is required.')
    }

    if (!goog.isDefAndNotNull(column)) {
      throw new Error('moveNext failed: \'column\' is required.')
    }

    this.arrayUtilSvc.moveNext(
      widget.model.chart.columns,
      column);

    this.dashboardSvc.refreshWidget(widget);
  }
}

});  // goog.scope
