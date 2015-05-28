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
 * @fileoverview Version info class, including update and verify scripts.
 *
 * v8   2015-May    Changes a chart's 'legend' property to an object.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV8');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');


goog.scope(function() {
  var explorer = p3rf.perfkit.explorer;
  var DashboardVersionUtil = explorer.components.dashboard.versions.DashboardVersionUtil;
  var QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;

  /**
   * @constructor
   */
  explorer.components.dashboard.versions.DashboardSchemaV8 = function() {
    this.version = '8';
  };
  var DashboardSchema = (
      explorer.components.dashboard.versions.DashboardSchemaV8);

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(
        dashboard, null, function(widget) {
      if (!goog.isDef(widget.chart.options.chartArea)) {
        return false;
      }
      
      if (goog.isDef(widget.chart.options.legend)) {
        return goog.isString(widget.chart.options.legend);
      }

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      if (goog.isDef(widget.chart.options.legend)) {
        if (goog.isString(widget.chart.options.legend)) {
          widget.chart.options.legend = {
            position: widget.chart.options.legend
          };        
        }
      } else {
        widget.chart.options.legend = {};
      }
      
      if (!goog.isDef(widget.chart.options.chartArea)) {
        widget.chart.options.chartArea = {};
      }
    });
  };
});
