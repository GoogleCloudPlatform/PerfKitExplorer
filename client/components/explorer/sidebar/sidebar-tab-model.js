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
 * @fileoverview columnStyleService is a model encapsulating the properties
 * of a column style.  In practice, it is contained in a heterogenous array.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @export
 */
explorer.components.explorer.sidebar.SidebarTabModel = class {
  constructor() {
    /**
     * A string that uniquely represents the tab in the sidebar.
     * @export {string}
     */
    this.id = '';

    /**
     * A string used as the label and heading for the tab.
     * @export {string}
     */
    this.title = '';

    /**
     * A string that is used for the tab's tooltip.
     * @export {string}
     */
    this.hint = '';

    /**
     * The CSS class name used for the icon representation of the tab.
     * See sidebar-tabs-directive.html for details on iconClass application.
     *
     * PerfKit Explorer currently supports icons from the following sources:
     *   Font Awesome: https://fortawesome.github.io/Font-Awesome/icons/
     *   Bootstrap: http://getbootstrap.com/components/#glyphicons
     *     (an implementation of Glyphicons: http://glyphicons.com/)
     * @export {string}
     */
    this.iconClass = '';

    /**
     * The CSS class name used for the tab.
     * See sidebar-tabs-directive.html for details on tabClass application.
     * @export {string}
     */
    this.tabClass = '';

    /**
     * The CSS class name used for the tab's content.
     * See sidebar-directive.html for details on panelClass application.
     * @export {string}
     */
    this.panelClass = '';

    /**
     * The CSS class name used for the title of tab's content.
     * See sidebar-directive.html for details on panelTitleClass application.
     * @export {string}
     */
    this.panelTitleClass = '';

    /**
     * The CSS class name used for the tab's toolbar.
     * See explorer-toolbar-directive.html for details on toolbarClass application.
     * @export {string}
     */
    this.toolbarClass = '';
  }
}

});  // goog.scope
