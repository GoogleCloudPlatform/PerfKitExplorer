/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Version info class, including update and verify scripts.
 *
 * v5   2014-Oct    Adds 'writers' array to the dashboard, which lists the email
 *                  addresses that can modify the dashboard.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5 = function() {
    this.version = '5';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5;

  DashboardSchema.prototype.verify = function(dashboard) {
    if (!goog.isDef(dashboard.writers)) { return false; }

    return true;
  };

  DashboardSchema.prototype.update = function(dashboard) {
    if (!goog.isDef(dashboard.writers)) {
      dashboard.writers = [];
    }
  };
});
