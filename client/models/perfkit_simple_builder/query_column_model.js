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

goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.LabelResult');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.PivotConfigModel');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryColumnModel');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryDateGroupings');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * Type definition for a label-result specifier.  Though it's a simple string,
 * the wrapper is required for angular binding purposes.
 * @constructor
 */
explorer.models.dashkit_simple_builder.LabelResult = function() {
  /** @type {!string} */
  this.label = '';
};
var LabelResult = explorer.models.dashkit_simple_builder.LabelResult;


/**
 * Type definition for a pivot configuration.  Pivots specify a column, row and
 * value field, and transform the results so that the "column" field's unique
 * values are displayed as column headers.
 * @constructor
 */
explorer.models.dashkit_simple_builder.PivotConfigModel = function() {
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
var PivotConfigModel = explorer.models.dashkit_simple_builder.PivotConfigModel;


/**
 * @enum {string}
 */
explorer.models.dashkit_simple_builder.QueryDateGroupings = {
  ONEGROUP: 'OneGroup',
  DETAILS: 'Details',
  DAILY: 'Daily',
  WEEKLY: 'Weekly'
};
var QueryDateGroupings =
    explorer.models.dashkit_simple_builder.QueryDateGroupings;


/**
 * @enum {string}
 */
explorer.models.dashkit_simple_builder.QueryShapes = {
  TABULAR: 'Tabular',
  PIVOT: 'Pivot'
};
var QueryShapes = explorer.models.dashkit_simple_builder.QueryShapes;



/**
 * Angular service that provides the column configuration of a Samples query.
 * @constructor
 */
explorer.models.dashkit_simple_builder.QueryColumnModel = function() {
  /**
   * @type {QueryDateGroupings}
   * @export
   */
  this.date_group = QueryDateGroupings.ONEGROUP;

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
   * @type {Array.<!LabelResult>}
   * @export
   */
  this.labels = [];
};

var QueryColumnModel = explorer.models.dashkit_simple_builder.QueryColumnModel;

});  // goog.scope
