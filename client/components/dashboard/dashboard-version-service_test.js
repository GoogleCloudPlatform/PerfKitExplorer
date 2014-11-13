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
 * @fileoverview Tests for the dashboardVersion service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionService');
goog.require('p3rf.perfkit.explorer.models.DatasourceModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.PivotConfigModel');


describe('dashboardVersionService', function() {
  var explorer = p3rf.perfkit.explorer;
  var DatasourceModel = explorer.models.DatasourceModel;
  var DashboardVersionService =
      explorer.components.dashboard.DashboardVersionService;
  var DashboardVersionModel =
      explorer.components.dashboard.DashboardVersionModel;
  var QueryConfigModel =
      explorer.models.perfkit_simple_builder.QueryConfigModel;
  var PivotConfig =
      explorer.models.perfkit_simple_builder.PivotConfigModel;

  var svc;
  var filter;
  var actualValidations = [];
  var actualUpdates = [];

  beforeEach(module('explorer'));

  beforeEach(inject(function(dashboardVersionService, $filter) {
    svc = dashboardVersionService;
    filter = $filter;
  }));

  it('should initialize the appropriate objects.', function() {
    expect(svc.versions).not.toBeNull();
  });

  describe('verifyAndUpdateModel (Version Integration Tests)', function() {
    describe('v3', function() {
      // Set the current version to v3.
      beforeEach(function() {
        svc.currentVersion = filter(
            'getByProperty')('version', '3', svc.versions);
        expect(svc.currentVersion).not.toBeNull();
      });

      it('should add config.results.pivot and pivot_config.',
          function() {
            providedDatasource = {
              'config': {
                'results': {}
              }};

            providedDashboard = {
              'owner': 'TEST_OWNER',
              'type': 'dashboard',
              'children': [
                {
                  'container': {
                    'children': [
                      {'datasource': providedDatasource}
                    ]
                  }
                }
              ]
            };

            svc.verifyAndUpdateModel(providedDashboard);

            expectedPivotConfig = new PivotConfig();
            expect(providedDatasource.config.results.pivot).toBe(false);
            expect(providedDatasource.config.results.pivot_config).toEqual(
                expectedPivotConfig);
          }
      );
    });

    describe('v2', function() {
      // Set the current version to v2.
      beforeEach(function() {
        svc.currentVersion = filter(
            'getByProperty')('version', '2', svc.versions);
        expect(svc.currentVersion).not.toBeNull();
      });

      it('should update the email, config, custom_query and querystring.',
          function() {
            providedDatasource = {
              'query': 'TEST_QUERY',
              'querystring': 'product_name=SAMPLE_PRODUCT'};

            providedDashboard = {
              'owner': 'TEST_OWNER',
              'type': 'dashboard',
              'children': [
                {
                  'container': {
                    'children': [
                      {'datasource': providedDatasource}
                    ]
                  }
                }
              ]
            };

            expectedOwner = 'TEST_OWNER';
            expectedConfig = new QueryConfigModel();
            expectedConfig.filters.product_name = 'SAMPLE_PRODUCT';

            svc.verifyAndUpdateModel(providedDashboard);

            expect(providedDashboard.version).toEqual('2');
            expect(providedDashboard.owner).toEqual(expectedOwner);
            expect(providedDatasource.custom_query).toBe(true);
            expect(providedDatasource.config).toEqual(expectedConfig);
            expect(providedDatasource.querystring).toBe(undefined);
          }
      );

      it('should add a custom_query flag when no query is present.',
         function() {
           providedDatasource = {
             'querystring': 'product_name=SAMPLE_PRODUCT'};

           providedDashboard = {
             'owner': 'TEST_OWNER',
             'type': 'dashboard',
             'children': [
               {
                 'container': {
                   'children': [
                     {'datasource': providedDatasource}
                   ]
                 }
               }
             ]
           };

           expectedOwner = 'TEST_OWNER';
           expectedConfig = new QueryConfigModel();
           expectedConfig.filters.product_name = 'SAMPLE_PRODUCT';

           svc.verifyAndUpdateModel(providedDashboard);

           expect(providedDashboard.version).toEqual('2');
           expect(providedDashboard.owner).toEqual(expectedOwner);
           expect(providedDatasource.custom_query).toBe(false);
           expect(providedDatasource.config).toEqual(expectedConfig);
           expect(providedDatasource.querystring).toBe(undefined);
         }
      );
    });
  });

  describe('Tests with mocked svc.versions.', function() {
    beforeEach(inject(function() {
      // An array of the version #'s that requested validation/update.
      actualValidations = [];
      actualUpdates = [];

      svc.versions = [
        {'version': '2',
          'verify': function(dashboard) {
            actualValidations.push('2');
            return (dashboard.secretVersion == '2');
          },
          'update': function(dashboard) { actualUpdates.push('2'); }},
        {'version': '1',
          'verify': function(dashboard) {
            actualValidations.push('1');
            return (dashboard.secretVersion == '1');
          },
          'update': function(dashboard) { actualUpdates.push('1'); }}
      ];
      svc.currentVersion = svc.versions[0];
    }));

    describe('verifyAndUpdateModel', function() {
      it('should add a version number if it does not exist.',
          function() {
            var providedDashboard = {
              secretVersion: '2'
            };

            svc.verifyAndUpdateModel(providedDashboard);
            expect(providedDashboard.version).toEqual('2');
            expect(actualValidations).toEqual(['2']);
            expect(actualUpdates).toEqual([]);
          }
      );

      it('should update an old version.',
          function() {
            var providedDashboard = {
              secretVersion: '1'
            };

            svc.verifyAndUpdateModel(providedDashboard);
            expect(providedDashboard.version).toEqual('2');
            expect(actualValidations).toEqual(['2', '1']);
            expect(actualUpdates).toEqual(['2']);
          }
      );
    });

    describe('getDashboardVersion', function() {
      it('should return true when a version and valid model is provided.',
          function() {
            var providedDashboard = {
              version: '2',
              secretVersion: '2'
            };

            expect(svc.getDashboardVersion(
                providedDashboard)).toBe(svc.versions[0]);
            expect(actualValidations).toEqual(['2']);
          }
      );
    });
  });
});
