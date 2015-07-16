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

goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ErrorService = explorer.components.error.ErrorService;
const ErrorTypes = explorer.components.error.ErrorTypes;


/**
 * Model class for listing and selecting entities.
 *
 * The .all property provides a dictionary of all entities, keyed by ID
 * for fast lookup.  The AngularUI State Service stores the actual
 * selection ID's, and the .selectedId and .selected properties reference
 * this.
 *
 * @constructor
 * @template T
 * @ngInject
 */
explorer.components.explorer.ExplorerStateModel = function(
    stateService, errorService, stateName) {
  /** @private {!ErrorService} */
  this.errorSvc_ = errorService;

  /**
   * Provides a dictionary of all entities, keyed by ID.
   * @export {!Object<string, T>}
   */
  this.all = {};

  /**
   * Returns the selected id.  This is stored in the state service/URL.
   * If no item is selected, returns NULL.
   */
  Object.defineProperty(this, 'selectedId', {
    /** @type {?string} */
    get: function() {
      if (stateService.params[stateName]) {
        return stateService.params[stateName];
      } else {
        return null;
      }
    }
  });

  /**
   * Returns the item matching the selected id.
   */
  Object.defineProperty(this, 'selected', {
    /** @type {T} */
    get: function() {
      if (goog.isDefAndNotNull(this.selectedId)) {
        let selected = this.all[this.selectedId];

        if (goog.isDefAndNotNull(selected)) {
          return selected;
        }
      }

      return null;
    }
  });

  /**
   * Returns true if the selected id exists in the .all dictionary.
   * Also returns true if selectedId is not specified. Otherwise,
   * returns false.
   */
   Object.defineProperty(this, 'selectedIdIsValid', {
     /** @type {boolean} */
     get: function() {
       if (!goog.isDefAndNotNull(this.selectedId)) {
         return false;
       }
       return goog.isDefAndNotNull(this.all[this.selectedId]);
     }
   })
};
const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;


/**
 * Adds an item to the all dictionary, using the id as the key.
 * @export
 */
ExplorerStateModel.prototype.add = function(item) {
  if (
      goog.isDefAndNotNull(item) &&
      goog.isDefAndNotNull(item.model) &&
      goog.isDefAndNotNull(item.model.id)) {
    this.all[item.model.id] = item;
  } else {
    this.errorSvc_.addError(ErrorTypes.Danger,
        'add failed: item is invalid');
  }
};

});  // goog.scope
