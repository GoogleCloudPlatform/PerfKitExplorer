/**
 * @fileoverview Service for state and content of the Explorer page as a whole.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.explorer.ExplorerService');

goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.dashkit.explorer.components.explorer.ExplorerModel');
goog.require('p3rf.dashkit.explorer.components.util.ArrayUtilService');
goog.require('goog.array');
goog.require('goog.asserts');



goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var ArrayUtilService = explorer.components.util.ArrayUtilService;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var DashboardService = explorer.components.dashboard.DashboardService;
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
    arrayUtilService, dashboardDataService, dashboardService, $location) {
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
   * @type {!boolean}
   * @export
   */
  this.dashboardsLoading = false;

  /** @type {DashboardService}
   *  @private
   */
  this.dashboard_ = dashboardService;

  /**
   * @type {!ExplorerModel}
   * @export
   */
  this.model = new ExplorerModel();

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
ExplorerService.prototype.customizeSql = function() {
  var widget = this.dashboard_.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }
  this.dashboard_.customizeSql(widget);
  this.model.readOnly = false;
  this.model.code_editor.isOpen = true;

  this.model.code_editor.selectedMode = 'SQL';
};


/**
 * Shows the SQL editor.
 * @export
 */
ExplorerService.prototype.viewSql = function() {
  var widget = this.dashboard_.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
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
  var widget = this.dashboard_.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = 'SQL';
};


/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.restoreBuilder = function() {
  var widget = this.dashboard_.selectedWidget;
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

  this.dashboard_.restoreBuilder(widget);
  this.model.code_editor.isOpen = false;
};


});  // goog.scope
