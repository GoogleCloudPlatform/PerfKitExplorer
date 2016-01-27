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
 * @fileoverview QueryBuilderColumnConfigDirective encapsulates HTML, style
 *     and behavior for widget query columns.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderColumnConfigDirective');

goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.FieldResult');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.LabelResult');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const FieldResult = explorer.models.perfkit_simple_builder.FieldResult;
const LabelResult = explorer.models.perfkit_simple_builder.LabelResult;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.widget.query.builder.QueryBuilderColumnConfigDirective = function(
    queryEditorService, dashboardService) {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      /** @type {!ChartWidgetConfig} */
      ngModel: '='
    },
    templateUrl: '/static/components/widget/query/builder/query-builder-column-config-directive.html',
    controller: ['$scope', function($scope) {
      /** @export {!QueryEditorService} */
      $scope.queryEditorSvc = queryEditorService;

      /** @export */
      $scope.rewriteQuery = function() {
        dashboardService.rewriteQuery($scope.ngModel);
      };

      /**
       * Adds a new option to the field list.
       * @export
       */
      $scope.addFieldColumn = function() {
        $scope.ngModel.datasource.config.results.fields.push(new FieldResult());
      };

      /**
       * Adds a new option to the measure list.
       * @export
       */
      $scope.addMeasureColumn = function() {
        $scope.ngModel.datasource.config.results.measures.push(new FieldResult());
      };

      /**
       * Adds a new option to the metadata list.
       * @export
       */
      $scope.addMetadataColumn = function() {
        $scope.ngModel.datasource.config.results.labels.push(new LabelResult());
      };
    }]
  };
};

});  // goog.scope
