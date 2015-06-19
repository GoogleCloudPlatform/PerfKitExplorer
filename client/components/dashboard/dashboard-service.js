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

goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardParam');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderService');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryTablePartitioning');
goog.require('goog.array');
goog.require('goog.asserts');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ArrayUtilService = explorer.components.util.ArrayUtilService;
const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
const ConfigService = explorer.components.config.ConfigService;
const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
const DashboardConfig = explorer.components.dashboard.DashboardConfig;
const DashboardParam = explorer.components.dashboard.DashboardParam;
const DashboardDataService = explorer.components.dashboard.DashboardDataService;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;
const QueryBuilderService = (
    explorer.components.widget.query.builder.QueryBuilderService);
const QueryTablePartitioning = (
    explorer.models.perfkit_simple_builder.QueryTablePartitioning);
const ResultsDataStatus = explorer.models.ResultsDataStatus;
const WidgetConfig = explorer.models.WidgetConfig;
const WidgetFactoryService = explorer.components.widget.WidgetFactoryService;
const WidgetType = explorer.models.WidgetType;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!ArrayUtilService} arrayUtilService
 * @param {!ErrorService} errorService
 * @param {!WidgetFactoryService} widgetFactoryService
 * @param {!DashboardDataService} dashboardDataService
 * @param {!QueryBuilderService} queryBuilderService
 * @param {!ConfigService} configService
 * @param {!angular.Filter} $filter
 * @param {!angular.Location} $location
 * @param {!angular.RootScope} $rootScope
 * @param {!angular.Timeout} $timeout
 * @param {!angular.Window} $window
 * @constructor
 * @ngInject
 */
explorer.components.dashboard.DashboardService = function(arrayUtilService,
    errorService, widgetFactoryService, dashboardDataService,
    queryBuilderService,  dashboardVersionService, configService,
    explorerStateService, $filter, $location, $rootScope, $timeout, $window) {
  /** @private {!angular.Filter} */
  this.filter_ = $filter;

  /** @private {!angular.RootScope} */
  this.rootScope_ = $rootScope;

  /** @private {!angular.Timeout} */
  this.timeout_ = $timeout;

  /** @export {!ConfigService} */
  this.config = configService;

  /** @private {!ArrayUtilService} */
  this.arrayUtilService_ = arrayUtilService;

  /** @private {!ArrayUtilService} */
  this.errorService_ = errorService;

  /** @private {!ExplorerStateService} */
  this.explorerStateService_ = explorerStateService;

  /** @private {!WidgetFactoryService} */
  this.widgetFactoryService_ = widgetFactoryService;

  /** @private {!DashboardDataService} */
  this.dashboardDataService_ = dashboardDataService;

  /** @private {!DashboardVersionService} */
  this.dashboardVersionService_ = dashboardVersionService;

  /** @private {!QueryBuilderService} */
  this.queryBuilderService_ = queryBuilderService;

  /** @private @type {!angular.Location} */
  this.location_ = $location;

  /** @export {WidgetConfig} */
  this.selectedWidget = null;

  /** @export {ContainerWidgetConfig} */
  this.selectedContainer = null;

  /** @export {Array.<!DashboardParam>} */
  this.params = [];

  /** @export {string} */
  this.DEFAULT_TABLE_PARTITION = QueryTablePartitioning.ONETABLE;

  /** @export {Array.<!QueryTablePartitioning>} */
  this.TABLE_PARTITIONS = [
    {'partition': QueryTablePartitioning.ONETABLE,
     'label': 'Single Table',
     'tooltip': 'All data is stored in a single table.'},
    {'partition': QueryTablePartitioning.PERDAY,
     'label': 'Table per Day',
     'tooltip': 'Each table represents a day.  Ex: results_20141024.'}
  ];

  Object.defineProperty(this, 'current', {
    /** @export {DashboardModel} */
    get: function() {
      return explorerStateService.selectedDashboard;
    }
  });

  Object.defineProperty(this, 'widgets', {
    /** @export {!Array.<WidgetConfig>} */
    get: function() {
      if (this.current) {
        return this.current.model.children;
      } else {
        return null;
      }
    }
  });

  $rootScope.$watch(function() {
    return $location.url();
  },
  angular.bind(this, function(newUrl, oldUrl) {
    if (newUrl !== oldUrl) {
      // If the dashboard changed, reload the page.
      if ($location.search()['dashboard'] !== this.current.model.id) {
        $window.location.reload();
      } else {
        this.refreshDashboard();
      }
    }
  }));

  /** @export {Array.<!ErrorModel>} */
  this.errors = [];

  this.initializeDashboard_();
};
var DashboardService = explorer.components.dashboard.DashboardService;


