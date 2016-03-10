goog.provide('p3rf.perfkit.explorer.ext.cloudsql.module');

goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigModel');
goog.require('p3rf.perfkit.explorer.ext.cloudsql.CloudsqlConfigDirective');


goog.scope(function() {
  const cloudsql = p3rf.perfkit.explorer.ext.cloudsql;
  
  cloudsql.module = angular.module('pkx.cloudsql', []);

  cloudsql.module.directive('cloudsqlConfig', cloudsql.CloudsqlConfigDirective);
});
