/**
 * @fileoverview Unit tests for table_builder_test.js.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.dashkit.explorer.components.query_builder.QueryBuilder');
goog.require('p3rf.dashkit.explorer.components.query_builder.SampleQueryProperties');
goog.require('goog.array');
goog.require('goog.testing.jsunit');

var explorer = p3rf.dashkit.explorer;
var SampleQueryProperties = explorer.SampleQueryProperties;
var QueryBuilder = explorer.QueryBuilder;


// TODO: fuzz test field names here, especially with regex-reserved words.
/**
 * Test the formatQuery method with no optional arguments.
 */
function testFormatQueryMinimum() {
  var actual = ['arg1', 'arg2'];
  var from_args = ['table1', 'table2'];

  var expectedQuery = 'SELECT\n\targ1,\n\targ2\nFROM\n\ttable1,\n\ttable2;';
  var actualQuery = QueryBuilder.formatQuery(
      actual, from_args);

  assertEquals(expectedQuery, actualQuery);
}


/**
 * Test the formatQuery method with all arguments.
 */
function testFormatQueryAll() {
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

  assertEquals(expectedQuery, actualQuery);
}


/**
 * Test the getRegexpForMetadata function.
 */
function testGetRegexpForMetadata() {
  assertEquals('REGEXP_EXTRACT(labels, r"\|field:(.*?)\|")',
      QueryBuilder.getRegexpForMetadata('field'));
}


/**
 * Test the buildGroupArgs method with no aggregations.
 */
function testBuildGroupArgsNoAggregations() {
  var expected = [];
  var actual = QueryBuilder.buildGroupArgs(
      SampleQueryProperties.BASIC_SELECT_WHERE_NO_AGG);
  assertArrayEquals(actual, expected);
}


/**
 * Test the buildGroupArgs method with aggregations.
 */
function testBuildGroupArgsAggregations() {
  var expected = ['alias_1', 'meta1'];
  var actual = QueryBuilder.buildGroupArgs(
      SampleQueryProperties.BASIC_SELECT_WHERE_AGG);
  assertArrayEquals(actual, expected);
}


/**
 * Test the buildSelectArgs method with an empty QueryProperties.
 */
function testBuildSelectArgsNone() {
  var expected = [];
  var actual = QueryBuilder.buildSelectArgs(
      SampleQueryProperties.EMPTY);
  assertArrayEquals(actual, expected);
}


/**
 * Test the buildSelectArgs method with no aggregations.
 */
function testBuildSelectArgsNoAggregations() {
  var expected = ['field1 AS alias_1', 'field2', 'value',
                  'REGEXP_EXTRACT(labels, r"|meta1:(.*?)|") AS meta1',
                  'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") AS meta2'];
  var actual = QueryBuilder.buildSelectArgs(
      SampleQueryProperties.BASIC_SELECT_WHERE_NO_AGG);
  assertArrayEquals(actual, expected);
}


/**
 * Test the buildSelectArgs method with aggregations.
 */
function testBuildSelectArgsAggregations() {
  var expected = ['field1 AS alias_1',
                  'REGEXP_EXTRACT(labels, r"|meta1:(.*?)|") AS meta1',
                  'MEAN(value) AS mean', 'STD(value) AS std'];
  var actual = QueryBuilder.buildSelectArgs(
      SampleQueryProperties.BASIC_SELECT_WHERE_AGG);
  assertArrayEquals(actual, expected);
}


/**
 * Test the buildWhereArgs method with an empty QueryProperties.
 */
function testBuildWhereArgsNone() {
  var expected = [];
  var actual = QueryBuilder.buildWhereArgs(
      SampleQueryProperties.EMPTY);
  assertArrayEquals(actual, expected);
}


/**
 * Test the buildWhereArgs method with a QueryProperties containing filters.
 */
function testBuildWhereArgs() {
  var expected = ['field2 = "string-value"', '(field3 > 2 OR field3 < 0)',
                  'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") = 11',
                  '(REGEXP_EXTRACT(labels, r"|meta3:(.*?)|") > 22 OR ' +
                      'REGEXP_EXTRACT(labels, r"|meta3:(.*?)|") < 13)'];
  var actual = QueryBuilder.buildWhereArgs(
      SampleQueryProperties.BASIC_SELECT_WHERE_NO_AGG);
  assertArrayEquals(actual, expected);

  expected = ['field2 = "string-value"',
              'REGEXP_EXTRACT(labels, r"|meta2:(.*?)|") = 2'];
  actual = QueryBuilder.buildWhereArgs(
      SampleQueryProperties.BASIC_SELECT_WHERE_AGG);
  assertArrayEquals(actual, expected);
}
