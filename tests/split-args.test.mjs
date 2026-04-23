import test from 'node:test';
import assert from 'node:assert/strict';
import { installDom } from './helpers/dom-env.mjs';

const restore = installDom();

const { jsx, jsxs } = await import('../src/runtime.js');
const { splitArgs } = await import('../src/helpers.js');
const { state, signal, isComputed, isState, isStatePath, resolve } = await import('@granularjs/core');

test.after(() => restore());

test('splitArgs: separates plain object as props and other args as children', () => {
  const { props, rawProps, children } = splitArgs([{ size: 'lg' }, 'a', 'b']);
  assert.equal(rawProps.size, 'lg');
  assert.deepEqual(children, ['a', 'b']);
  assert.equal(typeof props, 'object', 'props should be an object (proxy)');
  assert.equal(typeof props.size, 'object', 'each prop key should be wrapped (computed)');
  assert.equal(resolve(props.size), 'lg');
});

test('splitArgs: merges multiple props objects in declaration order', () => {
  const { rawProps, children } = splitArgs([
    { a: 1, b: 1 },
    'child-1',
    { b: 2, c: 3 },
    'child-2',
  ]);
  assert.deepEqual(rawProps, { a: 1, b: 2, c: 3 });
  assert.deepEqual(children, ['child-1', 'child-2']);
});

test('splitArgs: applies defaults only for undefined keys', () => {
  const { rawProps } = splitArgs([{ size: 'lg' }], { size: 'md', color: 'primary' });
  assert.equal(rawProps.size, 'lg');
  assert.equal(rawProps.color, 'primary');
});

test('splitArgs: signal/state/computed values are treated as children, NOT props', () => {
  const sig = signal(0);
  const st = state({ x: 1 });
  const stx = st.x;
  const { rawProps, children } = splitArgs([sig, stx, { gap: 'md' }, 'tail']);
  assert.deepEqual(rawProps, { gap: 'md' });
  assert.equal(children.length, 3);
  assert.strictEqual(children[0], sig);
  assert.ok(isStatePath(children[1]) || isState(children[1]), 'state path preserved');
  assert.equal(children[2], 'tail');
});

test('splitArgs: arrays are treated as children, not as props', () => {
  const arr = ['x', 'y'];
  const { rawProps, children } = splitArgs([arr, { foo: 1 }]);
  assert.deepEqual(rawProps, { foo: 1 });
  assert.deepEqual(children, [arr]);
});

test('splitArgs: works with `arguments`-like object (not a real Array)', () => {
  function variadic() {
    return splitArgs(arguments);
  }
  const { rawProps, children } = variadic({ a: 1 }, 'k1', 'k2');
  assert.deepEqual(rawProps, { a: 1 });
  assert.deepEqual(children, ['k1', 'k2']);
});

test('splitArgs: each prop key is reactive even if originally a primitive', () => {
  const { props } = splitArgs([{ size: 'lg', count: 7 }]);
  assert.equal(resolve(props.size), 'lg');
  assert.equal(resolve(props.count), 7);
});

test('splitArgs: integrates with JSX user components written as variadic', () => {
  const calls = [];
  const Card = (...args) => {
    const { rawProps, children } = splitArgs(args, { padding: 'md' });
    calls.push({ rawProps, children });
    return jsx('section', { 'data-padding': rawProps.padding, children });
  };

  jsx(Card, { children: 'a' });
  jsxs(Card, { padding: 'lg', children: ['x', 'y'] });

  assert.equal(calls[0].rawProps.padding, 'md');
  assert.deepEqual(calls[0].children, ['a']);
  assert.equal(calls[1].rawProps.padding, 'lg');
  assert.deepEqual(calls[1].children, ['x', 'y']);
});
