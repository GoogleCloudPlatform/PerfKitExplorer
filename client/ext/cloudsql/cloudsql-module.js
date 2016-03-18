goog.provide('p3rf.perfkit.explorer.ext.cloudsql.module');

goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigService');
goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigDirective');
goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlDatasourceDirective');


goog.scope(function() {
  const cloudsql = p3rf.perfkit.explorer.ext.cloudsql;
  
  cloudsql.module = angular.module('pkx.cloudsql', []);

  cloudsql.module.service('cloudsqlConfigService', cloudsql.CloudsqlConfigService);

  cloudsql.module.directive('cloudsqlConfig', cloudsql.CloudsqlConfigDirective);
  cloudsql.module.directive('cloudsqlDatasource', cloudsql.CloudsqlDatasourceDirective);
});
