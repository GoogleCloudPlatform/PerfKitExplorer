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
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.PivotConfigModel');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryColumnModel');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryDateGroupings');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.SamplesMartFields');

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
var DateGroupType = explorer.models.perfkit_simple_builder.QueryDateGroupings;


/**
 * Constants describing the types of filters applied to dates.
 * @export
 */
explorer.models.perfkit_simple_builder.SamplesMartFields = {
  RUNBY: 'runby',
  PRODUCT: 'product_name',
  TEST: 'test',
  METRIC: 'metric',
  OFFICIAL: 'official',
  LABELS: 'labels'
};
var SamplesMartFields = explorer.models.perfkit_simple_builder.SamplesMartFields;


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
   * @type {QueryDateGroupings}
   * @export
   */
  this.date_group = QueryDateGroupings.NONE;

  /**
   * @type {Array.<!FieldResult>}
   * @export
   */
  this.fields = [];

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
};

var QueryColumnModel = explorer.models.perfkit_simple_builder.QueryColumnModel;

});  // goog.scope
