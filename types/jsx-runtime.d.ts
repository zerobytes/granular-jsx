/**
 * @granularjs/jsx/jsx-runtime — TypeScript JSX namespace for the automatic runtime.
 *
 * This file is loaded by `tsc` when `jsxImportSource: "@granularjs/jsx"` is set.
 * It exports:
 *   - `jsx`, `jsxs`, `Fragment` runtime functions
 *   - the `JSX` namespace (IntrinsicElements, Element, ElementClass, ...)
 */

import type { Renderable, Reactive, Signal, State } from '@granularjs/core';

// ─── Runtime exports (must match src/jsx-runtime.js) ───────────────────────

export const Fragment: unique symbol;
export type Fragment = typeof Fragment;

export function jsx(tag: any, props: any, key?: any): JSX.Element;
export function jsxs(tag: any, props: any, key?: any): JSX.Element;

// ─── Reactive prop helpers ─────────────────────────────────────────────────

export type R<T> = Reactive<T>;
export type RBool = Reactive<boolean>;
export type RString = Reactive<string>;
export type RNumber = Reactive<number>;

// ─── JSX namespace ─────────────────────────────────────────────────────────

declare global {
  namespace JSX {
    type Element = Renderable | Renderable[] | string | number | null | undefined;

    interface ElementClass {
      mountInto(parent: Node, beforeNode: Node | null): void;
      unmount(): void;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes {
      key?: string | number;
      ref?: Signal<any> | State<any> | ((el: Element | null) => void);
    }

    interface IntrinsicClassAttributes<T> extends IntrinsicAttributes {}

    type Child =
      | Renderable
      | string
      | number
      | bigint
      | boolean
      | null
      | undefined
      | Signal<any>
      | State<any>
      | Child[];

    // ─── Common attribute bags ───────────────────────────────────────────

    interface DOMAttributes<T> {
      children?: Child;

      // Mouse events
      onClick?: (event: MouseEvent) => void;
      onDblClick?: (event: MouseEvent) => void;
      onMouseDown?: (event: MouseEvent) => void;
      onMouseUp?: (event: MouseEvent) => void;
      onMouseEnter?: (event: MouseEvent) => void;
      onMouseLeave?: (event: MouseEvent) => void;
      onMouseMove?: (event: MouseEvent) => void;
      onMouseOver?: (event: MouseEvent) => void;
      onMouseOut?: (event: MouseEvent) => void;
      onContextMenu?: (event: MouseEvent) => void;

      // Pointer events
      onPointerDown?: (event: PointerEvent) => void;
      onPointerUp?: (event: PointerEvent) => void;
      onPointerMove?: (event: PointerEvent) => void;
      onPointerEnter?: (event: PointerEvent) => void;
      onPointerLeave?: (event: PointerEvent) => void;
      onPointerCancel?: (event: PointerEvent) => void;

      // Keyboard events
      onKeyDown?: (event: KeyboardEvent) => void;
      onKeyUp?: (event: KeyboardEvent) => void;
      onKeyPress?: (event: KeyboardEvent) => void;

      // Form events
      onChange?: (event: Event) => void;
      onInput?: (event: InputEvent) => void;
      onSubmit?: (event: SubmitEvent) => void;
      onReset?: (event: Event) => void;
      onFocus?: (event: FocusEvent) => void;
      onBlur?: (event: FocusEvent) => void;

      // Touch events
      onTouchStart?: (event: TouchEvent) => void;
      onTouchEnd?: (event: TouchEvent) => void;
      onTouchMove?: (event: TouchEvent) => void;
      onTouchCancel?: (event: TouchEvent) => void;

      // Drag and drop
      onDrag?: (event: DragEvent) => void;
      onDragStart?: (event: DragEvent) => void;
      onDragEnd?: (event: DragEvent) => void;
      onDragEnter?: (event: DragEvent) => void;
      onDragLeave?: (event: DragEvent) => void;
      onDragOver?: (event: DragEvent) => void;
      onDrop?: (event: DragEvent) => void;

      // Clipboard
      onCopy?: (event: ClipboardEvent) => void;
      onCut?: (event: ClipboardEvent) => void;
      onPaste?: (event: ClipboardEvent) => void;

      // Scroll & resize
      onScroll?: (event: Event) => void;
      onWheel?: (event: WheelEvent) => void;

      // Media
      onLoad?: (event: Event) => void;
      onError?: (event: Event) => void;
      onLoadStart?: (event: Event) => void;
      onLoadedData?: (event: Event) => void;
      onLoadedMetadata?: (event: Event) => void;
      onPlay?: (event: Event) => void;
      onPause?: (event: Event) => void;
      onEnded?: (event: Event) => void;
      onTimeUpdate?: (event: Event) => void;
      onVolumeChange?: (event: Event) => void;

      // Animation / transition
      onAnimationStart?: (event: AnimationEvent) => void;
      onAnimationEnd?: (event: AnimationEvent) => void;
      onAnimationIteration?: (event: AnimationEvent) => void;
      onTransitionEnd?: (event: TransitionEvent) => void;
    }

    interface AriaAttributes {
      'aria-label'?: RString;
      'aria-labelledby'?: RString;
      'aria-describedby'?: RString;
      'aria-hidden'?: R<boolean | 'true' | 'false'>;
      'aria-disabled'?: R<boolean | 'true' | 'false'>;
      'aria-expanded'?: R<boolean | 'true' | 'false'>;
      'aria-selected'?: R<boolean | 'true' | 'false'>;
      'aria-checked'?: R<boolean | 'true' | 'false' | 'mixed'>;
      'aria-pressed'?: R<boolean | 'true' | 'false' | 'mixed'>;
      'aria-controls'?: RString;
      'aria-current'?: R<boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'>;
      'aria-haspopup'?: R<boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true' | 'false'>;
      'aria-live'?: R<'polite' | 'assertive' | 'off'>;
      'aria-modal'?: RBool;
      'aria-busy'?: RBool;
      'aria-required'?: RBool;
      'aria-invalid'?: R<boolean | 'true' | 'false' | 'grammar' | 'spelling'>;
      role?: RString;
    }

    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Granular-specific
      node?: Signal<T | null> | State<T | null> | ((el: T) => void);
      ref?: Signal<T | null> | State<T | null> | ((el: T | null) => void);
      key?: string | number;

      // Standard HTML
      class?: RString;
      className?: RString;
      id?: RString;
      style?: R<string | Partial<CSSStyleDeclaration> | Record<string, R<string | number>>>;
      title?: RString;
      tabIndex?: RNumber;
      hidden?: RBool;
      draggable?: RBool;
      contentEditable?: R<boolean | 'true' | 'false' | 'inherit'>;
      spellCheck?: RBool;
      lang?: RString;
      dir?: R<'ltr' | 'rtl' | 'auto'>;
      slot?: RString;
      translate?: R<'yes' | 'no'>;

      // Data and ARIA wildcards
      [key: `data-${string}`]: any;
      [key: `aria-${string}`]: any;

      // React-compat (the runtime translates these)
      htmlFor?: RString;
      dangerouslySetInnerHTML?: { __html: string };
      innerHTML?: RString;
      textContent?: R<string | number>;
    }

    // Anchor
    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
      href?: RString;
      target?: R<'_self' | '_blank' | '_parent' | '_top' | string>;
      rel?: RString;
      download?: R<string | boolean>;
      hrefLang?: RString;
      type?: RString;
    }

    // Button
    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
      type?: R<'submit' | 'reset' | 'button'>;
      disabled?: RBool;
      form?: RString;
      formAction?: RString;
      name?: RString;
      value?: R<string | number>;
      autoFocus?: RBool;
    }

    // Form
    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
      action?: RString;
      method?: R<'get' | 'post'>;
      encType?: RString;
      target?: RString;
      name?: RString;
      noValidate?: RBool;
      autoComplete?: R<'on' | 'off'>;
    }

    // Input
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      type?: RString;
      value?: R<string | number>;
      defaultValue?: R<string | number>;
      checked?: RBool;
      defaultChecked?: RBool;
      placeholder?: RString;
      name?: RString;
      disabled?: RBool;
      readOnly?: RBool;
      required?: RBool;
      autoComplete?: RString;
      autoFocus?: RBool;
      min?: R<string | number>;
      max?: R<string | number>;
      step?: R<string | number>;
      minLength?: RNumber;
      maxLength?: RNumber;
      pattern?: RString;
      multiple?: RBool;
      accept?: RString;
      list?: RString;
      size?: RNumber;
      form?: RString;
      formAction?: RString;
      formMethod?: RString;
      formTarget?: RString;
      formNoValidate?: RBool;
      formEncType?: RString;
    }

    // Label
    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
      for?: RString;
      htmlFor?: RString;
      form?: RString;
    }

    // Select
    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
      value?: R<string | number | string[]>;
      defaultValue?: R<string | number | string[]>;
      disabled?: RBool;
      multiple?: RBool;
      name?: RString;
      required?: RBool;
      size?: RNumber;
      autoComplete?: RString;
      autoFocus?: RBool;
      form?: RString;
    }

    // Option
    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
      value?: R<string | number>;
      disabled?: RBool;
      selected?: RBool;
      label?: RString;
    }

    // Textarea
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      value?: R<string | number>;
      defaultValue?: R<string | number>;
      placeholder?: RString;
      rows?: RNumber;
      cols?: RNumber;
      disabled?: RBool;
      readOnly?: RBool;
      required?: RBool;
      maxLength?: RNumber;
      minLength?: RNumber;
      name?: RString;
      autoComplete?: RString;
      autoFocus?: RBool;
      form?: RString;
      wrap?: R<'hard' | 'soft' | 'off'>;
    }

    // Image
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
      src?: RString;
      alt?: RString;
      width?: R<string | number>;
      height?: R<string | number>;
      loading?: R<'eager' | 'lazy'>;
      decoding?: R<'async' | 'auto' | 'sync'>;
      srcSet?: RString;
      sizes?: RString;
      crossOrigin?: R<'anonymous' | 'use-credentials' | ''>;
      referrerPolicy?: RString;
      useMap?: RString;
      isMap?: RBool;
    }

    // Iframe
    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
      src?: RString;
      srcDoc?: RString;
      name?: RString;
      width?: R<string | number>;
      height?: R<string | number>;
      sandbox?: RString;
      allow?: RString;
      allowFullScreen?: RBool;
      loading?: R<'eager' | 'lazy'>;
      referrerPolicy?: RString;
    }

    // Link
    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
      rel?: RString;
      href?: RString;
      type?: RString;
      hrefLang?: RString;
      media?: RString;
      sizes?: RString;
      crossOrigin?: RString;
      integrity?: RString;
      as?: RString;
    }

    // Meta
    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
      name?: RString;
      content?: RString;
      charSet?: RString;
      httpEquiv?: RString;
    }

    // Script
    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
      src?: RString;
      type?: RString;
      async?: RBool;
      defer?: RBool;
      crossOrigin?: RString;
      integrity?: RString;
      noModule?: RBool;
      referrerPolicy?: RString;
    }

    // Source
    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
      src?: RString;
      type?: RString;
      srcSet?: RString;
      sizes?: RString;
      media?: RString;
    }

    // Video / Audio shared
    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
      src?: RString;
      autoPlay?: RBool;
      controls?: RBool;
      loop?: RBool;
      muted?: RBool;
      preload?: R<'auto' | 'metadata' | 'none' | ''>;
      crossOrigin?: RString;
      mediaGroup?: RString;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
      poster?: RString;
      width?: R<string | number>;
      height?: R<string | number>;
      playsInline?: RBool;
    }

    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    // Table family
    interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
      cellPadding?: R<string | number>;
      cellSpacing?: R<string | number>;
      summary?: RString;
      width?: R<string | number>;
    }

    interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
      span?: RNumber;
      width?: R<string | number>;
    }

    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
      colSpan?: RNumber;
      rowSpan?: RNumber;
      headers?: RString;
      scope?: RString;
      align?: R<'left' | 'center' | 'right' | 'justify' | 'char'>;
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
      colSpan?: RNumber;
      rowSpan?: RNumber;
      headers?: RString;
      scope?: R<'col' | 'row' | 'colgroup' | 'rowgroup'>;
    }

    // Details
    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
      open?: RBool;
    }

    // Dialog
    interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
      open?: RBool;
    }

    // Object
    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
      data?: RString;
      type?: RString;
      name?: RString;
      width?: R<string | number>;
      height?: R<string | number>;
      form?: RString;
    }

    // Optgroup
    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
      label?: RString;
      disabled?: RBool;
    }

    // Output
    interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
      for?: RString;
      htmlFor?: RString;
      form?: RString;
      name?: RString;
    }

    // Progress / Meter
    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
      value?: R<string | number>;
      max?: R<string | number>;
    }

    interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
      value?: R<string | number>;
      min?: R<string | number>;
      max?: R<string | number>;
      low?: R<string | number>;
      high?: R<string | number>;
      optimum?: R<string | number>;
      form?: RString;
    }

    // Fieldset
    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
      disabled?: RBool;
      form?: RString;
      name?: RString;
    }

    // Time
    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
      dateTime?: RString;
    }

    // Quote
    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
      cite?: RString;
    }

    // List items
    interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
      type?: R<'1' | 'a' | 'A' | 'i' | 'I'>;
      start?: RNumber;
      reversed?: RBool;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
      value?: R<string | number>;
    }

    // Canvas
    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
      width?: R<string | number>;
      height?: R<string | number>;
    }

    // Embed / Param
    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
      src?: RString;
      type?: RString;
      width?: R<string | number>;
      height?: R<string | number>;
    }

    interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
      name?: RString;
      value?: R<string | number>;
    }

    // SVG (broad permissive)
    interface SVGAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }

    // ─── IntrinsicElements ───────────────────────────────────────────────

    interface IntrinsicElements {
      // Document & sectioning
      html: HTMLAttributes<HTMLHtmlElement>;
      head: HTMLAttributes<HTMLHeadElement>;
      title: HTMLAttributes<HTMLTitleElement>;
      base: HTMLAttributes<HTMLBaseElement>;
      link: LinkHTMLAttributes<HTMLLinkElement>;
      meta: MetaHTMLAttributes<HTMLMetaElement>;
      style: HTMLAttributes<HTMLStyleElement>;
      body: HTMLAttributes<HTMLBodyElement>;
      article: HTMLAttributes<HTMLElement>;
      section: HTMLAttributes<HTMLElement>;
      nav: HTMLAttributes<HTMLElement>;
      aside: HTMLAttributes<HTMLElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
      h2: HTMLAttributes<HTMLHeadingElement>;
      h3: HTMLAttributes<HTMLHeadingElement>;
      h4: HTMLAttributes<HTMLHeadingElement>;
      h5: HTMLAttributes<HTMLHeadingElement>;
      h6: HTMLAttributes<HTMLHeadingElement>;
      hgroup: HTMLAttributes<HTMLElement>;
      header: HTMLAttributes<HTMLElement>;
      footer: HTMLAttributes<HTMLElement>;
      address: HTMLAttributes<HTMLElement>;
      main: HTMLAttributes<HTMLElement>;
      search: HTMLAttributes<HTMLElement>;

      // Text content
      p: HTMLAttributes<HTMLParagraphElement>;
      hr: HTMLAttributes<HTMLHRElement>;
      pre: HTMLAttributes<HTMLPreElement>;
      blockquote: QuoteHTMLAttributes<HTMLQuoteElement>;
      ol: OlHTMLAttributes<HTMLOListElement>;
      ul: HTMLAttributes<HTMLUListElement>;
      li: LiHTMLAttributes<HTMLLIElement>;
      dl: HTMLAttributes<HTMLDListElement>;
      dt: HTMLAttributes<HTMLElement>;
      dd: HTMLAttributes<HTMLElement>;
      figure: HTMLAttributes<HTMLElement>;
      figcaption: HTMLAttributes<HTMLElement>;
      div: HTMLAttributes<HTMLDivElement>;
      menu: HTMLAttributes<HTMLMenuElement>;

      // Inline text
      a: AnchorHTMLAttributes<HTMLAnchorElement>;
      em: HTMLAttributes<HTMLElement>;
      strong: HTMLAttributes<HTMLElement>;
      small: HTMLAttributes<HTMLElement>;
      s: HTMLAttributes<HTMLElement>;
      cite: HTMLAttributes<HTMLElement>;
      q: QuoteHTMLAttributes<HTMLQuoteElement>;
      dfn: HTMLAttributes<HTMLElement>;
      abbr: HTMLAttributes<HTMLElement>;
      ruby: HTMLAttributes<HTMLElement>;
      rt: HTMLAttributes<HTMLElement>;
      rp: HTMLAttributes<HTMLElement>;
      data: HTMLAttributes<HTMLDataElement>;
      time: TimeHTMLAttributes<HTMLTimeElement>;
      code: HTMLAttributes<HTMLElement>;
      var: HTMLAttributes<HTMLElement>;
      samp: HTMLAttributes<HTMLElement>;
      kbd: HTMLAttributes<HTMLElement>;
      sub: HTMLAttributes<HTMLElement>;
      sup: HTMLAttributes<HTMLElement>;
      i: HTMLAttributes<HTMLElement>;
      b: HTMLAttributes<HTMLElement>;
      u: HTMLAttributes<HTMLElement>;
      mark: HTMLAttributes<HTMLElement>;
      bdi: HTMLAttributes<HTMLElement>;
      bdo: HTMLAttributes<HTMLElement>;
      span: HTMLAttributes<HTMLSpanElement>;
      br: HTMLAttributes<HTMLBRElement>;
      wbr: HTMLAttributes<HTMLElement>;
      ins: HTMLAttributes<HTMLModElement>;
      del: HTMLAttributes<HTMLModElement>;

      // Embedded
      picture: HTMLAttributes<HTMLPictureElement>;
      source: SourceHTMLAttributes<HTMLSourceElement>;
      img: ImgHTMLAttributes<HTMLImageElement>;
      iframe: IframeHTMLAttributes<HTMLIFrameElement>;
      embed: EmbedHTMLAttributes<HTMLEmbedElement>;
      object: ObjectHTMLAttributes<HTMLObjectElement>;
      param: ParamHTMLAttributes<HTMLParamElement>;
      video: VideoHTMLAttributes<HTMLVideoElement>;
      audio: AudioHTMLAttributes<HTMLAudioElement>;
      track: HTMLAttributes<HTMLTrackElement>;
      map: HTMLAttributes<HTMLMapElement>;
      area: HTMLAttributes<HTMLAreaElement>;

      // Tabular
      table: TableHTMLAttributes<HTMLTableElement>;
      caption: HTMLAttributes<HTMLTableCaptionElement>;
      colgroup: ColHTMLAttributes<HTMLTableColElement>;
      col: ColHTMLAttributes<HTMLTableColElement>;
      tbody: HTMLAttributes<HTMLTableSectionElement>;
      thead: HTMLAttributes<HTMLTableSectionElement>;
      tfoot: HTMLAttributes<HTMLTableSectionElement>;
      tr: HTMLAttributes<HTMLTableRowElement>;
      td: TdHTMLAttributes<HTMLTableCellElement>;
      th: ThHTMLAttributes<HTMLTableCellElement>;

      // Forms
      form: FormHTMLAttributes<HTMLFormElement>;
      label: LabelHTMLAttributes<HTMLLabelElement>;
      input: InputHTMLAttributes<HTMLInputElement>;
      button: ButtonHTMLAttributes<HTMLButtonElement>;
      select: SelectHTMLAttributes<HTMLSelectElement>;
      datalist: HTMLAttributes<HTMLDataListElement>;
      optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;
      option: OptionHTMLAttributes<HTMLOptionElement>;
      textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
      output: OutputHTMLAttributes<HTMLOutputElement>;
      progress: ProgressHTMLAttributes<HTMLProgressElement>;
      meter: MeterHTMLAttributes<HTMLMeterElement>;
      fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;
      legend: HTMLAttributes<HTMLLegendElement>;

      // Interactive
      details: DetailsHTMLAttributes<HTMLDetailsElement>;
      summary: HTMLAttributes<HTMLElement>;
      dialog: DialogHTMLAttributes<HTMLDialogElement>;

      // Scripting
      script: ScriptHTMLAttributes<HTMLScriptElement>;
      noscript: HTMLAttributes<HTMLElement>;
      template: HTMLAttributes<HTMLTemplateElement>;
      slot: HTMLAttributes<HTMLSlotElement>;
      canvas: CanvasHTMLAttributes<HTMLCanvasElement>;

      // SVG (broad permissive entry)
      svg: SVGAttributes<SVGSVGElement>;
      circle: SVGAttributes<SVGCircleElement>;
      rect: SVGAttributes<SVGRectElement>;
      line: SVGAttributes<SVGLineElement>;
      path: SVGAttributes<SVGPathElement>;
      polygon: SVGAttributes<SVGPolygonElement>;
      polyline: SVGAttributes<SVGPolylineElement>;
      ellipse: SVGAttributes<SVGEllipseElement>;
      g: SVGAttributes<SVGGElement>;
      defs: SVGAttributes<SVGDefsElement>;
      use: SVGAttributes<SVGUseElement>;
      text: SVGAttributes<SVGTextElement>;
      tspan: SVGAttributes<SVGTSpanElement>;
      textPath: SVGAttributes<SVGTextPathElement>;
      mask: SVGAttributes<SVGMaskElement>;
      clipPath: SVGAttributes<SVGClipPathElement>;
      linearGradient: SVGAttributes<SVGLinearGradientElement>;
      radialGradient: SVGAttributes<SVGRadialGradientElement>;
      stop: SVGAttributes<SVGStopElement>;
      filter: SVGAttributes<SVGFilterElement>;
      foreignObject: SVGAttributes<SVGForeignObjectElement>;
      image: SVGAttributes<SVGImageElement>;
      marker: SVGAttributes<SVGMarkerElement>;
      pattern: SVGAttributes<SVGPatternElement>;
      symbol: SVGAttributes<SVGSymbolElement>;
      view: SVGAttributes<SVGViewElement>;

      // Custom elements: anything with a hyphen
      [tagName: string]: HTMLAttributes<HTMLElement>;
    }
  }
}

export {};
