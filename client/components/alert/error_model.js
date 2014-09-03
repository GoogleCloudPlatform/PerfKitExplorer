/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview ErrorModel contains information on errors exposed to the user.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.error.ErrorModel');
goog.provide('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
var components = p3rf.perfkit.explorer.components;


/**
 * Static type for Error levels.
 */
components.error.ErrorTypes = function() {};
var ErrorTypes = components.error.ErrorTypes;


/** @export @type {!string} */
ErrorTypes.WARNING = 'WARNING';


/** @export @type {!string} */
ErrorTypes.SUCCESS = 'SUCCESS';


/** @export @type {!string} */
ErrorTypes.INFO = 'INFO';


/** @export @type {!string} */
ErrorTypes.DANGER = 'DANGER';


/**
 * Lists the error types by severity.
 * @export @type {Array.<!string>}
 */
ErrorTypes.All = [
  ErrorTypes.DANGER, ErrorTypes.WARNING, ErrorTypes.INFO, ErrorTypes.SUCCESS];



/**
 * @param {!string} errorType A string describing the type of alert.  See
 *     ErrorTypes.All for a list of acceptable values.
 * @param {!string} text The text to display for the error.
 * @param {?string=} opt_errorId An optional ID for the error.  Errors with
 *     an ID are replaced with another error with the same ID is added.
 * @export
 * @constructor
 */
components.error.ErrorModel = function(
    errorType, text, opt_errorId) {
  /**
   * @type {!string} A string representing the type of error.  See
   *     components.error.ErrorTypes for supported values.
   * @export
   */
  this.errorType = errorType || ErrorTypes.ERROR;

  /**
   * @type {!string} The text to display.
   * @export
    */
  this.text = text || '';

  /**
   * @type {!string|number} The unique ID, if provided, for the error.
   * @export
   */
  this.errorId = '';

  if (goog.isDef(opt_errorId)) {
    this.errorId = opt_errorId;
  }
};

});  // goog.scope