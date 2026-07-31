# 09 — Testing, A11y & Performance Strategy

Maps directly to the acceptance criteria in [00].

## 9.1 Test layers

| Layer | Tool | What it covers |
|-------|------|----------------|
| Unit / behavior | Vitest + Testing Library + user-event | render, ref forwarding, props spread, className merge, asChild, keyboard/ARIA behaviors |
| A11y (automated) | jest-axe (unit) + `@storybook/test-runner` + axe-playwright | zero violations in **default**, **`contrast="aa"`**, **forced-colors** emulation |
| Contrast contract | Playwright pixel sampling (`contrast.contract.test.ts`) | text ≥4.5:1 (≥3:1 large) in aa mode over black AND white backdrops; default = warn-only report |
| Visual regression | Playwright screenshots across **Chromium / WebKit / Firefox** | Chromium shows refraction, WebKit/Firefox show fallback — both must be correct (separate baselines per engine) |
| Bundle size | size-limit | ≤ ~4 kb gz JS per component subpath; fail PR on regression |
| Perf (manual + assisted) | Storybook perf story + DevTools notes | frame stats with N surfaces, blur radius sweep, Dock @60fps |

## 9.2 The a11y matrix (every component)

Run each component's stories through axe in three rendered modes:
1. **default** (glass-first)
2. **`contrast="aa"`** (provider wraps the story)
3. **forced-colors** (Playwright `forcedColors: 'active'`)

Plus assert keyboard operability and visible focus in each. `prefers-reduced-motion` and `prefers-reduced-transparency` (Chromium) get smoke stories.

## 9.3 The contrast-contract test (enforcement of criterion #1)

Pseudocode:

```ts
for (const story of textBearingStories) {
  for (const backdrop of ["#000", "#fff"]) {
    await mount(story, { provider: { contrast: "aa" }, backdrop });
    const { fg, bg, fontPx, bold } = sampleTextRegion();
    const ratio = wcag2(fg, bg);
    const min = (fontPx >= 24 || (fontPx >= 18.66 && bold)) ? 3.0 : 4.5;
    expect(ratio).toBeGreaterThanOrEqual(min);   // aa mode: HARD fail
  }
}
// default mode: same loop, but expect→report() (warn artifact, never fails CI)
```

## 9.4 Cross-browser strategy

- **Refraction** is asserted present (the `url(#…)` in computed `backdrop-filter`) only under Chromium with `data-lg-refraction="on"`.
- **Fallback** asserted: under WebKit/Firefox the panel still has blur+tint+rim and is visually complete (baseline screenshot).
- Don't pixel-compare across engines — maintain per-engine baselines.

## 9.5 "Apple-grade" gate (criterion #6)

Pixel-diff cannot judge attainment, only regression. So: a **named human design-review checkpoint** at the end of Phase 0 and Phase 2, comparing key surfaces against a reference target (screenshots of Apple's material / the rdev reference). Recorded as a checklist in the PR. This is the only subjective gate and is explicit.

## 9.6 CI wiring

`ci.yml` jobs (from [01]): `lint`, `typecheck`, `unit`, `a11y`, `contrast`, `visual`, `size`. PRs must pass all but `visual`-on-WebKit may be allowed-to-soft-fail early in Phase 0 while baselines stabilize (documented, time-boxed). Release job on `main` runs Changesets.

## 9.6b Required global harness setup (otherwise refraction renders blank)

Refraction depends on (a) `<GlassFilters/>` being mounted and (b) `data-lg-refraction="on"` being set. Neither exists by default in an isolated story/test. So:

- **Storybook:** a global decorator wraps every story in `<GlassProvider>` (which mounts `<GlassFilters/>`) and sets `document.documentElement.dataset.lgRefraction = "on"` in Chromium; a toolbar toggle flips theme (`data-lg-theme`), `contrast="aa"`, `reduceGlass`, and the dynamic-backdrop stressor.
- **Tests/Playwright:** a setup file mounts `<GlassFilters/>` once and sets the gate attribute per the browser under test (on in Chromium, off in WebKit/Firefox) so fallback vs refraction baselines are correct.
- Without this, `09 §9.4` refraction baselines capture an un-filtered panel.

## 9.7 Definition of done (per component)

- [ ] Follows the [04] contract (ref/props/asChild/cva/cn/glassSurface).
- [ ] Stories: variants matrix + dynamic-backdrop stressor + dark + aa + reduced-motion.
- [ ] Unit + behavior tests green.
- [ ] a11y matrix (3 modes) zero violations.
- [ ] Contrast-contract green in aa mode (if it bears text).
- [ ] Visual baselines captured for Chromium + WebKit + Firefox.
- [ ] Size within budget.
- [ ] Tokens used (no bespoke glass values); new tokens documented.
