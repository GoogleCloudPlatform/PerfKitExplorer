/**
 * @fileoverview Contains definitions for useful filters.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.util.GetByPropertyFilter');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;


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
