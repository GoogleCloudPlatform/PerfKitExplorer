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
 * @fileoverview Tests for SidebarTabService, holds state and data for the
 * explorer sidebar.
 * 
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SIDEBAR_TABS');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabModel');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');

describe('SidebarTabService', function() {
  var scope, sidebarTabSvc;

  const explorer = p3rf.perfkit.explorer;
  const SidebarTabModel = explorer.components.explorer.sidebar.SidebarTabModel;
  const SIDEBAR_TABS = explorer.components.explorer.sidebar.SIDEBAR_TABS;

  var mockTabs = [
    {id: 'global-a', title: 'Global Tab 1', iconClass: 'global-a-icon',
     hint: 'Tip for Global Tab 1', requireWidget: false,
     tabClass: 'global-a-tab', panelTitleClass: 'global-a-panel-title',
     panelClass: 'global-a-panel'},
    {id: 'widget-b', title: 'Widget Tab 2', iconClass: 'widget-b-icon',
     hint: 'Hint for Widget Tab 2', requireWidget: true,
     tabClass: 'widget-b-tab', panelTitleClass: 'widget-b-panel-title',
     panelClass: 'widget-b-panel'},
    {id: 'global-b', title: 'Global Tab 2', iconClass: 'global-b-icon',
     hint: 'Hint for Global Tab 2', requireWidget: false,
     tabClass: 'global-b-tab', panelTitleClass: 'global-b-panel-title',
     panelClass: 'global-b-panel'},
    {id: 'widget-a', title: 'Widget Tab a', iconClass: 'widget-a-icon',
     hint: 'Hint for Widget Tab a', requireWidget: true,
     tabClass: 'widget-a-tab', panelTitleClass: 'widget-a-panel-title',
     panelClass: 'widget-a-panel'}
  ];

  beforeEach(module('explorer'));

  beforeEach(inject(function(_sidebarTabService_) {
    sidebarTabSvc = _sidebarTabService_;
  }));

  describe('should correctly initialize', function() {
    it('the tabs list with default values', function() {
      expect(sidebarTabSvc.tabs).not.toBeNull();
      expect(sidebarTabSvc.tabs).toBeArrayOfSize(
          SIDEBAR_TABS.length);
    });

    it('the selected tab to null', function() {
      expect(sidebarTabSvc.selectedTab).toBeNull();
    });
  });

  describe('should support functions to', function() {
    beforeEach(inject(function() {
      sidebarTabSvc.tabs = mockTabs;
    }));

    it('select a tab', function() {
      expect(sidebarTabSvc.selectedTab).toBeNull();

      sidebarTabSvc.selectTab(mockTabs[1]);
      expect(sidebarTabSvc.selectedTab).toEqual(mockTabs[1]);
    });

    it('toggle a tab on if no tab is selected', function() {
      expect(sidebarTabSvc.selectedTab).toBeNull();

      sidebarTabSvc.toggleTab(mockTabs[2]);
      expect(sidebarTabSvc.selectedTab).toEqual(mockTabs[2]);
    });

    it('toggle a tab on if a different tab is selected', function() {
      sidebarTabSvc.selectTab(mockTabs[1]);

      sidebarTabSvc.toggleTab(mockTabs[3]);
      expect(sidebarTabSvc.selectedTab).toEqual(mockTabs[3]);
    });

    it('toggle a tab off if the current tab is selected', function() {
      sidebarTabSvc.selectTab(mockTabs[1]);

      sidebarTabSvc.toggleTab(mockTabs[1]);
      expect(sidebarTabSvc.selectedTab).toBeNull();
    });
  });

  describe('should support functions for getting the', function() {
    var dashboardSvc;
    
    beforeEach(inject(function(_dashboardService_) {
      dashboardSvc = _dashboardService_;

      sidebarTabSvc.tabs = mockTabs;
    }));

    it('first available tab', function() {
      expect(sidebarTabSvc.getFirstTab()).toEqual(mockTabs[0]);
    });

    it('last global tab when no widget is selected', function() {
      expect(dashboardSvc.selectedWidget).toBeNull();
      expect(sidebarTabSvc.getLastTab()).toEqual(mockTabs[2]);
    });

    it('last tab when a widget is selected', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      expect(sidebarTabSvc.getLastTab()).toEqual(mockTabs[3]);
    });

    it('last tab when moving previous from the first tab', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      sidebarTabSvc.selectTab(mockTabs[0]);
      expect(sidebarTabSvc.getPreviousTab()).toEqual(mockTabs[3]);
    });

    it('next global tab when no widget is selected', function() {
      expect(dashboardSvc.selectedWidget).toBeNull();

      sidebarTabSvc.selectTab(mockTabs[0]);
      expect(sidebarTabSvc.getNextTab()).toEqual(mockTabs[2]);
    });

    it('next available tab when a widget is selected', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      sidebarTabSvc.selectTab(mockTabs[0]);
      expect(sidebarTabSvc.getNextTab()).toEqual(mockTabs[1]);
    });

    it('first available tab when next exceeds the end of the list', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      sidebarTabSvc.selectTab(mockTabs[3]);
      expect(sidebarTabSvc.getNextTab()).toEqual(mockTabs[0]);
    });

    it('previous global tab when no widget is selected', function() {
      expect(dashboardSvc.selectedWidget).toBeNull();

      sidebarTabSvc.selectTab(mockTabs[2]);
      expect(sidebarTabSvc.getPreviousTab()).toEqual(mockTabs[0]);
    });

    it('previous available tab when a widget is selected', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      sidebarTabSvc.selectTab(mockTabs[2]);
      expect(sidebarTabSvc.getPreviousTab()).toEqual(mockTabs[1]);
    });

    it('last available tab when previous precedes the start of the list', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      sidebarTabSvc.selectTab(mockTabs[0]);
      expect(sidebarTabSvc.getPreviousTab()).toEqual(mockTabs[3]);
    });
  });
});
