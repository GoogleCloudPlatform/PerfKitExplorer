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
 * @fileoverview Contains definitions for useful filters.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.util.GetByPropertyFilter');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * GetByPropertyFilter returns an item from a collection where the specified
 * property matches the specified value.
 *
 * @param {!string} property_name
 * @param {!*} property_value
 * @param {!Array<*>} collection
 *
 * @return {bool}
 */
explorer.components.util.GetByPropertyFilter = function(
    property_name, property_value, collection) {
  for (let i = 0, len = collection.length; i < len; i++) {
    if (collection[i][property_name] === property_value) {
      return collection[i];
    }
  }
  return null;
};

});  // goog.scope
