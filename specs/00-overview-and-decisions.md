# 00 — Overview & Decision Log

## Vision

LGLite gives React developers the full shadcn component surface, restyled with Apple's Liquid Glass material, installable from npm. One DRY glass engine powers every component. Consumers customize via props, CSS variables, and `className` — never by forking source.

## The governing constraint

Apple's Liquid Glass does live **refraction** (bending the backdrop at the edges). On the web that requires `backdrop-filter: url(#svgFilter)` with `feDisplacementMap`, which is **Chromium-only**. Therefore LGLite is **progressive enhancement**:

```
Layer 0  Accessible solid fallback  — prefers-contrast / forced-colors / contrast="aa"
Layer 1  CSS glass base (ALL browsers) — backdrop blur+saturate, tint, rim border, inner shadow, noise
Layer 2  Refraction (Chromium only)  — SVG feTurbulence→feDisplacementMap preset, + optional aberration
```

Layer 1 is engineered to look excellent **on its own**, because Safari (the spiritual target) only ever sees Layer 1.

## "What great looks like" (acceptance criteria)

1. Contrast: `contrast="aa"` mode passes 4.5:1 over **both** black and white backdrops in CI. Default (glass) mode is allowed to warn, not fail.
2. `axe` zero violations for every component in: default, `prefers-contrast: more`, `forced-colors`.
3. Zero hydration flash — server HTML is visually correct with no JS.
4. Any component restyleable via CSS vars without ejecting.
5. Tree-shakeable JS **and** CSS; SSR/RSC-safe; ≤ ~4 kb gz JS per component.
6. Liquid look passes a named human design review vs a reference target (pixel-diff cannot judge "Apple-grade").

## Quality bar / reference examples

- **DX & API shape bar:** shadcn/ui (Radix + cva + `cn` + `asChild`).
- **Glass technique bar:** rdev/liquid-glass-react (most complete React props), rizroze/liquid-glass (cleanest no-WebGL fallback architecture).
- **A11y bar:** Radix UI primitives' own a11y + WCAG 2.2 AA.

## Phase map

| Phase | Deliverable | Exit gate |
|-------|-------------|-----------|
| **0 — Engine spike** | `glass-core` + Button, Card, Dialog. Prove: contrast contract, Chromium **edge-lensing** refraction (REQUIRED — not frosted turbulence; see [02 §2.4]), the `LensEngine` abstraction ([12], `css` engine only), asChild+layer resolution. | Criteria 1–3 met; **edge-lensing refraction is a hard exit requirement** — the rim must visibly bend/displace the backdrop (design-reviewed in Chromium), not uniformly frost it. Separately, Layer-1 fallback must be independently judged Apple-grade so Safari isn't second-class. (Edge lensing only ever renders on Chromium — Safari/Firefox physically can't, per D1; that's a platform limit, not a deferral.) |
| **1 — Core showcase** | Input, Switch, Slider, Popover, Tooltip, Tabs, DropdownMenu, Badge. Storybook stressor, visual regression baselines, full a11y matrix. | All Phase-1 components pass a11y matrix + visual baselines. |
| **2 — Physics capstone** | Dock (pointer magnification + springs), Navbar/Toolbar, opt-in chromatic aberration, **`@lglite/webgl` opt-in lens engine** ([12]). | Dock holds 60fps within perf budget; aberration gated; WebGL lenses a supplied source cross-browser incl. Safari and slots in without touching component code. |
| **3 — Full surface + docs** | Remaining ~50 shadcn components in batches; public docs site; theming presets. | Parity with shadcn surface; docs live. |

## Decision log (ADR-style)

