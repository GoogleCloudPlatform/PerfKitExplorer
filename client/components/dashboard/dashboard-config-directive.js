/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview DashboardConfigDirective encapsulates HTML, style and behavior
 *     for the dashboard config.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardConfigDirective');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.dashboard.DashboardConfigDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      'ngModel': '='
    },
    templateUrl: '/static/components/dashboard/dashboard-config-directive.html',
    controller: function($scope, explorerService, dashboardService) {
      /** @export */
      $scope.dashboardSvc = dashboardService;

      /** @export */
      $scope.explorerSvc = explorerService;
    }
  };
};

});  // goog.scope
