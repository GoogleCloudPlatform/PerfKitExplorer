/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview DashboardAdminPageCtrl is an angular controller representing
 * the page for Dashboard Administration.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageCtrl');

goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');
goog.require('p3rf.dashkit.explorer.components.widget.WidgetFactoryService');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var DashboardAdminPageModel = (
    explorer.components.dashboard_admin_page.DashboardAdminPageModel);
var DashboardDataService = explorer.components.dashboard.DashboardDataService;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var DashboardService = explorer.components.dashboard.DashboardService;
var WidgetFactoryService = explorer.components.widget.WidgetFactoryService;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.$location} $location
 * @param {DashboardDataService} dashboardDataService
 * @constructor
 * @ngInject
 */
explorer.components.dashboard_admin_page.DashboardAdminPageCtrl = function(
    $scope, $location, dashboardDataService) {
  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /**
   * @type {!angular.$location}
   * @private
   */
  this.location_ = $location;

  /**
   * @type {DashboardDataService}
   * @export
   */
  this.dashboardDataService = dashboardDataService;

  /**
   * @type {Array.<!DashboardModel>}
   * @export
   */
  $scope.dashboards = [];

  /**
   * Error messages raised by this controller.
   *
   * @type {Array.<string>}
   * @export
   */
  this.errors = [];

  this.data = {
    data: 'dashboards',
    multiSelect: false,
    selectedItems: [],
    columnDefs: [
      {field: 'title', displayName: 'Title',
        cellTemplate:
            '<div class="ngCellText" ng-class="col.colIndex()">' +
            '    <a ng-click="pageCtrl.openDashboard(row.entity)">' +
            '    {{row.entity[col.field]}}</a>' +
            '</div>'},
      {field: 'owner', displayName: 'Owner'},
      {field: 'id', displayName: 'ID'}
    ]
  };

  /**
   * @type {boolean}
   * @export
   */
  this.isLoading = false;

  this.model = new DashboardAdminPageModel();

  $scope.$watch(
      angular.bind(this, function() { return this.model.owner; }),
      angular.bind(this, function(new_val, old_val) {
        if (new_val == old_val) { return; }
        if (new_val == '') { return; }
        this.listDashboards();
      }));


  this.initPage();
};
var DashboardAdminPageCtrl = (
    explorer.components.dashboard_admin_page.DashboardAdminPageCtrl);


/**
 * Looks for a dashboard id in the url. If found, it fetches it, else, it
 * creates a new dashboard with one container and one widget.
 * @export
 */
DashboardAdminPageCtrl.prototype.initPage = function() {
  this.listMyDashboards();
};


/**
 * Copies the currently selected dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.copyDashboard = function() {
  if (this.data.selectedItems.length == 0) {
    console.log('copyDashboard() failed: No dashboard selected.');
    return;
  }

  var title = window.prompt(
      'Please provide the title for your dashboard',
      this.data.selectedItems[0].title);

  var promise = this.dashboardDataService.copy(
      this.data.selectedItems[0].id, title);

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error.message);
  }));
};


/**
 * Copies the currently selected dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.editDashboardOwner = function() {
  if (this.data.selectedItems.length == 0) {
    console.log('copyDashboard() failed: No dashboard selected.');
    return;
  }

  var owner = window.prompt(
      'Please provide an email address for the new owner:',
      this.data.selectedItems[0].owner.email);

  var promise = this.dashboardDataService.editOwner(
      this.data.selectedItems[0].id, owner);

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error.message);
  }));
};


/**
 * Copies the currently selected dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.renameDashboard = function() {
  if (this.data.selectedItems.length == 0) {
    console.log('copyDashboard() failed: No dashboard selected.');
    return;
  }

  var title = window.prompt(
      'Please provide the title for your dashboard',
      this.data.selectedItems[0].title);

  var promise = this.dashboardDataService.rename(
      this.data.selectedItems[0].id, title);

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error.message);
  }));
};


/**
 * Retrieves a list of dashboards
 * @export
 */
DashboardAdminPageCtrl.prototype.listDashboards = function() {
  while (this.data.selectedItems.length > 0) {
    this.data.selectedItems.pop();
  }

  var promise = this.dashboardDataService.list(
      this.model.mine, this.model.owner);
  this.isLoading = true;

  promise.then(angular.bind(this, function(response) {
    this.isLoading = false;
    this.scope_.dashboards = [];
    goog.array.forEach(
        response['data'], goog.bind(function(dashboardJson) {
          var dashboard = new DashboardModel();
          dashboard.id = dashboardJson.id;
          dashboard.title = dashboardJson.title;
          dashboard.owner = dashboardJson.owner;

          this.scope_.dashboards.push(dashboard);
        }, this));
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.isLoading = false;
    this.errors.push(error.message);
  }));
};


/**
 * Removes selection and all items from the grid.
 * @export
 */
DashboardAdminPageCtrl.prototype.clearDashboards = function() {
  while (this.data.selectedItems.length > 0) {
    this.data.selectedItems.pop();
  }

  while (this.scope_.dashboards.length > 0) {
    this.scope_.dashboards.pop();
  }
};


/**
 * Lists all dashboards in the repository.
 * @export
 */
DashboardAdminPageCtrl.prototype.listAllDashboards = function() {
  this.model.filter_owner = false;
  this.model.owner = '';
  this.model.mine = false;

  this.listDashboards();
};


/**
 * Lists dashboards owned by the current user.
 * @export
 */
DashboardAdminPageCtrl.prototype.listMyDashboards = function() {
  this.model.filter_owner = false;
  this.model.owner = '';
  this.model.mine = true;

  this.listDashboards();
};


/**
 * Lists dashboards owned by a specific user.
 * @param {?string=} opt_owner If provided, specifies the owner email address.
 * @export
 */
DashboardAdminPageCtrl.prototype.listDashboardsByOwner = function(opt_owner) {
  this.model.filter_owner = true;
  this.model.owner = opt_owner || null;
  this.model.mine = false;

  this.clearDashboards();
};


/**
 * @export
 */
DashboardAdminPageCtrl.prototype.deleteDashboard = function() {
  if (this.data.selectedItems.length == 0) {
    console.log('copyDashboard() failed: No dashboard selected.');
    return;
  }

  if (!window.confirm('Are you sure you want to delete this dashboard?')) {
    return;
  }

  var promise = this.dashboardDataService.delete(this.data.selectedItems[0].id);
  this.isLoading = true;

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.isLoading = false;
    this.errors.push(error.message);
  }));
};


/**
 * @param {!DashboardModel} dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.openDashboard = function(dashboard) {
  window.location = '/explore?dashboard=' + dashboard.id;
};


/**
 * @export
 */
DashboardAdminPageCtrl.prototype.createDashboard = function() {
  window.location = '/explore';
};

});  // goog.scope
