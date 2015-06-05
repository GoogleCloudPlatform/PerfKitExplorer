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
 * @fileoverview Unit tests for table_builder_test.js.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.query_builder.Filter');
goog.require('p3rf.perfkit.explorer.components.query_builder.FilterClause');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryBuilder');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryProperties');
goog.require('goog.array');

describe('TestQueryConfigModel', function() {
  const explorer = p3rf.perfkit.explorer;
  const Filter = explorer.components.query_builder.Filter;
  const FilterClause = explorer.components.query_builder.FilterClause;
  const QueryBuilder = explorer.components.query_builder.QueryBuilder;
  const QueryProperties = explorer.components.query_builder.QueryProperties;

  var query;


  /**
   * An empty QueryProperties Object.
   * @const
   */
  var EMPTY = new QueryProperties([], [], []);


  /**
   * A query properties object with a few selects and a filter.  Includes fields,
   * and metadata using both the column and hidden display mode.
   * @const
   */
  var BASIC_SELECT_WHERE_NO_AGG = new QueryProperties(
    [],
    [new Filter('field1', [], Filter.DisplayMode.COLUMN, 'alias-1'),
     new Filter('field2',
         [new FilterClause(['string-value'], FilterClause.MatchRule.EQ)],
         Filter.DisplayMode.COLUMN),
     new Filter('field3',
         [new FilterClause([2], FilterClause.MatchRule.GT),
          new FilterClause([0], FilterClause.MatchRule.LT)],
         Filter.DisplayMode.HIDDEN),
     new Filter('value', [], Filter.DisplayMode.COLUMN)],
    [new Filter('meta1', [], Filter.DisplayMode.COLUMN),
     new Filter('meta2',
         [new FilterClause([11], FilterClause.MatchRule.EQ)],
         Filter.DisplayMode.COLUMN),
     new Filter('meta3',
         [new FilterClause([22], FilterClause.MatchRule.GT),
          new FilterClause([13], FilterClause.MatchRule.LT)],
         Filter.DisplayMode.HIDDEN)]);


  /**
   * A query properties object with a few selects, a filter, and aggregations.
   * Includes fields, and metadata using both the column and hidden display mode.
   * @const
   */
  var BASIC_SELECT_WHERE_AGG = new QueryProperties(
      ['mean', 'std'],
      [new Filter('field1', [], Filter.DisplayMode.COLUMN, 'alias-1'),
       new Filter('field2', [new FilterClause(
           ['string-value'], FilterClause.MatchRule.EQ)], Filter.DisplayMode.HIDDEN)],
      [new Filter('meta1', [], Filter.DisplayMode.COLUMN),
       new Filter('meta2', [new FilterClause(
           [2], FilterClause.MatchRule.EQ)], Filter.DisplayMode.HIDDEN)]);


  // TODO: fuzz test field names here, especially with regex-reserved words.
  describe('formatQuery', function() {
    it('should work without optional args.', function() {
      var actual = ['arg1', 'arg2'];
      var from_args = ['table1', 'table2'];

      var expectedQuery = 'SELECT\n\targ1,\n\targ2\nFROM\n\ttable1,\n\ttable2;';
      var actualQuery = QueryBuilder.formatQuery(
        actual, from_args);

      expect(actualQuery).toEqual(expectedQuery);
    });

    it('should work with all args.', function() {
      var select_args = ['arg1', 'arg2'];
      var from_args = ['table1', 'table2'];
      var where_args = ['x > y', 'a = b'];
      var group_by = ['a-1', 'a2'];
      var order_by = ['arg1', 'arg2'];
      var row_limit = 1000;

      var expectedQuery = 'SELECT\n\targ1,\n\targ2\nFROM\n\ttable1,\n\ttable2\n' +
        'WHERE\n\tx > y AND\n\ta = b\nGROUP BY\n\ta-1,\n\ta2\n' +
        'ORDER BY\n\targ1,\n\targ2\nLIMIT 1000;';
      var actualQuery = QueryBuilder.formatQuery(
        select_args, from_args, where_args, group_by, order_by, row_limit);
      expect(actualQuery).toEqual(expectedQuery);
    });
  });

  describe('testRegexpForMetadata', function() {
    it('should return an appropriate REGEXP expression.', function() {
      expectedExpr = 'REGEXP_EXTRACT(labels, r"\|field:(.*?)\|")';
      actualExpr = QueryBuilder.getRegexpForMetadata('field');
      expect(actualExpr).toEqual(expectedExpr);
    });
  });

  describe('buildGroupArgs', function() {
    it('should work without aggregations.', function() {
      var expected = [];
      var actual = QueryBuilder.buildGroupArgs(BASIC_SELECT_WHERE_NO_AGG);
      expect(actual).toEqual(expected);
    });

    it('should work with aggregations.', function() {
      var expected = ['alias_1', 'meta1'];
      var actual = QueryBuilder.buildGroupArgs(BASIC_SELECT_WHERE_AGG);
      expect(actual).toEqual(expected);
    });
  });

  describe('buildSelectArgs', function() {
    it('should return an empty set when no args are passed.', function() {
      var expected = [];
      var actual = QueryBuilder.buildSelectArgs(EMPTY);
      expect(actual).toEqual(expected);
    });

    it('should return an valid query with no aggregations.', function() {
      var expected = ['field1 AS alias_1', 'field2', 'value',
        'REGEXP_EXTRACT(labels, r"|meta1:(.*?)|") AS meta1',
        'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") AS meta2'];
      var actual = QueryBuilder.buildSelectArgs(BASIC_SELECT_WHERE_NO_AGG);
      expect(actual).toEqual(expected);
    });

    it('should return an valid query with no aggregations.', function() {
      var expected = ['field1 AS alias_1', 'field2', 'value',
        'REGEXP_EXTRACT(labels, r"|meta1:(.*?)|") AS meta1',
        'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") AS meta2'];
      var actual = QueryBuilder.buildSelectArgs(BASIC_SELECT_WHERE_NO_AGG);
      expect(actual).toEqual(expected);
    });

    it('should return an valid query with aggregations.', function() {
      var expected = ['field1 AS alias_1',
        'REGEXP_EXTRACT(labels, r"|meta1:(.*?)|") AS meta1',
        'MEAN(value) AS mean', 'STD(value) AS std'];
      var actual = QueryBuilder.buildSelectArgs(BASIC_SELECT_WHERE_AGG);
      expect(actual).toEqual(expected);
    });
  });

  describe('buildSelectArgs', function() {
    it('should return an empty set when no args are passed.', function() {
      var expected = [];
      var actual = QueryBuilder.buildWhereArgs(EMPTY);
      expect(actual).toEqual(expected);
    });

    it('should return valid filters when passed via QueryProperties.',
      function() {
        var expected = ['field2 = "string-value"', '(field3 > 2 OR field3 < 0)',
          'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") = 11',
          '(REGEXP_EXTRACT(labels, r"|meta3:(.*?)|") > 22 OR ' +
            'REGEXP_EXTRACT(labels, r"|meta3:(.*?)|") < 13)'];
        var actual = QueryBuilder.buildWhereArgs(BASIC_SELECT_WHERE_NO_AGG);
        expect(actual).toEqual(expected);

        expected = ['field2 = "string-value"',
          'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") = 2'];
        actual = QueryBuilder.buildWhereArgs(BASIC_SELECT_WHERE_AGG);
        expect(actual).toEqual(expected);
    });
  });
});
