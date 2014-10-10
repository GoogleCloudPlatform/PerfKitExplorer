goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');

goog.scope(function() {
  p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil = function() {
  };
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  DashboardVersionUtil.UpdateContainer = function(dashboard, updateFn) {
    angular.forEach(dashboard.children, function(container) {
      updateFn(container);
    });
  };


  DashboardVersionUtil.UpdateWidget = function(dashboard, updateContainerFn, updateWidgetFn) {
    angular.forEach(dashboard.children, function(container) {
      updateContainerFn && updateContainerFn(container);
      angular.forEach(container.children, function(widget) {
        updateWidgetFn && updateWidgetFn(widget);
      });
    });
  };
});
