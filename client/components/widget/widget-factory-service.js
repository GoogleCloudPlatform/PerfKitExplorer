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
 * @fileoverview widgetFactoryService is an angular service that provides
 * methods to create widgets, convert them to JSON, model or config objects.
 * It provides the same methods for dashboards because a dashboard is kind
 * of a widget.
 * It also stores a hash table of widgets and their states.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetModel');
goog.require('p3rf.perfkit.explorer.models.WidgetState');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('goog.math');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
const ContainerWidgetModel = explorer.components.container.ContainerWidgetModel;
const DashboardConfig = explorer.components.dashboard.DashboardConfig;
const DashboardModel = explorer.components.dashboard.DashboardModel;
const DashboardVersionService =
    explorer.components.dashboard.DashboardVersionService;
const WidgetConfig = explorer.models.WidgetConfig;
const WidgetModel = explorer.models.WidgetModel;
const WidgetState = explorer.models.WidgetState;
const WidgetType = explorer.models.WidgetType;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!DashboardVersionService} dashboardVersionService Used to verify
 *     dashboard versions and update their models, if neccessary.
 * @constructor
 * @ngInject
 */
explorer.components.widget.WidgetFactoryService = function(
    dashboardVersionService) {
  this.dashboardVersionService_ = dashboardVersionService;

  /**
   * Hash table of widgets.
   *
   * @type {!Object.<(ContainerWidgetConfig|WidgetConfig)>}
   * @export
   */
  this.widgetsById = {};

  /**
   * Hash table of widgets states.
   *
   * @type {!Object.<WidgetState>}
   * @export
   */
  this.statesById = {};

  /**
   * @type {number}
   * @private
   */
  this.minId = Math.pow(2, 10);

  /**
   * @type {number}
   * @private
   */
  this.maxId = Math.pow(2, 31) - 1;
};
let WidgetFactoryService = explorer.components.widget.WidgetFactoryService;


/**
 * Returns a widget id, unique within the current dashboard.
 *
 * @return {string}
 */
WidgetFactoryService.prototype.generateWidgetId = function() {
  let uid;
  while (!uid || this.widgetsById[uid]) {
    uid = Math.floor(goog.math.uniformRandom(this.minId, this.maxId));
  }
  return '' + uid;
};


/**
 * Creates and returns a widget object based on the JSON model provided.
 *
 * @param {!WidgetModel} widgetJson
 * @return {!WidgetConfig}
 */
WidgetFactoryService.prototype.createObjectFromJsonModel = function(
    widgetJson) {
  switch (widgetJson.type) {
    case WidgetType.CONTAINER:
      return new ContainerWidgetConfig(this, widgetJson);
    case WidgetType.CHART:
      return new ChartWidgetConfig(this, widgetJson);
  }
  throw new Error('Widget type not recognized:', widgetJson.type);
};


/**
 * Transforms values and properties encountered while stringifying.
 * It replaces the model properties by their content in order to obtain the
 * same JSON that the server sent.
 *
 * @param {string} key
 * @param {*} val
 * @return {*}
 * @private
 */
WidgetFactoryService.prototype.stringifyReplacer_ = function(key, val) {
  if (val && val.model) {
    return val.model;
  }
  return val;
};


/**
 * Returns the JSON corresponding to the given widget and its children.
 *
 * @param {!(WidgetConfig|DashboardConfig)} widget
 * @param {boolean=} opt_pretty Causes the resulting string to be
 *     pretty-printed.
 * @return {string}
 */
WidgetFactoryService.prototype.toJson = function(widget, opt_pretty) {
  return opt_pretty ? JSON.stringify(widget, this.stringifyReplacer_, 2) :
      JSON.stringify(widget, this.stringifyReplacer_);
};


/**
 * Returns a clone of the model corresponding to the given widget config.
 * Note: It converts every child widgets into model objects as well.
 *
 * @param {!(WidgetConfig|DashboardConfig)} widget
 * @return {!(WidgetModel|DashboardModel)}
 */
