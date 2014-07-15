/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Tests for the QueryEditor service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.models.DatasourceModel');
goog.require('p3rf.perfkit.explorer.models.dashkit_simple_builder.DateFilter');
goog.require('p3rf.perfkit.explorer.models.dashkit_simple_builder.DateFilterType');
goog.require('p3rf.perfkit.explorer.models.dashkit_simple_builder.QueryConfigModel');

goog.require('goog.date');


goog.scope(function() {

var explorer = p3rf.perfkit.explorer;
var DatasourceModel = explorer.models.DatasourceModel;
var DateFilter = explorer.models.dashkit_simple_builder.DateFilter;
var DateFilterType = explorer.models.dashkit_simple_builder.DateFilterType;
var QueryConfigModel = explorer.models.dashkit_simple_builder.QueryConfigModel;

describe('TestQueryConfigModel', function() {
  var query;

  beforeEach(module('explorer'));

  beforeEach(inject(function($injector) {
    query = new QueryConfigModel();
  }));

  describe('QueryConfigModel', function() {

    it('should initialize the appropriate objects.', function() {
      expect(query.results).not.toBeNull();
      expect(query.filters).not.toBeNull();

      expect(query.getSql).not.toBeNull();
    });

    it('should initialize the appropriate defaults.', function() {
      expect(query.results.date_group).toEqual('OneGroup');
    });

    it('should initialize the appropriate filters.', function() {
      expect(query.filters.start_date.filter_type).toEqual(DateFilterType.WEEK);
      expect(query.filters.start_date.filter_value).toEqual(2);
      expect(query.filters.end_date).toBeNull();
      expect(query.filters.product_name).toBeNull();
      expect(query.filters.test).toBeNull();
      expect(query.filters.metric).toBeNull();
      expect(query.filters.metadata).toEqual([]);
    });

    it('should initialize the appropriate results.', function() {
      expect(query.results.date_group).toEqual('OneGroup');
      expect(query.results.labels).toEqual([]);
    });
  });

  describe('queryStringToConfig', function() {
    it('should convert a simple querystring to a config and remove the string.',
        function() {
          var providedString = 'start_date=2014-03-06';
          var expectedConfig = new QueryConfigModel();
          expectedConfig.filters.start_date = new DateFilter(
              '2014-03-06', 'CUSTOM');

          var actualConfig = new QueryConfigModel();
          QueryConfigModel.applyQueryString(actualConfig, providedString);

          expect(actualConfig).toEqual(expectedConfig);
        }
    );

    it('should populate end date if provided.',
        function() {
          var providedString = 'end_date=2014-03-06';
          var expectedConfig = new QueryConfigModel();
          expectedConfig.filters.end_date = new DateFilter(
              '2014-03-06', 'CUSTOM');

          var actualConfig = new QueryConfigModel();
          QueryConfigModel.applyQueryString(actualConfig, providedString);

          expect(actualConfig).toEqual(expectedConfig);
        }
    );

    it('should not override unspecified parameters.',
        function() {
          var providedString = 'end_date=2014-03-06';
          var expectedProduct = 'test product';
          var expectedConfig = new QueryConfigModel();
          expectedConfig.filters.end_date = new DateFilter(
              '2014-03-06', 'CUSTOM');
          expectedConfig.filters.product_name = expectedProduct;

          var actualConfig = new QueryConfigModel();
          actualConfig.filters.product_name = expectedProduct;
          QueryConfigModel.applyQueryString(actualConfig, providedString);

          expect(actualConfig).toEqual(expectedConfig);
        }
    );

    it('should support all basic query parameters.',
        function() {
          var providedString = [
            'start_date=2014-03-06',
            'end_date=2014-04-02',
            'date_group=OneGroup',
            'product_name=SAMPLE_PRODUCT',
            'test=SAMPLE_TEST',
            'metric=SAMPLE_METRIC',
            'official=true',
            'runby=SAMPLE_RUNBY',
            'metadata=Color%3Ablue',
            'metadata=Shape%3Acircle',
            'labelcol=Weight',
            'labelcol=Cost'].join('&');
          var expectedProduct = 'test product';
          var expectedFilters = {
            'start_date': {
              'filter_type': 'CUSTOM', 'filter_value': '2014-03-06',
              'text': '2014-03-06', 'specify_time': false},
            'end_date': {
              'filter_type': 'CUSTOM', 'filter_value': '2014-04-02',
              'text': '2014-04-02', 'specify_time': false},
            'product_name': 'SAMPLE_PRODUCT',
            'test': 'SAMPLE_TEST',
            'metric': 'SAMPLE_METRIC',
            'official': true,
            'runby': 'SAMPLE_RUNBY',
            'metadata': [
              {'label': 'Color', 'value': 'blue', 'text': 'Color:blue'},
              {'label': 'Shape', 'value': 'circle', 'text': 'Shape:circle'}
            ]};
          var expectedResults = {
            'date_group': 'OneGroup',
            'pivot': false,
            'pivot_config': {
              'row_field': '',
              'column_field': '',
              'value_field': ''
            },
            'labels': [
              {'label': 'Weight'},
              {'label': 'Cost'}
            ]};

          var actualConfig = new QueryConfigModel();
          QueryConfigModel.applyQueryString(actualConfig, providedString);

          expect(actualConfig.filters).toEqual(expectedFilters);
          expect(actualConfig.results).toEqual(expectedResults);
        }
    );
  });


  describe('getMetadataFilterFromString', function() {

    it('should parse a standard label:value.',
        function() {
          var providedString = 'color:blue';
          var expectedResult =
              {'label': 'color', 'value': 'blue', 'text': 'color:blue'};
          var actualResult =
              QueryConfigModel.getMetadataFilterFromString(providedString);
          expect(actualResult).toEqual(expectedResult);
        }
    );

    it('should parse a label with no value.',
        function() {
          var providedString = 'important';
          var expectedResult =
              {'label': 'important', 'text': 'important'};
          var actualResult =
              QueryConfigModel.getMetadataFilterFromString(providedString);
          expect(actualResult).toEqual(expectedResult);
        }
    );

    it('should parse a label:value pair where the value contains separators.',
        function() {
          var providedString = 'url:http://site';
          var expectedResult =
              {'label': 'url', 'value': 'http://site',
               'text': 'url:http://site'};
          var actualResult =
              QueryConfigModel.getMetadataFilterFromString(providedString);
          expect(actualResult).toEqual(expectedResult);
        }
    );

    it('should parse a label:value pair with an empty string.',
        function() {
          var providedString = '';
          var expectedResult =
              {'label': '', 'text': ''};
          var actualResult =
              QueryConfigModel.getMetadataFilterFromString(providedString);
          expect(actualResult).toEqual(expectedResult);
        }
    );

    it('should fail to parse a label starting with a separator.',
        function() {
          var providedString = ':invalid';
          expect(function() {
            QueryConfigModel.getMetadataFilterFromString(providedString);
          }).toThrow(
              new Error('Invalid label: Cannot start with a separator.'));
        }
    );
  });
});

});  // goog.scope
