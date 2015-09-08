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

        ctrl = $controller(
            explorer.components.dashboard.DashboardCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboard).not.toBeNull();
    expect(ctrl.errors).toEqual([]);
    expect(ctrl.dashboardIsLoading).toBeFalsy();
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
