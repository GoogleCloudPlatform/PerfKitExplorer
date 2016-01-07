/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Tests for the typeUtil library.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.util.TypeUtil');


describe('TypeUtil', function() {
  const explorer = p3rf.perfkit.explorer;
  const TypeUtil = explorer.components.util.TypeUtil;

  describe('isTruthy', function() {
    it('should call getBoolean', function() {
      expectedValue = true;
      spyOn(TypeUtil, 'getBoolean').and.callThrough();

      actual = TypeUtil.isTruthy('TRue');

      self.expect(actual).toEqual(expectedValue);
      expect(TypeUtil.getBoolean).toHaveBeenCalled();
    });
  });

  describe('isFalsy', function() {
    it('should call getBoolean', function() {
      expectedValue = true;
      spyOn(TypeUtil, 'getBoolean').and.callThrough();

      actual = TypeUtil.isFalsy('FaLsE');

      self.expect(actual).toEqual(expectedValue);
      expect(TypeUtil.getBoolean).toHaveBeenCalled();
    });
  });

  describe('getBoolean', function() {
    describe('should throw', function() {
      var provided, actual;

      afterEach(function() {
        actual = function() {
          return TypeUtil.getBoolean(provided);
        }

        self.expect(actual).toThrow();
      });

      it('when provided an invalid string', function() {
        provided = 'notaboolean';
      });

      it('when provided an invalid number', function() {
        provided = 42;
      });
    });

    describe('should return', function() {
      describe('null', function() {
        var provided, actual;

        afterEach(function() {
          actual = TypeUtil.getBoolean(provided);
          self.expect(actual).toBeNull();
        });

        it('when provided null', function() {
          provided = null;
        });

        it('when provided an undefined value', function() {
          provided = undefined;
        });
      });

      describe('true', function() {
        var provided, actual;

        afterEach(function() {
          actual = TypeUtil.getBoolean(provided);
          self.expect(actual).toBeTrue();
        });

        it('when provided the boolean true', function() {
          provided = true;
        });

        it('when provided the string true', function() {
          provided = 'true';
        });

        it('when provided the string TRUE', function() {
          provided = 'TRUE';
        });

        it('when provided the string true in mixed case', function() {
          provided = 'tRuE';
        });

        it('when provided the string 1', function() {
          provided = '1';
        });

        it('when provided the number 1', function() {
          provided = 1;
        });
      });

      describe('false', function() {
        var provided, actual;

        afterEach(function() {
          actual = TypeUtil.getBoolean(provided);
          self.expect(actual).toBeFalse();
        });

        it('when provided the boolean false', function() {
          provided = false;
        });

        it('when provided the string false', function() {
          provided = 'false';
        });

        it('when provided the string FALSE', function() {
          provided = 'FALSE';
        });

        it('when provided the string false in mixed case', function() {
          provided = 'fAlSe';
        });

        it('when provided the string 0', function() {
          provided = '0';
        });

        it('when provided the number 0', function() {
          provided = 0;
        });
      });
    });
  });
});
