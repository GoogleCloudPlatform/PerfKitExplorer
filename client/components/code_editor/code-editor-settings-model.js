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
 * @fileoverview CodeEditorSettingsModel encapsulates Perfkit settings for
 *     the CodeMirror editor.
 * @author joemu@google.com (Joe Allan Muharsky)
 */
goog.provide('p3rf.perfkit.explorer.components.code_editor.CodeEditorMode');
goog.provide('p3rf.perfkit.explorer.components.code_editor.CodeEditorSettingsModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * Constants for the editor modes.
 * @enum
 * @export
 */
explorer.components.code_editor.CodeEditorMode = {
  JSON: 'JSON',
  SQL: 'SQL',
  LOG: 'LOG'
};
var Mode = explorer.components.code_editor.CodeEditorMode;


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
  this.selectedMode = '';

  /**
   * @type {Array.<string>}
   * @export
   */
  this.modes = [Mode.JSON, Mode.SQL, Mode.LOG];

  /**
   * @type {boolean}
   * @export
   */
  this.isOpen = false;
};
var CodeEditorSettingsModel =
    explorer.components.code_editor.CodeEditorSettingsModel;


});  // goog.scope
