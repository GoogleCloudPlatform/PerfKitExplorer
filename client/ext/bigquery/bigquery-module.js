goog.provide('p3rf.perfkit.explorer.ext.bigquery.module');

goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryDatasourceModel');
goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryDatasourceService');
goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryDatasourceDirective');


goog.scope(function() {
  const bigquery = p3rf.perfkit.explorer.ext.bigquery;
  
  bigquery.module = angular.module('pkx.bigquery', []);
  
  bigquery.module.service('bigqueryDatasourceService', bigquery.BigqueryDatasourceService);

  bigquery.module.directive('bigqueryDatasource', bigquery.BigqueryDatasourceDirective);
});