WidgetFactoryService.prototype.toModel = function(widget) {
  let json = this.toJson(widget);
  return /** @type {!(WidgetModel|DashboardModel)} */ (angular.fromJson(json));
};


/**
 * Returns the dashboard config object based on the given model.
 * Note: It wraps every child widgets into config objects as well.
 *
 * @param {!DashboardModel} dashboardModel
 * @return {!DashboardConfig}
 */
WidgetFactoryService.prototype.toDashboardConfig = function(dashboardModel)
    {
  this.dashboardVersionService_.verifyAndUpdateModel(dashboardModel);

  let dashboard = new DashboardConfig(dashboardModel);
  // Creates containers config object from containers JSON model.
  for (let i = 0; i < dashboard.model.children.length; i++) {
    let containerModel = dashboard.model.children[i];
    if (!containerModel.container) {
      throw new Error(
          'Top level DashboardModel\'s children should be containers.');
    }
    let container =
        this.createObjectFromJsonModel(containerModel);
    // Replace the container with its config object form
    dashboard.model.children[i] = container;

    // Creates widgets config object from widgets JSON model.
    let length = container.model.container.children.length;
    for (let c = 0; c < length; c++) {
      let widgetModel = container.model.container.children[c];
      let widget =
          this.createObjectFromJsonModel(widgetModel);
      // Add a reference to the parent container
      widget.state().parent = container;
      // Replace the widget with its config object form
      container.model.container.children[c] = widget;
    }
  }
  return dashboard;
};


/**
 * Visit every child widgets of the widgets given and call the callback
 * function for every widget depth first.
 *
 * @param {!Array.<(ContainerWidgetModel|WidgetModel)>} widgets
 * @param {function((ContainerWidgetModel|WidgetModel))} callback
 */
WidgetFactoryService.prototype.visitChildWidgets = function(widgets, callback) {
  for (let i = 0; i < widgets.length; i++) {
    let widgetModel = widgets[i];
    if (widgetModel.container) {
      this.visitChildWidgets(widgetModel.container.children, callback);
    }
    callback(widgetModel);
  }
};


/**
 * Replaces the model of a widget config object with the given model based on
 * the model id.
 *
 * @param {!(ContainerWidgetModel|WidgetModel)} widgetModel
 */
WidgetFactoryService.prototype.patchWidgetWithModel = function(widgetModel) {
  // Get the corresponding widget config by id.
  let widgetConfig = this.widgetsById[widgetModel.id];

  if (!widgetConfig) {
    throw new Error('Trying to patch a non existing widget with model id:',
        widgetModel.id);
  }

  let oldChildren = widgetModel.container ?
      widgetConfig.model.container.children : null;

  // Replace its model with the new one.
  widgetConfig.model = widgetModel;

  // For containers, keep the old children array references.
  if (oldChildren) {
    widgetConfig.model.container.children = oldChildren;
  }
};


/**
 * Replaces the model of a dashboard config object with the given model and
 * replaces the model of every child widgets with the corresponding model based
 * on the model id.
 *
 * @param {!DashboardConfig} dashboardConfig
 * @param {!DashboardModel} dashboardModel
 */
WidgetFactoryService.prototype.patchDashboardWithModel = function(
    dashboardConfig, dashboardModel) {
  let children =
      /** @type {!Array.<ContainerWidgetModel>} */ (dashboardModel.children);
  let visitFn =
      /** @type {!Function} */ (angular.bind(this, this.patchWidgetWithModel));

  // Patch children.
  this.visitChildWidgets(children, visitFn);

  let oldChildren = dashboardConfig.model.children;
  // Replace the dashboard model with the new one.
  dashboardConfig.model = dashboardModel;
  // Keep the old children array references.
  dashboardConfig.model.children = oldChildren;
};

});  // goog.scope
