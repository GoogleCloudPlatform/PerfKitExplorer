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

goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateModel');



goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;


/**
 * Service that provides state and content for the Explorer page..
 * @constructor
 * @ngInject
 */
explorer.components.explorer.ExplorerStateService = function() {
  /**
   * Provides storage for a list of dashboards and selection context.
   * @type {?DashboardModel}
   */
  this.selectedDashboard = null;

  /**
   * Provides storage for a list of containers and selection context.
   * @type {!ExplorerStateModel<DashboardModel>}
   */
  this.containers =
      /** @type {!ExplorerStateModel<ContainerWidgetModel>} */
      (new ExplorerStateModel());

  /**
   * Provides storage for a list of widgets and selection context.
   * @type {!ExplorerStateModel<DashboardModel>}
   */
  this.widgets =
      /** @type {!ExplorerStateModel<WidgetModel>} */
      (new ExplorerStateModel());

  /**
   * Provides storage for a list of sidebar tabs and selection context.
   * @type {!ExplorerStateModel<DashboardModel>}
   */
  this.tabs =
      /** @type {!ExplorerStateModel<SidebarTabModel>} */
      (new ExplorerStateModel());

  /**
   * Provides storage for a list of footer tabs and selection context.
   * @type {!ExplorerStateModel<DashboardModel>}
   */
  this.footerTabs =
      /** @type {!ExplorerStateModel<FooterTabModel>} */
      (new ExplorerStateModel());

  /**
   * Returns true if the selected widget is maximized, otherwise false.
   * @export {boolean}
   */
  this.widgetIsFocused = false;


  /**
   * Returns true if the footer is visible (expanded), otherwise false.
   * @export {boolean}
   */
  this.footerIsVisible = false;
};
const ExplorerStateService = explorer.components.explorer.ExplorerStateService;


});  // goog.scope
