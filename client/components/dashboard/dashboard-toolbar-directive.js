/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview DashboardToolbarDirective encapsulates layout and UX
 * for the Dashboard toolbar.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardToolbarDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {!Object} Directive definition object.
   * @ngInject
   */
  explorer.components.dashboard.DashboardToolbarDirective = function(
      dashboardService, errorService, explorerService, sidebarTabService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '='
      },
      transclude: false,
      templateUrl: '/static/components/dashboard/dashboard-toolbar-directive.html',
      controller: ['$scope', '$window', function($scope, $window) {
        this.dashboardSvc = dashboardService;
        this.errorSvc = errorService;
        this.explorerSvc = explorerService;
        this.tabSvc = sidebarTabService;

        /**
         * Prompts the user for a title, and copies the current dashboard.
         * @export
         */
        this.saveDashboardCopy = function() {
          let title = $window.prompt(
              'Please provide the title for your dashboard',
              this.dashboardSvc.current.model.title);
          if (!title) { return; }

          this.dashboardSvc.current.model.title = title;
          this.dashboardSvc.current.model.owner = '';
          this.dashboardSvc.saveDashboardCopy();
        };

        // TODO: Replace implementation with a ui-router change.
        /**
         * Presents the user with a new, unsaved dashboard.
         * @export
         */
        this.createDashboard = function() {
          $window.location = '/explore?';
        };

        // TODO: Replace implementation with a ui-router change.
        /**
         * Opens the provided dashboard.
         * @export
         */
        this.openDashboard = function(dashboard) {
          $window.location =
              '/explore?dashboard=' + dashboard.id;
        };

        // TODO: Replace implementation with a ui-router change.
        /**
         * Opens the dashboard administration page.
         * @export
         */
        this.openDashboardAdmin = function() {
          $window.location = '/dashboard-admin';
        };

        // TODO: Replace implementation with a ui-router change.
        /**
         * Switches the current dashboard into edit mode.
         * @export
         */
        this.editDashboard = function() {
          this.explorerSvc.model.readOnly = false;
        };

        /**
         * Downloads the current dashboard as a json file.
         * @export
         */
        this.downloadDashboard = function() {
          let selectedDashboard = this.dashboardSvc.current.model;

          $window.open(
              '/dashboard/view?id=' + selectedDashboard.id +
              '&filename=perfkit_dashboard_' + selectedDashboard.id + '.json')
        };

        /**
         * Prompts the user to confirm, then deletes the selected dashboard.
         * @export
         */
        this.deleteDashboard = function() {
          goog.asserts.assert(
              this.dashboardSvc.current.model.id,
              'deleteDashboard failed: No id set.');

          if (!$window.confirm(
                  'Are you sure you want to delete this dashboard?')) {
            return;
          }

          let promise = this.dashboardSvc.deleteDashboard(
              this.dashboardSvc.current.model);

          promise.then(angular.bind(this, function(response) {
            this.openDashboardAdmin();
          }));

          promise.then(null, angular.bind(this, function(error) {
            this.errorSvc.addDanger(error.message);
          }));
        };
      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
