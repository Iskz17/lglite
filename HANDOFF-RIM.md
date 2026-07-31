# Handoff: Apple-style refracted bright rim

**Goal:** give LGLite glass surfaces the *Apple Liquid Glass* rim — a thin bright
edge where the **background is refracted/brightened into a colored fringe**,
strongest at the curved ends. NOT a flat white stroke.

This doc is self-contained. Read it fully before touching code. It captures the
target, the current baseline, the long list of approaches that already failed
(so you don't repeat them), the recommended path, the exact files/knobs, and the
**verification method that actually tells the truth** (headless Chrome lies about
`backdrop-filter`).

---

## 1. The target (what "right" looks like)

From the user's reference (iOS Control Center "Focus" pill), confirmed by the user:

1. **The bright rim is the refracted background, not a white border.** The edge
   glows pink where the wallpaper is red, blue where it's blue. It is the
   backdrop **magnified + brightened into a thin fringe** right at the border.
2. **It's strongest at the left/right curved ends** (where the glass "edge" is
   thickest and bends the most light).
3. The **interior stays a clean light frost** — the background is recognizable
   through it, vibrant (not mush). All colour comes from the background; **no
   chromatic aberration** (Apple has none).

So the effect = **clean frosted interior + a narrow, bright, background-coloured
refraction in the last few pixels of the border.** The mistake all day was
spreading displacement across the WHOLE surface (smear). The rim is edge-ONLY.

---

## 2. Current baseline (what's in the repo right now)

We reverted ALL displacement to plain frosted glass. This is a clean, trustworthy
starting point. Builds green. Do NOT rebuild the whole displacement engine — the
rim is a small, contained addition on top of this.

- **`packages/glass-core/src/styles/surface.css`** — `.lg-surface` is now:
  - `backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation))` (the frost)
  - `border: var(--glass-rim-width) solid rgb(var(--glass-rim)/var(--glass-rim-opacity))` (current rim = **flat white border** — this is the thing to replace)
  - `box-shadow: var(--glass-inner-shadow), var(--glass-shadow)` (inner highlight + drop shadow — also flat white)
  - `background: var(--glass-noise-url), rgb(var(--glass-tint)/var(--glass-tint-opacity))` (tint)
  - `overflow: clip`, `border-radius: var(--glass-radius)`
- **`packages/glass-core/src/styles/tokens.css`** — tuned toward Apple already:
  `--glass-tint: 255 255 255` @ `0.1`, `--glass-saturation: 150%`, `--glass-blur: 8px`,
  `--glass-rim: 255 255 255` @ `0.7`, `--glass-rim-width: 1px`,
  `--glass-inner-shadow` = stacked white inset highlights (top/sides/bottom),
  `--glass-shadow: 0 10px 34px rgb(0 0 0/0.22)`.
- **`packages/glass-core/src/glass-filters.tsx`** — now a **no-op** (`return null`).
  This is where an SVG filter `<defs>` would be re-added if the rim needs one. It's
  still rendered once by `GlassProvider`.
- **DELETED:** `glass-lens.tsx` (per-element ResizeObserver hook/registry) and
  `edge-ramp.ts` (displacement map bakers). Index exports for them removed.
- Components (`packages/react/src/components/{card,button,dialog}/*.tsx`) are back
  to simple `ref` forwarding — no lens hook.
- `data-lg-refraction` attribute is still set by the provider + `glass-script.tsx`
  but **nothing reads it anymore** (CSS gate removed). Harmless; reuse it if the
  rim is Chromium-only.
- Single intensity only (`subtle`); medium/strong were removed earlier. cva still
  emits a vestigial `lg-distort-subtle` class (no-op now).

---

## 3. Approaches already tried and REJECTED (do not repeat)

All of these were attempted at length today. They produced smear/asymmetry/artifacts
and were reverted. The lessons matter even for the rim.

