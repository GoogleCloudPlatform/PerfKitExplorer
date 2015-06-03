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

goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabsDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.explorer.sidebar.SidebarTabsDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    templateUrl: '/static/components/explorer/sidebar/sidebar-tabs-directive.html',
    controller: function($scope, dashboardService, sidebarTabService) {
      this.dashboardSvc = dashboardService;
      this.tabSvc = sidebarTabService;

      this.tabClicked = function(tab) {
        this.tabSvc.toggleTab(tab);
        tab.tooltipVisible = false;
      };

      $scope.$watch(
          angular.bind(this, function() {
            return this.dashboardSvc.selectedWidget; }),
          angular.bind(this, function(newValue, oldValue) {
            if (newValue !== oldValue) {
              if (!newValue && this.tabSvc.selectedTab.requireWidget) {
                this.tabSvc.selectedTab = this.tabSvc.getNextTab(
                    this.tabSvc.selectedTab);
              }
            }
          }));
    },
    controllerAs: 'ctrl'
  };
};

});  // goog.scope
