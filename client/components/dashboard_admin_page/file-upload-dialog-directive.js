/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview FileUploadDialogDirective - A directive that encapsulates a modal popup with a file selection box.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.dashboard_admin_page.FileUploadDialogDirective');

goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageService');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.FileUploadDialogCtrl');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var DashboardAdminPageService = explorer.components.dashboard_admin_page.DashboardAdminPageService;
var DashboardDataService = explorer.components.dashboard.DashboardDataService;
var FileUploadDialogCtrl = explorer.components.dashboard_admin_page.FileUploadDialogCtrl;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.dashboard_admin_page.FileUploadDialogDirective = function(
    dashboardAdminPageService, dashboardDataService) {
  return {
    restrict: 'E',
    templateUrl: '/static/components/dashboard_admin_page/file-upload-dialog-directive.html',
    controller: function($scope) {
      /** @export */
      this.pageService = dashboardAdminPageService;

      /** @export */
      this.dataService = dashboardDataService;

      /** @export */
      $scope.ok = function() {
        console.log('Directive ok');
      }

      /** @export */
      $scope.cancel = function() {
        console.log('Directive cancel');
      }
    }
  };
};

});  // goog.scope