1. **Whole-surface SVG displacement via `backdrop-filter: url(#f)`** with
   `feImage` map → `feDisplacementMap`:
   - `primitiveUnits="objectBoundingBox"`: displacement scales per-axis with box
     dimensions → **shorter side bends more** (wide card = top/bottom only). This
     is W3C **fxtf#596**, unsolved in spec, Chromium-specific. And
     **`feDisplacementMap.scale` cannot be a CSS variable** (it's an SVG attribute).
   - `userSpaceOnUse` per-element pixel-sized filter + ResizeObserver + a
     size-bucketed filter pool (what shuding/rdev do): fixed the *magnitude*
     asymmetry. BUT a single shared map stretched onto the box gives **curvature**
     asymmetry (stretched axis bends gently, squeezed axis sharply). Baking a
     **per-element fixed-pixel-band map with smoothstep** fixed the curvature and
     the band-edge seam. Even then the whole-surface result read as a heavy smear,
     not clean Apple glass → user rejected. Reverted.
2. **feTurbulence** for whole-surface "coverage" + edge ramp: organic ripple.
   Rejected — not Apple-clean.
3. **Chromatic aberration** (3-pass RGB split): rejected — Apple takes ALL colour
   from the background, no prismatic fringe.
4. **Radial / squircle / separable** displacement maps: a radial lens is
   mathematically **neutral at the centre** (can't refract the middle), and the
   separable map's bands behaved per-aspect. All produced artifacts.

### Hard gotchas learned (these will bite the rim work too)

- **HEADLESS Chrome LIES about `backdrop-filter`.** `chrome --headless --screenshot`
  rendered displacement that real GPU Chrome did NOT. **You must verify against
  real Chrome via the DevTools Protocol** (see §5). This single fact caused hours
  of false "it works."
- **`backdrop-filter` on a `z-index:-1` ::before does not work** — the pseudo
  gets an empty/wrong backdrop (it's a stacking/backdrop-root issue). The material
  MUST be on the element itself, or on a properly-stacked (non-negative-z) layer
  that still sits behind content. (spec 14 §14.6.)
- **An ancestor with `transform`/`filter`/`opacity<1`/`contain`/`will-change`/
  `isolation` kills a descendant's `backdrop-filter`** (creates a backdrop root →
  empty backdrop). The storybook moving photo uses a `transform`-animated `::before`
  layer that is a *sibling* of the stage, NOT an ancestor of the glass, for this
  reason (see `apps/storybook/.storybook/backdrops.css`).
- **Periodic backdrops (grid/stripes) and smooth/blurred photos HIDE displacement.**
  A grid shifted by ~one cell looks unchanged; a smooth photo has nothing to bend.
  Verify on sharp, non-periodic detail (rings, dense text, the neon photo).
- **Maps memoized in React state froze across edits.** If you bake anything,
  compute it during render (cached in a module Map), not in `useState`+`useEffect`,
  or HMR edits won't apply (and you'll think it's "cache" — it is).
- **`plate` (opaque AA surface) hides the glass.** Test the rim with `plate:false`.
- **Heavy `--glass-blur` + any refraction = mush.** Keep blur ≤ ~10px while tuning
  the rim, then raise.

---

## 4. Recommended approach for the RIM (edge-only refraction)

The rim is a *thin* effect, so it avoids most of the whole-surface pain. Ideas,
roughly in order of "try first":

1. **Thin inset refraction ring.** A real child element (NOT a `z-index:-1`
   pseudo) layered as a hairline inset border, with
   `backdrop-filter: brightness(1.6) saturate(2) blur(0.5px)` so the backdrop in
   the last few px is **brightened + saturated → a background-coloured glow**.
   - Watch the nested-backdrop-filter trap: the parent `.lg-surface` already has a
     `backdrop-filter` (the frost). A child's `backdrop-filter` samples the
     *frosted* parent result, not the raw page. May need the ring to live OUTSIDE
     the frosted element (sibling overlay positioned over the same box) so it
     samples the raw backdrop. Prototype both.
   - Use `mask`/`padding-box` vs `border-box` tricks, or a `radial`/`conic`
     `mask` to make the glow **strongest at the curved ends** (left/right), per the
     reference.
2. **Edge-only SVG displacement** (`backdrop-filter: url(#rim)`), scoped to a
   ~6–12px band with a STRONG magnify so the very edge concentrates/brightens the
   background into a fringe. This is the displacement path but narrow — if you go
   here, use **`userSpaceOnUse` + per-element fixed-pixel band + smoothstep** (the
   only version that was geometrically clean) and re-read §3. Chromium-only; reuse
   the `data-lg-refraction` gate.
3. **Look at the real implementations' edge treatment** before inventing:
   - `shuding/liquid-glass` (`liquid-glass.js`) — `userSpaceOnUse`, per-element
     canvas SDF map, pixel scale.
   - `rdev/liquid-glass-react` (`src/index.tsx`) — `useId` per-instance filter,
     pixel `displacementScale`, regenerates on resize.
   Their map is an SDF of a rounded rect; the displacement is the SDF gradient,
   which naturally concentrates at the rounded edges (matches "strongest at the
   curved ends"). This is likely the cleanest source of the exact look.

**Constraints to honour:**
- **D7:** the rim must survive `forced-colors` — keep a real `border` as the
  fallback boundary (a11y.css already neutralizes glass there).
- **D1:** live-backdrop refraction is Chromium-only; non-Chromium gets the CSS
  base (frost + border). Gate any `url()` refraction behind `data-lg-refraction`.
- All colour from the background; **no aberration**.
- Keep the interior clean — rim only.

---

## 5. Verification method (USE THIS — do not trust headless)

Storybook runs at **http://localhost:6006** (`pnpm --filter @lglite/storybook dev`).
Stories: `components-card--basic`, `components-card--plate`, `engine-lensing--default`,
`engine-lensing--sizes`. Backdrop toolbar (top bar) switches:
`photo` (moving neon Tokyo — the real target), `grid`, `stripes`, `rings`, `solid`.
(Backdrop CSS in `apps/storybook/.storybook/backdrops.css`; toolbar in `preview.tsx`.)

**Verify against REAL GPU Chrome via CDP, not `--headless --screenshot`:**

1. Launch real Chrome with remote debugging (separate profile, won't touch the
   user's browser):
   ```
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --remote-debugging-port=9222 --user-data-dir=/tmp/cdpprofile \
     --no-first-run --headless=new "about:blank" &
   ```
   (`--headless=new` here is fine for CDP screenshots — it's the OLD
   `--headless --screenshot` path that lied. CDP `Page.captureScreenshot` against
   this matched real Chrome in our testing.)
2. Helper scripts were left in `/tmp` (may be gone in a fresh session — recreate
   from this spec if so). They use Node's global `WebSocket` (Node ≥ 21):
   - `/tmp/cdpshot.js <url> <out.png> [waitMs]` — navigate + screenshot.
   - `/tmp/cdpinject2.js <url> <out.png> <cssFile> [waitMs]` — navigate, inject a
     `<style>`, screenshot (great for trying CSS without editing files; e.g. inject
     a grid backdrop + low blur to reveal the effect).
   - eval pattern: `Runtime.evaluate` to read computed `backdrop-filter`, sampled
     map pixels, element size, etc.
3. Screenshots are large; downscale with `sips -Z 1000 in.png --out out.png` and
   `sips -c H W --cropOffset Y X` to zoom an edge. The Read tool rejects images
   over ~2000px.
4. **Always check the PHOTO backdrop** (the user's real target) AND a sharp one
   (grid/rings) — the photo hides subtle effects, the grid exposes geometry.
5. Sample the DOM to confirm what's actually applied (computed `backdrop-filter`,
   filter `<defs>` presence, element box) before trusting your eyes.

**Process rule the user cares about:** never claim "it works" from a standalone or
headless shot. Show a real-Chrome screenshot of the actual story over the photo,
and let the user judge. The trust was lost by declaring victory on broken output.

---

## 6. Key files quick-reference

| Concern | File |
|---|---|
| Rim/frost CSS (the thing to change) | `packages/glass-core/src/styles/surface.css` (`.lg-surface`) |
| Rim/blur/saturation/tint tokens | `packages/glass-core/src/styles/tokens.css` |
| SVG filter `<defs>` slot (no-op now) | `packages/glass-core/src/glass-filters.tsx` |
| Chromium gate (unused, reusable) | `glass-provider.tsx` (`data-lg-refraction`), `glass-script.tsx` |
| Surface recipe (cva) | `packages/glass-core/src/glass-surface.ts` |
| Components | `packages/react/src/components/{card,button,dialog}/*.tsx` |
| a11y / forced-colors / reduce-glass | `packages/glass-core/src/styles/a11y.css` |
| Demos + backdrops | `apps/storybook/src/*.stories.tsx`, `.storybook/backdrops.css`, `preview.tsx` |
| Decisions (D1–D9) | `specs/00-overview-and-decisions.md`, `CLAUDE.md` |
| Displacement history + gotchas | `specs/14-edge-ramp-displacement-map.md` (§14.6, §14.7) |

Build: `pnpm --filter @lglite/glass-core build` then `pnpm --filter @lglite/react build`.
Storybook serves `src` via alias, so CSS/TS edits hot-reload (except: a fresh page
load is needed for anything baked once per load).

---

## 7. Definition of done for the rim

- On the **photo** backdrop, the border of a Card/pill shows a thin, bright,
  **background-coloured** fringe (pink over red areas, blue over blue), clearly
  brighter at the left/right curved ends — matching the iOS reference.
- The interior stays clean frost (background recognizable, vibrant, no smear).
- No double-line/seam artifact; no transparent edges at higher `--glass-blur`.
- Degrades to a plain bright border on non-Chromium / `forced-colors` (D7).
- Verified via real-Chrome CDP screenshot over the photo AND a sharp backdrop,
  and shown to the user before claiming success.
