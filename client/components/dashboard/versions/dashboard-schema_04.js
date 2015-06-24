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
 * v4   2014-May    Adds additional fields to datasource.config.results:
 *                  show_date (boolean): If true, the date column will be displayed.
 *                  date_group (string): Modified.  Now supports Hour, Day, Week,
 *                  Month, Year.
 *                  fields (Array.<string>): A list of fields to return.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  const DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4 = function() {
    this.version = '4';
  };
  const DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4;

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.show_date)) {
        return false;
      };

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.show_date)) {
        let oldGrouping = widget.datasource.config.results.date_group;
        widget.datasource.config.results.show_date = false;
        widget.datasource.config.results.date_group = '';

        switch (oldGrouping) {
          case 'Daily':
            widget.datasource.config.results.show_date = true;
            widget.datasource.config.results.date_group = 'DAY';
            break;
          case 'Weekly':
            widget.datasource.config.results.show_date = true;
            widget.datasource.config.results.date_group = 'WEEK';
            break;
        }
      }

      if (!goog.isDef(widget.datasource.config.results.fields)) {
        widget.datasource.config.results.fields = [];
      }

      if (!goog.isDef(widget.datasource.config.results.measures)) {
        widget.datasource.config.results.measures = [];
      }
    });
  };
});
