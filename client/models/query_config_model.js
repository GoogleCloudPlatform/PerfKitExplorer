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
