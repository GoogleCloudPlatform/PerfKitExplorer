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
 * @fileoverview Tests for DashboardToolbarDirective, which encapsulates the
 * state for the dashboard toolbar.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardToolbarDirective');

describe('DashboardToolbarDirective', function() {
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
            '<dashboard-toolbar />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain an element to', function() {
    var actualElement, actualController;

    beforeEach(inject(function() {
      actualElement = angular.element('<dashboard-toolbar />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('dashboardToolbar');
    }));

    it('create a new dashboard', function() {
      var targetElement = actualElement.find(
          'button.dashboard-create');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'createDashboard');
      targetElement.click();
      expect(actualController.createDashboard).toHaveBeenCalled();
    });

    it('show the open dashboard options', function() {
      var targetElement = actualElement.find(
          'button.dashboard-open');
      expect(targetElement.length).toBe(1);
    });

    it('list the open dashboard options', function() {
      var targetElement = actualElement.find(
          'ul.dashboard-open-dropdown');
      expect(targetElement.length).toBe(1);
    });

    it('open a dashboard', function() {
      explorerService.model.dashboards = [
        {id: '1'}
      ];
      scope.$digest();

      var targetElement = actualElement.find(
          'ul.dashboard-open-dropdown li:not(.divider, .dashboard-open-admin)');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'openDashboard');
      targetElement.click();
      expect(actualController.openDashboard).toHaveBeenCalledWith(
          explorerService.model.dashboards[0]);
    });

    it('open the dashboard admin page', function() {
      var targetElement = actualElement.find(
          'li.dashboard-open-admin');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'openDashboardAdmin');
      targetElement.click();
      expect(actualController.openDashboardAdmin).toHaveBeenCalled();
    });

    it('save the current dashboard', function() {
      var targetElement = actualElement.find(
          'button.dashboard-save');
      expect(targetElement.length).toBe(1);

      spyOn(dashboardService, 'saveDashboard');
      targetElement.click();
      expect(dashboardService.saveDashboard).toHaveBeenCalled();
    });

    it('save a copy of the current dashboard', function() {
      var targetElement = actualElement.find(
          'button.dashboard-copy');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'saveDashboardCopy');
      targetElement.click();
      expect(actualController.saveDashboardCopy).toHaveBeenCalled();
    });

    it('download the current dashboard', function() {
      var targetElement = actualElement.find(
          'button.dashboard-download');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'downloadDashboard');
      targetElement.click();
      expect(actualController.downloadDashboard).toHaveBeenCalled();
    });

    it('edit the current dashboard', function() {
      var targetElement = actualElement.find(
          'button.dashboard-edit');
      expect(targetElement.length).toBe(1);

      spyOn(actualController, 'editDashboard');
      targetElement.click();
      expect(actualController.editDashboard).toHaveBeenCalled();
    });

    it('delete the current dashboard', function() {
      var targetElement = actualElement.find(
          'button.dashboard-delete');
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

      actualElement = angular.element('<dashboard-toolbar />');
      $compile(actualElement)(scope);

      scope.$digest();

      actualController = actualElement.controller('dashboardToolbar');
    }));

    describe('saveDashboardCopy', function() {
      it('should copy the dashboard with the provided title', function() {
        var expectedTitle = 'EXPECTED_TITLE';

        expect(dashboardService.current).not.toBeNull();

        spyOn($window, 'prompt').and.returnValue(expectedTitle);
        spyOn(dashboardService, 'saveDashboardCopy');

        actualController.saveDashboardCopy();

        expect(dashboardService.current.model.title).toEqual(expectedTitle);
        expect(dashboardService.current.model.owner).toEqual('');

        expect($window.prompt).toHaveBeenCalled();
        expect(dashboardService.saveDashboardCopy).toHaveBeenCalled();
      });
    });

    describe('createDashboard', function() {
      it('should redirect the user to a new dashboard page', function() {
        var expectedUrl = '/explore?';
        spyOn(actualController, 'setWindowLocation');

        actualController.createDashboard();

        expect(actualController.setWindowLocation)
            .toHaveBeenCalledWith(expectedUrl);
      });
    });

    describe('openDashboard', function() {
      it('should redirect the user to the related dashboard page', function() {
        var actualDashboard = {id: 42};
        var expectedUrl = '/explore?dashboard=' + actualDashboard.id;

        spyOn(actualController, 'setWindowLocation');

        actualController.openDashboard(actualDashboard);

        expect(actualController.setWindowLocation)
            .toHaveBeenCalledWith(expectedUrl);
      });
    });

    describe('openDashboardAdmin', function() {
      it('should redirect the user to the dashboard admin page', function() {
        var expectedUrl = '/dashboard-admin';

        spyOn(actualController, 'setWindowLocation');

        actualController.openDashboardAdmin();

        expect(actualController.setWindowLocation)
            .toHaveBeenCalledWith(expectedUrl);
      });
    });
    
    describe('editDashboard', function() {
      it('should set the readOnly flag to false', function() {
        explorerService.model.readOnly = true;
        
        actualController.editDashboard();
        
        expect(explorerService.model.readOnly).toBe(false);
      });
    });

    describe('downloadDashboard', function() {
      it('should open a URL to download the dashboard', function() {
        var actualId = 42;
        dashboardService.current.model.id = actualId;

        spyOn($window, 'open');

        actualController.downloadDashboard();

        expect($window.open).toHaveBeenCalledWith(
          '/dashboard/view?id=' + actualId +
          '&filename=perfkit_dashboard_' + actualId + '.json');
      });
    });

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
