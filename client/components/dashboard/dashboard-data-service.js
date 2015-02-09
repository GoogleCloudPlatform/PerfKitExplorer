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
 * @fileoverview dashboardDataService is an angular service used to fetch,
 * cache, create, update and delete the persisted data of a dashboard
 * given a user, topology (product/test/metric) or specific dashboard
 * URI/ID. It requests data from a REST service (/data/dashboard, backed by the
 * GAE handler p3rf.perfkit.explorer.data).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('goog.Uri');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
var ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
var DashboardConfig = explorer.components.dashboard.DashboardConfig;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var ErrorService = explorer.components.error.ErrorService;
var ErrorTypes = explorer.components.error.ErrorTypes;
var WidgetConfig = explorer.models.WidgetConfig;
var WidgetType = explorer.models.WidgetType;
var WidgetFactoryService = explorer.components.widget.WidgetFactoryService;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.$http} $http
 * @param {!angular.$cacheFactory} $cacheFactory
 * @param {!angular.$q} $q
 * @param {!WidgetFactoryService} widgetFactoryService
 * @constructor
 * @ngInject
 */
explorer.components.dashboard.DashboardDataService = function(
    errorService, $http, $cacheFactory, $q, widgetFactoryService) {
  /**
   * @type {!angular.$http}
   * @private
   */
  this.http_ = $http;

  /**
   * @type {!ErrorService}
   * @private
   */
  this.errorService_ = errorService;

  /**
   * @type {!Object}
   * @private
   */
  this.cache_ = $cacheFactory('dashboardDataServiceCache', {capacity: 10});

  /**
   * @type {!angular.$q}
   * @private
   */
  this.q_ = $q;

  /**
   * @type {!WidgetFactoryService}
   * @private
   */
  this.widgetFactoryService_ = widgetFactoryService;
};
var DashboardDataService = explorer.components.dashboard.DashboardDataService;


/**
 * Sends a POST request to the server at the given endpoint with a optional
 * content.
 * TODO (joemu): Factor this out to a helper function.
 * @param {!string} endpoint
 * @param {?*=} opt_queryData An object to send encoded in the query string.
 * @param {?goog.uri.QueryData=} opt_postData An object to send as posted data.
 * @return {angular.$q.Promise.<*>} A promise representing the POST request.
 */
DashboardDataService.prototype.post = function(
    endpoint, opt_queryData, opt_postData) {
  var deferred = this.q_.defer();

  var promise = this.http_.post(
      endpoint,
      opt_postData && opt_postData.toString(), {
        params: opt_queryData || null,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });

  promise.then(angular.bind(this, function(response) {
    deferred.resolve(response);
  }));
  promise.then(null, angular.bind(this, function(error) {
    deferred.reject(error);
  }));

  return deferred.promise;
};


/**
 * Sends a POST request to the server at the given endpoint with a optional
 * content.
 * @param {?DashboardConfig} content
 * @param {!string} endpoint
 * @param {string=} opt_id
 * @return {angular.$q.Promise.<DashboardModel>} Dashboard with an id.
 */
DashboardDataService.prototype.postDashboard = function(content, endpoint,
    opt_id) {
  var deferred = this.q_.defer();
  var json = content && this.widgetFactoryService_.toJson(content);

  var postData = new goog.Uri.QueryData();

  if (json) {
    postData.add('data', json);
  }

  var queryData;
  if (opt_id) {
    queryData = {id: opt_id};
  }

  var promise = this.post(endpoint, queryData, postData);

  promise.then(angular.bind(this, function(response) {
    var data = response.data;
    deferred.resolve(data);
  }));
  promise.then(null, angular.bind(this, function(error) {
    if (error.data && error.data.message) {
      this.errorService_.addError(ErrorTypes.DANGER, error.data.message, opt_id);
    }

    deferred.reject(error);
  }));

  return deferred.promise;
};


/**
 * Persists the given dashboard on the server and returns it with the
 * modifications applied by the server (the server adds an id to the dashboard
 * and could do other modifications in the future).
 *
 * @param {!DashboardConfig} dashboardConfig
 * @return {angular.$q.Promise.<DashboardModel>} Dashboard with an id.
 */
DashboardDataService.prototype.create = function(dashboardConfig) {
  return this.postDashboard(dashboardConfig, '/dashboard/create');
};


/**
 * Updates the given dashboard on the server based on its id.
 *
 * @param {!DashboardConfig} dashboardConfig
 * @return {!angular.$q.Promise}
 */
