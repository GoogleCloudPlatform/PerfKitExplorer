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
 * @fileoverview columnStyleFormatService is an angular service used to
 * encapsulate functionality around column style UI and state.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleFormatService');

goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleFormatModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.COLUMN_FORMATS');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;
const ColumnStyleFormatModel = gviz.column_style.ColumnStyleFormatModel;
const COLUMN_FORMATS = gviz.column_style.COLUMN_FORMATS;
const ErrorTypes = explorer.components.error.ErrorTypes;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @export
 * @ngInject
 */
gviz.column_style.ColumnStyleFormatService = class {
  constructor($rootScope,
      errorService, arrayUtilService, dashboardService) {
    /** @private {!Angular.Scope} */
    this.$rootScope_ = $rootScope;

    /** @export {!ArrayUtilService} */
    this.arrayUtilSvc = arrayUtilService;

    /** @export {!DashboardService} */
    this.dashboardSvc = dashboardService;

    /** @export {!ErrorService} */
    this.errorSvc = errorService;

    /** @export {!Array.<!ColumnStyleFormatModel>} */
    this.allFormats = COLUMN_FORMATS;

    /** @export {!Object.<string, !ColumnStyleFormatModel>} */
    this.allFormatsIndex = arrayUtilService.getDictionary(
        this.allFormats, 'id');
  }

  getFormat(formatId) {
    if (goog.string.isEmptySafe(formatId)) {
      throw new Error('newModel failed: formatId is required');
    }

    let format = this.allFormatsIndex[formatId];

    if (!goog.isDefAndNotNull(format)) {
      throw new Error('newModel failed: formatId \'' + formatId +
          '\' cannot be found');
    }

    return format;
  }

  newModel(formatId) {
    let format = this.getFormat(formatId);
    let formatModel = Object.create(format.modelClass.prototype);
    format.modelClass.apply(formatModel);
    return formatModel;
  }
}

});  // goog.scope
