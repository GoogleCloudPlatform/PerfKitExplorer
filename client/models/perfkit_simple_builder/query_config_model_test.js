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
goog.require('p3rf.perfkit.explorer.models.DatasourceModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilterType');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryDateGroupings');

goog.require('goog.date');


goog.scope(function() {

const explorer = p3rf.perfkit.explorer;
const DatasourceModel = explorer.models.DatasourceModel;
const DateFilter = explorer.models.perfkit_simple_builder.DateFilter;
const DateFilterType = explorer.models.perfkit_simple_builder.DateFilterType;
const QueryConfigModel = explorer.models.perfkit_simple_builder.QueryConfigModel;
const QueryDateGroupings = p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryDateGroupings;

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
      expect(query.results.date_group).toEqual(QueryDateGroupings.DAY);
      expect(query.results.labels).toEqual([]);
    });
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
