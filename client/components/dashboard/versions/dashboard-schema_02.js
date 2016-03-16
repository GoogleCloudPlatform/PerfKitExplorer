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
 * v2   2014-Feb    Testing release for datasource configs.  Introduces the
 *                  datasource.custom_query and datasource.config elements.
 *                  The datasource.config element supercedes
 *                  datasource.querystring, and will replace it on .update().
 *                  The owner has now been converted from an email/string
 *                  to an object with an email and nickname property.  Existing
 *                  widgets will be set to custom_query=true to avoid accidental
 *                  overwrites of custom logic.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');


goog.scope(function() {
  const DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;
  const QueryConfigModel = p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel;

  /** @constructor */
  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2 = function() {
    this.version = '2';
  };
  const DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2;

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config) ||
          !goog.isDef(widget.datasource.custom_query)) {
        return false;
      }

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    // Apply updates to each widget.
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.custom_query)) {
        widget.datasource.custom_query = !goog.string.isEmptySafe(
            widget.datasource.query);
      }

      if (!widget.datasource.config) {
        widget.datasource.config = new QueryConfigModel();
      }
    });
  };
});
