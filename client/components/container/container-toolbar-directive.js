/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview ContainerToolbarDirective encapsulates layout and UX
 * for the Container toolbar.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.container.ContainerToolbarDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {Object} Directive definition object.
   * @ngInject
   */
  explorer.components.container.ContainerToolbarDirective = function(
      dashboardService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '='
      },
      transclude: false,
      templateUrl: '/static/components/container/container-toolbar-directive.html',
      controller: ['$scope', function($scope) {
        this.dashboardSvc = dashboardService;

        this.deleteContainer = function(container) {
          this.dashboardSvc.deleteContainer(container);
        };

        /** @export */
        this.insertContainer = function() {
          this.dashboardSvc.addContainer();
        };

        /** @export */
        this.insertContainerAt = function(index) {
          this.dashboardSvc.addContainerAt(index);
        };

        /** @export */
        this.insertContainerBeforeSelected = function() {
          var container = this.dashboardSvcselectedContainer;
          var index = this.dashboardSvc.current.model.children.indexOf(container);
          this.dashboardSvc.addContainerAt(index);
        };

        /** @export */
        this.insertContainerAfterSelected = function() {
          var container = this.dashboardSvcselectedContainer;
          var containers = this.dashboardSvc.current.model.children;
          var index = containers.indexOf(container);

          if (index == containers.length - 1) {
            this.dashboardSvc.addContainer();
          } else {
            this.dashboardSvc.addContainerAt(index + 1);
          }
        };

        /** @export */
        this.moveSelectedContainerUp = function() {
          var container = this.dashboardSvc.selectedContainer;
          var containers = this.dashboardSvc.current.model.children;
          var index = containers.indexOf(container);

          if (index == 0 || containers.length == 0) { return; }

          goog.array.removeAt(containers, index);
          goog.array.insertAt(containers, container, index - 1);
        };

        /** @export */
        this.moveSelectedContainerDown = function() {
          var container = this.dashboardSvc.selectedContainer;
          var containers = this.dashboardSvc.current.model.children;
          var index = containers.indexOf(container);

          if (containers.length == 0 || index == containers.length - 1) {
            return;
          }

          goog.array.removeAt(containers, index);
          goog.array.insertAt(containers, container, index + 1);
        };

        /** @export */
        this.removeSelectedContainer = function() {
          var container = this.dashboardSvc.selectedContainer;
          var containers = this.dashboardSvc.current.model.children;
          var index = containers.indexOf(container);

          this.dashboardSvc.removeContainer(
              this.dashboardSvc.selectedContainer);

          if (containers.length > 0) {
            var newContainer = null;

            if (index > containers.length - 1) {
              newContainer = containers[containers.length - 1];
            } else {
              newContainer = containers[index];
            }

            var newWidget = newContainer.model.container.children[0];
            this.dashboardSvc.selectWidget(newWidget, newContainer);
          }
        };

      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
