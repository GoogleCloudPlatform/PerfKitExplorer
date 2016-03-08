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
 * @fileoverview WidgetConfigDirective encapsulates HTML, style and behavior
 *     for common widget properties.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.WidgetConfigDirective');

goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.DatasourceType');
goog.require('p3rf.perfkit.explorer.models.WidgetType');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const DatasourceType = explorer.models.DatasourceType;
const WidgetType = explorer.models.WidgetType;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.widget.WidgetConfigDirective = function(widgetFactoryService) {
  return {
    restrict: 'E',
    transclude: false,
    scope: {
      'ngModel': '='
    },
    templateUrl: '/static/components/widget/widget-config-directive.html',
    link: function(scope) {
      scope.datasourceTypes = angular.copy(DatasourceType);
      scope.widgetTypes = angular.copy(WidgetType);

      scope.changeDatasource = function() {
        switch (scope.ngModel.datasource.type) {
          case DatasourceType.TEXT:
            scope.ngModel.type = WidgetType.TEXT;
            break;
          default:
            scope.ngModel.type = WidgetType.CHART;
        }
        console.log()
      }
    }
  };
};

});  // goog.scope
