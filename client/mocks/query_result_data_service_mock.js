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
 * @fileoverview Expose mock data for queryResultDataService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.mocks.queryResultDataServiceMock');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;

explorer.mocks.queryResultDataServiceMock = angular.module(
    'queryResultDataServiceMock', []);
const queryResultDataServiceMock = explorer.mocks.queryResultDataServiceMock;

queryResultDataServiceMock.value('queryResultDataServiceMockData',
    {
      endpoint: '/data/sql',
      data: {
        elapsedTime: 123,
        jobId: 12345,
        totalRows: 3,
        totalBytesProcessed: 123456,
        results: {
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
        }
      }
    });

}); // goog.scope
