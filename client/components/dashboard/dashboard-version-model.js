/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model definition for a dashboard version.  Dashboard versions
 * contain notes, validation scripts and update scripts for models.  See
 * DashboardVersionService for more information on how versioning works.
 *
 * A DashboardVersionModel supports the following attributes:
 *   version {string} A string denoting the version #.
 *   verfy {function(DashboardModel)} A function that will return true if the
 *       model is a valid instance of the specified version.  For dashboards
 *       without a version, the newest version where .verify() returns true
 *       will be considered the "correct" version.
 *   update {function(DashboardModel)} a function that will modify the provided
 *       model to match this version #.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.dashboard.DashboardVersionModel');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * @param {?string} opt_version The string representing the version #.
 * @param {?function(!DashboardModel): !boolean} opt_verify A function
 *     returning true if the supplied DashbardModel is a valid instance of the
 *     current version, otherwise false.
 * @param {?function(!DashboardModel)=} opt_update A function that modifies the
 *     model to be a valid instance of the current version.
 * @export
 * @constructor */
explorer.components.dashboard.DashboardVersionModel = function(
    opt_version, opt_verify, opt_update) {
  /**
   * @type {?string}
   * @export
   */
  this.version = opt_version || '';

  /**
   * @type {!function(!DashboardModel): !boolean}
   * @export
   */
  this.verify = opt_verify || null;

  /**
   * @type {?function(!DashboardModel)}
   * @export
   */
  this.update = opt_update || null;
};
var DashboardVersionModel = explorer.components.dashboard.DashboardVersionModel;

});  // goog.scope
