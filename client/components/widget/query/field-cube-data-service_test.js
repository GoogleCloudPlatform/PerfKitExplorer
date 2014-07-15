/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Tests for the fieldCubeDataService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.query.FieldCubeDataService');
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
