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
 * @fileoverview Service for state and content of the field and label
 *    picklists.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.picklist.PicklistService');
goog.provide('p3rf.perfkit.explorer.components.widget.query.picklist.PicklistStates');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const picklist = explorer.components.widget.query.picklist;


/**
 * @enum {string}
 * @export
 */
picklist.PicklistStates = {
  EMPTY: 'EMPTY',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
};
const PicklistStates = picklist.PicklistStates;


/**
 * @export {!Array.<string>}
 */
picklist.PicklistNames = ['product_name', 'test', 'metric', 'runby'];


/**
 * @export
 */
picklist.PicklistItemModel = class {
  constructor() {
    /** @export {string} */
    this.title = '';
  }
};
const PicklistItemModel = picklist.PicklistItemModel;


/**
 * @export
 */
picklist.PicklistModel = class {
  constructor() {
    /** @export {!PicklistStates} */
    this.state = PicklistStates.EMPTY;
    
    /** @export {!boolean} */
    this.is_loading = false;

    /** @export {!Array.{!PicklistItemModel}} */
    this.items = [];
  }
}
const PicklistModel = picklist.PicklistModel;


/**
 * Service that provides state and content for field and label picklists.
 * @constructor
 * @ngInject
 */
picklist.PicklistService = function(fieldCubeDataService) {
  this.picklists = {};
  
  this.dataSvc = fieldCubeDataService;

  this.initialize();
};
const PicklistService = picklist.PicklistService;


/**
 * Initializes the picklists.
 */
PicklistService.prototype.initialize = function() {
  picklist.PicklistNames.forEach(
      str => this.picklists[str] = new PicklistModel());
  
  var TEST_ITEMS = this.picklists['product_name'].items;
  TEST_ITEMS.push({'name': 'PRODUCT_ONE'});
  TEST_ITEMS.push({'name': 'PRODUCT_TWO'});
  TEST_ITEMS.push({'name': 'PRODUCT_THREE'});
};


/**
 * Refreshes the specified picklist.
 * @export
 */
PicklistService.prototype.refresh = function(picklistName, queryFilter) {
  let picklist = this.picklists[picklistName];

  if (picklist.state === PicklistStates.LOADING) {
    return;
  }

  picklist.state = PicklistStates.LOADING;
  picklist.is_loading = true;
  let promise = this.dataSvc.list(picklistName, queryFilter);

  promise.then(angular.bind(this, function(picklistData) {
    picklist.items.length = 0;
    picklistData.forEach(item => picklist.items.push(item));
    picklist.state = PicklistStates.LOADED;
    picklist.is_loading = false;
  }));

  promise.then(null, angular.bind(this, function(error) {
    picklist.state = PicklistStates.ERROR;
    picklist.is_loading = false;
    this.errors.push(error.message);
  }));
};

}); // goog.scope
