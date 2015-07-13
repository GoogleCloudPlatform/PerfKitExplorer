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
 * v5   2014-Oct    Adds 'writers' array to the dashboard, which lists the email
 *                  addresses that can modify the dashboard.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */


goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  const DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5 = function() {
    this.version = '5';
  };
  const DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5;

  DashboardSchema.prototype.verify = function(dashboard) {
    if (!goog.isDef(dashboard.writers)) { return false; }

    return true;
  };

  DashboardSchema.prototype.update = function(dashboard) {
    if (!goog.isDef(dashboard.writers)) {
      dashboard.writers = [];
    }
  };
});
