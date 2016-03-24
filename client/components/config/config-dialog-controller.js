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
 * @fileoverview ConfigDialogCtrl is an angular controller representing
 * the popup dialog for configuration.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.config.ConfigDialogCtrl');

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigService');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ConfigService = explorer.components.config.ConfigService;
const CloudsqlConfigService = explorer.ext.cloudsql.CloudsqlConfigService;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.$log} $log
 * @param {!ui.bootstrap.modalInstance} $modalInstance
 * @param {!ConfigService} configService
 * @param {!CloudsqlConfigService} cloudsqlConfigService
 * @constructor
 * @ngInject
 */
explorer.components.config.ConfigDialogCtrl = function(
    $scope, $log, $modalInstance, configService, cloudsqlConfigService) {
  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /** @type {!angular.$log}
   * @private
   */
  this.log_ = $log;

  /**
   * @type {!ui.bootstrap.modalInstance}
   * @private
   */
  this.modalInstance_ = $modalInstance;

  /** @type {CloudsqlConfigService} */
  this.cloudsqlConfigService = cloudsqlConfigService;

  /** @export {ConfigService} */
  this.configService = configService;

  /** @export {!Object} */
  this.workingConfig = configService.toJSON();
};
const ConfigDialogCtrl = (
    explorer.components.config.ConfigDialogCtrl);


/**
 * Accepts the dialog.
 * @export
 */
ConfigDialogCtrl.prototype.refresh = function() {
  this.configService.refresh();
  this.workingConfig = this.configService.toJSON();
};


/**
 * Accepts the dialog.
 * @export
 */
ConfigDialogCtrl.prototype.ok = function() {
  this.configService.populate(this.workingConfig);
  this.configService.update();

  // TODO: Refactor extension config updates into extensibility library.
  this.cloudsqlConfigService.update();

  this.modalInstance_.close();
};


/**
 * Cancels the dialog.
 * @export
 */
ConfigDialogCtrl.prototype.cancel = function() {
  this.modalInstance_.dismiss('cancel');
};

});  // goog.scope
