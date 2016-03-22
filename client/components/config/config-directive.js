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
 * @fileoverview ConfigDirective encapsulates HTML, style and behavior
 *     for the PerfKit Explorer config.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.config.ConfigDirective');
goog.provide('p3rf.perfkit.explorer.components.config.ConfigTemplateUrl');

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;

  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {Object} Directive definition object.
   */
  explorer.components.config.ConfigDirective = function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        'ngModel': '='
      },
      templateUrl: '/static/components/config/config-directive.html',
      controller: ['$scope', function($scope) {
        /** @return {boolean} */
        $scope.isCurrentUserAdmin = function() {
          return goog.global['CURRENT_USER_ADMIN'];
        }
      }]
    };
  };

});  // goog.scope
