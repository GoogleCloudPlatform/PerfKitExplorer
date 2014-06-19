/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model for query column/result data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.LabelResult');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryColumnModel');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryDateGroupings');

goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * Type definition for a label-result specifier.  Though it's a simple string,
 * the wrapper is required for angular binding purposes.
 * @constructor
 */
explorer.models.dashkit_simple_builder.LabelResult = function() {
  /** @type {!string} */
  this.label = '';
};
var LabelResult = explorer.models.dashkit_simple_builder.LabelResult;


/**
 * @enum {string}
 */
explorer.models.dashkit_simple_builder.QueryDateGroupings = {
  ONEGROUP: 'OneGroup',
  DETAILS: 'Details',
  DAILY: 'Daily',
  WEEKLY: 'Weekly'
};
var QueryDateGroupings =
    explorer.models.dashkit_simple_builder.QueryDateGroupings;



/**
 * Angular service that provides the column configuration of a Samples query.
 *
 * @constructor
 * @ngInject
 */
explorer.models.dashkit_simple_builder.QueryColumnModel = function() {
  /**
   * @type {QueryDateGroupings}
   * @expose
   */
  this.date_group = QueryDateGroupings.ONEGROUP;

  /**
   * @type {Array.<!LabelResult>}
   * @expose
   */
  this.labels = [];
};

var QueryColumnModel = explorer.models.dashkit_simple_builder.QueryColumnModel;

});  // goog.scope
