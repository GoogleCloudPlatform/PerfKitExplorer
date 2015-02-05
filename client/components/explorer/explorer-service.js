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
 * @fileoverview Service for state and content of the Explorer page as a whole.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerService');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerModel');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('goog.array');
goog.require('goog.asserts');



goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ArrayUtilService = explorer.components.util.ArrayUtilService;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var DashboardService = explorer.components.dashboard.DashboardService;
var ErrorService = explorer.components.error.ErrorService;
var ExplorerModel = explorer.components.explorer.ExplorerModel;



/**
 * Service that provides model access for the Explorer page at the top-level.
 * @param {!ArrayUtilService} arrayUtilService
 * @param {!DashboardDataService} dashboardDataService
 * @param {!DashboardService} dashboardService
 * @param {!Angular.LocationService} $location
 * @constructor
 * @ngInject
 */
explorer.components.explorer.ExplorerService = function(
    arrayUtilService, dashboardDataService, dashboardService, errorService,
    $location) {
  /**
   * @type {!ArrayUtilService}
   * @private
   */
  this.arrayUtilService_ = arrayUtilService;

  /**
   * @type {!DashboardDataService}
   * @private
   */
  this.dashboardDataService_ = dashboardDataService;

  /** @private */
  this.location_ = $location;

  /**
   * @type {!ErrorService}
   * @export
   */
  this.errorService = errorService;

  /**
   * @type {!boolean}
   * @export
   */
  this.dashboardsLoading = false;

  /** @type {DashboardService}
   *  @export
   */
  this.dashboard = dashboardService;

  /**
   * @type {!ExplorerModel}
   * @export
   */
  this.model = new ExplorerModel();

  /**
   * @type {!string}
   * @export
   */
  this.CURRENT_USER_ADMIN = CURRENT_USER_ADMIN;

  /**
   * @type {Array.<*>}
   * @export
   */
  this.errors = [];

  this.initExplorer();
};
var ExplorerService = explorer.components.explorer.ExplorerService;


/**
 * Initializes the service.
 */
ExplorerService.prototype.initExplorer = function() {
  if (this.location_.search().readOnly == 'true') {
    this.model.readOnly = true;
  }

  if (this.location_.search().logStatistics == 'true') {
    this.model.logStatistics = true;
  }

  if (this.location_.search().hideToolbar == 'true') {
    this.model.hideToolbar = true;
  }
};


/**
 * Retrieves a list of dashboards
 * @export
 */
ExplorerService.prototype.listDashboards = function() {
  var promise = this.dashboardDataService_.list(true);
  this.dashboardsLoading = true;

  promise.then(angular.bind(this, function(response) {
    this.dashboardsLoading = false;
    this.model.dashboards.slice(
        0, this.model.dashboards.length);

    if (response['data']) {
      goog.array.forEach(
          response['data'], goog.bind(function(dashboardJson) {
            var dashboard = new DashboardModel();
            dashboard.id = dashboardJson.id;
            dashboard.title = dashboardJson.title;

            this.model.dashboards.push(dashboard);
          }, this));
    } else {
      this.dashboardsLoading = false;
      this.errors.push('listDashboards() failed: No data returned.');
    }
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.dashboardsLoading = false;
    this.errors.push(error.message);
  }));
};


/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.customizeSql = function(rewrite) {
  if (!rewrite === true) {
    rewrite = false;
  }

  var widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }
  this.dashboard.customizeSql(widget, rewrite);
  this.model.readOnly = false;
  this.model.code_editor.isOpen = true;

  this.model.code_editor.selectedMode = 'SQL';
};


/**
 * Shows the JSON editor for the selected widget.
 * @export
 */
ExplorerService.prototype.editJson = function() {
  var widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = 'JSON';
};


/**
 * Shows the SQL editor.
 * @export
 */
ExplorerService.prototype.viewSql = function(rewrite) {
  var widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  if (rewrite === true) {
    this.dashboard.rewriteQuery(widget);
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = 'SQL';
};


/**
 * Hides the SQL editor.
 * @export
 */
ExplorerService.prototype.hideSql = function() {
  this.model.code_editor.isOpen = false;
};


/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.editDashboard = function() {
  var widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = 'SQL';
};


/**
 * Displays the log.
 * @export
 */
ExplorerService.prototype.showLog = function() {
  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = 'LOG';
};


ExplorerService.prototype.unselectWidget = function() {
  this.dashboard.unselectWidget();

  if (this.model.code_editor.selectedMode !== 'LOG') {
    this.model.code_editor.isOpen = false;
  }
};

/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.restoreBuilder = function() {
  var widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }
  if (!widget.model.datasource) {
    throw new Error('Selected widget doesn\'t have a datasource property.');
  }

  if (widget.model.datasource.query) {
    var msg = (
        'Restoring the Query Builder will remove any custom SQL you have ' +
        'provided.  Do you want to continue?');
    if (!window.confirm(msg)) { return; }
  }

  this.dashboard.restoreBuilder(widget);
};


});  // goog.scope
