/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Model classes for Explorer page state.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerStateModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * Model class for storing a list and selection state for entities.
 * @constructor
 * @template T
 * @ngInject
 */
explorer.components.explorer.ExplorerStateModel = function() {
  /**
   * Provides a dictionary of all entities, keyed by ID.
   * @export {!Object<key, T>}
   */
  this.all = {};
};


});  // goog.scope
