/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Utility methods for updating and verifying dashboards.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');

goog.scope(function() {
  /**
   * @constructor
   */
  p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil = function() {};
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  /**
   * Updates the containers and widgets of a dashboard, based on supplied functions.
   *
   * @param dashboard The DashboardModel object to update.
   * @param {?function(container)} updateContainerFn The function to apply to each container.
   * @param {?function(widget)} updateWidgetFn The function to apply to each widget.
   */
  DashboardVersionUtil.UpdateDashboard = function(dashboard, updateContainerFn, updateWidgetFn) {
    angular.forEach(dashboard.children, function(containerConfig) {
      updateContainerFn && !updateContainerFn(containerConfig.container);

      if (updateWidgetFn) {
        angular.forEach(containerConfig.container.children, function(widget) {
          updateWidgetFn(widget);
        });
      }
    });
  };


  /**
   * Verifies the containers and widgets of a dashboard, based on supplied functions.  If any of
   * the provided verify* functions fails to return 'true', the function will return false and
   * halt the verification of widgets/containers.
   *
   * @param dashboard The DashboardModel object to update.
   * @param {?function(container)} verifyContainerFn The function to apply to each container.
   * @param {?function(widget)} verifyWidgetFn The function to apply to each widget.
   */
  DashboardVersionUtil.VerifyDashboard = function(dashboard, verifyContainerFn, verifyWidgetFn) {
    var container, widget = null;

    for (var i = 0, containerCount = dashboard.children.length; i < containerCount; ++i) {
      container = dashboard.children[i].container;

      if (verifyContainerFn && !verifyContainerFn(container)) {
        return false;
      }

      if (verifyWidgetFn) {
        for (var j = 0, widgetCount = container.children.length; j < widgetCount; ++j) {
          widget = container.children[j];

          if (!verifyWidgetFn(widget)) {
            return false;
          }
        }
      }
    }

    return true;
  };
});
