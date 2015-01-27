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
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');


describe('dashboardDirective', function() {
  var scope, $compile, $timeout, uiConfig;

  var explorer = p3rf.perfkit.explorer;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_, _$templateCache_, _$httpBackend_,
      _dashboardService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    $templateCache = _$templateCache_;
    dashboardService = _dashboardService_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
          $compile('<dashboard />')(scope);
      }
      expect(compile).not.toThrow();
    });
  });
});
