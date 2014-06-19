/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview DashboardCtrl is an angular controller used to initialize
 * the dashboard, fetch the dashboard's widgets configuration and expose
 * the dashboard's properties to the scope.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.dashboard.DashboardCtrl');

goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.dashkit.explorer.components.widget.WidgetFactoryService');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var DashboardDataService = explorer.components.dashboard.DashboardDataService;
var DashboardService = explorer.components.dashboard.DashboardService;
var WidgetFactoryService = explorer.components.widget.WidgetFactoryService;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.$location} $location
 * @param {DashboardDataService} dashboardDataService
 * @param {DashboardService} dashboardService
 * @param {!WidgetFactoryService} widgetFactoryService
 * @constructor
 * @ngInject
 */
explorer.components.dashboard.DashboardCtrl = function($scope,
    $location, dashboardDataService, dashboardService, widgetFactoryService) {
  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /**
   * @type {!angular.$location}
   * @private
   */
  this.location_ = $location;

  /**
   * @type {DashboardDataService}
   * @private
   */
  this.dashboardDataService_ = dashboardDataService;

  /**
   * @type {!WidgetFactoryService}
   * @private
   */
  this.widgetFactoryService_ = widgetFactoryService;

  /**
   * @type {DashboardService}
   * @export
   */
  this.dashboard = dashboardService;

  /**
   * Error messages raised by this controller.
   *
   * @type {Array.<string>}
   * @export
   */
  this.errors = [];

  /**
   * @type {boolean}
   * @export
   */
  this.dashboardIsLoading = false;

  this.initDashboard();
};
var DashboardCtrl = explorer.components.dashboard.DashboardCtrl;


/**
 * Looks for a dashboard id in the url. If found, it fetches it, else, it
 * creates a new dashboard with one container and one widget.
 * @export
 */
DashboardCtrl.prototype.initDashboard = function() {
  var dashboardId = this.location_.search().dashboard;
  if (dashboardId) {
    this.fetchDashboard(dashboardId);
  } else {
    this.dashboard.addContainer();
  }
};


/**
 * Saves the current dashboard on the server.
 * @export
 */
DashboardCtrl.prototype.saveDashboard = function() {
  this.dashboard.save();
};


/**
 * Fetches a dashboard and puts it in the scope.
 * @param {string} dashboardId
 * @export
 */
DashboardCtrl.prototype.fetchDashboard = function(dashboardId) {
  var promise = this.dashboardDataService_.fetchDashboard(dashboardId);
  this.dashboardIsLoading = true;

  promise.then(angular.bind(this, function(dashboardConfig) {
    this.dashboardIsLoading = false;
    this.dashboard.setDashboard(dashboardConfig);
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.dashboardIsLoading = false;
    this.errors.push(error.message);
  }));
};

});  // goog.scope
