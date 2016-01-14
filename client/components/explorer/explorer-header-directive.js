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
 * @fileoverview ExplorerHeaderDirective encapsulates HTML, style and behavior
 *     for the page header of Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerHeaderDirective');

goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorMode');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const CodeEditorMode = explorer.components.code_editor.CodeEditorMode;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.explorer.ExplorerHeaderDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/static/components/explorer/explorer-header-directive.html',
    controllerAs: 'ctrl',
    controller: [
        '$scope', '$modal', 'explorerService', 'dashboardService', 'errorService', 'workQueueService',
        function(
            $scope, $modal, explorerService, dashboardService, errorService, workQueueService) {
      /** @export */
      this.explorerSvc = explorerService;

      /** @private */
      this.modal_ = $modal;

      /** @export */
      this.dashboardSvc = dashboardService;

      /** @export */
      this.dashboards = this.explorerSvc.model.dashboards;

      /** @export */
      this.errorSvc = errorService;

      /** @export */
      this.workQueueSvc = workQueueService;

      // TODO(#139): Move to dedicated container service.
      /**
       * Prompts the user for a title, then copies the selected dashboard.
       * @export
       */
      this.saveDashboardCopy = function() {
        let title = window.prompt(
            'Please provide the title for your dashboard',
            this.dashboardSvc.current.model.title);
        if (!title) { return; }

        this.dashboardSvc.current.model.title = title;
        this.dashboardSvc.current.model.owner = '';
        this.dashboardSvc.saveDashboardCopy();
      };

      // TODO: Replace modal dialog with ui-router view.
      /**
       * Opens a dialog to edit the page config.
       * @export
       */
      this.editConfig = function() {
        this.modal_.open({
          templateUrl: '/static/components/config/config-dialog.html',
          controller: 'ConfigDialogCtrl as dialog'
        });
      };

      /**
       * Returns true if the 'Show Log' button should display, otherwise false.
       * @export
       */
      this.canShowLog = function() {
        return (
            this.errorSvc.errors.length > 0 &&
            !(this.explorerSvc.model.code_editor.isOpen &&
            this.explorerSvc.model.code_editor.selectedMode ===
                CodeEditorMode.LOG));
      };
    }]
  };
};

});  // goog.scope
