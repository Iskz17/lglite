# Handoff — LGLite (rim engine + Phase 0/1 complete)

Supersedes `HANDOFF-RIM.md` (that doc was the rim *task*; the rim now ships).
Read this fully before touching code. It captures what's built, how the glass/rim
engine actually works, the locked decisions, the **verification method (headless
Chrome lies — use real Chrome via CDP)**, the gotchas already paid for, and what's
left.

---

## 0. TL;DR state

- **Phase 0, 1, 2, and 3 components are ALL built** (~50 components), typecheck-green,
  `dist` rebuilt, verified in real Chrome. **Phase 2** = Dock + Navbar. **Phase 3** =
  Overlay (9), Control (5), Flat/Inset + remaining (19), Compositions (4). See §10.
- **Test infra exists now**: Vitest + Testing Library + jest-axe, 14 tests green
  (`pnpm --filter @lglite/react test`). Playwright contrast/visual/size-limit layers
  still TODO (§8). A **final adversarial review** ran; its blockers are fixed (§11).
- **The glass engine got materially extended this session** (radial rim, `--glass-rim-color`
  edge token, opt-in `lens` on controls, `frosted` everywhere, `.lg-no-blur`,
  `--glass-backdrop-extra`, a library-wide `@layer`-order fix, `success` tone, solid-button
  tones, Accordion→Surface). See §10.2 — these change how the engine behaves.

## 0.1 Session update (June–July 2026): storybook feedback sweep + Safari verdict

All items from the user's storybook feedback list are DONE, verified in real Chrome
via CDP, and adversarially reviewed (findings fixed). What changed:

**Engine / component behavior**
- Accent tones are colored-frosted BY DEFAULT: `.lg-tone-primary/destructive/success`
  now carry a dense tint (0.45 light / 0.6 dark; denser still combined with
  `.lg-frosted`, see surface.css). Glass Buttons/Navbar/Badge get it free; Alert
  `destructive|success` default to frosted of their color (alert.tsx).
- Inputs are Liquid Glass by default: Input/InputOTP/Textarea have `lens` + `frosted`
  props, both DEFAULT ON (`lens={false}` opts out). Filters stay pooled by geometry.
- Controls (Switch/Slider/Checkbox/RadioGroupItem/Progress) gained `lens` + `frosted`
  props (default off).
- ⚠️ Cascade gotcha paid for twice: a bespoke control whose base class sets its own
  `backdrop-filter` needs its OWN
  `[data-lg-refraction="on"] .lg-x.lg-lens { …var(--lg-rim-filter,) }` rule INSIDE
  `@layer lglite.components` (the generic `.lg-lens` rule lives in the earlier
  `surface` layer and LOSES the cascade). input.css, input-otp.css and switch.css have
  it; Checkbox/Radio/Progress don't need it (no own backdrop-filter).
- Toast (sonner), two fixes: (1) sonner's own CSS is UNLAYERED so it beat our layered
  glass, fixed with `unstyled: true` in sonner.tsx; (2) sonner exposes no refs, so
  refraction attaches via `attachGlassLens` (new imperative export from glass-lens.tsx)
  plus a MutationObserver on `.lg-toast` nodes.
