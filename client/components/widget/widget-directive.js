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
 *   <perfkit-widget class="pk-widget" widget-config="widgetConfig"/>
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
 * @ngInject
 */
explorer.components.widget.perfkitWidget = function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      widgetConfig: '='
    },
    templateUrl: '/static/components/widget/widget-directive.html'
  };
};
let perfkitWidget = explorer.components.widget.perfkitWidget;


/** @type {number} */
perfkitWidget.MIN_COLUMN_WIDTH = 200;

});  // goog.scope
