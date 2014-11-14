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
 * @fileoverview Tests for the QueryEditor service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilterType');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryBuilderService');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');

goog.require('goog.date');


goog.scope(function() {

var explorer = p3rf.perfkit.explorer;
var DateFilterType = explorer.models.perfkit_simple_builder.DateFilterType;
var QueryBuilder = explorer.models.perfkit_simple_builder.QueryBuilderService;
var QueryConfigModel = explorer.models.perfkit_simple_builder.QueryConfigModel;

describe('TestQueryBuilder', function() {
  var builder;

  beforeEach(module('explorer'));

  beforeEach(inject(function(queryBuilderService) {
    svc = queryBuilderService;
  }));

  describe('getSql', function() {

    it('should return the SQL statement for a default query.', function() {
      var query = new QueryConfigModel();

      var expected_sql = [
        'SELECT',
        '\tproduct_name,',
        '\ttest,',
        '\tmetric,',
        '\towner,',
        '\tMIN(value) AS min,',
        '\tAVG(value) AS avg,',
        '\tMAX(value) AS max,',
        '\tSTDDEV(value) AS stddev,',
        '\tVARIANCE(value) AS variance,',
        '\tCOUNT(value) AS count',
        'FROM',
        '\tsamples_mart.results',
        'GROUP BY',
        '\tproduct_name,',
        '\ttest,',
        '\tmetric,',
        '\towner',
        'ORDER BY',
        '\tproduct_name,',
        '\ttest,',
        '\tmetric',
        'LIMIT 5000;'].join('\n');

      query.filters.start_date = null;
      expect(svc.getSql(query)).toEqual(expected_sql);
    });

    it('should return the SQL statement for a complex query.', function() {
      var query = new QueryConfigModel();

      var expected_sql = [
        'SELECT',
        '\ttest,',
        '\tmetric,',
        '\towner,',
        '\tMIN(value) AS min,',
        '\tAVG(value) AS avg,',
        '\tMAX(value) AS max,',
        '\tSTDDEV(value) AS stddev,',
        '\tVARIANCE(value) AS variance,',
        '\tCOUNT(value) AS count',
        'FROM',
        '\tsamples_mart.results',
        'WHERE',
        ('\ttimestamp >= TIMESTAMP_TO_SEC(DATE_ADD(CURRENT_TIMESTAMP(), ' +
         '-2, "WEEK")) AND'),
        '\tproduct_name = "test_product"',
        'GROUP BY',
        '\ttest,',
        '\tmetric,',
        '\towner',
        'ORDER BY',
        '\ttest,',
        '\tmetric',
        'LIMIT 5000;'].join('\n');

      query.filters.start_date.filter_type = DateFilterType.WEEK;
      query.filters.start_date.filter_value = 2;

      query.filters.product_name = 'test_product';

      expect(svc.getSql(query)).toEqual(expected_sql);
    });
  });

});

});  // goog.scope
