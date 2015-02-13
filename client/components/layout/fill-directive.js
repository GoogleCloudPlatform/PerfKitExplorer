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
 * @fileoverview FillDirective causes an element to resize itself to fill
 * the parent container's size.  It will redraw the affected element whenever
 * the page or container is resized.
 *
 * Usage:
 *   <div fill>
 *     <ui-codemirror />
 *   </div>
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.layout.FillDirective');



goog.scope(function() {
var explorer = p3rf.perfkit.explorer;

/**
 * FillDirective is an attribute that causes an element to resize itself to
 * fill the parent container's available size.  It will resize the affected
 * element whenever the page or container is resized, or a 'layoutChanged'
 * event is broadcast.
 *
 * @param {!Angular.RootScope} rootScope The root scope, used to listen for
 *     custom events.
 * @return {Object} Directive definition object.
 */
explorer.components.layout.FillDirective = (
    function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      scope.resizeElement = function () {
        var targetElement = element[0];
        var originalDisplay = targetElement.style.display;

        try {
          targetElement.style.display = 'none';

          var container = element[0].parentNode;
          var containerStyle = window.getComputedStyle(container);

          if (containerStyle) {
            targetElement.style.height = containerStyle.height;
            targetElement.style.width = containerStyle.width;
          }
        } finally {
          targetElement.style.display = originalDisplay;
        }
      };

      window.addEventListener('resize', scope.resizeElement);
      $rootScope.$on('layoutChanged', scope.resizeElement);

      scope.resizeElement();
    }
  };
});

});
