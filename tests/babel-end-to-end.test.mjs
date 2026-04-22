import test from 'node:test';
import assert from 'node:assert/strict';
import { transformSync } from '@babel/core';
import presetReact from '@babel/preset-react';
import { installDom, mountToBody } from './helpers/dom-env.mjs';

const restore = installDom();
test.after(() => restore());

const runtimeUrl = new URL('../src/jsx-runtime.js', import.meta.url).href;

async function compileAndEval(source) {
  const out = transformSync(source, {
    babelrc: false,
    configFile: false,
    presets: [[presetReact, { runtime: 'automatic', importSource: '@granularjs/jsx' }]],
    sourceType: 'module',
  });

  const code = out.code.replace(
    /from ['"]@granularjs\/jsx\/jsx-runtime['"]/g,
    `from '${runtimeUrl}'`,
  );

  const blob = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
  return await import(blob);
}

test('end-to-end: compiles a basic .jsx component', async () => {
  const mod = await compileAndEval(`
    export default function App() {
      return <div className="x">hi</div>;
    }
  `);
  const root = mountToBody(mod.default());
  assert.equal(root.firstChild.tagName, 'DIV');
  assert.equal(root.firstChild.className, 'x');
  assert.equal(root.firstChild.textContent, 'hi');
});

test('end-to-end: compiles JSX with nested elements', async () => {
  const mod = await compileAndEval(`
    export default function App() {
      return (
        <ul>
          <li>a</li>
          <li>b</li>
        </ul>
      );
    }
  `);
  const root = mountToBody(mod.default());
  assert.equal(root.firstChild.querySelectorAll('li').length, 2);
});

test('end-to-end: compiles JSX with reactive child via signal', async () => {
  const { signal } = await import('@granularjs/core');
  const sig = signal(10);

  const mod = await compileAndEval(`
    export default function App({ count }) {
      return <span>{count}</span>;
    }
  `);
  const root = mountToBody(mod.default({ count: sig }));
  assert.equal(root.firstChild.textContent.trim(), '10');
  sig.set(99);
  assert.equal(root.firstChild.textContent.trim(), '99');
});

test('end-to-end: compiles JSX fragment', async () => {
  const mod = await compileAndEval(`
    export default function App() {
      return (
        <>
          <span>a</span>
          <span>b</span>
        </>
      );
    }
  `);
  const result = mod.default();
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 2);
});

test('end-to-end: compiles JSX with spread props', async () => {
  const mod = await compileAndEval(`
    export default function App({ rest }) {
      return <div {...rest}>x</div>;
    }
  `);
  const root = mountToBody(mod.default({ rest: { id: 'spread', className: 'spread-cls' } }));
  assert.equal(root.firstChild.id, 'spread');
  assert.equal(root.firstChild.className, 'spread-cls');
});

test('end-to-end: compiles JSX with event handler', async () => {
  let count = 0;
  const mod = await compileAndEval(`
    export default function App({ onPress }) {
      return <button onClick={onPress}>click</button>;
    }
  `);
  const root = mountToBody(mod.default({ onPress: () => { count++; } }));
  root.firstChild.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  assert.equal(count, 1);
});

test('end-to-end: compiles JSX with components calling components', async () => {
  const mod = await compileAndEval(`
    function Inner({ name }) {
      return <em>{name}</em>;
    }
    export default function App() {
      return <div><Inner name="x" /></div>;
    }
  `);
  const root = mountToBody(mod.default());
  assert.equal(root.firstChild.querySelector('em').textContent, 'x');
});

test('end-to-end: compiles JSX with custom elements (kebab-case)', async () => {
  const mod = await compileAndEval(`
    export default function App() {
      return <my-card title="hi">inner</my-card>;
    }
  `);
  const root = mountToBody(mod.default());
  assert.equal(root.firstChild.tagName.toLowerCase(), 'my-card');
  assert.equal(root.firstChild.getAttribute('title'), 'hi');
  assert.equal(root.firstChild.textContent, 'inner');
});

test('end-to-end: compiles JSX with conditional && returning false (skipped child)', async () => {
  const mod = await compileAndEval(`
    export default function App({ show }) {
      return <div>{show && <span>hi</span>}</div>;
    }
  `);
  const root = mountToBody(mod.default({ show: false }));
  assert.equal(root.firstChild.textContent, '');
  assert.equal(root.firstChild.querySelector('span'), null);
});

test('end-to-end: compiles JSX with map (static array)', async () => {
  const mod = await compileAndEval(`
    export default function App({ items }) {
      return <ul>{items.map((it) => <li key={it}>{it}</li>)}</ul>;
    }
  `);
  const root = mountToBody(mod.default({ items: ['a', 'b', 'c'] }));
  const lis = root.firstChild.querySelectorAll('li');
  assert.equal(lis.length, 3);
  assert.equal(lis[2].textContent, 'c');
});
