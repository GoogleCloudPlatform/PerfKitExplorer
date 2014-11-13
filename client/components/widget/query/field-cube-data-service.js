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
 * @fileoverview fieldCubeDataService is an angular service used to fetch and
 * cache data from the field metadata cube.  See go/perfkit-cubes for cube
 * design and intent.  It requests data from a REST service (/data/fields,
 * backed by the GAE handler p3rf.perfkit.explorer.data).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.FieldCubeDataService');

goog.require('p3rf.perfkit.explorer.dateUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.PicklistModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');
goog.require('goog.Uri');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var dateUtil = explorer.dateUtil;
var PicklistModel = explorer.models.perfkit_simple_builder.PicklistModel;
var QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.$http} $http
 * @param {!angular.$q} $q
 * @constructor
 * @ngInject
 */
explorer.components.widget.query.FieldCubeDataService = function($http, $q) {
  /**
   * @type {!angular.$http}
   * @private
   */
  this.http_ = $http;

  /**
   * @type {!angular.$q}
   * @private
   */
  this.q_ = $q;
};
var FieldCubeDataService = (
    explorer.components.widget.query.FieldCubeDataService);


/**
 * Returns a list of fields or metadata, depending on the field_name.
 * @param {string} field_name The name of the field to list.
 * @param {QueryFilterModel} filters The filters to apply to the returned list
 *     of fields or metadata.
 * @return {angular.$q.Promise.<PicklistModel>} An object containing the list
 *     of fields or metadata.
 */
FieldCubeDataService.prototype.list = function(field_name, filters) {
  switch (field_name) {
    case 'metadata':
      return this.listMetadata(field_name, filters);
    default:
      return this.listFields(field_name, filters);
  }
};


/**
 * Returns a PicklistModel based on cube data and a set of filters.
 * @param {string} field_name The field name that autocomplete entries are
 *     listed for.
 * @param {!QueryFilterModel} filters The current filters.
 * @return {angular.$q.Promise.<PicklistModel>}
 */
FieldCubeDataService.prototype.listFields = function(field_name, filters) {
  var deferred = this.q_.defer();

  var query_parameters = {
    field_name: field_name,
    filters: filters
  };

  var promise = this.http_.get('/data/fields', {
    params: query_parameters,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });

  promise.then(angular.bind(this, function(response) {
    var data = response['data']['rows'];
    deferred.resolve(data);
  }));

  promise.then(null, angular.bind(this, function(error) {
    deferred.reject(error);
  }));

  return deferred.promise;
};


/**
 * Returns a PicklistModel based on cube data and a set of filters.
 * @param {string} field_name The field name that autocomplete entries are
 *     listed for.
 * @param {!QueryFilterModel} filters The current filters.
 * @return {angular.$q.Promise.<PicklistModel>}
 */
FieldCubeDataService.prototype.listMetadata = function(field_name, filters) {
  var deferred = this.q_.defer();

  var query_parameters = {
    field_name: field_name,
    filters: filters
  };

  var promise = this.http_.get('/data/metadata', {
    params: query_parameters,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });

  promise.then(angular.bind(this, function(response) {
    var data = response['data']['labels'];
    deferred.resolve(data);
  }));

  promise.then(null, angular.bind(this, function(error) {
    deferred.reject(error);
  }));

  return deferred.promise;
};



});  // goog.scope
