/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview ExplorerPageDirective encapsulates HTML, style and behavior
 *     for the Explorer page and dashboard layout.  Although future work will
 *     encapsulate layout into a dedicated component, this directive currently
 *     maintains the resizing behavior in addition to other state.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerPageDirective');

goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.layout.ResizeService');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.explorer.ExplorerPageDirective = function(
    resizeService, explorerService, explorerStateService) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/static/components/explorer/explorer-page-directive.html',
    controllerAs: 'pageCtrl',
    controller: ['$scope', function($scope) {
      /** @export */
      $scope.isWidgetMaximized = function() {
        return (explorerStateService.widgets.selected && explorerStateService.isWidgetMaximized);
      }

      /** @export */
      $scope.explorerStateSvc = explorerStateService;
    }],
    link: function(scope, element, attr) {
      element.on('mouseup', angular.bind(this, function(event) {
        if (resizeService.isResizing) {
          resizeService.endResize();
        }
        scope.$apply();
      }));
      element.on('mousemove', angular.bind(this, function(event) {
        if (resizeService.isResizing) {
          resizeService.doResize(event);
          scope.$apply();
        }
      }));
    }
  };
};

});  // goog.scope
