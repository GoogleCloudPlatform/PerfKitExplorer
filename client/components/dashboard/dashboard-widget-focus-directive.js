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
 * @fileoverview DashboarDirective encapsulates HTML, style and behavior
 *     for displaying a focused widget on a dashboard.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardWidgetFocusDirective');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.models.ChartType');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartType = explorer.models.ChartType;
const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
const WidgetConfig = explorer.models.WidgetConfig;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @constructor
 * @ngInject
 */
explorer.components.dashboard.DashboardWidgetFocusDirective = function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      'ngModel': '='
    },
    templateUrl: '/static/components/dashboard/dashboard-widget-focus-directive.html',
    controller: [
        '$scope', 'explorerStateService', 'dashboardService', 'widgetFactoryService', 'widgetService',
        function($scope, explorerStateService, dashboardService, widgetFactoryService, widgetService) {
      /** @export */
      $scope.dashboardSvc = dashboardService;

      /** @export */
      $scope.widgetFactorySvc = widgetFactoryService;

      Object.defineProperty($scope, 'container', {
        get: function() {
          if ($scope.ngModel) {
            return $scope.ngModel.state().parent;
          } else {
            console.log('ngModel not set');
        }},
        set: function(val) { console.log('Setting container to ' + val); }
      });

      /** @export */
      $scope.clickRefreshWidget = function(event, widget) {
        dashboardService.refreshWidget(widget);
        event.stopPropagation();
      }

      /** @export */
      $scope.restoreWidget = function() {
        dashboardService.restoreWidget($scope.ngModel);
      }

      /**
       * Returns true if the widget should scroll its overflow, otherwise stretch.
       */
      $scope.isWidgetScrollable = function() {
        return widgetService.isScrollable($scope.ngModel);
      }
    }]
  };
};

});  // goog.scope
