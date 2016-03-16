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

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardVersionModel');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const DashboardModel = explorer.components.dashboard.DashboardModel;


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
   * @type {string}
   * @export
   */
  this.version = opt_version || '';

  /**
   * @type {?function(!DashboardModel): !boolean}
   * @export
   */
  this.verify = opt_verify || null;

  /**
   * @type {?function(!DashboardModel)}
   * @export
   */
  this.update = opt_update || null;
};
const DashboardVersionModel = explorer.components.dashboard.DashboardVersionModel;

});  // goog.scope
