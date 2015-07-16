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
 * @fileoverview Tests for QueryResultConfigDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryResultConfigDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetModel');

describe('QueryResultConfigDirective', function() {
  var scope, $compile, $httpBackend, $timeout, uiConfig;
  var configSvc, dashboardSvc;

  const explorer = p3rf.perfkit.explorer;
  const ChartWidgetModel = explorer.models.ChartWidgetModel;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_,
        _$timeout_, _configService_, _dashboardService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;

    configSvc = _configService_;
    dashboardSvc = _dashboardService_;
    dashboardSvc.newDashboard();
    scope.$digest();
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        scope.providedWidgetModel = new ChartWidgetModel();

        var actualElement = angular.element(
            '<query-result-config ng-model="providedWidgetModel" />');

        $compile(actualElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var actualElement;

    beforeEach(inject(function() {
      scope.widgetModel = new ChartWidgetModel();

      actualElement = angular.element(
          '<query-result-config ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('toggling the pivot', function() {
      var showDateElement = actualElement.find(
          'input.widget-results-pivot');
      expect(showDateElement.length).toBe(1);
    });
  });

  describe('should reflect the ngModel state for', function() {
    var filters;

    beforeEach(inject(function() {
      scope.widgetModel = dashboardSvc.selectedWidget.model;

      results = (
          dashboardSvc.selectedWidget.model.datasource.config.results);

      actualElement = angular.element(
          '<query-result-config ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('toggling the pivot', function() {
      var targetElement = actualElement.find(
          'input.widget-results-pivot')[0];

      expect(targetElement.checked).toBe(false);

      results.pivot = true;
      scope.$digest();

      expect(targetElement.checked).toBe(true);
    });

  });

  describe('should toggle visibility for', function() {
    var filters;

    beforeEach(inject(function() {
      scope.widgetModel = dashboardSvc.selectedWidget.model;

      results = (
        dashboardSvc.selectedWidget.model.datasource.config.results);

      actualElement = angular.element(
          '<query-result-config ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('showing the pivot config', function() {
      var pivotEnabledElement = actualElement.find(
          'input.widget-results-pivot')[0];
      var pivotConfigElement = angular.element(
          actualElement.find('div.widget-results-pivot-config')[0]);

      expect(results.pivot).toBe(false);
      expect(pivotConfigElement
          .hasClass('ng-hide')).toBe(true);

      results.pivot = true;
      scope.$digest();

      expect(pivotConfigElement
          .hasClass('ng-hide')).toBe(false);

      results.pivot = false;
      scope.$digest();

      expect(pivotConfigElement
          .hasClass('ng-hide')).toBe(true);
    });
  });
});
