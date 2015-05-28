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
 * @fileoverview Tests for QueryResultDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('goog.testing.style');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryResultDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetModel');

describe('QueryResultDirective', function() {
  // declare these up here to be global to all tests
  var scope, $compile, $httpBackend, $timeout, uiConfig;
  var configSvc, dashboardSvc;

  var explorer = p3rf.perfkit.explorer;
  var ChartWidgetModel = explorer.models.ChartWidgetModel;

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
    dashboardSvc.addContainer();
    dashboardSvc.selectedWidget = (
      dashboardSvc.widgets[0].model.container.children[0]);
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        $httpBackend.expectGET(
          '/static/components/widget/query/picklist-template.html')
          .respond(200);

        scope.providedWidgetModel = new ChartWidgetModel();

        var actualElement = angular.element(
          '<query-result ng-model="providedWidgetModel" />');

        $compile(actualElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var actualElement;

    beforeEach(inject(function() {
      $httpBackend.expectGET('date_template.html')
        .respond(200);

      scope.widgetModel = new ChartWidgetModel();

      actualElement = angular.element(
        '<query-result ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('adding a date column', function() {
      var showDateElement = actualElement.find(
        'input.widget_results_show_date');
      expect(showDateElement.length).toBe(1);
    });

    it('the date group column', function() {
      var showDateElement = actualElement.find(
        'input.widget_results_date_group');
      expect(showDateElement.length).toBe(1);
    });
  });

  describe('should reflect the ngModel state for', function() {
    var filters;

    beforeEach(inject(function() {
      $httpBackend.expectGET(
        '/static/components/widget/query/picklist-template.html')
        .respond(200);

      scope.widgetModel = dashboardSvc.selectedWidget.model;

      results = (
        dashboardSvc.selectedWidget.model.datasource.config.results);

      actualElement = angular.element(
        '<query-result ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('adding a date column', function() {
      var showDateElement = actualElement.find(
        'input.widget_results_show_date')[0];

      expect(showDateElement.checked).toBe(true);

      results.show_date = false;
      scope.$digest();

      expect(showDateElement.checked).toBe(false);
    });

    it('the date group column', function() {
      var dateGroupElement = actualElement.find(
        'input.widget_results_date_group')[0];

      console.log(results.date_group);
      expect(dateGroupElement.value).toBe(results.date_group);

      results.date_group = 'Hour';
      scope.$digest();

      expect(dateGroupElement.value).toBe('Hour');
    });
  });

  describe('should toggle visibility for', function() {
    var filters;

    beforeEach(inject(function() {
      $httpBackend.expectGET(
        '/static/components/widget/query/picklist-template.html')
        .respond(200);

      scope.widgetModel = dashboardSvc.selectedWidget.model;

      results = (
        dashboardSvc.selectedWidget.model.datasource.config.results);

      actualElement = angular.element(
        '<query-result ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('showing the date column', function() {
      var showDateElement = actualElement.find(
        'input.widget_results_show_date')[0];
      var dateGroupElement = actualElement.find(
        'input.widget_results_date_group')[0];
      var dateGroupElementContainer = angular.element(
        dateGroupElement.parentElement.parentElement);

      expect(results.show_date).toBe(true);
      expect(dateGroupElementContainer
          .hasClass('ng-hide')).toBe(false);

      results.show_date = false;
      scope.$digest();

      expect(dateGroupElementContainer
          .hasClass('ng-hide')).toBe(true);

      results.show_date = true;
      scope.$digest();

      expect(dateGroupElementContainer
          .hasClass('ng-hide')).toBe(false);
    });
  });
});
