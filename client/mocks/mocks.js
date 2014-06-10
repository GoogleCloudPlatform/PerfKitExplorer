/**
 * @fileoverview Mocks for local development.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.mocks.mocks');

goog.require('goog.Uri');

goog.scope(function() {
var mocks = p3rf.dashkit.explorer.mocks.mocks;


/**
 * @return {boolean} Whether the URL contains ?mock=true.
 */
mocks.isMockParamTrue = function() {
  // Extracts URL query parameters from the current location
  var uri = new goog.Uri(window.location);
  var mockParameter = uri.getParameterValue('mock');
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
      var proxy = function(method, url, data, callback, headers) {
        var interceptor = function() {
          var self = this,
              arguments_ = arguments;
          setTimeout(function() {
            callback.apply(self, arguments_);
          }, 1000);
        };
        return $delegate.call(this, method, url, data, interceptor, headers);
      };
      for (var key in $delegate) {
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

    var ids = 128;
    // Mock requests targeting POST /dashboard/create
    $httpBackend.whenPOST('/dashboard/create').respond(
        function(method, url, data) {
          var decoded = new goog.Uri.QueryData(data).get('data');
          var obj = angular.fromJson(decoded);
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
