/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Contains definitions for useful filters.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.util.GetByPropertyFilter');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


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
  for (var i = 0, len = collection.length; i < len; i++) {
    if (collection[i][property_name] === property_value) {
      return collection[i];
    }
  }
  return null;
};

});  // goog.scope
