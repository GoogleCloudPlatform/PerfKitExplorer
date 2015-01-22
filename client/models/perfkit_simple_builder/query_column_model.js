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
 * @fileoverview Model for query column/result data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.FieldResult');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.LabelResult');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.MeasureResult');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.PivotConfigModel');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryColumnModel');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryDateGroupings');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryTablePartitioning');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.SamplesMartFields');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.SamplesMartMeasures');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;



/**
 * Type definition for a label-result specifier.  Though it's a simple string,
 * the wrapper is required for angular binding purposes.
 * @constructor
 */
explorer.models.perfkit_simple_builder.LabelResult = function() {
  /** @type {!string} */
  this.label = '';
};
var LabelResult = explorer.models.perfkit_simple_builder.LabelResult;


/**
 * Type definition for a label-result specifier.  Though it's a simple string,
 * the wrapper is required for angular binding purposes.
 * @constructor
 */
explorer.models.perfkit_simple_builder.FieldResult = function(name) {
  /** @type {!string} */
  this.name = name || '';
};
var FieldResult = explorer.models.perfkit_simple_builder.FieldResult;


/**
 * Type definition for a measure-result specifier.  Though it's a simple string,
 * the wrapper is required for angular binding purposes.
 * @constructor
 */
explorer.models.perfkit_simple_builder.MeasureResult = function(name) {
  /** @type {!string} */
  this.name = name || '';
};
var MeasureResult = explorer.models.perfkit_simple_builder.MeasureResult;


/**
 * Type definition for a pivot configuration.  Pivots specify a column, row and
 * value field, and transform the results so that the "column" field's unique
 * values are displayed as column headers.
 * @constructor
 */
explorer.models.perfkit_simple_builder.PivotConfigModel = function() {
  /**
   * @type {!string}
   * @export
   */
  this.row_field = '';

  /**
   * @type {!string}
   * @export
   */
  this.column_field = '';

  /**
   * @type {!string}
   * @export
   */
  this.value_field = '';
};
var PivotConfigModel = explorer.models.perfkit_simple_builder.PivotConfigModel;


/**
 * Constants describing the types of filters applied to dates.
 * @export
 */
explorer.models.perfkit_simple_builder.QueryDateGroupings = {
  NONE: '',
  YEAR: 'Year',
  MONTH: 'Month',
  WEEK: 'Week',
  DAY: 'Day',
  HOUR: 'Hour'
};
var QueryDateGroupings = explorer.models.perfkit_simple_builder.QueryDateGroupings;


/**
 * Constants describing the types of filters applied to dates.
 * @export
 */
explorer.models.perfkit_simple_builder.SamplesMartFields = {
  TEST: 'test',
  TARGET: 'target',
  PRODUCT_NAME: 'product_name',
  PRODUCT_VERSION: 'product_version',
  PRODUCT_BRANCH_CL: 'product_branch_cl',
  PRODUCT_CHERRY_PICK_CLS: 'product_cherry_pick_cls',
  TEST_VERSION: 'test_version',
  OWNER: 'owner',
  LOG_URI: 'log_uri',
  RUN_URI: 'run_uri',
  LABELS: 'labels',
  METRIC: 'metric',
  VALUE: 'value',
  UNIT: 'unit',
  TIMESTAMP: 'timestamp',
  METRIC_URI: 'metric_uri',
  SAMPLE_URI: 'sample_uri'
};
var SamplesMartFields = explorer.models.perfkit_simple_builder.SamplesMartFields;


/**
 * Constants describing the types of measures applied to values.
 * @export
 */
explorer.models.perfkit_simple_builder.SamplesMartMeasures = {
  MIN: 'MIN',
  MAX: 'MAX',
  AVG: 'AVG',
  STDDEV: 'STDDEV',
  COUNT: 'COUNT',
  LAST: 'LAST',
  MEAN: 'MEAN',
  SUM: 'SUM',
  VARIANCE: 'VARIANCE',
  PCT_50: '50%',
  PCT_99: '99%',
  PCT_9999: '99.99%'
};
var SamplesMartMeasures = explorer.models.perfkit_simple_builder.SamplesMartMeasures;


/**
 * @enum {string}
 */
explorer.models.perfkit_simple_builder.QueryShapes = {
  TABULAR: 'Tabular',
  PIVOT: 'Pivot'
};
var QueryShapes = explorer.models.perfkit_simple_builder.QueryShapes;


/**
 * Describes the possible structures of a BigQuery table.  The default (OnTable) assumes a single table with all
 * data.  PerDate tables contain a table for each individual day.  The Table Wildcard Functions are used to determine
 * which tables will be queries.  For more information on Table Wildcard Functions, see:
 *   https://cloud.google.com/bigquery/query-reference#tablewildcardfunctions
 * @enum {string}
 */
explorer.models.perfkit_simple_builder.QueryTablePartitioning = {
  ONETABLE: 'OneTable',
  PERDAY: 'PerDay'
};
var QueryTablePartitioning = explorer.models.perfkit_simple_builder.QueryTablePartitioning;


/**
 * Angular service that provides the column configuration of a Samples query.
 * @constructor
 */
explorer.models.perfkit_simple_builder.QueryColumnModel = function() {
  /** @export @type {!boolean} */
  this.show_date = false;

  /** @export @type {!QueryDateGroupings} */
  this.date_group = QueryDateGroupings.NONE;

  /** @export @type {!Array.<!FieldResult>} */
  this.fields = [];

  /** @export @type {!boolean} */
  this.measure_values = false;

  /**
   * A list of 'name' objects where name is a string describing the measure.
   * Acceptable values are common non-arg functions (MIN, MAX, AVG, etc.), as well
   * as percentiles (99%, etc.).
   * @export @type {Array.<!FieldResult>}
   */
  this.measures = [];

  /** @export @type {Array.<!LabelResult>} */
  this.labels = [];

  /** @export @type {!boolean} */
  this.pivot = false;

  /** @export @type {!PivotConfigModel} */
  this.pivot_config = new PivotConfigModel();

  /** @type @type {?number} */
  this.row_limit = null;

  /**
   * Specifies the project id that the query will connect to.  If not provided, will use the dashboard-level project
   * id, or the app-engine default.
   * @export @type {?string}
   */
  this.project_id = null;

  /**
   * Specifies the dataset that the query will connect to.  If not provided, will use the dashboard-level dataset
   * name, or the app-engine default.
   * @export @type {?string}
   */
  this.dataset_name = null;

  /**
   * Specifies the table that the query will connect to.  If not provided, will use the dashboard-level table name
   * or the app-engine default.
   * @export @type {?string}
   */
  this.table_name = null;

  /**
   * Specifies the type of partitioning used on the table.  For more information, see the docstring for
   * QueryTablePartitioning.
   * @export @type {QueryTablePartitioning}
   */
  this.table_partition = '';
};

var QueryColumnModel = explorer.models.perfkit_simple_builder.QueryColumnModel;

});  // goog.scope
