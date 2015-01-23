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
 * @fileoverview Tests for the arrayUtil service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');


describe('arrayUtilService', function() {
  var explorer = p3rf.perfkit.explorer;
  var svc;

  beforeEach(module('explorer'));

  beforeEach(inject(function(arrayUtilService) {
    svc = arrayUtilService;
  }));

  describe('getFirst', function() {
    it('should return the first non-empty item in an array.', function() {
      var expectedValue = 'expected';
      var providedValues = [undefined, null, '', expectedValue];

      var actualValue = svc.getFirst(providedValues);

      expect(actualValue).toBe(expectedValue);
    });

    it('should return null if no items are provided and required is false.',
        function() {
          providedValues = ['', null, undefined];

          expect(svc.getFirst(providedValues, false)).toBeNull();
        });

    it('should raise if no valid items are provided and required is true.',
        function() {
          providedValues = ['', null, undefined];

          expect(function() {
            svc.getFirst(providedValues, true);
          }).toThrowError('getFirst failed: No non-null item found.');
        });
  });
});
