/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Utility functions for common UX actions.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.UxUtil');

goog.require('goog.fx.dom');
goog.require('goog.math');
goog.require('goog.style');


goog.scope(function() {

/**
 * Class used to compare two SQL queries.
 * @constructor
 */
p3rf.perfkit.explorer.UxUtil = function() {
};
var UxUtil = p3rf.perfkit.explorer.UxUtil;


/**
 * Common element ID's expected to exist on an Explorer page.
 * @enum {string}
 */
UxUtil.Elements = {
  BUTTER_BAR: 'butter'
};
var Elements = UxUtil.Elements;


/**
 * Warning levels for the butter bar.
 * @enum {string}
 */
UxUtil.WarningLevels = {
  INFO: 'info',
  ERROR: 'error'
};
var WarningLevels = UxUtil.WarningLevels;


/**
 * Default duration (in milliseconds) for show/hide transitions.
 * @type {number}
 */
UxUtil.DEFAULT_ANIM_DURATION = 250;


/**
 * Returns a reference to an element with an ID, or throws a descriptive error
 * if not found.  This is used to eliminate lots of boilerplate checks and
 * exceptions in code that generally requires this element to be present.
 *
 * @param {string} element_id The ID of the element to find.
 * @throws {string} An error that the specified element cannot be found.
 * @return {Element} The div/element matching the specified ID.
 */
UxUtil.getElement = function(element_id) {
  var element = goog.dom.getElement(element_id);
  if (!element) {
    throw 'An element with id "' + element_id + '" is required on the page.';
  }
  return element;
};


/**
 * Sets the text content of the butter bar and shows it on the page.
 * @param {string} message The text that will be set as the element's content.
 * @param {WarningLevels=} opt_warning_level The level of warning; distinguishes
 *     informational (default) from from error messages.
 */
UxUtil.showButterBar = function(message, opt_warning_level) {
  var element = UxUtil.getElement(Elements.BUTTER_BAR);
  var warning_level = (
      opt_warning_level ? opt_warning_level : UxUtil.WarningLevels.INFO);

  goog.dom.setTextContent(element, message);
  goog.dom.classes.set(element, 'butter-' + warning_level);

  UxUtil.toggleVisibility(Elements.BUTTER_BAR, true);
  UxUtil.centerElement(element);
};


/**
 * Hides the butter bar from the UX.
 */
UxUtil.hideButterBar = function() {
  var element = UxUtil.getElement(Elements.BUTTER_BAR);

  UxUtil.toggleVisibility(Elements.BUTTER_BAR, false);
};


/**
 * Centers one element inside it's parent.  This is used to center non-text
 * elements such as block DIV's without having to specify a width.  It is
 * primarily used by the butter bar.
 * @param {Element} element The element to center within it's container.
 */
UxUtil.centerElement = function(element) {
  var container = goog.dom.getParentElement(element);
  var container_size = goog.style.getSize(container);
  var element_size = goog.style.getSize(element);

  var left = (container_size.width / 2) - (element_size.width / 2);
  var top = goog.style.getPosition(element).y;

  goog.style.setPosition(element, new goog.math.Coordinate(left, top));
};


/**
 * Shows or hides an element using a transition time.
 * @param {string} element_id The ID of the element to toggle.
 * @param {boolean} show If True, shows the element.  If False, hides it.
 * @param {number=} opt_duration The duration of the animation, in milliseconds.
 * @throws {string} An error that the specified element cannot be found.
 */
UxUtil.toggleVisibility = function(element_id, show, opt_duration) {
  var element = goog.dom.getElement(element_id);

  if (!element) {
    throw ('Element ' + element_id + ' not found.');
  }
  var animation = null;
  var duration = opt_duration ? opt_duration : UxUtil.DEFAULT_ANIM_DURATION;

  if (show) {
    animation = new goog.fx.dom.FadeInAndShow(element, duration);
  } else {
    animation = new goog.fx.dom.FadeOutAndHide(element, duration);
  }

  animation.play();
};


// TODO: Expand logic to deal with Closure Library and non-text element types.
/**
 * Returns the selected text/value of an input element.
 *
 * This method is presently used to reduce boilerplate goog.dom calls, but will
 * be expanded in the future to also deal with different input control types
 * and returning appropriate attributes.
 * @param {string} element_id The ID of the element to return.
 * @throws {string} An error that the specified element cannot be found.
 * @return {string} The value of the element.
 */
UxUtil.getInputValue = function(element_id) {
  var element = goog.dom.getElement(element_id);
  if (!element) {
    throw 'Element \'' + element_id + '\' not found.';
  }

  return element.value;
};

});  // goog.scope
