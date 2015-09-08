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
   * @return {!Object} Directive definition object.
   * @ngInject
   */
  explorer.components.container.ContainerToolbarDirective = function(
      arrayUtilService, containerService, dashboardService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      transclude: false,
      templateUrl: '/static/components/container/container-toolbar-directive.html',
      controller: ['$scope', function($scope) {
        /** @export {!ContainerService} */
        this.containerSvc = containerService;

        /** @export {!DashboardService} */
        this.dashboardSvc = dashboardService;
      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
