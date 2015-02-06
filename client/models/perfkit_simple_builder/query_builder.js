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
 * @fileoverview A class that translates a query config model to a set of
 * query properties for producing SQL statements.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.Aggregation');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryBuilderService');

goog.require('p3rf.perfkit.explorer.components.query_builder.Filter');
goog.require('p3rf.perfkit.explorer.components.query_builder.FilterClause');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryBuilder');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryProperties');
goog.require('p3rf.perfkit.explorer.dateUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryColumnModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryTablePartitioning');


goog.scope(function() {

var explorer = p3rf.perfkit.explorer;
var DateFilter = explorer.models.perfkit_simple_builder.DateFilter;
var DateFilterType = explorer.models.perfkit_simple_builder.DateFilterType;
var Filter = explorer.components.query_builder.Filter;
var FilterClause = explorer.components.query_builder.FilterClause;
var BigQueryBuilder = explorer.components.query_builder.QueryBuilder;
var QueryProperties = explorer.components.query_builder.QueryProperties;
var dateUtil = explorer.dateUtil;
var MetadataFilter = explorer.models.perfkit_simple_builder.MetadataFilter;
var QueryColumnModel = explorer.models.perfkit_simple_builder.QueryColumnModel;
var QueryConfigModel = explorer.models.perfkit_simple_builder.QueryConfigModel;
var QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;
var QueryTablePartitioning = explorer.models.perfkit_simple_builder.QueryTablePartitioning;


/**
 * Enum for QueryProperties aggregations.  The supported aggregations are
 * either natively supported by big query or explicitly supported by our query
 * builders.  We also supported arbitrary percentile aggregations of the form
 * INTEGER|FLOAT% so '50%' or '.01%'.
 * @enum {string}
 */
explorer.models.perfkit_simple_builder.Aggregation = {
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
var Aggregation = explorer.models.perfkit_simple_builder.Aggregation;


/**
 * The QueryBuilder service transforms a query model into SQL.
 *
 * @param {!Angular.FilterService} $filter
 * @constructor
 *
 */
explorer.models.perfkit_simple_builder.QueryBuilderService = function(
    $filter) {
  /**
   * Specifies the character sequence that precedes parameter tokens.
   * @export {string}
   */
  this.TOKEN_START_SYMBOL = '%%';

  /**
   * Specifies the character sequence that precedes parameter tokens.
   * @export {string}
   */
  this.TOKEN_END_SYMBOL = '%%';
};
var QueryBuilderService =
    explorer.models.perfkit_simple_builder.QueryBuilderService;


/**
 * Returns a display mode based on the value of a filter.
 * @param {Array.<(string|number|null)>=} opt_values The values to match.
 * @return {Filter.DisplayMode} The display mode to use for the column.
 */
QueryBuilderService.prototype.getColumnDisplayMode = function(opt_values) {
  var visibility = Filter.DisplayMode.COLUMN;
  var value = (
      goog.isDef(opt_values) &&
      !goog.isNull(opt_values) &&
      opt_values.length > 0) ?
      opt_values[0] : null;

  if (goog.isDef(value) && !goog.isNull(value) &&
      !(goog.isString(value) && goog.string.isEmptySafe(value))) {
    visibility = Filter.DisplayMode.HIDDEN;
  }

  return visibility;
};


/**
 * Creates a filter that deals with a single value and clause.  This improves
 * readability of filtering logic, as the UX doesn't presently support multi-
 * values or clauses.  Columns with explicit filters are hidden by default,
 * as they're the same value across the result set.
 * @param {string} fieldName The name of the field to filter on.
 * @param {Array.<(string|number|null)>=} opt_values The list of values to
 *     filter on.
 * @param {?FilterClause.MatchRule=} opt_matchRule The type of matching to
 *     perform.  Defaults to EQ (equals).
 * @param {?Filter.DisplayMode=} opt_displayMode The display mode for the
 *     filter.  Defaults to COLUMN if no value is specified, and HIDDEN if a
 *     value is provided.
 * @param {string=} opt_fieldAlias The alias to use for the field.
 * @return {Filter} A Filter expression.
 */
QueryBuilderService.prototype.createSimpleFilter = function(
    fieldName, opt_values, opt_matchRule, opt_displayMode, opt_fieldAlias) {
  var matchRule = opt_matchRule ? opt_matchRule : FilterClause.MatchRule.EQ;
  var displayMode = opt_displayMode ? opt_displayMode :
      this.getColumnDisplayMode(opt_values);

  var clauses = [];

  if (goog.isDef(opt_values) && !goog.isNull(opt_values)) {
    for (var ctr = 0, len = opt_values.length; ctr < len; ctr++) {
      var value = opt_values[ctr];

      if (!goog.string.isEmptySafe(value)) {
        clauses.push(new FilterClause([value], matchRule));
      }
    }
  }
  var filter = new Filter(fieldName, clauses, displayMode, opt_fieldAlias);
  return filter;
};


/**
 * Returns a date filter clause based on a relative date (last n days, etc.).
 * @param {*} dateFilter A date filter expression.
 * @return {string} A BigQuery function representing the relative date.
 */
QueryBuilderService.prototype.getRelativeDateFunction = function(dateFilter) {
  return ('DATE_ADD(CURRENT_TIMESTAMP(), -' +
      dateFilter.filter_value + ', "' +
      dateFilter.filter_type + '")');
};


/**
 * Returns a date filter clause based on a relative date (last n days, etc.).
 * @param {*} dateFilter A date filter expression.
 * @return {string} A BigQuery function representing the relative date.
 */
QueryBuilderService.prototype.getAbsoluteDateFunction = function(dateFilter) {
  return ('TIMESTAMP(\'' + dateFilter.text + '\')');
};


/**
 * Replaces any tokens in the provided query with values from the params.
 * Tokens are identified by strings that start and end with strings defined
 * by TOKEN_START_SYMBOL and TOKEN_END_SYMBOL.  By default, this would look
 * like %%TOKEN_NAME%%.
 *
 * @param {string} query A SQL statement to modify.
 * @param {Array.<!DashboardParam>} params A list of parameters.
 */
QueryBuilderService.prototype.replaceTokens = function(query, params) {
  angular.forEach(params, angular.bind(this, function(param) {
    var find = this.TOKEN_START_SYMBOL + param.name + this.TOKEN_END_SYMBOL;
    var re = new RegExp(find, 'g');

    query = query.replace(re, param.value);
  }));

  return query;
};


/**
 * Returns a SQL statement based on the state of a query.
 * @param {!QueryConfigModel} model a QueryConfigModel that describes a query.
 * @param {string} projectId
 * @param {string} datasetName
 * @param {string} tableName
 * @param {QueryTablePartitioning} tablePartition
 * @return {string} A formatted SQL statement.
 */
QueryBuilderService.prototype.getSql = function(
    model, projectId, datasetName, tableName, tablePartition, params) {
  var fieldFilters = [];
  var startFilter, endFilter = null;
  var startDateClause, endDateClause = null;
  var ctr, len, label = null;

  if (model.filters.start_date) {
    switch (model.filters.start_date.filter_type) {
      case DateFilterType.CUSTOM:
        startFilter = this.getAbsoluteDateFunction(model.filters.start_date);
        startDateClause = new FilterClause(
            ['TIMESTAMP_TO_SEC(' + startFilter + ')'],
            FilterClause.MatchRule.GE, true);

        break;
      default:
        startFilter = this.getRelativeDateFunction(model.filters.start_date);
        startDateClause = new FilterClause(
            ['TIMESTAMP_TO_SEC(' + startFilter + ')'],
            FilterClause.MatchRule.GE, true);

        break;
    }
  }

  if (model.filters.end_date) {
    switch (model.filters.end_date.filter_type) {
      case DateFilterType.CUSTOM:
        endFilter = this.getAbsoluteDateFunction(model.filters.end_date);
        endDateClause = new FilterClause(
            ['TIMESTAMP_TO_SEC(' + endFilter + ')'], FilterClause.MatchRule.LE, true);

        break;
      default:
        endDateClause = new FilterClause(
            ['TIMESTAMP_TO_SEC(' + endFilter + ')'], FilterClause.MatchRule.LE, true);

        break;
    }
  }

  if (startDateClause) {
    fieldFilters.push(
        new Filter('timestamp', [startDateClause], Filter.DisplayMode.HIDDEN));
  }

  if (endDateClause) {
    fieldFilters.push(
        new Filter('timestamp', [endDateClause], Filter.DisplayMode.HIDDEN));
  }

  if (model.filters.product_name) {
    fieldFilters.push(
        this.createSimpleFilter('product_name',
                                [model.filters.product_name],
                                null,
                                Filter.DisplayMode.HIDDEN));
  }

  if (model.filters.test) {
    fieldFilters.push(
        this.createSimpleFilter('test',
                                [model.filters.test],
                                null,
                                Filter.DisplayMode.HIDDEN));
  }

  if (model.filters.metric) {
    fieldFilters.push(
        this.createSimpleFilter('metric',
                                [model.filters.metric],
                                null,
                                Filter.DisplayMode.HIDDEN));
  }

  if (model.filters.runby) {
    fieldFilters.push(
        this.createSimpleFilter('owner',
                                [model.filters.runby],
                                null,
                                Filter.DisplayMode.HIDDEN));
  }

  var fieldSortOrders = [];

  angular.forEach(model.results.fields, angular.bind(this, function(field) {
    fieldFilters.push(
        new Filter(field.name, [], Filter.DisplayMode.COLUMN));
  }));

  if (model.results.show_date === true) {
    switch (model.results.date_group.toUpperCase()) {
      case '':
        fieldFilters.push(this.createSimpleFilter(
            'SEC_TO_TIMESTAMP(INTEGER(timestamp))',
            null, null, null, 'date'));
        break;
      case 'WEEK':
        fieldFilters.push(this.createSimpleFilter(
            ('USEC_TO_TIMESTAMP(UTC_USEC_TO_WEEK(INTEGER(timestamp * ' +
             dateUtil.BQ_TIMESTAMP_MULTIPLIER + '), ' +
             dateUtil.BQ_FIRST_DAY_OF_WEEK + '))'),
            null, null, null, 'date'));
        break;
      default:
        fieldFilters.push(this.createSimpleFilter(
            ('USEC_TO_TIMESTAMP(UTC_USEC_TO_' + model.results.date_group.toUpperCase() +
             '(INTEGER(timestamp * ' +
             dateUtil.BQ_TIMESTAMP_MULTIPLIER + ')))'),
            null, null, null, 'date'));
        break;
    }
  }

  if (!model.filters.product_name) { fieldSortOrders.push('product_name'); }
  if (!model.filters.test) { fieldSortOrders.push('test'); }
  if (!model.filters.metric) { fieldSortOrders.push('metric'); }
  if (model.results.show_date) {
    fieldSortOrders.push('date');
  }

  for (ctr = 0, len = model.results.labels.length; ctr < len; ctr++) {
    label = model.results.labels[ctr].label;
    if (goog.isDef(label) && !goog.string.isEmpty(label)) {
      var field = 'REGEXP_EXTRACT(labels, r\'\\|' + label + ':(.*?)\\|\')';
      fieldFilters.push(this.createSimpleFilter(
          field, null, null, null, label));
    }
  }

  if (model.filters.official === 'true') {
    fieldFilters.push(this.createSimpleFilter('official', [true]));
  } else if (model.filters.official === 'false') {
    fieldFilters.push(this.createSimpleFilter('official', [false]));
  }

  for (ctr = 0, len = model.filters.metadata.length; ctr < len; ctr++) {
    label = '|' + model.filters.metadata[ctr].text + '|';

    fieldFilters.push(this.createSimpleFilter(
        'labels', [label],
        FilterClause.MatchRule.CT,
        Filter.DisplayMode.HIDDEN));
  }

  var aggregations = [];

  if (model.results.measure_values) {
    aggregations = [];

    angular.forEach(model.results.measures, function(measure) {
      aggregations.push(measure.name);
    });
  } else {
    fieldFilters.push(this.createSimpleFilter('value'));
  }

  var queryProperties = new QueryProperties(
      aggregations,
      fieldFilters,
      []);

  var tableId = datasetName + '.' + tableName;

  if (projectId) {
    tableId = projectId + ':' + tableId;
  }

  var tableExpr = '';

  if (tablePartition == QueryTablePartitioning.PERDAY) {
    if (!startFilter) {
      throw 'Start date is required when PERDAY table partitioning is used.';
    }

    if (!endFilter) {
      endFilter = 'CURRENT_TIMESTAMP()';
    }

    tableExpression = '(TABLE_DATE_RANGE([' + tableId + '], ' + startFilter + ', ' + endFilter + '))';
  } else {
    tableExpression = '[' + tableId + ']';
  }

  var sql = BigQueryBuilder.formatQuery(
      BigQueryBuilder.buildSelectArgs(queryProperties),
      [tableExpression],
      BigQueryBuilder.buildWhereArgs(queryProperties),
      BigQueryBuilder.buildGroupArgs(queryProperties),
      fieldSortOrders,
      model.results.row_limit);

  if (params) {
    sql = this.replaceTokens(sql, params);
  }

  return sql;
};


});  // goog.scope
