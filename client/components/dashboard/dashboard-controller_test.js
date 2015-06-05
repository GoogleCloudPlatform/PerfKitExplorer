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
 * @fileoverview Tests for the DashboardController controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardCtrl');
goog.require('p3rf.perfkit.explorer.mocks.googleVisualizationMocks');

describe('DashboardCtrl', function() {
  const explorer = p3rf.perfkit.explorer;
  const DashboardConfig = explorer.models.DashboardConfig;

  var ctrl, scope, rootScope, location, q, dashboardDataService;
  var httpBackend, endpoint, mockData;
  var ctrlPrototype =
      explorer.components.dashboard.DashboardCtrl.prototype;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));
  beforeEach(module('dashboardDataServiceMock'));

  // Mock the data returned by dashboardDataService
  beforeEach(inject(function($httpBackend, dashboardDataServiceMockData) {
    httpBackend = $httpBackend;
    endpoint = dashboardDataServiceMockData.endpoint;
    mockData = dashboardDataServiceMockData.data;

    httpBackend.whenGET(new RegExp(endpoint)).respond(mockData);
  }));

  beforeEach(inject(function($rootScope, $controller, $location,
      _dashboardDataService_, $q) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        location = $location;
        q = $q;
        dashboardDataService = _dashboardDataService_;

        spyOn(ctrlPrototype, 'initDashboard');
        spyOn(ctrlPrototype, 'fetchDashboard').and.callThrough();

        ctrl = $controller(
            explorer.components.dashboard.DashboardCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboard).not.toBeNull();
    expect(ctrl.errors).toEqual([]);
    expect(ctrl.dashboardIsLoading).toBeFalsy();
  });

  it('should init the dashboard when created.', function() {
    expect(ctrlPrototype.initDashboard).toHaveBeenCalled();
  });

  describe('initDashboard', function() {

    it('should by default create a new container with one widget.',
        function() {
          ctrlPrototype.initDashboard.and.callThrough();
          expect(ctrl.dashboard.widgets.length).toEqual(0);

          ctrl.initDashboard();

          expect(ctrl.dashboard.widgets.length).toEqual(1);
          expect(ctrl.dashboard.widgets[0].model.container.children.length).
              toEqual(1);
        }
    );

    it('should fetch a dashboard if there is a dashboardId ' +
       'in the url.',
        function() {
          ctrlPrototype.initDashboard.and.callThrough();
          location.search({dashboard: 'fakeId'});
          rootScope.$apply();

          ctrl.initDashboard();

          expect(ctrlPrototype.fetchDashboard).toHaveBeenCalled();
        }
    );
  });

  describe('fetchDashboard', function() {

    it('should fetch a dashboard and put it and its children in the scope.',
        function() {
          expect(ctrl.dashboard.widgets.length).toEqual(0);

          ctrl.fetchDashboard('fakeId');
          httpBackend.flush();

          var mockDashboard = mockData()[1];
          expect(ctrl.dashboard.widgets.length).
              toEqual(mockDashboard.children.length);
          expect(ctrl.dashboard.current.model.children.length).
              toEqual(mockDashboard.children.length);
        }
    );
  });

  describe('saveDashboard', function() {

    beforeEach(function() {
      spyOn(dashboardDataService, 'create');
      spyOn(dashboardDataService, 'update');
    });

    // TODO: Test "should call create with a new dashboard.".
    // TODO: Test "should call update with a dashboard that has an id.".
    // TODO: Test "should add an error when the POST request fail.".

  });
});
