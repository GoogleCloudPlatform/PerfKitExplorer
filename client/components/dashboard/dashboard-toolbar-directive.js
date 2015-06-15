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
   * @return {Object} Directive definition object.
   * @ngInject
   */
  explorer.components.dashboard.DashboardToolbarDirective = function(
      dashboardService, sidebarTabService, explorerService) {
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
        this.explorerSvc = explorerService;
        this.tabSvc = sidebarTabService;

        /** @export */
        this.saveDashboard = function(dashboard) {
          this.dashboard.saveDashboard();
        };

        /** @export */
        this.saveDashboardCopy = function(dashboard) {
          var title = window.prompt(
              'Please provide the title for your dashboard',
              this.dashboard.current.model.title);
          if (!title) { return; }

          this.dashboardSvc.current.model.title = title;
          this.dashboardSvc.current.model.owner = '';
          this.dashboardSvc.saveDashboardCopy();
        };

        // TODO: Replace implementation with a ui-router change.
        /** @export */
        this.createDashboard = function() {
          $window.location = '/explore?';
        };

        // TODO: Replace implementation with a ui-router change.
        /** @export */
        this.openDashboard = function(dashboard) {
          $window.location = '/explore?dashboard=' + dashboard.id;
        };

        // TODO: Replace implementation with a ui-router change.
        /** @export */
        this.openDashboardAdmin = function(dashboard) {
          $window.location = '/dashboard-admin';
        };

        // TODO: Replace implementation with a ui-router change.
        /** @export */
        this.editDashboard = function() {
          this.explorer.model.readOnly = false;
        };

      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
