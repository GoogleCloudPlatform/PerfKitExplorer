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
 * @fileoverview Tests for the queryResultDataService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryResultDataService');
goog.require('p3rf.perfkit.explorer.mocks.queryResultDataServiceMock');


describe('queryResultDataService', function() {
  var svc, rootScope;
  var httpBackend, endpoint, mockData;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));
  beforeEach(module('queryResultDataServiceMock'));

  // Mock the data returned by queryResultDataService
  beforeEach(inject(function($httpBackend, queryResultDataServiceMockData) {
    httpBackend = $httpBackend;
    endpoint = queryResultDataServiceMockData.endpoint;
    mockData = queryResultDataServiceMockData.data;
  }));

  beforeEach(inject(function(queryResultDataService, $rootScope) {
    svc = queryResultDataService;
    rootScope = $rootScope;
  }));

  it('should initialize the appropriate objects.', function() {
    expect(svc.fetchResults).not.toBeNull();
    expect(typeof svc.fetchResults).toBe('function');
  });

  describe('getColumnIndexesOfType_', function() {

    it('should return an empty array if no columns have the type date.',
        function() {
          var data = { cols: [{type: 'string'}, {type: 'number'}]};
          var columnIndexes = svc.getColumnIndexesOfType_(data, 'date');
          expect(columnIndexes).toEqual([]);
        }
    );

    it('should return the index of one column with type date.', function() {
      var data = { cols: [{type: 'date'}]};
      var columnIndexes = svc.getColumnIndexesOfType_(data, 'date');
      expect(columnIndexes).toEqual([0]);
    });

    it('should return the indexes of columns with type date.', function() {
      var data = { cols: [{type: 'date'}, {type: 'number'}, {type: 'date'}]};
      var columnIndexes = svc.getColumnIndexesOfType_(data, 'date');
      expect(columnIndexes).toEqual([0, 2]);
    });
  });

  describe('parseDates_', function() {
    var data;

    beforeEach(function() {
      data = {
        cols: [
          {id: 'date', label: 'Date', type: 'date'},
          {id: 'value', label: 'Response Time', type: 'number'}
        ],
        rows: [
          {c: [
            {v: '2013/03/03 00:48:04'},
            {v: 0}
          ]},
          {c: [
            {v: '2013/03/04 00:50:04', f: 'Custom text'},
            {v: 0}
          ]},
          {c: [
            {v: '2013/03/05 00:59:04'},
            {v: 0}
          ]}
        ]
      };

      svc.parseDates_(data);
    });

    it('should parse the string dates to Date objects.', function() {
      expect(data.rows[0].c[0].v).toEqual(new Date('2013/03/03 00:48:04'));
      expect(data.rows[1].c[0].v).toEqual(new Date('2013/03/04 00:50:04'));
      expect(data.rows[2].c[0].v).toEqual(new Date('2013/03/05 00:59:04'));
    });

    it('should not change other values.', function() {
      expect(data.rows[1].c[0].f).toEqual('Custom text');
      expect(data.rows[1].c[1].v).toEqual(0);
    });
  });

  describe('fetchResults', function() {

    it('should fetch the samples results of a query as a DataTable.',
        function() {
          var dataTable = null;
          var query = endpoint;
          var params = {'datasource': {'query': 'fakeQuery1'}};
          httpBackend.expectPOST(query, params).respond(mockData);

          var promise = svc.fetchResults({query: 'fakeQuery1'});
          promise.then(function(data) {
            dataTable = data;
          });

          httpBackend.flush();
          expect(dataTable).not.toBeNull();
        }
    );

    it('should cache the samples results of a query as a DataTable.',
        function() {
          var dataTable = null,
              dataTableCached = null;
          var query = endpoint;
          var params = {'datasource': {'query': 'fakeQuery2'}};
          httpBackend.expectPOST(query, params).respond(mockData);

          // Fetch the data one time
          var promise = svc.fetchResults({query: 'fakeQuery2'});
          promise.then(function(data) {
            dataTable = data;
          });

          httpBackend.flush();
          expect(dataTable).not.toBeNull();

          // Now it should be cached
          promise = svc.fetchResults({query: 'fakeQuery2'});
          promise.then(function(data) {
            dataTableCached = data;
          });

          // Resolve the promise
          rootScope.$apply();
          expect(dataTableCached).toBe(dataTable);
        }
    );
  });
});
