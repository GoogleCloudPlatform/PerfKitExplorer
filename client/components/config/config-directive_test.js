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
 * @fileoverview Tests for ConfigDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigDirective');
goog.require('p3rf.perfkit.explorer.components.config.ConfigTemplateUrl');


describe('configDirective', function() {
  // declare these up here to be global to all tests
  var scope, $compile, $timeout, uiConfig;

  var explorer = p3rf.perfkit.explorer;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _$templateCache_,
      _$httpBackend_, _configService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    $templateCache = _$templateCache_;
    configService = _configService_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
          $compile('<explorer-config />')(scope);
      }
      expect(compile).not.toThrow();
    });

    it('should contain the expected elements.', function() {
      var configElement = angular.element('<explorer-config />');

      $compile(configElement)(scope);
      scope.$digest();

      var projectElement = configElement.find('input#default_project');
      expect(projectElement.length).toBe(1);

      var datasetElement = configElement.find('input#default_dataset');
      expect(datasetElement.length).toBe(1);

      var tableElement = configElement.find('input#default_table');
      expect(tableElement.length).toBe(1);

      var analyticsKeyElement = configElement.find('input#analytics_key');
      expect(analyticsKeyElement.length).toBe(1);

      var cacheDurationElement = configElement.find('input#cache_duration');
      expect(cacheDurationElement.length).toBe(1);
    });
  });

  describe('service binding', function() {
    var configElement;

    beforeEach(inject(function() {
      configElement = angular.element('<explorer-config />');

      $compile(configElement)(scope);
      scope.$digest();
    }));

    describe('should reflect the current values in the service for ',
        function() {
      var providedProject = 'PROVIDED_PROJECT';
      var providedDataset = 'PROVIDED_DATASET';
      var providedTable = 'PROVIDED_TABLE';
      var providedAnalyticsKey = 'PROVIDED_ANALYTICS_KEY';
      var providedCacheDuration = 30;
      var expectedCacheDuration = '30';

      beforeEach(function() {
        configService.default_project = providedProject;
        configService.default_dataset = providedDataset;
        configService.default_table = providedTable;
        configService.analytics_key = providedAnalyticsKey;
        configService.cache_duration = providedCacheDuration;

        scope.$digest();
      });

      it('default project.', function() {
        var projectElement = configElement.find('input#default_project');
        expect(projectElement.eq(0).val()).toBe(providedProject);
      });

      it('default dataset`.', function() {
        var datasetElement = configElement.find('input#default_dataset');
        expect(datasetElement.eq(0).val()).toBe(providedDataset);
      });

      it('default table.', function() {
        var tableElement = configElement.find('input#default_table');
        expect(tableElement.eq(0).val()).toBe(providedTable);
      });

      it('analytics key.', function() {
        var analyticsKeyElement = configElement.find('input#analytics_key');
        expect(analyticsKeyElement.eq(0).val()).toBe(providedAnalyticsKey);
      });

      it('cache duration.', function() {
        var cacheDurationElement = configElement.find('input#cache_duration');
        expect(cacheDurationElement.eq(0).val()).toBe(expectedCacheDuration);
      });
    });
  });
});
