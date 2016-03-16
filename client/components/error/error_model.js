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
 * @fileoverview ErrorModel contains information on errors exposed to the user.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.error.AllErrorTypes');
goog.provide('p3rf.perfkit.explorer.components.error.ErrorModel');
goog.provide('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
const components = p3rf.perfkit.explorer.components;


/**
 * Static type for Error levels.
 * @enum {string}
 */
components.error.ErrorTypes = {
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  INFO: 'INFO',
  DANGER: 'DANGER'
}
const ErrorTypes = components.error.ErrorTypes;


/**
 * Lists the error types by severity.
 * @export {!Array.<!ErrorTypes>}
 */
components.error.AllErrorTypes = [
  ErrorTypes.DANGER, ErrorTypes.WARNING, ErrorTypes.INFO, ErrorTypes.SUCCESS];
const AllErrorTypes = components.error.AllErrorTypes;



/**
 * @param {!ErrorTypes} errorType A string describing the type of alert.
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
  this.errorType = errorType || ErrorTypes.DANGER;

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
    this.errorId = /** @type {string} */ (opt_errorId);
  }
};

});  // goog.scope
