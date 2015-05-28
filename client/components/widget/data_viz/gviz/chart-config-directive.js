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
 * @fileoverview ChartConfigDirective encapsulates HTML, style and behavior
 *     for the gviz chart config.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartConfigDirective');

goog.require('p3rf.perfkit.explorer.models.ChartWidgetModel');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ChartWidgetModel = explorer.models.ChartWidgetModel;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.data_viz.gviz.ChartConfigDirective = function(
    chartWrapperService, dashboardService) {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      /** @type {!ChartWidgetModel} */
      'ngModel': '='
    },
    templateUrl: '/static/components/widget/data_viz/gviz/chart-config-directive.html',
    controller: function($scope) {
      /** @export */
      $scope.chartSvc = chartWrapperService;

      /** @export */
      $scope.dashboardSvc = dashboardService;
    }
  };
};

});  // goog.scope
