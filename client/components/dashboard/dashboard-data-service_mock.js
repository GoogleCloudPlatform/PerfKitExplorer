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
 * @fileoverview Expose mock data for dashboardDataService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardDataServiceMock');


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
