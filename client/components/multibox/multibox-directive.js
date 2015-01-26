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
 * @fileoverview Multibox is an angular directive used to display a list of
 * elements, and maintain an "insertion element".  It's currently designed for
 * collecting column/result data in the Perfkit Explorer UI.
 *
 * Usage:
 *   <div ng-controller="PerfkitQueryController">
 *     <span
 *         multibox
 *         multibox-display-prop="title"
 *         multibox-focus-on-select="true"
 *         multibox-on-insert-option="AddOption()"
 *         multibox-selected-options="selectedOptions"
 *         multibox-template-url="field_adder.html">
 *     </span>
 *
 *     <script type="text/ng-template" id="field_adder.html">
 *       <div
 *           style="background-color: red;"
 *           ng-repeat="option in multiboxSelectedOptions">
 *         <input
 *             class="multibox-input-control"
 *             ng-model="option.title"
 *             ng-blur="blurInput($event)"
 *             ng-focus="focusInput($event, option)">
 *       </div>
 *       <div class="multibox-insert-row" ng-hide="isInsertRowFocused()">
 *         <input
 *             class="multibox-insert-control"
 *             ng-click="addInsertRow($event)"
 *             ng-focus="focusInsertRow($event)">
 *       </div>
 *     </script>
 *   </div>
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.multibox.MultiboxDirective');

goog.require('goog.positioning');
goog.require('goog.positioning.Corner');
goog.require('goog.style');



goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * The Multibox directive provides for a repeating list of items, with an
 * insertion row maintained, and "empty" items cleaned up.
 *
 * Attributes (prefixed by multibox-):
 *   attr {*} focus-on-select If true, will focus the insertion row when an
 *     item is selected from the popup.
 *   attr {*} template-url If provided, the URL or script ID of the template
 *     to use.
 *   scope {*} data A user-defined object that can be used in custom templates.
 *   scope {Array.<*>} selected-options An array of data that serves as the
 *     contents of the directive.
 *   scope {Function} on-insert-option Function to execute when a new option
 *     needs to be added.
 *
 * @param {!angular.$timeout} $timeout Provides timeout function for deferring.
 * @return {Object} Directive definition object.
 */
