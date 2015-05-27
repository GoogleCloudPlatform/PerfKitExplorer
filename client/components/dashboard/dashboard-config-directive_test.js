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
 * @fileoverview Tests for DashboardConfigDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardConfigDirective');

describe('DashboardConfigDirective', function() {
  // declare these up here to be global to all tests
  var scope, $compile, $timeout, uiConfig;
  var configService, dashboardService;

  var explorer = p3rf.perfkit.explorer;
  var DashboardModel = explorer.components.dashboard.DashboardModel;

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_,
      _configService_, _dashboardService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    
    configService = _configService_;
    dashboardService = _dashboardService_;
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
	  	scope.providedDashboardModel = new DashboardModel();
        
	  	var directiveElement = angular.element(
		  '<dashboard-config ng-model="providedDashboardModel" />');
        
    	$compile(directiveElement)(scope);
	  	scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });
  
  describe('should contain a element for', function() {
    var directiveElement;

    beforeEach(inject(function() {
	   	scope.dashboardModel = new DashboardModel();
	
	    directiveElement = angular.element(
		    '<dashboard-config ng-model="dashboardModel" />');

      $compile(directiveElement)(scope);
	    scope.$digest();
    }));
    
    it('the dashboard id', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_id');
      expect(actualElement.length).toBe(1);
    });
    
    it('the dashboard title', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_title');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard owner', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_owner');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard writers', function() {
      var actualElement = directiveElement.find(
          'span.dashboard_writers');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard version', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_version');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard parameters', function() {
      var actualElement = directiveElement.find(
          'span.dashboard_parameters');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard datasource project id', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_datasource_project_id');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard datasource dataset name', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_datasource_dataset_name');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard datasource table name', function() {
      var actualElement = directiveElement.find(
          'input.dashboard_datasource_table_name');
      expect(actualElement.length).toBe(1);
    });

    it('the dashboard datasource table format', function() {
      var actualElement = directiveElement.find(
          'md-select.dashboard_datasource_table_format');
      expect(actualElement.length).toBe(1);
    });
  });
  
  describe('should reflect the ngModel state for', function() {
    var directiveElement;

    beforeEach(inject(function() {
	   	scope.dashboardModel = new DashboardModel();
	
	    directiveElement = angular.element(
		    '<dashboard-config ng-model="dashboardModel" />');

      $compile(directiveElement)(scope);
	    scope.$digest();
    }));
    
    it('the dashboard id', function() {
      scope.dashboardModel.id = 'TEST_ID';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_id')[0];
      expect(actualElement.value).toBe('TEST_ID');      
    });
    
    it('the dashboard title', function() {
      scope.dashboardModel.title = 'TEST_TITLE';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_title')[0];
      expect(actualElement.value).toBe('TEST_TITLE');      
    });
    
    it('the dashboard owner', function() {
      scope.dashboardModel.owner = 'TEST_OWNER';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_owner')[0];
      expect(actualElement.value).toBe('TEST_OWNER');      
    });

    it('the dashbord writers', function() {
      var actualElement = directiveElement.find(
          'span.dashboard_writers')[0];

      expect(actualElement.children.length).toBe(1);
      
      scope.dashboardModel.writers.push({
        email: 'test@google.com'
      });
      scope.$digest();
      
      expect(actualElement.children.length).toBe(2);
      expect(actualElement.children[0].children[0].value)
          .toBe('test@google.com');
    });
    
    it('the dashboard version', function() {
      scope.dashboardModel.version = '42';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_version')[0];
      expect(actualElement.value).toBe('42');      
    });
    
    it('the dashbord parameters', function() {
      var actualElement = directiveElement.find(
          'span.dashboard_parameters')[0];

      expect(actualElement.children.length).toBe(1);
      
      scope.dashboardModel.params.push({
        name: 'color',
        value: 'blue'
      });
      scope.$digest();
      
      expect(actualElement.children[0].children.length).toBe(2);
      expect(actualElement.children[0].children[0].children[0].value)
          .toBe('color');
      expect(actualElement.children[0].children[0].children[1].value)
          .toBe('blue');
    });    

    it('the dashboard datasource project id', function() {
      scope.dashboardModel.project_id = 'TEST_PROJECT';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_datasource_project_id')[0];
      expect(actualElement.value).toBe('TEST_PROJECT');      
    });

    it('the dashboard datasource dataset name', function() {
      scope.dashboardModel.dataset_name = 'TEST_DATASET';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_datasource_dataset_name')[0];
      expect(actualElement.value).toBe('TEST_DATASET');      
    });

    it('the dashboard datasource table name', function() {
      scope.dashboardModel.table_name = 'TEST_TABLE';
      
		  scope.$digest();

      var actualElement = directiveElement.find(
        'input.dashboard_datasource_table_name')[0];
      expect(actualElement.value).toBe('TEST_TABLE');      
    });

    // TODO(joemu): Investigate failure of md-select to bind on unit tests.
    // https://github.com/angular/material/issues/2989
    xit('the dashboard datasource table format', function() {
      var actualElement = directiveElement.find(
        'md-select.dashboard_datasource_table_format md-select-label ' +
        'span:first-child')[0];
      
      expect(actualElement.innerHTML).toBe('OneTable');

      scope.dashboardModel.table_partition = 'Area';
      scope.$digest();

      expect(actualElement.innerHTML).toBe('OneTable');
    });
  });
});
