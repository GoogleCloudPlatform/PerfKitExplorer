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
goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabModel');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const SidebarTabModel = explorer.components.explorer.sidebar.SidebarTabModel;
const ExplorerStateService = explorer.components.explorer.ExplorerStateService;
const WidgetFactoryService = explorer.components.widget.WidgetFactoryService;


explorer.components.explorer.sidebar.SIDEBAR_TABS = [
  {id: 'dashboard', title: 'Dashboard', iconClass: 'fa fa-dashcube',
    hint: 'Dashboard title and properties',
    tabClass: 'dashboard-tab', panelTitleClass: 'dashboard-panel-title',
    panelClass: 'dashboard-panel', toolbarClass: 'dashboard-toolbar'},
  {id: 'container', title: 'Container', iconClass: 'fa fa-dropbox',
    hint: 'Container properties and text', requireContainer: true,
    tabClass: 'dashboard-tab', panelTitleClass: 'dashboard-panel-title',
    panelClass: 'dashboard-panel', toolbarClass: 'dashboard-toolbar'},
  {id: 'widget.config', title: 'Widget', iconClass: 'fa fa-cube',
    hint: 'Widget title and appearance', requireWidget: true,
    tabClass: 'widget-tab', panelTitleClass: 'widget-panel-title',
    panelClass: 'widget-panel', toolbarClass: 'widget-toolbar'},
  {id: 'widget.data.filter', title: 'Data Filters', iconClass: 'fa fa-filter',
    hint: 'Query filters and constraints', requireWidget: true, requireDatasourceTypes: ['BigQuery'],
    tabClass: 'bqgviz-tab', panelTitleClass: 'bqgviz-panel-title',
    panelClass: 'bqgviz-panel', toolbarClass: 'bqgviz-toolbar'},
  {id: 'widget.data.result', title: 'Data Results', iconClass: 'fa fa-table',
    hint: 'Query columns and results', requireWidget: true, requireDatasourceTypes: ['BigQuery'],
    tabClass: 'bqgviz-tab', panelTitleClass: 'bqgviz-panel-title',
    panelClass: 'bqgviz-panel', toolbarClass: 'bqgviz-toolbar'},
  {id: 'widget.chart', title: 'Chart Config', iconClass: 'fa fa-bar-chart',
    hint: 'Chart type and settings', requireWidget: true, requireWidgetTypes: ['chart'],
    tabClass: 'bqgviz-tab', panelTitleClass: 'bqgviz-panel-title',
    panelClass: 'bqgviz-panel', toolbarClass: 'bqgviz-toolbar'},
  {id: 'widget.columns', title: 'Columns', iconClass: 'fa fa-columns',
    hint: 'Column styling and order', requireWidget: true, requireDatasourceTypes: ['BigQuery', 'Cloud SQL'],
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
    explorerStateService, widgetFactoryService) {
  /** @private {!ExplorerStateService} */
  this.explorerStateSvc_ = explorerStateService;

  /** @private {!WidgetFactoryService} */
  this.widgetFactorySvc_ = widgetFactoryService;

  /** @export {!Array.<!SidebarTabModel>} */
  this.tabs = SIDEBAR_TABS;

  /** @export {?SidebarTabModel} */
  this.selectedTab = null;
};
const SidebarTabService = explorer.components.explorer.sidebar.SidebarTabService;


/**
 * Marks the provided tab as the selected one.
 * @param {?SidebarTabModel} tab
 * @export
 */
SidebarTabService.prototype.selectTab = function(tab) {
  this.selectedTab = tab;
};


/**
 * Selects the appropriate tab for widget selection.
 */
SidebarTabService.prototype.resolveSelectedTabForWidget = function() {
  if (!(this.selectedTab &&
      this.selectedTab.requireWidget &&
      this.isTabVisible(this.selectedTab))) {
    this.selectTab(this.getFirstWidgetTab());
  }
};


/**
 * Selects the appropriate tab for container selection.
 */
SidebarTabService.prototype.resolveSelectedTabForContainer = function() {
  if (!(this.selectedTab &&
      this.selectedTab.requireContainer &&
      this.isTabVisible(this.selectedTab))) {
    this.selectTab(this.getFirstContainerTab());
  }
};


/**
 * Selects the appropriate tab for container selection.
 */
SidebarTabService.prototype.resolveSelectedTabForDashboard = function() {
  if (!(this.selectedTab &&
       this.isTabVisible(this.selectedTab))) {
    this.selectTab(this.getFirstTab());
  }
};


/**
 * Toggles the selection state of a tab.
 * @param {?SidebarTabModel} tab
 * @export
 */
SidebarTabService.prototype.toggleTab = function(tab) {
  if (this.selectedTab == tab) {
    this.selectedTab = null;
  } else {
    this.selectTab(tab);
  }
};


/**
 * Selects the first available container-related tab.
 * @return {?SidebarTabModel}
 */
SidebarTabService.prototype.getFirstContainerTab = function() {
  for (let i=0, len=this.tabs.length; i < len; ++i) {
    let currentTab = this.tabs[i];

    if (currentTab.requireContainer) {
      return currentTab;
    }
  }

  console.log('getFirstContainerTab failed: No container tabs available.');
  return null;
};


/**
 * Selects the first available widget-related tab.
 * @return {?SidebarTabModel}
 */
SidebarTabService.prototype.getFirstWidgetTab = function() {
  for (let currentTab of this.tabs) {
    if (currentTab.requireWidget && this.isTabVisible(currentTab)) {
      return currentTab;
    }
  }

  return null;
};



/**
  * Returns true if the tab should be displayed, otherwise false.
  * @param {!SidebarTabModel} tab
  * @export
  */
SidebarTabService.prototype.isTabVisible = function(tab) {
  // TODO(joemu): Replace this with data-driven logic.
  if (tab.requireWidget) {
    if (!this.explorerStateSvc_.widgets.selected) {
      return false;
    }

    let widget = this.explorerStateSvc_.widgets.selected;
    
    if (goog.isDefAndNotNull(tab.requireDatasourceTypes)) {
      goog.asserts.assert(goog.isArrayLike(tab.requireDatasourceTypes));
      
      return (tab.requireDatasourceTypes.indexOf(widget.model.datasource.type) > -1);
    }
    
    if (goog.isDefAndNotNull(tab.requireWidgetTypes)) {
      goog.asserts.assert(goog.isArrayLike(tab.requireWidgetTypes));
      
      return (tab.requireWidgetTypes.indexOf(widget.model.type) > -1);
    }
  }

  if (tab.requireContainer &&
      !this.explorerStateSvc_.containers.selectedId) {
    return false;
  }

  return true;
};


/**
 * Selects the first available tab.
 * @return {!SidebarTabModel}
 */
SidebarTabService.prototype.getFirstTab = function() {
  return this.tabs[0];
};


/**
 * Returns the last available tab.
 * @return {!SidebarTabModel}
 */
SidebarTabService.prototype.getLastTab = function() {
  if (this.explorerStateSvc_.widgets.selectedId) {
    return this.tabs[this.tabs.length - 1];
  } else {
    for (let i=this.tabs.length - 1; i >= 0; --i) {
      let currentTab = this.tabs[i];

      if (this.isTabVisible(currentTab)) {
        return currentTab;
      }
    }
  }

  throw new Error('getFirstTab failed: No non-widget tabs available.');
};


/**
 * Returns the next available tab, or the first if at the end.
 * @return {!SidebarTabModel}
 */
SidebarTabService.prototype.getNextTab = function() {
  if (this.selectedTab) {
    let selectedTabIndex = this.tabs.indexOf(
        this.selectedTab);
    if (selectedTabIndex == -1) {
      throw 'Cannot find selected tab.';
    }

    if (this.explorerStateSvc_.widgets.selectedId) {
      if (++selectedTabIndex < this.tabs.length) {
        return this.tabs[selectedTabIndex];
      }
    } else {
      for (let i=selectedTabIndex + 1, len=this.tabs.length;
           i < len; ++i) {
        let currentTab = this.tabs[i];

        if (this.isTabVisible(currentTab)) {
          return currentTab;
        }
      }
    }
  }

  return this.getFirstTab();
};


/**
 * Returns the previous available tab, or the last if at the start.
 */
SidebarTabService.prototype.getPreviousTab = function() {
  if (this.selectedTab) {
    let selectedTabIndex = this.tabs.indexOf(
        this.selectedTab);
    if (selectedTabIndex == -1) {
      throw 'Cannot find selected tab.';
    }

    if (this.explorerStateSvc_.widgets.selectedId) {
      if (--selectedTabIndex >= 0) {
        return this.tabs[selectedTabIndex];
      }
    } else {
      for (let i=selectedTabIndex - 1; i >= 0; --i) {
        let currentTab = this.tabs[i];

        if (this.isTabVisible(currentTab)) {
          return currentTab;
        }
      }
    }
  }

  return this.getLastTab();
};

});  // goog.scope
