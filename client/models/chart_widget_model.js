/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model definition for a widget of type chart. It inherits from
 * WidgetModel.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.models.ChartModel');
goog.provide('p3rf.dashkit.explorer.models.ChartState');
goog.provide('p3rf.dashkit.explorer.models.ChartType');
goog.provide('p3rf.dashkit.explorer.models.ChartWidgetConfig');
goog.provide('p3rf.dashkit.explorer.models.ChartWidgetModel');
goog.provide('p3rf.dashkit.explorer.models.ChartWidgetState');
goog.provide('p3rf.dashkit.explorer.models.DataViewModel');
goog.provide('p3rf.dashkit.explorer.models.DatasourceModel');
goog.provide('p3rf.dashkit.explorer.models.DatasourceState');
goog.provide('p3rf.dashkit.explorer.models.ResultsDataStatus');

goog.require('p3rf.dashkit.explorer.models.WidgetModel');
goog.require('p3rf.dashkit.explorer.models.WidgetState');
goog.require('p3rf.dashkit.explorer.models.WidgetType');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryConfigModel');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var QueryConfigModel = explorer.models.dashkit_simple_builder.QueryConfigModel;
var WidgetType = explorer.models.WidgetType;


/**
 * @enum {string}
 */
p3rf.dashkit.explorer.models.ChartType = {
  TABLE: 'Table',
  AREA_CHART: 'AreaChart',
  BAR_CHART: 'BarChart',
  COLUMN_CHART: 'ColumnChart',
  LINE_CHART: 'LineChart',
  PIE_CHART: 'PieChart',
  SCATTER_CHART: 'ScatterChart'
};
var ChartType = p3rf.dashkit.explorer.models.ChartType;



/** @constructor */
p3rf.dashkit.explorer.models.ChartState = function() {
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
var ChartState = p3rf.dashkit.explorer.models.ChartState;



/** @constructor */
p3rf.dashkit.explorer.models.ChartModel = function() {
  /**
   * @type {string}
   * @export
   */
  this.chartType = ChartModel.DEFAULT_CHART_TYPE;

  /**
   * @type {!Object}
   * @export
   */
  this.options = {};
};
var ChartModel = p3rf.dashkit.explorer.models.ChartModel;


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
var ResultsDataStatus = explorer.models.ResultsDataStatus;



/** @constructor */
explorer.models.DatasourceState = function() {
  /**
   * @type {!ResultsDataStatus}
   * @export
   */
  this.status = ResultsDataStatus.TOFETCH;

  /**
   * @type {!Array.<string>}
   * @export
   */
  this.errors = [];
};
var DatasourceState = explorer.models.DatasourceState;



/**
 * See documentation on DataView:
 * https://developers.google.com/chart/interactive/docs/reference#DataView
 *
 * @constructor
 */
explorer.models.DataViewModel = function() {
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
var DataViewModel = explorer.models.DataViewModel;



/** @constructor */
explorer.models.DatasourceModel = function() {
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
var DatasourceModel = explorer.models.DatasourceModel;



/**
 * @constructor
 * @extends {p3rf.dashkit.explorer.models.WidgetModel}
 */
explorer.models.ChartWidgetModel = function() {
  goog.base(this);

  this.type = WidgetType.CHART;

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
var ChartWidgetModel = explorer.models.ChartWidgetModel;
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
var ChartWidgetState = explorer.models.ChartWidgetState;
goog.inherits(ChartWidgetState, explorer.models.WidgetState);



/**
 * @constructor
 * @param {!Object} widgetFactoryService Note: the type should be
 *     WidgetFactoryService but Closure can't handle bidirectional dependencies.
 * @param {?(Object|ChartWidgetModel)=} opt_model JSON or ChartWidgetModel.
 * @extends {p3rf.dashkit.explorer.models.WidgetConfig}
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
var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
// No formal goog.inherits to work around lack of generics.


/**
 * Verifies the dashboard model and cleans it up, if required.  This is
 * presently used to transition from the "old" dashkit dashboards to the new
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
