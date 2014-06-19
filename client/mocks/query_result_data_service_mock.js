/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
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