/**
 * Empties the list of params.
 * @private
 */
DashboardService.prototype.clearParams = function() {
  while (this.params.length > 0) {
    this.params.pop();
  }
};


/**
 * Initialize a new dashboard.
 */
DashboardService.prototype.initializeDashboard_ = function() {
  var dashboard = new DashboardConfig();
  dashboard.model.version =
      this.dashboardVersionService_.currentVersion.version;

  this.explorerStateService_.selectedDashboard = dashboard;
};


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
 * Iterates through the dashboard and applies functions to the contents.
 * @param {!DashboardConfig} dashboard The dashboard config to iterate.
 * @param {?Function(ContainerConfig)} updateContainerFn The function to apply
 *    to each container.
 * @param {?Function(WidgetConfig)} updateWidgetFn The function to apply to each
 *    widget.
 * @param updateWidgetFn
 */
DashboardService.prototype.updateDashboard = function(
    dashboard, updateContainerFn, updateWidgetFn) {
  angular.forEach(dashboard.model.children, function(containerConfig) {
    updateContainerFn && updateContainerFn(containerConfig.model.container);
    if (updateWidgetFn) {
      angular.forEach(
          containerConfig.model.container.children, function(widget) {
        updateWidgetFn(widget);
      });
    }
  });
};


/**
 * Refreshes all widgets in the dashboard and re-applies parameters.
 * @export
 */
