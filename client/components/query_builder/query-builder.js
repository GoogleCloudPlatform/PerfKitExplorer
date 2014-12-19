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
 * @fileoverview Contains the QueryBuilder class which knows how to build
 * various table types based on one or more QueryProperties.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.query_builder.QueryBuilder');

goog.require('p3rf.perfkit.explorer.components.query_builder.Filter');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryProperties');
goog.require('goog.string');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var Filter = explorer.components.query_builder.Filter;
var QueryProperties = explorer.components.query_builder.QueryProperties;


/**
 * Class used to build tables from an array of QueryProperties.
 */
explorer.components.query_builder.QueryBuilder = function() {};

var QueryBuilder = explorer.components.query_builder.QueryBuilder;


/**
 * Builds and formats a query string based on a series of query arguments.
 *
 * The whereArgs, if provided, are combined with the AND operator.  To get
 * an OR condition, provide the nested statement enclosed in parentheses.
 * ex: (x = 1 OR y = 2).  Note that it is not possible to include top-level
 * OR's, though this feature may be added to support single-query comparisons
 * in the future.
 *
 * @param {!Array.<string>} selectArgs The lines of the select statement.
 * @param {!Array.<string>} fromArgs The tables to query.
 * @param {!Array.<string>=} opt_whereArgs The lines of the where statement.
 * @param {!Array.<string>=} opt_groupArgs The lines of the group by statement.
 * @param {!Array.<string>=} opt_orderArgs The lines of the order by statement.
 * @param {number=} opt_rowLimit The maximum number of rows to return.
 * @return {string} The query string that was built based on the provided
 *     arguments.
 */
QueryBuilder.formatQuery = function(
    selectArgs, fromArgs, opt_whereArgs, opt_groupArgs, opt_orderArgs,
    opt_rowLimit) {
  /**
   * Adds arguments to the query array.
   * @param {string} keyword The sequel keyword related to the arguments.  For
   *     example 'SELECT' or 'WHERE'.
   * @param {string} lineJoiner The string to use to join elements of args.
   * @param {!Array.<string>=} opt_args The array of arguments to add to the
   *     query.
   * @param {?string=} opt_prefix The string to prefix each arg with.
   * @param {?string=} opt_suffix The string to postfix each arg with.
   */
  var addArgsToQuery = function(keyword, lineJoiner, opt_args, opt_prefix, opt_suffix) {
    /**
     * Prefixes a tab to a string.
     * @param {string} str the string that a tab will be prefixed to.
     * @return {string} the original string prefixed by a tab.
     */
    var addTab = function(str) {
      var result = '\t';

      if (opt_prefix) { result += opt_prefix; }
      result += str;
      if (opt_suffix) { result += opt_suffix; }

      return result;
    };

    if (goog.isDef(opt_args) && opt_args.length > 0) {
      query.push(keyword);
      opt_args = opt_args.map(addTab);
      query.push(opt_args.join(lineJoiner));
    }
  };

  var query = [];

  addArgsToQuery('SELECT', ',\n', selectArgs);
  addArgsToQuery('FROM', ',\n', fromArgs);
  addArgsToQuery('WHERE', ' AND\n', opt_whereArgs);
  addArgsToQuery('GROUP BY', ',\n', opt_groupArgs);
  addArgsToQuery('ORDER BY', ',\n', opt_orderArgs);

  if (goog.isDef(opt_rowLimit)) {
    query.push('LIMIT ' + opt_rowLimit);
  }

  return query.join('\n') + ';';
};


// TODO: Consider adding code to handle literals in the name that
// would break this function in SQL.  Unsure whether a customer can cause this
// as it depends on the explorer pages.
/**
 * Generates the statement to extract an item of metadata from the labels
 *     string.
 * @param {string} name The name of the piece of metadata to extract from the
 *     labels string.
 * @return {string} The sql used to extract the named piece of metadata.
 */
QueryBuilder.getRegexpForMetadata = function(name) {
  return 'REGEXP_EXTRACT(labels, r"\|' + name + ':(.*?)\|")';
};


/**
 * Builds the array of group by args based on the passed QueryProperties object.
 * @param {QueryProperties} queryProperties The query properties to use when
 *     building the group by args.
 * @return {!Array.<string>} an array of strings that represent the group by
 *     statements.  Each group by statement is an element in the array.
 */
QueryBuilder.buildGroupArgs = function(queryProperties) {
  var groupArgs = [];

  if (queryProperties.aggregations.length == 0) {
    return groupArgs;
  }

  var allFilters = queryProperties.fieldFilters.concat(
      queryProperties.metadataFilters);
  for (var i = 0, len = allFilters.length; i < len; i++) {
    var field = allFilters[i];
    if (field.displayMode != Filter.DisplayMode.HIDDEN) {
      if (goog.isDef(field.fieldAlias) &&
          !goog.string.isEmpty(field.fieldAlias)) {
        groupArgs.push(field.fieldAlias.replace(/\W/g, '_'));
      } else {
        groupArgs.push(field.fieldName);
      }
    }
  }

  return groupArgs;
};


