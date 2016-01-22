/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview ColumnStyleToolbarDirective encapsulates layout and UX
 * for the Column Style toolbar.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleToolbarDirective');

goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');

goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const gviz = explorer.components.widget.data_viz.gviz;
  const ArrayUtilService = explorer.components.util.ArrayUtilService;
  const ColumnStyleService = gviz.column_style.ColumnStyleService;
  const DashboardService = explorer.components.dashboard.DashboardService;
  const ChartWidgetConfig = explorer.models.ChartWidgetConfig;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {!Object} Directive definition object.
   * @ngInject
   */
  gviz.column_style.ColumnStyleToolbarDirective = function(
      arrayUtilService, columnStyleService, dashboardService) {
    return {
      restrict: 'E',
      scope: {
        /** @type {!ChartWidgetConfig} */
        ngModel: '='
      },
      transclude: false,
      templateUrl: '/static/components/widget/data_viz/gviz/column_style/column-style-toolbar-directive.html',
      controller: ['$scope', function($scope) {
        /** @type {!ArrayUtilService} */
        this.arrayUtilSvc = arrayUtilService;

        /** @type {!ColumnStyleService} */
        this.columnStyleSvc = columnStyleService;

        /** @type {!DashboardService} */
        this.dashboardSvc = dashboardService;
      }],
      controllerAs: 'ctrl'
    };
  };

});  // goog.scope
