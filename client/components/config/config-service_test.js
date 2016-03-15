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
 * @fileoverview Tests for the configService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');


describe('configService', function() {
  var svc;
  var httpBackend;

  beforeEach(module('explorer'));

  beforeEach(inject(function(configService, errorService, $httpBackend) {
        svc = configService;
        httpBackend = $httpBackend;
        errorService.logToConsole = false;
      }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should initialize the appropriate objects.', function() {
    expect(svc.default_project).toEqual('');
    expect(svc.default_dataset).toEqual('');
    expect(svc.default_table).toEqual('');
    expect(svc.analytics_key).toEqual('');
    expect(svc.cache_duration).toEqual(0);
    expect(svc.max_parallel_queries).toBeGreaterThan(0);
    expect(svc.grant_view_to_public).toEqual(false);
    expect(svc.grant_save_to_public).toEqual(false);
    expect(svc.grant_query_to_public).toEqual(false);
  });

  describe('populate', function() {
    it('should populate based on the provided object.', function() {
      var provided_default_project = 'PROVIDED_PROJECT';
      var provided_default_dataset = 'PROVIDED_DATASET';
      var provided_default_table = 'PROVIDED_TABLE';
      var provided_analytics_key = 'PROVIDED_ANALYTICS_KEY';
      var provided_cache_duration = 30;
      var provided_grant_view_to_public = true;
      var provided_grant_save_to_public = true;
      var provided_grant_query_to_public = true;

      provided_data = {
        'default_project': provided_default_project,
        'default_dataset': provided_default_dataset,
        'default_table': provided_default_table,
        'analytics_key': provided_analytics_key,
        'cache_duration': provided_cache_duration,
        'grant_view_to_public': provided_grant_view_to_public,
        'grant_save_to_public': provided_grant_save_to_public,
        'grant_query_to_public': provided_grant_query_to_public
      };

      svc.populate(provided_data);

      expect(svc.default_project).toEqual(provided_default_project);
      expect(svc.default_dataset).toEqual(provided_default_dataset);
      expect(svc.default_table).toEqual(provided_default_table);
      expect(svc.analytics_key).toEqual(provided_analytics_key);
      expect(svc.cache_duration).toEqual(provided_cache_duration);
      expect(svc.grant_view_to_public).toEqual(provided_grant_view_to_public);
      expect(svc.grant_save_to_public).toEqual(provided_grant_query_to_public);
      expect(svc.grant_query_to_public).toEqual(provided_grant_save_to_public);
    });

    it('should populate empty values.', function() {
      svc.default_project = 'DEFAULT_PROJECT';
      svc.default_dataset = 'DEFAULT_DATASET';
      svc.default_table = 'DEFAULT_TABLE';
      svc.analytics_key = 'ANALYTICS_KEY';
      svc.cache_duration = 30;

      empty_data = {
        'default_project': '',
        'default_dataset': '',
        'default_table': '',
        'analytics_key': '',
        'cache_duration': 0
      };

      svc.populate(empty_data);

      expect(svc.default_project).toEqual(empty_data.default_project);
      expect(svc.default_dataset).toEqual(empty_data.default_dataset);
      expect(svc.default_table).toEqual(empty_data.default_table);
      expect(svc.analytics_key).toEqual(empty_data.analytics_key);
      expect(svc.cache_duration).toEqual(empty_data.cache_duration);
    });

    it('should maintain defaults for unprovided values.', function() {
      provided_default_project = 'PROVIDED_PROJECT';

      provided_data = {
        'default_project': provided_default_project
      };

      svc.populate(provided_data);

      expect(svc.default_project).toEqual(provided_default_project);
      expect(svc.default_dataset).toEqual('');
      expect(svc.default_table).toEqual('');
      expect(svc.analytics_key).toEqual('');
      expect(svc.cache_duration).toEqual(0);
    });

    it('should ignore invalid values and populate valid ones.', function() {
      provided_default_dataset = 'PROVIDED_DATASET';

      provided_data = {
        'default_dataset': provided_default_dataset,
        'unsupported_key': 'UNSUPPORTED_VALUE'
      };

      svc.populate(provided_data);

      expect(svc.default_project).toEqual('');
      expect(svc.default_dataset).toEqual(provided_default_dataset);
      expect(svc.default_table).toEqual('');
      expect(svc.analytics_key).toEqual('');
      expect(svc.cache_duration).toEqual(0);
    });
  });

  describe('#toJSON', function() {
    it('should convert settings to a JSON representation.', function() {
      expected_data = {
        'default_project': '',
        'default_dataset': '',
        'default_table': '',
        'analytics_key': '',
        'cache_duration': 0,
        'max_parallel_queries': 5,
        'grant_view_to_public': false,
        'grant_save_to_public': false,
        'grant_query_to_public': false
      };

      expect(svc.toJSON()).toEqual(expected_data);
    });

    it('should reflect updated settings in a JSON representation.', function() {
      provided_default_project = 'PROVIDED_PROJECT';
      provided_default_dataset = 'PROVIDED_DATASET';
      provided_default_table = 'PROVIDED_TABLE';
      provided_analytics_key = 'PROVIDED_ANALYTICS_KEY';
      provided_cache_duration = 30;

      provided_data = {
        'default_project': provided_default_project,
        'default_dataset': provided_default_dataset,
        'default_table': provided_default_table,
        'analytics_key': provided_analytics_key,
        'cache_duration': provided_cache_duration,
        'max_parallel_queries': 15,
        'grant_view_to_public': true,
        'grant_save_to_public': true,
        'grant_query_to_public': true
      };

      svc.populate(provided_data);
      expect(svc.toJSON()).toEqual(provided_data);
    });

    it('should overwrite properties of a provided object.', function() {
      provided_default_project = 'PROVIDED_PROJECT';
      provided_default_dataset = 'PROVIDED_DATASET';
      provided_default_table = 'PROVIDED_TABLE';
      provided_analytics_key = 'PROVIDED_ANALYTICS_KEY';
      provided_cache_duration = 30;
      provided_other_value = 'PROVIDED_OTHER_VALUE';
      provided_other_project = 'PROVIDED_OTHER_PROJECT';

      provided_object = {
        'default_project': provided_other_project
      };

      provided_data = {
        'default_project': provided_default_project,
        'default_dataset': provided_default_dataset,
        'default_table': provided_default_table,
        'analytics_key': provided_analytics_key,
        'cache_duration': provided_cache_duration,
        'max_parallel_queries': 7
      };

      expected_data = {
        'default_project': provided_default_project,
        'default_dataset': provided_default_dataset,
        'default_table': provided_default_table,
        'analytics_key': provided_analytics_key,
        'cache_duration': provided_cache_duration,
        'max_parallel_queries': 7,
        'grant_view_to_public': false,
        'grant_save_to_public': false,
        'grant_query_to_public': false
      };

      svc.populate(provided_data);
      var actualData = svc.toJSON(provided_object);

      expect(actualData).toEqual(expected_data);
    });
  });

  describe('update', function() {
    it('should call the appropriate handler.', function() {
      provided_default_project = 'PROVIDED_PROJECT';
      provided_default_dataset = 'PROVIDED_DATASET';
      provided_default_table = 'PROVIDED_TABLE';
      provided_analytics_key = 'PROVIDED_ANALYTICS_KEY';
      provided_cache_duration = 30;

      provided_data = {
        'default_project': provided_default_project,
        'default_dataset': provided_default_dataset,
        'default_table': provided_default_table,
        'analytics_key': provided_analytics_key,
        'cache_duration': provided_cache_duration
      };

      httpBackend.expectPOST(new RegExp('/config')).respond();

      svc.update();
      httpBackend.flush();
    });
  });

  describe('refresh', function() {
    it('should update settings with the results of the call.', function() {
      provided_default_project = 'PROVIDED_PROJECT';
      provided_default_dataset = 'PROVIDED_DATASET';
      provided_default_table = 'PROVIDED_TABLE';
      provided_analytics_key = 'PROVIDED_ANALYTICS_KEY';
      provided_cache_duration = 30;

      provided_data = {
        'default_project': provided_default_project,
        'default_dataset': provided_default_dataset,
        'default_table': provided_default_table,
        'analytics_key': provided_analytics_key,
        'cache_duration': provided_cache_duration,
        'max_parallel_queries': 10,
        'grant_view_to_public': true,
        'grant_save_to_public': false,
        'grant_query_to_public': true
      };

      httpBackend.expectGET(new RegExp('/config')).respond(provided_data);

      svc.refresh();
      httpBackend.flush();
      expect(svc.toJSON()).toEqual(provided_data);
    });
  });
});
