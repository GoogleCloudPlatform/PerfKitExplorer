/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview Tests for the bigqueryWidget service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderService');
goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryWidgetService');


describe('dashboardService', function() {
  const explorer = p3rf.perfkit.explorer;
  const BigqueryWidgetService = explorer.ext.bigquery.BigqueryWidgetService;
  const ConfigService = explorer.components.config.ConfigService;
  const DashboardService = explorer.components.dashboard.DashboardService;
  const ExplorerService = explorer.components.explorer.ExplorerService;
  const QueryBuilderService = explorer.components.widget.query.builder.QueryBuilderService;

  var svc, widget, container, dashboard;
  var configSvc, dashboardSvc, explorerSvc, queryBuilderSvc;
  var $location, $timeout;

  beforeEach(module('explorer'));

  beforeEach(inject(
      function(bigqueryWidgetService, configService, dashboardService, explorerService, queryBuilderService, _$rootScope_) {
    svc = bigqueryWidgetService;
    configSvc = configService;
    dashboardSvc = dashboardService;
    explorerSvc = explorerService;
    queryBuilderSvc = queryBuilderService;
    $rootScope = _$rootScope_;
  }));

  // Common injection when a dashboard is present.
  describe('', function() {

    beforeEach(inject(function() {
      explorerSvc.newDashboard();
      $rootScope.$apply();

      dashboard = dashboardSvc.current;
      container = dashboard.model.children[0];
      widget = container.model.container.children[0];
    }));

    describe('getSql', function() {

      var providedWidget, providedConfig, sampleDashboardValues,
          sampleWidgetValues;

      beforeEach(inject(function() {
        spyOn(queryBuilderSvc, 'getSql');

        providedWidget = {
          'model': {
            'datasource': {
              'custom_query': false,
              'query': '',
              'config': {
                'results': {
                  'project_id': '',
                  'dataset_name': '',
                  'table_name': '',
                  'table_partition': ''
                }
              }
            }
          }
        };

        providedConfig = providedWidget.model.datasource.config;

        configSvc.populate({
          'default_project': 'CONFIG_PROJECT',
          'default_dataset': 'CONFIG_DATASET',
          'default_table': 'CONFIG_TABLE',
          'table_partition': 'CONFIG_PARTITION'
        });

        sampleDashboardValues = {
          'project_id': 'DASH_PROJECT',
          'dataset_name': 'DASH_DATASET',
          'table_name': 'DASH_TABLE',
          'table_partition': 'DASH_PARTITION'
        };

        sampleWidgetValues = {
          'project_id': 'WIDGET_PROJECT',
          'dataset_name': 'WIDGET_DATASET',
          'table_name': 'WIDGET_TABLE',
          'table_partition': 'WIDGET_PARTITION'
        };
      }));

      it('should use widget values if available.', function() {
        providedConfig.results.project_id = sampleWidgetValues.project_id;
        providedConfig.results.dataset_name = sampleWidgetValues.dataset_name;
        providedConfig.results.table_name = sampleWidgetValues.table_name;
        providedConfig.results.table_partition = (
            sampleWidgetValues.table_partition);

        svc.getSql(providedWidget, dashboard);

        expect(queryBuilderSvc.getSql).toHaveBeenCalledWith(
            providedConfig,
            sampleWidgetValues.project_id,
            sampleWidgetValues.dataset_name,
            sampleWidgetValues.table_name,
            sampleWidgetValues.table_partition);
      });

      it('should use dashboard values if absence of widget values.', function() {
        dashboard.model.project_id = sampleDashboardValues.project_id;
        dashboard.model.dataset_name = sampleDashboardValues.dataset_name;
        dashboard.model.table_name = sampleDashboardValues.table_name;
        dashboard.model.table_partition = (
            sampleDashboardValues.table_partition);

        svc.getSql(providedWidget, dashboard);

        expect(queryBuilderSvc.getSql).toHaveBeenCalledWith(
            providedConfig,
            sampleDashboardValues.project_id,
            sampleDashboardValues.dataset_name,
            sampleDashboardValues.table_name,
            sampleDashboardValues.table_partition);
      });

      it('should use config values if absence of widget and dashboard ' +
         'values.', function() {
        svc.getSql(providedWidget, dashboard);

        expect(queryBuilderSvc.getSql).toHaveBeenCalledWith(
            providedConfig,
            configSvc.default_project,
            configSvc.default_dataset,
            configSvc.default_table,
            dashboardSvc.DEFAULT_TABLE_PARTITION);
      });

      it('should use a mix of scopes to populate values.', function() {
        dashboard.model.project_id = sampleDashboardValues.project_id;
        providedConfig.results.dataset_name = sampleWidgetValues.dataset_name;

        svc.getSql(providedWidget, dashboard);

        expect(queryBuilderSvc.getSql).toHaveBeenCalledWith(
            providedConfig,
            sampleDashboardValues.project_id,
            sampleWidgetValues.dataset_name,
            configSvc.default_table,
            dashboardSvc.DEFAULT_TABLE_PARTITION);
      });
    });
  });
});
