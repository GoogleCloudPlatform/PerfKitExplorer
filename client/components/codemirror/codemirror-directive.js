/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Angular directive that wraps codemirror.
 * @author joemu@google.com (Joe Allan Muharsky)
 *
 * Adapted from https://github.com/angular-ui/ui-codemirror/
 * MIT License
 */

goog.provide('p3rf.perfkit.explorer.components.codemirror.CodeMirrorDirective');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * Directive for codemirror UI element for textareas.
 * @param {!Object} uiCodemirrorConfig Config parameters for customizing.
 * @param {!angular.$timeout} $timeout Provides timeout function for deferring.
 * @return {Object} Directive definition object.
 */
explorer.components.codemirror.CodeMirrorDirective = function(
    uiCodemirrorConfig, $timeout) {
  var events = [
    'cursorActivity', 'viewportChange', 'gutterClick', 'focus',
    'blur', 'scroll', 'update'
  ];

  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      onChange: '&',
      cmOptions: '='
    },
    link: function(scope, elm, attrs, ngModel) {
      var options, opts, onChange, deferCodeMirror, codeMirror;

      if (elm[0].type !== 'textarea') {
        throw new Error(
            'codemirror can only be applied to a textarea element');
      }

      options = uiCodemirrorConfig.codemirror || {};
      opts = angular.extend({}, options, scope.cmOptions);

      onChange = function(aEvent) {
        return function(instance, changeObj) {
          if (scope.onChange) {
            scope.onChange();
          }

          var newValue = instance.getValue();
          if (newValue !== ngModel.$viewValue) {
            ngModel.$setViewValue(newValue);
            if (!scope.$$phase) {
              scope.$apply();
            }
          }
          if (typeof aEvent === 'function') {
            aEvent(instance, changeObj);
          }
        };
      };

      deferCodeMirror = function() {
        codeMirror = CodeMirror.fromTextArea(elm[0], opts);
        codeMirror.on('change', onChange(opts['onChange']));

        for (var i = 0, n = events.length, aEvent; i < n; ++i) {
          aEvent = opts['on' + events[i].charAt(0).toUpperCase() +
                        events[i].slice(1)];
          if (aEvent === void 0) {
            continue;
          }
          if (typeof aEvent !== 'function') {
            continue;
          }
          codeMirror.on(events[i], aEvent);
        }

        // CodeMirror expects a string, so make sure it gets one.
        // This does not change the model.
        ngModel.$formatters.push(function(value) {
          if (angular.isUndefined(value) || value === null) {
            return '';
          } else if (!angular.isString(value)) {
            throw new Error(
                'ui-codemirror cannot use an object or an array as a model');
          }
          return value;
        });

        // Override the ngModelController $render method, which is what
        // gets called when the model is updated. This takes care of the
        // synchronizing the codeMirror element with the underlying model,
        // in the case that it is changed by something else.
        ngModel.$render = function() {
          codeMirror.setValue(ngModel.$viewValue);
        };

        // Watch ui-refresh and refresh the directive
        if (attrs.uiRefresh) {
          scope.$watch(function() { return attrs.uiRefresh; },
                       function(newVal, oldVal) {
            // Skip the initial watch firing
            if (newVal !== oldVal) {
              $timeout(function() { codeMirror.refresh(); });
            }
          });
        }
      };

      $timeout(deferCodeMirror);
    }
  };
};

angular.module('ui.codemirror', []).
    constant('uiCodemirrorConfig', {}).
    directive('codemirror', ['uiCodemirrorConfig', '$timeout',
      p3rf.perfkit.explorer.components.codemirror.
          CodeMirrorDirective]);

});  // goog.scope
