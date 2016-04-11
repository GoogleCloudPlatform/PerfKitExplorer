/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Service for state and content of the Explorer page.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardInstance');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateModel');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabModel');
goog.require('p3rf.perfkit.explorer.components.util.TypeUtil');
goog.require('p3rf.perfkit.explorer.models.WidgetModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;
const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;
const DashboardInstance = explorer.components.dashboard.DashboardInstance;
const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
const WidgetConfig = explorer.models.WidgetConfig;
const SidebarTabModel = explorer.components.explorer.sidebar.SidebarTabModel;
const TypeUtil = explorer.components.util.TypeUtil;


/**
 * Service that provides state and content for the Explorer page.
 * @constructor
 * @ngInject
 */
explorer.components.explorer.ExplorerStateService = function(
    $state, $location, errorService) {
  /** @export {!ui.router.$state} */
  this.$state = $state;

  /** @private {!ErrorService} */
  this.errorSvc_ = errorService;

  /** @private {!angular.$location} */
  this.$location_ = $location;

  /**
   * Provides storage for a list of dashboards and selection context.
   * @export {?DashboardInstance}
   */
  this.selectedDashboard = null;

  /**
   * Provides storage for a list of containers and selection context.
   * @export {!ExplorerStateModel<ContainerWidgetConfig>}
   */
  this.containers =
      /** @type {!ExplorerStateModel<ContainerWidgetConfig>} */
      (new ExplorerStateModel($state, errorService, 'container'));

  /**
   * Provides storage for a list of widgets and selection context.
   * @export {!ExplorerStateModel<WidgetConfig>}
   */
  this.widgets =
      /** @type {!ExplorerStateModel<WidgetConfig>} */
      (new ExplorerStateModel($state, errorService, 'widget'));

  /**
   * Provides storage for a list of widget data.
   * @export {!Object.<string, *>}
   */
  this.widgetData = {};

  /**
   * Provides storage for a list of sidebar tabs and selection context.
   * @export {!ExplorerStateModel<SidebarTabModel>}
   */
  this.tabs =
      /** @type {!ExplorerStateModel<SidebarTabModel>} */
      (new ExplorerStateModel($state, errorService, 'tab'));

  /**
   * Provides storage for a list of footer tabs and selection context.
   * @export {!ExplorerStateModel<SidebarTabModel>}
   */
  this.footerTabs =
      /** @type {!ExplorerStateModel<SidebarTabModel>} */
      (new ExplorerStateModel($state, errorService, 'footerTab'));

  /**
   * Returns true if the selected widget is maximized, otherwise false.
   */
  Object.defineProperty(this, 'isWidgetMaximized', {
    /** @type {function(): boolean} */
    get: () => {
      let val = TypeUtil.getBoolean($state.params['maximized']);
      
      if (!goog.isDefAndNotNull(val)) {
        val = false;
      }
      return val;
    },
    set: (value) => {
      let bool;

      try {
        bool = TypeUtil.getBoolean(value);
      } catch(err) {
        bool = false;
      }

      $state.params['maximized'] = bool;
    }
  });
};
const ExplorerStateService = explorer.components.explorer.ExplorerStateService;

ExplorerStateService.prototype.updateState = function(widget, container) {
  let params = {
    widget: null,
    container: null,
    maximized: this.isWidgetMaximized
  };

  if (widget) { params.widget = widget.model.id; }
  if (container) { params.container = container.model.id };

  this.$state.go('explorer-dashboard-edit', params, {location: false});

  if (widget) {
    this.$location_.search('widget', widget.model.id);
  } else {
    this.$location_.search('widget', null);
  }

  if (container) {
    this.$location_.search('container', container.model.id);
  } else {
    this.$location_.search('container', null);
  }

  if (params.maximized) {
    this.$location_.search('maximized', true);
  } else {
    this.$location_.search('maximized', null);
  }
}

ExplorerStateService.prototype.selectWidget = function(
    containerId, widgetId) {
  let params = {};
  let valid = true;
  let targetContainer, targetWidget = null;

  if (this.containers.selected) {
    this.containers.selected.state().selected = false;
  }

  if (containerId) {
    targetContainer = this.containers.all[containerId];
    if (goog.isDefAndNotNull(targetContainer)) {
      params['container'] = containerId;
      targetContainer.state().selected = true;
    } else {
      this.errorSvc_.addError(ErrorTypes.DANGER,
        'Selection failed: container id ' + containerId + ' does not exist.');
      valid = false;
    }
  } else {
    params['container'] = null;
  }

  if (this.widgets.selected) {
    this.widgets.selected.state().selected = false;
  }

  if (widgetId) {
    targetWidget = this.widgets.all[widgetId];

    if (goog.isDefAndNotNull(targetWidget)) {
      params['widget'] = widgetId;
      targetWidget.state().selected = true;
    } else {
      this.errorSvc_.addError(ErrorTypes.DANGER,
        'Selection failed: widget id ' + widgetId + ' does not exist.');
      valid = false;
    }
  } else {
    params['widget'] = null;
  }

  if (valid) {
    this.$state.go('explorer-dashboard-edit', params);
  }
};

});  // goog.scope
