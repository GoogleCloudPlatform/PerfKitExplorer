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
