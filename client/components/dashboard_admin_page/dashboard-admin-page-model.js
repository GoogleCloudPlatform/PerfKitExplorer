/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model definition for a dashboard. Dashboards are
 * retrieved in the JSON format from a REST service (see DashboardDataService).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;



/** @constructor */
explorer.components.dashboard_admin_page.DashboardAdminPageModel = function() {
  /**
   * @type {bool}
   * @expose
   */
  this.filter_owner = false;

  /**
   * @type {?string}
   * @expose
   */
  this.owner = null;

  /**
   * @type {?bool}
   * @expose
   */
  this.mine = null;
};
var DashboardAdminPageModel = (
    explorer.components.dashboard_admin_page.DashboardAdminPageModel);

});  // goog.scope
