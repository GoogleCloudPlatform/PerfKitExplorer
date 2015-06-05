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
 * @fileoverview RelativeDatePicker is a composite component that combines a
 * date picker with the ability to specify relative dates (ex:
 * last n days/months).  It uses the AngularUI datepicker control, and in
 * Perfkit is used in conjunction with a popupbox directive.
 *
 * Usage:
 *   <div ng-controller="PerfkitQueryController">
 *     <input
 *         type="text"
 *         popupbox
 *         popupbox-data="option"
 *         popupbox-template-url="basic_popup.html">
 *     </input>
 *
 *     <script type="text/ng-template" id="basic_popup.html">
 *       <!-- The date picker will use the same data source as the containing
 *            popupbox. -->
 *       <relative-datepicker relative-datepicker-data="popupboxData"
 *     </script>
 *   </div>
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.builder.RelativeDatepickerDirective');



goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


var FILTER_TYPES = [
  {'name': 'CUSTOM', 'default': new Date().toISOString() },
  {'name': 'SECOND', 'default': 30},
  {'name': 'MINUTE', 'default': 15},
  {'name': 'HOUR', 'default': 12},
  {'name': 'DAY', 'default': 5},
  {'name': 'WEEK', 'default': 2},
  {'name': 'MONTH', 'default': 1},
  {'name': 'YEAR', 'default': 1}
];


/**
 * See module docstring for overview.
 *
 * Attributes (prefixed by relative-datepicker-):
 *   attr {*} template-url If provided, the URL or script ID of the template
 *     to use.
 *   scope {*} data A user-defined object that can be used in custom templates.
 *
 * @param {!angular.$timeout} $timeout Provides timeout function for deferring.
 * @param {!angular.$filter} $filter Provides date conversion filters.
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.widget.query.builder.RelativeDatepickerDirective = function(
    $timeout, $filter) {
  return {
    restrict: 'E',
    transclude: false,
    templateUrl: function(element, attrs) {
      return (
          attrs['relativeDatepickerTemplateUrl'] ||
          '/static/components/widget/query/builder/relative-datepicker-directive.html');
    },
    scope: {
      /**
       * User-defined data that can be used in custom templates.
       */
      relativeDatepickerData: '='
    },
    link: function(scope, element, attrs) {
      scope.supressChangeEvents = false;
      scope.text = '';

      var input = element;
      var popup = element.children()[0];

      var changeType = function(new_val, old_val) {
        if (!old_val || !new_val || old_val == new_val) { return; }
        var filter_type = null;

        angular.forEach(FILTER_TYPES, function(value) {
          if (value['name'] == new_val) {
            scope.relativeDatepickerData.filter_value = value['default'];
            return;
          }
        });
      };

      var changeValue = function(new_val, old_val) {
        if (scope.supressChangeEvents) { return; }

        this.suppressChangeEvents = true;

        try {
          var filter_data = scope.relativeDatepickerData;
          if (filter_data) {
            var filter_type = (
                filter_data.filter_type.toLowerCase());
            switch (filter_type) {
              case 'custom':
                var date = new Date(filter_data.filter_value);

                var dateText = $filter('date')(date, 'yyyy-MM-dd');

                if (filter_data.specify_time) {
                  dateText += $filter('date')(date, ' HH:mm:ss');
                }

                if (date.getMilliseconds > 0) {
                  dateText += $filter('date')(date, '.sss');
                }

                if (date.getTimezoneOffset > 0) {
                  dateText += $filter('date')(date, ' Z');
                }

                filter_data.text = dateText;

                break;
              default:
                filter_data.text = (
                    'last ' +
                    filter_data.filter_value + ' ' +
                    filter_data.filter_type.toLowerCase() + 's');
            }
          }
        } finally {
          this.suppressChangeEvents = false;
        }
      };

      scope.filter_types = FILTER_TYPES;

      scope.$watch('relativeDatepickerData.filter_value', changeValue);
      scope.$watch('relativeDatepickerData.specify_time', changeValue);
      scope.$watch('relativeDatepickerData.filter_type', changeType);
    }
  };
};

});  // goog.scope
