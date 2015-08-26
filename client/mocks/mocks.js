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
 * @fileoverview Mocks for local development.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.mocks.application.module');
goog.provide('p3rf.perfkit.explorer.mocks');

goog.require('goog.Uri');
goog.require('p3rf.perfkit.explorer.mocks.googleVisualizationMocks');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataServiceMock');
goog.require('p3rf.perfkit.explorer.mocks.fieldCubeDataServiceMock');
goog.require('p3rf.perfkit.explorer.mocks.queryResultDataServiceMock');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const mocks = explorer.mocks;

explorer.mocks.application.module = angular.module('perfkit-mocks', [
  explorer.mocks.googleVisualizationMocks.name,
  explorer.components.dashboard.DashboardDataServiceMock.name,
  explorer.mocks.fieldCubeDataServiceMock.name,
  explorer.mocks.queryResultDataServiceMock.name]);


/**
 * @return {boolean} Whether the URL contains ?mock=true.
 */
mocks.isMockParamTrue = function() {
  // Extracts URL query parameters from the current location
  let uri = new goog.Uri(window.location);
  let mockParameter = uri.getParameterValue('mock');
  return mockParameter && mockParameter === 'true' ? true : false;
};


/**
 * Adds mocks to the application.
 *
 * @param {!angular.Module} appModule
 */
mocks.addMocks = function(appModule) {
  // Add a 1s delay to $http calls to simulate latency
  appModule.config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
      let proxy = function(method, url, data, callback, headers) {
        let interceptor = function() {
          let self = this,
              arguments_ = arguments;
          setTimeout(function() {
            callback.apply(self, arguments_);
          }, 1000);
        };
        return $delegate.call(this, method, url, data, interceptor, headers);
      };
      for (let key in $delegate) {
        proxy[key] = $delegate[key];
      }
      return proxy;
    });
  });

  appModule.run(function($httpBackend) {
    console.log('Running with mock data.');

    // Mock requests targeting GET /dashboard/view
    $httpBackend.whenGET(/^\/dashboard\/view/).respond(function(
        method, url, data) {
      return [200,
        {
          id: '123456789',
          title: 'Dashboard 1',
          type: 'dashboard',
          children: [
            {
              id: '1',
              title: 'Container 1',
              type: 'container',
              layout: {
                cssClasses: ''
              },
              container: {
                flow: 'row',
                columns: 4,
                height: 250,
                children: [
                  {
                    id: '2',
                    title: 'Widget 1 - Chart',
                    type: 'chart',
                    layout: {
                      columnspan: 1,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'LineChart',
                      columns: [],
                      options: {
                        title: 'API Response 1',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query1',
                      querystring: 'start_date=2013-01-01&end_date=2013-01-31',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  },
                  {
                    id: '3',
                    title: 'Widget 2 - Chart',
                    type: 'chart',
                    layout: {
                      columnspan: 1,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'LineChart',
                      columns: [],
                      options: {
                        title: 'API Response 2',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query2',
                      querystring: 'start_date=2013-02-01&end_date=2013-02-28',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  },
                  {
                    id: '4',
                    title: 'Widget 3 - Chart',
                    type: 'chart',
                    layout: {
                      columnspan: 1,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'LineChart',
                      columns: [],
                      options: {
                        title: 'API Response 3',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query3',
                      querystring: 'start_date=2013-03-01&end_date=2013-03-30',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  },
                  {
                    id: '5',
                    title: 'Widget 4 - Chart',
                    type: 'chart',
                    layout: {
                      columnspan: 1,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'LineChart',
                      columns: [],
                      options: {
                        title: 'API Response 4',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query4',
                      querystring: 'start_date=2013-04-01&end_date=2013-04-30',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  }]
              }
            },
            {
              id: '6',
              title: 'Container 2',
              type: 'container',
              layout: {
                cssClasses: ''
              },
              container: {
                flow: 'row',
                columns: 4,
                height: 400,
                children: [
                  {
                    id: '7',
                    title: 'Widget 5 - Table',
                    type: 'chart',
                    layout: {
                      columnspan: 1,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'Table',
                      columns: [],
                      options: {
                        title: 'API Response 5',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query5',
                      querystring: 'start_date=2013-05-01&end_date=2013-05-30',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  },
                  {
                    id: '8',
                    title: 'Widget 6 - Table with DataView',
                    type: 'chart',
                    layout: {
                      columnspan: 1,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'Table',
                      columns: [],
                      options: {
                        title: 'API Response 6',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query6',
                      querystring: 'start_date=2013-05-01&end_date=2013-05-30',
                      view: {
                        columns: [2, 1],
                        filter: [{
                          column: 1,
                          minValue: 0,
                          maxValue: 0.5
                        }],
                        sort: [{
                          column: 2
                        }]
                      }
                    }
                  },
                  {
                    id: '9',
                    title: 'Widget 7 - Chart',
                    type: 'chart',
                    layout: {
                      columnspan: 2,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'LineChart',
                      columns: [],
                      options: {
                        title: 'API Response 7',
                        vAxis: {
                          title: 'Vertical',
                          gridlines: {count: 10}
                        },
                        hAxis: {
                          title: 'Horizontal'
                        }
                      }
                    },
                    datasource: {
                      query: 'query7',
                      querystring: 'start_date=2013-06-01&end_date=2013-06-30',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  }]
              }
            }
          ]
        }];
    });

    // Mock requests targeting GET /data/sql
    $httpBackend.whenGET(/^\/data\/sql/).respond(function(
        method, url, data) {
      return [200,
        {results: {
          cols: [
            {id: 'date', label: 'Date', type: 'date'},
            {id: 'value', label: 'Response Time', type: 'number'},
            {id: 'value', label: 'CPU', type: 'number'},
            {id: 'value', label: 'Disk', type: 'number'}
          ],
          rows: [
            {c: [
              {v: '2013/03/03 00:48:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/04 00:50:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/05 00:59:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/06 00:50:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/07 00:59:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/08 00:50:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/09 00:59:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/10 00:50:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/11 00:59:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/12 00:50:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]},
            {c: [
              {v: '2013/03/20 00:59:04'},
              {v: Math.random()},
              {v: Math.random()},
              {v: Math.random()}
            ]}
          ]
        }}
      ];
    });

    let ids = 128;
    // Mock requests targeting POST /dashboard/create
    $httpBackend.whenPOST('/dashboard/create').respond(
        function(method, url, data) {
          let decoded = new goog.Uri.QueryData(data).get('data');
          let obj = angular.fromJson(decoded);
          obj.id = ids++;
          // Simulate a success and return the dashboard with an id
          return [200, obj];
        }
    );

    // Mock requests targeting POST /dashboard/edit
    $httpBackend.whenPOST(/^\/dashboard\/edit/).respond(
        function(method, url, data) {
          // Simulate a success
          return [200];
        }
    );

    // Don't mock requests targeting /templates
    $httpBackend.whenGET(/^templates\//).passThrough();
  });
};

});  // goog.scope
