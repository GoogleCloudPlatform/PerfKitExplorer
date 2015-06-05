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


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const picklist = explorer.components.widget.query.picklist;


/**
 * @enum {string}
 */
picklist.PicklistStates = {
  EMPTY: 'EMPTY',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
};
const PicklistStates = picklist.PicklistStates;


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


PicklistService.prototype.initialize = function() {
  var picklists = ['product_name', 'test', 'metric', 'runby'];

  picklists.forEach(str => this.picklists[str] = new PicklistModel());
};


PicklistService.prototype.refresh = function(picklistName, queryFilter) {
  
};

}); // goog.scope
