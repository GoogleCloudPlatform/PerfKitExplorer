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
        $scope.tabSvc.toggleTab(tab);
        tab.tooltipVisible = false;
      };

      this.getFirstTab = function() {
        if (dashboardService.selectedWidget) {
          return sidebarTabService.tabs[0];
        } else {
          for (var i=0, len=sidebarTabService.tabs.length; i < len; ++i) {
            var currentTab = sidebarTabService.tabs[i];

            if (!currentTab.requireWidget) {
              return currentTab;
            }
          }
        }

        console.log('getFirstTab failed: No non-widget tabs available.');
      };

      this.getLastTab = function() {
        if (dashboardService.selectedWidget) {
          return sidebarTabService.tabs[sidebarTabService.tabs.length - 1];
        } else {
          for (var i=sidebarTabService.tabs.length - 1; i >= 0; --i) {
            var currentTab = sidebarTabService.tabs[i];

            if (!currentTab.requireWidget) {
              return currentTab;
            }
          }
        }

        console.log('getFirstTab failed: No non-widget tabs available.');
      };

      this.getNextTab = function() {
        if (sidebarTabService.selectedTab) {
          var selectedTabIndex = sidebarTabService.tabs.indexOf(
              sidebarTabService.selectedTab);
          if (selectedTabIndex == -1) {
            throw 'Cannot find selected tab.';
          }
          
          if (dashboardService.selectedWidget) {
            if (++selectedTabIndex < sidebarTabService.tabs.length) {
              return sidebarTabService.tabs[selectedTabIndex];
            }
          } else {
            for (var i=selectedTabIndex + 1, len=sidebarTabService.tabs.length;
                 i < len; ++i) {
              var currentTab = sidebarTabService.tabs[i];

              if (!currentTab.requireWidget) {
                return currentTab;
              }
            }
          }
        }

        return this.getFirstTab();
      };

      this.getPreviousTab = function() {
        if (sidebarTabService.selectedTab) {
          var selectedTabIndex = sidebarTabService.tabs.indexOf(
              sidebarTabService.selectedTab);
          if (selectedTabIndex == -1) {
            throw 'Cannot find selected tab.';
          }
          
          if (dashboardService.selectedWidget) {
            if (--selectedTabIndex > 0) {
              return sidebarTabService.tabs[selectedTabIndex];
            }
          } else {
            for (var i=selectedTabIndex - 1; i >= 0; --i) {
              var currentTab = sidebarTabService.tabs[i];

              if (!currentTab.requireWidget) {
                return currentTab;
              }
            }
          }
        }

        return this.getLastTab();
      };
    },
    controllerAs: 'ctrl'
  };
};

});  // goog.scope
