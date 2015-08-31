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
  const explorer = p3rf.perfkit.explorer;

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
      var providedValues = ['', null, undefined];

      expect(svc.getFirst(providedValues, false)).toBeNull();
    });

    it('should raise if no valid items are provided and required is true.',
        function() {
      var providedValues = ['', null, undefined];

      expect(function() {
        svc.getFirst(providedValues, true);
      }).toThrowError('getFirst failed: No non-null item found.');
    });
  });

  describe('insertBefore', function() {
    it('should add insertValue directly before beforeValue.',
        function() {
      var providedValues = ['a', 'd', 'f', 'g'];
      var expectedValues = ['a', 's', 'd', 'f', 'g'];

      svc.insertBefore(providedValues, 's', 'd');

      expect(providedValues).toEqual(expectedValues);
    });
  });

  describe('insertAfter', function() {
    it('should add insertValue directly after beforeValue.',
        function() {
      var providedValues = ['a', 's', 'f', 'g'];
      var expectedValues = ['a', 's', 'd', 'f', 'g'];

      svc.insertAfter(providedValues, 'd', 's');

      expect(providedValues).toEqual(expectedValues);
    });
  });

  describe('movePrevious', function() {
    it('should move the provided value to the previous position.',
        function() {
      var providedValues = ['a', 'd', 's', 'f', 'g'];
      var expectedValues = ['a', 's', 'd', 'f', 'g'];

      svc.movePrevious(providedValues, 's');

      expect(providedValues).toEqual(expectedValues);
    });
  });

  describe('moveNext', function() {
    it('should move the provided value to the next position.',
        function() {
      var providedValues = ['a', 'd', 's', 'f', 'g'];
      var expectedValues = ['a', 's', 'd', 'f', 'g'];

      svc.moveNext(providedValues, 'd');

      expect(providedValues).toEqual(expectedValues);
    });
  });

  describe('moveFirst', function() {
    it('should move the provided value to the next position.',
        function() {
      var providedValues = ['s', 'd', 'a', 'f', 'g'];
      var expectedValues = ['a', 's', 'd', 'f', 'g'];

      svc.moveFirst(providedValues, 'a');

      expect(providedValues).toEqual(expectedValues);
    });
  });

  describe('moveLast', function() {
    it('should move the provided value to the next position.',
        function() {
      var providedValues = ['a', 's', 'g', 'd', 'f'];
      var expectedValues = ['a', 's', 'd', 'f', 'g'];

      svc.moveLast(providedValues, 'g');

      expect(providedValues).toEqual(expectedValues);
    });
  });

  describe('getDictionary', function() {
    var item0 = {'id': 0, 'title': 'ITEM 0'};
    var item1 = {'id': 1, 'title': 'ITEM 1'};
    var item2 = {'id': 2, 'title': 'ITEM 2'};

    it('should return a dictionary from an object array.',
        function() {
      var providedArray = [item0, item1, item2];
      var expectedDict = {0: item0, 1: item1, 2: item2};

      var actualDict = svc.getDictionary(providedArray, 'id');

      expect(actualDict).toEqual(expectedDict);
    });

    it('should throw when the key does not exist.', function() {
      var providedArray = [item0, item1, item2];
      var expectedError = ('arrayUtilService.getDictionary failed: ' +
          'key NOTFOUND does not exist');
      expect(function() {
        svc.getDictionary(providedArray, 'NOTFOUND');
      }).toThrowError(expectedError);
    });

    it('should throw when the array parameter is not an array.', function() {
      var providedArray = 'Invalid value';
      var expectedError = ('arrayUtilService.getDictionary failed: ' +
          'array parameter must be a valid array');
      expect(function() {
        svc.getDictionary(providedArray, 'DOESNTMATTER');
      }).toThrowError(expectedError);
    });

    it('should throw when the array does not contain objects.', function() {
      var providedArray = [0, 1, 2];
      var expectedError = ('arrayUtilService.getDictionary failed: ' +
          'array must be a list of indexable objects');
      expect(function() {
        svc.getDictionary(providedArray, 'DOESNTMATTER');
      }).toThrowError(expectedError);
    });

    it('should throw when the array contains the same key.', function() {
      var providedArray = [item0, item1, item2, item1];
      var expectedError = ('arrayUtilService.getDictionary failed: ' +
          'key id already exists in the array');
      expect(function() {
        svc.getDictionary(providedArray, 'id');
      }).toThrowError(expectedError);
    });
  });
});
