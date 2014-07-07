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

goog.provide('p3rf.dashkit.explorer.components.dashboard_admin_page.FileUploadDialogCtrl');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



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
    $scope, $log, $modalInstance) {
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
  this.modal_ = $modalInstance;

  console.log('initializing controller!');
};
var FileUploadDialogCtrl = (
    explorer.components.dashboard_admin_page.FileUploadDialogCtrl);


/**
 * Accepts the dialog.
 * @export
 */
FileUploadDialogCtrl.prototype.ok = function() {
  console.log('ok');
};


/**
 * Cancels the dialog.
 * @export
 */
FileUploadDialogCtrl.prototype.cancel = function() {
  console.log('cancel');
};

});  // goog.scope
