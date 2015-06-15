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
      scope: {},
      transclude: false,
      templateUrl: '/static/components/container/container-toolbar-directive.html',
      controller: ['$scope', function($scope) {
        this.dashboardSvc = dashboardService;

        /**
         * Returns the index of the selected container.
         * @return {number} The index of the container, or null if no container
         *     is selected.
         */
        this.getSelectedContainerIndex = function() {
          if (this.dashboardSvc.selectedContainer === null) {
            return null;
          };

          var index = this.dashboardSvc.current.model.children.indexOf(
              this.dashboardSvc.selectedContainer);
          goog.asserts.assert(index > -1,
              'dashboardSvc.selectedContainer could not be found in the' +
              'current dashboard.');

          return index;
        };

        // TODO: Refactor container manipulation into dedicated service (#139).
        /**
         * Creates a new container and places it directly preceding the selected
         * one.
         * @export
         */
        this.insertContainerBeforeSelected = function() {
          var index = this.getSelectedContainerIndex();

          if (index === 0) {
            this.dashboardSvc.addContainerAt(0);
          } else {
            this.dashboardSvc.addContainerAt(--index);
          }
        };

        /**
         * Creates a new container and places it directly following the selected
         * one.
         * @export
         */
        this.insertContainerAfterSelected = function() {
          var index = this.getSelectedContainerIndex();
          var containers = this.dashboardSvc.current.model.children;

          if (index === containers.length - 1) {
            this.dashboardSvc.addContainer();
          } else {
            this.dashboardSvc.addContainerAt(++index);
          }
        };

        /**
         * Moves the selected container to the previous position in the list.
         * @export
         */
        this.moveSelectedContainerUp = function() {
          var index = this.getSelectedContainerIndex();
          var containers = this.dashboardSvc.current.model.children;

          if (index === 0 || containers.length === 0) { return; }

          goog.array.moveItem(containers, index, --index);
        };

        /**
         * Moves the selected container to the following position in the list.
         * @export
         */
        this.moveSelectedContainerDown = function() {
          var index = this.getSelectedContainerIndex();
          var containers = this.dashboardSvc.current.model.children;

          if (containers.length === 0 || index === containers.length - 1) {
            return;
          }

          goog.array.moveItem(containers, index, ++index);
        };

        /**
         * Removes the selected container from the list.
         * @export
         */
        this.removeSelectedContainer = function() {
          var index = this.getSelectedContainerIndex();
          var containers = this.dashboardSvc.current.model.children;

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
