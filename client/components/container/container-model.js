/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model definition for a widget of type container. It inherits
 * from WidgetModel.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.container.ContainerModel');
goog.provide('p3rf.dashkit.explorer.components.container.ContainerWidgetConfig');
goog.provide('p3rf.dashkit.explorer.components.container.ContainerWidgetModel');
goog.provide('p3rf.dashkit.explorer.components.container.Flow');

goog.require('p3rf.dashkit.explorer.models.WidgetConfig');
goog.require('p3rf.dashkit.explorer.models.WidgetModel');
goog.require('p3rf.dashkit.explorer.models.WidgetState');
goog.require('p3rf.dashkit.explorer.models.WidgetType');

goog.scope(function() {
var WidgetConfig = p3rf.dashkit.explorer.models.WidgetConfig;
var WidgetModel = p3rf.dashkit.explorer.models.WidgetModel;
var WidgetState = p3rf.dashkit.explorer.models.WidgetState;
var WidgetType = p3rf.dashkit.explorer.models.WidgetType;

/**
 * @enum {string}
 */
p3rf.dashkit.explorer.components.container.Flow = {
  ROW: 'row',
  COLUMN: 'column',
  WRAP: 'wrap'
};
var Flow = p3rf.dashkit.explorer.components.container.Flow;


/** @constructor */
p3rf.dashkit.explorer.components.container.
ContainerModel = function() {
  /**
   * @type {Flow}
   * @expose
   */
  this.flow = Flow.ROW;

  /**
   * @type {number}
   * @expose
   */
  this.columns = 1;

  /**
   * @type {number}
   * @expose
   */
  this.height = 250;

  /**
   * @type {Array.<WidgetConfig>}
   * @expose
   */
  this.children = [];
};
var ContainerModel = (
    p3rf.dashkit.explorer.components.container.ContainerModel);


/**
 * @constructor
 * @extends p3rf.dashkit.explorer.models.WidgetModel
 */
p3rf.dashkit.explorer.components.container.
ContainerWidgetModel = function() {
  goog.base(this);

  this.type = WidgetType.CONTAINER;

  /**
   * @type {ContainerModel}
   * @expose
   */
  this.container = new ContainerModel();
};
var ContainerWidgetModel = (
    p3rf.dashkit.explorer.components.container.
    ContainerWidgetModel);
goog.inherits(ContainerWidgetModel, WidgetModel);


/**
 * @constructor
 * @param {!Object} widgetFactoryService
 * @param {?(Object|ContainerWidgetModel)} opt_model JSON or
 *     ContainerWidgetModel.
 * @extends p3rf.dashkit.explorer.models.WidgetConfig
 */
p3rf.dashkit.explorer.components.container.
ContainerWidgetConfig = function(
    widgetFactoryService, opt_model) {
  /**
   * The persisted model of the widget. It's usually a simple JSON object
   * returned by the server but it respects the ContainerWidgetModel class
   * definition.
   *
   * Warning: Do not keep a reference on this property, it can be replaced by an
   * updated JSON at any time. Instead, keep a reference on the
   * ContainerWidgetConfig object that contains it.
   *
   * @type {!(Object|ContainerWidgetModel)}
   * @expose
   */
  this.model = opt_model || new ContainerWidgetModel();

  if (!this.model.id) {
    this.model.id = widgetFactoryService.generateWidgetId();
  }

  // Add the widget to widgetsById.
  widgetFactoryService.widgetsById[this.model.id] = this;

  /**
   * Returns the state object corresponding to this widget.
   *
   * Note: It is a function in order for Angular watchers to be able to watch
   * this widget and ignore its state. Otherwise, it will throw a circular
   * dependency error.
   *
   * @return {WidgetState}
   * @expose
   */
  this.state = function() {
    return widgetFactoryService.statesById[this.model.id];
  };

  // Add the widget state to statesById.
  widgetFactoryService.statesById[this.model.id] =
  widgetFactoryService.statesById[this.model.id] || new WidgetState();
};
var ContainerWidgetConfig = (
    p3rf.dashkit.explorer.components.container.
    ContainerWidgetConfig);
// No formal goog.inherits to work around lack of generics.

});  // goog.scope
