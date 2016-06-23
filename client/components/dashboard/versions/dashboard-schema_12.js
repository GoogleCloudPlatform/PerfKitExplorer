/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * V12   2016-Jun    Adds a 'tooltip' object to the chart options.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV12');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const DashboardVersionUtil = explorer.components.dashboard.versions.DashboardVersionUtil;
  const QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;

  /**
   * @constructor
   */
  explorer.components.dashboard.versions.DashboardSchemaV12 = function() {
    this.version = '12';
  };
  const DashboardSchema = (
      explorer.components.dashboard.versions.DashboardSchemaV12);

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(
        dashboard, null, function(widget) {
      if (goog.isDef(widget.chart.options.tooltip)) {
        return goog.isObject(widget.chart.options.tooltip);
      }

      return false;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.chart.options.tooltip)) {
        widget.chart.options.tooltip = {};
      }
    });
  };
});
