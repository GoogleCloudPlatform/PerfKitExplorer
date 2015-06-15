/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview SidebarTabDirective encapsulates layout and UX
 * for the Explorer Sidebar's tabs.  For the content of selected
 * tabs, see ExplorerToolbarDirective.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerToolbarDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {Object} Directive definition object.
   * @ngInject
   */
  explorer.components.explorer.ExplorerToolbarDirective = function(
      dashboardService, sidebarTabService) {
    return {
      restrict: 'E',
      replace: true,
      transclude: false,
      scope: {},
      templateUrl: '/static/components/explorer/explorer-toolbar-directive.html',
      controller: ['$scope', function($scope) {
        /** @export */
        this.dashboardSvc = dashboardService;

        /** @export */
        this.tabSvc = sidebarTabService;
      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
