/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview QueryFilterDirective encapsulates HTML, style and behavior
 *     for a filter field in the query editor.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryFilterDirective');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.query.QueryFilterDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      autocompleteItems: '='
    },
    templateUrl: '/static/components/widget/query/query-filter-directive.html',
    controllerAs: 'queryFilterCtrl',
    controller: function($scope) {

    },
    link: function(scope, element, attr) {
      scope.title = attr.title;
    }
  };
};

});  // goog.scope
