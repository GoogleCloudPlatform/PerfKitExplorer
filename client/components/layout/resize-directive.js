goog.provide('p3rf.perfkit.explorer.components.layout.ResizeDirective');

goog.require('p3rf.perfkit.explorer.components.layout.ResizeService');


/**
 * @returns {!ResizeDirective}
 * @ngInject
 * @export
 * @constructor
 */
p3rf.perfkit.explorer.components.layout.ResizeDirective = function(resizeService) {
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, element, attr) {
          scope.resizeDirection = attr.resize.toUpperCase();

          if (!attr.resizeElementId) {
            throw 'Internal error: resizeElementId must be provided.'
          }
          scope.resizeElement = document.getElementById(attr.resizeElementId);

          if (!scope.resizeElement) {
            console.log('Internal error: resizeElement ' + attr.resizeElementId + ' not found.')
          }
          element.addClass('perfkit2-resize-' + scope.resizeDirection.toLowerCase());

          element.on('mousedown', angular.bind(this, function(event) {
            event.preventDefault();

            resizeService.startResize(scope.resizeElement, scope.resizeDirection, event);
            scope.$apply();
          }));
        }
    }
};
