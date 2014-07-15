/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Tests for the DashboardController controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardCtrl');

describe('DashboardCtrl', function() {
  var explorer = p3rf.perfkit.explorer;
  var DashboardConfig = explorer.models.DashboardConfig;
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
        spyOn(ctrlPrototype, 'fetchDashboard').andCallThrough();

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
          ctrlPrototype.initDashboard.andCallThrough();
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
          ctrlPrototype.initDashboard.andCallThrough();
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
