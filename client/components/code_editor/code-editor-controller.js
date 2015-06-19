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
 * @fileoverview CodeEditorController is an angular controller used to provide
 * a code editor.
 * It allows to edit:
 *    - the JSON model of the selected widget.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.code_editor.CodeEditorCtrl');

goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorMode');
goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorSettingsModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const CodeEditorMode = explorer.components.code_editor.CodeEditorMode;
const CodeEditorSettingsModel =
    explorer.components.code_editor.CodeEditorSettingsModel;
const DashboardService = explorer.components.dashboard.DashboardService;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;
const ExplorerService = explorer.components.explorer.ExplorerService;
const ExplorerStateService = explorer.components.explorer.ExplorerStateService;
const ResultsDataStatus = explorer.models.ResultsDataStatus;
const WidgetFactoryService = explorer.components.widget.WidgetFactoryService;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!DashboardService} dashboardService
 * @param {!ErrorService} explorerService
 * @param {!ExplorerService} explorerService
 * @param {!ExplorerStateService} explorerStateService
 * @param {!WidgetFactoryService} widgetFactoryService
 * @constructor
 * @ngInject
 */
explorer.components.code_editor.CodeEditorCtrl = function(
    $scope, dashboardService, errorService, explorerService,
    explorerStateService, widgetFactoryService) {
  /** @private {!WidgetFactoryService} */
  this.widgetFactoryService_ = widgetFactoryService;

  /** @export {!ExplorerService} */
  this.explorer = explorerService;

  /** @export {!DashboardService} */
  this.dashboard = dashboardService;

  /** @export {!ErrorService} */
  this.errorSvc = errorService;

  /** @export {!ExplorerStateSvc} */
  this.explorerStateSvc = explorerStateService;

  /**
   * Shortcut property to the code_editor section of the ExplorerSettingsModel.
   * @export {!CodeEditorSettingsModel}
   */
  this.settings = this.explorer.model.code_editor;

  /**
   * The currently edited JSON.
   * Note: It is converted to a string to enable text editing from the view.
   *
   * @export {{text: ?string}}
   */
  this.currentJson = {text: null};

  /**
   * Stores the current save state.
   * Prevents executing saveToText after executing saveToObject.
   * Because saveToObject changes the current object, the angular watcher is
   * triggered and call saveToText.
   *
   * @export {SaveState}
   */
  this.saveState = SaveState.NONE;

  /**
   * Options for the CodeMirror editor.
   * @export {!Object}
   */
  this.editorOptionsJSON = {
    lineWrapping: true,
    lineNumbers: true,
    mode: 'application/json'
  };

  /**
   * Options for the CodeMirror editor.
   * @export {!Object}
   */
  this.editorOptionsSQL = {
    lineWrapping: true,
    lineNumbers: true,
    mode: 'text/x-sql'
  };

  /**
   * Error messages raised by this controller.
   * @export {!Array.<string>}
   */
  this.errors = [];

  $scope.$watch(
      angular.bind(this, function() {
        if (this.explorerStateSvc.widgets.selected) {
          return this.explorerStateSvc.widgets.selected.model;
        } else {
          return null;
        }
      }),
      angular.bind(this, this.saveJsonToText), true); // Deep-equality check

  $scope.$watch(
      angular.bind(this, function() { return this.currentJson.text; }),
      angular.bind(this, this.saveTextToJson));

};
const CodeEditorCtrl = explorer.components.code_editor.CodeEditorCtrl;


/**
 * @enum {number}
 */
CodeEditorCtrl.SaveState = {
  NONE: 0,
  SAVING_TO_TEXT: 1,
  SAVING_TO_OBJECT: 2
};
let SaveState = CodeEditorCtrl.SaveState;


/**
 * Opens the code editor.
 * @export
 */
CodeEditorCtrl.prototype.openCodeEditor = function() {
  this.settings.isOpen = true;
  this.saveJsonToText();
  this.saveState = SaveState.NONE;
};


/**
 * Opens the code editor.
 * @export
 */
CodeEditorCtrl.prototype.changeSql = function() {
  if (!this.dashboard.selectedWidget.model.datasource.custom_query) {
    this.explorer.customizeSql(false);
  }
};


/**
 * Opens the code editor, and focuses on the Widget's overall JSON.
 * @export
 */
CodeEditorCtrl.prototype.openWidgetJsonEditor = function() {
  this.settings.selectedMode = CodeEditorMode.JSON;
  this.openCodeEditor();
};


/**
 * Opens the code editor, and focuses on the Query's SQL.
 * @export
 */
CodeEditorCtrl.prototype.editQuerySql = function() {
  this.explorer.model.readOnly = false;
  this.openQuerySqlEditor();
};


/**
 * Opens the code editor, and focuses on the Query's SQL.
 * @export
 */
CodeEditorCtrl.prototype.openQuerySqlEditor = function() {
  this.settings.selectedMode = CodeEditorMode.SQL;
  this.openCodeEditor();
};


/**
 * Closes the code editor.
 * @export
 */
CodeEditorCtrl.prototype.closeCodeEditor = function() {
  this.settings.isOpen = false;
};


/**
 * Converts the current object to JSON and saves it to currentJson.text.
 */
CodeEditorCtrl.prototype.saveJsonToText = function() {
  if (this.saveState === SaveState.SAVING_TO_OBJECT) {
    this.saveState = SaveState.NONE;
  } else {
    let selectedWidget = this.explorerStateSvc.widgets.selected;
    if (selectedWidget) {
      this.currentJson.text =
          this.widgetFactoryService_.toJson(selectedWidget, true);
    } else {
      this.currentJson.text = null;
    }

    this.saveState = SaveState.SAVING_TO_TEXT;
  }
};


/**
 * Converts currentJson.text to an object and replace the current object with
 * it.
 */
CodeEditorCtrl.prototype.saveTextToJson = function() {
  if (this.saveState === SaveState.SAVING_TO_TEXT) {
    this.saveState = SaveState.NONE;
  } else {
    let selectedWidget = this.dashboard.selectedWidget;
    if (selectedWidget) {
      let newModel;
      try {
        newModel = angular.fromJson(this.currentJson.text);
      } catch (e) {
        let msg = 'saveTextToJson failed: ' + e.message;
        this.errorSvc.addError(ErrorTypes.DANGER, msg);
      }

      if (newModel) {
        selectedWidget.model = newModel;
        this.saveState = SaveState.SAVING_TO_OBJECT;
      }
    }
  }
};


  /**
   * Returns whether the mode should be enabled.  This is used to disable
   * widget-specific modes (JSON and SQL) when no widget is selected.
   * @param {CodeEditorMode} mode
   * @returns {boolean} True if the mode should be enabled, otherwise False.
   * @export
   */
CodeEditorCtrl.prototype.getModeEnabled = function(mode) {
  switch (mode) {
    case CodeEditorMode.JSON:
    case CodeEditorMode.SQL:
      return (this.dashboard.selectedWidget !== null);
    default:
      return true;
  }
};

});  // goog.scope
