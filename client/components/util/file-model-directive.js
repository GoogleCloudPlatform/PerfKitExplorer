/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview FileModel allows binding of a file input box's filename to a
 * model value.  This class is based on the AngulaRJS/file upload example at:
 * http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
 *
 * Usage:
 *   <input type="file" file-model="myFile" />
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.util.FileModelDirective');



goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * @param {!angular.$parse} $parse Provides parsing services
 * @return {Object} Directive definition object.
 */
explorer.components.util.FileModelDirective = (function($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function () {
        scope.$apply(function () {
          console.log(element);
          console.log('Setting:');
          console.log(attrs.fileModel);
          console.log(model);
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
});

});  // goog.scope
