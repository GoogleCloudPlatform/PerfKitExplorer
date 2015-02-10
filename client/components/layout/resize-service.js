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
 * @fileoverview ResizeService provides global state, behavior and notifications
 * for resize events.  The events are used by the FillDirective to redraw
 * explicitly sized elements (such as codemirror) in response to layout changes.
 *
 * TODO(joemu): Add protractor tests.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.layout.ResizeService');

goog.require('goog.math');
goog.require('goog.style');


goog.scope(function() {

/**
 * Enumerates the available resize directions.
 *
 * The ResizeDirection indicates the side of the resizing element that the
 * ResizeDirective is located on.  For example, a left sidebar would be
 * ResizeDirection.RIGHT, because the resizer is on the right, and dragging
 * the resizer to the right would make the element larger.
 *
 * @enum
 */
p3rf.perfkit.explorer.components.layout.ResizeDirections = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};
var ResizeDirections = p3rf.perfkit.explorer.components.layout.ResizeDirections;


/**
 * Holds state and behavior for resize-related layout events.
 * @param {!angular.Scope}
 * @returns {!ResizeService}
 * @ngInject
 * @export
 * @constructor
 */
p3rf.perfkit.explorer.components.layout.ResizeService = function($rootScope) {
  /** @private {!angular.Scope} */
  this.rootScope_ = $rootScope;

  /**
   * True if a resize is taking place, otherwise false.  A resize event
   * typically starts on mouseDown.
   * @export {boolean}
   */
  this.isResizing = false;

  /**
   * Indicates the direction of the current resize.  If isResizing is false,
   * this value has no effect.
   * @export {?ResizeDirections}
   */
  this.resizeDirection = null;

  /**
   * Indicates the resizeDirective element that is currently being dragged.
   * @export {?Element}
   */
  this.resizeElement = null;

  /**
   * Indicates the mouse's location when the current resize was started.   This
   * is used to calculate the amount to resize.
   * @export {?goog.math.Coordinate}
   */
  this.dragStartCoord = null;

  /**
   * Indicates the original size of the element.  This is used to calculate the
   * amount to resize.
   * @export {?goog.math.Size}
   */
  this.originalSize = null;
};
var ResizeService = p3rf.perfkit.explorer.components.layout.ResizeService;


/**
 * Starts a resize event.  This captures the resizeDirective being dragged,
 * the direction of the resize, the current mouse position and the current
 * size of the element being resized.
 *
 * @param {!Element} resizeElement The element being resized.
 * @param {!ResizeDirection} resizeDirection The direction that the
 *     resizeElement is being resized.
 * @param {!Event} event The event args.  The clientX and clientY properties
 *     will be evaluated.
 * @export
 */
ResizeService.prototype.startResize = function(
    resizeElement, resizeDirection, event) {
  this.isResizing = true;
  this.resizeDirection = resizeDirection;

  this.resizeElement = resizeElement;
  this.dragStartCoord = new goog.math.Coordinate(event.clientX, event.clientY);
  this.originalSize = goog.style.getSize(resizeElement);
};

/**
 * Ends the resize event, by setting isResizing to false and other values null.
 * @export
 */
ResizeService.prototype.endResize = function() {
  this.isResizing = false;
  this.resizeDirection = null;
  this.resizeElement = null;
  this.dragStartCoord = null;
  this.originalSize = null;
};


/**
 * Resizes the current resizeElement based on the current event state.
 * @param {!Event} event The event arguments.  clientX and clientY will be
 *     evaluated.
 * @export
 */
ResizeService.prototype.doResize = function(event) {
  var heightOffset = 0;
  var widthOffset = 0;
  var newSize = this.originalSize.clone();

  switch (this.resizeDirection) {
    case ResizeDirections.BOTTOM:
      heightOffset = event.clientY - this.dragStartCoord.y;
      newSize.height += heightOffset;
      goog.style.setStyle(this.resizeElement, 'height', newSize.height + 'px');

      break;
    case ResizeDirections.TOP:
      heightOffset = this.dragStartCoord.y - event.clientY;
      newSize.height += heightOffset;
      goog.style.setStyle(this.resizeElement, 'height', newSize.height + 'px');

      break;
    case ResizeDirections.RIGHT:
      widthOffset = event.clientX - this.dragStartCoord.x;
      newSize.width += widthOffset;
      goog.style.setStyle(this.resizeElement, 'width', newSize.width + 'px');

      break;
    case ResizeDirections.LEFT:
      widthOffset = this.dragStartCoord.x - event.clientX;
      newSize.width += widthOffset;
      goog.style.setStyle(this.resizeElement, 'width', newSize.width + 'px');

      break;
  }

  this.notifyLayoutChanged();
};


/**
 * Broadcasts a notification that layout has changed.
 * @export
 */
ResizeService.prototype.notifyLayoutChanged = function() {
  this.rootScope_.$broadcast('layoutChanged');
};

});
