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
 * @fileoverview Tests for ChartConfigDirective, which encapsulates the UX for
 * configuring GViz charts.
 * 
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('goog.testing.style');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartConfigDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetModel');

describe('ChartConfigDirective', function() {
  // declare these up here to be global to all tests
  var scope, $compile, $httpBackend, $timeout, uiConfig;
  var configSvc, dashboardSvc;

  var explorer = p3rf.perfkit.explorer;
  var ChartWidgetModel = explorer.models.ChartWidgetModel;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_,
       _$timeout_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        $httpBackend.expectGET(
            '/static/components/widget/data_viz/gviz/gviz-charts.json')
            .respond(200);
        $httpBackend.expectGET(
            '/static/components/widget/data_viz/gviz/chart-config-directive.html')
            .respond(200);

        scope.providedWidgetModel = new ChartWidgetModel();
        
        var directiveElement = angular.element(
            '<chart-config ng-model="providedWidgetModel" />');

        $compile(directiveElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var directiveElement;

    beforeEach(inject(function() {
      $httpBackend.expectGET(
          '/static/components/widget/data_viz/gviz/gviz-charts.json')
          .respond(200);
      $httpBackend.expectGET(
          '/static/components/widget/data_viz/gviz/chart-config-directive.html')
          .respond(200);

      scope.widgetModel = new ChartWidgetModel();
      directiveElement = angular.element(
          '<chart-config ng-model="widgetModel" />');

      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('the chart type', function() {
      var targetElement = directiveElement.find(
          'md-select.widget-chart-type');
      expect(targetElement.length).toBe(1);
    });

    it('config for non-table charts', function() {
      var targetElement = directiveElement.find(
          'div.widget-chart-nontable-options');
      expect(targetElement.length).toBe(1);
    });

    it('the legend alignment', function() {
      var targetElement = directiveElement.find(
          'md-select.widget-chart-legend-alignment');
      expect(targetElement.length).toBe(1);
    });

    it('the legend max lines', function() {
      var targetElement = directiveElement.find(
          'input.widget-chart-legend-maxlines');
      expect(targetElement.length).toBe(1);
    });

    it('the legend position', function() {
      var targetElement = directiveElement.find(
          'md-select.widget-chart-legend-position');
      expect(targetElement.length).toBe(1);
    });

    it('the top of the chart area', function() {
      var targetElement = directiveElement.find(
          'input.widget-chart-area-top');
      expect(targetElement.length).toBe(1);
    });

    it('the left of the chart area', function() {
      var targetElement = directiveElement.find(
          'input.widget-chart-area-left');
      expect(targetElement.length).toBe(1);
    });

    it('the height of the chart area', function() {
      var targetElement = directiveElement.find(
          'input.widget-chart-area-height');
      expect(targetElement.length).toBe(1);
    });

    it('the width of the chart area', function() {
      var targetElement = directiveElement.find(
          'input.widget-chart-area-width');
      expect(targetElement.length).toBe(1);
    });
  });

  describe('should reflect the ngModel state for', function() {
    var chartConfig;

    beforeEach(inject(function() {
      $httpBackend.expectGET(
          '/static/components/widget/data_viz/gviz/gviz-charts.json')
          .respond(200);
      $httpBackend.expectGET(
          '/static/components/widget/data_viz/gviz/chart-config-directive.html')
          .respond(200);

      scope.widgetModel = new ChartWidgetModel();
      chartConfig = scope.widgetModel.chart;

      directiveElement = angular.element(
          '<chart-config ng-model="widgetModel" />');
          
      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    // TODO(joemu): Investigate failure of md-select to bind on unit tests.
    // https://github.com/angular/material/issues/2989
    xit('the chart type', function() {
      var actualElement = directiveElement.find(
          'md-select.widget-chart-type md-select-label span:first-child')[0];
      
      expect(actualElement.innerHTML).toBe('Table');

      chartConfig.chartType = 'Area';
      scope.$digest();

      expect(actualElement.innerHTML).toBe('Area');
    });

    // TODO(joemu): Investigate failure of md-select to bind on unit tests.
    // https://github.com/angular/material/issues/2989
    xit('the legend alignment', function() {
      var actualElement = directiveElement.find(
          'md-select.widget-chart-legend-alignment md-select-label ' +
          'span:first-child')[0];
      
      expect(actualElement.innerHTML).toBe('Left');

      chartConfig.options.legend.alignment = 'Top';
      scope.$digest();

      expect(actualElement.innerHTML).toBe('Top');
    });

    it('the legend max lines', function() {
      var actualElement = directiveElement.find(
          'input.widget-chart-legend-maxlines')[0];

      expect(actualElement.value).toBe('');

      chartConfig.options.legend.maxLines = 42;
      scope.$digest();

      expect(actualElement.value).toBe('42');
    });

    // TODO(joemu): Investigate failure of md-select to bind on unit tests.
    // https://github.com/angular/material/issues/2989
    xit('the legend position', function() {
      var actualElement = directiveElement.find(
          'md-select.widget-chart-legend-position md-select-label ' +
          'span:first-child')[0];

      expect(actualElement.innerHTML).toBe('Left');

      chartConfig.options.legend.position = 'Top';
      scope.$digest();

      expect(actualElement.innerHTML).toBe('Top');
    });

    it('the chart area top', function() {
      var actualElement = directiveElement.find(
          'input.widget-chart-area-top')[0];
      
      expect(actualElement.value).toBe('');
      
      chartConfig.options.chartArea.top = 42;
      scope.$digest();
      
      expect(actualElement.value).toBe('42');
    });

    it('the chart area left', function() {
      var actualElement = directiveElement.find(
          'input.widget-chart-area-left')[0];

      expect(actualElement.value).toBe('');

      chartConfig.options.chartArea.left = 37;
      scope.$digest();

      expect(actualElement.value).toBe('37');
    });

    it('the chart area height', function() {
      var actualElement = directiveElement.find(
          'input.widget-chart-area-height')[0];

      expect(actualElement.value).toBe('');

      chartConfig.options.chartArea.height = '42%';
      scope.$digest();

      expect(actualElement.value).toBe('42%');
    });

    it('the chart area width', function() {
      var actualElement = directiveElement.find(
          'input.widget-chart-area-width')[0];

      expect(actualElement.value).toBe('');

      chartConfig.options.chartArea.width = '37%';
      scope.$digest();

      expect(actualElement.value).toBe('37%');
    });
  });

  describe('should toggle visibility for', function() {
    var chartConfig;

    beforeEach(inject(function() {
      $httpBackend.expectGET(
          '/static/components/widget/data_viz/gviz/gviz-charts.json')
          .respond(200);
      $httpBackend.expectGET(
        '/static/components/widget/query/picklist-template.html')
        .respond(200);

      scope.widgetModel = new ChartWidgetModel();
      chartConfig = scope.widgetModel.chart;

      directiveElement = angular.element(
        '<chart-config ng-model="widgetModel" />');

      $compile(directiveElement)(scope);
      scope.$digest();
    }));

    it('the legend and chart area config', function() {
      var nontableConfigContainer = angular.element(
          directiveElement.find('div.widget-chart-nontable-options')[0]);
      expect(chartConfig.chartType).toBe('Table');
      expect(nontableConfigContainer
          .hasClass('ng-hide')).toBe(true);

      chartConfig.chartType = 'Area';
      scope.$digest();

      expect(nontableConfigContainer
          .hasClass('ng-hide')).toBe(false);
          
      chartConfig.chartType = 'Table';
      scope.$digest();

      expect(nontableConfigContainer
          .hasClass('ng-hide')).toBe(true);
    });
  });
});
