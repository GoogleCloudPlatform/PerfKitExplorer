/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview CloudsqlConfigDirective encapsulates HTML, style and behavior
 *     for configuration of Cloud SQL service settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigDirective');

goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigService');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;

/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.ext.cloudsql.CloudsqlConfigDirective = function() {
  return {
    restrict: 'E',
    transclude: false,
    scope: {},
    templateUrl: '/static/ext/cloudsql/cloudsql-config-directive.html',
    controller: ['$scope', 'cloudsqlConfigService', function($scope, cloudsqlConfigService) {
      // @export {!CloudsqlConfigService}
      $scope.ngModel = cloudsqlConfigService.config;
    }]
  };
};

});  // goog.scope
