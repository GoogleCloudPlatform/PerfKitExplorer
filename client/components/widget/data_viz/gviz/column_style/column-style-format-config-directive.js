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
 * @fileoverview ColumnStyleFormatDirective encapsulates HTML, style
 *     and behavior for configuring formats for a single column.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleFormatConfigDirective');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
gviz.column_style.ColumnStyleFormatConfigDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '='
    },
    link: function(scope, element) {
      scope.setFormatParamsElement = function(formatId, replaceModel) {
        let format = scope.formatSvc.getFormat(formatId);
        let paramsElement = element.find('.column-style-format-params')[0];

        while (paramsElement.firstChild) {
          paramsElement.removeChild(paramsElement.firstChild);
        }

        paramsElement.appendChild(scope.newDirective(formatId));
      }

      scope.updateDirective(false);
    },
    templateUrl: '/static/components/widget/data_viz/gviz/column_style/column-style-format-config-directive.html',
    controller: ['$scope', '$element', '$compile', 'columnStyleFormatService',
        function($scope, $element, $compile, columnStyleFormatService) {
      $scope.formatSvc = columnStyleFormatService;

      /**
       * Watches for changes to the format, and updates model and directive
       * if the format is valid and changed.
       */
      $scope.$watch('ngModel.data_format', (newVal, oldVal) => {
        if (newVal !== oldVal) {
          $scope.updateDirective();
        }
      });

      $scope.updateDirective = function(opt_overwriteModel=true) {
        if ($scope.ngModel.data_format) {
          if (!$scope.ngModel.data_format_params || opt_overwriteModel) {
            let newModel = columnStyleFormatService.newModel(
                $scope.ngModel.data_format);
            $scope.ngModel.data_format_params = newModel;
          }
          $scope.setFormatParamsElement($scope.ngModel.data_format);
        }
      };

      $scope.newDirective = function(formatId) {
        let format = $scope.formatSvc.getFormat(formatId);
        let directiveElement = angular.element(
            '<' + format.directiveName + ' ng-model="ngModel" />');
        $compile(directiveElement)($scope);

        return directiveElement[0];
      };
    }]
  };
};

});  // goog.scope
