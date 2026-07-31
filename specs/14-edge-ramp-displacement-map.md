# 14 — The Edge-Ramp Displacement Map

This is the make-or-break asset for edge lensing ([00] Phase-0 hard gate). It is shared by **both** lens engines: the CSS engine feeds it to `feImage`, the WebGL engine uploads it as a uniform texture — so a `css` and a `webgl` surface lens identically.

## 14.1 What it encodes

A displacement map is an image whose **R/G channels encode per-pixel offset vectors**:

```
R = 128 + Δx · 127      // Δx ∈ [-1, 1]
G = 128 + Δy · 127      // Δy ∈ [-1, 1]
B = 128                 // unused (neutral)
```

`feDisplacementMap`/the shader then shifts each backdrop pixel by `scale · (channel − 0.5)`. **Neutral = (128,128)** = no shift.

For a *lens* (not uniform frost) the field must be:
- **(128,128) across the interior** → center looks straight-through.
- **ramped only near the edges**, offset pointing **outward along the local normal** (left edge → −x, right → +x, top → −y, bottom → +y; corners diagonal).

## 14.2 Generation — BUILD-TIME canvas bake (recommended)

The earlier "no canvas in Phase 0" rule was about *runtime per-instance* canvas (resize storms). A **build-time** bake has none of that cost — it authors one static PNG shipped in `glass-core`. This produces a far better map than hand-authored SVG gradients.

```ts
// scripts/bake-edge-map.ts — run at build, outputs a static PNG (e.g. 256×256) + data-URI
function bakeEdgeMap(size = 256, band = 0.18, falloff = 3.5, amp = 1) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const ctx = c.getContext("2d")!; const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    // normalized coords in [-1, 1]
    const u = (x / (size - 1)) * 2 - 1;
    const v = (y / (size - 1)) * 2 - 1;
    // edge proximity per axis: ~0 in interior, →1 at the rim (band controls width)
    const ex = Math.pow(Math.min(1, Math.max(0, (Math.abs(u) - (1 - band)) / band)), falloff);
    const ey = Math.pow(Math.min(1, Math.max(0, (Math.abs(v) - (1 - band)) / band)), falloff);
    // outward normal offsets
    const dx = Math.sign(u) * ex * amp;
    const dy = Math.sign(v) * ey * amp;
    const i = (y * size + x) * 4;
    img.data[i]     = Math.round(128 + dx * 127);  // R
    img.data[i + 1] = Math.round(128 + dy * 127);  // G
    img.data[i + 2] = 128;                          // B
    img.data[i + 3] = 255;                          // A
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}
```

- `band` = edge-band width (fraction of half-dimension). `falloff` = how sharply the ramp concentrates at the very rim (higher = tighter lens). `amp` = max offset.
- Stretched to any surface via `preserveAspectRatio="none"` (CSS) / UV sampling (WebGL). Because the ramp is edge-relative, modest non-uniform stretch still reads correctly.
- **Rounded corners:** for tighter fidelity, multiply offsets by a rounded-rect SDF mask so corners follow `--glass-radius`. v1 can ship the axis-aligned version (corners still get diagonal offset) and add the SDF mask if the design review wants crisper corners.

## 14.3 Sign convention (tune during the grid-bow review)

Whether outward offset makes the backdrop appear to **bulge** (convex lens) or **pinch** (concave) depends on the sign of `scale` and the offset direction. Lock it against the **grid-bow story** ([02 §2.4.1]): gridlines should bow *outward* near the rim like looking through a thick glass edge. Flip `amp` sign or `scale` sign if it pinches.

## 14.4 Why one asset, two engines

- **CSS engine:** `EDGE_RAMP` data-URI → `<feImage href={EDGE_RAMP}>` ([02 §2.4]).
- **WebGL engine:** same PNG uploaded as `uMap` sampler ([15]).
Keeping a single baked asset guarantees the `css` (Chromium-live) and `webgl` (cross-browser, supplied-source) paths produce a matching lens, so a surface looks the same whichever engine renders it.

