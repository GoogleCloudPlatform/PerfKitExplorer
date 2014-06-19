/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Expose mock data for fieldCubeDataService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

var fieldCubeDataServiceMock = angular.module('fieldCubeDataServiceMock', []);


fieldCubeDataServiceMock.value('fieldCubeDataServiceMockData',
    {
      data: function() {
        return [
          200,
          {
            data: ['Dashboard 1', 'Dashboard 2']
          }
        ];
      }
    });
