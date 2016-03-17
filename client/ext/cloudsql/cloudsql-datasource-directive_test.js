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
 * @fileoverview Tests for QueryBuilderDatasourceConfigDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.ext.bigquery.CloudsqlDatasourceDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetModel');

describe('CloudsqlDatasourceDirective', function() {
  // declare these up here to be global to all tests
  var scope, $compile, $timeout, uiConfig;
  var configService, dashboardService;

  const explorer = p3rf.perfkit.explorer;
  const ChartWidgetModel = explorer.models.ChartWidgetModel;

  beforeEach(module('explorer'));
  beforeEach(module('pkx.bigquery'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_,
      _configService_, _dashboardService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;

    configService = _configService_;
    dashboardService = _dashboardService_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        scope.providedWidgetModel = new ChartWidgetModel();

        var actualElement = angular.element(
          '<cloudsql-datasource ng-model="providedWidgetModel" />');

        $compile(actualElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });

    it('should contain the expected elements.', function() {
      scope.widgetModel = new ChartWidgetModel();

      var actualElement = angular.element(
        '<cloudsql-datasource ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();

      var instanceElement = actualElement.find(
        'input.widget_datasource_instance');
      expect(instanceElement.length).toBe(1);

      var databaseNameElement = actualElement.find(
        'input.widget_datasource_database_name');
      expect(databaseNameElement.length).toBe(1);
    });
  });
});
