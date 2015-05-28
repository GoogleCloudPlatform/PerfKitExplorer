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
 * @fileoverview QueryResultDirective encapsulates HTML, style and behavior
 *     for widget query filters.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryResultDirective');

goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.FieldResult');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.LabelResult');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var FieldResult = explorer.models.perfkit_simple_builder.FieldResult;
var LabelResult = explorer.models.perfkit_simple_builder.LabelResult;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.query.QueryResultDirective = function(
    queryEditorService) {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      /** @type {!ChartWidgetModel} */
      'ngModel': '='
    },
    templateUrl: '/static/components/widget/query/query-result-directive.html',
    controller: function($scope) {
      /** @export {!QueryEditorService} */
      $scope.queryEditorSvc = queryEditorService;

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
       * @expose
       */
      $scope.addMetadataColumn = function() {
        $scope.ngModel.datasource.config.results.labels.push(new LabelResult());
      };
    }
  };
};

});  // goog.scope
