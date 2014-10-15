/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview CodeEditorSettingsModel encapsulates Perfkit settings for
 *     the CodeMirror editor.
 * @author joemu@google.com (Joe Allan Muharsky)
 */
goog.provide('p3rf.perfkit.explorer.components.code_editor.CodeEditorSettingsModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;



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
  this.modes = ['JSON', 'SQL', 'LOG'];

  /**
   * @type {boolean}
   * @export
   */
  this.isOpen = false;
};
var CodeEditorSettingsModel =
    explorer.components.code_editor.CodeEditorSettingsModel;


});  // goog.scope
