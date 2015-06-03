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
 * @fileoverview widget is an angular directive used to show a widget that
 * is bound to a WidgetModel. It can be selected and can adjust its size
 * according to the layout object defined in the model.
 *
 * Usage:
 *   <perfkit-widget class="perfkit-widget" widget-config="widgetConfig"/>
 *
 * Attributes:
 *  {p3rf.perfkit.explorer.models.WidgetConfig} widget-config
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.perfkitWidget');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.perfkitWidget = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      widgetConfig: '='
    },
    // TODO: Use templateUrl instead of hardcoded template strings.
    templateUrl: '/static/components/widget/widget-directive.html',
    link: function(scope, element, attributes) {
      var basis;

      var adjustColumnSize = function() {
        var columnspan = scope.widgetConfig.model.layout.columnspan;
        // Column size is a percent value multiply by columnspan
        basis =
            (100 / scope.widgetConfig.state().parent.model.container.columns) *
            columnspan;
        // Set minimum width multiply by columnspan
        var minWidth = perfkitWidget.MIN_COLUMN_WIDTH * columnspan;
        // Apply new style value
        scope.layoutStyle = {
          '-webkit-flex-basis': basis + '%',
          'flex-basis': basis + '%',
          'min-width': minWidth + 'px'
        };
      };
      adjustColumnSize();

      scope.$watch('widgetConfig.state().parent.model.container.columns',
          function(oldVal, newVal) {
            if (oldVal !== newVal &&
                scope.widgetConfig.state().parent.model.container.columns > 0) {
              adjustColumnSize();
            }
          }
      );

      // When the columnspan changes
      scope.$watch('widgetConfig.model.layout.columnspan',
          function(oldVal, newVal) {
            if (oldVal !== newVal &&
                scope.widgetConfig.model.layout.columnspan > 0) {
              adjustColumnSize();
            }
          }
      );
    }
  };
};
var perfkitWidget = explorer.components.widget.perfkitWidget;


/** @type {number} */
perfkitWidget.MIN_COLUMN_WIDTH = 200;

});  // goog.scope
