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
 * @fileoverview Service for the configuration of the Explorer app.
 *
 * The initial settings are loaded from a global let INITIAL_CONFIG.  This
 * is set by the server-side templates when rendering the page, to minimize
 * initial roundtrips. For tests, INITIAL_CONFIG is set in the test/globals.js
 * file.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.config.ConfigService');

goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;



/**
 * Service that provides model access for the Explorer page at the top-level.
 * @param {!angular.HttpService} $http
 * @param {!angular.LocationService} $location
 * @constructor
 * @ngInject
 */
explorer.components.config.ConfigService = function($http, $location,
    errorService) {
  var INITIAL_CONFIG = goog.global['INITIAL_CONFIG'];

  /** @private {!angular.HttpService} */
  this.http_ = $http;

  /** @private {!angular.LocationService} */
  this.location_ = location;

  /** @private {!ErrorService} */
  this.errorSvc_ = errorService;

  /** @export {string} */
  this.default_project = INITIAL_CONFIG.default_project;

  /** @export {string} */
  this.default_dataset = INITIAL_CONFIG.default_dataset;

  /** @export {string} */
  this.default_table = INITIAL_CONFIG.default_table;

  /** @export {string} */
  this.analytics_key = INITIAL_CONFIG.analytics_key;

  /** @export {number} */
  this.cache_duration = INITIAL_CONFIG.cache_duration;

  /** @export {number} */
  this.max_parallel_queries = INITIAL_CONFIG.max_parallel_queries;

  /** @export {boolean} */
  this.grant_view_to_public = INITIAL_CONFIG.grant_view_to_public;

  /** @export {boolean} */
  this.grant_save_to_public = INITIAL_CONFIG.grant_save_to_public;

  /** @export {boolean} */
  this.grant_query_to_public = INITIAL_CONFIG.grant_query_to_public;
};
const ConfigService = explorer.components.config.ConfigService;


/**
 * Sets properties based on the JSON data received.
 *
 * @param {!Object} data A JSON object containing config data.
 */
ConfigService.prototype.populate = function(data) {
  if (goog.isDef(data.default_project)) {
    this.default_project = data.default_project;
  }

  if (goog.isDef(data.default_dataset)) {
    this.default_dataset = data.default_dataset;
  }

  if (goog.isDef(data.default_table)) {
    this.default_table = data.default_table;
  }

  if (goog.isDef(data.analytics_key)) {
    this.analytics_key = data.analytics_key;
  }

  if (goog.isDef(data.cache_duration)) {
    this.cache_duration = data.cache_duration;
  }

  if (goog.isDef(data.max_parallel_queries)) {
    this.max_parallel_queries = data.max_parallel_queries;
  }

  if (goog.isDef(data.grant_view_to_public)) {
    this.grant_view_to_public = data.grant_view_to_public;
  }

  if (goog.isDef(data.grant_save_to_public)) {
    this.grant_save_to_public = data.grant_save_to_public;
  }

  if (goog.isDef(data.grant_query_to_public)) {
    this.grant_query_to_public = data.grant_query_to_public;
  }
};


/**
 * Returns basic configuration for use in tests.
 *
 * It only contains values that are expected to be set to non-default
 * values for typical dashboards. Other values that can remain as
 * defaults should not be included here.
 *
 * The returned object is a fresh copy, so the caller may modify
 * values as needed.
 *
 * @return {!object} A JSON object containing config data.
 */
ConfigService.prototype.getConfigForTesting = function() {
  return goog.object.clone({
    'default_project': 'TEST_PROJECT',
    'default_dataset': 'TEST_DATASET',
    'default_table': 'TEST_TABLE',
    'analytics_key': 'TEST_ANALYTICS_KEY'
  });
};


/**
 * Provides a copy of the object as JSON.
 *
 * @param {?Object} data An object that the properties will be applied to.
 * @return {!Object} A JSON representation of the config properties.
 */
ConfigService.prototype.toJSON = function(data) {
  let result = data || {};

  result.default_project = this.default_project;
  result.default_dataset = this.default_dataset;
  result.default_table = this.default_table;
  result.analytics_key = this.analytics_key;
  result.cache_duration = this.cache_duration;
  result.max_parallel_queries = this.max_parallel_queries;
  result.grant_view_to_public = this.grant_view_to_public;
  result.grant_save_to_public = this.grant_save_to_public;
  result.grant_query_to_public = this.grant_query_to_public;

  return result;
};


/**
 * Reloads the global config from the server.
 */
ConfigService.prototype.refresh = function() {
  let promise = this.http_.get('/config');

  promise.then(
      angular.bind(this, function(config) {
        this.populate(config.data);
      })
  );
};


/**
 * Updates the global config on the server.
 */
ConfigService.prototype.update = function() {
  let promise = this.http_.post('/config', this.toJSON());

  promise.then(angular.bind(this, function() {
    this.errorSvc_.addError(ErrorTypes.INFO, 'Global config updated.');
  }));
};


});  // goog.scope