- Card plate radius: `.lg-surface.lg-plate { border-radius: var(--glass-radius) }`
  (plain `.lg-plate` inherits the parent's radius, i.e. 0).
- Glass added to: Avatar fallback, ScrollArea thumb (`.lg-scroll__thumb`), Resizable
  handle/grip, DataTable wrapper, Carousel (`glass` prop), Calendar (`glass` prop);
  Combobox/DatePicker forward `frosted`/`plate` to their PopoverContent. All new
  bespoke classes registered in a11y.css forced-colors (also fixed previously missed
  `.lg-checkbox/.lg-radio/.lg-progress/.lg-otp__slot`).

**Storybook**
- Root cause of most of the feedback: stories hardcoded their render without spreading
  `{...args}`, so components with full prop support exposed zero controls. Every story
  now spreads args onto the actual glass element (overlays: the *Content* subcomponent)
  and exposes controls via shared `apps/storybook/src/glass-controls.ts`. Radix
  discriminated-union components (Accordion/ToggleGroup) type story args as a narrow
  `GlassArgs` to avoid union widening in `tsc`.

**Explored and fully REVERTED (do NOT redo without reading this)**
- A `@lglite/webgl` lens engine (refract a supplied or auto-captured background via a
  displacement shader) and an SVG feDisplacementMap-on-fixed-bg-copy approach. Both
  rendered in Playwright's WebKit but real Safari was unacceptable (user verdict), and
  neither can track arbitrary/animated live DOM (platform wall, not a bug). All wiring
  removed: no `useLensEngine`, no provider `lensEngines`, no Card lens props, no
  `.lg-lens-gl`. `attachGlassLens` is the one survivor (the toast needs it). lens.ts
  still holds the D9 stub, unchanged.

**Safari verdict (deep research June 2026; recorded in CLAUDE.md facts)**
- There is NO public trigger for native Liquid Glass on web content; the glass people
  see on iOS websites is Safari's own chrome. The private `-apple-visual-effect` is
  WKWebView-only plus App Store rejection. Don't re-research.
- The user raised a WebKit MR fixing #245510 (`backdrop-filter: url(#svg)`). PLAN:
  keep D1 exactly as is; when the fix ships in a Safari release, extend the gate
  (chromium.ts `refractionCapable` + glass-script.tsx) to Safari ≥ that version and
  the existing CSS/SVG path works there unchanged. A temporary UA override letting
  Safari through early was tested and REVERTED: with the unsupported `url()` present,
  stock Safari weakens the whole backdrop-filter. Firefox: plain frost, permanent.

**Verification infra gained:** Playwright WebKit + Firefox browsers installed
(`~/Library/Caches/ms-playwright`), ad-hoc runner in `/tmp/pw`. Real-Chrome CDP (§5)
is still the rule for Chromium claims.

**Next up:** the landing/marketing page (§12.1).

--- Original Phase 0/1 notes below (rim engine internals still accurate) ---

- **Phase 0** (engine + Button/Card/Dialog) and **Phase 1** (Popover, Tooltip,
  DropdownMenu, Tabs, Badge, Switch, Slider, Input) are **built, typecheck-green,
  and verified in real Chrome**. `dist` is rebuilt for both packages.
- The **Apple-style refracted rim** is real and lives on every Surface/Overlay via
  a per-element SVG `feDisplacementMap` lens over `backdrop-filter` (Chromium only).
- A **material scale** exists: glass-first (default) → `frosted` (prop) → `plate`
  (opaque). All three honor the contrast contract.
- A **second-AI adversarial review** was run and its findings fixed (see §7).
- **No automated tests yet** (spec 09 strategy unimplemented) — verification has
  been manual via CDP screenshots + DOM diagnostics.

Build/dev:
```
pnpm --filter @lglite/glass-core build      # tsup → dist
pnpm --filter @lglite/react build
pnpm -r typecheck
pnpm --filter @lglite/storybook dev         # http://localhost:6006 (alias-serves src)
```

---

## 1. What's built (component inventory status)

Treatment column drives whether the rim applies (see §3). Specs in `specs/`.

| Component | Treatment | Rim? | Spec | Files (`packages/react/src/components/…`) |
|---|---|---|---|---|
| Button | Surface | yes (variant=glass) | 05 | `button/` |
| Card | Surface | yes | 06 | `card/` |
| Dialog | Overlay | yes | 07 | `dialog/` |
| Popover | Overlay | yes | 20 | `popover/` |
| Tooltip | Overlay | yes (plate-by-default) | 21 | `tooltip/` |
| DropdownMenu | Overlay | yes | 23 | `dropdown-menu/` |
| Tabs | Surface (list) | yes | 22 | `tabs/` |
| Badge | Surface (small) | via `.lg-surface` (glass variant) | 24 | `badge/` |
| Switch | **Control** | **NO** (perf) | 18 | `switch/` |
| Slider | **Control** | **NO** (perf) | 19 | `slider/` |
| Input | **Inset** | **NO** (perf) | 17 | `input/` |

Everything is exported from `packages/react/src/index.ts` (engine surface re-exported
too, so consumers only import `@lglite/react`). Radix deps installed:
dialog, dropdown-menu, popover, slider, switch, tabs, tooltip, slot.

**Not built:** Phase 2 (Dock spec 10, Navbar) and Phase 3 (~40 components, spec 16.2).
WebGL lens engine (specs 12/15) is only an abstraction stub (`lens.ts`).

---

## 2. How the rim engine works (read before changing it)

The rim = a thin edge-only refraction: the backdrop is displaced (bent) inward at
the border, the band is saturated (colour pop in the background's own colour), the
interior stays clean/frosted. **Edge-only** — never whole-surface (that was the
original failure mode; see §6).

Data flow per glass element:

1. **`edge-ramp.ts` → `bakeRimMap({w,h,radius,band,edgeSpike,edgeSpikeW})`**
   bakes a rounded-rect **SDF-gradient** displacement map to a PNG data URL on a
   `<canvas>`:
   - **R** = X offset, **G** = Y offset = inward edge-normal × a ramp that is 0 in
     the interior and rises to 1 at the border over `band` px (+ a sharp `edgeSpike`
     in the last `edgeSpikeW` px = the thin border line).
   - **B** = band-coverage mask (used by the filter to confine the saturation pop).
   - Module-cached by geometry; `band` is clamped to ≤ half the smallest side so
     tiny controls don't smear. SSR-safe (returns `""` with no `document`).
   - **Constants (current, user-tuned):** `RIM_BAND=13.5`, `RIM_SCALE=100`,
     `RIM_EDGE_SPIKE=1`, `RIM_EDGE_SPIKE_W=1`, `RIM_SATURATE=1.5`
     (`edge-ramp.ts:16-24`). These are the rim tuning knobs.

2. **`glass-lens.tsx` → `useGlassLens()`** returns a ref callback. On attach (only
   when `refractionCapable()` — desktop Chromium):
   - sets `data-lg-refraction="on"` on `<html>` itself (so the rim works even with
     no `<GlassProvider>`);
   - bakes the map, **acquires a pooled `<filter>`** (ref-counted, keyed by
     `WxHxradiusxextraSigma` in a module `Map` → N identical surfaces share ONE
     filter node; verified 4→1);
   - points the element's `backdrop-filter` at it via the `--lg-rim-filter` CSS var;
   - re-bakes on resize via **rAF-coalesced ResizeObserver**.
   - **Measures `offsetWidth/offsetHeight`, NOT `getBoundingClientRect()`** — the
     latter includes the morph-in `scale` transform and bakes a distorted filter
     region (this was the "tooltip renders wrong shape until mouse-move" bug).
   - SVG filter chain: `feImage`(map) → `feDisplacementMap` with **`scale=-RIM_SCALE`
     (negative = sample INWARD; the backdrop only exists inside the box, an outward
     sample just clamps)** → `feGaussianBlur`(extraSigma, the interior) → `feColorMatrix`
     saturate (the band pop) → mask by the map's blue channel → `feMerge`.
   - Also exports `useMergedRefs` and `useGlassSurface(externalRef, enabled=true)`
     (one-call: merges the forwarded ref + lens; `enabled=false` skips the lens but
     keeps hook order — used by non-glass Button variants).

3. **Blur is split** (so the rim band can be sharper than the open interior):
   CSS lays down the **band** blur `var(--glass-rim-blur)`; the filter's
   `feGaussianBlur` adds `extraSigma = √(open² − band²)` to reach the **open** blur
   `var(--glass-blur)`. **Constraint: `--glass-rim-blur` must be ≤ `--glass-blur`.**
   ⚠️ Current tokens have `--glass-blur: 3px` and `--glass-rim-blur: 12px` (rim >
   open), so `extraSigma` floors to 0 → **uniform 12px blur** right now (the user
   set this intentionally). The dual-blur differentiation only appears when
   `rim-blur ≤ blur`.

4. **`chromium.ts`** is the single source of truth for the D1 gate
   (`refractionCapable()` / `chromiumDesktop(ua)` + the regexes). Used by the lens
   and the provider; the pre-paint `glass-script.tsx` interpolates the same regex
   sources (it can't import at runtime).

5. **`surface.css`** (`@layer lglite.surface`):
   - `.lg-surface` — base frost (blur+saturate) + real border + tint, ALL browsers.
   - `[data-lg-refraction="on"] .lg-surface` — adds `var(--lg-rim-filter)`, blur
     becomes the band blur, **border-color → transparent** (the rim is the edge;
     real border kept as the off-Chromium/forced-colors fallback per D7).
   - `.lg-frosted` — denser tint (`--glass-tint-opacity: 0.45`, dark `0.7`).
   - `.lg-plate` — opaque fill; **`[data-lg-refraction] .lg-plate` suppresses
     backdrop-filter** and gives a solid border (a plate is the guaranteed-solid
     surface — no glass on it).
   - shared overlay keyframes `lg-pop-in`/`lg-pop-out` live here (always loaded) so
     Popover/Tooltip/DropdownMenu animations don't depend on bundling order.

6. **`glass-provider.tsx`** reflects `theme`/`contrast`/`reduceGlass` + the
   refraction gate onto `<html>` in an effect (so **portalled overlays inherit the
   right vars** — e.g. `aa`'s opaque plate; without this a portalled plate was stuck
   at 0.82). Restores prior `<html>` attrs on unmount. **Limitation: nested/multiple
   providers with conflicting theme/contrast is last-writer-wins for portals.**

7. **`a11y.css`** is a **TOP-LEVEL layer declared LAST** (`@layer …, lglite.a11y;`
   in `styles/index.css`) — NOT a sub-layer of surface. (As a sub-layer it lost to
   surface's own `[data-lg-refraction]` rule and refraction stayed on under
   forced-colors — real bug, fixed.) It disables glass under `forced-colors`,
   `prefers-contrast: more`, `prefers-reduced-transparency`, and
   `[data-lg-reduce-glass]`, for `.lg-surface` AND the bespoke control classes
   (`.lg-switch`, `.lg-slider__*`, `.lg-input`, `.lg-tabs__*`, `.lg-badge`).

8. **`glass-surface.ts`** — the `glassSurface` cva: `intensity` (only `subtle`
   exists), `tone` (default/primary/destructive), `frosted` (boolean). Every glass
   component composes this + its own class.

---

## 3. The component contract + material scale

- Components mirror shadcn names; glass extras prefixed `Glass*`; classes `lg-*`;
  tokens `--glass-*`. Each component: `forwardRef`, spread `{...props}` to the DOM
  node (className merged LAST via `cn()`), `asChild` via Radix Slot where relevant,
  cva for variants, `useGlass()` for context.
- **Surface/Overlay** call `useGlassSurface(ref)` (rim). **Control/Inset** do NOT —
  they use dedicated `.lg-input`/`.lg-switch`/`.lg-slider` CSS with tint + rim-border
  + inner-shadow + small blur (≤6px), **no rim lens** (perf rule: a form of N inputs
  ≠ N displacement filters). When adding a component, pick the treatment from spec 16.
- **Material scale (opt-in via props):** glass-first (default, `--glass-tint-opacity
  0.1`) → `frosted` (denser Apple material, prop on any glass component) → `plate`
  (opaque, guaranteed contrast; also forced by `contrast="aa"`).
- Accessible-name dev warnings: `useNameWarning(ref, "Name")` (`dev-warn.ts`) is
  wired into Switch/Slider/Input (warns in dev if no aria-label/labelledby/title/
  associated label).

---

## 4. Locked decisions (D1–D9, do not re-litigate without asking)

See `CLAUDE.md` / `specs/00`. Most load-bearing here:
- **D1** live-backdrop refraction is **Chromium-only**; gate every `url()` behind
  `data-lg-refraction`; non-Chromium gets CSS frost + border.
- **D4** glass-first by default; AA is opt-in (`plate` / `contrast="aa"`). The user
  reaffirmed glass-first this session (declined plate-by-default for overlays) but
  added the `frosted` middle option.
- **D5** distortion is preset-level — but the rim map is now **per-element pixel-
  baked** (`userSpaceOnUse`) to avoid the fxtf#596 aspect-asymmetry; this is the
  sanctioned refinement, see spec 14.
- **D7** rim must survive `forced-colors` → keep a real `border`; a11y.css enforces.

---

## 5. ⚠️ Verification method — DO NOT trust headless Chrome

`chrome --headless --screenshot` **renders `backdrop-filter` that real GPU Chrome
does not**. This burned a full prior session. Verify against REAL Chrome via CDP.

Storybook: `http://localhost:6006`, alias-serves `src` (TS/CSS hot-reload). Stories
per component. Backdrop toolbar globals: `photo` (default, the real target — busy
neon night, hides displacement), `rings`/`stripes` (sharp, expose geometry — best
for the rim), `grid`, `solid`. URL form:
`iframe.html?id=components-card--basic&globals=backdrop:rings;contrast:aa`.

Real Chrome CDP (launch once):
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 --user-data-dir=/tmp/cdpprofile \
  --no-first-run --headless=new "about:blank" &
```
(`--headless=new` + CDP `Page.captureScreenshot` matches real GPU Chrome; the OLD
`--headless --screenshot` path is the liar.)

Helper scripts left in `/tmp` (Node ≥21, global `WebSocket`; recreate from here if
gone):
- `/tmp/cdpshot.js <url> <out.png> [waitMs]` — navigate + screenshot (fresh load).
- `/tmp/cdprun.js <url> <out.png> <jsFile> [waitMs] [afterMs]` — eval an in-page JS
  file then screenshot (was used to prototype the rim before touching source).
- `/tmp/diageval.js <url> <jsFile> [waitMs]` — eval + print the returned JSON
  (DOM diagnostics; reads the CDP result correctly).
- `/tmp/a11ycheck.js` / `/tmp/fccheck.js` — `Emulation.setEmulatedMedia` for
  `forced-colors`/`prefers-reduced-transparency`, print computed styles.
Downscale before reading (Read rejects >~2000px): `sips -Z 1000 in.png --out o.png`;
crop/zoom: `sips -c H W --cropOffset Y X in.png --out o.png`. Use `open file.png` to
show the user (the Read tool renders images to the agent, not the user).

**Process rule the user cares about:** never claim "it works" from a headless shot;
show a real-Chrome screenshot over the photo AND a sharp backdrop, and let them judge.

---

## 6. Gotchas already paid for (don't rediscover)

- **Lens must gate on the UA (`refractionCapable()`), not the `data-lg-refraction`
  attribute** — the provider sets that attribute in an effect that runs AFTER the
  ref callback, so the lens saw "off" and never attached. (This silently shipped
  frost-only for a while; the user kept saying "I don't see refraction" — they were
  right.)
- **Measure `offsetWidth/Height`, not `getBoundingClientRect()`** — the rect
  includes the open-animation `scale` transform → distorted filter region → "wrong
  shape until mouse-move".
- **Displacement samples INWARD** (negative `feDisplacementMap` scale). Outward
  samples fall outside the filter region and clamp → no refraction, just a smear.
- **Blur in CSS, not inside the SVG filter** for the base — SVG `feGaussianBlur`
  fades to transparent at the filter-region edge and leaks sharp backdrop at the
  border. CSS native backdrop blur has clean edges.
- **Portalled overlays don't inherit the provider div's attrs** → reflect theme/
  contrast onto `<html>` (done in the provider).
- **a11y layer must be top-level + last** (cascade-layer sub-layer precedence: a
  layer's own rules beat its sub-layers).
- **The map bakes once per page load and is module-cached** → after editing
  `edge-ramp.ts`, do a **full page reload** (a fresh `cdpshot` nav does this);
  HMR alone shows the stale bake.
- **Periodic backdrops (grid/rings) and smooth/dark photos HIDE displacement.**
  Verify geometry on `stripes`; verify colour on `photo`.
- `feDisplacementMap.scale` cannot be a CSS var (SVG attribute); per-instance maps
  need `userSpaceOnUse` + per-element baking (that's what the pool does).
- Rejected earlier (do not retry): whole-surface displacement, chromatic aberration,
  feTurbulence ripple, radial/squircle maps — all produced smear/asymmetry.

---

## 7. Second-AI review — fixed this session (for context)

Verdict was *ship-with-fixes*; all material findings fixed + re-verified:
Tabs orientation-change observer; Slider empty-array thumb clamp (`Math.max(1,…)`);
provider `<html>` cleanup on unmount; `forced-colors` fallbacks for the new bespoke
controls (verified via emulation); Switch thumb real border (1.4.11); accessible-name
dev warnings; shared keyframes moved to glass-core; Tooltip no-interactive-content
doc + exit anim.

**Deferred (note for next agent):**
- Deep **1.4.11 token validation** across themes/backdrops belongs in tests (spec 09
  §contrast). Switch unchecked default-tone over a white backdrop is the weakest pair.
- Slider thumb keys are positional; changing a *controlled* `value`'s length at
  runtime can churn thumb identity. Most libs freeze thumb count at mount — document
  or guard if needed.
- `<Badge variant="glass" tone="success|warning">` falls back to default glass tint
  (glassSurface only knows 3 tones) — solid/outline color correctly. Doc or extend.

---

## 8. What's next (pick up here)

1. **Tests (spec 09)** — none exist. Unit (Radix behaviors), jest-axe across
   default/aa/forced-colors, the contrast-contract test, visual baselines
   (Chromium-refraction vs WebKit-frost). This is the biggest gap for "AA-capable".
2. **Phase 2 — Dock (spec 10, the riskiest item: pointer-distance magnification
   physics) + Navbar/Toolbar.** De-risk Dock in isolation.
3. **WebGL lens engine** (`@lglite/webgl`, specs 12/15) — `lens.ts` has the
   `LensEngine` abstraction + `css` default; the `webgl` impl (lenses a *supplied*
   source, works cross-browser incl. Safari) is unbuilt.
4. **Phase 3** — ~40 more components, batched by treatment (spec 16.4: Overlay batch,
   Control batch, Flat/Inset batch, then compositions).
5. **Docs site.**

---

## 9. Key files quick-reference

| Concern | File |
|---|---|
| Rim map baker + tuning constants | `packages/glass-core/src/edge-ramp.ts` |
| Rim lens hook + filter chain + pool | `packages/glass-core/src/glass-lens.tsx` |
| Chromium gate (D1, single source) | `packages/glass-core/src/chromium.ts` |
| Surface/frosted/plate CSS + keyframes | `packages/glass-core/src/styles/surface.css` |
| Tokens (blur, tint, tones, radius) | `packages/glass-core/src/styles/tokens.css` |
| a11y / forced-colors (layer LAST) | `packages/glass-core/src/styles/a11y.css`, `styles/index.css` |
| Layer order declaration | `packages/glass-core/src/styles/index.css` |
| Provider (portal var reflection) | `packages/glass-core/src/glass-provider.tsx` |
| cva recipe (intensity/tone/frosted) | `packages/glass-core/src/glass-surface.ts` |
| Accessible-name dev warning | `packages/glass-core/src/dev-warn.ts` |
| Engine exports | `packages/glass-core/src/index.ts` |
| Components | `packages/react/src/components/*/` |
| Component exports | `packages/react/src/index.ts` |
| Stories + backdrops | `apps/storybook/src/*.stories.tsx`, `.storybook/{backdrops.css,preview.tsx,main.ts}` |
| Decisions + specs | `CLAUDE.md`, `specs/00-overview-and-decisions.md`, `specs/16-component-inventory.md` |
| graphify knowledge graph | `graphify-out/` (rebuild/`--update` if stale — see CLAUDE.md directive) |

Knobs the user tunes directly: rim shape/strength in `edge-ramp.ts:16-24`; blur +
tint + tones in `tokens.css`. Material per instance: `frosted` / `plate` props.

---

## 10. Phase 2 + Phase 3 (this session) — the full component set

### 10.1 What got built (all typecheck-green, built, rendered in real Chrome)

- **Phase 2:** `Dock` + `DockItem` (spec 10 — pointer magnification, JS spring, roving
  toolbar, real `Tooltip` labels, single glass bar; `itemGlass` opt-in), `Navbar` +
  `NavbarBrand`/`NavbarContent`/`NavbarItem` (glass bar, optional `magnify`).
- **Phase 3 Overlay (9):** AlertDialog, ContextMenu, Sheet, HoverCard, Menubar,
  NavigationMenu, Select, Drawer (vaul), Command (cmdk).
- **Phase 3 Control (5):** Checkbox, RadioGroup, Progress, Toggle, ToggleGroup.
- **Phase 3 Flat/Inset + remaining (19):** Label, Separator, Skeleton, AspectRatio,
  Textarea, InputOTP (input-otp), Accordion, Collapsible, Alert, Avatar, Breadcrumb,
  Pagination, ScrollArea, Carousel (embla), Resizable (**react-resizable-panels v2** —
  v4 is an incompatible rewrite; pinned to ^2), Table, DataTable (tanstack), Sidebar,
  Toaster (sonner).
- **Phase 3 Compositions (4):** Calendar (react-day-picker **v10** — newer API),
  DatePicker, Combobox, Form (react-hook-form).
- All exported from `packages/react/src/index.ts`; one story each in `apps/storybook/src/`.
- Most overlay/flat/inset/composition components were generated by **parallel subagents**
  against the spec-04 contract + the existing Dialog/DropdownMenu/Input templates, then
  integrated + typechecked + verified here.

### 10.2 Engine changes this session (CHANGE HOW THE ENGINE BEHAVES — read these)

1. **Radial rim displacement** (`edge-ramp.ts`): displacement direction is now a
   blend of edge-normal + radial-from-center, `const RADIAL` (currently 0.85). Pure
   normal only bent features perpendicular to a straight edge (flat left/right sides);
   the radial term makes lines **bow on all four edges + corners** (the 2D lens look).
   This is the user-tuned default; `RADIAL`, `RIM_BAND`, `RIM_SCALE` are the knobs.
2. **`--glass-rim-color` edge token** (`tokens.css`/`surface.css`): ONE variable every
   glass border references. Declared on `:root`; flipped to `rgb(var(--glass-edge)/…)`
   (a subtle ~`215 215 215/.185` neutral edge) under `[data-lg-refraction="on"]`. So
   the refraction-mode edge restyles every surface AND bespoke control border at once.
   ⚠️ Must NOT be set on `[data-lg-theme]` selectors (a provider wrapper would then
   re-win it below the flip — see §11 major #2).
3. **Library-wide `@layer` order fix**: every component CSS file now STARTS with
   `@layer lglite.tokens, lglite.surface, lglite.components, lglite.a11y;`. Component
   CSS loads via JS import, so without this the `components` layer could register
   before `surface` and **`.lg-surface` would beat `.lg-<component>`** (this silently
   broke `.lg-dialog` positioning → off-screen, and the Dock overflow). First-parsed
   wins + all identical = deterministic. New component CSS MUST keep this first line.
4. **Opt-in `lens` prop on Controls** (Slider/Switch/Checkbox/RadioGroupItem/Progress):
   default controls are still tint+rim+shadow with NO backdrop-filter (perf). `lens`
   attaches `useGlassLens` + the new `.lg-lens` utility (refraction backdrop-filter
   only, gated, a11y-disabled) to the track/box. NOTE: the refraction only shows
   through the **translucent** part — a filled/checked control's solid tone covers it.
5. **`frosted` on all glass components**: fixed tooltip/alert/badge that ignored it;
   **Accordion is now a glass Surface** (was flat). Storybook **Frosted on/off** + 
   **Blur on/off** toolbar toggles apply `.lg-frosted` / `.lg-no-blur` to the stage
   (cascade to all). `.lg-no-blur` is a public utility (zeros the blur vars).
6. **`--glass-backdrop-extra`** passthrough token: appended to every glass
   `backdrop-filter` (empty default) so consumers add `brightness()/contrast()/…`
   globally or per-instance without forking `surface.css`.
7. **Tones**: added `success` (green) to `glassSurface` + `.lg-tone-success`; **solid
   Buttons now honor `tone`** (default/primary/destructive/success) via `data-tone`
   (outline/ghost tint border+text too).

### 10.3 Tests (spec 09 — partial)

- `packages/react/vitest.config.ts` + `test/setup.ts`. Run: `pnpm --filter @lglite/react test`.
- **Vitest pinned to ^2** (v4 needs Vite 6; repo resolves Vite 5 via storybook).
- 14 tests green: `src/internal/magnify.test.ts` (Dock math, spec 10.7),
  `test/contract.test.tsx` (forwardRef/spread/className-last/asChild/tone),
  `test/a11y.test.tsx` (jest-axe: default + `contrast="aa"`).
- jsdom can't do backdrop-filter/canvas/forced-colors → the lens no-ops there (fine).

## 11. Final adversarial review — findings (blockers fixed, rest tracked)

**Fixed this session:**
- (blocker) `form.tsx useFormField` guard was dead code (read `fieldContext.name`
  before the null check) → now guards first.
- (blocker) `sonner` toast hand-rolled glass → escaped a11y.css (forced-colors etc.).
  Now `classNames.toast = "lg-surface lg-toast"`; `.lg-toast` is layout-only.
- (major) `magnify.ts` read reduced-motion once at mount → now a live `matchMedia`
  listener re-attaches/tears down on OS toggle.

**Open / by-design (do NOT treat as new bugs):**
- The pre-paint refraction gate (`data-lg-refraction`) is intentionally **sticky**
  (D6 — "this browser can refract", not "a lens is live"). Every `.lg-surface` does
  attach a lens, so this is fine.
- The lens bakes `extraSigma` from `--glass-blur` at attach; it re-bakes on resize but
  NOT on a runtime blur-token / `.lg-no-blur` change without a resize. Storybook
  toggles work (fresh load re-bakes). Document if it bites.
- `Combobox` trigger lacks `aria-controls`/`aria-activedescendant` to the cmdk listbox
  (shadcn-parity gap) — improve for the AA a11y claim.
- Dock's roving-tabindex `useLayoutEffect` runs every render (cheap DOM query) and its
  `itemGlass` `>3` warn uses `React.Children` count (imperfect for fragments/maps).

## 12. What's next (updated)

1. **Landing / marketing page** (user-requested — the next major deliverable). A demo
   + marketing site that sells the library and proves it. Concretely:
   - **Purpose:** showcase the "Liquid Glass" identity + every component, double as the
     docs/marketing entry. This is the hero artifact people see first.
   - **Where:** a new `apps/web/` (or `apps/site/`) workspace — Vite + React (or Next if
     SSR/SEO wanted; note D6 pre-paint refraction script must run, so SSR needs the
     `GlassScript` in `<head>`). Consumes `@lglite/react` like a real consumer would.
   - **Must demonstrate the glass engine, not just list components:** a hero with the
     Dock + Navbar over a real photo/video backdrop; live toggles for the engine knobs
     (`lens`, `frosted`, `blur`, `tone`, `theme` light/dark, `contrast="aa"`, backdrop
     swap) — reuse the same levers the Storybook toolbar exposes; a component gallery
     (cards linking to each); the WCAG/AA + Chromium-only-refraction story told honestly
     (D1/D4) with the WebKit/Firefox fallback shown side-by-side.
   - **Perf:** respect the blur budget (few floating surfaces); `prefers-reduced-motion`
     + reduce-glass honored; ship the `GlassScript` gate.
   - **Verify** in real Chrome via the CDP harness (§5) over the photo AND a sharp
     backdrop, plus a WebKit check for the fallback — same process rule as components.
2. **Playwright test layers** (spec 09): the contrast-contract pixel test (the real
   enforcement of "AA-capable"), per-engine visual baselines (Chromium refraction vs
   WebKit/Firefox frost), forced-colors emulation, size-limit. The CDP harness in
   `/tmp` (`cdpshot.js`/`cdprun.js`/`diag2.js`) is the basis for the contrast test.
3. **WebGL lens engine** (`@lglite/webgl`, specs 12/15) — still only the `lens.ts` stub.
4. The §11 open items.
