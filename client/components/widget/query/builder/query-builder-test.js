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
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderService');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilterType');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');

goog.require('goog.date');


goog.scope(function() {

var explorer = p3rf.perfkit.explorer;
var DateFilterType = explorer.models.perfkit_simple_builder.DateFilterType;
var QueryBuilder = explorer.components.widget.query.builder.QueryBuilderService;
var QueryConfigModel = explorer.models.perfkit_simple_builder.QueryConfigModel;

describe('TestQueryBuilder', function() {
  var builder;

  beforeEach(module('explorer'));

  beforeEach(inject(function(queryBuilderService) {
    svc = queryBuilderService;
  }));

  describe('replaceTokens', function() {
    it('should replace existing tokens.', function() {
      var providedQuery = 'SELECT foo FROM %%TABLE%%';
      var expectedValue = 'MyProject.MyDs.MyTableName';
      var providedParams = [
        {'name': 'TABLE', 'value': expectedValue}
      ];
      var expectedQuery = 'SELECT foo FROM ' + expectedValue;

      var actualQuery = svc.replaceTokens(providedQuery, providedParams);
      expect(actualQuery).toEqual(expectedQuery);
    });

    it('should replace multiple tokens.', function() {
      var providedQuery = 'SELECT foo FROM %%TABLE%% WHERE bar > %%VAL%%';
      var expectedTable = 'MyProject.MyDs.MyTableName';
      var expectedVal = '42';

      var providedParams = [
        {'name': 'TABLE', 'value': expectedTable},
        {'name': 'VAL', 'value': expectedVal}
      ];
      var expectedQuery = (
          'SELECT foo FROM ' + expectedTable + ' WHERE bar > ' + expectedVal);

      var actualQuery = svc.replaceTokens(providedQuery, providedParams);
      expect(actualQuery).toEqual(expectedQuery);
    });

    it('should replace duplicate tokens.', function() {
      var providedQuery = 'SELECT foo FROM %%TABLE%%_foo, %%TABLE%%_bar';
      var expectedTable = 'MyProject.MyDs.MyTableName';

      var providedParams = [
        {'name': 'TABLE', 'value': expectedTable}
      ];
      var expectedQuery = (
          'SELECT foo FROM ' + expectedTable + '_foo, ' +
          expectedTable + '_bar');

      var actualQuery = svc.replaceTokens(providedQuery, providedParams);
      expect(actualQuery).toEqual(expectedQuery);
    });

    it('should ignore unused tokens.', function() {
      var providedQuery = 'SELECT foo FROM %%TABLE%%';
      var expectedTable = 'MyProject.MyDs.MyTableName';

      var providedParams = [
        {'name': 'TABLE', 'value': expectedTable},
        {'name': 'OTHER_PARAM', 'value': 'UNUSED'}
      ];
      var expectedQuery = 'SELECT foo FROM ' + expectedTable;

      var actualQuery = svc.replaceTokens(providedQuery, providedParams);
      expect(actualQuery).toEqual(expectedQuery);
    });

    it('should replace tokens with numbers.', function() {
      var providedQuery = 'SELECT foo FROM table WHERE x > %%VALUE%%';
      var expectedValue = 42;

      var providedParams = [
        {'name': 'VALUE', 'value': 42}
      ];
      var expectedQuery = 'SELECT foo FROM table WHERE x > ' + expectedValue;

      var actualQuery = svc.replaceTokens(providedQuery, providedParams);
      expect(actualQuery).toEqual(expectedQuery);
    });
    
    it('should gracefully handle null/undefined values.', function() {
      var nullQuery = null;
      var undefinedQuery;
      
      var providedParams = [
        {'name': 'VALUE', 'value': 42}
      ];

      var actualQuery = svc.replaceTokens(nullQuery, providedParams);
      expect(actualQuery).toEqual(nullQuery);      

      var actualQuery = svc.replaceTokens(undefinedQuery, providedParams);
      expect(actualQuery).toEqual(undefinedQuery);      
    });
  });

  describe('getSql', function() {

    it('should return the SQL statement for a default query.', function() {
      var query = new QueryConfigModel();

      var expected_sql = [
        'SELECT',
        '\tUSEC_TO_TIMESTAMP(UTC_USEC_TO_DAY(INTEGER(timestamp * 1000000))) AS date,',
        '\tNTH(99, QUANTILES(value, 100)) AS p99',
        'FROM',
        '\t[DEFAULT_DATASET.DEFAULT_PROJECT]',
        'GROUP BY',
        '\tdate',
        'ORDER BY',
        '\tproduct_name,',
        '\ttest,',
        '\tmetric,',
        '\tdate',
        'LIMIT 100;'].join('\n');

      query.filters.start_date = null;

      var actual_sql = svc.getSql(query, null, 'DEFAULT_DATASET', 'DEFAULT_PROJECT');
      expect(actual_sql).toEqual(expected_sql);
    });

    it('should return the SQL statement for a complex query.', function() {
      var query = new QueryConfigModel();

      var expected_sql = [
        'SELECT',
        '\tUSEC_TO_TIMESTAMP(UTC_USEC_TO_DAY(INTEGER(timestamp * 1000000))) AS date,',
        '\tNTH(99, QUANTILES(value, 100)) AS p99',
        'FROM',
        '\t[DEFAULT_DATASET.DEFAULT_PROJECT]',
        'WHERE',
        '\ttimestamp >= TIMESTAMP_TO_SEC(DATE_ADD(CURRENT_TIMESTAMP(), -2, "WEEK")) AND',
        '\tproduct_name = "test_product"',
        'GROUP BY',
        '\tdate',
        'ORDER BY',
        '\ttest,',
        '\tmetric,',
        '\tdate',
        'LIMIT 100;'].join('\n');

      query.filters.start_date.filter_type = DateFilterType.WEEK;
      query.filters.start_date.filter_value = 2;
      query.filters.product_name = 'test_product';

      var actual_sql = svc.getSql(query, null, 'DEFAULT_DATASET', 'DEFAULT_PROJECT');
      expect(actual_sql).toEqual(expected_sql);
    });
  });

});

});  // goog.scope
