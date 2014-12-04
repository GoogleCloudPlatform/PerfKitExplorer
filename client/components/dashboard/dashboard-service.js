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
 * @fileoverview dashboardService is an angular service used to maintain the
 * data related to the dashboard and to manage the dashboard's widgets.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardService');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryBuilderService');
goog.require('goog.array');
goog.require('goog.asserts');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ArrayUtilService = explorer.components.util.ArrayUtilService;
var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
var ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
var DashboardConfig = explorer.components.dashboard.DashboardConfig;
var DashboardDataService = explorer.components.dashboard.DashboardDataService;
var QueryBuilderService = (
    explorer.models.perfkit_simple_builder.QueryBuilderService);
var ResultsDataStatus = explorer.models.ResultsDataStatus;
var WidgetConfig = explorer.models.WidgetConfig;
var WidgetFactoryService = explorer.components.widget.WidgetFactoryService;
var WidgetType = explorer.models.WidgetType;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!ArrayUtilService} arrayUtilService
 * @param {!WidgetFactoryService} widgetFactoryService
 * @param {!DashboardDataService} dashboardDataService
 * @param {!QueryBuilderService} queryBuilderService
 * @constructor
 * @ngInject
 */
explorer.components.dashboard.DashboardService = function(arrayUtilService,
    widgetFactoryService, dashboardDataService, queryBuilderService, dashboardVersionService) {
  /**
   * @type {!ArrayUtilService}
   * @private
   */
  this.arrayUtilService_ = arrayUtilService;

  /**
   * @type {!WidgetFactoryService}
   * @private
   */
  this.widgetFactoryService_ = widgetFactoryService;

  /**
   * @type {!DashboardDataService}
   * @private
   */
  this.dashboardDataService_ = dashboardDataService;

  /**
   * @type {!DashboardVersionService}
   * @private
   */
  this.dashboardVersionService_ = dashboardVersionService;

  /**
   * @type {!QueryBuilderService}
   * @private
   */
  this.queryBuilderService_ = queryBuilderService;

  /**
   * @type {!DashboardConfig}
   * @export
   */
  this.current = this.initializeDashboard();

  /**
   * @type {!Array.<WidgetConfig>}
   * @export
   */
  this.widgets = this.current.model.children;

  /**
   * @type {WidgetConfig}
   * @export
   */
  this.selectedWidget = null;

  /**
   * @type {ContainerWidgetConfig}
   * @export
   */
  this.selectedContainer = null;

  /**
   *
   * @type {string}
   * @export
   */
  this.DEFAULT_PROJECT_ID = DEFAULT_QUERY_PROJECT_ID;

  /**
   *
   * @type {string}
   * @export
   */
  this.DEFAULT_DATASET_NAME = 'samples_mart';

  /**
   *
   * @type {string}
   * @export
   */
  this.DEFAULT_TABLE_NAME = 'results';

  /** @export @type {string} */

  /** @export @type {Array.<!ErrorModel>} */
  this.errors = [];
};
var DashboardService = explorer.components.dashboard.DashboardService;


/**
 * Initialize a new dashboard.
 */
DashboardService.prototype.initializeDashboard = function() {
  var dashboard = new DashboardConfig();
  dashboard.model.version = this.dashboardVersionService_.currentVersion.version;

  return dashboard;
}


/**
 * Saves the current dashboard on the server.
 */
DashboardService.prototype.saveDashboard = function() {
  var dashboard = this.current;

  var promise = dashboard.model.id ?
      this.dashboardDataService_.update(dashboard) :
      this.dashboardDataService_.create(dashboard);

  promise.then(angular.bind(this, function(dashboardJsonModel) {
    // If it was a create, patch the dashboard with the model returned.
    if (!dashboard.model.id) {
      // TODO: Call fetchDashboard once cleanup and reloading are working
      // as expected.
      console.log('Dashboard saved with id:', dashboardJsonModel.id);

      var uri = new goog.Uri(window.location.href);
      uri.setParameterValue('dashboard', dashboardJsonModel.id);
      uri.removeParameter('readOnly');
      window.location = uri.toString();
    }
  }));
  promise.then(null, angular.bind(this, function(error) {
    this.errors.push(error);
    console.log('Error while saving the dashboard', error);
  }));
};


/**
 * Saves a copy of the current dashboard.  If the dashboard has no ID, this
 * has the same effect as saveDashboard().
 * @export
 */
DashboardService.prototype.saveDashboardCopy = function() {
  this.current.model.id = '';
  this.saveDashboard();
};


/**
 * Set the current dashboard and the set the widgets array to reference the
 * dashboard's widgets.
 *
 * @param {!DashboardConfig} dashboardConfig
 * @export
 */
DashboardService.prototype.setDashboard = function(dashboardConfig) {
  this.current = dashboardConfig;
  if (dashboardConfig) {
    this.widgets = dashboardConfig.model.children;
  } else {
    this.widgets = [];
  }
};


