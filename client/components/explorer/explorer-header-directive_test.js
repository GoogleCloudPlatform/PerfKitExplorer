/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview Tests for ExplorerHeaderDirective, which encapsulates the
 * state for the explorer's top bar.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerHeaderDirective');

describe('ExplorerHeaderDirective', function() {
  var scope, $compile, $timeout, $window;
  var dashboardService, explorerService;

  const explorer = p3rf.perfkit.explorer;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_, _$window_,
      _dashboardService_, _explorerService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    $window = _$window_;

    dashboardService = _dashboardService_;
    explorerService = _explorerService_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        var directiveElement = angular.element(
            '<explorer-header />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain an element to', function() {
    var actualElement, actualController;

    beforeEach(inject(function() {
      actualElement = angular.element('<explorer-header />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('explorerHeader');
    }));

    it('delete the current dashboard', function() {
      var targetElement = actualElement.find(
          'li.explorer-menu-dashboard-delete');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'deleteDashboard');
      targetElement.click();
      expect(actualController.deleteDashboard).toHaveBeenCalled();
    });
  });

  describe('method', function() {
    var actualElement, actualController;
    var deferred;

    beforeEach(inject(function($q) {
      deferred = $q.defer();

      explorerService.newDashboard();

      actualElement = angular.element('<explorer-header />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('explorerHeader');
    }));

    describe('deleteDashboard', function() {
      it('should confirm the operation then issue a delete url', function() {
        var handler = jasmine.createSpy('success');
        deferred.promise.then(handler);
        deferred.resolve({});

        var actualId = 42;
        dashboardService.current.model.id = actualId;

        spyOn($window, 'confirm').and.returnValue(true);
        spyOn(dashboardService, 'deleteDashboard')
            .and.returnValue(deferred.promise);
        spyOn(actualController, 'openDashboardAdmin');

        actualController.deleteDashboard();
        scope.$digest();

        expect($window.confirm).toHaveBeenCalled();
        expect(dashboardService.deleteDashboard).toHaveBeenCalledWith(
            dashboardService.current.model);
        expect(actualController.openDashboardAdmin).toHaveBeenCalled();
      });
    });
  });
});
