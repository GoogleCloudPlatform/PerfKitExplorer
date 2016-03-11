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
 * @fileoverview arrayUtilService is an angular service that provide useful
 * functions to work with arrays.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.util.ArrayUtilService');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @constructor
 * @ngInject
 */
explorer.components.util.ArrayUtilService = function() {};
const ArrayUtilService = explorer.components.util.ArrayUtilService;


/**
 * Swaps the elements at the given indexes.
 *
 * @param {Array} array
 * @param {number} from
 * @param {number} to
 */
ArrayUtilService.prototype.swap = function(array, from, to) {
  let element = array[from];
  array[from] = array[to];
  array[to] = element;
};


/**
 * Returns the first non-null item in the array.
 * @param {Array.<*>} array
 * @param {boolean=} opt_required If true, an error will be thrown if no item is found.
 *    Defaults to false.
 * @returns {*} The first non-null element in the array.  If no item is found,
 *    either null is returned or an error is raised, depending on the value of
 *    the required param.
 */
ArrayUtilService.prototype.getFirst = function(array, opt_required) {
  for (let ctr = 0, len = array.length; ctr < len; ++ctr) {
    if (!goog.string.isEmptySafe(array[ctr])) {
      return array[ctr];
    }
  }

  if (opt_required) {
    let msg = 'getFirst failed: No non-null item found.';

    throw new Error(msg);
  } else {
    return null;
  }
};


/**
 * Inserts a value into the array before the provided one.
 * @param {Array.<*>} array
 * @param {*} value
 * @param {*} beforeValue
 */
ArrayUtilService.prototype.insertBefore = function(
    array, value, beforeValue) {
  let index = array.indexOf(beforeValue);

  if (index < 1) {
    this.insertAt(array, value, 0);
  } else {
    this.insertAt(array, value, index);
  }
};


/**
 * Inserts a value into the array after the provided one.
 * @param {Array.<*>} array
 * @param {*} value
 * @param {*} afterValue
 */
ArrayUtilService.prototype.insertAfter = function(
    array, value, afterValue) {
  let index = array.indexOf(afterValue);

  if ((index === -1) || (index === (array.length - 1))) {
    array.push(value);
  } else {
    this.insertAt(array, value, ++index);
  }
};


/**
 * Returns the indexOf the provided value in array.
 * Throws an error if not found.
 * @param {Array.<*>} array
 * @param {*} value
 * @return {number}
 */
ArrayUtilService.prototype.getIndex = function(
    array, value) {
  let index = array.indexOf(value);

  if (index === -1) {
    throw new Error(
        'getIndex failed: value \'' + value + '\' not found in array.');
  }

  return index;
};


/**
 * Moves the provided value to the previous position.
 * @param {Array.<*>} array
 * @param {*} value
 */
ArrayUtilService.prototype.movePrevious = function(
    array, value) {
  let index = this.getIndex(array, value);

  if (index === 0) {
    return;
  }

  goog.array.moveItem(array, index, --index);
};


/**
 * Moves the provided value to the next position.
 * @param {Array.<*>} array
 * @param {*} value
 */
ArrayUtilService.prototype.moveNext = function(
    array, value) {
  let index = this.getIndex(array, value);

  if (index === (array.length - 1)) {
    return;
  }

  goog.array.moveItem(array, index, ++index);
};


/**
 * Moves the provided value to the first position.
 * @param {Array.<*>} array
 * @param {*} value
 */
ArrayUtilService.prototype.moveFirst = function(
    array, value) {
  let index = this.getIndex(array, value);

  if ((index === 0) || (array.length == 1)) {
    return;
  }

  goog.array.moveItem(array, index, 0);
};


/**
 * Moves the provided value to the last position.
 * @param {Array.<*>} array
 * @param {*} value
 */
ArrayUtilService.prototype.moveLast = function(
    array, value) {
  let index = this.getIndex(array, value);
  let lastIndex = array.length - 1;

  if ((index === lastIndex) ||
      (array.length == 1)) {
    return;
  }

  goog.array.moveItem(array, index, lastIndex);
};


/**
 * Inserts a value into the array at the specified index.
 * @param {Array.<*>} array
 * @param {*} value
 * @param {number} index
 */
ArrayUtilService.prototype.insertAt = function(
    array, value, index) {
  goog.array.insertAt(array, value, index);
};


/**
 * Removes a value from the array.
 * @param {Array.<*>} array
 * @param {*} value
 */
ArrayUtilService.prototype.remove = function(array, value) {
  let index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }
};


/**
 * Returns a dictionary of items from the provided object array.
 * @param {Array.<Object>} array
 * @param {string} key The key property is read from the object
 *     to serve as the key for the dictionary.
 * @return {Object.<*, *>}
 */
ArrayUtilService.prototype.getDictionary = function(array, key) {
  let dict = {};

  if (!goog.isArray(array)) {
    throw new Error(
        'arrayUtilService.getDictionary failed: array parameter ' +
        'must be a valid array');
  }

  array.forEach(item => {
    if (!goog.isObject(item)) {
      throw new Error(
        'arrayUtilService.getDictionary failed: array must be a ' +
        'list of indexable objects');
    }

    if (goog.isDefAndNotNull(item[key])) {
      if (goog.isDef(dict[item[key]])) {
        throw new Error(
          'arrayUtilService.getDictionary failed: key ' +
          key + ' already exists in the array');
      }

      dict[item[key]] = item;
    } else {
      throw new Error(
        'arrayUtilService.getDictionary failed: key ' +
        key + ' does not exist');
    }
  });

  return dict;
};

});  // goog.scope
