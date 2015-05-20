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
 * @fileoverview Service for state and content of Explorer tabs.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerTabService');
goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerTabModel');



goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * @typedef{{
 *   id: string,
 *   title: string,
 *   iconClass: string,
 *   template: string=,
 *   templateUrl: string=,
 *   requireWidget: boolean=
 * }}
 */
explorer.components.explorer.ExplorerTabModel;
var ExplorerTabModel = explorer.components.explorer.ExplorerTabModel;


/**
 * Service that provides state and content for Explorer tabs.
 * @constructor
 * @ngInject
 */
explorer.components.explorer.ExplorerTabService = function() {
  /** @export {!Array.<!ExplorerTabModel>} */
  this.tabs = [
    {id: 'dashboard', title: 'Dashboard', iconClass: 'fa fa-dashcube'},
//    {id: 'security', title: 'Security', iconClass: 'fa fa-key'},
    {id: 'data.filter', title: 'Data Filters', iconClass: 'fa fa-filter',
     requireWidget: true},
    {id: 'data.result', title: 'Data Results', iconClass: 'fa fa-table',
     requireWidget: true},
    {id: 'widget.config', title: 'Widget Config', iconClass: 'fa fa-font',
     requireWidget: true},
    {id: 'widget.chart', title: 'Chart Config', iconClass: 'fa fa-bar-chart',
     requireWidget: true},
    {id: 'alert.config', title: 'Detector', iconClass: 'fa fa-bell',
     requireWidget: true},
    {id: 'alert.notify', title: 'Notifications', iconClass: 'fa fa-envelope-o',
     requireWidget: true}
  ];
  
  /** @export {?ExplorerTabModel} */
  this.selectedTab = null;
  
  /**
   * Marks the provided tab as the selected one.
   * @param {?ExplorerTabModel} tab
   * @export
   */
   this.selectTab = function(tab) {
     this.selectedTab = tab;
   };
   
  /**
  * Toggles the selection state of a tab.
  * @param {?ExplorerTabModel} tab
  * @export
  */
  this.toggleTab = function(tab) {
    if (this.selectedTab == tab) {
      this.selectedTab = null;
    } else {
      this.selectTab(tab);
    }
  };
};
var ExplorerTabService = explorer.components.explorer.ExplorerTabService;


});  // goog.scope
