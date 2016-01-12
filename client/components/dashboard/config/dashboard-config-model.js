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
 * @fileoverview DashboardConfigModel encapsulates the settings for dashboards.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.config.DashboardConfigModel');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @constructor
   * @extends {IBaseOptimizer}
   */
  explorer.components.dashboard.config.DashboardConfigModel = class {
    constructor() {
      /**
       * A dictionary of config models provided by extensions.
       * @export {{string, {IExplorerExtension}}}
       */
      this.ext = {};
    }
    
    /**
     * Adds the specified extension model.
     * @param {IExplorerExtension} extension The extension model to add.
     */
    addExtension(extension, replace=false) {
      if (goog.string.isEmptySafe(extension.id)) {
        throw new Error('The provided extension does not have a valid id.');
      }
      
      if (!replace && goog.isDefAndNotNull(this.ext[extension.id])) {
        throw new Error('The extension ' + extension.id + ' is already registered.');
      }
      
      this.ext[extension.id] = extension;
    }
  }

});
