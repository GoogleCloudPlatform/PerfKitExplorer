/**
 * @fileoverview Tests for the QueryEditor service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.dashkit.explorer.application.module');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.DateFilterType');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryBuilderService');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryConfigModel');

goog.require('goog.date');


goog.scope(function() {

var explorer = p3rf.dashkit.explorer;
var DateFilterType = explorer.models.dashkit_simple_builder.DateFilterType;
var QueryBuilder = explorer.models.dashkit_simple_builder.QueryBuilderService;
var QueryConfigModel = explorer.models.dashkit_simple_builder.QueryConfigModel;

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
