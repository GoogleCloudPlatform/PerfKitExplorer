/**
 * @fileoverview Expose mock data for queryResultDataService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

var queryResultDataServiceMock =
    angular.module('queryResultDataServiceMock', []);


queryResultDataServiceMock.value('queryResultDataServiceMockData',
    {
      endpoint: '/data/sql',
      data: { results: {
        cols: [
          {id: 'date', label: 'Date', type: 'date'},
          {id: 'value', label: 'Response Time', type: 'number'}
        ],
        rows: [
          {c: [
            {v: '2013/03/03 00:48:04'},
            {v: 0}
          ]},
          {c: [
            {v: '2013/03/04 00:50:04', f: 'Custom text'},
            {v: 0}
          ]},
          {c: [
            {v: '2013/03/05 00:59:04'},
            {v: 0}
          ]}
        ]
      }}
    });
