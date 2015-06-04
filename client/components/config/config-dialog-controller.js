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


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ConfigService = explorer.components.config.ConfigService;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.Log} $log
 * @param {!angular.$modalInstance} $modalInstance
 * @constructor
 * @ngInject
 */
explorer.components.config.ConfigDialogCtrl = function(
    $scope, $log, $modalInstance, configService) {
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
   * @type {!angular.$modalInstance}
   * @private
   */
  this.modalInstance_ = $modalInstance;

  /** @export @type {ConfigService} */
  this.configService = configService;

  /** @export @type {!Object} */
  this.workingConfig = configService.toJSON();
};
var ConfigDialogCtrl = (
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
