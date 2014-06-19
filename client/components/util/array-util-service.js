/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
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
