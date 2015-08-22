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
 * @fileoverview gviz-directive is an angular directive used to show a google
 * visualization chart corresponding to a specific query and configuration,
 * in a declarative and data-driven way. When the configuration or the
 * data change, the chart is updated. When the datasource status changes to
 * TOFETCH, the datasource query is executed and new data are fetched.
 *
 * Usage:
 *   <bound-chart widget-config="widgetConfig"/>
 *
 * Attributes:
 *  {p3rf.perfkit.explorer.models.WidgetConfig} widget-config
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.gvizChart');

goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.GvizEvents');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataTable');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataView');
goog.require('p3rf.perfkit.explorer.components.widget.query.DataViewService');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryResultDataService');
goog.require('p3rf.perfkit.explorer.models.ChartType');
goog.require('p3rf.perfkit.explorer.models.LayoutModel');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartType = explorer.models.ChartType;
const ChartWrapperService = (
    explorer.components.widget.data_viz.gviz.ChartWrapperService);
const ColumnStyleService = (
    explorer.components.widget.data_viz.gviz.column_style.ColumnStyleService);
const DataViewService = explorer.components.widget.query.DataViewService;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;
const QueryResultDataService = (
    explorer.components.widget.query.QueryResultDataService);
const ResultsDataStatus = explorer.models.ResultsDataStatus;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {angular.$timeout} $timeout
 * @param {!angular.$location} $location
 * @param {ChartWrapperService} chartWrapperService
 * @param {QueryResultDataService} queryResultDataService
 * @param {*} gvizEvents
 * @param {DataViewService} dataViewService
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.gvizChart = function(
    $timeout, $location, chartWrapperService, queryResultDataService,
    queryBuilderService, gvizEvents, dataViewService, dashboardService,
    errorService, columnStyleService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      widgetConfig: '='
    },
    templateUrl: '/static/components/widget/data_viz/gviz/gviz-directive.html',
    link: function(scope, element, attributes) {
      let isDrawing = false;
      // Create and attach to this element a gviz ChartWrapper
      let chartWrapper = chartWrapperService.create();
      chartWrapper.setContainerId(element[0].children[0]);

      scope.isDataFetching = function() {
        return scope.widgetConfig.state().datasource.status ===
            ResultsDataStatus.FETCHING;
      };

      scope.isDataFetched = function() {
        return scope.widgetConfig.state().datasource.status ===
            ResultsDataStatus.FETCHED;
      };

      scope.isLoadingDisplayed = function() {
        let widgetState = scope.widgetConfig.state();
        return (
            scope.widgetConfig.model.datasource.query && (
                widgetState.datasource.status === ResultsDataStatus.FETCHING ||
                widgetState.datasource.status === ResultsDataStatus.TOFETCH));
      };

      scope.isChartDisplayed = function() {
        let widgetState = scope.widgetConfig.state();
        return (
            widgetState.datasource.status === ResultsDataStatus.FETCHED &&
            !widgetState.chart.error);
      };

      scope.isErrorDisplayed = function() {
        let widgetState = scope.widgetConfig.state();

        return (
            widgetState.datasource.status !== ResultsDataStatus.FETCHING &&
            widgetState.chart.error);
      };

      let isHeightEnforced = function() {
        return scope.widgetConfig.model.chart.chartType !==
               ChartType.TABLE;
      };

      let isWidthEnforced = function() {
        return scope.widgetConfig.model.chart.chartType ===
               ChartType.TABLE;
      };

      let canScroll = function() {
        return scope.widgetConfig.model.chart.chartType ===
               ChartType.TABLE;
      };

      /**
       * Checks if there is an error to display, update the error state and
       * returns the error.
       */
      let checkForErrors = function() {
        let message = null;
        if (!scope.widgetConfig.model.datasource.query) {
          message = gvizChart.ERR_NO_QUERY;
        }
        else if ($location.search()['safeMode']) {
          message = gvizChart.ERR_SAFE_MODE;
        }
        else if (scope.widgetConfig.queryError) {
          message = 'query error: ' + scope.widgetConfig.queryError;
        }
        else if (scope.widgetConfig.state().datasource.status ===
                 ResultsDataStatus.NODATA) {
          message = gvizChart.ERR_NO_DATA;
        }
        else if (!scope.widgetConfig.model.chart) {
          message = gvizChart.ERR_NO_CHART_CONFIGURATION;
        }
        else if (scope.widgetConfig.state().chart.gvizError) {
          message = 'chart error: ' +
              scope.widgetConfig.state().chart.gvizError.message;
        }
        scope.widgetConfig.state().chart.error = message;
        return message;
      };

      /**
       * Triggers a draw for the chart.
       * It enforces draw to be called maximum one time per tick and after all
       * changes have been handled.
       */
      let triggerDraw = function() {
        if (!isDrawing) {
          isDrawing = true;
          $timeout(function() {
            isDrawing = false;
            draw();
          }, 0);
        }
      };

      /**
       * Draws the chart only if possible.
       */
      let draw = function() {
        // Draw only if there is data and no errors.
        // If there is a gviz error we try to draw in order to let gviz update
        // the error.
        if (scope.widgetConfig.state().datasource.status ===
            ResultsDataStatus.FETCHED &&
            (scope.widgetConfig.state().chart.gvizError || !checkForErrors())) {
          let options = angular.copy(scope.widgetConfig.model.chart.options);

          let data = scope.widgetConfig.state().datasource.data;

          // Apply styles from the config to the DataTable.
          if (data) {
            columnStyleService.applyToDataTable(
                scope.widgetConfig.model.chart.columns, data);
          }

          chartWrapper.setDataTable(data);

          // Force height and width options value with state value
          options.height = scope.widgetConfig.state().chart.height;
          options.width = scope.widgetConfig.state().chart.width;

          chartWrapper.setChartType(
              scope.widgetConfig.model.chart.chartType);
          chartWrapper.setOptions(options);
          chartWrapper.draw();

          if (scope.widgetConfig.state().chart.gvizError) {
            // After the chart is drawn, check if the gviz error is still there.
            $timeout(function() {
              // Currently, with gviz the only way to know if an error is still
              // there is to look for its id in the dom.
              if (!document.getElementById(
                  scope.widgetConfig.state().chart.gvizError.id)) {
                // Remove the error
                scope.widgetConfig.state().chart.gvizError = null;
                checkForErrors();
              }
            }, 0);
          }
        }
      };

      let adjustHeight = function() {
        if (scope.widgetConfig.model.chart) {
          if (isHeightEnforced()) {
            scope.widgetConfig.state().chart.height =
                scope.widgetConfig.state().parent.model.container.height;
          } else {
            scope.widgetConfig.state().chart.height = null;
          }
        }
      };
      adjustHeight();

      let adjustWidth = function() {
        if (scope.widgetConfig.model.chart) {
          if (isWidthEnforced()) {
            scope.widgetConfig.state().chart.width =
                element.parent().prop('offsetWidth') - 1;
          } else {
            scope.widgetConfig.state().chart.width = null;
          }
        }
      };
      adjustWidth();

      // Error handling
      gvizEvents.addListener(chartWrapper, 'error', function(error) {
        scope.widgetConfig.state().chart.gvizError = error;
        checkForErrors();
      });

      /**
       * Executes the datasource query, fetches new data and updates the chart.
       */
      let fetchData = function() {
        if (!$location.search()['safeMode'] &&
            scope.widgetConfig.model.datasource.query &&
            scope.widgetConfig.state().datasource.status ===
            ResultsDataStatus.TOFETCH) {

          scope.applyParameters();

          let promise = queryResultDataService.
              fetchResults(scope.widgetConfig.model.datasource);
          $timeout(function() {
            scope.widgetConfig.state().datasource.status =
                ResultsDataStatus.FETCHING;
          });

          promise.then(function(dataTable) {
            scope.widgetConfig.queryError = null;
            scope.widgetConfig.state().datasource.data = dataTable;

            if (dataTable.getNumberOfRows() > 0) {
              chartWrapper.setDataTable(dataTable);

              $timeout(function() {
                scope.widgetConfig.state().datasource.status =
                    ResultsDataStatus.FETCHED;
              });
            } else {
              $timeout(function() {
                scope.widgetConfig.state().datasource.status =
                    ResultsDataStatus.NODATA;
              });
            }
          });
          // Error handling
          promise.then(null, function(response) {
            $timeout(function() {
              scope.widgetConfig.state().datasource.status =
                  ResultsDataStatus.ERROR;
              scope.widgetConfig.queryError = response.error;
            });
          });
        } else {
          checkForErrors();
        }
      };

      /**
       * Applies the current parameters to the widget's query.
       *
       * If the query is a custom query, it will rewrite .query_exec to replace
       * parameter tokens with values.  If the query is a Query Builder query,
       * it will rewrite .query tokens, and .query_exec with values.
       * @export
       */
      scope.applyParameters = function() {
        let widget = scope.widgetConfig;
        if (widget.model.datasource.custom_query !== true) {
          widget.model.datasource.query = (
              dashboardService.rewriteQuery(widget, false));
          widget.model.datasource.query_exec = (
              dashboardService.rewriteQuery(widget, true));
        } else {
          widget.model.datasource.query_exec = (
              queryBuilderService.replaceTokens(widget.model.datasource.query,
              dashboardService.params));
        }
      };

      // When the datasource status change
      scope.$watch(
          function() { return scope.widgetConfig.state().datasource.status; },
          function(newVal, oldVal) {
            if (oldVal !== newVal) {
              if (newVal == ResultsDataStatus.TOFETCH) {
                fetchData();
              } else if (newVal == ResultsDataStatus.FETCHED) {
                applyDataView();
                triggerDraw();
              } else {
                checkForErrors();
              }
            }
          }
      );

      // When the chart type change
      scope.$watch('widgetConfig.model.chart.chartType', function() {
        if (scope.widgetConfig.model.chart) {
          if (canScroll()) {
            scope.widgetConfig.model.layout.cssClasses = '';
          } else {
            // Prevent overflow for charts
            scope.widgetConfig.model.layout.cssClasses =
                'pk-widget-no-overflow';
          }
        }
      });

      // When the gviz configuration change
      scope.$watch('widgetConfig.model.chart', function() {
        adjustHeight();
        adjustWidth();
        triggerDraw();
      }, true);

      let applyDataView = function() {
        let dataViewsJson = dataViewService.create(
            scope.widgetConfig.state().datasource.data,
            scope.widgetConfig.model.datasource.view,
            columnStyleService.getEffectiveColumns(
                scope.widgetConfig.model.chart.columns,
                scope.widgetConfig.state().datasource.data));

        if (dataViewsJson.error) {
          // TODO: Display error in the UI instead of in the console.
          errorService.addError(
              ErrorTypes.DANGER,
              'View parameter error on property' +
              dataViewsJson.error.property + ':' +
              dataViewsJson.error.message);
          return;
        }

        try {
          chartWrapper.setView(dataViewsJson);
          triggerDraw();
        } catch (e) {
          // TODO: Display error in the UI instead of
          // in the console.
          console.log('setView error:', e.message);
        }
      };

      // When the datasource view change
      scope.$watch('widgetConfig.model.datasource.view',
          function() {
            if (scope.widgetConfig.state().datasource.status ===
                ResultsDataStatus.FETCHED) {
              applyDataView();
            }
          },
          true // Deep equality check
      );

      // When the html element's width change, redraw the gviz chart
      scope.$watch(
          function() {
            return element.parent().prop('offsetWidth');
          },
          function(newVal, oldVal) {
            if (oldVal !== newVal) {
              adjustWidth();
              draw();
            }
          }
      );

      // When the html element's height change, redraw the gviz chart
      scope.$watch(
          function() {
            return element.parent().prop('offsetHeight');
          },
          function(newVal, oldVal) {
            if (oldVal !== newVal) {
              draw();
            }
          }
      );

      // When the layout size change
      scope.$watch('widgetConfig.state().parent.model.container.height',
          function(newVal, oldVal) {
            if (oldVal !== newVal) {
              adjustHeight();
              triggerDraw();
            }
          }
      );

      checkForErrors();
      fetchData();
    }
  };
};
let gvizChart = explorer.components.widget.data_viz.gviz.gvizChart;


/** @type {string} */
gvizChart.ERR_SAFE_MODE =
    'Query not executed because Safe Mode is active.  Remove &safeMode=1 from' +
    'the URL and refresh the page.';


/** @type {string} */
gvizChart.ERR_NO_QUERY =
    'No query provided. Please select the widget, describe a ' +
    'query to the left and press \'REFRESH\'.  Or click \'VIEW SQL\' to ' +
    'provide your own custom query.';


/** @type {string} */
gvizChart.ERR_QUERY_ERROR = 'The query returned an error.';


/** @type {string} */
gvizChart.ERR_NO_DATA = 'The results returned by the query are empty.';


/** @type {string} */
gvizChart.ERR_NO_CHART_CONFIGURATION =
    'No chart configuration provided. Please select the ' +
    'widget and select a chart type to the right.';

});  // goog.scope
