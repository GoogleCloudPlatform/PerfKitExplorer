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
 * @fileoverview DashboardAdminPageCtrl is an angular controller representing
 * the page for Dashboard Administration.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageCtrl');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');
goog.require('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var PageModel = explorer.components.dashboard_admin_page.DashboardAdminPageModel;
var PageService = explorer.components.dashboard_admin_page.DashboardAdminPageService;
var DashboardDataService = explorer.components.dashboard.DashboardDataService;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var DashboardService = explorer.components.dashboard.DashboardService;
var WidgetFactoryService = explorer.components.widget.WidgetFactoryService;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.$location} $location
 * @param {!angular.$modal} $modal
 * @param {DashboardDataService} dashboardDataService
 * @param {PageService} dashboardAdminPageService
 * @constructor
 * @ngInject
 */
explorer.components.dashboard_admin_page.DashboardAdminPageCtrl = function(
    $scope, $location, $modal, dashboardDataService, dashboardAdminPageService,
    uiGridSelectionService) {
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
   * @type {!angular.$modal}
   * @private
   */
  this.modal_ = $modal;

  /**
   * @type {DashboardDataService}
   * @export
   */
  this.dashboardDataService = dashboardDataService;

  /** @private @type {DashboardAdminPageService} */
  $scope.pageService = dashboardAdminPageService;

  /** @export @type {DashboardAdminPageService */
  this.pageService = dashboardAdminPageService;

  /**
   * Error messages raised by this controller.
   *
   * @type {Array.<string>}
   * @export
   */
  this.errors = [];

  this.gridOptions = {
    data: 'pageService.dashboards',
    enableFiltering: true,
    enableRowHeaderSelection: false,
    multiSelect: false,
    virtualizationThreshold: 100,
    columnDefs: [
      {name: 'title', displayName: 'Title',
        cellTemplate:
            '<div class="ngCellText ui-grid-cell-contents" ng-class="col.colIndex()">' +
            '    <a ng-click="getExternalScopes().openDashboard(row.entity)">' +
            '    {{row.entity[col.field]}}</a>' +
            '</div>'},
      {name: 'owner', displayName: 'Owner', width: 240},
      {name: 'id', displayName: 'ID', width: 160}
    ]
  };

  var self = this;
  $scope.gridScope = {
    openDashboard: function(dashboard) {
      self.openDashboard(dashboard);
    }
  };

  this.gridOptions.onRegisterApi = angular.bind(this, function(gridApi) {
    this.pageService.selection = gridApi.selection;
  });

  /**
   * @type {boolean}
   * @export
   */
  this.isLoading = false;

  $scope.$watch(
      angular.bind(this, function() { return this.pageService.model.owner; }),
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
 * Verifies that a dashboard is selected, and raises and error if not.
 * @returns {DashboardModel}
 */
DashboardAdminPageCtrl.prototype.verifySelection = function() {
  var selection = this.getSelected();

  if (!selection) {
    throw 'verifySelection() failed: No dashboard selected.';
  }
  return selection;
};


/**
 * Copies the currently selected dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.copyDashboard = function() {
  var selectedDashboard = this.verifySelection();

  var title = window.prompt(
    'Please provide the title for your dashboard',
    selectedDashboard.title);

  if (title) {
    var promise = this.dashboardDataService.copy(
        selectedDashboard.id, title);

    promise.then(angular.bind(this, function(response) {
      this.listDashboards();
    }));

    promise.then(null, angular.bind(this, function(error) {
      this.errors.push(error.message);
    }));
  }
};


/**
 * Copies the currently selected dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.editDashboardOwner = function() {
  var selectedDashboard = this.verifySelection();

  var owner = window.prompt(
    'Please provide an email address for the new owner:',
    selectedDashboard.owner);

  if (owner) {
    var promise = this.dashboardDataService.editOwner(
        selectedDashboard.id, owner);

    promise.then(angular.bind(this, function(response) {
      this.listDashboards();
    }));

    promise.then(null, angular.bind(this, function(error) {
      this.errors.push(error.message);
    }));
  }
};


/**
 * Copies the currently selected dashboard
 * @export
 */
DashboardAdminPageCtrl.prototype.renameDashboard = function() {
  var selectedDashboard = this.verifySelection();

  var title = window.prompt(
      'Please provide the title for your dashboard',
      selectedDashboard.title);

  var promise = this.dashboardDataService.rename(
      selectedDashboard.id, title);

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
  this.scope_.pageService.listDashboards();
};


/**
 * Removes selection and all items from the grid.
 * @export
 */
DashboardAdminPageCtrl.prototype.clearDashboards = function() {
  while (this.data.selectedItems.length > 0) {
    this.data.selectedItems.pop();
  }

  while (this.scope_.pageService.dashboards.length > 0) {
    this.pageService.dashboards.pop();
  }
};


/**
 * Lists all dashboards in the repository.
 * @export
 */
DashboardAdminPageCtrl.prototype.listAllDashboards = function() {
  this.pageService.model.filter_owner = false;
  this.pageService.model.owner = '';
  this.pageService.model.mine = false;
  this.gridOptions.columnDefs[1].visible = true;

  this.listDashboards();
};


/**
 * Lists dashboards owned by the current user.
 * @export
 */
DashboardAdminPageCtrl.prototype.listMyDashboards = function() {
  this.pageService.model.filter_owner = false;
  this.pageService.model.owner = '';
  this.pageService.model.mine = true;
  this.gridOptions.columnDefs[1].visible = false;

  this.listDashboards();
};


/**
 * Returns the selected dashboard.
 * @return {?DashboardModel}
 * @export
 */
DashboardAdminPageCtrl.prototype.getSelected = function() {
  if (!this.pageService.selection) {
    return null;
  }

  var selectedItems = this.pageService.selection.getSelectedRows();

  switch (selectedItems.length) {
    case 0:
      return null;
    case 1:
      return selectedItems[0];
    default:
      console.log('Multiple items not supported.');
      return selectedItems[0];
  }
};

/**
 * Lists dashboards owned by a specific user.
 * @param {?string=} opt_owner If provided, specifies the owner email address.
 * @export
 */
DashboardAdminPageCtrl.prototype.listDashboardsByOwner = function(opt_owner) {
  this.pageService.model.filter_owner = true;
  this.pageService.model.owner = opt_owner || null;
  this.pageService.model.mine = false;

  this.clearDashboards();
};


/**
 * @export
 */
DashboardAdminPageCtrl.prototype.deleteDashboard = function() {
  var selectedDashboard = this.verifySelection();

  if (!window.confirm('Are you sure you want to delete this dashboard?')) {
    return;
  }

  var promise = this.dashboardDataService.delete(selectedDashboard.id);
  this.pageService.isLoading = true;

  promise.then(angular.bind(this, function(response) {
    this.listDashboards();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.pageService.isLoading = false;
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


/**
 * @export
 */
DashboardAdminPageCtrl.prototype.uploadDashboard = function() {
  this.modal_.open({
    templateUrl: '/static/components/dashboard_admin_page/dashboard-upload-dialog.html',
    controller: 'FileUploadDialogCtrl as dialog'
  });
};


/**
 * @export
 */
DashboardAdminPageCtrl.prototype.editConfig = function() {
  this.modal_.open({
    templateUrl: '/static/components/config/config-dialog.html',
    controller: 'ConfigDialogCtrl as dialog'
  });
};


/**
 * @export
 */
DashboardAdminPageCtrl.prototype.downloadDashboard = function() {
  var selectedDashboard = this.verifySelection();

  window.open('/dashboard/view?id=' + selectedDashboard.id + '&filename=perfkit_dashboard_' + selectedDashboard.id + '.json')
};

});  // goog.scope
