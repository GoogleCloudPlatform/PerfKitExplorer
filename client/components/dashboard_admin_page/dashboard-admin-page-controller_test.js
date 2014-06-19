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

goog.require('p3rf.dashkit.explorer.application.module');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageCtrl');
goog.require('p3rf.dashkit.explorer.components.dashboard_admin_page.DashboardAdminPageModel');

describe('DashboardAdminPageCtrl', function() {
  var explorer = p3rf.dashkit.explorer;
  var DashboardAdminPageModel =
      explorer.components.dashboard_admin_page.DashboardAdminPageModel;
  var ctrl, scope, rootScope, location, q, dashboardDataService;
  var httpBackend, endpoint, mockData;
  var ctrlPrototype =
      explorer.components.dashboard_admin_page.DashboardAdminPageCtrl.prototype;

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

        spyOn(ctrlPrototype, 'initPage');

        ctrl = $controller(
            explorer.components.dashboard_admin_page.DashboardAdminPageCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboard).not.toBeNull();
    expect(ctrl.errors).toEqual([]);
    expect(ctrl.data).not.toBeNull();
    expect(ctrl.model).not.toBeNull();
    expect(ctrl.isLoading).toBeFalsy();
  });

  it('should init the dashboard when created.', function() {
    expect(ctrlPrototype.initPage).toHaveBeenCalled();
  });

  describe('initDashboard', function() {

    it('should by default create a new container with one widget.',
        function() {
          spyOn(ctrlPrototype, 'listDashboards');

          ctrlPrototype.initPage.andCallThrough();
          ctrl.initPage();
          expect(ctrlPrototype.listDashboards).toHaveBeenCalled();
        }
    );
  });
});
