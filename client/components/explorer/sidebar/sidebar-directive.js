/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview SidebarTabDirective encapsulates layout and UX
 * for the Explorer Sidebar's tabs.  For the content of selected
 * tabs, see SidebarDirective.
 * 
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');
goog.require('p3rf.perfkit.explorer.models.DatasourceType');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const DatasourceType = explorer.models.DatasourceType;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.explorer.sidebar.SidebarDirective = function(
  dashboardService, sidebarTabService) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/static/components/explorer/sidebar/sidebar-directive.html',
    controller: ['$scope', function($scope) {
      $scope.dashboardSvc = dashboardService;
      $scope.tabSvc = sidebarTabService;
      $scope.datasourceTypes = DatasourceType;
    }]
  };
};

});  // goog.scope
