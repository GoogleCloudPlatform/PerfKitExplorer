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
 * @fileoverview workQueue is an angular service that manages a queue
 * of pending work item promises, running them with concurrency and
 * priority control.
 *
 * @author klausw@google.com (Klaus Weidner)
 */

goog.provide('p3rf.perfkit.explorer.components.util.WorkQueueService');

goog.scope(function() {
const explorer = p3rf.perfkit.explorer;

/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.$q} $q
 * @param {angular.$timeout} $timeout
 * @constructor
 * @ngInject
 */
explorer.components.util.WorkQueueService = function($q, $timeout) {
  this.q_ = $q;
  this.timeout_ = $timeout;
  this.queuePending_ = [];
  this.queueExecuting_ = 0;
  this.maxParallelQueries_ = 1; // Override with .setMaxParallelQueries()
  this.status_ = 'Uninitialized';
  this.isEmpty_ = true;
  this.updateQueue_();
};
const WorkQueueService = explorer.components.util.WorkQueueService;

/**
 * Notification types supported for work items.
 *
 * The STARTED notification is sent when a work item changes state
 * from "queued" to "executing".
 *
 * @enum {string}
 */
WorkQueueService.NOTIFICATION = {
  STARTED: 'Started'
};

/**
 * Creates a new work item to be executed in the future.
 *
 * @constructor
 * @param {function(): angular.$q.Promise} workFunction Function that
 *     returns a Deferred representing the work to be done.
 * @param {angular.$q.Deferred} deferred A new Deferred object that
 *     will be used to wrap the pending work item.
 */
WorkQueueService.WorkItem = function(workFunction, deferred) {
  this.workFunction_ = workFunction;
  this.deferred = deferred;
};

/**
 * Executes the work item by creating the underlying promise.
 */
WorkQueueService.WorkItem.prototype.start = function() {
  var workPromise = this.workFunction_();
  workPromise.then(
      this.deferred.resolve.bind(this.deferred),
      this.deferred.reject.bind(this.deferred));
  return this.deferred.promise;
};

/**
 * Updates the maximum number of supported parallel queries.
 *
 * If the number is increased, this will start queued work items
 * as appropriate to take advantage of the new limit. Decreasing
 * the limit does not have any effect on already-executing work
 * items.
 *
 * Work items enqueued with runNow=true ignore this limit.
 *
 * @param {number} max Max parallel queries.
 */
WorkQueueService.prototype.setMaxParallelQueries = function(max) {
  this.maxParallelQueries_ = max;
  this.updateQueue_();
};

/**
 * Adds an item to the work queue.
 *
 * @param {function(): angular.$q.Promise} worker Function that
 *     returns a Deferred which represents the work to be done.
 * @param {boolean} runNow If true, the work item is executed
 *     immediately, bypassing the queue.
 */
WorkQueueService.prototype.enqueue = function(worker, runNow) {
  var workItem = new WorkQueueService.WorkItem(worker, this.q_.defer());
  if (runNow) {
    this.executeItem_(workItem);
  } else {
    this.queuePending_.push(workItem);
    this.updateQueue_();
  }
  return workItem.deferred.promise;
};

/**
 * Updates the work queue and executes pending items if approprate.
 *
 * @private
 */
WorkQueueService.prototype.updateQueue_ = function() {
  while (this.queuePending_.length &&
      this.queueExecuting_ < this.maxParallelQueries_) {
    var workItem = this.queuePending_.shift();

    this.executeItem_(workItem);
  }
  this.isEmpty_ = this.queuePending_.length == 0 &&
      this.queueExecuting_ == 0;
  this.status_ = this.buildStatusMessage_();
};

/**
 * Executes an item from the work queue.
 *
 * @private
 * @param {WorkQueueService.WorkItem} workItem Work item.
 */
WorkQueueService.prototype.executeItem_ = function(workItem) {
  ++this.queueExecuting_;
  var onFinished = () => {
    --this.queueExecuting_;
    this.updateQueue_();
  };
  this.timeout_(() => {
    workItem.deferred.notify(WorkQueueService.NOTIFICATION.STARTED);
  });

  workItem.start().then(onFinished, onFinished);
};

/**
 * Checks if the work queue has no queued or executing items.
 *
 * @return {boolean} True if empty.
 */
WorkQueueService.prototype.isEmpty = function() {
  return this.isEmpty_;
};

/**
 * Gets the current status message.
 *
 * @return {string} Status message.
 */
WorkQueueService.prototype.getStatus = function() {
  return this.status_;
};

/**
 * Builds a status message for display.
 *
 * This is called whenever the queue status changes.
 *
 * @return {string} Status message.
 */
WorkQueueService.prototype.buildStatusMessage_ = function() {
  var msg = 'Executing: ' + this.queueExecuting_;
  if (this.queuePending_.length > 0) {
    msg += ', queued: ' + this.queuePending_.length;
  }
  return msg;
};

});  // goog.scope