/**
 * Builds the array of select args based on the passed QueryProperties object.
 * This does not build all arguments to construct a complete query, rather
 * it builds the clauses that make up the select portion of a query.
 * @param {QueryProperties} queryProperties The query properties to use when
 *     building the select args.
 * @return {!Array.<string>} an array of strings that represent the select
 *     statements.  Each select statement is an element in the array.
 */
QueryBuilder.buildSelectArgs = function(queryProperties) {
  var selectArgs = [];

  // Add fieldFilters
  for (var i = 0, len = queryProperties.fieldFilters.length; i < len; i++) {
    var field = queryProperties.fieldFilters[i];
    if (field.displayMode != Filter.DisplayMode.HIDDEN) {
      var fieldString = field.fieldName;
      if (goog.isDef(field.fieldAlias) &&
          !goog.string.isEmpty(field.fieldAlias) &&
          !(field.fieldName == field.fieldAlias)) {
        fieldString += ' AS ' + field.fieldAlias.replace(/\W/g, '_');
      }
      selectArgs.push(fieldString);
    }
  }

  // Add metadataFilters
  for (var i = 0, len = queryProperties.metadataFilters.length; i < len; i++) {
    var metadata = queryProperties.metadataFilters[i];
    if (metadata.displayMode != Filter.DisplayMode.HIDDEN) {
      selectArgs.push(QueryBuilder.getRegexpForMetadata(metadata.fieldName) +
                      ' AS ' + metadata.fieldName.replace(/\W/g, '_'));
    }
  }

  // Add any value aggregations to the selectArgs.  The function name
  // is upper-cased, while the returned field name is lower-case.
  if (queryProperties.aggregations.length != 0) {
    for (var j = 0, len = queryProperties.aggregations.length; j < len; j++) {
      var aggregation = queryProperties.aggregations[j];

      if (aggregation.substr(aggregation.length - 1, 1) == '%') {
        var percentile = parseFloat(aggregation.substr(0, aggregation.length - 1));
        var decimal_place = aggregation.indexOf('.');
        var multiplier = 100;

        if (decimal_place > -1) {
          var magnitude = aggregation.length - decimal_place - 2;
          multiplier = multiplier * (Math.pow(10, magnitude));
        }

        var nth_place = percentile.toString().replace('.', '');
        var column_name = 'p' + aggregation.replace('.', '_').replace('%', '');

        selectArgs.push('NTH(' + nth_place + ', QUANTILES(value, ' + multiplier + ')) AS ' + column_name);
      } else {
        selectArgs.push(
                queryProperties.aggregations[j].toUpperCase() +
                '(value) AS ' +
                queryProperties.aggregations[j].toLowerCase());
      }
    }
  }

  return selectArgs;
};


/**
 * Builds the array of where args based on the passed QueryProperties object.
 * @param {QueryProperties} queryProperties The query properties to use when
 *     building the where args.
 * @return {!Array.<string>} an array of strings that represent the where
 *     statements.  Each where statement is an element in the array.
 */
QueryBuilder.buildWhereArgs = function(queryProperties) {
  var whereArgs = [];

  // TODO: Remove redundant logic from this method and buildSelectArgs
  // Much of the logic between the fields and metadata is duplicated.

  // Add fieldFilters
  for (var i = 0, iLen = queryProperties.fieldFilters.length; i < iLen; i++) {
    var filter = queryProperties.fieldFilters[i];
    var whereRow = [];
    for (var j = 0, jLen = filter.filterClauses.length; j < jLen; j++) {
      var filterClause = filter.filterClauses[j];
      // TODO: Add support for multiple match_on values and rules
      // that are not placed between filter name and value
      var value = filterClause.matchOn[0];
      if (goog.isString(value) && !filterClause.isFunction) {
        value = goog.string.quote(value);
      }

      whereRow.push(
          filter.fieldName + ' ' +
          filterClause.matchRule + ' ' +
          value);
    }

    switch (whereRow.length) {
      case 0:
        break;
      case 1:
        whereArgs.push(whereRow[0]);
        break;
      default:
        whereArgs.push('(' + whereRow.join(' OR ') + ')');
    }
  }

  // Add metadataFilters
  for (var i = 0, iLen = queryProperties.metadataFilters.length;
       i < iLen; i++) {
    var filter = queryProperties.metadataFilters[i];
    whereRow = [];
    for (var j = 0, jLen = filter.filterClauses.length; j < jLen; j++) {
      filterClause = filter.filterClauses[j];
      // TODO: Add support for multiple match_on values and rules
      // that are not placed between filter name and value
      whereRow.push(QueryBuilder.getRegexpForMetadata(filter.fieldName) +
                    ' ' + filterClause.matchRule + ' ' +
                    filterClause.matchOn[0]);
    }

    switch (whereRow.length) {
      case 0:
        break;
      case 1:
        whereArgs.push(whereRow[0]);
        break;
      default:
        whereArgs.push('(' + whereRow.join(' OR ') + ')');
    }
  }

  return whereArgs;
};

});  // goog.scope
