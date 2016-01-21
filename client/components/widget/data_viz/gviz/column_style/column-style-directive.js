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
 * @fileoverview ColumnStyleDirective encapsulates HTML, style
 *     and behavior for configuring styles for a single column.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleDirective');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
gviz.column_style.ColumnStyleDirective = function() {
  return {
    restrict: 'E',
    transclude: false,
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '=',

      /** @type {!ChartWidgetConfig} */
      'widgetConfig': '='
    },
    templateUrl: '/static/components/widget/data_viz/gviz/column_style/column-style-directive.html',
    controller: ['$scope', 'columnStyleService', 'arrayUtilService', 'dashboardService',
        function($scope, columnStyleService, arrayUtilService, dashboardService) {

      /** @export {!ColumnStyleService} */
      $scope.columnStyleService = columnStyleService;

      /**
       * Watches for changes to the column id, and refreshes the widget if a match is made.
       */
      $scope.$watch('ngModel.column_id', (newVal, oldVal) => {
        let columnIndex;
        let dataTable = $scope.widgetConfig.state().datasource.data;

        if (newVal !== oldVal && goog.isDefAndNotNull(dataTable)) {
          let shouldRefresh = false;

          try {
            if (!goog.string.isEmptySafe(newVal)) {
              columnIndex = columnStyleService.getColumnIndex(newVal, dataTable);

              if (columnIndex !== -1) {
                shouldRefresh = true;
              }
            }

            if (!goog.string.isEmptySafe(oldVal)) {
              columnIndex = columnStyleService.getColumnIndex(oldVal, dataTable);

              if (columnIndex !== -1) {
                dataTable.setColumnLabel(columnIndex, oldVal);
                dataTable.setColumnProperty(columnIndex, 'role', '');
                shouldRefresh = true;
              }
            }
          } finally {
            if (shouldRefresh) {
              dashboardService.refreshWidget($scope.widgetConfig);
            }
          }
        }
      });

      /**
       * Returns true if the column is a series, otherwise false.
       * @return {boolean}
       */
      $scope.isASeries = function() {
        return (columnStyleService.isColumnASeries(
            $scope.widgetConfig, $scope.ngModel));
      }

      /**
       * Returns true if the column provided by ngModel is selected, otherwise false.
       * @return {boolean}
       */
      $scope.isSelected = function() {
        return (columnStyleService.selectedColumn == $scope.ngModel);
      }

      /**
       * Removes the column provided by ngModel from the widget config.
       */
      $scope.remove = function() {
        columnStyleService.removeColumn($scope.widgetConfig, $scope.ngModel);
      }

      /**
       * Selects the column provided by ngModel.
       */
      $scope.select = function() {
        columnStyleService.selectedColumn = $scope.ngModel;
      }

      /**
       * Returns true if the column id exists in the dataTable, otherwise false.
       */
      $scope.isValid = function() {
        return (columnStyleService.getColumnIndex(
            $scope.ngModel.column_id,
            $scope.widgetConfig.state().datasource.data) !== -1);
      }
    }]
  };
};

});  // goog.scope
