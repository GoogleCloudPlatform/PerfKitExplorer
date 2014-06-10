/**
 * @fileoverview Model classes for query filters and constraints.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.DateFilter');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.DateFilterType');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.MetadataFilter');
goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryFilterModel');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;


/**
 * Type definition for a metadata-filter specifier.
 * @export
 */
explorer.models.dashkit_simple_builder.MetadataFilter = function() {
  /** @type {!string} */
  this.label = '';

  /** @type {!string} */
  this.value = '';

  /** @type {!string} */
  this.text = '';
};
var MetadataFilter = explorer.models.dashkit_simple_builder.MetadataFilter;


/**
 * Constants describing the types of filters applied to dates.
 * @export
 */
explorer.models.dashkit_simple_builder.DateFilterType = {
  CUSTOM: 'CUSTOM',
  YEAR: 'YEAR',
  MONTH: 'MONTH',
  WEEK: 'WEEK',
  DAY: 'DAY',
  HOUR: 'HOUR',
  MINUTE: 'MINUTE',
  SECOND: 'SECOND'
};
var DateFilterType = explorer.models.dashkit_simple_builder.DateFilterType;



/**
 * @param {?string=} opt_filterValue
 * @param {?string=} opt_filterType
 * @param {?string=} opt_specifyTime
 * @param {?string=} opt_text
 * @constructor
 */
explorer.models.dashkit_simple_builder.DateFilter = function(
    opt_filterValue, opt_filterType, opt_specifyTime, opt_text) {
  /** @type {!DateFilterType} */
  this.filter_type = opt_filterType || DateFilterType.CUSTOM;

  /** @type {?string} */
  this.filter_value = opt_filterValue || null;

  /** @type {!bool} */
  this.specify_time = opt_specifyTime || false;

  /** @type {!string} */
  this.text = opt_text || opt_filterValue || '';
};
var DateFilter = explorer.models.dashkit_simple_builder.DateFilter;



/**
 * Angular model that provides filter settings for a Dashkit Samples query.
 *
 * @constructor
 * @ngInject
 */
explorer.models.dashkit_simple_builder.QueryFilterModel = (
    function() {
      /**
       * @type {DateFilter}
       * @export
       */
      this.start_date = new DateFilter();

      /**
       * @type {?DateFilter}
       * @export
       */
      this.end_date = null;

      /**
       * @type {?string}
       * @export
       */
      this.product_name = null;

      /**
       * @type {?string}
       * @export
       */
      this.test = null;

      /**
       * @type {?string}
       * @export
       */
      this.metric = null;

      /**
       * @type {?string}
       * @export
       */
      this.official = null;

      /**
       * @type {?string}
       * @export
       */
      this.runby = null;

      /**
       * @type {Array.<!MetadataFilter>}
       * @export
       */
      this.metadata = [];
    });
var QueryFilterModel = explorer.models.dashkit_simple_builder.QueryFilterModel;


});  // goog.scope
