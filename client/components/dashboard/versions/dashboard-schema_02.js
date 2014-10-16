/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
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


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2 = function() {
    this.version = '2';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2;

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

      // If a querystring is present, apply it to the config object.
      if (widget.datasource.querystring) {
        QueryConfigModel.applyQueryString(
            widget.datasource.config,
            widget.datasource.querystring);
        delete widget.datasource.querystring;
      }
    });
  };
});
