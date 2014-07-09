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

goog.provide('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageService');

goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * Service that provides model access for the Explorer page at the top-level.
 * @constructor
 * @ngInject
 */
explorer.components.dashboard_admin_page.DashboardAdminPageService = function(
    ) {
  this.errors = new ErrorModel();
  this.model = new PageModel();
};
var DashboardAdminPageService = explorer.components.dashboard_admin_page.DashboardAdminPageService;


/**
 * Initializes the service.
 */
DashboardAdminPageService.prototype.copyDashboard = function(dashboard) {
  var promise = this.dashboardDataService.copy(
      this.data.selectedItems[0].id, title);

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error.message);
  }));
};


DashboardAdminPageService.prototype.editDashboardOwner = function(dashboard, owner) {
  var promise = this.dashboardDataService.editOwner(
      dashboard.id, owner);

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error.message);
  }));
}

});  // goog.scope
