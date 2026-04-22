import test from 'node:test';
import assert from 'node:assert/strict';
import { installDom, mountToBody } from './helpers/dom-env.mjs';

const restore = installDom();

const { jsx, jsxs, jsxDEV, Fragment } = await import('../src/runtime.js');
const { signal, state, Renderable } = await import('@granularjs/core');

test.after(() => restore());

test('jsx: tag string produces a Renderable for a div', () => {
  const node = jsx('div', { className: 'box', children: 'hi' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'DIV');
  assert.equal(root.firstChild.className, 'box');
  assert.equal(root.firstChild.textContent, 'hi');
});

test('jsx: className is normalized to class', () => {
  const node = jsx('div', { className: 'a b' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.getAttribute('class'), 'a b');
});

test('jsx: htmlFor passed through (core handles it)', () => {
  const node = jsx('label', { htmlFor: 'name', children: 'Name' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.getAttribute('for'), 'name');
});

test('jsx: handles single child', () => {
  const node = jsx('span', { children: 'x' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.textContent, 'x');
});

test('jsxs: handles array of children', () => {
  const node = jsxs('ul', { children: [jsx('li', { children: 'a' }), jsx('li', { children: 'b' })] });
  const root = mountToBody(node);
  const lis = root.firstChild.querySelectorAll('li');
  assert.equal(lis.length, 2);
  assert.equal(lis[0].textContent, 'a');
  assert.equal(lis[1].textContent, 'b');
});

test('jsx: nested arrays of children flatten', () => {
  const node = jsx('div', { children: [['a', 'b'], 'c', null, undefined, false] });
  const root = mountToBody(node);
  assert.equal(root.firstChild.textContent, 'abc');
});

test('jsx: signal child renders reactively', () => {
  const count = signal(0);
  const node = jsx('span', { children: count });
  const root = mountToBody(node);
  assert.equal(root.firstChild.textContent.trim(), '0');
  count.set(7);
  assert.equal(root.firstChild.textContent.trim(), '7');
});

test('jsx: state-path child renders reactively', () => {
  const s = state({ name: 'world' });
  const node = jsx('span', { children: s.name });
  const root = mountToBody(node);
  assert.equal(root.firstChild.textContent.trim(), 'world');
  s.name.set('granular');
  assert.equal(root.firstChild.textContent.trim(), 'granular');
});

test('jsx: Fragment with single child returns that child', () => {
  const child = jsx('span', { children: 'x' });
  const node = jsx(Fragment, { children: child });
  assert.equal(node, child);
});

test('jsx: Fragment with multiple children returns array', () => {
  const a = jsx('span', { children: 'a' });
  const b = jsx('span', { children: 'b' });
  const node = jsxs(Fragment, { children: [a, b] });
  assert.ok(Array.isArray(node));
  assert.equal(node.length, 2);
});

test('jsx: Fragment renders correctly inside a div', () => {
  const a = jsx('span', { children: 'a' });
  const b = jsx('span', { children: 'b' });
  const frag = jsxs(Fragment, { children: [a, b] });
  const node = jsx('div', { children: frag });
  const root = mountToBody(node);
  assert.equal(root.firstChild.querySelectorAll('span').length, 2);
});

test('jsx: function components receive props', () => {
  const Greeting = (props) => jsx('h1', { children: ['Hello, ', props.name, '!'] });
  const node = jsx(Greeting, { name: 'world' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'H1');
  assert.equal(root.firstChild.textContent, 'Hello, world!');
});

test('jsx: function components receive children prop', () => {
  const Card = (props) => jsx('section', { children: props.children });
  const node = jsx(Card, { children: 'inner' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'SECTION');
  assert.equal(root.firstChild.textContent, 'inner');
});

test('jsx: function components called with no args when no props', () => {
  let calledWith = 'unset';
  const Empty = (...args) => {
    calledWith = args;
    return jsx('div', { children: 'ok' });
  };
  jsx(Empty, null);
  assert.deepEqual(calledWith, []);
});

test('jsx: events are attached', () => {
  let count = 0;
  const node = jsx('button', { onClick: () => { count++; }, children: 'click' });
  const root = mountToBody(node);
  root.firstChild.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  assert.equal(count, 1);
});

test('jsx: void elements (input) render without children', () => {
  const node = jsx('input', { type: 'text', value: 'x' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'INPUT');
  assert.equal(root.firstChild.getAttribute('type'), 'text');
});

test('jsx: boolean attributes (disabled true) are reflected', () => {
  const node = jsx('button', { disabled: true, children: 'no' });
  const root = mountToBody(node);
  assert.ok(root.firstChild.hasAttribute('disabled'));
});

test('jsx: spread props are accepted', () => {
  const props = { id: 'x', className: 'y', children: 'z' };
  const node = jsx('div', { ...props });
  const root = mountToBody(node);
  assert.equal(root.firstChild.id, 'x');
  assert.equal(root.firstChild.className, 'y');
  assert.equal(root.firstChild.textContent, 'z');
});

test('jsx: dangerouslySetInnerHTML maps to innerHTML', () => {
  const node = jsx('div', { dangerouslySetInnerHTML: { __html: '<b>raw</b>' } });
  const root = mountToBody(node);
  assert.equal(root.firstChild.querySelector('b').textContent, 'raw');
});

test('jsx: globals collision tags resolve via Html prefix (option)', () => {
  const node = jsx('option', { value: '1', children: 'one' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'OPTION');
  assert.equal(root.firstChild.value, '1');
  assert.equal(root.firstChild.textContent, 'one');
});

test('jsx: globals collision tags resolve via Html prefix (audio)', () => {
  const node = jsx('audio', { src: '/x.mp3' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'AUDIO');
});

test('jsx: globals collision tags resolve via Html prefix (image -> img)', () => {
  const node = jsx('img', { src: '/x.png', alt: 'x' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName, 'IMG');
});

test('jsx: custom elements (kebab-case) are supported', () => {
  const node = jsx('my-widget', { id: 'w1', children: 'inner' });
  const root = mountToBody(node);
  assert.equal(root.firstChild.tagName.toLowerCase(), 'my-widget');
  assert.equal(root.firstChild.id, 'w1');
  assert.equal(root.firstChild.textContent, 'inner');
});

test('jsx: ref via state receives node after mount', () => {
  const stRef = state(null);
  const node = jsx('div', { ref: stRef, children: 'r' });
  mountToBody(node);
  const got = stRef.get();
  assert.ok(got, 'ref should be set');
  assert.equal(got.tagName, 'DIV');
});

test('jsx: key is preserved as meta on the node', () => {
  const node = jsx('li', { children: 'x' }, 42);
  assert.equal(node.__granular_key, 42);
});

test('jsxDEV: source location is preserved as meta', () => {
  const node = jsxDEV('div', { children: 'x' }, 'k', false, { fileName: '/a.tsx', lineNumber: 10 });
  assert.ok(node.__granular_source);
  assert.equal(node.__granular_source.fileName, '/a.tsx');
});

test('jsx: the produced node is an instance of Renderable', () => {
  const node = jsx('div', { children: 'x' });
  assert.ok(node instanceof Renderable);
});

test('jsx: null/false/true children are skipped', () => {
  const node = jsx('div', { children: ['a', null, false, true, 'b'] });
  const root = mountToBody(node);
  assert.equal(root.firstChild.textContent, 'ab');
});

test('jsx: components can return Fragments', () => {
  const Pair = () => jsxs(Fragment, { children: [jsx('span', { children: 'x' }), jsx('span', { children: 'y' })] });
  const node = jsx('div', { children: jsx(Pair, null) });
  const root = mountToBody(node);
  assert.equal(root.firstChild.querySelectorAll('span').length, 2);
});

test('jsx: number and bigint children render as text', () => {
  const node = jsx('div', { children: [1, ' ', 2n] });
  const root = mountToBody(node);
  assert.equal(root.firstChild.textContent, '1 2');
});

test('jsx: callback refs receive the element after mount', () => {
  let captured = null;
  const node = jsx('div', { ref: (el) => { captured = el; }, children: 'r' });
  mountToBody(node);
  assert.ok(captured, 'ref callback should have fired with element');
  assert.equal(captured.tagName, 'DIV');
});

test('jsx: signal refs are populated after mount', () => {
  const elRef = signal(null);
  const node = jsx('div', { ref: elRef, children: 's' });
  mountToBody(node);
  assert.ok(elRef.get());
  assert.equal(elRef.get().tagName, 'DIV');
});