explorer.components.multibox.MultiboxDirective = (function($timeout) {
  return {
    restrict: 'A',
    transclude: false,
    templateUrl: function(element, attrs) {
      return attrs['multiboxTemplateUrl'] ||
          '/static/components/multibox/multibox-directive.html';
    },
    scope: {
      /**
       * User-defined data that can be used in custom templates.
       */
      multiboxData: '=',

      /**
       * Watermark text in empty input boxes.
       */
      multiboxPlaceholder: '=',

      /**
       * A list of selected options.
       */
      multiboxSelectedOptions: '=',

      /**
       * Function to execute when a new option should be created.
       */
      multiboxOnInsertOption: '&'
    },
    link: function(scope, element, attrs) {
      var canvas = element[0];
      var activeInput = null;
      scope.activeOption = null;

      scope.$watch('multiboxData',
          function(newVal, oldVal) {
            if (newVal && oldVal && newVal.length == oldVal.length) { return; }
            if (goog.style.isElementShown(popup)) {
              scope.showPopup();
            }
          }, true);

      scope.$watch('activeOption',
          function(newVal, oldVal) {
            if (goog.style.isElementShown(popup)) {
              scope.showPopup();
            }
          }, true);

      scope.displayProp = attrs['multiboxDisplayProp'];
      scope.popupProp = attrs['multiboxPopupProp'];

      /**
       * Returns the string value for an option.
       * @param option The option being evaluated.
       * @returns {*} A string value, either a property of the option or the option itself.
       */
      scope.getPopupValue = function(option) {
        return scope.popupProp ? option[scope.popupProp] : option;
      };

      /**
       * Returns the string value for a displayed option
       * @param displayOption The option being evaluated.
       * @returns {*} A string value, either a property of the option or the option itself.
       */
      scope.getDisplayValue = function(displayOption) {
        if (!displayOption) {
          return null;
        }
        return scope.displayProp ? displayOption[scope.displayProp] : displayOption;
      };

      /**
       * Returns a boolean value depending on whether the option text starts with (or is equal to) the text value.
       * @param displayOption The text in the active input.
       * @param popupOption The option being evaluated.
       * @return bool
       */
      scope.isOptionUnmatched = function(displayOption, popupOption) {
        var displayValue = scope.getDisplayValue(displayOption);
        var popupValue = scope.getPopupValue(popupOption);

        if (!displayValue || displayValue.length == 0) {
          return false;
        } else {
          return (popupValue.slice(0, displayValue.length).toUpperCase() != displayValue.toUpperCase());
        }
      };

      /**
       * Returns a boolean value depending on whether the option text starts with (or is equal to) the text value.
       * @param displayOption The text in the active input.
       * @param popupOption The option being evaluated.
       * @return bool
       */
      scope.isOptionMatched = function(displayOption, popupOption) {
        var displayValue = scope.getDisplayValue(displayOption);
        var popupValue = scope.getPopupValue(popupOption);

        if (!displayValue || displayValue.length == 0) {
          return false;
        } else {
          return (popupValue.slice(0, displayValue.length).toUpperCase() == displayValue.toUpperCase());
        }
      };

      /**
       * Returns a boolean value depending on whether the option is equal to the input value.
       * @param displayOption The text in the active input.
       * @param popupOption The option being evaluated.
       * @return bool
       */
      scope.isOptionSelected = function(displayOption, popupOption) {
        var displayValue = scope.getDisplayValue(displayOption);
        var popupValue = scope.getPopupValue(popupOption);

        if (!displayValue || displayValue.length == 0) {
          return false;
        } else {
          return (popupValue.toUpperCase() == displayValue.toUpperCase());
        }
      };

      /**
       * Called when the insertion row is focused.  This causes a new option
       * to be created and focused.
       */
      scope.addInput = function() {
        $timeout(function() {
          scope.ensureNoEmptyRows(true);

          scope.multiboxOnInsertOption && (
              scope.$eval(scope.multiboxOnInsertOption));

          $timeout(function() {
            scope.getLastInputElement().focus();
            scope.getLastInputElement().select();
          });
        });
      };

      /**
       * Called when an editable row is focused.  It shows and positions the
       * popup and tracks the change in selection.
       * @param {Event} evt The event handler for the focus event.
       * @param {*} option The option that is being focused.
       */
      scope.focusInput = function(evt, option) {
        if (activeInput === evt.currentTarget) {
          return;
        }

        activeInput = evt.currentTarget;
        scope.activeOption = option;
        scope.showPopup();
      };

      /**
       * Called when an editable row is blurred  It hides the popup and ensures
       * that there is only one insert row (and removes blanks from the list).
       * @param {Event} evt The event handler for the blur event.
       */
      scope.blurInput = function(evt) {
        var relatedTarget = /** @type {?Node} */ (evt.relatedTarget);

        if (relatedTarget && popup &&
                goog.dom.contains(popup, relatedTarget)) {
          return;
        }

        scope.hidePopup();
        scope.ensureNoEmptyRows(false);
      };

      scope.blurPopup = function(evt) {
        if (evt.relatedTarget !== activeInput) {
          scope.hidePopup();
          scope.ensureNoEmptyRows(false);
        }
      };

      /**
       * @return {boolean} True if the focus is the last option and empty.
       */
      scope.isInsertRowFocused = function() {
        if (!scope.multiboxSelectedOptions) { return false; }

        return (
                scope.multiboxSelectedOptions.length > 0 &&
                activeInput === scope.getLastInputElement() &&
                activeInput &&
                activeInput.value === '');
      };

      scope.selectValue = function(value) {
        if (scope.activeOption) {
          var displayValue = scope.displayProp ? scope.activeOption[scope.displayProp] : scope.activeOption;
          var popupValue = scope.popupProp ? value[scope.popupProp] : value;

          if (scope.displayProp) {
            scope.activeOption[scope.displayProp] = popupValue;
          } else {
            scope.activeOption = popupValue;
          }

          scope.hidePopup();
        } else {
          console.log('selectValue called, but no activeOption found.');
        }
      };

      /**
       * Sets the activeOption the the provided one.  This is used by the popup
       * to set an option on the appropriate event.
       * @param {*} option The object to select.
       */
      scope.addOption = function(option) {
        if (scope.activeOption) {
          var idx = scope.multiboxSelectedOptions.indexOf(scope.activeOption);
          scope.multiboxSelectedOptions[idx] = option;

          if (attrs['multiboxFocusOnSelect'] == 'true') {
            scope.addInput();
          }
        } else {
          scope.multiboxSelectedOptions.push(option);
        }

        $timeout(function() {
          scope.hidePopup();
          activeInput.focus();
        });
      };

      /**
       * Removes an option from the selected list at the specified index.
       * @param {!number} index The index of the selection option to remove.
       * @export
       */
      scope.unselectOptionAt = function(index) {
        scope.multiboxSelectedOptions.splice(index, 1);
      };

      /**
       * Hides the popup.
       */
      scope.hidePopup = function() {
        if (popup) {
          goog.style.setElementShown(popup, false);
        }
      };

      /**
       * Shows the popup, relative to a specific element.
       * @param {Element} input The element to offset the popup against.
       */
      scope.showPopup = function() {
        if (popup && activeInput) {
          $timeout(function() {
            goog.style.setElementShown(popup, true);

            var Overflow = goog.positioning.Overflow;
            goog.positioning.positionAtAnchor(
                activeInput, goog.positioning.Corner.TOP_RIGHT,
                popup, goog.positioning.Corner.TOP_LEFT,
                null, null,
                Overflow.ADJUST_Y + Overflow.RESIZE_WIDTH);
          });
        }
      };

      /**
       * Initializes the popup, moving it to be a child of the body, and hiding
       * it.
       */
      scope.initPopup = function() {
        if (popup) {
          document.body.appendChild(popup);
          goog.style.setElementShown(popup, false);
          popup.addEventListener('blur', scope.blurPopup, true);
        }
      };

      /**
       * Ensures that there are no "empty" options selected.  An empty option
       * is one with a null or empty string for the multibox-display-prop.
       * @param {boolean} ignoreLast If true, ignores the last option in the
       * list.  This is used when the last insert row is focused.
       */
      scope.ensureNoEmptyRows = function(ignoreLast) {
        var ctr = 0;
        var options = scope.multiboxSelectedOptions;

        while (ctr < options.length) {
          var option = options[ctr];
          if (option[attrs['multiboxDisplayProp']] === '') {
            // If the blank row is the "last" one, we're good.
            if (ignoreLast && ctr == options.length - 1) {
              return;
            }
            options.splice(ctr, 1);
          } else {
            ctr++;
          }
        }
      };

      /**
       * Returns the popup element, which will hide/show and position as
       * elements are focused.
       * @return {Element} The popup element to hide/show.
       */
      scope.getPopupElement = function() {
        return goog.dom.getElementByClass('multibox-popup', canvas);
      };

      /**
       * Returns the last input element, excluding the insertion row.
       * @return {Element} The input element for the last item in the array.
       */
      scope.getLastInputElement = function() {
        var all_inputs = goog.dom.getElementsByClass(
            'multibox-input-control', canvas);
        return all_inputs[all_inputs.length - 1];
      };

      scope.$watch('scope.activeOption',
          angular.bind(this, function(new_val, old_val) {
            if (new_val == old_val) { return; }
            scope.showPopup();
          }), true);

      var popup = scope.getPopupElement();
      scope.insertRowFocused = false;
      scope.initPopup();
    }
  };
});

angular.module('ui.multibox', []).directive(
    'multibox', ['$timeout', explorer.components.multibox]);

});  // goog.scope
