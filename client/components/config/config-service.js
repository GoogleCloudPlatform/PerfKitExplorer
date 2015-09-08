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
 * initial roundtrips.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryTablePartitioning');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;
const QueryTablePartitioning = (
    explorer.models.perfkit_simple_builder.QueryTablePartitioning);



/**
 * Service that provides model access for the Explorer page at the top-level.
 * @param {!Angular.HttpService} $location
 * @param {!Angular.LocationService} $location
 * @constructor
 * @ngInject
 */
explorer.components.config.ConfigService = function($http, $location, errorService) {
  /** @private {!Angular.HttpService} */
  this.http_ = $http;

  /** @private {!Angular.LocationService} */
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
  this.field_cube_dataset = INITIAL_CONFIG.field_cube_dataset;

  /** @export {string} */
  this.field_cube_table = INITIAL_CONFIG.field_cube_table;

  /** @export {string} */
  this.analytics_key = INITIAL_CONFIG.analytics_key;

  /** @export {number} */
  this.cache_duration = INITIAL_CONFIG.cache_duration;

  /** @export {string} */
  this.table_partition = INITIAL_CONFIG.table_partition;

  /** @export {boolean} */
  this.create_adminonly = INITIAL_CONFIG.create_adminonly;

  /** @export {boolean} */
  this.view_adminonly = INITIAL_CONFIG.view_adminonly;

  /** @export {string} */
  this.DEFAULT_TABLE_PARTITION = QueryTablePartitioning.ONETABLE;

  /** @export {Array.<!QueryTablePartitioning>} */
  this.TABLE_PARTITIONS = [
    {'partition': QueryTablePartitioning.ONETABLE,
     'label': 'Single Table',
     'tooltip': 'All data is stored in a single table.'},
    {'partition': QueryTablePartitioning.PERDAY,
     'label': 'Table per Day',
     'tooltip': 'Each table represents a day.  Ex: results_20141024.'}
  ];
};
const ConfigService = explorer.components.config.ConfigService;


/**
 * Returns a partition object matching the specified name.
 * @param {string} partitionName
 * @return {Object}
 * @export
 */
ConfigService.prototype.getTablePartition = function(partitionName) {
  return this.filter_('getByProperty')(
      'partition', partitionName, this.TABLE_PARTITIONS);
};


/**
 * Sets properties based on the JSON data received.
 *
 * @param {!object} data A JSON object containing config data.
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

  if (goog.isDef(data.field_cube_dataset)) {
    this.field_cube_dataset = data.field_cube_dataset;
  }

  if (goog.isDef(data.field_cube_table)) {
    this.field_cube_table = data.field_cube_table;
  }

  if (goog.isDef(data.analytics_key)) {
    this.analytics_key = data.analytics_key;
  }

  if (goog.isDef(data.cache_duration)) {
    this.cache_duration = data.cache_duration;
  }

  if (goog.isDef(data.table_partition)) {
    this.table_partition = data.table_partition;
  }

  if (goog.isDef(data.create_adminonly)) {
    this.create_adminonly = data.create_adminonly;
  }

  if (goog.isDef(data.view_adminonly)) {
    this.view_adminonly = data.view_adminonly;
  }
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
  result.field_cube_dataset = this.field_cube_dataset;
  result.field_cube_table = this.field_cube_table;
  result.analytics_key = this.analytics_key;
  result.cache_duration = this.cache_duration;
  result.table_partition = this.table_partition;
  result.create_adminonly = this.create_adminonly;
  result.view_adminonly = this.view_adminonly;

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
