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
 * @fileoverview UI.Router configuration for the Explorer page.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerRouterConfig');



goog.scope(function() {
  const explorer = p3rf.perfkit.explorer;


  const EXPLORER_PARAMS = [
    'dashboard', 'container', 'widget', 'tab', 'footerTab',
    '{focusWidget:boolean}', '{showFooter:boolean}'];

  /**
   * Sets up the explorer routing for selection and focus.
   *
   * @param {!UIRouter.StateProviderService} $stateProvider
   * @constructor
   * @ngInject
   */
  explorer.components.explorer.ExplorerRouterConfig = function(
      $stateProvider) {
    $stateProvider.state('explorer-dashboard-edit', {
      url: '/explore?' + EXPLORER_PARAMS.join('?'),
      template: '<explorer-page></explorer-page>',
      controller: ['$state', function($state) {
        console.log($state.params);
      }]
    });
  };


});  // goog.scope
