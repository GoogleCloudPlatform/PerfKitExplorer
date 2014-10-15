/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview AlertLogDirective encapsulates HTML, style and behavior
 *     for a list of alert items.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.alert.AlertLogDirective');

goog.require('p3rf.perfkit.explorer.components.error.ErrorService');


goog.scope(function() {
  var explorer = p3rf.perfkit.explorer;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @return {Object} Directive definition object.
   */
  explorer.components.alert.AlertLogDirective = function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: '/static/components/alert/alert-log-directive.html',
      controller: function($scope, errorService) {
        $scope.errorService = errorService;
      }
    };
  };

});  // goog.scope
