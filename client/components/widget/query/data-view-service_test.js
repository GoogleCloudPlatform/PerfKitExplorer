/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Tests for the dataViewService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.dashkit.explorer.application.module');
goog.require('p3rf.dashkit.explorer.components.widget.data_viz.gviz.getGvizDataTable');
goog.require('p3rf.dashkit.explorer.components.widget.query.DataViewService');
goog.require('p3rf.dashkit.explorer.models.DataViewModel');

describe('dataViewService', function() {
  var DataViewModel = p3rf.dashkit.explorer.models.DataViewModel;
  var svc, gvizDataViewMock, GvizDataTable;

  beforeEach(module('explorer'));

  beforeEach(inject(function(dataViewService, _GvizDataTable_) {
    svc = dataViewService;
    GvizDataTable = _GvizDataTable_;
  }));

  describe('create', function() {
    var dataTable;

    beforeEach(function() {
      var data = {
        cols: [
          {id: 'date', label: 'Date', type: 'date'},
          {id: 'value', label: 'Fake values 1', type: 'number'},
          {id: 'value', label: 'Fake values 2', type: 'number'}
        ],
        rows: [
          {c: [
            {v: '2013/03/03 00:48:04'},
            {v: 0.5},
            {v: 3}
          ]},
          {c: [
            {v: '2013/03/04 00:50:04'},
            {v: 0.1},
            {v: 5}
          ]},
          {c: [
            {v: '2013/03/05 00:59:04'},
            {v: 0.3},
            {v: 1}
          ]},
          {c: [
            {v: '2013/03/06 00:50:04'},
            {v: 0.7},
            {v: 2}
          ]},
          {c: [
            {v: '2013/03/07 00:59:04'},
            {v: 0.2},
            {v: 6}
          ]}
        ]
      };

      dataTable = new GvizDataTable(data);
    });

    it('should return the correct dataViewJson.', function() {
      var model = new DataViewModel();
      model.columns = [0, 2];
      model.filter = [
        {
          column: 1,
          minValue: 0,
          maxValue: 0.2
        }
      ];
      model.sort = [
        {
          column: 2,
          desc: true
        }
      ];

      var dataViewJson = svc.create(dataTable, model);

      var expectedDataViewJson = [
        {
          columns: [0, 2],
          rows: [1, 4]
        },
        {
          rows: [1, 0]
        }
      ];
      expect(dataViewJson).toEqual(expectedDataViewJson);
    });

    it('should return an error when an error occurred on columns property.',
        function() {
          var model = new DataViewModel();
          model.columns = [-1];

          var dataViewJson = svc.create(dataTable, model);
          expect(dataViewJson.error).toBeDefined();
          expect(dataViewJson.error.property).toEqual('columns');
        }
    );

    it('should return an error when an error occurred on filter property.',
        function() {
          var model = new DataViewModel();
          model.filter = [-1];

          var dataViewJson = svc.create(dataTable, model);
          expect(dataViewJson.error).toBeDefined();
          expect(dataViewJson.error.property).toEqual('filter');
        }
    );

    it('should return an error when an error occurred on sort property.',
        function() {
          var model = new DataViewModel();
          model.sort = [-1];

          var dataViewJson = svc.create(dataTable, model);
          expect(dataViewJson.error).toBeDefined();
          expect(dataViewJson.error.property).toEqual('sort');
        }
    );
  });
});
