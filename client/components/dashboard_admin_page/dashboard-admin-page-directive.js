/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview DashboardAdminPageDirective encapsulates HTML, style and behavior
 *     for the Dashboard Adminsitration page.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard_admin_page.DashboardAdminPageDirective');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.dashboard_admin_page.DashboardAdminPageDirective = function(
    resizeService, explorerService) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/static/components/dashboard_admin_page/dashboard-admin-page-directive.html',
    controllerAs: 'pageCtrl',
    controller: 'DashboardAdminPageCtrl'
  };
};

});  // goog.scope