## 14.4b FIELD-VERIFIED: the feImage gotchas that actually matter (Phase 0)

Proved empirically in Chrome (headless probes). `backdrop-filter: url()` displacement works, but `feImage` is fragile — get these EXACTLY right or you get zero displacement (looks like the lensing is "broken"):

1. **`feImage` sizing must NOT use `width="100%"`.** The `<svg>` holding the defs is `0×0`, so `100%` resolves to zero → the map renders at zero size → `feDisplacementMap` displaces by nothing. **Fix:** set the filter `primitiveUnits="objectBoundingBox"` and the feImage to `x="0" y="0" width="1" height="1"` (1 = 100% of the element box). This fills ANY element size from a single shared filter — no per-element px sizing, no resize problem.
2. **With `objectBoundingBox`, `feDisplacementMap.scale` is in bbox FRACTIONS (0..1), not pixels.** Working presets: subtle `0.05`, medium `0.09`, strong `0.15`. (Pixel-scale values like 30–200 are wrong here.)
3. **Filter-chain ORDER:** apply `url(#filter)` displacement FIRST, then a light `blur()` + `saturate()` — `backdrop-filter: url(#x) blur(7px) saturate(180%)`. If blur comes first, it softens the backdrop before displacement and the rim lensing is washed out (invisible).
4. **Use a PNG data-URI** (canvas `toDataURL`) for the map; SVG-data-URI feImages are flaky as displacement sources.
5. Refractive surfaces use LIGHTER blur than the frost fallback (subtle 4 / medium 7 / strong 11 px) so the lensing reads.

These are implemented in [glass-filters.tsx](../packages/glass-core/src/glass-filters.tsx) and [surface.css](../packages/glass-core/src/styles/surface.css).

## 14.4c FIELD-VERIFIED: whole-surface lens + aberration + the test-backdrop trap

After live tuning, two more lessons that matter as much as the sizing fix:

- **The map must be a WHOLE-SURFACE lens, not an edge-only ramp.** A neutral-centre/edge-only band leaves the middle undistorted (looks weak/"nothing"). Use a radial field that grows from centre to edge: `offset = (sign(u)·|u|^power, sign(v)·|v|^power)`, `power ≈ 0.85`. The whole container refracts, strongest at the rim. (See [edge-ramp.ts](../packages/glass-core/src/edge-ramp.ts).)
- **NO chromatic aberration by default — Apple's Liquid Glass has none.** Verified against a real iOS screenshot: ALL colour comes from the background refracted through the frosted glass; there is no prismatic/rainbow fringe. The default filter is a SINGLE displacement pass (no `feColorMatrix`/`feBlend`). Verified clean presets: scale `0.12/0.20/0.30`, light blur `3/5/7`px. Chromatic aberration remains an OPT-IN extra (the `aberration` prop, [spec 12]) for non-Apple/stylised looks — 3 staggered-scale passes recombined with `feBlend mode="screen"` — but it is OFF by default. (See [glass-filters.tsx](../packages/glass-core/src/glass-filters.tsx).)
- **THE TEST-BACKDROP TRAP (cost hours):** you cannot judge displacement strength over a **periodic** backdrop (grid/stripes — a shift of ~one period looks unchanged) OR a **smooth gradient** (no features to displace). Both make a strong effect look like "nothing." **Always evaluate over sharp, non-periodic detail** — concentric rings, text, or a detailed photo. Storybook defaults the backdrop to `rings` for this reason.

## 14.6 ROOT CAUSE (cost the most): material must be on the ELEMENT, not a `z-index:-1` ::before

Symptom: in real GPU Chrome the glass rendered **nothing** — no blur, no lensing — even though the computed `backdrop-filter` was correct (`url(#…) blur() saturate()`), the gate was on, the filter + map existed, and the *identical structure standalone* worked. Headless screenshots rendered it, masking the bug.

