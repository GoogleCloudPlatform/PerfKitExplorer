/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Version info class, including update and verify scripts.
 *
 * v1   2013-Aug    Initial release of the dashboard explorer.  Supports widgets
 *                  with datasource and chart top-level elements.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1 = function() {
    this.version = '1';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1;

  DashboardSchema.prototype.verify = function(dashboard) {
    if (!goog.isDef(dashboard.type)) { return false; }

    return true;
  };

  DashboardSchema.prototype.update = function(dashboard) {

  };
});
