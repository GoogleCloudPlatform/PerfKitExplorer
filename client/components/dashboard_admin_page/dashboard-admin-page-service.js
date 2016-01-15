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
 * @fileoverview Service for state and content of the Dashboard Admin page.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageService');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const dashboardDataService = explorer.components.dashboard.DashboardDataService;
const PageModel = explorer.components.dashboard_admin_page.DashboardAdminPageModel;
const DashboardModel = explorer.components.dashboard.DashboardModel;


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
   * The selection service is initialized in the gridOptions onRegisterApi.
   * @export @type {Array.<uiGridSelectionService>}
   */
  this.selection = null;

  /** @private {DashboardDataService} */
  this.dashboardDataService_ = dashboardDataService;

  /** @export @type {!string} */
  this.CURRENT_USER_ADMIN = goog.global['CURRENT_USER_ADMIN'];

  /** @export {!boolean} */
  this.isLoading = false;

  /**
   * @type {!DashboardAdminPageModel}
   * @export
   */
  this.model = new PageModel();
};
const DashboardAdminPageService = explorer.components.dashboard_admin_page.DashboardAdminPageService;


/**
 * Retrieves a list of dashboards
 * @export
 */
DashboardAdminPageService.prototype.listDashboards = function() {
  this.selection && this.selection.clearSelectedRows();

  let promise = this.dashboardDataService_.list(
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
  let dashboard = new DashboardModel();
  dashboard.id = dashboardJson.id;
  dashboard.title = dashboardJson.title;
  dashboard.owner = dashboardJson.owner;

  dashboard.created_by = dashboardJson.created_by;
  if (dashboardJson.created_date) {
    dashboard.created_date = new Date(dashboardJson.created_date);
  }

  dashboard.modified_by = dashboardJson.modified_by;
  if (dashboardJson.modified_date) {
    dashboard.modified_date = new Date(dashboardJson.modified_date);
  }

  console.log(dashboard);
  this.dashboards.push(dashboard);
};


});  // goog.scope
