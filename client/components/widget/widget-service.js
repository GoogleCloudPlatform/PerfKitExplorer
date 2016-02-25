/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview widgetService is an angular service that provides
 * utility and management functions for operating on widgets.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.WidgetService');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const WidgetConfig = explorer.models.WidgetConfig;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @constructor
 */
explorer.components.widget.WidgetService = class {
  constructor() {
    /** @export {string} */
    this.WIDGET_DELETE_WARNING = 'The widget will be deleted:\n\n';
  };

  /**
   * Returns the delete warning for a widget.
   *
   * @param {!WidgetConfig} widget
   * @return {string}
   */
  getDeleteWarningMessage(widget) {
    let widgetName = '';
    
    if (widget.model.title) {
      widgetName = '\'' + widget.model.title + '\'';
    } else {
      widgetName = 'Untitled';
    }

    return this.WIDGET_DELETE_WARNING + widgetName;
  };
};
const WidgetService = explorer.components.widget.WidgetService;


});  // goog.scope
