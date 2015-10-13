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
 * @fileoverview Model definition for a GQL query against an App Engine datastore.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.gql.QueryConfigModel');


goog.scope(function() {

const explorer = p3rf.perfkit.explorer;


/**
 * QueryConfigModel provides options for issuing a GQL query against an App Engine
 * datastore.
 * @constructor
 * @implements {IQueryConfigModel}
 *
 */
components.widget.query.gql.QueryConfigModel = function() {
  /**
   * Describes the URL of the REST API that the GQL query will be issued against.
   * TODO(P0): Document the interface and conventions for the REST API.
   * @export {string}
   */
  this.service_url = 'https://myapp.appspot.com/data/gql';
};

});
