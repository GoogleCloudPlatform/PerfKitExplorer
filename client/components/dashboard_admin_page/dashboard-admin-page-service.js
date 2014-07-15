/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Service for state and content of the Dashboard Admin page.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageService');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var dashboardDataService = explorer.components.dashboard.DashboardDataService;
var PageModel = explorer.components.dashboard_admin_page.DashboardAdminPageModel;
var DashboardModel = explorer.components.dashboard.DashboardModel;


/**
 * Service that provides model access for the Explorer page at the top-level.
 *
 * @constructor
 * @ngInject
 */
explorer.components.dashboard_admin_page.DashboardAdminPageService = function(
    dashboardDataService) {
  /**
   * @type {Array.<!DashboardModel>}
   * @export
   */
  this.dashboards = [];

  /** @export {Array.<!string>} */
  this.errors = [];

  /**
   * @type {Array.<!DashboardModel>}
   * @export
   */
  this.selectedDashboards = [];

  /** @private {DashboardDataService} */
  this.dashboardDataService_ = dashboardDataService;

  /** @export {!boolean} */
  this.isLoading = false;

  /**
   * @type {!DashboardAdminPageModel}
   * @export
   */
  this.model = new PageModel();
};
var DashboardAdminPageService = explorer.components.dashboard_admin_page.DashboardAdminPageService;


/**
 * Retrieves a list of dashboards
 * @export
 */
DashboardAdminPageService.prototype.listDashboards = function() {
  while (this.selectedDashboards.length > 0) {
    this.selectedDashboards.pop();
  }

  var promise = this.dashboardDataService_.list(
      this.model.mine, this.model.owner);
  this.isLoading = true;

  promise.then(angular.bind(this, function(response) {
    this.isLoading = false;
    this.dashboards = [];
    goog.array.forEach(
        response['data'], angular.bind(this, function(dashboardJson) {
          this.addDashboard(dashboardJson);
        }));
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.isLoading = false;
    this.errors.push(error.message);
  }));
};


/**
 * Adds a dashboard to the current list of dashboards based on a JSON definition.
 * @param dashboardJson
 * @export
 */
DashboardAdminPageService.prototype.addDashboard = function(dashboardJson) {
  var dashboard = new DashboardModel();
  dashboard.id = dashboardJson.id;
  dashboard.title = dashboardJson.title;
  dashboard.owner = dashboardJson.owner;

  this.dashboards.push(dashboard);
};


});  // goog.scope
