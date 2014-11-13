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
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var CodeEditorSettingsModel = (
    explorer.components.code_editor.CodeEditorSettingsModel);
var DashboardConfig = explorer.components.dashboard.DashboardConfig;
var DashboardModel = explorer.components.dashboard.DashboardModel;



/** @constructor */
explorer.components.explorer.ExplorerModel = function() {
  /**
   * @type {!Array.<(DashboardConfig|DashboardModel)>}
   * @export
   */
  this.dashboards = [];

  /**
   * @type {?boolean}
   * @export
   */
  this.readOnly = null;

  /**
   * @type {!boolean}
   * @export
   */
  this.hideToolbar = false;

  /** @type {!CodeEditorSettingsModel} */
  this.code_editor = new CodeEditorSettingsModel();
};
var ExplorerModel = explorer.components.explorer.ExplorerModel;

});  // goog.scope
