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

  beforeEach(inject(function(configService, $httpBackend) {
        svc = configService;
        httpBackend = $httpBackend;
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
  });

  describe('populate', function() {
    it('should populate based on the provided object.', function() {
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

      svc.populate(provided_data);

      expect(svc.default_project).toEqual(provided_default_project);
      expect(svc.default_dataset).toEqual(provided_default_dataset);
      expect(svc.default_table).toEqual(provided_default_table);
      expect(svc.analytics_key).toEqual(provided_analytics_key);
      expect(svc.cache_duration).toEqual(provided_cache_duration);
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

  describe('toJSON', function() {
    it('should convert settings to a JSON representation.', function() {
      expected_data = {
        'default_project': '',
        'default_dataset': '',
        'default_table': '',
        'analytics_key': '',
        'cache_duration': 0
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
        'cache_duration': provided_cache_duration
      };

      svc.populate(provided_data);
      expect(svc.toJSON()).toEqual(provided_data);
    });
  });

  describe('update', function() {
    it('Should call the appropriate handler.', function() {
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
        'cache_duration': provided_cache_duration
      };

      httpBackend.expectGET(new RegExp('/config')).respond(provided_data);

      svc.refresh();
      httpBackend.flush();
      expect(svc.toJSON()).toEqual(provided_data);
    });
  });
});
