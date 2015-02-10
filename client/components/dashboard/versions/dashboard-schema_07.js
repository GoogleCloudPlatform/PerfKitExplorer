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
 * v7   2015-Jan    Adds 'params' to the dashboard, allowing a list of
 *                  name/value pairs that can be overridden by URL params.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV7');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');


goog.scope(function() {
  var explorer = p3rf.perfkit.explorer;
  var DashboardVersionUtil = explorer.components.dashboard.versions.DashboardVersionUtil;
  var QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;

  explorer.components.dashboard.versions.DashboardSchemaV7 = function() {
    this.version = '7';
  };
  var DashboardSchema = (
      explorer.components.dashboard.versions.DashboardSchemaV7);

  DashboardSchema.prototype.verify = function(dashboard) {
    if (!goog.isDef(dashboard.params)) {
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

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    if (!goog.isDef(dashboard.params)) {
      dashboard.params = [];
    }

    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      // Add the filters object if it doesn't exist.
      // TODO: Replace this in the future with a PartialDashboard updater
      // that completes a miminal dashboard model.
      if (!goog.isDef(widget.datasource.config.filters)) {
        widget.datasource.config.filters = new QueryFilterModel();
      }
    });
  };
});
