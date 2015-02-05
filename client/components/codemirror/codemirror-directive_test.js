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
 * @fileoverview Test for codemirror, an angular directive that wraps
 * codemirror.
 * @author joemu@google.com (Joe Allan Muharsky)
 *
 * Adapted from https://github.com/angular-ui/ui-codemirror/
 * MIT License
 */

describe('uiCodemirror', function() {
  'use strict';

  // declare these up here to be global to all tests
  var scope, $compile, $timeout, uiConfig;

  beforeEach(module('ui.codemirror'));
  beforeEach(inject(function(uiCodemirrorConfig) {
    uiConfig = uiCodemirrorConfig;
    uiConfig.codemirror = {bar: 'baz'};

  }));

  // inject in angular constructs. Injector knows about leading/trailing
  // underscores and does the right thing
  // otherwise, you would need to inject these into each test
  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  afterEach(function() {
    uiConfig = {};
  });

  describe('compiling this directive', function() {

    it('should throw an error if used against a non-textarea', function() {
      function compile() {
        $compile('<div codemirror ng-model="foo"></div>')(scope);
      }

      expect(compile).toThrow(new Error(
          'codemirror can only be applied to a textarea element'));
    });

    it('should not throw an error when used against a textarea', function() {
      function compile() {
        $compile('<textarea codemirror ng-model="foo"></textarea>')(scope);
      }

      expect(compile).not.toThrow();
    });

    it('should watch the codemirror attribute', function() {
      spyOn(scope, '$watch');
      // Must have a parentNode for insertBefore (see
      // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
      // #L3390)
      $compile('<div><textarea codemirror ng-model="foo" uiRefresh="sdf">' +
               '</textarea></div>')(scope);
      $timeout.flush();
      expect(scope.$watch).toHaveBeenCalled();
    });
  });

  describe('while spying on the CodeMirror instance', function() {

    var codemirror;

    beforeEach(function() {
      var fromTextArea = CodeMirror.fromTextArea;
      spyOn(CodeMirror, 'fromTextArea').and.callFake(function() {
        codemirror = fromTextArea.apply(this, arguments);
        return codemirror;
      });
    });

    describe('verify the directive options', function() {
      it('should include the passed options', function() {
        // Must have a parentNode for insertBefore (see
        // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
        // #L3390)
        $compile('<div><textarea codemirror cm-options="{oof: \'baar\'}" ' +
                 'ng-model="foo"></textarea></div>')(scope);
        $timeout.flush();
        expect(CodeMirror.fromTextArea.calls.mostRecent().args[1].oof).
            toEqual('baar');
      });

      it('should include the default options', function() {
        // Must have a parentNode for insertBefore (see
        // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
        // #L3390)
        $compile('<div><textarea codemirror ng-model="foo">' +
                 '</textarea></div>')(scope);
        $timeout.flush();
        expect(CodeMirror.fromTextArea.calls.mostRecent().args[1].bar).
            toEqual('baz');
      });
    });

    describe('when uiRefresh is added', function() {
      it('should trigger the CodeMirror.refresh() method', function() {
        // Must have a parentNode for insertBefore (see
        // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
        // #L3390)
        scope.$apply('bar = true');
        $compile('<div><textarea codemirror ng-model="foo" ' +
                 'ui-refresh="{{ bar }}"></textarea></div>')(scope);
        $timeout.flush();
        var spy = spyOn(codemirror, 'refresh');
        scope.$apply('bar = false');
        $timeout.flush();
        expect(codemirror.refresh).toHaveBeenCalled();
        scope.$apply('bar = true');
        $timeout.flush();
        expect(spy.calls.count()).toEqual(2);
      });
    });

    describe('when the IDE changes', function() {
      it('should update the model', function() {
        // Must have a parentNode for insertBefore (see
        // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
        // #L3390)
        $compile('<div><textarea codemirror ng-model="foo">' +
                 '</textarea></div>')(scope);
        scope.$apply("foo = 'bar'");
        $timeout.flush();
        var value = 'baz';
        codemirror.setValue(value);
        expect(scope.foo).toBe(value);
      });
    });

    describe('when the model changes', function() {
      it('should update the IDE', function() {
        // Must have a parentNode for insertBefore (see
        // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
        // #L3390)
        var element = $compile('<div><textarea codemirror ng-model="foo">' +
                               '</textarea></div>')(scope);
        scope.foo = 'bar';
        scope.$apply();
        $timeout.flush();
        expect(codemirror.getValue()).toBe(scope.foo);
      });
    });

    describe('when the model is undefined/null', function() {
      it('should update the IDE with an empty string', function() {
        // Must have a parentNode for insertBefore (see
        // https://github.com/marijnh/CodeMirror/blob/v3.11/lib/codemirror.js
        // #L3390)
        var element = $compile('<div><textarea codemirror ng-model="foo">' +
                               '</textarea></div>')(scope);
        scope.$apply();
        $timeout.flush();
        expect(scope.foo).toBe(undefined);
        expect(codemirror.getValue()).toBe('');
        scope.$apply('foo = "bar"');
        expect(scope.foo).toBe('bar');
        expect(codemirror.getValue()).toBe('bar');
        scope.$apply('foo = null');
        expect(scope.foo).toBe(null);
        expect(codemirror.getValue()).toBe('');
      });
    });
  });

  describe('when the model is an object or an array', function() {
    it('should throw an error', function() {
      function compileWithObject() {
        $compile('<textarea codemirror ng-model="foo"></textarea>')(scope);
        $timeout.flush();
        scope.foo = {};
        scope.$apply();
      }

      function compileWithArray() {
        $compile('<textarea codemirror ng-model="foo"></textarea>')(scope);
        $timeout.flush();
        scope.foo = [];
        scope.$apply();
      }

      expect(compileWithObject).toThrow();
      expect(compileWithArray).toThrow();
    });
  });
});
