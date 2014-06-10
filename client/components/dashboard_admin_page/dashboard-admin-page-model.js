/**
 * @fileoverview Model definition for a dashboard. Dashboards are
 * retrieved in the JSON format from a REST service (see DashboardDataService).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



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
