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
 * @fileoverview Model definition for the top-level config and settings of
 * Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerModel');

goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorSettingsModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardInstance');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const CodeEditorSettingsModel = (
    explorer.components.code_editor.CodeEditorSettingsModel);
const DashboardInstance = explorer.components.dashboard.DashboardInstance;
const DashboardModel = explorer.components.dashboard.DashboardModel;



/** @constructor */
explorer.components.explorer.ExplorerModel = function() {
  /** @export {!Array.<(DashboardInstance|DashboardModel)>} */
  this.dashboards = [];

  /** @export {?boolean} */
  this.readOnly = null;

  /** @export {!boolean} */
  this.hideToolbar = false;

  /** @export {!boolean} */
  this.logStatistics = false;

  /** @export {!CodeEditorSettingsModel} */
  this.code_editor = new CodeEditorSettingsModel();

  /** @export {!boolean} */
  this.footerVisible = false;

  /** @export {!boolean} */
  this.dashboardIsLoading = false;
};
const ExplorerModel = explorer.components.explorer.ExplorerModel;

});  // goog.scope
