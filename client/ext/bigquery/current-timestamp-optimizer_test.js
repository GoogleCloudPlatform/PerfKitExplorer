/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Tests for SidebarTabService, holds state and data for the
 * explorer sidebar.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */
'use strict'

goog.require('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampOptimizer');
goog.require('p3rf.perfkit.explorer.ext.BigQuery.CurrentTimestampGranularity');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const CurrentTimestampOptimizer = explorer.ext.bigquery.CurrentTimestampOptimizer;
  const CurrentTimestampGranularity = explorer.ext.bigquery.CurrentTimestampGranularity;

  describe('CurrentTimestampOptimizer', function() {
    let testOptimizer, dashboard, dashboardSetting, widget, widgetSetting;
    let PROVIDED_DASHBOARD, PROVIDED_WIDGET, PROVIDED_DATE;

    const PROVIDED_YEAR = 2006;
    const PROVIDED_MONTH = 1;
    const PROVIDED_DAY = 15;
    const PROVIDED_HOUR = 8;
    const PROVIDED_MINUTE = 14;
    const PROVIDED_SECOND = 23;

    beforeEach(function() {
      testOptimizer = new CurrentTimestampOptimizer();

      PROVIDED_DATE = new Date(
          PROVIDED_YEAR, PROVIDED_MONTH, PROVIDED_DAY,
          PROVIDED_HOUR, PROVIDED_MINUTE, PROVIDED_SECOND);
      
      PROVIDED_WIDGET = {
        datasource: {
          config: {
            bigQuery: {
              optimizeCurrentTimestamp: {
                enabled: null,
                granularity: null}}},
          query_exec: ''}};

      PROVIDED_DASHBOARD = {
        config: {
          bigQuery: {
            optimizeCurrentTimestamp: {
              enabled: false,
              granularity: 'HOUR'}}}};

      dashboardSetting = PROVIDED_DASHBOARD.config.bigQuery.optimizeCurrentTimestamp;
      widgetSetting = PROVIDED_WIDGET.datasource.config.bigQuery.optimizeCurrentTimestamp;

      spyOn(testOptimizer, 'getCurrentDate').and.returnValue(PROVIDED_DATE);
    });

    describe('getEffectiveDate', function() {
      describe('should support restricting the date to the latest', function() {
        it('year', function() {
          let expected = new Date(PROVIDED_YEAR, 0, 1, 0, 0);
          let actual = testOptimizer.getEffectiveDate(CurrentTimestampGranularity.YEAR);

          expect(actual).toEqual(expected);
        });

        it('month', function() {
          let expected = new Date(PROVIDED_YEAR, PROVIDED_MONTH, 1, 0, 0);
          let actual = testOptimizer.getEffectiveDate(CurrentTimestampGranularity.MONTH);

          expect(actual).toEqual(expected);
        });

        it('day', function() {
          let expected = new Date(PROVIDED_YEAR, PROVIDED_MONTH, PROVIDED_DAY, 0, 0);
          let actual = testOptimizer.getEffectiveDate(CurrentTimestampGranularity.DAY);

          expect(actual).toEqual(expected);
        });

        it('hour', function() {
          let expected = new Date(PROVIDED_YEAR, PROVIDED_MONTH, PROVIDED_DAY, PROVIDED_HOUR, 0);
          let actual = testOptimizer.getEffectiveDate(CurrentTimestampGranularity.HOUR);

          expect(actual).toEqual(expected);
        });
      })
    });
    
    describe('canApply', function() {
      describe('should return false when', function() {
        it('dashboard...enabled is false and widget...enabled is null', function() {
          dashboardSetting.enabled = false;
          widgetSetting.enabled = null;
          
          expect(testOptimizer.canApply(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(false);
        });
        
        it('dashboard..enabled is false and widget..enabled is false', function() {
          dashboardSetting.enabled = false;
          widgetSetting.enabled = false;
          
          expect(testOptimizer.canApply(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(false);
        });
        
        it('dashboard..enabled is true and widget..enabled is false', function() {
          dashboardSetting.enabled = true;
          widgetSetting.enabled = false;
          
          expect(testOptimizer.canApply(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(false);
        });
      });
      
      describe('should return true when', function() {
        it('dashboard..enabled is true and widget..enabled is null', function() {
          dashboardSetting.enabled = true;
          widgetSetting.enabled = null;
          
          expect(testOptimizer.canApply(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(true);
        });

        it('dashboard..enabled is true and widget..enabled is true', function() {
          dashboardSetting.enabled = true;
          widgetSetting.enabled = true;
          
          expect(testOptimizer.canApply(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(true);
        });

        it('dashboard..enabled is false and widget..enabled is true', function() {
          dashboardSetting.enabled = false;
          widgetSetting.enabled = true;
          
          expect(testOptimizer.canApply(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(true);
        });
      });
    });

    describe('getEffectiveGranularity', function() {
      it('should return the dashboard setting if the widget is null', function() {
        dashboardSetting.granularity = CurrentTimestampGranularity.YEAR;
        
        expect(testOptimizer.getEffectiveGranularity(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(
            CurrentTimestampGranularity.YEAR);
      });

      it('should return the widget setting if the widget is specified', function() {
        dashboardSetting.granularity = CurrentTimestampGranularity.YEAR;
        widgetSetting.granularity = CurrentTimestampGranularity.DAY;
        
        expect(testOptimizer.getEffectiveGranularity(PROVIDED_DASHBOARD, PROVIDED_WIDGET)).toEqual(
            CurrentTimestampGranularity.DAY);
      });
    });

    describe('apply', function() {
      it('should leave the query untouched when canApply returns false', function() {
        spyOn(testOptimizer, 'canApply').and.returnValue(false);

        const PROVIDED_SQL = 'SELECT CURRENT_TIMESTAMP() FROM foo';
        const EXPECTED_SQL = PROVIDED_SQL;
        PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;

        testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);        
        expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
      });

      it('should replace CURRENT_TIMESTAMP() with the current effective date', function() {
        const effectiveDate = new Date(PROVIDED_YEAR, PROVIDED_MONTH, PROVIDED_DAY, PROVIDED_HOUR, 0);
        const expectedDateString = '2006-02-15T12:00:00.000Z'
        spyOn(effectiveDate, 'toISOString').and.returnValue(expectedDateString);

        spyOn(testOptimizer, 'canApply').and.returnValue(true);
        spyOn(testOptimizer, 'getEffectiveDate').and.returnValue(effectiveDate);

        const PROVIDED_SQL = 'SELECT CURRENT_TIMESTAMP() FROM foo';
        const EXPECTED_SQL = 'SELECT TIMESTAMP(\'' + expectedDateString + '\') FROM foo';
        PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;
        
        testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);
        expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
      });

      describe('should replace CURRENT_TIMESTAMP() with the current effective date', function() {
        let effectiveDate, expectedDateString, expectedDateExpr;
        
        beforeEach(function() {
          effectiveDate = new Date(PROVIDED_YEAR, PROVIDED_MONTH, PROVIDED_DAY, PROVIDED_HOUR, 0);
          expectedDateString = '2006-02-15T12:00:00.000Z'
          expectedDateExpr = 'TIMESTAMP(\'' + expectedDateString + '\')';

          spyOn(effectiveDate, 'toISOString').and.returnValue(expectedDateString);

          spyOn(testOptimizer, 'canApply').and.returnValue(true);
          spyOn(testOptimizer, 'getEffectiveDate').and.returnValue(effectiveDate);
          spyOn(testOptimizer, 'getEffectiveGranularity').and.returnValue(CurrentTimestampGranularity.HOUR);
        });

        it('for a single occurrence', function() {
          const PROVIDED_SQL = 'SELECT CURRENT_TIMESTAMP() FROM foo';
          const EXPECTED_SQL = 'SELECT ' + expectedDateExpr + ' FROM foo';
          PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;
          
          testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);
          expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
        });

        it('for any case', function() {
          const PROVIDED_SQL = 'SELECT cUrREnt_TimEStaMP() FROM foo';
          const EXPECTED_SQL = 'SELECT ' + expectedDateExpr + ' FROM foo';
          PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;
          
          testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);
          expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
        });

        it('for a multiple occurrences', function() {
          const PROVIDED_SQL = 'SELECT CURRENT_TIMESTAMP() FROM foo WHERE timestamp < CURRENT_TIMESTAMP() AND';
          const EXPECTED_SQL = (
              'SELECT ' + expectedDateExpr + ' FROM foo ' +
              'WHERE timestamp < ' + expectedDateExpr + ' AND');
          PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;
          
          testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);
          expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
        });

        it('when adjacent to non-whitespace symbols', function() {
          const PROVIDED_SQL = (
              'SELECT * FROM TABLE_DATE_RANGE([proj:ds.tbl], ' +
              'DATE_ADD(CURRENT_TIMESTAMP(), \'DAY\', -8), CURRENT_TIMESTAMP())');
          const EXPECTED_SQL = (
              'SELECT * FROM TABLE_DATE_RANGE([proj:ds.tbl], ' +
              'DATE_ADD(' + expectedDateExpr + ', \'DAY\', -8), ' + expectedDateExpr + ')');
          PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;
          
          testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);
          expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
        });
      });

      it('should ignore CURRENT_TIMESTAMP() if it is part of another expression', function() {
        const PROVIDED_SQL = (
            'SELECT CUSTOM_CURRENT_TIMESTAMP() FROM foo');
        const EXPECTED_SQL = PROVIDED_SQL;
        PROVIDED_WIDGET.datasource.query_exec = PROVIDED_SQL;
        
        testOptimizer.apply(PROVIDED_DASHBOARD, PROVIDED_WIDGET);
        expect(PROVIDED_WIDGET.datasource.query_exec).toEqual(EXPECTED_SQL);
      });
    });
  });
});
