/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Version info class, including update and verify scripts.
 *
 * v3   2014-May    Add two new fields to datasource.config.results:
 *                  pivot (boolean): If true, the data will be pivoted.
 *                  pivot_config (PivotConfigModel): Describes the column, row and
 *                  value fields for pivot transformation.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3 = function() {
    this.version = '3';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3;

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
        return false;
      };

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
        widget.datasource.config.results.pivot = false;
        widget.datasource.config.results.pivot_config = new PivotConfigModel();
      }
    });
  };
});
