/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Tests for ColumnStyleDirective, which provides UX for managing
 * column formatting, roles and titles.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleDirective');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');


describe('ColumnStyleDirective', function() {
  // declare these up here to be global to all tests
  var scope, $compile, $timeout, $httpBackend, uiConfig;
  var configService, columnStyleService, dashboardService;

  const explorer = p3rf.perfkit.explorer;
  const ColumnStyleModel = explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_,
      _$httpBackend_, _configService_, _dashboardService_,
      _explorerService_, _columnStyleService_) {
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;

    scope = _$rootScope_.$new();
    scope.providedModel = new ColumnStyleModel();

    configSvc = _configService_;
    dashboardSvc = _dashboardService_;
    columnStyleSvc = _columnStyleService_;
    explorerSvc = _explorerService_;

    explorerSvc.newDashboard();
    scope.$digest();
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        var actualElement = angular.element(
            '<column-style ng-model="providedWidgetModel" />');

        $compile(actualElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var actualElement;

    beforeEach(inject(function() {
      actualElement = angular.element(
        '<column-style ng-model="providedModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('the column id', function() {
      var targetElement = actualElement.find(
        'input.widget-column-style-id');
      expect(targetElement.length).toBe(1);
    });

    it('the title', function() {
      var targetElement = actualElement.find(
        'input.widget-column-style-title');
      expect(targetElement.length).toBe(1);
    });
  });

  describe('should reflect the ngModel state for', function() {
    var columns;

    beforeEach(inject(function() {
      actualElement = angular.element(
        '<column-style ng-model="providedModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('the column id', function() {
      var columnIdElement = actualElement.find(
        'input.widget-column-style-id')[0];
      var expectedId = 'COLUMN_ID';

      expect(columnIdElement.value).toBe('');

      scope.providedModel.column_id = expectedId;
      scope.$digest();

      expect(columnIdElement.value).toBe(expectedId);
    });

    it('the title', function() {
      var columnTitleElement = actualElement.find(
        'input.widget-column-style-title')[0];
      var expectedTitle = 'TITLE';

      expect(columnTitleElement.value).toBe('');

      scope.providedModel.title = expectedTitle;
      scope.$digest();

      expect(columnTitleElement.value).toBe(expectedTitle);
    });
  });
});
