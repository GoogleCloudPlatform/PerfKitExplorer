/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Unit tests for query_properties.js.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.query_builder.Aggregation');
goog.require('p3rf.perfkit.explorer.components.query_builder.Filter');
goog.require('p3rf.perfkit.explorer.components.query_builder.FilterClause');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryProperties');
goog.require('goog.testing.jsunit');

var explorer = p3rf.perfkit.explorer;
var Aggregation = explorer.components.query_builder.Aggregation;
var Filter = explorer.components.query_builder.Filter;
var FilterClause = explorer.components.query_builder.FilterClause;
var QueryProperties = explorer.components.query_builder.QueryProperties;


/**
 * Test the constructor and enum values.
 */
function testConstructor() {
  var fieldFilters = new Filter(
      'field1',
      [new FilterClause(['value'], FilterClause.MatchRule.EQ)],
      Filter.DisplayMode.COLUMN);

  var metadataFilters = new Filter(
      'field2',
      [new FilterClause(['value1'], FilterClause.MatchRule.GT),
       new FilterClause(['value2'], FilterClause.MatchRule.LT)],
      Filter.DisplayMode.HIDDEN);

  var qp = new QueryProperties(
      [Aggregation.MEAN, '50%'],
      [fieldFilters], [metadataFilters]);
}
