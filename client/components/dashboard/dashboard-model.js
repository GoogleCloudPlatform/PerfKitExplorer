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

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardModel');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
var ContainerWidgetModel = explorer.components.container.ContainerWidgetModel;



/** @constructor */
explorer.components.dashboard.DashboardModel = function() {
  /**
   * @type {?string}
   * @expose
   */
  this.id = null;

  /**
   * @type {string}
   * @expose
   */
  this.title = 'Untitled Dashboard';

  /**
   * @type {string}
   * @expose
   */
  this.version = '';

  /**
   * @type {?string}
   * @expose
   */
  this.owner = this.getDefaultOwner();

  /**
   * @type {Array.<!string>}
   * @expose
   */
  this.writers = [];

  /**
   * @type {?string}
   * @expose
   */
  this.type = 'dashboard';

  /**
   * Specifies the project id that the query will connect to.  If not provided, will use the dashboard-level project
   * id, or the app-engine default.
   * @type {?string}
   * @export
   */
  this.project_id = null;

  /**
   * Specifies the dataset that the query will connect to.  If not provided, will use the dashboard-level dataset
   * name, or the app-engine default.
   * @type {?string}
   * @export
   */
  this.dataset_name = null;

  /**
   * Specifies the table that the query will connect to.  If not provided, will use the dashboard-level table name
   * or the app-engine default.
   * @type {?string}
   * @export
   */
  this.table_name = null;

  /**
   * @type {!Array.<(ContainerWidgetConfig|ContainerWidgetModel)>}
   * @expose
   */
  this.children = [];
};
var DashboardModel = explorer.components.dashboard.DashboardModel;


/**
 * Returns the default owner for a dashboard.
 * @return {string} An email address if one exists, otherwise an empty string.
 */
DashboardModel.prototype.getDefaultOwner = function() {
  return CURRENT_USER_EMAIL;
};


/**
 * @constructor
 * @param {(Object|DashboardModel)=} opt_model JSON or WidgetModel.
 */
explorer.components.dashboard.DashboardConfig = function(opt_model) {
  /**
   * The persisted model of the dashboard. It's usually a simple JSON object
   * returned by the server but it respects the DashboardModel class
   * definition.
   *
   * Warning: Do not keep a reference on this property, it can be replaced by
   * an updated JSON at any time. Instead, keep a reference on the
   * DashboardConfig object that contains it.
   *
   * @type {!(Object|DashboardModel)}
   * @expose
   */
  this.model = opt_model || new DashboardModel();
};
var DashboardConfig = explorer.components.dashboard.DashboardConfig;

});  // goog.scope
