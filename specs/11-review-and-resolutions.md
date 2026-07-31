# 11 — Adversarial Review & Resolutions

The spec set was reviewed by a second AI (global directive #3). 15 defects found; resolutions below. Fixed items are reflected in the referenced specs.

| # | Sev | Defect | Resolution | Where |
|---|-----|--------|------------|-------|
| 1 | P0 | `.lg-plate` default-mode bg was `calc(0.0+0.0)` → **transparent no-op**; `plate`/`<GlassText>` did nothing in default mode. | Real `--glass-plate-opacity: 0.82` default (→1.0 in aa); plate bg uses opaque `--glass-plate-bg`, not `--glass-tint`. | [03 §3.3], [02 §2.1] |
| 2 | P0 | `--lg-plate-bg` referenced but never defined; broke `--glass-*` naming contract. | Defined `--glass-plate-bg` (light/dark) in `tokens.css`. | [02 §2.1] |
| 3 | P0 | Plate "guaranteed readable" never tested in default mode (only aa). | Contrast-contract test now HARD-fails for `plate`/`<GlassText>` in **default** mode too. | [03 §3.6] |
| 4 | P1 | Muted text (`--glass-fg` @0.72) asserted AA, untested; alpha-over-plate unpredictable. | Added solid `--glass-fg-muted` token + verified pairs in §3.4 table; sampled in CI. | [02 §2.1], [03 §3.4] |
| 5 | P1 | `useGlass()` had no default context → throws when used without a provider (npm-import model). | `createContext` default `{ intensity: undefined, contrast: "default" }`. | [02 §2.7] |
| 6 | P1 | `--lg-noise-url` undefined + CSP note contradicted the base64 plan. | Renamed `--glass-noise-url`, shipped tile in `noise.css`, CSP note corrected, `noise={false}` opt-out. | [02 §2.1, §2.9] |
| 7 | P1 | `[class^="lg-"]` reduced-motion selector nuked ALL transitions incl. allowed color/opacity, with `!important`. | Scoped to `animation` + decorative transforms; keep color/opacity transitions. | [08 §8.3] |
| 8 | P1 | tsup `banner: "use client"` leaks client boundary onto server-safe files. | Removed banner; per-file directive + `esbuild-plugin-preserve-directives`. | [01] |
| 9 | P2 | `GlassProvider` hard-wraps app in a `<div>` → breaks 100vh/grid layouts. | `display:contents` default + `asChild`/`as`; recommend attrs on `<html>`/`<body>`. | [02 §2.7] |
| 10 | P2 | `.lg-surface` had no `overflow` → pseudo-element tint/noise bleeds past rounded corners. | Added `overflow: clip`. | [02 §2.2] |
| 11 | P2 | `feTurbulence`-only refraction = uniform frosted static, **not** Apple edge-lensing; Phase-0 gate at risk. | Switched to **edge-biased `feImage` map** + low turbulence; documented map construction + grid-bow validation; edge lensing made a HARD Phase-0 requirement (user-confirmed). | [02 §2.4, §2.4.1], [00] |
| 12 | P2 | UA-sniff gate brittle; could enable refraction on mobile Chromium (over budget). | Excluded mobile; added optional post-paint feature probe that removes the attr if `backdrop-filter` lacks `url(`. | [02 §2.5] |
| 13 | P2 | `a11y.css` in same layer as `surface.css` → override decided by file concat order, not cascade. | Nested sub-layer `lglite.surface.a11y`; declare full `@layer` order up front. | [02 §2.3], [01] |
| 14 | P2 | "CSS-only AA path" claimed but never written; only JS path existed (breaks no-JS criterion). | Specified per-component `[data-lg-contrast="aa"] .slot {…}` CSS rules as the source of truth. | [03 §3.3] |
| 15 | P2 | Stories/tests don't mount `<GlassFilters/>` or set the gate → refraction baselines blank. | Required Storybook global decorator + test setup that mount filters and set the gate per browser. | [09 §9.6b] |

## Still deferred (intentionally, tracked)

- Chromatic aberration: Phase 2, opt-in, perf-gated ([10], [02 §2.4.1]).
- Canvas "precision" displacement map: Phase 2, hero-only ([10]).
- Exact token hexes + regenerated ratio table: Phase-0 task ([00] open items, [03 §3.4]).
- Edge-ramp map tuning (band width, curve, scale, turb blend): Phase-0 design review ([02 §2.4.1]).

## Process note

Before Phase-0 coding begins, re-run a focused review on the two highest-risk implementables: (a) the edge-ramp displacement map actually lensing (grid-bow story), and (b) the contrast-contract test failing correctly on a deliberately-broken plate. These are the two places the spec is most likely to be wrong in practice.