Diagnosis (via Chrome DevTools Protocol against real GPU Chrome — `Page.captureScreenshot` + `Runtime.evaluate`, NOT headless): the material was on `.lg-surface::before { position:absolute; z-index:-1 }`. A **negative-z pseudo-element cannot carry `backdrop-filter` over an ANCESTOR's background**:
- If the surface forms a stacking/backdrop root (e.g. `isolation:isolate`), the pseudo's backdrop is **empty** (it can only sample inside the surface) → filter paints nothing.
- If it does NOT, the `z-index:-1` pseudo **escapes behind the ancestor** that paints the backdrop → it filters the wrong thing (the page, not the rings) → nothing visible over the backdrop.

It only worked in the isolated diag because that backdrop was a `position:fixed; z-index:-5` layer behind everything.

Fix: put `backdrop-filter` (frost + `url()` displacement) **on `.lg-surface` itself**; tint/noise become element `background`, rim becomes element `box-shadow`. An element's own `backdrop-filter` samples its true ancestor backdrop. Verified working in real Chrome via CDP. The a11y "reduce glass" overrides ([a11y.css](../packages/glass-core/src/styles/a11y.css)) must therefore disable `backdrop-filter` on `.lg-surface`, not the (now gone) pseudo.

**Verification rule:** never trust headless for `backdrop-filter` — capture real GPU Chrome via CDP. A periodic/smooth backdrop also hides displacement (§14.4c); use rings/stripes.

## 14.7 Aspect-independent rim: per-element pixel-sized filter (revises D5)

Symptom: with one shared `primitiveUnits="objectBoundingBox"` filter, the rim bends the SHORTER side more — a wide card lenses top/bottom but barely left/right; square is symmetric; tall flips it.

Root cause (confirmed, W3C [fxtf#596](https://github.com/w3c/fxtf-drafts/issues/596)): under objectBoundingBox, feDisplacementMap `scale` resolves per-axis — x-displacement ∝ box **width**, y ∝ box **height**. Each axis bends by a fixed fraction of its OWN dimension, so the long borders (perpendicular to the short side) bow hard and the short borders barely move. `scale` **cannot** be a CSS var, so a single static filter can never adapt to aspect. (Chromium-specific, but refraction is Chromium-only anyway.)

Fix (what rdev/liquid-glass-react & shuding/liquid-glass do): size the filter in **pixels** via `filterUnits/primitiveUnits="userSpaceOnUse"` per element, so displacement is equal px on all four sides regardless of aspect. To avoid a filter-per-instance explosion, keep a **pool keyed on the element's size quantized to 8px** — N cards at 3 sizes = 3 filters. ResizeObserver + rAF coalesces resizes; the shared baked map ([edge-ramp.ts](../packages/glass-core/src/edge-ramp.ts)) is reused by every bucket's `feImage`. See [glass-lens.tsx](../packages/glass-core/src/glass-lens.tsx) (registry + `useLensSurface`), [glass-filters.tsx](../packages/glass-core/src/glass-filters.tsx) (the pool). Surfaces set `--lg-lens: url(#lg-lens-WxH)` inline; CSS reads `backdrop-filter: var(--lg-lens, ) blur() saturate()`.

**This revises D5**: distortion strength/shape is still preset-level (one map, two tunables `LENS_SCALE_PX` + map `power`), but the filter is a bounded per-size POOL, not a single shared node. The "ID explosion / resize storm" D5 feared is neutralized by the quantized cache + rAF coalescing.

## 14.5 Validation (Phase-0 gate)

1. Grid-bow story: lines bow at rim, straight in center (lens, not frost). ✅ required.
2. Three presets visibly differ in lens strength (scale 30/55/90).
3. The same surface with `lens="css"` (Chromium) and `lens="webgl"` (with a screenshot source) look equivalent.
