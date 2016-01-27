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
 * @fileoverview BigqueryWidgetService encapsulates bigquery-specific functionality
 * on widgets.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.ext.bigquery.BigqueryWidgetService');

goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorMode');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderService');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const CodeEditorMode = explorer.components.code_editor.CodeEditorMode;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @constructor
   * @ngInject
   */
  explorer.ext.bigquery.BigqueryWidgetService = class {
    constructor(arrayUtilService, configService, dashboardService, errorService,
        explorerService, queryBuilderService) {
      this.arrayUtilSvc = arrayUtilService;

      this.configSvc = configService;

      this.dashboardSvc = dashboardService;

      this.explorerSvc = explorerService;

      this.errorSvc = errorService;

      this.queryBuilderSvc = queryBuilderService;
    }


    /**
     * Rewrites the current widget's query based on the config.
     * @param {!WidgetConfig} widget The widget containing the config and datasource
     *     to write a query against.
     * @param {!DashboardConfig} dashboard The dashboard 
     */
    getSql(widget, dashboard) {
      goog.asserts.assert(widget, 'Bad parameters: widget is missing.');
      goog.asserts.assert(dashboard, 'Bad parameters: dashboard is missing.');

      let widgetConfig = widget.model.datasource.config;

      let project_name = this.arrayUtilSvc.getFirst([
          widgetConfig.results.project_id,
          dashboard.model.project_id,
          this.configSvc.default_project], false);
      if (project_name === null) {
        this.errorSvc.addDanger('Project name not found.', widget.model.id);
      }

      let dataset_name = this.arrayUtilSvc.getFirst([
          widgetConfig.results.dataset_name,
          dashboard.model.dataset_name,
          this.configSvc.default_dataset], false);
      if (dataset_name === null) {
        this.errorSvc.addDanger('Dataset name not found.', widget.model.id);
      }

      let table_name = this.arrayUtilSvc.getFirst([
          widgetConfig.results.table_name,
          dashboard.model.table_name,
          this.configSvc.default_table], false);
      if (table_name === null) {
        this.errorSvc.addDanger('Table name not found.', widget.model.id);
      }

      let table_partition = this.arrayUtilSvc.getFirst([
          widgetConfig.results.table_partition,
          dashboard.model.table_partition,
          this.dashboardSvc.DEFAULT_TABLE_PARTITION], false);
      if (table_partition === null) {
        this.errorSvc.addDanger('Table partition not found.', widget.model.id);
      }

      return this.queryBuilderSvc.getSql(
            widget.model.datasource.config,
            project_name, dataset_name, table_name, table_partition);
    };

    rewriteQuery(widget) {
      goog.asserts.assert(widget, 'Bad parameters: widget is missing.');
    }


    /**
     * Changes the widget datasource to accept a custom SQL statement.
     *
     * @param {!WidgetConfig} widget
     * @export
     */
    customizeSql(widget) {
      goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

      if (!widget.model.datasource) {
        throw new Error('Selected widget doesn\'t have a datasource property.');
      }

      widget.model.datasource.custom_query = true;
      this.explorerSvc.model.readOnly = false;
      this.explorerSvc.model.code_editor.isOpen = true;

      this.explorerSvc.model.code_editor.selectedMode = CodeEditorMode.SQL;
    };


    /**
     * Changes the widget datasource to use the Query Builder UI.
     *
     * @param {!WidgetConfig} widget
     * @export
     */
    restoreBuilder(widget) {
      goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

      widget.model.datasource.custom_query = false;
      this.rewriteQuery(widget);
    };
  };
});
