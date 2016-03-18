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
 * v11  2016-Mar    Adds datasource.type to distinguish backend datasources.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV11');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');
goog.require('p3rf.perfkit.explorer.models.DatasourceType');
goog.require('p3rf.perfkit.explorer.models.WidgetType');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const DashboardVersionUtil = explorer.components.dashboard.versions.DashboardVersionUtil;
  const DatasourceType = explorer.models.DatasourceType;
  const WidgetType = explorer.models.WidgetType;


  /**
   * @constructor
   */
  explorer.components.dashboard.versions.DashboardSchemaV11 = function() {
    this.version = '11';
  };
  const DashboardSchema = (
      explorer.components.dashboard.versions.DashboardSchemaV11);

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(
        dashboard, null, function(widget) {
      if (!goog.isDefAndNotNull(widget.datasource.type)) {
        return false;
      }
      
      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      switch (widget.type) {
        case WidgetType.TEXT:
          widget.datasource.type = DatasourceType.TEXT;
          break;
        default:
          widget.datasource.type = DatasourceType.BIGQUERY;
      }
    });
  };
});
