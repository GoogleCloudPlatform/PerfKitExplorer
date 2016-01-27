goog.provide('p3rf.perfkit.explorer.ext.bigquery.module');

goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryConfigModel');
goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryConfigService');
goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryWidgetService');


goog.scope(function() {
  const bigquery = p3rf.perfkit.explorer.ext.bigquery;

  bigquery.module = angular.module('pkx.bigquery', []);

  bigquery.module.service('bigqueryConfigService', bigquery.BigqueryConfigService);
  bigquery.module.service('bigqueryWidgetService', bigquery.BigqueryWidgetService);
});
