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
 * @fileoverview Tests for the ExplorerCtrl controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerCtrl');

describe('ExplorerCtrl', function() {
  var explorer = p3rf.perfkit.explorer;
  var ctrl, scope, rootScope, location, q, dashboardDataService;
  var httpBackend, endpoint, mockData, $controllerProvider;
  var ctrlPrototype = explorer.components.explorer.ExplorerCtrl.prototype;

  beforeEach(module('explorer'));
  beforeEach(module('dashboardDataServiceMock'));

  beforeEach(module(function(_$controllerProvider_) {
    $controllerProvider = _$controllerProvider_;
  }));

  beforeEach(inject(function($rootScope, $controller, $location, $httpBackend,
      _dashboardDataService_, $q) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        location = $location;
        q = $q;
        controller = $controller;
        httpBackend = $httpBackend;
        dashboardDataService = _dashboardDataService_;
      }));

  it('should initialize the appropriate scope objects.', function() {
    ctrl = controller(
        explorer.components.explorer.ExplorerCtrl, {$scope: scope});

    expect(ctrl.explorer).not.toBeNull();
    expect(ctrl.errors).toEqual([]);
    expect(ctrl.dashboardsAreLoading).toBeFalsy();
  });

  it('should init the dashboard when created.', function() {
    spyOn(ctrlPrototype, 'initExplorer');
    ctrl = controller(
        explorer.components.explorer.ExplorerCtrl, {$scope: scope});

    expect(ctrlPrototype.initExplorer).toHaveBeenCalled();
  });
});
