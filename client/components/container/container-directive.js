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
 * @fileoverview See ContainerDirective docstring for details.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.container.ContainerDirective');

goog.scope(function() {

const explorer = p3rf.perfkit.explorer;


/**
 * ContainerDirective is an angular directive used to show a container that
 * is bound to a ContainerWidgetModel. It can contain elements and can organize
 * them visually in three different way: row, column, or wrap.
 *
 * Usage:
 *   <container class="pk-container-content"
 *              container-config="containerConfigConfig"/>
 *
 * Attributes:
 *     {p3rf.perfkit.explorer.components.container.
 *         ContainerWidgetConfig} container-config
 *
 * @return {Object} Directive definition object.
 */
explorer.components.container.ContainerDirective = function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      ngModel: '='
    },
    templateUrl: '/static/components/container/container-directive.html'
  };
};

}); // goog.scope
