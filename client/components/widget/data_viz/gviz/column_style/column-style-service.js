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

    /**
     * A list of roles that can be applied to columns.
     * @export {!Array.<!Object>}
     */
    this.DATA_ROLES = {
      'annotation': {'id': 'annotation', 'tooltip': 'Text to display on the chart near the associated data point, displayed without any user interaction'},
      'annotationText': {'id': 'annotationText', 'tooltip': 'Extended text to display when the user hovers over the associated annotation'},
      'certainty': {'id': 'certainty', 'tooltip': 'Indicates whether a data point is certain or not'},
      'emphasis': {'id': 'emphasis', 'tooltip': 'Emphasizes specified chart data points, displayed as a thick line and/or large point'},
      'interval': {'id': 'interval', 'tooltip': 'Indicates potential data range for a specific point'},
      'scope': {'id': 'scope', 'tooltip': 'Indicates potential data range for a specific point'},
      'style': {'id': 'style', 'tooltip': 'Styles certain properties of different aspects of your data'},
      'tooltip': {'id': 'tooltip', 'tooltip': 'Text to display when the user hovers over the data point associated with this row'},
      'domain': {'id': 'domain', 'tooltip': 'Domain columns specify labels along the major axis of the chart'},
      'data': {'id': 'data', 'tooltip': 'Data role columns specify series data to render in the chart'},
    }

    /**
     * A list of roles that will result in a series when applied to a column.
     * @export {!Array.<string>}
     */
    this.SERIES_DATA_ROLES = ['data', '', null];
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
        if (goog.string.isEmptySafe(column.title)) {
          dataTable.setColumnLabel(columnIndex, column.column_id);
        } else {
          dataTable.setColumnLabel(columnIndex, column.title);
        }

        if (goog.string.isEmptySafe(column.data_role)) {
          dataTable.setColumnProperty(columnIndex, 'role', '');
        } else {
          dataTable.setColumnProperty(columnIndex, 'role', column.data_role);
        }
      }
    });
  }

  /**
   * Returns true if the provided column is a data series, otherwise false.
   *
   * @param {!ChartWidgetConfig} widget
   * @param {!ColumnStyleModel} column
   * @return {boolean}
   */
  isColumnASeries(widget, column) {
    let dataTable = widget.state().datasource.data;

    return (
      (widget.model.chart.columns.indexOf(column) > 0) &&
      (this.getColumnIndex(column.column_id, dataTable) !== -1) &&
      (this.SERIES_DATA_ROLES.indexOf(column.data_role) !== -1));
  }

  /**
   * Returns a list of ColumnStyleModel objects that will act as data series.
   *
   * @param {!ChartWidgetConfig} widget
   * @return {!ChartConfig}
   * @export
   */
  getSeriesColumns(widget) {
    let seriesColumns = [];
    let effectiveColumns = this.getEffectiveColumns(
        widget.model.chart.columns, widget.state().datasource.data);

    for (let i=0, len=effectiveColumns.length; i<len; ++i) {
      let column = effectiveColumns[i];

      if (this.isColumnASeries(widget, column)) {
        seriesColumns.push(column);
      }
    }

    return seriesColumns;
  }

  /**
   * Returns a chartConfig based on the provided widget.
   * If the chart.columns collection contains color information, it will be
   * applied to the relevant chart.options.series[].
   *
   * @param {!ChartWidgetConfig} widget
   * @return {!ChartConfig}
   * @export
   */
  getEffectiveChartConfig(widget) {
    if (!goog.isDefAndNotNull(widget)) {
      throw new Error('applyToDataTable failed: \'widget\' is required.');
    }

    let columnIndex, series;
    let columns = this.getSeriesColumns(widget);
    let columnIds = Array.prototype.map.call(columns, column => column.column_id);
    let dataTable = widget.state().datasource.data;

    let effectiveConfig = angular.copy(widget.model.chart.options);
    if (!goog.isDefAndNotNull(effectiveConfig.series)) {
      effectiveConfig.series = [];
    }

    if (dataTable) {
      columns.forEach(column => {
        columnIndex = columnIds.indexOf(column.column_id);

        if (columnIndex !== -1) {
          // If there isn't a series defined, we will add one.
          while (effectiveConfig.series.length - 1 < columnIndex) {
            effectiveConfig.series.push({});
          }

          series = effectiveConfig.series[columnIndex];
          if (!goog.string.isEmptySafe(column.series_color) &&
              goog.string.isEmptySafe(series.color)) {
            series.color = column.series_color;
          }
        }
      });
    }

    return effectiveConfig;
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
