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

goog.require('p3rf.perfkit.explorer.components.error.ErrorModel');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardInstance');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardParam');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryTablePartitioning');
goog.require('goog.array');
goog.require('goog.asserts');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ArrayUtilService = explorer.components.util.ArrayUtilService;
const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
const ConfigService = explorer.components.config.ConfigService;
const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
const DashboardInstance = explorer.components.dashboard.DashboardInstance;
const DashboardModel = explorer.components.dashboard.DashboardModel;
const DashboardParam = explorer.components.dashboard.DashboardParam;
const DashboardDataService = explorer.components.dashboard.DashboardDataService;
const ExplorerStateService = explorer.components.explorer.ExplorerStateService;
const SidebarTabService = explorer.components.explorer.sidebar.SidebarTabService;
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
 * @param {!ExplorerStateService} explorerStateService
 * @param {!SidebarTabService} sidebarTabService
 * @param {!angular.$filter} $filter
 * @param {!angular.$location} $location
 * @param {!angular.Scope} $rootScope
 * @param {!angular.$timeout} $timeout
 * @param {!angular.$window} $window
 * @constructor
 * @ngInject
 */
explorer.components.dashboard.DashboardService = function(arrayUtilService,
    errorService, widgetFactoryService, dashboardDataService,
    queryBuilderService,  dashboardVersionService, configService,
    explorerStateService, sidebarTabService, $filter, $location, $rootScope,
    $timeout, $window, $state, $stateParams) {
  /** @private {!angular.$filter} */
  this.filter_ = $filter;

  /** @private {!angular.Scope} */
  this.rootScope_ = $rootScope;

  /** @private {!angular.$timeout} */
  this.timeout_ = $timeout;

  /** @export {!ConfigService} */
  this.config = configService;

  /** @private {!ArrayUtilService} */
  this.arrayUtilService_ = arrayUtilService;

  /** @private {!ErrorService} */
  this.errorService_ = errorService;

  /** @private {!ExplorerStateService} */
  this.explorerStateService_ = explorerStateService;

  /** @private {!SidebarTabService} */
  this.sidebarTabService_ = sidebarTabService;

  /** @export {!WidgetFactoryService} */
  this.widgetFactorySvc = widgetFactoryService;

  /** @private {!DashboardDataService} */
  this.dashboardDataService_ = dashboardDataService;

  /** @private {!explorer.components.dashboard.DashboardVersionService} */
  this.dashboardVersionService_ = dashboardVersionService;

  /** @private {!QueryBuilderService} */
  this.queryBuilderService_ = queryBuilderService;

  /** @private {!angular.$location} */
  this.location_ = $location;

  /** @private {!ui.router.$state} */
  this.$state_ = $state;

  /** @private {!ui.router.$stateParams} */
  this.$stateParams_ = $stateParams;

  /** @export {Array.<!DashboardParam>} */
  this.params = [];

  /** @export {string} */
  this.DEFAULT_TABLE_PARTITION = QueryTablePartitioning.ONETABLE;

  /** @export {boolean} */
  this.isDashboardLoading = false;

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
    /** @export {function(): explorer.components.dashboard.DashboardInstance} */
    get: function() {
      return explorerStateService.selectedDashboard;
    }
  });

  Object.defineProperty(this, 'containers', {
    /** @export {function(): ?Array.<ContainerWidgetConfig>} */
    get: function() {
      if (this.current) {
        return this.current.model.children;
      } else {
        return null;
      }
    }
  });

  Object.defineProperty(this, 'selectedWidget', {
    /** @export {function(): ?WidgetConfig} */
    get: function() {
      return this.explorerStateService_.widgets.selected;
    }
  });

  Object.defineProperty(this, 'selectedContainer', {
    /** @export {function(): ?explorer.components.container.ContainerWidgetModel} */
    get: function() {
      return this.explorerStateService_.containers.selected;
    }
  });

  /** @export {!Array.<!explorer.components.error.ErrorModel>} */
  this.errors = [];
};
const DashboardService = explorer.components.dashboard.DashboardService;


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
 * Fetches a dashboard and puts it in the scope.
 * @param {string} dashboardId
 * @export
 */
