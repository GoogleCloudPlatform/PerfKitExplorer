/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Wrappers for google.visualization's objects. They should be
 * used in place of the google.visualization's objects in order to be able to
 * mock them when running tests. To use one, inject the corresponding angular
 * service or factory.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.GvizEvents');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartEditor');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartWrapper');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataTable');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizDataView');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * Returns the google.visualization.events object.
 * Exposed as an angular service named gvizEvents.
 *
 * @return {*}
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.GvizEvents = function() {
  return google.visualization.events;
};


/**
 * Returns the google.visualization.DataTable constructor.
 * Exposed as an angular factory named GvizDataTable.
 *
 * @return {function(new:google.visualization.DataTable, ...)}
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.getGvizDataTable = function() {
  return google.visualization.DataTable;
};


/**
 * Returns the google.visualization.GvizChartWrapper constructor.
 * Exposed as an angular factory named GvizChartWrapper.
 *
 * @return {function(new:google.visualization.ChartWrapper, ...)}
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.getGvizChartWrapper = function() {
  return google.visualization.ChartWrapper;
};


/**
 * Returns the google.visualization.ChartEditor constructor.
 * Exposed as an angular factory named GvizChartEditor.
 *
 * @return {function(new:google.visualization.ChartEditor, ...)}
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.getGvizChartEditor = function() {
  return google.visualization.ChartEditor;
};


/**
 * Returns the google.visualization.DataView constructor.
 * Exposed as an angular factory named GvizDataView.
 *
 * @return {function(new:google.visualization.DataView, ...)}
 * @ngInject
 */
explorer.components.widget.data_viz.gviz.getGvizDataView = function() {
  return google.visualization.DataView;
};

});  // goog.scope