DashboardDataService.prototype.update = function(dashboardConfig) {
  var dashboardId = dashboardConfig.model.id;
  return this.postDashboard(dashboardConfig, '/dashboard/edit', dashboardId);
};


/**
 * Deletes the given dashboard on the server based on its id.
 *
 * @param {!number} dashboard_id
 * @return {!angular.$q.Promise}
 */
DashboardDataService.prototype.delete = function(dashboard_id) {
  return this.post('/dashboard/delete', {id: dashboard_id}, null);
};


/**
 * Creates a copy of the dashboard, with an optional new name.
 *
 * @param {!number} dashboard_id
 * @param {?string=} opt_title The name of the new dashboard.  If omitted,
 *     will have the same name as the original.
 * @return {!angular.$q.Promise}
 */
DashboardDataService.prototype.copy = function(dashboard_id, opt_title) {
  return this.post(
      '/dashboard/copy', {id: dashboard_id, title: opt_title}, null);
};


/**
 * Changes the name of a dashboard.
 *
 * @param {!number} dashboard_id
 * @param {!string} title The title of the new dashboard.  If omitted, will
 *     have the same title as the original.
 * @return {!angular.$q.Promise}
 */
DashboardDataService.prototype.rename = function(dashboard_id, title) {
  return this.post(
      '/dashboard/rename', {id: dashboard_id, title: title}, null);
};


/**
 * Transfers a dashboard to a new owner, based on the provided email address.
 *
 * @param {!number} dashboard_id
 * @param {!string} new_owner_email The email address of the new owner.  If
 *     the email address cannot be resolved, no change will take place.
 * @return {!angular.$q.Promise}
 */
DashboardDataService.prototype.editOwner = function(
    dashboard_id, new_owner_email) {
  return this.post(
      '/dashboard/edit-owner',
      {id: dashboard_id, email: new_owner_email}, null);
};


/**
 * Returns a list of dashboards.
 *
 * @param {bool=} opt_mine If true, limits the list to items owned by the
 *     current user.  This setting is not useful is opt_owner is specified.
 * @param {string=} opt_owner If provided, limits the list to dashboards owned
 *     by the provided email address.
 *
 * @return {!angular.$q.Promise}
 */
DashboardDataService.prototype.list = function(opt_mine, opt_owner) {
  var deferred = this.q_.defer();

  var queryData = {
    'owner': opt_owner || null,
    'mine': opt_mine || null
  };
  var promise = this.post('/dashboard/list', queryData, null);

  promise.then(angular.bind(this, function(response) {
    var data = response.data;
    deferred.resolve(data);
  }));
  promise.then(null, angular.bind(this, function(error) {
    deferred.reject(error);
  }));

  return deferred.promise;
};


/**
 * Fetches and caches the persisted model of a dashboard.
 *
 * @param {string} dashboardId
 * @return {angular.$q.Promise.<DashboardModel>}
 */
DashboardDataService.prototype.fetchDashboardJsonModel = function(dashboardId) {
  var deferred = this.q_.defer();
  var cacheKey = dashboardId;
  var cachedData = this.cache_.get(cacheKey);

  if (cachedData) {
    deferred.resolve(cachedData);
  } else {
    var endpoint = '/dashboard/view';
    var queryParameters = { id: dashboardId };
    var promise = this.http_.get(endpoint, { params: queryParameters });

    promise.then(angular.bind(this, function(response) {
      var data = response.data;
      this.cache_.put(cacheKey, data);
      deferred.resolve(data);
    }));
    promise.then(null, angular.bind(this, function(error) {
      if (error.data && error.data.message) {
        this.errorService_.addError(ErrorTypes.DANGER, error.data.message, dashboardId);
      }
      deferred.reject(error);
    }));
  }
  return deferred.promise;
};


/**
 * Fetches and parse a dashboard.
 *
 * @param {string} dashboardId
 * @return {angular.$q.Promise.<DashboardConfig>}
 */
DashboardDataService.prototype.fetchDashboard = function(dashboardId) {
  var deferred = this.q_.defer();
  var promise = this.fetchDashboardJsonModel(dashboardId);

  promise.then(angular.bind(this, function(dashboardJsonModel) {
    var dashboard =
        this.widgetFactoryService_.toDashboardConfig(dashboardJsonModel);
    deferred.resolve(dashboard);
  }));
  promise.then(null, angular.bind(this, function(error) {
    deferred.reject(error);
  }));

  return deferred.promise;
};

});  // goog.scope
