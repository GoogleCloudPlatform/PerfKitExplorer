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
 * @fileoverview MetadataPicker is a directive that allows the user to select
 * a label and value from a multi-level panel, and manages the "display text"
 * component as well for free-hand entry.
 *
 * Usage:
 *   <div ng-controller="PerfkitQueryController">
 *     <input
 *         type="text"
 *         popupbox
 *         popupbox-data="options"
 *         popupbox-model="option"
 *         popupbox-template-url="basic_popup.html">
 *     </input>
 *
 *     <script type="text/ng-template" id="basic_popup.html">
 *       <!-- The filter picker will use the same data source as the containing
 *            popupbox. -->
 *       <metadata-picker
 *           metadata-picker-data="popupboxData"
 *           metadata-picker-model="popupboxModel"></metadata-picker>
 *     </script>
 *   </div>
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.builder.MetadataPickerDirective');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter');

goog.require('goog.positioning');
goog.require('goog.positioning.Corner');
goog.require('goog.style');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const MetadataFilter = explorer.models.perfkit_simple_builder.MetadataFilter;


/**
 * See module docstring for overview.
 *
 * Attributes (prefixed by filterpicker-):
 *   attr {*} template-url If provided, the URL or script ID of the template
 *     to use.
 *   scope {MetadataFilter} model A user-defined object representing the
 *     selected filter.
 *   scope {*} data A user-defined object that can be used in custom templates.
 *
 * @param {!angular.$timeout} $timeout Provides timeout function for deferring.
 * @param {!angular.$filter} $filter Provides access to array searching.
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.widget.query.builder.MetadataPickerDirective = function(
    $timeout, $filter) {
  const DEFAULT_TEMPLATE_URL = (
      '/static/components/widget/query/builder/metadata-picker-directive.html');

  return {
    restrict: 'A',
    transclude: true,
    scope: {
      metadataPickerData: '=',
      metadataPickerModel: '=',
      metadataPickerSelectValue: '='
    },
    templateUrl: function(element, attrs) {
      return attrs['metadataPickerTemplateUrl'] || DEFAULT_TEMPLATE_URL;
    },
    link: function(scope, element, attrs) {
      scope.supressChangeEvents = false;

      scope.setLabel = function(value) {
        scope.metadataPickerModel.label = value;
      };

      scope.setValue = function(value) {
        scope.metadataPickerModel.value = value;
        if (scope.metadataPickerSelectValue) {
          scope.metadataPickerSelectValue(scope.metadataPickerModel);
        }
      };

      scope.availableValues = [];

      scope.$watch('metadataPickerModel.label',
          angular.bind(this, function(new_val, old_val) {
            if (old_val != new_val) {
              let matching_label = $filter('getByProperty')(
                  'name', new_val, scope.metadataPickerData);
              if (matching_label === null) {
                scope.availableValues = [];
              } else {
                scope.availableValues = matching_label.values;
              }

              if (!scope.supressChangeEvents) {
                UpdateTextValue();
              }
            }
          }));

      scope.$watch('metadataPickerModel.value',
          angular.bind(this, function(new_val, old_val) {
            if (!scope.supressChangeEvents && old_val != new_val) {
              UpdateTextValue();
            }
          }));

      scope.$watch('metadataPickerModel.text',
          angular.bind(this, function(new_val, old_val) {
            if (!scope.supressChangeEvents && old_val != new_val) {
              try {
                scope.supressChangeEvents = true;
                let separator_index = new_val.indexOf(':');

                if (separator_index == -1) {
                  scope.metadataPickerModel.label = new_val;
                  scope.metadataPickerModel.value = '';
                } else {
                  scope.metadataPickerModel.label = (
                      new_val.substring(0, separator_index));
                  scope.metadataPickerModel.value = (
                      new_val.substring(separator_index + 1));
                }
              } finally {
                $timeout(function() {
                  scope.supressChangeEvents = false;
                });
              }
            }
          }));

      let UpdateTextValue = function() {
        try {
          scope.supressChangeEvents = true;

          if (scope.metadataPickerModel.label == '' &&
              scope.metadataPickerModel.value == '') {
            scope.metadataPickerModel.text = '';
          } else {
            scope.metadataPickerModel.text = (
                scope.metadataPickerModel.label + ':' +
                scope.metadataPickerModel.value);
          }
        } finally {
          scope.supressChangeEvents = false;
        }
      };
    }
  };
};

});  // goog.scope
