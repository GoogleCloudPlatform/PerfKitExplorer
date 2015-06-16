/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Service for state and content of Explorer tabs.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SIDEBAR_TABS');
goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabModel');
goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');



goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


explorer.components.explorer.sidebar.SIDEBAR_TABS = [
  {id: 'dashboard', title: 'Dashboard', iconClass: 'fa fa-dashcube',
    hint: 'Dashboard title and properties',
    tabClass: 'dashboard-tab', panelTitleClass: 'dashboard-panel-title',
    panelClass: 'dashboard-panel', toolbarClass: 'dashboard-toolbar'},
  {id: 'container', title: 'Container', iconClass: 'fa fa-dropbox',
    hint: 'Container properties and text',
    tabClass: 'dashboard-tab', panelTitleClass: 'dashboard-panel-title',
    panelClass: 'dashboard-panel', toolbarClass: 'dashboard-toolbar'},
  {id: 'widget.data.filter', title: 'Data Filters', iconClass: 'fa fa-filter',
    hint: 'Query filters and constraints', requireWidget: true,
    tabClass: 'bqgviz-tab', panelTitleClass: 'bqgviz-panel-title',
    panelClass: 'bqgviz-panel', toolbarClass: 'bqgviz-toolbar'},
  {id: 'widget.data.result', title: 'Data Results', iconClass: 'fa fa-table',
    hint: 'Query columns and results', requireWidget: true,
    tabClass: 'bqgviz-tab', panelTitleClass: 'bqgviz-panel-title',
    panelClass: 'bqgviz-panel', toolbarClass: 'bqgviz-toolbar'},
  {id: 'widget.chart', title: 'Chart Config', iconClass: 'fa fa-bar-chart',
    hint: 'Chart type and settings', requireWidget: true,
    tabClass: 'bqgviz-tab', panelTitleClass: 'bqgviz-panel-title',
    panelClass: 'bqgviz-panel', toolbarClass: 'bqgviz-toolbar'},
  {id: 'widget.config', title: 'Widget', iconClass: 'fa fa-font',
    hint: 'Widget title and appearance', requireWidget: true,
    tabClass: 'widget-tab', panelTitleClass: 'widget-panel-title',
    panelClass: 'widget-panel', toolbarClass: 'widget-toolbar'}
];
const SIDEBAR_TABS = explorer.components.explorer.sidebar.SIDEBAR_TABS;


/**
 * Service that provides state and content for Explorer tabs.
 * @constructor
 * @ngInject
 */
explorer.components.explorer.sidebar.SidebarTabService = function(
    dashboardService) {
  /** @private {!DashboardService} */
  this.dashboardService_ = dashboardService;

  /** @export {!Array.<!SidebarTabModel>} */
  this.tabs = SIDEBAR_TABS;

  /** @export {?ExplorerTabModel} */
  this.selectedTab = null;
};
const SidebarTabService = explorer.components.explorer.sidebar.SidebarTabService;

/**
 * Marks the provided tab as the selected one.
 * @param {?ExplorerTabModel} tab
 * @export
 */
SidebarTabService.prototype.selectTab = function(tab) {
  this.selectedTab = tab;
};

/**
 * Toggles the selection state of a tab.
 * @param {?ExplorerTabModel} tab
 * @export
 */
SidebarTabService.prototype.toggleTab = function(tab) {
  if (this.selectedTab == tab) {
    this.selectedTab = null;
  } else {
    this.selectTab(tab);
  }
};

SidebarTabService.prototype.getFirstTab = function() {
  if (this.dashboardService_.selectedWidget) {
    return this.tabs[0];
  } else {
    for (var i=0, len=this.tabs.length; i < len; ++i) {
      var currentTab = this.tabs[i];

      if (!currentTab.requireWidget) {
        return currentTab;
      }
    }
  }

  console.log('getFirstTab failed: No non-widget tabs available.');
};

SidebarTabService.prototype.getLastTab = function() {
  if (this.dashboardService_.selectedWidget) {
    return this.tabs[this.tabs.length - 1];
  } else {
    for (var i=this.tabs.length - 1; i >= 0; --i) {
      var currentTab = this.tabs[i];

      if (!currentTab.requireWidget) {
        return currentTab;
      }
    }
  }

  console.log('getFirstTab failed: No non-widget tabs available.');
};

SidebarTabService.prototype.getNextTab = function() {
  if (this.selectedTab) {
    var selectedTabIndex = this.tabs.indexOf(
        this.selectedTab);
    if (selectedTabIndex == -1) {
      throw 'Cannot find selected tab.';
    }

    if (this.dashboardService_.selectedWidget) {
      if (++selectedTabIndex < this.tabs.length) {
        return this.tabs[selectedTabIndex];
      }
    } else {
      for (var i=selectedTabIndex + 1, len=this.tabs.length;
           i < len; ++i) {
        var currentTab = this.tabs[i];

        if (!currentTab.requireWidget) {
          return currentTab;
        }
      }
    }
  }

  return this.getFirstTab();
};

SidebarTabService.prototype.getPreviousTab = function() {
  if (this.selectedTab) {
    var selectedTabIndex = this.tabs.indexOf(
        this.selectedTab);
    if (selectedTabIndex == -1) {
      throw 'Cannot find selected tab.';
    }

    if (this.dashboardService_.selectedWidget) {
      if (--selectedTabIndex >= 0) {
        return this.tabs[selectedTabIndex];
      }
    } else {
      for (var i=selectedTabIndex - 1; i >= 0; --i) {
        var currentTab = this.tabs[i];

        if (!currentTab.requireWidget) {
          return currentTab;
        }
      }
    }
  }

  return this.getLastTab();
};

});  // goog.scope
