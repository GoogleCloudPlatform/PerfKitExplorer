/**
 * @fileoverview Model definition for the top-level config and settings of
 * Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.explorer.ExplorerModel');

goog.require('p3rf.dashkit.explorer.components.code_editor.CodeEditorSettingsModel');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardConfig');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardModel');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
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
