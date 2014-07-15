/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
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
