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
  var scope, $compile, $httpBackend;
  var dashboardSvc, sidebarTabSvc;
  var mockTabs;

  const explorer = p3rf.perfkit.explorer;

  const TEMPLATE_SIDEBAR_TABS = (
    '/static/components/explorer/sidebar/sidebar-tabs-directive.html');

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_,
       _$timeout_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(inject(function(_sidebarTabService_, _dashboardService_) {
    sidebarTabSvc = _sidebarTabService_;
    dashboardSvc = _dashboardService_;

    mockTabs = [
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
    sidebarTabSvc.tabs = mockTabs;
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
          .toMatch('pk-sidebar-tabs');
      expect(directiveElement.children.length).toBe(2);
    });

    it('each tab', function() {
      var targetElement = directiveElement.find(
          'div.pk-sidebar-tab');
      expect(targetElement.length).toBe(4);
    });
  });

  describe('when the selectedWidget is set to null should', function() {
    beforeEach(inject(function() {
      dashboardSvc.selectedWidget = {'name': 'MOCK_WIDGET'};
    }));

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_SIDEBAR_TABS).respond(200);
      directiveElement = angular.element('<sidebar-tabs />');
          
      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('maintain selection if the tab is global', function() {
      expect(dashboardSvc.selectedWidget).not.toBeNull();
      sidebarTabSvc.selectedTab = mockTabs[0];
      
      dashboardSvc.selectedWidget = null;
      scope.$digest();
      
      expect(sidebarTabSvc.selectedTab).toEqual(mockTabs[0]);
    });

    it('select the next tab if the current tab requires a widget', function() {
      expect(dashboardSvc.selectedWidget).not.toBeNull();
      sidebarTabSvc.selectedTab = mockTabs[1];

      dashboardSvc.selectedWidget = null;
      scope.$digest();

      expect(sidebarTabSvc.selectedTab).toEqual(mockTabs[2]);
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
      expect(dashboardSvc.selectedWidget).toBeNull();

      var tabElements = directiveElement.find(
          'div.pk-sidebar-tab');
      
      expect(mockTabs[0].requireWidget).toBe(false);
      expect(tabElements[0].getAttribute('class')).not.toMatch('ng-hide');

      expect(mockTabs[1].requireWidget).toBe(true);
      expect(tabElements[1].getAttribute('class')).toMatch('ng-hide');

      expect(mockTabs[2].requireWidget).toBe(false);
      expect(tabElements[2].getAttribute('class')).not.toMatch('ng-hide');

      expect(mockTabs[3].requireWidget).toBe(true);
      expect(tabElements[3].getAttribute('class')).toMatch('ng-hide');
    });

    it('selectedWidget is not null regardless of requireWidget', function() {
      dashboardSvc.selectedWidget = {'NAME': 'MOCK_WIDGET'};
      scope.$digest();

      var tabElements = directiveElement.find(
          'div.pk-sidebar-tab:not(.ng-hide)');
      expect(tabElements.length).toEqual(4);
    });
  });
});
