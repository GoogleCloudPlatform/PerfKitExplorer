/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Version info class, including update and verify scripts.
 *
 * v8   2015-Aug    Adds a chart.columns array to store column styles.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV9');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const DashboardVersionUtil = explorer.components.dashboard.versions.DashboardVersionUtil;

  /**
   * @constructor
   */
  explorer.components.dashboard.versions.DashboardSchemaV9 = function() {
    this.version = '9';
  };
  const DashboardSchema = (
      explorer.components.dashboard.versions.DashboardSchemaV9);

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(
        dashboard, null, function(widget) {
      if (!goog.isDef(widget.chart.columns)) {
        return false;
      }

      return goog.isArray(widget.chart.columns);
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.chart.columns)) {
        widget.chart.columns = [];
      }
    });
  };
});
