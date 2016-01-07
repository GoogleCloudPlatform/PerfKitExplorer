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
 * @fileoverview containerService is an angular service that provides
 *     management and manipulation (not state) of containers in a dashboard.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.container.ContainerService');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @ngInject
 * @export
 */
explorer.components.container.ContainerService = class {
  constructor(arrayUtilService, dashboardService, explorerStateService) {
    /** @export {!ArrayUtilService} */
    this.arrayUtilSvc = arrayUtilService;

    /** @export {!DashboardService} */
    this.dashboardSvc = dashboardService;

    /** @export {!ExplorerStateService} */
    this.explorerStateSvc = explorerStateService;
  };

  /**
   * Checks for a valid container and executes the specified move function.
   *
   * @param {!Function.<!Array, !ContainerWidgetModel>} moveFunction The
   *     function to execute.
   * @param {?ContainerWidgetModel=} opt_container The target for the move,
   *     if provided.  Otherwise, the selected container is used.
   */
  move_(moveFunction, opt_container) {
    if (!goog.isDefAndNotNull(opt_container) &&
        !goog.isDefAndNotNull(this.dashboardSvc.selectedContainer)) {
     throw new Error(
        moveFunction.name + ' failed: no container specified or selected.');
    }

    moveFunction(
        this.dashboardSvc.current.model.children,
        opt_container || this.dashboardSvc.selectedContainer
    );
  };

  /**
   * Moves the specified or selected container to the first position.
   *
   * @param {?ContainerWidgetModel=} opt_container The target for the move,
   *     if provided.  Otherwise, the selected container is used.
   * @export
   */
  moveFirst(opt_container) {
    this.move_(
        angular.bind(this.arrayUtilSvc, this.arrayUtilSvc.moveFirst), opt_container);
  };

  /**
   * Moves the specified or selected container to the previous position.
   *
   * @param {?ContainerWidgetModel=} opt_container The target for the move,
   *     if provided.  Otherwise, the selected container is used.
   * @export
   */
  movePrevious(opt_container) {
    this.move_(
        angular.bind(this.arrayUtilSvc, this.arrayUtilSvc.movePrevious), opt_container);
  };

  /**
   * Moves the specified or selected container to the next position.
   *
   * @param {?ContainerWidgetModel=} opt_container The target for the move,
   *     if provided.  Otherwise, the selected container is used.
   * @export
   */
  moveNext(opt_container) {
    this.move_(
        angular.bind(this.arrayUtilSvc, this.arrayUtilSvc.moveNext), opt_container);
  };

  /**
   * Moves the specified or selected container to the last position.
   *
   * @param {?ContainerWidgetModel=} opt_container The target for the move,
   *     if provided.  Otherwise, the selected container is used.
   * @export
   */
  moveLast(opt_container) {
    this.move_(
        angular.bind(this.arrayUtilSvc, this.arrayUtilSvc.moveLast), opt_container);
  };


  /**
   * Adds a new container with one new widget and optionally selects it.
   *
   * @param {boolean=} opt_autoCreateWidget If true, automatically adds
   *    a widget to the container.
   * @param {boolean=} opt_autoSelect If true, automatically selects
   *    the widget and/or container.
   * @return {!ContainerWidgetConfig}
   * @export
   */
  insert(opt_autoCreateWidget = true, opt_autoSelect = true) {
    let container = this.dashboardSvc.newContainer(opt_autoCreateWidget);

    this.dashboardSvc.containers.push(container);
    this.explorerStateSvc.containers.add(container);

    if (opt_autoSelect) {
      this.dashboardSvc.selectContainer(container);
    }

    return container;
  };


  /**
   * Adds a new container with one new widget and optionally selects it.
   *
   * @param {number} index
   * @param {boolean=} opt_autoCreateWidget If true, automatically adds
   *    a widget to the container.
   * @param {boolean=} opt_autoSelect If true, automatically selects
   *    the widget and/or container.
   * @return {!ContainerWidgetConfig}
   * @export
   */
  insertAt(index, opt_autoCreateWidget = true, opt_autoSelect = true) {
    let container = this.dashboardSvc.newContainer(opt_autoCreateWidget);

    goog.array.insertAt(this.dashboardSvc.containers, container, index);
    this.explorerStateSvc.containers.add(container);

    if (opt_autoSelect) {
      this.dashboardSvc.selectContainer(container);
    }

    return container;
  };


  /**
   * Adds a new container and inserts it after the provided one.
   *
   * @param {?ContainerWidgetConfig=} opt_container The container that will
   *     precede the newly created one.  If not provided, the selected
   *     container is used.
   * @export
   */
  insertAfter(
      opt_container, opt_autoCreateWidget = true, opt_autoSelect = true) {
    let container = this.dashboardSvc.newContainer(opt_autoCreateWidget);
    let targetContainer = opt_container || this.dashboardSvc.selectedContainer;

    if (!goog.isDefAndNotNull(targetContainer)) {
      throw new Error(
          'insertAfter failed: No container provided or selected.');
    };

    this.arrayUtilSvc.insertAfter(
        this.dashboardSvc.containers, container, targetContainer);
    this.explorerStateSvc.containers.add(container);

    if (opt_autoSelect) {
      this.dashboardSvc.selectContainer(container);
    }

    return container;
  }


  /**
   * Adds a new container and inserts it before the provided one.
   *
   * @param {?ContainerWidgetConfig=} opt_container The container that will
   *     follow the newly created one.  If not provided, the selected
   *     container is used.
   */
  insertBefore(
      opt_container, opt_autoCreateWidget = true, opt_autoSelect = true) {
    let container = this.dashboardSvc.newContainer(opt_autoCreateWidget);
    let targetContainer = opt_container || this.dashboardSvc.selectedContainer;

    if (!goog.isDefAndNotNull(targetContainer)) {
      throw new Error(
          'insertBefore failed: No container provided or selected.');
    };

    this.arrayUtilSvc.insertBefore(
        this.dashboardSvc.containers, container, targetContainer);
    this.explorerStateSvc.containers.add(container);

    if (opt_autoSelect) {
      this.dashboardSvc.selectContainer(container);
    }

    return container;
  }

  /**
   * Removes the specified container from the current dashboard.
   *
   * @param {?ContainerWidgetConfig=} opt_container The container that will
   *     follow the newly created one.  If not provided, the selected
   *     container is used.
   * @export
   */
  remove(opt_container) {
    let targetContainer = opt_container || this.dashboardSvc.selectedContainer;

    if (this.dashboardSvc.selectedWidget.state().parent === targetContainer) {
      this.dashboardSvc.unselectWidget();
    }

    this.move_(
        angular.bind(this.arrayUtilSvc, this.arrayUtilSvc.remove), targetContainer);
    delete this.explorerStateSvc.containers.all[targetContainer.model.id];
  }
};
const ContainerService = explorer.components.container.ContainerService;

});  // goog.scope
