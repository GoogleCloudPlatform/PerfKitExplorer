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
   * @type {?string}
   * @expose
   */
  this.type = 'dashboard';

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
