/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Contains the QueryProperties and other classes which are used
 * to describe the restrictions on a single query for the explorer.  Those
 * restrictions include the fields to be queried, how to structure those
 * fields, and how to aggregate data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.query_builder.Aggregation');
goog.provide('p3rf.dashkit.explorer.components.query_builder.Filter');
goog.provide('p3rf.dashkit.explorer.components.query_builder.FilterClause');
goog.provide('p3rf.dashkit.explorer.components.query_builder.QueryProperties');



goog.scope(function() {
var explorer = p3rf.dashkit.explorer;


/**
 * Enum for QueryProperties aggregations.  The supported aggregations are
 * either natively supported by big query or explicitly supported by our query
 * builders.  We also supported arbitrary percentile aggregations of the form
 * INTEGER|FLOAT% so '50%' or '.01%'.
 * @enum {string}
 */
explorer.components.query_builder.Aggregation = {
  AVERAGE: 'avg',
  COUNT: 'count',
  LAST: 'last',
  MAX: 'max',
  MEAN: 'mean',
  MIN: 'min',
  STDDEV: 'stddev',
  SUM: 'sum',
  VARIANCE: 'variance'
};
var Aggregation = explorer.components.query_builder.Aggregation;



/**
 * Class containing the properties that define and restrict a query.
 * Top level filters are joined using "and" so all of the filters must be met.
 * A single filter is made up of FilterClauses which are joined using "or"
 * so only one FilterClause must be met for a filter to be met.
 * @param {!Array.<(Aggregation|string)>}
 *     aggregations The type of aggregations to perform as part of the query.
 *     If no aggregations are to be performed this should be an empty list.
 *     The supported aggregations can be found in the Aggregation enum.
 *     In addition we also support percentile aggregations of the form
 *     INTEGER|FLOAT% so '50%' or '.01%'.
 * @param {!Array.<!explorer.components.query_builder.Filter>}
 *     fieldFilters List of Filters to apply to fields.
 * @param {!Array.<!explorer.components.query_builder.Filter>}
 *     metadataFilters List of Filters to apply to metadata.
 * @constructor
 */
explorer.components.query_builder.QueryProperties = function(
    aggregations, fieldFilters, metadataFilters) {
  this.aggregations = aggregations;
  this.fieldFilters = fieldFilters;
  this.metadataFilters = metadataFilters;
};



/**
 * Class containing a filter for a single field or metadata value.
 * @param {string} fieldName The name of the field or metadata to filter on.
 * @param {!Array.<!explorer.components.query_builder.FilterClause>}
 *     filterClauses The list of FilterClauses for a single field or metadata.
 *     FilterClauses are joined using "or" so only one of the clauses must be
 *     met for the data to be selected.
 * @param {explorer.components.query_builder.Filter.DisplayMode} displayMode
 *     The way to display a column.
 * @param {string=} opt_fieldAlias The alias to use for the field name, if any.
 * @constructor
 */
explorer.components.query_builder.Filter = function(
    fieldName, filterClauses, displayMode, opt_fieldAlias) {
  this.fieldName = fieldName;
  this.filterClauses = filterClauses;
  this.displayMode = displayMode;
  this.fieldAlias = opt_fieldAlias;
};


/**
 * Enum for filter display mode.
 * @enum {string}
 */
explorer.components.query_builder.Filter.DisplayMode = {
  COLUMN: 'column',  // Filters on a column and displays it.
  HIDDEN: 'hidden'  // Filters on a column but does not display it.
};



/**
 * Class containing a single filter clause.
 * @param {!Array.<string|number>} matchOn The values to use when matching.
 * @param {explorer.components.query_builder.FilterClause.MatchRule} matchRule
 *     The rule to use when matching.  This rule can expect one or more values
 *     for example between or greater than.
 * @param {?bool=} opt_isFunction Used to indicate matchOn values that are
 *     function calls, and therefore shouldn't be quoted.
 * @constructor
 */
explorer.components.query_builder.FilterClause = function(
    matchOn, matchRule, opt_isFunction) {
  this.matchOn = matchOn;
  this.matchRule = matchRule;
  this.isFunction = opt_isFunction || false;
};


// TODO: Add support for between.
/**
 * Enum for FilterClause match rule.  The supported rules are either natively
 * supported by big query or explicitly supported by our query builders.
 * Enum names based on python's comparator
 * http://docs.python.org/2/library/operator.html
 * @enum {string}
 */
explorer.components.query_builder.FilterClause.MatchRule = {
  CT: 'CONTAINS',
  EQ: '=',
  GT: '>',
  GE: '>=',
  LT: '<',
  LE: '<=',
  NE: '!='
};

});  // goog.scope
