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
 * @fileoverview Service for state and content of the Explorer page as a whole.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerService');

goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorMode');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerModel');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');
goog.require('goog.array');
goog.require('goog.asserts');



goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ArrayUtilService = explorer.components.util.ArrayUtilService;
const CodeEditorMode = explorer.components.code_editor.CodeEditorMode;
const DashboardConfig = explorer.components.dashboard.DashboardConfig;
const DashboardModel = explorer.components.dashboard.DashboardModel;
const DashboardService = explorer.components.dashboard.DashboardService;
const DashboardVersionService = explorer.components.dashboard.DashboardVersionService;
const ErrorService = explorer.components.error.ErrorService;
const ExplorerModel = explorer.components.explorer.ExplorerModel;



/**
 * Service that provides model access for the Explorer page at the top-level.
 * @param {!ArrayUtilService} arrayUtilService
 * @param {!DashboardDataService} dashboardDataService
 * @param {!DashboardService} dashboardService
 * @param {!Angular.LocationService} $location
 * @constructor
 * @ngInject
 */
explorer.components.explorer.ExplorerService = function(
    arrayUtilService, containerService, dashboardDataService,
    dashboardService, dashboardVersionService, errorService,
    explorerStateService, sidebarTabService, $location, $state,
    $stateParams, $rootScope, $timeout) {
  /**
   * @type {!ArrayUtilService}
   * @private
   */
  this.arrayUtilService_ = arrayUtilService;

  /**
   * @type {!DashboardDataService}
   * @private
   */
  this.dashboardDataService_ = dashboardDataService;

  /** @private {!DashboardVersionService} */
  this.dashboardVersionService_ = dashboardVersionService;

  /** @private {!ContainerService} */
  this.containerService_ = containerService;

  /** @private {!ExplorerStateService} */
  this.explorerStateService_ = explorerStateService;

  /** @private {!SidebarTabService} */
  this.sidebarTabService_ = sidebarTabService;

  /** @private */
  this.location_ = $location;

  /** @private */
  this.$state = $state;

  /** @private */
  this.$stateParams = $stateParams;

  /** @private */
  this.$rootScope = $rootScope;

  /**
   * @type {!ErrorService}
   * @export
   */
  this.errorService = errorService;

  /**
   * @type {!boolean}
   * @export
   */
  this.dashboardsLoading = false;

  /** @type {DashboardService}
   *  @export
   */
  this.dashboard = dashboardService;

  /**
   * @type {!ExplorerModel}
   * @export
   */
  this.model = new ExplorerModel();

  /**
   * @type {!string}
   * @export
   */
  this.CURRENT_USER_ADMIN = CURRENT_USER_ADMIN;

  /**
   * @type {Array.<*>}
   * @export
   */
  this.errors = [];

  /** @export {!number} */
  this.KEY_ESCAPE = 27;

  /** @private {!Object<string, number>} */
  this.queryParams = {};

  $rootScope.$on('$stateChangeSuccess',
      (event, toState, toParams, fromState, fromParams) => {
    if (toState.name === 'explorer-dashboard-edit') {
      // If we are setting the dashboard from a null state, initialize it.
      if (fromParams.dashboard != toParams.dashboard ||
          !goog.isDefAndNotNull(this.explorerStateService_.selectedDashboard)) {
        $timeout(() => {
          this.initializeDashboard();
        });
      }

      // Set the dashboard parameters in the URL.
      angular.forEach(this.dashboard.params, param => {
        try {
          $state.current.reloadOnSearch = false;
          $location.search(param.name, param.value);
        } finally {
          $state.current.reloadOnSearch = true;
        }
      });
    }
  });

  $rootScope.$on('$locationChangeStart',
      (event, newUrl, oldUrl) => {
    this.queryParams = {};

    // Store the current dashboard parameter values from the query string.
    let oldQueryData = new goog.Uri(oldUrl).getQueryData();
    angular.forEach(oldQueryData.getKeys(), paramName => {
      if (goog.isDef($state.params[paramName])) { return; }

      this.queryParams[paramName] = oldQueryData.get(paramName);
    });
  });

  $rootScope.$on('$locationChangeSuccess',
      (event, newUrl, oldUrl) => {
    if (newUrl !== oldUrl) {
      // If the dashboard changed, reload the page.
      if ($location.search()['dashboard'] &&
          $location.search()['dashboard'] !== this.dashboard.current.model.id) {
        $window.location.reload();
      } else {
          // Patch in the state parameters if the url doesn't specify them.
          angular.forEach(Object.keys($state.params), paramName => {
            try {
              $state.current.reloadOnSearch = false;
              if (goog.isDefAndNotNull($state.params[paramName]) &&
                  $state.params[paramName] !== $location.search()[paramName]) {
                $location.search(paramName, $state.params[paramName]);
              }
            } finally {
              $state.current.reloadOnSearch = true;
            }
          });

          // If any dashboard parameters changed, refresh the dashboard.
          angular.forEach(this.dashboard.params, param => {
            if ($location.search()[param.name] !==
                this.queryParams[param.name]) {
              this.dashboard.refreshDashboard();
              return false;
            }
          });
      }
    }
  });

  this.initExplorer();
};
const ExplorerService = explorer.components.explorer.ExplorerService;


