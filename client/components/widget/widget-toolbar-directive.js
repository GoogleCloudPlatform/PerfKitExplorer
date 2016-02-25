/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview WidgetToolbarDirective encapsulates layout and UX
 * for the Widget toolbar.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.WidgetToolbarDirective');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetService');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const DashboardService = explorer.components.dashboard.DashboardService;
  const ExplorerService = explorer.components.explorer.ExplorerService;
  const WidgetService = explorer.components.widget.WidgetService;

  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {!Object} Directive definition object.
   * @ngInject
   */
  explorer.components.widget.WidgetToolbarDirective = function(
      dashboardService, explorerService, widgetService) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '='
      },
      transclude: false,
      templateUrl: '/static/components/widget/widget-toolbar-directive.html',
      controller: ['$scope', function($scope) {
        this.dashboardSvc = dashboardService;
        this.explorerSvc = explorerService;

        /** @export */
        this.cloneWidget = function() {
          this.dashboardSvc.cloneWidget(
            this.dashboardSvc.selectedWidget, this.dashboardSvc.selectedContainer);
        };

        /** @export */
        this.insertWidget = function() {
          this.dashboardSvc.addWidget(this.dashboardSvc.selectedContainer);
        };

        /** @export */
        this.insertWidgetAt = function(index) {
          this.dashboardSvc.addWidgetAt(this.dashboardSvc.selectedContainer, index);
        };

        /** @export */
        this.insertWidgetBeforeSelected = function() {
          this.dashboardSvc.addWidgetBefore(
              this.dashboardSvc.selectedContainer, this.dashboardSvc.selectedWidget);
        };

        /** @export */
        this.insertWidgetAfterSelected = function() {
          this.dashboardSvc.addWidgetAfter(
              this.dashboardSvc.selectedContainer, this.dashboardSvc.selectedWidget);
        };

        /** @export */
        this.moveWidgetToPreviousContainer = function() {
          this.dashboardSvc.moveWidgetToPreviousContainer(this.dashboardSvc.selectedWidget);
        };

        /** @export */
        this.moveWidgetToPrevious = function() {
          this.dashboardSvc.moveWidgetToPrevious(this.dashboardSvc.selectedWidget);
        };

        /** @export */
        this.moveWidgetToNext = function() {
          this.dashboardSvc.moveWidgetToNext(this.dashboardSvc.selectedWidget);
        };

        /** @export */
        this.moveWidgetToNextContainer = function() {
          this.dashboardSvc.moveWidgetToNextContainer(this.dashboardSvc.selectedWidget);
        };

        /** @export */
        this.removeSelectedWidget = function() {
          let target = this.dashboardSvc.selectedWidget;
          let msg = widgetService.getDeleteWarningMessage(target);

          if (!window.confirm(msg)) {
            return;
          }

          this.dashboardSvc.removeWidget(target, this.dashboardSvc.selectedContainer);
        };

        /** @export */
        this.refreshSelectedWidget = function() {
          this.dashboardSvc.refreshWidget(this.dashboardSvc.selectedWidget);
        };

      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
