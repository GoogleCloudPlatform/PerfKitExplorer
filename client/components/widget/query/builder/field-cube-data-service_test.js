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
 * @fileoverview Tests for the fieldCubeDataService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.FieldCubeDataService');
goog.require('p3rf.perfkit.explorer.mocks.fieldCubeDataServiceMock');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.PicklistModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');
goog.require('goog.Uri');

describe('fieldCubeDataService', function() {
  var explorer = p3rf.perfkit.explorer;
  var PicklistModel = explorer.models.perfkit_simple_builder.PicklistModel;
  var QueryFilterModel =
      explorer.models.perfkit_simple_builder.QueryFilterModel;
  var svc, rootScope, httpBackend;

  beforeEach(module('explorer'));
  beforeEach(module('fieldCubeDataServiceMock'));

  // Mock the data returned by $http
  beforeEach(inject(function($httpBackend, fieldCubeDataServiceMockData) {
    httpBackend = $httpBackend;
    mockData = fieldCubeDataServiceMockData.data;
  }));

  beforeEach(inject(function(fieldCubeDataService, $rootScope) {
    svc = fieldCubeDataService;
    rootScope = $rootScope;
  }));

  it('should initialize the appropriate objects.', function() {
    expect(svc.list).not.toBeNull();
    expect(typeof svc.list).toBe('function');
  });

  describe('listFields', function() {

    it('should return a list of autocomplete entries for a given field.',
        function() {
         var picklist = null;

         httpBackend.whenGET('/data/fields?field_name=test1').respond(mockData);
         var promise = svc.listFields('test1', null);

         promise.then(function(data) {
           picklist = data;
         });

         httpBackend.flush();

         var mockPicklist = mockData()[1]['rows'];
         expect(picklist).toEqual(mockPicklist);
       });

  });

  describe('listMetadata', function() {

    it('should return a list of metadata entries.',
        function() {
         var picklist = null;

         httpBackend.whenGET('/data/metadata').respond(mockData);
         var promise = svc.listMetadata(null);

         promise.then(function(data) {
           picklist = data;
         });

         httpBackend.flush();

         var mockPicklist = mockData()[1]['rows'];
         expect(picklist).toEqual(mockPicklist);
       });

  });
});
