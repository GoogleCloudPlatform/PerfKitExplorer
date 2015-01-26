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
 * v6   2014-Oct    Adds 'writers' array to the dashboard, which lists the email
 *                  addresses that can modify the dashboard.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV6');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');


goog.scope(function() {
  var explorer = p3rf.perfkit.explorer;
  var DashboardVersionUtil = explorer.components.dashboard.versions.DashboardVersionUtil;
  var QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV6 = function() {
    this.version = '6';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV6;

  DashboardSchema.prototype.verify = function(dashboard) {
    if (!goog.isDef(dashboard.table_partition)) {
      return false;
    }

    return DashboardVersionUtil.VerifyDashboard(
        dashboard, null, function(widget) {
      // Add the filters object if it doesn't exist.
      // TODO: Replace this in the future with a PartialDashboard updater
      // that completes a miminal dashboard model.
      if (!goog.isDef(widget.datasource.config.filters)) {
        widget.datasource.config.filters = new QueryFilterModel();
      }

      if (!goog.isDef(widget.datasource.config.results.table_partition)) {
        return false;
      }

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    if (!goog.isDef(dashboard.table_partition)) {
      dashboard.table_partition = '';
    }

    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      // Add the filters object if it doesn't exist.
      // TODO: Replace this in the future with a PartialDashboard updater
      // that completes a miminal dashboard model.
      if (!goog.isDef(widget.datasource.config.filters)) {
        widget.datasource.config.filters = new QueryFilterModel();
      }

      if (!goog.isDef(widget.datasource.config.results.table_partition)) {
        widget.datasource.config.results.table_partition = '';
      }
    });
  };
});
