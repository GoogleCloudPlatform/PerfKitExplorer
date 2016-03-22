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

goog.provide('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigService');

goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const CloudsqlConfigModel = explorer.ext.cloudsql.CloudsqlConfigModel;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;



/**
 * Service that provides model access for the Explorer page at the top-level.
 * @param {!angular.$http} $http
 * @param {!angular.$location} $location
 * @constructor
 * @ngInject
 */
explorer.ext.cloudsql.CloudsqlConfigService = function($http, $location,
    errorService) {
  /** @private {!angular.$http} */
  this.http_ = $http;

  /** @private {!angular.$location} */
  this.location_ = $location;

  /** @private {!ErrorService} */
  this.errorSvc_ = errorService;

  /** @export {!CloudsqlConfigModel} */
  this.config = new CloudsqlConfigModel();

  if (goog.global['CURRENT_USER_ADMIN']) {
    this.refresh();
  }
};
const CloudsqlConfigService = explorer.ext.cloudsql.CloudsqlConfigService;


/**
 * Sets properties based on the JSON data received.
 *
 * @param {!Object} data A JSON object containing config data.
 */
CloudsqlConfigService.prototype.populate = function(data) {
  if (goog.isDef(data.username)) {
    this.config.username = data.username;
  }

  if (goog.isDef(data.password)) {
    this.config.password = data.password;
  }
};


/**
 * Provides a copy of the object as JSON.
 *
 * @return {!Object} A JSON representation of the config properties.
 */
CloudsqlConfigService.prototype.toJSON = function() {
  let result = {};

  result.username = this.config.username;
  result.password = this.config.password;

  return result;
};


/**
 * Reloads the global config from the server.
 */
CloudsqlConfigService.prototype.refresh = function() {
  let promise = this.http_.get('/cloudsql/config');

  promise.then(
      angular.bind(this, function(config) {
        this.populate(config.data);
      })
  );
};


/**
 * Updates the global config on the server.
 */
CloudsqlConfigService.prototype.update = function() {
  let promise = this.http_.post('/cloudsql/config', this.toJSON());

  promise.then(angular.bind(this, function() {
    this.errorSvc_.addError(ErrorTypes.INFO, 'Cloudsql config updated.');
  }));
};


});  // goog.scope
