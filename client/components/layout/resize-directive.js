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
 * @fileoverview ResizeDirective is attached to an element and provides behavior
 * around drag-drop resizing.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.layout.ResizeDirective');

goog.require('p3rf.perfkit.explorer.components.layout.ResizeService');


/**
 * The ResizeDirective is an attribute that adds behavior to the element around
 * drag and drop resizing.  It supports (and requires) the following attributes:
 *
 * {!ResizeDirection} resize The direction to resize.
 * {!string} resizeElementId The Id of the element to resize.
 *
 * @param {!ResizeService} resizeService
 * @returns {!ResizeDirective}
 * @ngInject
 * @export
 * @constructor
 */
p3rf.perfkit.explorer.components.layout.ResizeDirective = function(
    resizeService) {
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, element, attr) {
          scope.resizeDirection = attr.resize.toUpperCase();

          if (!attr.resizeElementId) {
            throw 'Internal error: resizeElementId must be provided.';
          }
          scope.resizeElement = document.getElementById(attr.resizeElementId);

          if (!scope.resizeElement) {
            console.log('Internal error: resizeElement '
                        + attr.resizeElementId + ' not found.');
          }

          element.addClass(
              'perfkit2-resize-' + scope.resizeDirection.toLowerCase());

          element.on('mousedown', angular.bind(this, function(event) {
            event.preventDefault();

            resizeService.startResize(
                scope.resizeElement, scope.resizeDirection, event);
            scope.$apply();
          }));
        }
    };
};
