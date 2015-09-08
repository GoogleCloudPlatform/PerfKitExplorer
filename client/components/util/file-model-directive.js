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
const explorer = p3rf.perfkit.explorer;


/**
 * @param {!angular.$parse} $parse Provides parsing services
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.util.FileModelDirective = function($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      let model = $parse(attrs.fileModel);
      let modelSetter = model.assign;

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
};

});  // goog.scope
