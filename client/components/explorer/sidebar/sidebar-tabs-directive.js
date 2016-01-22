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
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const SidebarTabModel = explorer.components.explorer.sidebar.SidebarTabModel;
const SidebarTabService = explorer.components.explorer.sidebar.SidebarTabService;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.explorer.sidebar.SidebarTabsDirective = function() {
  return {
    restrict: 'E',
    transclude: false,
    templateUrl: '/static/components/explorer/sidebar/sidebar-tabs-directive.html',
    controller: [
        '$scope', 'dashboardService', 'sidebarTabService',
        function($scope, dashboardService, sidebarTabService) {
      /** @export {!explorer.components.dashboard.DashboardService} */
      this.dashboardSvc = dashboardService;

      /** @export {!SidebarTabService} */
      this.tabSvc = sidebarTabService;

      /**
       * Reacts to a tab being clicked.  It toggles the tab and hides the tooltip.
       * @param {!SidebarTabModel} tab
       * @export
       */
      this.tabClicked = function(tab) {
        this.tabSvc.toggleTab(tab);
        tab.tooltipVisible = false;
      };
    }],
    controllerAs: 'ctrl'
  };
};

});  // goog.scope
