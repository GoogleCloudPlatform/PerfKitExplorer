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
 * @fileoverview Test for popupbox, an angular directive that provides
 * popup behavior for text boxes and other single-entry elements.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.popupbox.DEFAULT_TEMPLATE_URL');


describe('popupbox', function() {
  'use strict';

  const DEFAULT_TEMPLATE_URL =
      p3rf.perfkit.explorer.components.popupbox.DEFAULT_TEMPLATE_URL;

  let scope, bodyElement, popupElement, actualElement, actualDirective;
  let $compile, $timeout, $httpBackend, $document;

  beforeEach(module('explorer'));

  beforeEach(inject(function(
      _$rootScope_, _$compile_, _$timeout_, _$document_, _$httpBackend_) {
        scope = _$rootScope_.$new();
        $compile = _$compile_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $document = _$document_;

        bodyElement = angular.element($document[0].body);
      }));

  afterEach(inject(function() {
    let popups = bodyElement.find('div.pk-popup');
    popups.remove();
  }));

  describe('compilation', function() {
    it('should succeed when used on an attribute', function() {
      function compile() {
        $httpBackend.expectGET(DEFAULT_TEMPLATE_URL).respond(200);
        $compile('<span popupbox></span>')(scope);
        scope.$digest();
      }

      expect(compile).not.toThrow();
    });

    it('should create a popup element', function() {
      actualElement = angular.element('<span popupbox></span>');

      $httpBackend.expectGET(DEFAULT_TEMPLATE_URL).respond(200);
      actualDirective = $compile('<span popupbox></span>')(scope);
      scope.$digest();

      let popupElements = bodyElement.find('div.pk-popup');
      expect(popupElements.length).toBe(1);
    });
  });

  describe('the default template', function() {
    let popupElement;

    beforeEach(inject(function() {
      actualElement = angular.element('<span popupbox></span>');

      $httpBackend.expectGET(DEFAULT_TEMPLATE_URL).respond(200);
      actualDirective = $compile(actualElement)(scope);
      scope.$digest();

      popupElement = bodyElement.find('div.pk-popup');
    }));

    describe('should contain an element for', function() {
      it('the autocomplete container', function() {
        let targetElement = bodyElement.find(
          'div.pk-popup-autocomplete');
        expect(targetElement.length).toBe(1);
      });

      it('the content to display when the popup is loading', function() {
        let targetElement = popupElement.find(
          'div.pk-popup-loading');
        expect(targetElement.length).toBe(1);
      });

      it('the content to display when the popup is loaded', function() {
        let targetElement = popupElement.find(
          'div.pk-popup-loaded');
        expect(targetElement.length).toBe(1);
      });

      it('the content to display when the popup has an error', function() {
        let targetElement = popupElement.find(
          'div.pk-popup-error');
        expect(targetElement.length).toBe(1);
      });

      it('the content to display when the popup is empty', function() {
        let targetElement = popupElement.find(
          'div.pk-popup-empty');
        expect(targetElement.length).toBe(1);
      });
    });
  });
});
