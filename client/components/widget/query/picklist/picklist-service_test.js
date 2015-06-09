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
 * @fileoverview Tests for the picklistService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.query.picklist.PicklistService');


goog.scope(function() {

describe('picklistService', function() {
  var svc, $httpBackend;

  beforeEach(module('explorer'));

  beforeEach(inject(function(picklistService, _$httpBackend_) {
    svc = picklistService;

    $httpBackend = _$httpBackend_;
  }));

  it('should initialize the service', function() {
    expect(svc.picklists).toBeDefined();
  });
  
  describe('refresh', function() {
    var mockData = [
      {'name': 'item 1'},
      {'name': 'item 2'}
    ];

    it('should load items for the specified picklist', function() {
      var actualPicklist = svc.picklists['product_name'];
      expect(actualPicklist).not.toBeNull();
      expect(actualPicklist.items.length).toEqual(0);

      $httpBackend.expectGET('/data/fields?field_name=product_name')
          .respond({rows: mockData});
      svc.refresh('product_name');

      $httpBackend.flush();

      actualPicklist = svc.picklists['product_name'];
      expect(actualPicklist).not.toBeNull();
      expect(actualPicklist.items).toEqual(mockData);
    });
  });
});

});
