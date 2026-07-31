# 02 — glass-core Engine Internals

The single source of the glass material. Everything here is consumed by every component.

## 2.1 Token taxonomy (`styles/tokens.css`)

Raw RGB channels so alpha varies independently. Light + dark + `aa` override blocks.

```css
@layer lglite.tokens {
  :root, [data-lg-theme="light"] {
    --glass-tint: 255 255 255;
    --glass-tint-opacity: 0.12;
    --glass-saturation: 180%;
    --glass-blur: 18px;
    --glass-rim: 255 255 255;
    --glass-rim-opacity: 0.55;
    --glass-rim-width: 1px;
    --glass-inner-shadow: inset 0 1px 0 rgb(255 255 255 / 0.25);
    --glass-shadow: 0 8px 32px rgb(0 0 0 / 0.18);
    --glass-noise-opacity: 0.05;
    --glass-noise-url: url("data:image/png;base64,<TILE>"); /* shipped ~2KB tile, see noise.css */
    --glass-radius: 16px;
    /* tone accents (used by tone="primary" etc.) */
    --glass-tone-primary: 10 132 255;       /* apple blue */
    --glass-tone-destructive: 255 69 58;
    /* motion (see 08-motion-system.md) */
    --glass-ease: cubic-bezier(0.32, 0.72, 0, 1);
    --glass-duration: 220ms;
    /* text colors (see 03-contrast-contract.md) */
    --glass-fg: 17 17 19;
    --glass-fg-muted: 90 90 95;             /* SOLID muted color, NOT an alpha of --glass-fg */
    /* plate: opaque-enough scrim so text never relies on the backdrop */
    --glass-plate-bg: 255 255 255;          /* opaque plate background (light) */
    --glass-plate-opacity: 0.82;            /* default-mode scrim alpha (real, non-zero) */
  }
  [data-lg-theme="dark"] {
    --glass-tint: 20 20 22;
    --glass-tint-opacity: 0.55;
    --glass-rim-opacity: 0.30;
    --glass-inner-shadow: inset 0 1px 0 rgb(255 255 255 / 0.10);
    --glass-fg: 245 245 247;
    --glass-fg-muted: 170 170 176;
    --glass-plate-bg: 28 28 30;             /* opaque plate background (dark) */
  }
  /* contrast="aa": opaque plates + AA-safe tokens (see 03) */
  [data-lg-contrast="aa"] {
    --glass-plate-opacity: 1;               /* plates become fully opaque → guaranteed AA */
    --glass-tone-primary: 0 102 204;        /* darkened blue: ~5.1:1 as a text bg */
  }
}
```

**Token contract:** every name above is public API. Renaming/removing = `major` (Changesets). Adding = `minor`. Document in a generated token reference.

## 2.2 The layer stack (`styles/surface.css`)

Mounted **directly on the component element** — no wrapper div, preserving `asChild`'s no-extra-DOM promise. Three painted strata via the element + its two pseudo-elements.

```css
@layer lglite.surface {
  .lg-surface {
    position: relative;
    isolation: isolate;                     /* private stacking context for the layers */
    overflow: clip;                         /* clip ::before tint/blur + ::after noise to the radius (no corner bleed) */
    border-radius: var(--glass-radius);
    border: var(--glass-rim-width) solid rgb(var(--glass-rim) / var(--glass-rim-opacity));
    box-shadow: var(--glass-shadow);
    color: rgb(var(--glass-fg));
    transition: backdrop-filter var(--glass-duration) var(--glass-ease),
                transform var(--glass-duration) var(--glass-ease),
                box-shadow var(--glass-duration) var(--glass-ease);
  }

  /* Layer 1 — glass material (all browsers) */
  .lg-surface::before {
    content: ""; position: absolute; inset: 0; z-index: -1;
    border-radius: inherit;
    background: rgb(var(--glass-tint) / var(--glass-tint-opacity));
    box-shadow: var(--glass-inner-shadow);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  }

  /* noise overlay (above material, below content, inert) */
  .lg-surface::after {
    content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
    border-radius: inherit;
    background: var(--lg-noise-url);
    opacity: var(--glass-noise-opacity);
    mix-blend-mode: overlay;
  }

  /* tone accents */
  .lg-tone-primary    { --glass-tint: var(--glass-tone-primary); --glass-tint-opacity: 0.22; }
  .lg-tone-destructive{ --glass-tint: var(--glass-tone-destructive); --glass-tint-opacity: 0.22; }

  /* intensity presets set blur; the matching distortion filter is gated below */
  .lg-distort-subtle  { --glass-blur: 10px; }
  .lg-distort-medium  { --glass-blur: 18px; }
  .lg-distort-strong  { --glass-blur: 30px; }

  /* Layer 2 — refraction, ONLY when the pre-paint script enabled it */
  [data-lg-refraction="on"] .lg-distort-subtle::before  { backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)) url(#lg-distort-subtle); }
  [data-lg-refraction="on"] .lg-distort-medium::before  { backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)) url(#lg-distort-medium); }
  [data-lg-refraction="on"] .lg-distort-strong::before  { backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)) url(#lg-distort-strong); }
}
```

