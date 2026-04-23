import { Elements, state, isState, isStatePath, isSignal } from '@granularjs/core';

const tagCache = new Map();

function tagToFactoryName(tag) {
  let name = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (name in globalThis) name = `Html${name}`;
  return name;
}

let _ElementNodeCtor = null;
function getElementNodeCtor() {
  if (_ElementNodeCtor) return _ElementNodeCtor;
  const sample = Elements.Div();
  _ElementNodeCtor = sample.constructor;
  return _ElementNodeCtor;
}

function makeCustomElementFactory(tagName) {
  const ElementNode = getElementNodeCtor();
  return (props, ...children) => new ElementNode(tagName, props || {}, children);
}

function resolveTag(tag) {
  if (typeof tag !== 'string') return tag;
  const cached = tagCache.get(tag);
  if (cached) return cached;

  const factoryName = tagToFactoryName(tag);
  let factory = Elements[factoryName];

  if (!factory) {
    factory = makeCustomElementFactory(tag);
  }

  tagCache.set(tag, factory);
  return factory;
}

function flattenChildren(out, value) {
  if (value == null || value === false || value === true) return;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) flattenChildren(out, value[i]);
    return;
  }
  out.push(value);
}

function adaptRef(ref) {
  if (ref == null) return null;
  if (isState(ref) || isStatePath(ref)) return ref;
  const adapter = state(null);
  if (isSignal(ref)) {
    adapter.subscribe((next) => { ref.set(next); });
    return adapter;
  }
  if (typeof ref === 'function') {
    adapter.subscribe((next) => { ref(next); });
    return adapter;
  }
  return null;
}

function normalizeProps(rawProps, ref) {
  const adaptedRef = adaptRef(ref);

  if (!rawProps) {
    if (adaptedRef == null) return null;
    return { node: adaptedRef };
  }

  const out = {};
  let hasOwn = false;

  for (const key in rawProps) {
    if (key === 'children' || key === 'key' || key === 'ref') continue;
    const value = rawProps[key];

    if (key === 'className') {
      out.class = value;
      hasOwn = true;
      continue;
    }

    if (key === 'htmlFor') {
      out.htmlFor = value;
      hasOwn = true;
      continue;
    }

    if (key === 'dangerouslySetInnerHTML') {
      if (value && typeof value === 'object' && '__html' in value) {
        out.innerHTML = value.__html;
        hasOwn = true;
      }
      continue;
    }

    out[key] = value;
    hasOwn = true;
  }

  if (adaptedRef != null) {
    out.node = adaptedRef;
    hasOwn = true;
  }

  return hasOwn ? out : null;
}

function tagNode(node, key) {
  if (key !== undefined && node && typeof node === 'object') {
    try { node.__granular_key = key; } catch {}
  }
  return node;
}

// Granular's contract: ANY factory called from JSX is variadic.
// JSX           ->  call style
// <div>...</div>      ->  Div(propsObj?, ...children)
// <Stack>...</Stack>  ->  Stack(propsObj?, ...children)
// <MyComp>...</MyComp>->  MyComp(propsObj?, ...children)
//
// User components that need React-style { props, children, rawProps } can use
// `splitArgs(arguments)` from '@granularjs/jsx' (see ./helpers.js).
function jsxImpl(tag, rawProps, key) {
  const ref = rawProps ? rawProps.ref : undefined;
  const rawChildren = rawProps ? rawProps.children : undefined;

  const children = [];
  flattenChildren(children, rawChildren);

  if (tag === Fragment) {
    return children.length === 1 ? children[0] : children;
  }

  const factory = typeof tag === 'string' ? resolveTag(tag) : tag;
  const props = normalizeProps(rawProps, ref);
  const node = props ? factory(props, ...children) : factory(...children);
  return tagNode(node, key);
}

export function jsx(tag, props, key) {
  return jsxImpl(tag, props, key);
}

export function jsxs(tag, props, key) {
  return jsxImpl(tag, props, key);
}

export function jsxDEV(tag, props, key, _isStaticChildren, source, _self) {
  const node = jsxImpl(tag, props, key);
  if (node && typeof node === 'object' && source) {
    try { node.__granular_source = source; } catch {}
  }
  return node;
}

export const Fragment = Symbol.for('@granularjs/jsx.Fragment');

export { resolveTag };
