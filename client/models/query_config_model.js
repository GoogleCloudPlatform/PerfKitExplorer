/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model definition for a BigQuery query against Perfkit samples
 * data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.models.IQueryConfigModel');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;



/** @interface */
explorer.models.IQueryConfigModel = function() {};
var IQueryConfigModel = explorer.models.IQueryConfigModel;


/**
 * Returns a JSON object that represents the query's settings.
 * @return {object}
 */
IQueryConfigModel.prototype.getConfig = function() {};


/**
 * Sets the query's configuration based on values in a JSON config.
 * @param {object} config A JSON object that represents the query's settings.
 */
IQueryConfigModel.prototype.setConfig = function(config) {};


});  // goog.scope
