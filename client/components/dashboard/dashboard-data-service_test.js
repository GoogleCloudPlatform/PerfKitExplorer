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
 * @fileoverview Tests for the dashboardDataService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataServiceMock');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartState');
goog.require('p3rf.perfkit.explorer.models.DatasourceState');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetState');
goog.require('goog.Uri');


describe('dashboardDataService', function() {
  var explorer = p3rf.perfkit.explorer;
  var ChartState = explorer.models.ChartState;
  var DashboardConfig = explorer.components.dashboard.DashboardConfig;
  var DatasourceState = explorer.models.DatasourceState;
  var WidgetConfig = explorer.models.WidgetConfig;
  var WidgetState = explorer.models.WidgetState;
  var svc, rootScope, httpBackend, widgetFactoryService;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));
  beforeEach(module('dashboardDataServiceMock'));

  // Mock the data returned by $http
  beforeEach(inject(function($httpBackend, dashboardDataServiceMockData) {
    httpBackend = $httpBackend;
    endpoint = dashboardDataServiceMockData.endpoint;
    mockData = dashboardDataServiceMockData.data;
    httpBackend.whenGET(new RegExp(endpoint)).respond(mockData);
  }));

  beforeEach(inject(function(dashboardDataService, $rootScope,
      _widgetFactoryService_) {
        svc = dashboardDataService;
        rootScope = $rootScope;
        widgetFactoryService = _widgetFactoryService_;
      }));

  it('should initialize the appropriate objects.', function() {
    expect(svc.fetchDashboard).not.toBeNull();
    expect(typeof svc.fetchDashboard).toBe('function');
  });

  describe('fetchDashboardJsonModel', function() {

    it('should fetch a dashboard json model.', function() {
      var dashboard = null;
      var promise = svc.fetchDashboardJsonModel('test1');

      promise.then(function(data) {
        dashboard = data;
      });

      httpBackend.flush();

      var mockDashboard = mockData()[1];
      expect(dashboard).toEqual(mockDashboard);
    });

    it('should cache the dashboard json model.', function() {
      var dashboard = null;
      var dashboardCached = null;

      // Fetch the data one time
      var promise = svc.fetchDashboardJsonModel('test2');
      promise.then(function(data) {
        dashboard = data;
      });

      httpBackend.flush();

      expect(dashboard).not.toBeNull();

      // Now it should be cached
      promise = svc.fetchDashboardJsonModel('test2');
      promise.then(function(data) {
        dashboardCached = data;
      });

      // Resolve the promise
      rootScope.$apply();
      expect(dashboardCached).toBe(dashboard);
      httpBackend.verifyNoOutstandingRequest();
    });
  });


  describe('fetchDashboard', function() {

    it('should fetch a dashboard.', function() {
      var dashboard = null;
      var promise = svc.fetchDashboard('test1');

      promise.then(function(data) {
        dashboard = data;
      });

      httpBackend.flush();

      var mockDashboard = mockData()[1];
      expect(dashboard.model.id).toEqual(mockDashboard.id);
    });

    it('should return the dashboard with widgets as widget objects.',
        function() {
          var dashboard = null;
          var promise = svc.fetchDashboard('test1');

          promise.then(function(data) {
            dashboard = data;
          });

          httpBackend.flush();

          var container = dashboard.model.children[0];
          expect(container).not.toBeNull();
          expect(container.model).toBeDefined();
          expect(container.model).not.toBeNull();

          var widget = container.model.container.children[0];
          expect(widget).not.toBeNull();
          expect(widget.model).toBeDefined();
          expect(widget.model).not.toBeNull();

          var mockDashboard = mockData()[1];
          // The first widget from the first container in the JSON mock data.
          var mockWidgetData = mockDashboard.children[0].container.children[0];
          // Assert it has the same id value.
          expect(widget.model.id).toEqual(mockWidgetData.id);

          expect(widget.state).toBeDefined();
          expect(widget.state).not.toBeNull();
          expect(widget.state().datasource).toBeDefined();
          expect(widget.state().datasource).not.toBeNull();
          expect(widget.state().chart).toBeDefined();
          expect(widget.state().chart).not.toBeNull();
        }
    );

    it('should return the dashboard with widgets with parent references added.',
        function() {
          var dashboard = null;
          var promise = svc.fetchDashboard('test1');

          promise.then(function(data) {
            dashboard = data;
          });

          httpBackend.flush();

          var container = dashboard.model.children[0];
          var children = container.model.container.children;
          expect(container.state().parent).toBeNull();
          expect(children[0].state().parent).toBe(container);
          expect(children[1].state().parent).toBe(container);
        }
    );
  });

  describe('create', function() {

    it('should POST a dashboardConfig and return it with an id.', function() {
      var expectedId = '123456';
      var dashboardConfig = new DashboardConfig();
      dashboardConfig.model.id = null;

      httpBackend.whenPOST('/dashboard/create').respond(
          function(method, url, data) {
            var decoded = new goog.Uri.QueryData(data).get('data');
            var obj = angular.fromJson(decoded);
            obj.id = expectedId;
            // Simulate a success and return the dashboard with an id.
            return [200, obj];
          }
      );

      var promise = svc.create(dashboardConfig);

      var dashboardConfigReturned;
      promise.then(function(data) {
        dashboardConfigReturned = data;
      });

      httpBackend.flush();

      expect(dashboardConfigReturned.id).toEqual(expectedId);
      // Change the id of the expected dashboard to the expected id.
      dashboardConfig.model.id = expectedId;
      // Convert the dashboard config to its model form.
      var dashboardModel = widgetFactoryService.toModel(dashboardConfig);
      expect(dashboardConfigReturned).toEqual(dashboardModel);
    });

    it('should reject the promise when POST fail.', function() {
      var dashboardConfig = new DashboardConfig();

      httpBackend.whenPOST('/dashboard/create').respond(
          function(method, url, data) {
            // Simulate an error.
            return [404];
          }
      );

      var promise = svc.create(dashboardConfig);

      var success = false;
      var rejected = false;
      promise.then(function() {
        success = true;
      }, function() {
        rejected = true;
      });

      httpBackend.flush();

      expect(success).toBeFalsy();
      expect(rejected).toBeTruthy();
    });
  });

  describe('update', function() {

    it('should POST a dashboardConfig that already has an id.', function() {
      var expectedId = '123456';
      var dashboardConfig = new DashboardConfig();
      dashboardConfig.model.id = expectedId;

      var idReceived;
      httpBackend.whenPOST('/dashboard/edit?id=123456').respond(
          function(method, url, data) {
            var decoded = new goog.Uri.QueryData(data).get('data');
            var obj = angular.fromJson(decoded);
            idReceived = obj.id;
            // Simulate a success and return the dashboard with an id.
            return [200, obj];
          }
      );

      var promise = svc.update(dashboardConfig);

      var success = false;
      promise.then(function(data) {
        success = true;
      });

      httpBackend.flush();

      expect(success).toBeTruthy();
      expect(idReceived).toEqual(expectedId);
    });

    it('should reject the promise when POST fail.', function() {
      var dashboardConfig = new DashboardConfig();

      httpBackend.whenPOST('/dashboard/edit').respond(
          function(method, url, data) {
            // Simulate an error
            return [404];
          }
      );

      var promise = svc.update(dashboardConfig);

      var success = false;
      var rejected = false;
      promise.then(function() {
        success = true;
      }, function() {
        rejected = true;
      });

      httpBackend.flush();

      expect(success).toBeFalsy();
      expect(rejected).toBeTruthy();
    });
  });

  describe('delete', function() {

    it('should call the /dashboard/delete handler.', function() {
      var expectedId = '123456';

      httpBackend.whenPOST('/dashboard/delete?id=123456').respond(
          function(method, url, data) {
            return [200, null];
          }
      );

      var promise = svc.delete(expectedId);

      var success = false;
      promise.then(function(data) {
        success = true;
      });

      httpBackend.flush();

      expect(success).toBeTruthy();
    });

    it('should reject the promise when POST fail.', function() {
      var expectedId = '123456';

      httpBackend.whenPOST('/dashboard/delete?id=123456').respond(
          function(method, url, data) {
            // Simulate an error
            return [404];
          }
      );

      var promise = svc.delete(expectedId);

      var success = false;
      var rejected = false;
      promise.then(function() {
        success = true;
      }, function() {
        rejected = true;
      });

      httpBackend.flush();

      expect(success).toBeFalsy();
      expect(rejected).toBeTruthy();
    });
  });

  describe('copy', function() {

    it('should call the /dashboard/copy handler.', function() {
      var expectedId = '123456';

      httpBackend.whenPOST('/dashboard/copy?id=123456').respond(
          function(method, url, data) {
            return [200, null];
          }
      );

      var promise = svc.copy(expectedId);

      var success = false;
      promise.then(function(data) {
        success = true;
      });

      httpBackend.flush();

      expect(success).toBeTruthy();
    });

    it('should pass the title parameter when provided.', function() {
      var expectedId = '123456';
      var expectedTitle = 'test';

      httpBackend.whenPOST('/dashboard/copy?id=123456&title=test').respond(
          function(method, url, data) {
            return [200, null];
          }
      );

      var promise = svc.copy(expectedId, expectedTitle);

      var success = false;
      promise.then(function(data) {
        success = true;
      });

      httpBackend.flush();

      expect(success).toBeTruthy();
    });

    it('should reject the promise when POST fails.', function() {
      var expectedId = '123456';

      httpBackend.whenPOST('/dashboard/copy?id=123456').respond(
          function(method, url, data) {
            // Simulate an error
            return [404];
          }
      );

      var promise = svc.copy(expectedId);

      var success = false;
      var rejected = false;
      promise.then(function() {
        success = true;
      }, function() {
        rejected = true;
      });

      httpBackend.flush();

      expect(success).toBeFalsy();
      expect(rejected).toBeTruthy();
    });
  });

  describe('rename', function() {

    it('should call the /dashboard/rename handler.', function() {
      var expectedId = '123456';
      var expectedTitle = 'test';

      httpBackend.whenPOST('/dashboard/rename?id=123456&title=test').respond(
          function(method, url, data) {
            return [200, null];
          }
      );

      var promise = svc.rename(expectedId, expectedTitle);

      var success = false;
      promise.then(function(data) {
        success = true;
      });

      httpBackend.flush();

      expect(success).toBeTruthy();
    });

    it('should reject the promise when POST fails.', function() {
      var expectedId = '123456';
      var expectedTitle = 'test';

      httpBackend.whenPOST('/dashboard/rename?id=123456&title=test').respond(
          function(method, url, data) {
            // Simulate an error
            return [404];
          }
      );

      var promise = svc.rename(expectedId, expectedTitle);

      var success = false;
      var rejected = false;
      promise.then(function() {
        success = true;
      }, function() {
        rejected = true;
      });

      httpBackend.flush();

      expect(success).toBeFalsy();
      expect(rejected).toBeTruthy();
    });
  });
});
