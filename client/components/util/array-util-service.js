/**
 * @fileoverview arrayUtilService is an angular service that provide useful
 * functions to work with arrays.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.util.ArrayUtilService');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @constructor
 * @ngInject
 */
explorer.components.util.ArrayUtilService = function() {};
var ArrayUtilService = explorer.components.util.ArrayUtilService;


/**
 * Swaps the elements at the given indexes.
 *
 * @param {Array} array
 * @param {number} from
 * @param {number} to
 */
ArrayUtilService.prototype.swap = function(array, from, to) {
  var element = array[from];
  array[from] = array[to];
  array[to] = element;
};

});  // goog.scope
