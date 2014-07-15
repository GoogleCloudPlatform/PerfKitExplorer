/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
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
