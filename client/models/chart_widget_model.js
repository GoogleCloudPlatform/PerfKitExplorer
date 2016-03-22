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
 * @fileoverview Model definition for a widget of type chart. It inherits from
 * WidgetModel.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.models.ChartModel');
goog.provide('p3rf.perfkit.explorer.models.ChartState');
goog.provide('p3rf.perfkit.explorer.models.ChartType');
goog.provide('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.provide('p3rf.perfkit.explorer.models.ChartWidgetModel');
goog.provide('p3rf.perfkit.explorer.models.ChartWidgetState');
goog.provide('p3rf.perfkit.explorer.models.DataViewModel');
goog.provide('p3rf.perfkit.explorer.models.DatasourceModel');
goog.provide('p3rf.perfkit.explorer.models.DatasourceState');
goog.provide('p3rf.perfkit.explorer.models.DatasourceType');
goog.provide('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.provide('p3rf.perfkit.explorer.models.SortOrder');

goog.require('p3rf.perfkit.explorer.models.WidgetModel');
goog.require('p3rf.perfkit.explorer.models.WidgetState');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const QueryConfigModel = explorer.models.perfkit_simple_builder.QueryConfigModel;
const ColumnStyleModel = (
    explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel);
const WidgetType = explorer.models.WidgetType;


/**
 * @enum {string}
 */
explorer.models.SortOrder = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
};
const SortOrder = explorer.models.SortOrder;


/**
 * @enum {string}
 */
p3rf.perfkit.explorer.models.ChartType = {
  TABLE: 'Table',
  AREA_CHART: 'AreaChart',
  BAR_CHART: 'BarChart',
  COLUMN_CHART: 'ColumnChart',
  LINE_CHART: 'LineChart',
  PIE_CHART: 'PieChart',
  SCATTER_CHART: 'ScatterChart'
};
const ChartType = p3rf.perfkit.explorer.models.ChartType;



/** @constructor */
p3rf.perfkit.explorer.models.ChartState = function() {
  /**
   * @type {?number}
   * @export
   */
  this.height = null;

  /**
   * @type {?number}
   * @export
   */
  this.width = null;

  /**
   * @type {?string}
   * @export
   */
  this.error = null;

  /**
   * @type {?string}
   * @export
   */
  this.gvizError = null;
};
const ChartState = p3rf.perfkit.explorer.models.ChartState;



/** @constructor */
p3rf.perfkit.explorer.models.ChartModel = function() {
  /**
   * @type {string}
   * @export
   */
  this.chartType = ChartModel.DEFAULT_CHART_TYPE;

  /**
   * @dict
   * @export
   */
  this.options = {
    'chartArea': {},
    'legend': {}
  };

  /**
   * @type {!Array.<!ColumnStyleModel>}
   * @export
   */
  this.columns = [];
};
const ChartModel = p3rf.perfkit.explorer.models.ChartModel;


/** @type {string} */
ChartModel.DEFAULT_CHART_TYPE = ChartType.TABLE;


/**
 * @enum {string}
 */
explorer.models.ResultsDataStatus = {
  ERROR: 'Error',
  NODATA: 'NoData',
  TOFETCH: 'ToFetch',
  FETCHING: 'Fetching',
  FETCHED: 'Fetched'
};
const ResultsDataStatus = explorer.models.ResultsDataStatus;



/** @constructor */
explorer.models.DatasourceState = function() {
  /**
   * @type {!ResultsDataStatus}
   * @export
   */
  this.status = ResultsDataStatus.TOFETCH;

  /**
   * Represents the BigQuery job ID that the query was executed under.
   * @type {string}
   * @export
   */
  this.job_id = '';

  /**
   * Represents the number of rows returned by the query.
   * @type {?number}
   * @export
   */
  this.row_count = null;

  /**
   * Represents the total time (in seconds) that the query took to run.
   * @type {?number}
   * @export
   */
  this.query_time = null;

  /**
   * Represents the size (in bytes) of data scanned to produce the query result.
   * @type {?number}
   * @export
   */
  this.query_size = null;

  /**
   * @type {!Array.<string>}
   * @export
   */
  this.errors = [];
};
const DatasourceState = explorer.models.DatasourceState;



/**
 * See documentation on DataView:
 * https://developers.google.com/chart/interactive/docs/reference#DataView
 *
 * @constructor
 */
explorer.models.DataViewModel = function() {
  /**
   * If true, the columns will appear in alphabetical order.  If false, they
   * will be presented in order of appearance.
   * @type {!boolean}
   * @export
   */
  this.sort_columns = false;

  /**
   * If provided, specifies the first column index to sort.  This can be used
   * with pivots, for example, to fix the columns that are row headings, and
   * sort the "series" alphabetically.
   * @type {?number}
   * @export
   */
  this.sort_column_start = null;

  /**
   * Specifies the sort order for the columns.  If not provided, will default
   * to ascending.
   * @export {?SortOrder}
   */
   this.sort_column_order = null;

  /**
   * @type {!Array.<number>}
   * @export
   */
  this.columns = [];

  /**
   * @type {!Array.<Object>}
   * @export
   */
  this.filter = [];

  /**
   * @type {!Array.<Object>}
   * @export
   */
  this.sort = [];
};
const DataViewModel = explorer.models.DataViewModel;


/** @enum {string} */
explorer.models.DatasourceType = {
  BIGQUERY: 'BigQuery',
  CLOUDSQL: 'Cloud SQL',
  TEXT: 'Text'
}
const DatasourceType = explorer.models.DatasourceType;


/** @constructor */
explorer.models.DatasourceModel = function() {
  /** @export {!DatasourceType} */
  this.type = DatasourceType.BIGQUERY;

  /**
   * @type {!QueryConfigModel}
   * @export
   */
  // TODO: For extensibility, the instance should come from a factory.
  this.config = new QueryConfigModel();

  /**
   * Custom SQL Flag.  If true, a custom SQL statement is used.  Defaults to
   * false.
   *
   * @type {!boolean}
   * @export
   */
  this.custom_query = false;

  /**
   * @type {?string}
   * A custom SQL statement.
   * @export
   */
  this.query = null;

  /**
   * @type {?string}
   * @export
   */
  this.queryError = null;

  /**
   * @type {!DataViewModel}
   * @export
   */
  this.view = new DataViewModel();
};
const DatasourceModel = explorer.models.DatasourceModel;



/**
 * @constructor
 * @extends {p3rf.perfkit.explorer.models.WidgetModel}
 */
explorer.models.ChartWidgetModel = function() {
  goog.base(this);

  this.type = WidgetType.CHART;

  /**
   * If true, widgets will display query statistics (time, size, etc.).
   * @type {boolean}
   */
  this.show_statistics = false;

  /**
   * @type {!ChartModel}
   * @export
   */
  this.chart = new ChartModel();

  /**
   * @type {!DatasourceModel}
   * @export
   */
  this.datasource = new DatasourceModel();
};
const ChartWidgetModel = explorer.models.ChartWidgetModel;
goog.inherits(ChartWidgetModel, explorer.models.WidgetModel);



/**
 * @constructor
 * @extends {explorer.models.WidgetState}
 */
explorer.models.ChartWidgetState = function() {
  goog.base(this);

  /**
   * @type {!ChartState}
   * @export
   */
  this.chart = new ChartState();

  /**
   * @type {!DatasourceState}
   * @export
   */
  this.datasource = new DatasourceState();
};
const ChartWidgetState = explorer.models.ChartWidgetState;
goog.inherits(ChartWidgetState, explorer.models.WidgetState);



/**
 * @constructor
 * @param {!Object} widgetFactoryService Note: the type should be
 *     WidgetFactoryService but Closure can't handle bidirectional dependencies.
 * @param {?(Object|ChartWidgetModel)=} opt_model JSON or ChartWidgetModel.
 * @extends {p3rf.perfkit.explorer.models.WidgetConfig}
 */
explorer.models.ChartWidgetConfig = function(widgetFactoryService, opt_model) {
  /**
   * The persisted model of the widget. It's usually a simple JSON object
   * returned by the server but it respects the ChartWidgetModel class
   * definition.
   *
   * Warning: Do not keep a reference on this property, it can be replaced by an
   * updated JSON at any time. Instead, keep a reference on the
   * ChartWidgetConfig object that contains it.
   *
   * @type {!(Object|ChartWidgetModel)}
   * @export
   */
  this.model = opt_model || new ChartWidgetModel();

  if (!this.model.id) {
    this.model.id = widgetFactoryService.generateWidgetId();
  }

  // Add the widget to widgetsById.
  widgetFactoryService.widgetsById[this.model.id] = this;

  /**
   * Returns the state object corresponding to this widget.
   *
   * Note: It is a function in order for Angular watchers to be able to watch
   * this widget and ignore its state. Otherwise, it will throw a circular
   * dependency error.
   *
   * @return {ChartWidgetState}
   * @export
   */
  this.state = function() {
    return widgetFactoryService.statesById[this.model.id];
  };

  // Add the widget state to statesById.
  widgetFactoryService.statesById[this.model.id] =
      widgetFactoryService.statesById[this.model.id] || new ChartWidgetState();
};
const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
// No formal goog.inherits to work around lack of generics.


/**
 * Verifies the dashboard model and cleans it up, if required.  This is
 * presently used to transition from the "old" perfkit dashboards to the new
 * angular ones.
 * @param {?ChartWidgetModel} model The chart widget model to be verified and
 *     cleaned.
 * @return {?ChartWidgetModel} A verified and cleaned chart widget model.
 */
ChartWidgetConfig.prototype.verifyAndCleanModel = function(model) {
  if (!model) { return null; }

  return model;
};

});  // goog.scope
