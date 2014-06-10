/**
 * @fileoverview CodeEditorSettingsModel encapsulates Dashkit settings for
 *     the CodeMirror editor.
 * @author joemu@google.com (Joe Allan Muharsky)
 */
goog.provide('p3rf.dashkit.explorer.components.code_editor.CodeEditorSettingsModel');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * Model for the settings of the code editor.
 *
 * @constructor
 * @ngInject
 */
explorer.components.code_editor.CodeEditorSettingsModel = function() {
  /**
   * @type {string}
   * @export
   */
  this.selectedMode = 'JSON';

  /**
   * @type {Array.<string>}
   * @export
   */
  this.modes = ['JSON', 'SQL'];

  /**
   * @type {boolean}
   * @export
   */
  this.isOpen = false;
};
var CodeEditorSettingsModel =
    explorer.components.code_editor.CodeEditorSettingsModel;


});  // goog.scope
