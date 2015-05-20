/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
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

goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabsDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.explorer.sidebar.SidebarTabsDirective = function(
  dashboardService, sidebarTabService) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/static/components/explorer/sidebar/sidebar-tabs-directive.html',
    controller: function($scope) {
      $scope.dashboardSvc = dashboardService;
  		$scope.tabSvc = sidebarTabService;
    }
  };
};

});  // goog.scope
