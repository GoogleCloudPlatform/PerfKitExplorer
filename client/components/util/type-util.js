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
 * Returns true if the provided value can be converted to true.
 * The boolean value 'true', the string 'true' (in any case), or a 1
 * are all acceptable.
 *
 * @constructor
 * @export
 */
explorer.components.util.TypeUtil = class {
  constructor() {}

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

  static isTruthy(value) {
    return (this.getBoolean(value) === true);
  };

  static isFalsy(value) {
    return (this.getBoolean(value) === false);
  };
};
const TypeUtil = explorer.components.util.TypeUtil;

});  // goog.scope
