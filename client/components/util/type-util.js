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
 * @fileoverview typeUtil is a javascript library to deal with type conversion.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.util.TypeUtil');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;



/**
 * See class description for an overview.
 *
 * @export
 */
explorer.components.util.TypeUtil = class {
  constructor() {}

  /**
   * Returns true, false or null based on the provided value.
   *
   * True is returned for the boolean true, a string 'true' (in any case),
   * or the number 1.  False is returned for the boolean false, a string
   * 'false' (in any case), or the number 0.  If null or undefined is provided,
   * null is returned, and any other value will throw an error.
   *
   * @param {string|number|boolean} value The value to evaluate.
   * @return {?boolean} A boolean representation of the provided value, or
   *     null if a null/undefined value was provided.
   */
  static getBoolean(value) {
    if (!goog.isDefAndNotNull(value)) {
      return null;
    }

    if (goog.isBoolean(value)) {
      return value;
    }

    let validTrueStrings = ['true', '1'];
    let validFalseStrings = ['false', '0'];

    if (goog.isString(value)) {
      value = value.toLowerCase();

      if (validTrueStrings.indexOf(value) > -1) {
        return true;
      }

      if (validFalseStrings.indexOf(value) > -1) {
        return false;
      }
    }

    if (goog.isNumber(value)) {
      if (value === 1) {
        return true;
      }

      if (value === 0) {
        return false;
      }
    }

    throw('getBoolean failed: ' + value.toString() + ' is not a valid value.');
  };

  /**
   * Returns true if the provided value can be evaluated to true, otherwise false.
   *
   * True is returned for the boolean true, a string 'true' (in any case),
   * or the number 1.  False is returned for any other value, or no value.
   *
   * @param {string|number|boolean} value The value to evaluate.
   * @return {boolean} True if the provided value evaluates to true, otherwise false.
   */
  static isTruthy(value) {
    return (this.getBoolean(value) === true);
  };

  /**
   * Returns true if the provided value can be evaluated to false, otherwise false.
   *
   * True is returned for the boolean false, a string 'false' (in any case),
   * or the number 0.  False is returned for any other value, or no value.
   *
   * @param {string|number|boolean} value The value to evaluate.
   * @return {boolean} True if the provided value evaluates to false, otherwise false.
   */
  static isFalsy(value) {
    return (this.getBoolean(value) === false);
  };
};
const TypeUtil = explorer.components.util.TypeUtil;

});  // goog.scope