DashboardService.prototype.fetchDashboard = function(dashboardId) {
  var promise = this.dashboardDataService_.fetchDashboard(dashboardId);
  this.isDashboardLoading = true;

  promise.then(angular.bind(this, function(dashboardConfig) {
    this.isDashboardLoading = false;
    this.setDashboard(dashboardConfig);
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.isDashboardLoading = false;
    this.errorService_.addDanger(error.message || error.data.message);
  }));
};


  /**
 * Saves the current dashboard on the server.
 */
DashboardService.prototype.saveDashboard = function() {
  let dashboard = this.current;

  let promise = dashboard.model.id ?
      this.dashboardDataService_.update(dashboard) :
      this.dashboardDataService_.create(dashboard);

  promise.then(angular.bind(this, function(dashboardJsonModel) {
    // If it was a create, patch the dashboard with the model returned.
    if (!dashboard.model.id) {
      // TODO: Call fetchDashboard once cleanup and reloading are working
      // as expected.
      console.log('Dashboard saved with id:', dashboardJsonModel.id);

      let uri = new goog.Uri(window.location.href);
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
 * @param {!DashboardInstance} dashboard The dashboard config to iterate.
 * @param {?function(ContainerWidgetConfig)} updateContainerFn The function to apply
 *    to each container.
 * @param {?function(WidgetConfig)} updateWidgetFn The function to apply to each
 *    widget.
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
 * @param {!DashboardInstance} dashboard
 * @export
 */
DashboardService.prototype.setDashboard = function(dashboard) {
  this.explorerStateService_.selectedDashboard = dashboard;
  if (dashboard) {
    this.explorerStateService_.widgets.clear();
    this.explorerStateService_.containers.clear();

    for (let container of dashboard.model.children) {
      this.explorerStateService_.containers.all[container.model.id] = container;
      if (container.model.id ===
          this.explorerStateService_.containers.selectedId) {
        container.state().selected = true;

        if (!this.explorerStateService_.widgets.selectedId) {
          this.selectWidget(null, container, true);
        }
      }
      for (let widget of container.model.container.children) {
        this.explorerStateService_.widgets.all[widget.model.id] = widget;
        if (widget.model.id === this.explorerStateService_.widgets.selectedId) {
          this.selectWidget(
              widget, this.explorerStateService_.containers.selected, true);
        }
      }
    }
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
    let paramValue = this.location_.search()[param.name] || param.value;

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
 * @param {boolean=} opt_supressStateChange If true, will prevent the ui-router
 *     state change from taking place.  This is used to select the widget at
 *     initial dashboard load-time.
 * @export
 */
DashboardService.prototype.selectWidget = function(
    widget, container, opt_supressStateChange) {
  let currentContainer = this.explorerStateService_.containers.selected;
  let currentWidget = this.explorerStateService_.widgets.selected;

  if (currentWidget) {
    currentWidget.state().selected = false;
  }

  if (currentContainer) {
    currentContainer.state().selected = false;
  }

  if (widget) {
    widget.state().selected = true;
    this.explorerStateService_.widgets.selectedId = widget.model.id;
  }

  if (container) {
    container.state().selected = true;
    this.explorerStateService_.containers.selectedId = container.model.id;
  }

  if (!opt_supressStateChange) {
    let params = {widget: null, container: null};

    if (widget) { params.widget = widget.model.id; }
    if (container) { params.container = container.model.id };

    this.$state_.go('explorer-dashboard-edit', params, {location: false});

    if (widget) {
      this.location_.search('widget', widget.model.id);
    } else {
      this.location_.search('widget', null);
    }

    if (container) {
      this.location_.search('container', container.model.id);
    } else {
      this.location_.search('container', null);
    }
  }

  if (goog.isDefAndNotNull(widget)) {
    this.sidebarTabService_.resolveSelectedTabForWidget();

    this.timeout_(() => {
      this.scrollWidgetIntoView(/** @type {!WidgetConfig} */ (widget));
    });
  } else if (goog.isDefAndNotNull(container)) {
    this.sidebarTabService_.resolveSelectedTabForContainer();

    this.timeout_(() => {
      this.scrollContainerIntoView(/** @type {!ContainerWidgetConfig} */ (container));
    });
  } else {
    this.timeout_(() => {
      if (this.sidebarTabService_.selectedTab) {
        this.sidebarTabService_.resolveSelectedTabForDashboard();
      }
    });
  }
};


/**
 * Scrolls the specified content element (typically a widget or container) into view.
 * @param {!angular.JQLite} targetElement The element to scroll into view.
 */
DashboardService.prototype.scrollPageElementIntoView = function(targetElement) {
  let contentElement = angular.element(document.getElementsByClassName('pk-page-content'));

  if ((targetElement.length === 1) && (contentElement.length === 1)) {
    goog.style.scrollIntoContainerView(targetElement[0], contentElement[0]);
  }
};


/**
 * Scrolls the specified container into view.
 * @param {!ContainerWidgetConfig} container
 */
DashboardService.prototype.scrollContainerIntoView = function(container) {
  let targetElement = angular.element(
      document.getElementsByClassName('pk-container-' + container.model.id));

  this.scrollPageElementIntoView(targetElement);
};


/**
 * Scrolls the specified widget into view.
 * @param {!WidgetConfig} widget
 */
DashboardService.prototype.scrollWidgetIntoView = function(widget) {
  let targetElement = angular.element(
      document.getElementsByClassName('pk-widget-' + widget.model.id));

  this.scrollPageElementIntoView(targetElement);
};


/**
 * Selects the specified container, and the first widget.
 *
 * @param {ContainerWidgetConfig} container
 * @param {boolean=} opt_supressStateChange If true, will prevent the ui-router
 *     state change from taking place.  This is used to select the container at
 *     initial dashboard load-time.  Defaults to false.
 * @param {boolean=} opt_autoSelectWidget If true, will select the first widget
 *     in the container.  Defaults to true.
 * @export
 */
DashboardService.prototype.selectContainer = function(
    container, opt_supressStateChange = false, opt_autoSelectWidget = true) {
  let widget;
  let currentContainer = this.explorerStateService_.containers.selected;

  if (currentContainer && currentContainer !== container) {
    currentContainer.state().selected = false;
  }

  let currentWidget = this.explorerStateService_.widgets.selected;

  if (currentWidget) {
    currentWidget.state().selected = false;
  }

  if (container) {
    container.state().selected = true;
    this.explorerStateService_.containers.selectedId = container.model.id;
  }

  if (opt_autoSelectWidget) {
    if (container && container.model.container.children &&
        container.model.container.children.length > 0) {
      widget = container.model.container.children[0];
    }

    if (widget) {
      widget.state().selected = true;
      this.explorerStateService_.widgets.selectedId = widget.model.id;
    }

    this.timeout_(() => {
      this.scrollWidgetIntoView(widget);
    });
  }

  if (!opt_supressStateChange) {
    let params = {container: undefined};

    if (widget) { params.widget = widget.model.id; }
    if (container) { params.container = container.model.id };

    this.$state_.go('explorer-dashboard-edit', params);
  }
};


/**
 * Rewrites the current widget's query based on the config.
 * @param {!WidgetConfig} widget The widget to rewrite the query against.
 * @param {boolean=} replaceParams If true, parameters (%%NAME%%) will be
 *     replaced with the current param value (from the dashboard or url).
 *     Defaults to false.
 * @return {string} Rewritten query.
 */
DashboardService.prototype.rewriteQuery = function(widget, replaceParams) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');
  goog.asserts.assert(this.current, 'Bad state: No dashboard selected.');

  let widgetConfig = widget.model.datasource.config;

  let project_name = (this.arrayUtilService_.getFirst([
      widgetConfig.results.project_id,
      this.current.model.project_id,
      this.config.default_project], false));
  if (goog.isNull(project_name)) {
    throw 'Project name not found.';
  }

  let dataset_name = (this.arrayUtilService_.getFirst([
      widgetConfig.results.dataset_name,
      this.current.model.dataset_name,
      this.config.default_dataset], false));
  if (goog.isNull(dataset_name)) {
    throw 'Dataset name not found.';
  }

  let table_name = (this.arrayUtilService_.getFirst([
      widgetConfig.results.table_name,
      this.current.model.table_name,
      this.config.default_table], false));
  if (goog.isNull(table_name)) {
    throw 'Table name not found.';
  }

  let table_partition = (this.arrayUtilService_.getFirst([
      widgetConfig.results.table_partition,
      this.current.model.table_partition,
      this.DEFAULT_TABLE_PARTITION], false));
  if (goog.isNull(table_partition)) {
    throw 'Table partition not found.';
  }

  this.initializeParams_();
  let params = replaceParams ? this.params : null;

  return this.queryBuilderService_.getSql(
        widget.model.datasource.config,
        /** @type {string} */ (project_name),
        /** @type {string} */ (dataset_name),
        /** @type {string} */ (table_name),
        /** @type {!QueryTablePartitioning} */ (table_partition), params);
};

/**
 * Rebuilds the current widget's query based on the config.
 *
 * If the query is a custom query, it will rewrite .query_exec to replace
 * parameter tokens with values.  If the query is a Query Builder query,
 * it will rewrite .query tokens, and .query_exec with values.
 *
 * @param {!WidgetConfig} widget The widget to rewrite the query against.
 */
DashboardService.prototype.rebuildQuery = function(widget) {
  if (widget.model.datasource.custom_query !== true) {
    widget.model.datasource.query = (
        this.rewriteQuery(widget, false));
    widget.model.datasource.query_exec = (
        this.rewriteQuery(widget, true));
  } else {
    widget.model.datasource.query_exec = (
        this.queryBuilderService_.replaceTokens(widget.model.datasource.query,
                                          this.params));
  }
};


/**
 * Updates the widget's query, if applicable, and changes the widget
 * datasource status to TOFETCH.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.refreshWidget = function(widget) {
  this.rebuildQuery(widget);
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
 * @param {!boolean} rewrite If true, rewrites the query based on the QueryBuilder
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
 * @return {!WidgetConfig}
 * @export
 */
DashboardService.prototype.addWidget = function(
    container, opt_autoSelect = true) {
  return this.addWidgetAt(container, null, opt_autoSelect);
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @param {!WidgetConfig} widget
 * @return {!WidgetConfig}
 * @export
 */
DashboardService.prototype.addWidgetAfter = function(
    container, widget, opt_autoSelect = true) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');

  let index = container.model.container.children.indexOf(widget);

  return this.addWidgetAt(container, ++index, opt_autoSelect);
};


/**
 * Adds a new widget in the given container and adjust the number of columns
 * if needed.
 *
 * @param {!ContainerWidgetConfig} container
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.addWidgetBefore = function(
    container, widget, opt_autoSelect = true) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');

  let index = container.model.container.children.indexOf(widget);

  this.addWidgetAt(container, index, opt_autoSelect);
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
DashboardService.prototype.addWidgetAt = function(
    container, opt_index, opt_autoSelect = true) {
  goog.asserts.assert(container, 'Bad parameters: container is missing.');
  let children = container.model.container.children;

  let columnsTaken = 0;
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
  let widget = new ChartWidgetConfig(this.widgetFactorySvc);
  widget.state().datasource.status = ResultsDataStatus.NODATA;

  this.explorerStateService_.widgets.all[widget.model.id] = widget;

  if (!goog.isDefAndNotNull(opt_index) || opt_index > children.length - 1) {
    children.push(widget);
  } else if (opt_index <= 0) {
    goog.array.insertAt(children, widget, 0);
  } else {
    goog.array.insertAt(children, widget, opt_index);
  }

  widget.state().parent = container;

  if (opt_autoSelect) {
    this.selectWidget(widget, container);
  }

  return widget;
};


/**
 * Creates a copy of the provided widget, and inserts it directly after the provided one.
 * @param {!WidgetConfig} widget
 * @param {!ContainerWidgetConfig} container
 * @return {!WidgetConfig}
 * @export
 */
DashboardService.prototype.cloneWidget = function(widget, container) {
  let newModel = angular.copy(widget.model);
  let newWidget = this.addWidgetAfter(container, widget);
  newModel['id'] = newWidget.model.id;
  newWidget.model = newModel;

  return newWidget;
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

  let index = container.model.container.children.indexOf(widget);
  container.model.container.children.splice(index, 1);
  delete this.explorerStateService_.widgets.all[widget.model.id];

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

  let container = /** @type {ContainerWidgetConfig} */ (widget.state().parent);
  let index = container.model.container.children.indexOf(widget);
  container.model.container.children.splice(index, 1);

  if (container.model.container.children.length === 0) {
    this.removeContainer(container);
  } else {
    container.model.container.columns -= widget.model.layout.columnspan;
  }

  targetContainer.model.container.columns += widget.model.layout.columnspan;
  targetContainer.model.container.children.push(widget);
  widget.state().parent = targetContainer;

  // Move the container selection to the target container. Don't change
  // widget selection.
  container.state().selected = false;
  targetContainer.state().selected = true;
  this.explorerStateService_.containers.selectedId = targetContainer.model.id;

  if (widget.state().datasource) {
    widget.state().datasource.status = ResultsDataStatus.TOFETCH;
  }
};


/**
 * Creates a new container and returns it.
 *
 * @param {boolean=} opt_autoCreateWidget If true, creates a widget inside
 *     the container.  Defaults to true.
 * @return {!ContainerWidgetConfig}
 */
DashboardService.prototype.newContainer = function(
    opt_autoCreateWidget = true) {
  let container = new ContainerWidgetConfig(this.widgetFactorySvc);

  if (opt_autoCreateWidget) {
    this.addWidget(container, false);
  }

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

  let index = this.containers.indexOf(container);
  this.containers.splice(index, 1);
  delete this.explorerStateService_.containers.all[container.model.id];

  this.unselectWidget();
};


/**
 * If clicking on a background UI element, unselect the current widget
 * and container, if any.
 *
 * @param {Event} event
 */
DashboardService.prototype.onDashboardClick = function(event) {
  // Check if this is called from an event handler. In this case, only
  // unselect if the clicked element is a background element, and
  // ignore if it's propagated from something else such as a widget or
  // button. Assumes that all "background" elements are marked
  // with the "pk-background" class.
  if (event.target.classList.contains('pk-background')) {
    this.unselectWidget();
  }
};


/**
 * Unselect the currently selected widget and container, if any.
 */
DashboardService.prototype.unselectWidget = function() {
  this.selectWidget(null, null);
};


/**
 * Swaps the widget with the one at the previous position if it exists.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToPrevious = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  this.arrayUtilService_.movePrevious(
      widget.state().parent.model.container.children, widget);
};


/**
 * Swaps the widget with the one at the next position if it exists.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToNext = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  this.arrayUtilService_.moveNext(
      widget.state().parent.model.container.children, widget);
};


/**
 * Moves the widget to the beginning of the array.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToFirst = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  this.arrayUtilService_.moveFirst(
      widget.state().parent.model.container.children, widget);
};


/**
 * Moves the widget to the end of the array.
 *
 * @param {!WidgetConfig} widget
 * @export
 */
DashboardService.prototype.moveWidgetToLast = function(widget) {
  goog.asserts.assert(widget, 'Bad parameters: widget is missing.');

  this.arrayUtilService_.moveLast(
      widget.state().parent.model.container.children, widget);
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

  let container = /** @type {ContainerWidgetConfig} */ (widget.state().parent);
  let containerIndex = this.containers.indexOf(container);
  let targetContainer = null;

  if (containerIndex === 0) {
    if (container.model.container.children.length > 1) {
      targetContainer = new ContainerWidgetConfig(this.widgetFactorySvc);
      targetContainer.model.container.columns = 0;
      goog.array.insertAt(this.containers, targetContainer, 0);
      this.explorerStateService_.containers.add(targetContainer);
    }
  } else {
    targetContainer = /** @type {ContainerWidgetConfig} */ (
        this.containers[containerIndex - 1]);
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

  let container = /** @type {ContainerWidgetConfig} */ (widget.state().parent);
  let containerIndex = this.containers.indexOf(container);
  let targetContainer = null;

  if (containerIndex === (this.containers.length - 1)) {
    if (container.model.container.children.length > 1) {
      targetContainer = new ContainerWidgetConfig(this.widgetFactorySvc);
      targetContainer.model.container.columns = 0;
      this.containers.push(targetContainer);
      this.explorerStateService_.containers.add(targetContainer);
    }
  } else {
    targetContainer = /** @type {ContainerWidgetConfig} */ (
        this.containers[containerIndex + 1]);
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
  this.current.model.params.push(new DashboardParam('', ''));
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
 * @param {string} value The string to replace.
 * @returns {string} A title with tokens replaced with param values.
 * @export
 */
DashboardService.prototype.replaceTokens = function(value) {
  if (goog.isDefAndNotNull(this.current)) {
    this.initializeParams_();
    return this.queryBuilderService_.replaceTokens(value, this.params);
  } else {
    return '';
  }
};

});  // goog.scope
