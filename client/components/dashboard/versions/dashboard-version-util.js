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
  const DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  /**
   * Updates the containers and widgets of a dashboard, based on supplied functions.
   *
   * @param dashboard The DashboardModel object to update.
   * @param {?function(container)} updateContainerFn The function to apply to each container.
   * @param {?function(widget)} updateWidgetFn The function to apply to each widget.
   */
  DashboardVersionUtil.UpdateDashboard = function(dashboard, updateContainerFn, updateWidgetFn) {
    angular.forEach(dashboard.children, function(containerConfig) {
      updateContainerFn && updateContainerFn(containerConfig.container);

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
    let container, widget = null;

    for (let i = 0, containerCount = dashboard.children.length; i < containerCount; ++i) {
      container = dashboard.children[i].container;

      if (verifyContainerFn && !verifyContainerFn(container)) {
        return false;
      }

      if (verifyWidgetFn) {
        for (let j = 0, widgetCount = container.children.length; j < widgetCount; ++j) {
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