/**
 * Updates the selectedWidget property, the selected state of the widgets and
 * select the widget's container.
 *
 * @param {WidgetConfig} widget
 * @param {ContainerWidgetConfig} container
 * @export
 */
DashboardService.prototype.selectWidget = function(widget, container) {
  if (this.selectedWidget) {
    this.selectedWidget.state().selected = false;
  }
  this.selectedWidget = widget;

  if (this.selectedWidget) {
    this.selectedWidget.state().selected = true;
  }
  this.selectContainer(container);
};


/**
 * Updates the selectedContainer property and the selected state of the
 * containers.
 *
 * @param {ContainerWidgetConfig} container
 * @export
 */
DashboardService.prototype.selectContainer = function(container) {
  if (this.selectedContainer) {
    this.selectedContainer.state().selected = false;
  }
  this.selectedContainer = container;

  if (this.selectedContainer) {
    this.selectedContainer.state().selected = true;
  }
};


/**
 * Rewrites the current widget's query based on the config.
 */
DashboardService.prototype.rewriteQuery = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  if (widget.model.datasource.custom_query !== true) {
    widget.model.datasource.query = this.queryBuilderService_.getSql(
        widget.model.datasource.config,
        this.current.model.project_id,
        this.current.model.dataset_name || this.DEFAULT_DATASET_NAME,
        this.current.model.table_name || this.DEFAULT_TABLE_NAME,
        this.current.model.table_partition
    );
  }
};


/**
 * Updates the widget's query, if application, and changes the widget
 * datasource status to TOFETCH.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.refreshWidget = function(widget) {
  this.rewriteQuery(widget);

  if (widget.model.datasource.query) {
    widget.state().datasource.status = ResultsDataStatus.TOFETCH;
  }
};


/**
 * Changes the widget datasource to accept a custom SQL statement.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.customizeSql = function(widget) {
  if (!widget.model.datasource) {
    throw new Error('Selected widget doesn\'t have a datasource property.');
  }

  widget.state().datasource.status = ResultsDataStatus.NODATA;

  this.rewriteQuery(widget);

  widget.model.datasource.custom_query = true;
};


/**
 * Changes the widget datasource to use the Query Builder UI.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.restoreBuilder = function(widget) {
  widget.model.datasource.query = '';
  widget.state().datasource.status = ResultsDataStatus.NODATA;
  widget.model.datasource.custom_query = false;
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @export
 */
DashboardService.prototype.addWidget = function(container) {
  this.addWidgetAt(container);
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.addWidgetAfter = function(container, widget) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');

  var index = container.model.container.children.indexOf(widget);

  this.addWidgetAt(container, ++index);
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.addWidgetBefore = function(container, widget) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');

  var index = container.model.container.children.indexOf(widget);

  this.addWidgetAt(container, index);
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @param {?number=} opt_index
 * @export
 */
DashboardService.prototype.addWidgetAt = function(container, opt_index) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');
  var children = container.model.container.children;

  var columnsTaken = 0;
  angular.forEach(children, function(widget) {
    columnsTaken += widget.model.layout.columnspan;
  });

  // If there is exactly enough columns for the current widgets
  if (columnsTaken === container.model.container.columns) {
    // Add a column for the new widget
    container.model.container.columns++;
  }

  // TODO: Add a simple widget instead of a chart when we have
  // other widget types.
  var widget = new ChartWidgetConfig(this.widgetFactoryService_);
  widget.state().datasource.status = ResultsDataStatus.NODATA;

  if (!goog.isDef(opt_index) || opt_index > children.length - 1) {
    children.push(widget);
  } else if (opt_index <= 0) {
    goog.array.insertAt(children, widget, 0);
  } else {
    goog.array.insertAt(children, widget, opt_index);
  }

  widget.state().parent = container;

  this.selectWidget(widget, container);
};


/**
 * Remove a given widget from the given container.
 *
 * @param {!WidgetConfig} widget
 * @param {!ContainerWidgetConfig} container
 * @export
 */
DashboardService.prototype.removeWidget = function(widget, container) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');
  goog.asserts.assert(container, 'Bad parameters: container is missing.');

  var index = container.model.container.children.indexOf(widget);
  container.model.container.children.splice(index, 1);

  if (container.model.container.children.length == 0) {
    this.removeContainer(container);
  } else {
    container.model.container.columns -= widget.model.layout.columnspan;
  }

  this.selectedWidget = null;
};


/**
 * Move a given widget to the specified container.
 *
 * @param {!WidgetConfig} widget
 * @param {!ContainerWidgetConfig} targetContainer
 * @export
 */