/**
 * Initializes the service.
 */
ExplorerService.prototype.initExplorer = function() {
  if (this.location_.search().readOnly == 'true') {
    this.model.readOnly = true;
  }

  if (this.location_.search().logStatistics == 'true') {
    this.model.logStatistics = true;
  }

  if (this.location_.search().hideToolbar == 'true') {
    this.model.hideToolbar = true;
  }
};


/**
 * Initialize the dashboard service based on the state.
 * @export
 */
ExplorerService.prototype.initializeDashboard = function() {
  var dashboardId = this.$stateParams.dashboard;

  if (dashboardId) {
    this.dashboard.fetchDashboard(dashboardId);
  } else {
    this.newDashboard();
  }
};


/**
 * Creates a new dashboard.
 */
ExplorerService.prototype.newDashboard = function(
    opt_autoCreateWidget = true, opt_autoSelect) {
  var dashboard = new DashboardConfig();
  dashboard.model.version =
      this.dashboardVersionService_.currentVersion.version;

  this.explorerStateService_.selectedDashboard = dashboard;

  if (opt_autoCreateWidget) {
    this.containerService_.insert(true, opt_autoSelect);
  }

  return dashboard;
};


/**
 * Retrieves a list of dashboards
 * @export
 */
ExplorerService.prototype.listDashboards = function() {
  let promise = this.dashboardDataService_.list(true);
  this.dashboardsLoading = true;

  promise.then(angular.bind(this, function(response) {
    this.dashboardsLoading = false;
    this.model.dashboards.slice(
        0, this.model.dashboards.length);

    if (response['data']) {
      goog.array.forEach(
          response['data'], goog.bind(function(dashboardJson) {
            let dashboard = new DashboardModel();
            dashboard.id = dashboardJson.id;
            dashboard.title = dashboardJson.title;

            this.model.dashboards.push(dashboard);
          }, this));
    } else {
      this.dashboardsLoading = false;
      this.errors.push('listDashboards() failed: No data returned.');
    }
  }));

  promise.then(null, angular.bind(this, function(error) {
    this.dashboardsLoading = false;
    this.errors.push(error.message);
  }));
};


/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.customizeSql = function(rewrite) {
  if (rewrite !== true) {
    rewrite = false;
  }

  let widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }
  this.dashboard.customizeSql(widget, rewrite);
  this.model.readOnly = false;
  this.model.code_editor.isOpen = true;

  this.model.code_editor.selectedMode = CodeEditorMode.SQL;
};


/**
 * Shows the JSON editor for the selected widget.
 * @export
 */
ExplorerService.prototype.editJson = function() {
  let widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = CodeEditorMode.JSON;
};


/**
 * Shows the SQL editor.
 * @export
 */
ExplorerService.prototype.viewSql = function(rewrite) {
  let widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  if (rewrite === true && !widget.model.datasource.custom_query) {
    this.dashboard.rewriteQuery(widget);
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = CodeEditorMode.SQL;
};


/**
 * Hides the SQL editor.
 * @export
 */
ExplorerService.prototype.hideSql = function() {
  this.model.code_editor.isOpen = false;
};


/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.editDashboard = function() {
  let widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }

  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = CodeEditorMode.SQL;
};


/**
 * Displays the log.
 * @export
 */
ExplorerService.prototype.showLog = function() {
  this.model.code_editor.isOpen = true;
  this.model.code_editor.selectedMode = CodeEditorMode.LOG;
};


ExplorerService.prototype.unselectWidget = function() {
  this.dashboard.unselectWidget();

  if (this.model.code_editor.selectedMode !== CodeEditorMode.LOG) {
    this.model.code_editor.isOpen = false;
  }
};


/**
 * Updates the query and state of the selected widget's datasource.
 * @export
 */
ExplorerService.prototype.restoreBuilder = function() {
  let widget = this.dashboard.selectedWidget;
  if (!widget) {
    throw new Error('No selected widget.');
  }
  if (!widget.model.datasource) {
    throw new Error('Selected widget doesn\'t have a datasource property.');
  }

  if (widget.model.datasource.query) {
    let msg = (
        'Restoring the Query Builder will remove any custom SQL you have ' +
        'provided.  Do you want to continue?');
    if (!window.confirm(msg)) { return; }
  }

  this.dashboard.restoreBuilder(widget);
};


});  // goog.scope