Note `-webkit-backdrop-filter` is required for Safari to show **Layer 1** at all.

## 2.3 Accessibility gates (`styles/a11y.css`)

The reliable cross-browser levers. `prefers-reduced-transparency` is a Chromium-only bonus. **Lives in a nested sub-layer `lglite.surface.a11y`** so these overrides beat `surface.css` by layer order, not by source-file concatenation order (don't rely on filename ordering — see [01] CSS pipeline).

```css
@layer lglite.surface.a11y {
  @media (prefers-contrast: more), (forced-colors: active) {
    .lg-surface { background: Canvas; color: CanvasText; border-color: CanvasText; box-shadow: none; }
    .lg-surface::before, .lg-surface::after { backdrop-filter: none; -webkit-backdrop-filter: none; background: Canvas; box-shadow: none; }
  }
  @media (prefers-reduced-transparency: reduce) {
    .lg-surface { --glass-tint-opacity: 0.92; }
    .lg-surface::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lg-surface { transition: none; }
  }
  /* manual escape hatch for Safari users (prefers-reduced-transparency can't reach them) */
  [data-lg-reduce-glass="true"] .lg-surface::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
  [data-lg-reduce-glass="true"] .lg-surface { --glass-tint-opacity: 0.92; }
}
```

The rim uses `border` (not box-shadow) precisely so it survives `forced-colors` — verified fact. In forced-colors the surface collapses to a flat system-colored, bordered box (the desired accessible outcome).

## 2.4 `<GlassFilters/>` (`glass-filters.tsx`)

Rendered **once** near the app root. Three fixed-ID presets.

**Critical: `feTurbulence` alone is wrong.** Driving `feDisplacementMap` purely from fractal noise warps the *entire* backdrop uniformly → "frosted TV-static," not Apple's edge-concentrated lensing (which is ~zero in the center and steep at the rim). Real glass needs an **edge-biased displacement map**. The map must be near-neutral (0.5,0.5) in the middle and ramp toward the edges.

Phase-0 solution that stays static/SSR-safe (no canvas, no resize): compose a **fixed `feImage` of an edge-ramp gradient** (a small inline SVG/data-URI radial or border gradient encoding offset vectors) blended with a *low-amplitude* `feTurbulence` for organic wobble, then feed the composite into `feDisplacementMap`. The edge gradient gives the lensing; turbulence only adds subtle life. The `feImage`+**canvas** "precision" mode (per-size generated map, sharper) stays deferred to Phase 2 ([10]); Phase 0 uses the fixed edge-ramp asset.

```tsx
// EDGE_RAMP = data-URI of a small SVG whose R/G channels encode an edge-biased
// offset field (neutral 128,128 center → ramped at the rim). Fixed asset, size-independent.
const PRESETS = [
  { id: "lg-distort-subtle", freq: 0.010, turb: 0.4, scale: 30 },
  { id: "lg-distort-medium", freq: 0.012, turb: 0.5, scale: 55 },
  { id: "lg-distort-strong", freq: 0.014, turb: 0.6, scale: 90 },
] as const;

export function GlassFilters({ nonce }: { nonce?: string }) {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {PRESETS.map(({ id, freq, turb, scale }) => (
          <filter key={id} id={id} colorInterpolationFilters="sRGB"
                  x="-20%" y="-20%" width="140%" height="140%">
            {/* edge-biased base map → the actual lensing */}
            <feImage href={EDGE_RAMP} preserveAspectRatio="none" result="edge" />
            {/* low-amplitude turbulence → organic wobble only */}
            <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2}
                          seed={7} result="noise" />
            <feComposite in="noise" in2="edge" operator="arithmetic"
                         k2={turb} k3={1 - turb} result="map" />
            <feGaussianBlur in="map" stdDeviation="1.2" result="smooth" />
            <feDisplacementMap in="SourceGraphic" in2="smooth" scale={scale}
                               xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
```

(`feImage` portability: use a `data:` URI, not `#id` fragment — Chrome doesn't resolve fragment refs in `feImage`. This is the only `data:` in the refraction path; gate it behind the same `img-src data:` CSP note as the noise tile, or accept Chromium-only since refraction is Chromium-only anyway.)

### 2.4.1 Building the EDGE_RAMP displacement map (REQUIRED — this is the lensing)

Edge lensing is a hard requirement ([00] Phase-0 gate). The displacement map encodes **offset vectors**: `R = 128 + Δx·127`, `G = 128 + Δy·127`, `B = 128` (neutral = `128,128`). `feDisplacementMap` then shifts each backdrop pixel by `scale·(channel−0.5)`. To get a *lens* (backdrop bends outward at the rim, ~undisturbed in the center) the map must be:

- **Neutral (`128,128`) across the interior** → center of the glass looks straight-through.
- **Ramped only in a band near the edges**, with the offset vector pointing **outward along the local normal** (left edge pushes −x, right edge +x, top −y, bottom +y; corners diagonal). This is what makes the backdrop appear to curve at the rim like a real bevel.
- Matched to the surface's `border-radius` so the ramp follows rounded corners.

Two ways to produce it (both static, no per-frame work):

1. **Pre-baked SVG gradient map (Phase 0 default).** A rounded-rect with four directional linear gradients (per edge) + corner radials composited so R/G hold the outward-normal offsets, exported as a `data:` URI. `preserveAspectRatio="none"` stretches it to any surface size; because the ramp is edge-relative, modest stretching still reads correctly. One asset per corner-radius bucket (e.g. small/medium/large radius) is plenty.
2. **Canvas-generated map (Phase 2 "precision").** Draw the same field on a `<canvas>` sized to the element via `ResizeObserver` (debounced), `toDataURL()` into `feImage`. Sharper, size-exact, but the per-instance/resize cost is why it's deferred and hero-only ([10]).

**Tuning knobs** (lock during the Phase-0 design review): edge-band width (~8–16% of the smaller dimension), ramp curve (ease so the bend is steep right at the rim), `scale` per preset (30/55/90), and the `turb` blend (keep low — 0.4–0.6 — so turbulence is *wobble*, never the primary distortion). Add **chromatic aberration** later (Phase 2): run the displacement 3× per RGB channel at staggered `scale` and recombine — off by default, perf-gated ([10]).

**Validation:** a Storybook story places the surface over a **straight-line grid backdrop** — correct lensing visibly bows the gridlines near the rim and leaves them straight in the center. Frosted-turbulence (the wrong result) jitters lines uniformly everywhere. This grid story is the design-review oracle for the Phase-0 gate.

`<GlassProvider>` renders `<GlassFilters/>` automatically so consumers don't have to. `nonce` is threaded for CSP.

## 2.5 `<GlassScript/>` — the refraction gate (`glass-script.tsx`)

Inline, blocking, pre-paint. Sets `data-lg-refraction="on"` only on browsers that actually render the effect. SSR renders Layer-1 glass (correct everywhere); this adds Layer 2 before first paint ⇒ no FOUC.

```tsx
const SRC = `(function(){try{
  var ua=navigator.userAgent;
  var d=document.documentElement;
  // gate: desktop Chromium only. Exclude Android WebView AND mobile Chromium (poor backdrop-filter perf).
  var chromium=/Chrome|Chromium|Edg|OPR/.test(ua) && !/Android.*; wv\\)/.test(ua);
  var mobile=/Android|Mobile/.test(ua);
  if(chromium && !mobile){d.setAttribute('data-lg-refraction','on');}
}catch(e){}})();`;

export function GlassScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SRC }} />;
}
```

Sets the attribute on `documentElement` (same node the provider's theme attrs should sit on — see §2.7). Usage: Next.js → `app/layout.tsx` `<html>` / `<head>`. Vite/CRA → render once at root.

**Future-proofing probe (guards against the `@supports`-lies-on-Safari class of bug):** the UA gate is sufficient for the `feTurbulence` presets today, but a future Chromium could ship the UA token without the feature. Ship an optional post-paint probe (runs once, idle) that mounts an offscreen `.lg-surface`, reads its computed `backdrop-filter`, and **removes** `data-lg-refraction` if it doesn't contain `url(`. Cheap, and it self-corrects. Required (not optional) before enabling the Phase-2 canvas-precision path.

## 2.6 `glassSurface()` recipe (`glass-surface.ts`)

```ts
import { cva, type VariantProps } from "class-variance-authority";
export const glassSurface = cva("lg-surface", {
  variants: {
    intensity: { subtle: "lg-distort-subtle", medium: "lg-distort-medium", strong: "lg-distort-strong" },
    tone:      { default: "", primary: "lg-tone-primary", destructive: "lg-tone-destructive" },
  },
  defaultVariants: { intensity: "medium", tone: "default" },
});
export type GlassSurfaceVariants = VariantProps<typeof glassSurface>;
```

## 2.7 `<GlassProvider>` + `useGlass`

Provider only **injects CSS vars** + renders `<GlassFilters/>` — no JS theme state (SSR/RSC-safe, single source of truth).

**Element strategy (do NOT hard-wrap the app in a `<div>`).** A forced wrapper div breaks `height:100%`/`100vh`/grid-root layouts and contradicts §2.2's "no wrapper" ethos. So:
- The **recommended** placement puts `data-lg-theme` / `data-lg-contrast` / `data-lg-reduce-glass` and the CSS-var `style` on `<html>` (Next.js `app/layout.tsx`) or `<body>` — same node as `<GlassScript/>`'s `data-lg-refraction`. In this mode `GlassProvider` is **attribute-less** and only mounts `<GlassFilters/>` + context.
- When a wrapping element is wanted, support `asChild` (Slot, merges attrs onto the consumer's element) or an `as`/`element` prop. Default render uses a `display: contents` wrapper so it adds no layout box.

```tsx
const GlassContext = React.createContext<GlassCtx>({ intensity: undefined, contrast: "default" }); // provider-less usage must not throw

export function GlassProvider({
  theme, contrast = "default", reduceGlass = false,
  intensity, radius, blur, nonce, asChild, children,
}: GlassProviderProps) {
  const style = {
    ...(radius != null && { "--glass-radius": typeof radius === "number" ? `${radius}px` : radius }),
    ...(blur   != null && { "--glass-blur":   typeof blur   === "number" ? `${blur}px`   : blur }),
  } as React.CSSProperties;
  const attrs = {
    "data-lg-theme": theme, "data-lg-contrast": contrast,
    "data-lg-reduce-glass": reduceGlass || undefined, style,
  };
  const Comp = asChild ? Slot : "div";
  return (
    <GlassContext.Provider value={{ intensity, contrast }}>
      {/* style="display:contents" by default → no layout box; override via asChild/as */}
      <Comp {...attrs} style={{ display: "contents", ...style }}>
        <GlassFilters nonce={nonce} />
        {children}
      </Comp>
    </GlassContext.Provider>
  );
}
```

The context **default** (`{ intensity: undefined, contrast: "default" }`) is mandatory because the library is npm-import — components call `useGlass()` and must work with no provider (Layer-1 glass still renders; cva falls back to `intensity: "medium"`). `useGlass()` exposes the provider's `intensity` (or `undefined` → component falls to the cva default) and `contrast`. The CSS selectors `[data-lg-contrast="aa"] …` and `[data-lg-refraction="on"] …` match across the `<html>`→component nesting regardless of where the attributes sit.

## 2.8 `cn()` (`cn.ts`)

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
```

## 2.9 CSP / nonce

The SVG filter defs and `data:` images can trip strict CSP. `nonce` is threaded through `GlassProvider → GlassFilters/GlassScript`. Two CSP touch-points:
- `<GlassScript/>` needs `script-src 'nonce-…'`.
- The **noise tile** (`--glass-noise-url`, a base64 PNG `data:` URL used in a CSS `background`) needs `img-src data:` in browsers that classify CSS background images under `img-src`. To avoid requiring `data:` in CSP at all, the alternative is an inline SVG `feTurbulence`→`feImage` noise filter referenced by `#id` (no `data:`), at a small extra paint cost. **Decision (resolves [00] open item): default ships the base64 tile in `noise.css`; document the `img-src data:` requirement, and offer a `noise={false}` prop / token override (`--glass-noise-opacity: 0`) for strict-CSP apps.** The `feTurbulence` *refraction* presets are procedural and need no `data:`.

## 2.10 Performance rules (enforced — see 09)

- Default blur ≤ 18px; `strong` (30px) reserved for ≤2 large surfaces.
- ≤ ~6 live glass surfaces in viewport (Dock = one composited group).
- `contain: layout paint` per surface **only** where the rim/focus-halo doesn't overflow → excluded on focusable surfaces.
- `will-change: backdrop-filter` toggled in JS transiently on hover/open, reset after.
