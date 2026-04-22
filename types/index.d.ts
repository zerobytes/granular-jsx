/**
 * @granularjs/jsx — automatic JSX runtime for @granularjs/core.
 *
 * Public entry. Re-exports Fragment + runtime functions and the JSX namespace.
 */

import type { Renderable } from '@granularjs/core';

export const Fragment: unique symbol;
export type Fragment = typeof Fragment;

export function jsx(tag: any, props: any, key?: any): any;
export function jsxs(tag: any, props: any, key?: any): any;
export function jsxDEV(
  tag: any,
  props: any,
  key?: any,
  isStaticChildren?: boolean,
  source?: { fileName: string; lineNumber: number; columnNumber?: number },
  self?: unknown,
): any;

export function resolveTag(tag: string | Function): Function;

export type GranularJsxElement = Renderable | Renderable[] | string | number | null | undefined;

export {};