DashboardService.prototype.refreshDashboard = function() {
  this.initializeParams_();

  this.timeout_(angular.bind(this, function() {
    this.updateDashboard(
        this.current, null, angular.bind(this, function(widget) {
      this.refreshWidget(widget);
    }));
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
  this.explorerStateService_.selectedDashboard = dashboardConfig;
  if (dashboardConfig) {
    this.initializeParams_();
  }
};


/**
 * Initializes the current dashboard's parameters.
 *
 * The DashboardModel stores the available params and default values for the
 * dashboard, while the DashboardService stores the current effective values
 * based on the querystring and default values.
 */
DashboardService.prototype.initializeParams_ = function() {
  this.clearParams();

  angular.forEach(
      this.current.model.params, angular.bind(this, function(param) {
    var paramValue = this.location_.search()[param.name] || param.value;

    if (paramValue !== '') {
      this.params.push(new DashboardParam(param.name, paramValue));
    }
  }));
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
 * @param {!Widget} widget The widget to rewrite the query against.
 * @param {!bool=} replaceParams If true, parameters (%%NAME%%) will be
 *     replaced with the current param value (from the dashboard or url).
 *     Defaults to false.
 */
DashboardService.prototype.rewriteQuery = function(widget, replaceParams) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');
  goog.asserts.assert(this.current, 'Bad state: No dashboard selected.');

  var widgetConfig = widget.model.datasource.config;

  var project_name = this.arrayUtilService_.getFirst([
      widgetConfig.results.project_id,
      this.current.model.project_id,
      this.config.default_project], false);
  if (project_name === null) {
    this.errorService_.addError(ErrorTypes.DANGER, 'Project name not found.');
  }

  var dataset_name = this.arrayUtilService_.getFirst([
      widgetConfig.results.dataset_name,
      this.current.model.dataset_name,
      this.config.default_dataset], false);
  if (project_name === null) {
    this.errorService_.addError(ErrorTypes.DANGER, 'Dataset name not found.');
  }

  var table_name = this.arrayUtilService_.getFirst([
      widgetConfig.results.table_name,
      this.current.model.table_name,
      this.config.default_table], false);
  if (project_name === null) {
    this.errorService_.addError(ErrorTypes.DANGER, 'Table name not found.');
  }

  var table_partition = this.arrayUtilService_.getFirst([
      widgetConfig.results.table_partition,
      this.current.model.table_partition,
      this.DEFAULT_TABLE_PARTITION], false);
  if (project_name === null) {
    this.errorService_.addError(ErrorTypes.DANGER,
                                'Table partition not found.');
  }

  this.initializeParams_();
  var params = replaceParams ? this.params : null;

  return this.queryBuilderService_.getSql(
        widget.model.datasource.config,
        project_name, dataset_name, table_name, table_partition, params);

};


/**
 * Updates the widget's query, if applicable, and changes the widget
 * datasource status to TOFETCH.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.refreshWidget = function(widget) {
  if (widget.model.datasource.custom_query !== true) {
    widget.model.datasource.query = this.rewriteQuery(widget, false);
    widget.model.datasource.query_exec = this.rewriteQuery(widget, true);
  } else {
    widget.model.datasource.query_exec = (
        this.queryBuilderService_.replaceTokens(
            widget.model.datasource.query, this.params));
  }

  if (widget.model.datasource.query) {
    this.timeout_(function() {
      widget.state().datasource.status = ResultsDataStatus.TOFETCH;
    });
  }
};


/**
 * Changes the widget datasource to accept a custom SQL statement.
 *
 * @param {!WidgetConfig} widget
 * @param {!bool} rewrite If true, rewrites the query based on the QueryBuilder
 *    settings.  Otherwise, leaves the query as-is.  Defaults to false.
 * @export
 */
DashboardService.prototype.customizeSql = function(widget, rewrite) {
  if (!widget.model.datasource) {
    throw new Error('Selected widget doesn\'t have a datasource property.');
  }

  widget.state().datasource.status = ResultsDataStatus.NODATA;

  if (rewrite === true) {
    widget.model.datasource.query = this.rewriteQuery(widget, false);
  }
  widget.model.datasource.custom_query = true;
};


/**
 * Changes the widget datasource to use the Query Builder UI.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.restoreBuilder = function(widget) {
  widget.model.datasource.custom_query = false;
  widget.model.datasource.query = this.rewriteQuery(widget, true);
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @return {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.addWidget = function(container) {
  return this.addWidgetAt(container);
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
 * @return {!WidgetConfig}
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

  return widget;
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

  if (container.model.container.children.length === 0) {
    this.removeContainer(container);
  } else {
    container.model.container.columns -= widget.model.layout.columnspan;
  }

  this.unselectWidget();
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

  if (container.model.container.children.length === 0) {
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
 * @return {!ContainerWidgetConfig}
 * @export
 */
DashboardService.prototype.addContainer = function() {
  var container = new ContainerWidgetConfig(this.widgetFactoryService_);
  this.addWidget(container);
  this.widgets.push(container);
  return container;
};


/**
 * Adds a new container with one new widget and select it.
 *
 * @param {number} index
 * @return {!ContainerWidgetConfig}
 * @export
 */
DashboardService.prototype.addContainerAt = function(index) {
  var container = new ContainerWidgetConfig(this.widgetFactoryService_);
  this.addWidget(container);
  goog.array.insertAt(this.widgets, container, index);
  return container;
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
  this.unselectWidget();
};


/**
 * Unselect the currently selected widget and container, if any.
 */
DashboardService.prototype.unselectWidget = function() {
  if (this.selectedWidget) {
    this.selectedWidget.state().selected = false;
  }

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

  if (containerIndex === 0) {
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

  if (containerIndex === (this.widgets.length - 1)) {
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
 * Triggers the delete confirmation for the currently selected dashboard.
 * @export
 */
DashboardService.prototype.deleteDashboard = function() {
  return this.dashboardDataService_.delete(this.current.model.id);
};


/**
 * Adds an empty entry to the list of authorized writers.
 * @export
 */
DashboardService.prototype.addWriter = function() {
  this.current.model.writers.push({'email': ''});
};


/**
 * Adds an empty entry to the list of dashboard parameters.
 * @export
 */
DashboardService.prototype.addParam = function() {
  this.current.model.params.push(new DashboardParam());
};


/**
 * Returns a partition object matching the specified name.
 * @param {string} partitionName
 * @return {Object}
 * @export
 */
DashboardService.prototype.getTablePartition = function(partitionName) {
  return this.filter_('getByProperty')(
      'partition', partitionName, this.TABLE_PARTITIONS);
};


/**
 * Returns the title of the provided artifact, with tokens replaced with params.
 * Tokens are identified by strings wrapped in the QueryBuilderService
 * properties TOKEN_START_SYMBOL and TOKEN_END_SYMBOL.
 *
 * @param artifact {string} The string to replace.
 * @returns {string} A title with tokens replaced with param values.
 * @export
 */
DashboardService.prototype.replaceTokens = function(value) {
  this.initializeParams_();
  return this.queryBuilderService_.replaceTokens(value, this.params);
};

});  // goog.scope