See the table in [../CLAUDE.md](../CLAUDE.md#locked-decisions-do-not-re-litigate-without-asking). Each decision below also notes what it *rejected*.

- **D1 Progressive enhancement** — rejected: single WebGL renderer (heavy, SSR/a11y pain) and pure-CSS-only (no refraction at all).
- **D4 Glass-first + AA-in-one-line** — rejected: always-on text-plate default (less see-through) and dropping the AA claim (abandons requirement). Trade-off accepted: default components may fail 1.4.3 over busy backdrops; `contrast="aa"` resolves it globally.
- **D5 Preset distortion** — rejected: free per-instance distortion (ID explosion, canvas-per-instance resize storm, two-sources-of-truth). Trade-off accepted: you cannot get a unique distortion per element.
- **D6 Pre-paint gate script** — rejected: `@supports` gate (lies on Safari) and mount-time enhancement (FOUC).

## Glossary

- **Surface** — any element wearing the glass material via `.lg-surface` / `glassSurface()`.
- **Plate** — an opaque inner layer guaranteeing text contrast (`<GlassText>`, `plate` prop, or `contrast="aa"`).
- **Preset** — one of `subtle` / `medium` / `strong`; selects blur + which SVG distortion filter applies.
- **Gate** — the `data-lg-refraction` attribute set by the pre-paint script that enables Layer 2.

## Open items to resolve during Phase 0

- Final exact hexes + measured ratios for the plate/fg/fg-muted/tone token table ([03 §3.4]).
- Whether `contain: layout paint` is safe per-surface given focus-halo overflow (likely excluded on focusable surfaces; note `overflow: clip` is already on `.lg-surface` for corner clipping).
- Tune the edge-ramp `feImage` map + per-preset `turb`/`scale` so refraction reads as lensing, not static ([02 §2.4]).

## Spec index

| # | Spec | Concern |
|---|------|---------|
| 00 | this file | vision, criteria, decisions, phases |
| 01 | [repo-structure](01-repo-structure.md) | monorepo, build, exports, CI |
| 02 | [glass-core-engine](02-glass-core-engine.md) | tokens, layers, filters, gate, provider |
| 03 | [contrast-contract](03-contrast-contract.md) | WCAG "AA in one line" + CI test |
| 04 | [component-contract](04-component-contract.md) | the DRY component shape |
| 05–07 | [button](05-component-button.md) · [card](06-component-card.md) · [dialog](07-component-dialog.md) | Phase-0 components |
| 08 | [motion-system](08-motion-system.md) | liquid morph/press/ripple |
| 09 | [testing-strategy](09-testing-strategy.md) | a11y matrix, contrast test, cross-browser |
| 10 | [dock-physics](10-dock-physics.md) | Phase-2 Dock magnification |
| 11 | [review-and-resolutions](11-review-and-resolutions.md) | adversarial-review audit trail |
| 12 | [lens-engines](12-lens-engines.md) | pluggable CSS/WebGL refraction |
| 13 | [design-tokens-reference](13-design-tokens-reference.md) | locked token values + measured ratios |
| 14 | [edge-ramp-displacement-map](14-edge-ramp-displacement-map.md) | the lensing asset (shared by both engines) |
| 15 | [webgl-shader](15-webgl-shader.md) | `@lglite/webgl` GLSL spec |
| 16 | [component-inventory](16-component-inventory.md) | all ~50 components mapped, per-phase |
| 17–24 | [input](17-component-input.md) · [switch](18-component-switch.md) · [slider](19-component-slider.md) · [popover](20-component-popover.md) · [tooltip](21-component-tooltip.md) · [tabs](22-component-tabs.md) · [dropdown-menu](23-component-dropdown-menu.md) · [badge](24-component-badge.md) | Phase-1 component specs |

## Resolved (previously open)

- **Noise delivery:** ship a single ~2KB base64 PNG tile in `noise.css` on `--glass-noise-url`; document the `img-src data:` CSP need; `noise={false}` / `--glass-noise-opacity:0` opt-out for strict CSP ([02 §2.9]).
- **Plate contrast:** opaque `--glass-plate-bg` token + non-zero default `--glass-plate-opacity` (0.82), flips to 1.0 in aa mode ([03 §3.3]).
