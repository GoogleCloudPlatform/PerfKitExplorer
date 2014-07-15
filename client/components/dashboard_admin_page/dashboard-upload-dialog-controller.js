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

goog.provide('p3rf.perfkit.explorer.components.dashboard_admin_page.FileUploadDialogCtrl');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var DashboardConfig = explorer.components.dashboard.DashboardConfig;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.Log} $log
 * @param {!angular.$modalInstance} $modalInstance
 * @constructor
 * @ngInject
 */
explorer.components.dashboard_admin_page.FileUploadDialogCtrl = function(
    $scope, $log, $modalInstance, dashboardDataService, dashboardVersionService, dashboardAdminPageService) {
  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /** @type {!angular.$log}
   * @private
   */
  this.log_ = $log;

  /**
   * @type {!angular.$modalInstance}
   * @private
   */
  this.modalInstance_ = $modalInstance;

  /** @private */
  this.dashboardDataService_ = dashboardDataService;

  /** @private */
  this.dashboardVersionService_ = dashboardVersionService;

  /** @private */
  this.dashboardAdminPageService_ = dashboardAdminPageService;

  /** @export {string} */
  this.filename = '';

  /** @export {DashboardConfig} */
  this.dashboard = null;

  /** @export {string} */
  this.error = '';

  $scope.$watch(
      angular.bind(this, function() { return this.filename; }),
      angular.bind(this, this.changeFilename));
};
var FileUploadDialogCtrl = (
    explorer.components.dashboard_admin_page.FileUploadDialogCtrl);


FileUploadDialogCtrl.prototype.changeFilename = function(filename) {
  if (!filename) {
    this.dashboard = null;
    return;
  }

  var reader = new FileReader();

  reader.onload = angular.bind(this, function(e) {
    var dashboard_json = reader.result;
    var dashboard_object = null;

    try {
      dashboard_object = angular.fromJson(dashboard_json);

      try {
        this.dashboard = new DashboardConfig(dashboard_object);
        this.dashboardVersionService_.verifyAndUpdateModel(this.dashboard.model);
        this.error = '';
      }
      catch (err) {
        this.dashboard = null;
        this.error = 'Failed: The file is not a valid dashboard.';
        this.log_.error(this.error);
      }
    }
    catch (err) {
      this.dashboard = null;
      this.error = 'Failed: The file is not valid JSON.';
      this.log_.error(this.error);
    }

    this.scope_.$apply();
  });

  reader.readAsText(this.filename);
};

/**
 * Accepts the dialog.
 * @export
 */
FileUploadDialogCtrl.prototype.ok = function() {
  var promise = this.dashboardDataService_.create(this.dashboard);

  promise.then(angular.bind(this, function(dashboardJsonModel) {
    this.log_.log('Dashboard saved with id:', dashboardJsonModel.id);
    this.dashboardAdminPageService_.listDashboards();
    this.modalInstance_.close();
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.log_.error('Error while saving the dashboard', error);
  }));
};


/**
 * Cancels the dialog.
 * @export
 */
FileUploadDialogCtrl.prototype.cancel = function() {
  this.modalInstance_.dismiss('cancel');
};

});  // goog.scope
