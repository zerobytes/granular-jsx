import {
  Renderer,
  isSignal,
  isState,
  isStatePath,
  isComputed,
  computed,
} from '@granularjs/core';

// A "props object" in Granular's variadic call convention is any plain object
// passed positionally that is NOT renderable, NOT a DOM node, and NOT a
// reactive primitive (signal/state/state-path/computed). Reactive primitives
// are renderable values, so they are treated as children, not as props.
function isPropsObject(value) {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !Renderer.isRenderable(value) &&
    !Renderer.isDomNode(value) &&
    !isSignal(value) &&
    !isState(value) &&
    !isStatePath(value) &&
    !isComputed(value)
  );
}

/**
 * Split the variadic arguments of a JSX-called user component into:
 *   - props:    each value wrapped reactively (computed). Always reactive,
 *               even when the original was a primitive — so component code
 *               can treat every prop the same way (subscribe, read, etc.)
 *   - rawProps: the merged raw values exactly as they were passed.
 *   - children: every argument that was not a configuration object,
 *               in original positional order.
 *
 * Use it inside any user component that wants the React-style
 * "{ props, children }" view of its arguments:
 *
 *   import { splitArgs } from '@granularjs/jsx';
 *
 *   export function MyCard(...args) {
 *     const { props, rawProps, children } = splitArgs(args, { padding: 'md' });
 *     return Card({ padding: rawProps.padding }, ...children);
 *   }
 *
 * `defaults` is an optional object with fallback values applied when the
 * corresponding key is `undefined` after merging the configuration objects.
 */
export function splitArgs(args, defaults) {
  const props = {};
  const children = [];

  const list = Array.isArray(args) ? args : Array.from(args || []);
  for (const arg of list) {
    if (isPropsObject(arg)) Object.assign(props, arg);
    else children.push(arg);
  }

  if (defaults && typeof defaults === 'object') {
    for (const key of Object.keys(defaults)) {
      if (props[key] === undefined) props[key] = defaults[key];
    }
  }

  return { props: computed(props), rawProps: props, children };
}
