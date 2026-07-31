# 12 — Pluggable Lens Engines (CSS default, WebGL opt-in)

Decision **D9**: the refraction renderer is an **abstraction with two implementations**. Default is the CSS/SVG path; WebGL is an opt-in engine the consumer enables per-surface when they have an *owned* backdrop (video/image/static scene). This is why we don't have to choose between "Gaussian" and "WebGL" — both ship; the default is CSS.

## 12.1 Why pluggable

- **CSS engine (default)** lenses the **live backdrop** but only on Chromium; Safari/Firefox get frosted Layer-1. Needs no backdrop source. Correct for arbitrary app content.
- **WebGL engine (opt-in)** lenses a **supplied texture** (image/video/static bg) cross-browser **including Safari/iOS** — but cannot read arbitrary live DOM (no web API exists for that; same wall as every approach). Correct only when the consumer owns what's behind the glass.

Neither can lens arbitrary live DOM on Safari — that's a platform limit, not an engine choice. The engine choice only decides whether you lens *the live backdrop on Chromium* (CSS) or *a supplied source everywhere* (WebGL).

## 12.2 The API

```tsx
// default — CSS engine, no source needed
<Card />
<Card lens="css" />

// opt-in WebGL — requires a source; lenses cross-browser incl. Safari
<Card lens="webgl" lensSource="/hero.mp4" />
<Card lens="webgl" lensSource={videoRef} aberration />
```

- `lens?: "css" | "webgl"` — default `"css"` (also settable globally via `<GlassProvider lens="…">`).
- `lensSource?: string | RefObject<HTMLImageElement | HTMLVideoElement>` — **required** when `lens="webgl"`. If `lens="webgl"` and no source → dev warning + automatic fallback to `"css"` (never silently broken).
- `aberration?: boolean` — chromatic aberration; cheap in WebGL (sample R/G/B at staggered displacement), so WebGL mode can default it on; CSS mode keeps it Phase-2/perf-gated.
- `lensSourceMode?: "contain" | "page-fixed"` — `contain` (default): source is the surface's own media. `page-fixed`: source is a page-level background; the engine offsets UVs by the surface's document position each frame so it stays **true while scrolling** (the scroll-sync, done in-shader).

## 12.3 Packaging — WebGL must NOT bloat the default

`@lglite/webgl` is a **separate, optional package** (criterion #5: the 90% on the CSS default never download a renderer).

- `glass-core` defines the `LensEngine` interface + a registry; it imports **no** WebGL code.
- The default `css` engine lives in `glass-core` (it's just classes + the SVG filters).
- Consumers who want WebGL: `npm i @lglite/webgl` and register it once:
  ```tsx
  import { webglLens } from "@lglite/webgl";
  <GlassProvider lensEngines={{ webgl: webglLens }}>…</GlassProvider>
  ```
  (Or `glass-core` lazy-`import()`s `@lglite/webgl` on first `lens="webgl"` use if it's installed; registration is the explicit, SSR-safe path.)
- If `lens="webgl"` is requested but the engine isn't registered → dev warning + fall back to `css`.

```ts
// glass-core: the contract every engine implements
export interface LensEngine {
  name: string;
  /** Mount the lens behind `el`'s content. Returns a cleanup fn. */
  mount(el: HTMLElement, opts: LensOptions): () => void;
}
export interface LensOptions {
  source?: HTMLImageElement | HTMLVideoElement | string;
  preset: "subtle" | "medium" | "strong";
  aberration?: boolean;
  sourceMode?: "contain" | "page-fixed";
  reducedMotion: boolean;
}
```

The `css` engine's `mount` is a no-op (the effect is pure CSS via `.lg-distort-*` + `data-lg-refraction`). The `webgl` engine's `mount` creates the canvas + render loop.

## 12.4 WebGL engine mechanics (`@lglite/webgl`)

- Insert a `<canvas aria-hidden>` absolutely positioned `inset:0`, `z-index:-1` (same stratum as `.lg-surface::before`), behind the element's content. Content stays normal DOM above it → **no a11y regression** (canvas is decorative).
- **Texture:** image → uploaded once; video → re-uploaded per frame from the playing `<video>` (handles playback).
- **Displacement:** fragment shader displaces UVs using the **same edge-ramp normal field** as the CSS path (passed as a small texture/uniform) so CSS and WebGL surfaces look consistent. Edge-biased = real lensing, not uniform warp ([02 §2.4.1]).
- **Scroll trueness:** `sourceMode:"page-fixed"` → each frame, offset UVs by `getBoundingClientRect()` vs the page so the lensed background tracks the real page-level background while scrolling. `contain` → no offset (media belongs to the surface).
- **Aberration:** sample texture at R/G/B with staggered displacement scale; recombine.
- **SSR:** server renders Layer-1 frost (the `::before`); the canvas mounts on the client after hydration. Zero-JS render is the frost fallback — no FOUC beyond frost→lens, which happens post-paint like the CSS gate.

## 12.5 Performance & a11y (WebGL engine)

- **Pause when offscreen:** `IntersectionObserver` stops the RAF loop when the surface isn't visible (battery/thermal).
- **One context, many surfaces:** prefer a shared WebGL context / texture atlas if multiple `webgl` surfaces exist; cap concurrent live canvases (document the cap, `log`-equivalent warn when exceeded).
- **`prefers-reduced-motion`:** freeze the loop (render one static lensed frame, no animation).
- **`prefers-contrast: more` / `forced-colors` / `reduceGlass`:** hide the canvas entirely, fall back to the solid accessible surface (same gates as [02 §2.3] / [03]). The canvas never carries text or essential content, so removing it is always safe.
- **Context loss:** handle `webglcontextlost`/`restored`; on permanent loss, fall back to `css`/frost.
- **Bundle:** lazy-load shaders; keep `@lglite/webgl` out of the critical path.

## 12.6 What to tell users (docs)

> **Default (CSS):** beautiful frosted glass everywhere; live edge-lensing on Chromium. No setup. Use for glass over normal app content.
>
> **WebGL (opt-in):** install `@lglite/webgl`, pass a `lensSource`. Get edge-lensing **on Safari & iOS too**, plus richer chromatic aberration — but only over media/backgrounds **you supply** (it can't read arbitrary live page content; nothing on the web can, on Safari). Ideal for hero/video/marketing surfaces.

## 12.7 Phasing

- CSS engine + the `LensEngine` abstraction: **Phase 0** (the abstraction is cheap and prevents a later refactor; `css` is the only registered engine).
- `@lglite/webgl` package: **Phase 2** (alongside the Dock/aberration work), since it's opt-in and not on the critical path. The Phase-0 interface must be designed so Phase-2 WebGL slots in without touching component code.
