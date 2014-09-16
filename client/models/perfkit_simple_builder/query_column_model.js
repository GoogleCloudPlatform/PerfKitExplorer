/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
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
 * Angular service that provides the column configuration of a Samples query.
 * @constructor
 */
explorer.models.perfkit_simple_builder.QueryColumnModel = function() {
  /**
   * @type {!boolean}
   * @export
   */
  this.show_date = false;

  /**
   * @type {!QueryDateGroupings}
   * @export
   */
  this.date_group = QueryDateGroupings.NONE;

  /**
   * @type {!Array.<!FieldResult>}
   * @export
   */
  this.fields = [];

  /**
   * @type {!boolean}
   * @export
   */
  this.measure_values = false;

  /**
   * A list of 'name' objects where name is a string describing the measure.
   * Acceptable values are common non-arg functions (MIN, MAX, AVG, etc.), as well
   * as percentiles (99%, etc.).
   * @type {Array.<!FieldResult>}
   * @export
   */
  this.measures = [];

  /**
   * @type {Array.<!LabelResult>}
   * @export
   */
  this.labels = [];

  /**
   * @type {!boolean}
   * @export
   */
  this.pivot = false;

  /**
   * @type {!PivotConfigModel}
   * @export
   */
  this.pivot_config = new PivotConfigModel();

  /**
   * @type {!number}
   * @export
   */
  this.row_limit = 100;
};

var QueryColumnModel = explorer.models.perfkit_simple_builder.QueryColumnModel;

});  // goog.scope
