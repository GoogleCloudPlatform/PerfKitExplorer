/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview BigqueryConfigService encapsulates the settings for bigquery bigquery.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.ext.bigquery.BigqueryConfigService');
goog.require('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampGranularity');


goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;
  const CurrentTimestampGranularity = explorer.ext.bigquery.CurrentTimestampGranularity;


  /**
   * See module docstring for more information about purpose and usage.
   *
   * @constructor
   */
  explorer.ext.bigquery.BigqueryConfigService = class {
    constructor() {
      /**
       * Exposes the list of granularity to the angular world.
       *
       * @const {Object.<string, string>}
       * @export 
       */
      this.ALL_TIMESTAMP_GRANULARITY = CurrentTimestampGranularity;
    }
  }
});