DashboardService.prototype.moveWidgetToContainer = function(
    widget, targetContainer) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');
  goog.asserts.assert(targetContainer, 'Bad parameters: container is missing.');

  var container = /** @type {ContainerWidgetConfig} */ (widget.state().parent);
  var index = container.model.container.children.indexOf(widget);
  container.model.container.children.splice(index, 1);

  if (container.model.container.children.length == 0) {
    this.removeContainer(container);
  } else {
    container.model.container.columns -= widget.model.layout.columnspan;
  }

  targetContainer.model.container.columns += widget.model.layout.columnspan;
  targetContainer.model.container.children.push(widget);
  widget.state().parent = targetContainer;
  this.selectedContainer = targetContainer;

  if (widget.state().datasource) {
    widget.state().datasource.status = ResultsDataStatus.TOFETCH;
  }
};


/**
 * Adds a new container with one new widget and select it.
 *
 * @export
 */
DashboardService.prototype.addContainer = function() {
  var container = new ContainerWidgetConfig(this.widgetFactoryService_);
  this.addWidget(container);
  this.widgets.push(container);
};


/**
 * Adds a new container with one new widget and select it.
 *
 * @param {number} index
 * @export
 */
DashboardService.prototype.addContainerAt = function(index) {
  var container = new ContainerWidgetConfig(this.widgetFactoryService_);
  this.addWidget(container);
  goog.array.insertAt(this.widgets, container, index);
};


/**
 * Removes a given container.
 *
 * @param {!ContainerWidgetConfig} container
 * @export
 */
DashboardService.prototype.removeContainer = function(container) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');

  var index = this.widgets.indexOf(container);
  this.widgets.splice(index, 1);
  this.selectedWidget = null;
  this.selectedContainer = null;
};


/**
 * Swaps the widget with the one at the previous position if it exists.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToPrevious = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  var container = widget.state().parent;
  var index = container.model.container.children.indexOf(widget);
  if (index > 0) {
    this.arrayUtilService_.swap(
        container.model.container.children, index, index - 1);
  }
};


/**
 * Swaps the widget with the one at the next position if it exists.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToNext = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  var container = widget.state().parent;
  var index = container.model.container.children.indexOf(widget);
  if (index < container.model.container.children.length - 1) {
    this.arrayUtilService_.swap(
        container.model.container.children, index, index + 1);
  }
};


/**
 * Moves the widget to the beginning of the array.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToFirst = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  var container = widget.state().parent;
  var index = container.model.container.children.indexOf(widget);
  if (index > 0) {
    goog.array.moveItem(container.model.container.children, index, 0);
  }
};


/**
 * Moves the widget to the end of the array.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToLast = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  var container = widget.state().parent;
  var index = container.model.container.children.indexOf(widget);
  var lastIndex = container.model.container.children.length - 1;
  if (index < lastIndex) {
    goog.array.moveItem(container.model.container.children, index, lastIndex);
  }
};


/**
 * Move a widget up to the previous container.
 *
 * If the widget is the only contents of the first container, nothing happens.
 * If there are other widgets in the container, a new top-level container will
 * be added, and the widget will be it's sole contents.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToPreviousContainer = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  var container = /** @type {ContainerWidgetConfig} */ (widget.state().parent);
  var containerIndex = this.widgets.indexOf(container);
  var targetContainer = null;

  if (containerIndex == 0) {
    if (container.model.container.children.length > 1) {
      targetContainer = new ContainerWidgetConfig(this.widgetFactoryService_);
      targetContainer.model.container.columns = 0;
      goog.array.insertAt(this.widgets, targetContainer, 0);
    }
  } else {
    targetContainer = /** @type {ContainerWidgetConfig} */ (
        this.widgets[containerIndex - 1]);
  }

  if (targetContainer) {
    this.moveWidgetToContainer(widget, targetContainer);
    this.selectWidget(widget, targetContainer);
  }
};


/**
 * Move a widget down to the next container.
 *
 * If the widget is the only contents of the last container, nothing happens.
 * If there are other widgets in the container, a new container will
 * be added, and the widget will be it's sole contents.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToNextContainer = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  var container = /** @type {ContainerWidgetConfig} */ (widget.state().parent);
  var containerIndex = this.widgets.indexOf(container);
  var index = container.model.container.children.indexOf(widget);
  var targetContainer = null;

  if (containerIndex == (this.widgets.length - 1)) {
    if (container.model.container.children.length > 1) {
      targetContainer = new ContainerWidgetConfig(this.widgetFactoryService_);
      targetContainer.model.container.columns = 0;
      this.widgets.push(targetContainer);
    }
  } else {
    targetContainer = /** @type {ContainerWidgetConfig} */ (
        this.widgets[containerIndex + 1]);
  }

  if (targetContainer) {
    this.moveWidgetToContainer(widget, targetContainer);
    this.selectWidget(widget, targetContainer);
  }
};


/**
 * @param {DashboardModel} dashboard
 * @export
 */
DashboardService.prototype.deleteDashboard = function(dashboard) {
  return this.dashboardDataService_.delete(dashboard.id);
};


/**
 * Adds an empty entry to the list of authorized writers.
 * @param {DashboardModel} dashboard
 * @export
 */
DashboardService.prototype.addWriter = function(dashboard) {
  this.current.model.writers.push({'email': ''});
};



});  // goog.scope
