/**
 * @fileoverview Expose mock data for dashboardDataService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

var dashboardDataServiceMock = angular.module('dashboardDataServiceMock', []);


dashboardDataServiceMock.value('dashboardDataServiceMockData',
    {
      endpoint: '/dashboard/view',
      data: function() { return [200,
        {
          id: '667cb727-fb22-40b3-8777-8a875355f797',
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
                        title: '1'
                      }
                    },
                    datasource: {
                      query: '',
                      querystring: '',
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
                      columnspan: 2,
                      cssClasses: ''
                    },
                    chart: {
                      chartType: 'ColumnChart',
                      options: {
                        title: '2'
                      }
                    },
                    datasource: {
                      query: '',
                      querystring: '',
                      view: {
                        columns: [],
                        filter: [],
                        sort: []
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      ];
      }
    });

dashboardDataServiceMock.value('dashboardDataServiceMockDashboardList',
    {
      endpoint: '/dashboard/list',
      data: function() { return [200,
        [{id: '1', owner: 'user@domain.com', title: 'Dashboard 1'},
         {id: '2', owner: 'user@domain.com', title: 'Dashboard 2'}
        ]
      ];
      }
    });
