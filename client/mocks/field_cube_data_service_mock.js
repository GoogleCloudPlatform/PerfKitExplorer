/**
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
