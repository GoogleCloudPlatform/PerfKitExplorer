/**
 * @fileoverview Model definition for a BigQuery query against Dashkit samples
 * data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.models.IQueryConfigModel');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/** @interface */
explorer.models.IQueryConfigModel = function() {};
var IQueryConfigModel = explorer.models.IQueryConfigModel;


/**
 * Returns a JSON object that represents the query's settings.
 * @return {object}
 */
IQueryConfigModel.prototype.getConfig = function() {};


/**
 * Sets the query's configuration based on values in a JSON config.
 * @param {object} config A JSON object that represents the query's settings.
 */
IQueryConfigModel.prototype.setConfig = function(config) {};


});  // goog.scope
