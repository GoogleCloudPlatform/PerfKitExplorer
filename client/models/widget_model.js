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
 * @fileoverview Model definition for a widget of any type. Widgets are
 * retrieved in the JSON format from a REST service (see DashboardDataService).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.models.LayoutModel');
goog.provide('p3rf.perfkit.explorer.models.WidgetConfig');
goog.provide('p3rf.perfkit.explorer.models.WidgetModel');
goog.provide('p3rf.perfkit.explorer.models.WidgetState');
goog.provide('p3rf.perfkit.explorer.models.WidgetType');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * @enum {string}
 */
explorer.models.WidgetType = {
  CHART: 'chart',
  CONTAINER: 'container'
};
var WidgetType = explorer.models.WidgetType;



/** @constructor */
explorer.models.WidgetState = function() {
  /**
   * @type {boolean}
   * @export
   */
  this.selected = false;

  /**
   * TODO: Change type to ContainerWidgetConfig when we figure
   * out how to solve the circular dependency.
   * @type {Object}
   * @export
   */
  this.parent = null;
};
var WidgetState = explorer.models.WidgetState;



/** @constructor */
explorer.models.LayoutModel = function() {
  /**
   * @type {number}
   * @export
   */
  this.columnspan = 1;

  /**
   * @type {?string}
   * @export
   */
  this.cssClasses = null;
};
var LayoutModel = explorer.models.LayoutModel;



/** @constructor */
explorer.models.WidgetModel = function() {
  /**
   * @type {?string}
   * @export
   */
  this.id = null;

  /**
   * @type {string}
   * @export
   */
  this.title = '';

  /**
   * @type {string}
   * @export
   */
  this.url = '';

  /**
   * @type {?string}
   * @export
   */
  this.type = null;

  /**
   * @type {!LayoutModel}
   * @export
   */
  this.layout = new LayoutModel();
};
var WidgetModel = explorer.models.WidgetModel;



/**
 * @constructor
 * @param {!Object} widgetFactoryService
 * @param {?(Object|WidgetModel)=} opt_model JSON or WidgetModel.
 */
explorer.models.WidgetConfig = function(widgetFactoryService, opt_model) {
  /**
   * The persisted model of the widget. It's usually a simple JSON object
   * returned by the server but it respects the WidgetModel class
   * definition.
   *
   * Warning: Do not keep a reference on this property, it can be replaced by an
   * updated JSON at any time. Instead, keep a reference on the
   * WidgetConfig object that contains it.
   *
   * @type {!(Object|WidgetModel)}
   * @export
   */
  this.model = opt_model || new WidgetModel();

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
   * @export
   */
  this.state = function() {
    return widgetFactoryService.statesById[this.model.id];
  };

  // Add the widget state to statesById.
  widgetFactoryService.statesById[this.model.id] =
      widgetFactoryService.statesById[this.model.id] || new WidgetState();
};
var WidgetConfig = explorer.models.WidgetConfig;

});  // goog.scope
