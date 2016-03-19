goog.provide('p3rf.perfkit.explorer.ext.text.module');

goog.require('p3rf.perfkit.explorer.ext.text.TextDatasourceDirective');


goog.scope(function() {
  const text = p3rf.perfkit.explorer.ext.text;
  
  text.module = angular.module('pkx.text', []);

  text.module.directive('textDatasource', text.TextDatasourceDirective);
});
