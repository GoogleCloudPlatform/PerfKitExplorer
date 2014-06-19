/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview widget is an angular directive used to show a widget that
 * is bound to a WidgetModel. It can be selected and can adjust its size
 * according to the layout object defined in the model.
 *
 * Usage:
 *   <dashkit-widget class="dashkit-widget" widget-config="widgetConfig"/>
 *
 * Attributes:
 *  {p3rf.dashkit.explorer.models.WidgetConfig} widget-config
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.widget.dashkitWidget');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.dashkitWidget = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      widgetConfig: '='
    },
    // TODO: Use templateUrl instead of hardcoded template strings.
    template: '<div ng-style="layoutStyle"' +
              'ng-class="{\'dashkit-widget-selected\': ' +
              'widgetConfig.state().selected}">' +
              '<div class="dashkit-widget-body ' +
              '{{ widgetConfig.model.layout.cssClasses }}" ' +
              'ng-transclude></div></div>',
    link: function(scope, element, attributes) {
      var basis;

      var adjustColumnSize = function() {
        var columnspan = scope.widgetConfig.model.layout.columnspan;
        // Column size is a percent value multiply by columnspan
        basis =
            (100 / scope.widgetConfig.state().parent.model.container.columns) *
            columnspan;
        // Set minimum width multiply by columnspan
        var minWidth = dashkitWidget.MIN_COLUMN_WIDTH * columnspan;
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
var dashkitWidget = explorer.components.widget.dashkitWidget;


/** @type {number} */
dashkitWidget.MIN_COLUMN_WIDTH = 200;

});  // goog.scope
