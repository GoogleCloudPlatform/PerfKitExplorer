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
 * @fileoverview ExplorerHeaderDirective encapsulates HTML, style and behavior
 *     for the page header of Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerHeaderDirective');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.explorer.ExplorerHeaderDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/static/components/explorer/explorer-header-directive.html',
    controllerAs: 'ctrl',
    controller: function($scope, $modal,
        explorerService, dashboardService, errorService) {
      /** @export */
      this.explorer = explorerService;

      /** @private */
      this.modal_ = $modal;

      /** @export */
      this.dashboard = dashboardService;

      /** @export */
      this.dashboards = this.explorer.model.dashboards;

      /** @export */
      this.errorService = errorService;

      /** @export */
      this.currentMode = 'dashboard';

      /** @export */
      this.modes = ['dashboard', 'container', 'widget'];


      /** @export */
      this.selectedContainer = dashboardService.selectedContainer;
      $scope.$watch(
          function() { return dashboardService.selectedContainer; },
          angular.bind(this, function() {
            this.selectedContainer = dashboardService.selectedContainer;

            if (this.selectedContainer &&
                !this.selectedWidget && !this.explorer.model.readOnly) {
              this.currentMode = 'container';
            }
          }));

      /** @export */
      this.selectedWidget = dashboardService.selectedWidget;
      $scope.$watch(
          function() { return dashboardService.selectedWidget; },
          angular.bind(this, function() {
            this.selectedWidget = dashboardService.selectedWidget;

            if (this.selectedWidget && !this.explorer.model.readOnly) {
              this.currentMode = 'widget';
            }
          }));

      /** @export */
      this.deleteCurrentDashboard = function() {
        if (!this.dashboard.current.model.id) {
          console.log('deleteCurrentDashboard failed: No id set.');
          return;
        }

        if (!window.confirm(
            'Are you sure you want to delete this dashboard?')) {
          return;
        }

        var promise = this.dashboard.deleteDashboard(
            this.dashboard.current.model);

        promise.then(angular.bind(this, function(response) {
          this.openDashboardAdmin();
        }));

        promise.then(null, angular.bind(this, function(error) {
          console.log(error.message);
        }));
      };

      /** @export */
      this.saveDashboard = function(dashboard) {
        this.dashboard.saveDashboard();
      };

      /** @export */
      this.saveDashboardCopy = function(dashboard) {
        var title = window.prompt(
            'Please provide the title for your dashboard',
            this.dashboard.current.model.title);
        if (!title) { return; }

        this.dashboard.current.model.title = title;
        this.dashboard.current.model.owner = '';
        this.dashboard.saveDashboardCopy();
      };

      /** @export */
      this.createDashboard = function() {
        window.location = '/explore?';
      };

      /** @export */
      this.openDashboard = function(dashboard) {
        window.location = '/explore?dashboard=' + dashboard.id;
      };

      /** @export */
      this.openDashboardAdmin = function(dashboard) {
        window.location = '/dashboard-admin';
      };

      this.deleteContainer = function(container) {
        this.dashboard.deleteContainer(container);
      };

      /** @export */
      this.insertContainer = function() {
        this.dashboard.addContainer();
      };

      /** @export */
      this.insertContainerAt = function(index) {
        this.dashboard.addContainerAt(index);
      };

      /** @export */
      this.insertContainerBeforeSelected = function() {
        var container = this.selectedContainer;
        var index = this.dashboard.current.model.children.indexOf(container);
        this.dashboard.addContainerAt(index);
      };

      /** @export */
      this.insertContainerAfterSelected = function() {
        var container = this.selectedContainer;
        var containers = this.dashboard.current.model.children;
        var index = containers.indexOf(container);

        if (index == containers.length - 1) {
          this.dashboard.addContainer();
        } else {
          this.dashboard.addContainerAt(index + 1);
        }
      };

      /** @export */
      this.moveSelectedContainerUp = function() {
        var container = this.selectedContainer;
        var containers = this.dashboard.current.model.children;
        var index = containers.indexOf(container);

        if (index == 0 || containers.length == 0) { return; }

        goog.array.removeAt(containers, index);
        goog.array.insertAt(containers, container, index - 1);
      };

      /** @export */
      this.moveSelectedContainerDown = function() {
        var container = this.selectedContainer;
        var containers = this.dashboard.current.model.children;
        var index = containers.indexOf(container);

        if (containers.length == 0 || index == containers.length - 1) {
          return;
        }

        goog.array.removeAt(containers, index);
        goog.array.insertAt(containers, container, index + 1);
      };

      /** @export */
      this.removeSelectedContainer = function() {
        var container = this.selectedContainer;
        var containers = this.dashboard.current.model.children;
        var index = containers.indexOf(container);

        this.dashboard.removeContainer(this.selectedContainer);

        if (containers.length > 0) {
          var newContainer = null;

          if (index > containers.length - 1) {
            newContainer = containers[containers.length - 1];
          } else {
            newContainer = containers[index];
          }

          var newWidget = newContainer.model.container.children[0];
          this.dashboard.selectWidget(newWidget, newContainer);
        }
      };

      /** @export */
      this.insertWidget = function() {
        this.dashboard.addWidget(this.selectedContainer);
      };

      /** @export */
      this.insertWidgetAt = function(index) {
        this.dashboard.addWidgetAt(this.selectedContainer, index);
      };

      /** @export */
      this.insertWidgetBeforeSelected = function() {
        this.dashboard.addWidgetBefore(
            this.selectedContainer, this.selectedWidget);
      };

      /** @export */
      this.insertWidgetAfterSelected = function() {
        this.dashboard.addWidgetAfter(
            this.selectedContainer, this.selectedWidget);
      };

      /** @export */
      this.moveWidgetToPreviousContainer = function() {
        this.dashboard.moveWidgetToPreviousContainer(this.selectedWidget);
      };

      /** @export */
      this.moveWidgetToPrevious = function() {
        this.dashboard.moveWidgetToPrevious(this.selectedWidget);
      };

      /** @export */
      this.moveWidgetToNext = function() {
        this.dashboard.moveWidgetToNext(this.selectedWidget);
      };

      /** @export */
      this.moveWidgetToNextContainer = function() {
        this.dashboard.moveWidgetToNextContainer(this.selectedWidget);
      };

      /** @export */
      this.removeSelectedWidget = function() {
        this.dashboard.removeWidget(
            this.selectedWidget, this.selectedContainer);
      };

      /** @export */
      this.refreshSelectedWidget = function() {
        this.dashboard.refreshWidget(this.selectedWidget);
      };

      /** @export */
      this.editDashboard = function() {
        this.explorer.model.readOnly = false;
      };

      /** @export */
      this.downloadDashboard = function() {
        var selectedDashboard = this.dashboard.current.model;

        window.open(
                '/dashboard/view?id=' + selectedDashboard.id +
                '&filename=perfkit_dashboard_' + selectedDashboard.id + '.json')
      };

      /** @export */
      this.editConfig = function() {
        this.modal_.open({
          templateUrl: '/static/components/config/config-dialog.html',
          controller: 'ConfigDialogCtrl as dialog'
        });
};

    }
  };
};

});  // goog.scope
