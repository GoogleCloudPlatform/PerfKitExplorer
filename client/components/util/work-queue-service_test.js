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
 * @fileoverview Tests for the work queue service.
 * @author klausw@google.com (Klaus Weidner)
 */

goog.require('p3rf.perfkit.explorer.components.util.WorkQueueService');

describe('workQueueService', function() {
  var WorkQueueService = explorer.components.util.WorkQueueService;
  var workQueue;
  var fakeQueries;
  var fakeQueryResults;
  var timeout;

  beforeEach(module('explorer'));

  beforeEach(inject(function($timeout, workQueueService) {
    timeout = $timeout;
    workQueue = workQueueService;
    fakeQueries = {};
    fakeQueryResults = {};
  }));

  var RESULTS_NULL = {
    value: null,
    error: null,
    notification: null};
  var RESULTS_STARTED = {
    value: null,
    error: null,
    notification: WorkQueueService.NOTIFICATION.STARTED};
  var RESULTS_DONE = {
    value: 42,
    error: null,
    notification: WorkQueueService.NOTIFICATION.STARTED};

  var makeFakeQuery = function(name) {
    var deferred = fakeQueries[name] = workQueue.q_.defer();
    return deferred.promise;
  };

  var scheduleQuery = function(name, runNow) {
    fakeQueryResults[name] = goog.object.clone(RESULTS_NULL);
    var promise = workQueue.enqueue(() => makeFakeQuery(name), runNow);
    promise.then(
        function(val) { fakeQueryResults[name].value = val; },
        function(err) { fakeQueryResults[name].error = err; },
        function(note) { fakeQueryResults[name].notification = note; });
  };

  it('should schedule and execute a single item.', function() {
    expect(workQueue.isEmpty()).toBeTrue();

    scheduleQuery('a', false);
    expect(workQueue.isEmpty()).toBeFalse();

    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);

    fakeQueries['a'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_DONE);

    expect(workQueue.isEmpty()).toBeTrue();
  });

  it('should schedule and execute multiple items.', function() {
    workQueue.setMaxParallelQueries(1);
    expect(workQueue.isEmpty()).toBeTrue();

    scheduleQuery('a', false);
    scheduleQuery('b', false);
    scheduleQuery('c', false);
    scheduleQuery('d', false);
    expect(workQueue.isEmpty()).toBeFalse();

    // We only allow one parallel query, so only one should be started.
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['b']).toEqual(RESULTS_NULL);
    expect(fakeQueryResults['c']).toEqual(RESULTS_NULL);
    expect(fakeQueryResults['d']).toEqual(RESULTS_NULL);

    // Raise the parallel query limit, two should be running now.
    workQueue.setMaxParallelQueries(2);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['b']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['c']).toEqual(RESULTS_NULL);
    expect(fakeQueryResults['d']).toEqual(RESULTS_NULL);

    // Resolve one of the pending queries. Pick the second one
    // just to keep things interesting. This should get another
    // query started.
    fakeQueries['b'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['b']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['c']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['d']).toEqual(RESULTS_NULL);

    // Finish another query. All should be done or running now.
    fakeQueries['a'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['b']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['c']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['d']).toEqual(RESULTS_STARTED);

    // ... And another.
    fakeQueries['c'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['b']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['c']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['d']).toEqual(RESULTS_STARTED);

    // ... And the last one. All done.
    fakeQueries['d'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['b']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['c']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['d']).toEqual(RESULTS_DONE);

    expect(workQueue.isEmpty()).toBeTrue();
  });

  it('should allow out-of-order execution.', function() {
    workQueue.setMaxParallelQueries(1);
    expect(workQueue.isEmpty()).toBeTrue();

    scheduleQuery('a', false);
    scheduleQuery('b', false);

    // We only allow one parallel query, so only one should be started.
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['b']).toEqual(RESULTS_NULL);

    // Run a high-priority item out of order.
    scheduleQuery('c', true);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['b']).toEqual(RESULTS_NULL);
    expect(fakeQueryResults['c']).toEqual(RESULTS_STARTED);

    // Finish the high-priority item. The unstarted normal-priority
    // item should remain unstarted since it respects the queue limit.
    fakeQueries['c'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['b']).toEqual(RESULTS_NULL);
    expect(fakeQueryResults['c']).toEqual(RESULTS_DONE);

    // Now finish the running item, this should get the last one started.
    fakeQueries['a'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['b']).toEqual(RESULTS_STARTED);
    expect(fakeQueryResults['c']).toEqual(RESULTS_DONE);

    // Finish the last query.
    fakeQueries['b'].resolve(42);
    timeout.flush();
    expect(fakeQueryResults['a']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['b']).toEqual(RESULTS_DONE);
    expect(fakeQueryResults['c']).toEqual(RESULTS_DONE);

    expect(workQueue.isEmpty()).toBeTrue();
  });
});
