/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
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
 * @fileoverview Tests for ConfigDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDirective');


describe('dashboardDirective', function() {
  var scope, $rootScope, $compile, $httpBackend;
  var dashboardSvc, explorerSvc, chartTypeMockData;

  const explorer = p3rf.perfkit.explorer;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_,
      dashboardService, explorerService, chartTypeMockData) {
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    
    dashboardSvc = dashboardService;
    explorerSvc = explorerService;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
          $compile('<dashboard />')(scope);
      }
      expect(compile).not.toThrow();
    });
  });

  describe('.removeWidget', function() {
    var widget, container, element, controller;
    var mockEvent;

    beforeEach(inject(function() {
      $httpBackend.whenGET(
          /\/static\/components\/widget\/data_viz\/gviz\/gviz-charts\.json/)
        .respond(chartTypeMockData);

      explorerSvc.newDashboard();
      scope.$digest();

      container = dashboardSvc.containers[0];
      widget = container.model.container.children[0];

      scope['currentDashboard'] = dashboardSvc.current;

      element = angular.element('<dashboard ng-model="currentDashboard" />');
      $compile(element)(scope);

      scope.$digest();

      controller = element.isolateScope();
    }));
    
    beforeEach(function() {
      mockEvent = {
        stopPropagation: function() {}
      };
    });

    it('should show a dialog with the widget title.', function() {
      spyOn(window, 'confirm').and.returnValue(false);
      controller.removeWidget(mockEvent, widget, container);

      var expectedMessage = 'The widget will be deleted:\n\nUntitled';
      expect(window.confirm).toHaveBeenCalledWith(expectedMessage);
    });

    it('should show a dialog with the selected widget title.', function() {
      spyOn(window, 'confirm').and.returnValue(false);
      controller.removeWidget(mockEvent, widget, container);

      var expectedMessage = 'The widget will be deleted:\n\nUntitled';
      expect(window.confirm).toHaveBeenCalledWith(expectedMessage);
    });

    it('should call the remove method when the user confirms the action', function() {
      spyOn(window, 'confirm').and.returnValue(true);

      spyOn(dashboardSvc, 'removeWidget');
      controller.removeWidget(mockEvent, widget, container);
      expect(dashboardSvc.removeWidget).toHaveBeenCalled();
    });

    it('should do nothing when the user does not confirm the action', function() {
      spyOn(window, 'confirm').and.returnValue(false);

      spyOn(dashboardSvc, 'removeWidget');
      controller.removeWidget(mockEvent, widget, container);
      expect(dashboardSvc.removeWidget).not.toHaveBeenCalled();
    });
  });

});
