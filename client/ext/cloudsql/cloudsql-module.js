goog.provide('p3rf.perfkit.explorer.ext.cloudsql.module');

goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlDatasourceModel');
goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlDatasourceDirective');


goog.scope(function() {
  const cloudsql = p3rf.perfkit.explorer.ext.cloudsql;
  
  cloudsql.module = angular.module('pkx.cloudsql', []);

  cloudsql.module.directive('cloudsqlDatasource', cloudsql.CloudsqlDatasourceDirective);
});
