goog.provide('p3rf.perfkit.explorer.components.layout.ResizeService');

goog.require('goog.math');

/**
 * @enum
 * @constructor
 */
p3rf.perfkit.explorer.components.layout.ResizeDirections = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};
var ResizeDirections = p3rf.perfkit.explorer.components.layout.ResizeDirections;


/**
 * @param {!angular.Scope}
 * @returns {!ResizeService}
 * @ngInject
 * @export
 * @constructor
 */
p3rf.perfkit.explorer.components.layout.ResizeService = function($rootScope) {
  /**
   * @private
   * @type {!angular.Scope}
   */
  this.rootScope_ = $rootScope;

  /**
   * @export
   * @type {boolean}
   */
  this.isResizing = false;

  /**
   * @export
   * @type {ResizeDirections}
   */
  this.resizeDirection = null;

  /**
   * @export
   * @type {Element}
   */
  this.dragElement = null;

  /**
   * @export
   * @type {goog.math.Coordinate=}
   */
  this.dragStartCoord = null;

  /**
   * @export
   * @type {goog.math.Size=}
   */
  this.originalSize = null;
};
var ResizeService = p3rf.perfkit.explorer.components.layout.ResizeService;

/** @export */
ResizeService.prototype.startResize = function(dragElement, resizeDirection, event) {
  this.isResizing = true;
  this.resizeDirection = resizeDirection;

  this.dragElement = dragElement;
  this.dragStartCoord = new goog.math.Coordinate(event.clientX, event.clientY);
  this.originalSize = goog.style.getSize(dragElement);
};

/** @export */
ResizeService.prototype.endResize = function() {
  this.isResizing = false;
  this.resizeDirection = null;
  this.dragElement = null;
  this.dragStartCoord = null;
  this.originalSize = null;
};

/** @export */
ResizeService.prototype.doResize = function(event) {
  var heightOffset = 0;
  var widthOffset = 0;
  var newSize = this.originalSize.clone();

  switch (this.resizeDirection) {
    case ResizeDirections.BOTTOM:
      heightOffset = event.clientY - this.dragStartCoord.y;
      newSize.height += heightOffset;
      goog.style.setStyle(this.dragElement, 'height', newSize.height + 'px');

      break;
    case ResizeDirections.TOP:
      heightOffset = this.dragStartCoord.y - event.clientY;
      newSize.height += heightOffset;
      goog.style.setStyle(this.dragElement, 'height', newSize.height + 'px');

      break;
    case ResizeDirections.RIGHT:
      widthOffset = event.clientX - this.dragStartCoord.x;
      newSize.width += widthOffset;
      goog.style.setStyle(this.dragElement, 'width', newSize.width + 'px');

      break;
    case ResizeDirections.LEFT:
      widthOffset = this.dragStartCoord.x - event.clientX;
      newSize.width += widthOffset;
      goog.style.setStyle(this.dragElement, 'width', newSize.width + 'px');

      break;
  }

  this.rootScope_.$broadcast('layoutChanged');
};
