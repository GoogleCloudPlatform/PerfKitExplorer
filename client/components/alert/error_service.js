/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview ErrorService is an angular service that provides
 * storage and methods for managing errors on the page.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorModel');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
var components = p3rf.perfkit.explorer.components;
var ErrorModel = components.error.ErrorModel;
var ErrorTypes = components.error.ErrorTypes;



/**
 * @param {!angular.$rootScope} $rootScope Provides access to the root scope.
 * @param {!angular.$filter} $filter Angular filter service.
 * @ngInject
 * @constructor
 */
components.error.ErrorService = function($rootScope, $filter) {
  /** @type {angular.Filter} */
  this.filter_ = $filter;

  this.rootScope_ = $rootScope;

  /**
   * @export @type {Array.<ErrorModel>}
   */
  this.errors = [];

  /**
   * @export @type {Array.<!string>}
   */
  this.errorTypes = ErrorTypes.All;

  /**
   * The worst error severity to show.  For example, WARNING would show both
   * WARNING and DANGER alerts.
   * @export @type {!string}
   */
  this.MAX_ERROR_SEVERITY = ErrorTypes.WARNING;
};
var ErrorService = components.error.ErrorService;


/**
 * Adds an error to the errors list, optionally replacing an existing one.
 *
 * If the opt_error_id flag is specified, then if an error with that ID can
 * be found, it will be replaced.  Otherwise, a new error will be added.
 *
 * @param {!string} errorType A string representing the type of error.  See
 *     components.errors.ErrorTypes for supported values.
 * @param {!string} text The text to display.
 * @param {?string=} opt_errorId The ID of the error message.  It will replace
 *     an error with the same ID.  If not provided, the error is added to the
 *     list unconditionally.
 * @return {ErrorModel} A new or existing ErrorModel.
 * @export
 */
ErrorService.prototype.addError = function(errorType, text, opt_errorId) {
  if (goog.isDef(opt_errorId)) {
    if (ErrorTypes.All.indexOf(errorType) >
        ErrorTypes.All.indexOf(this.MAX_ERROR_SEVERITY)) {
      return;
    }

    var existingError = this.filter_('getByProperty')(
        'errorId', opt_errorId, this.errors);
    if (existingError) {
      existingError.errorType = errorType;
      existingError.text = text;
      return existingError;
    }
  }
  var error = new ErrorModel(errorType, text, opt_errorId);
  this.errors.push(error);
  return error;
};


/**
 * Removes all errors.
 * @export
 */
ErrorService.prototype.removeAllErrors = function() {
  while (this.errors.length > 0) {
    this.errors.pop();
  }
};


/**
 * Removes an error from a specific index.
 * @param {!number} errorIndex The index in the errors collection that should
 *     be removed.
 * @export
 */
ErrorService.prototype.removeErrorAt = function(errorIndex) {
  this.errors.splice(errorIndex, 1);
};


/**
 * Removes an error from the list.
 *
 * @param {!ErrorModel} error An ErrorModel instance to remove.
 * @export
 */
ErrorService.prototype.removeError = function(error) {
  var errorIndex = this.errors.indexOf(error);

  if (!errorIndex) {
    console.log('removeError failed: error not found:');
    console.log(error);
  } else {
    this.removeErrorAt(errorIndex);
  }
};


/**
 * Removes an error matching a specific id.
 * @param {!number} errorId The id of the error to be removed.
 */
ErrorService.prototype.removeErrorById = function(errorId) {
  var error = this.filter_('getByProperty')('errorId', errorId, this.errors);

  if (!error) {
    console.log('removeError failed: id "' + errorId + '" not found.');
    return;
  }

  this.removeError(error);
};

});  // goog.scope
