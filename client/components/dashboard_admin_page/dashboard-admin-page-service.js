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

goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardDataService');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var dashboardDataService = explorer.components.dashboard.DashboardDataService;


/**
 * Service that provides model access for the Explorer page at the top-level.
 *
 * @constructor
 * @ngInject
 */
explorer.components.dashboard_admin_page.DashboardAdminPageService = function(
    dashboardDataService) {
};
var DashboardAdminPageService = explorer.components.dashboard_admin_page.DashboardAdminPageService;


/**
 * Initializes the service.
 */
DashboardAdminPageService.prototype.uploadDashboard = function(dashboard) {
};

});  // goog.scope
