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
 * @fileoverview Tests for SidebarTabsDirective, which encapsulates the UX for
 * the sidebar tab selector.
 * 
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('goog.testing.style');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabsDirective');

describe('SidebarTabsDirective', function() {
  var scope, $compile, $httpBackend, $timeout, uiConfig;
  var configSvc, dashboardSvc, sidebarTabSvc;

  const explorer = p3rf.perfkit.explorer;

  const TEMPLATE_SIDEBAR_TABS = (
    '/static/components/explorer/sidebar/sidebar-tabs-directive.html');

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_,
       _$timeout_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        $httpBackend.expectGET(TEMPLATE_SIDEBAR_TABS).respond(200);
        var directiveElement = angular.element('<sidebar-tabs />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var directiveElement;

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_SIDEBAR_TABS).respond(200);
      directiveElement = angular.element('<sidebar-tabs />');

      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('the tab collection', function() {
      expect(directiveElement[0].getAttribute('class'))
          .toMatch('perfkit-sidebar-tabs');
      expect(directiveElement.children.length).toBe(2);
    });

    it('each tab', function() {
      var targetElement = directiveElement.find(
          'div.perfkit-sidebar-tab');
      expect(targetElement.length).toBe(6);
    });
  });

  describe('should show tabs when', function() {
    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_SIDEBAR_TABS).respond(200);
      directiveElement = angular.element('<sidebar-tabs />');
          
      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('requireWidget is false and selectedWidget is null', function() {
      
    });
  });
  
  describe('should support functions for getting the', function() {
    var directiveCtrl;
    var dashboardSvc, tabSvc;

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
    
    beforeEach(inject(function(_dashboardService_, _sidebarTabService_) {
      dashboardSvc = _dashboardService_;
      tabsSvc = _sidebarTabService_;

      tabsSvc.tabs = mockTabs;
    }));

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_SIDEBAR_TABS).respond(200);

      directiveElement = $compile(angular.element('<sidebar-tabs />'))(scope);
      scope.$digest();

      directiveCtrl = directiveElement.controller('sidebarTabs');
    }));

    it('first available tab', function() {
      expect(directiveCtrl.getFirstTab()).toEqual(mockTabs[0]);
    });

    it('last global tab when no widget is selected', function() {
      expect(dashboardSvc.selectedWidget).toBeNull();
      expect(directiveCtrl.getLastTab()).toEqual(mockTabs[2]);
    });

    it('last tab when a widget is selected', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      expect(directiveCtrl.getLastTab()).toEqual(mockTabs[3]);
    });

    it('next global tab when no widget is selected', function() {
      expect(dashboardSvc.selectedWidget).toBeNull();

      tabsSvc.selectTab(mockTabs[0]);
      expect(directiveCtrl.getNextTab()).toEqual(mockTabs[2]);
    });

    it('next available tab when a widget is selected', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      tabsSvc.selectTab(mockTabs[0]);
      expect(directiveCtrl.getNextTab()).toEqual(mockTabs[1]);
    });

    it('first available tab when next exceeds the end of the list', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      tabsSvc.selectTab(mockTabs[3]);
      expect(directiveCtrl.getNextTab()).toEqual(mockTabs[0]);
    });

    it('previous global tab when no widget is selected', function() {
      expect(dashboardSvc.selectedWidget).toBeNull();

      tabsSvc.selectTab(mockTabs[2]);
      expect(directiveCtrl.getPreviousTab()).toEqual(mockTabs[0]);
    });

    it('previous available tab when a widget is selected', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      tabsSvc.selectTab(mockTabs[2]);
      expect(directiveCtrl.getPreviousTab()).toEqual(mockTabs[1]);
    });

    it('last available tab when previous precedes the start of the list', function() {
      dashboardSvc.selectedWidget = {'type': 'Mock Widget'};

      tabsSvc.selectTab(mockTabs[0]);
      expect(directiveCtrl.getPreviousTab()).toEqual(mockTabs[3]);
    });
  });
});
