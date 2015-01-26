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
 * @fileoverview Unit tests for query_properties.js.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.query_builder.Aggregation');
goog.require('p3rf.perfkit.explorer.components.query_builder.Filter');
goog.require('p3rf.perfkit.explorer.components.query_builder.FilterClause');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryProperties');

var explorer = p3rf.perfkit.explorer;
var Aggregation = explorer.components.query_builder.Aggregation;
var Filter = explorer.components.query_builder.Filter;
var FilterClause = explorer.components.query_builder.FilterClause;
var QueryProperties = explorer.components.query_builder.QueryProperties;


describe('QueryProperties', function() {
  describe('constructor', function() {
    it('should initialize correctly.', function() {
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
    });
  });
});
