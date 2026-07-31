# 10 — Dock (Phase 2 capstone)

The riskiest component: not a Radix primitive, needs pointer-distance magnification + spring physics + (worst case) many live glass surfaces. Specced now, built in Phase 2 **after** the engine is hardened. Isolated on purpose.

## 10.1 What it is

A macOS-style floating Dock: a glass bar holding icon items that **magnify** based on pointer proximity, with neighbors scaling on a falloff curve, springy motion.

## 10.2 Anatomy

```
<Dock>                          (glass bar = one .lg-surface, intensity="strong")
  <DockItem icon label onClick/>  ×N
</Dock>
```

The **bar** is a single glass surface (counts as one surface for the perf budget). Items are **not** individually glass by default (that would be N backdrop-filters → budget violation). Optional `itemGlass` prop for a few hero docks, gated + warned.

## 10.3 Magnification math

For each item, given pointer x and item center `cx`:

```
d = abs(pointerX - cx)
influence = clamp(1 - d / RANGE, 0, 1)        // RANGE ≈ 2.5 × baseSize
scale = 1 + influence^2 * (MAX_SCALE - 1)     // ease the falloff (squared)
lift  = influence * MAX_LIFT                    // translateY upward
```

- `MAX_SCALE` ≈ 1.6, `MAX_LIFT` ≈ 12px, `RANGE` tunable.
- Apply via a JS spring (`springs.magnify` from [08]) on `scale` + `translateY` — compositor-friendly transforms only.
- Use a single `pointermove` listener on the bar (rAF-throttled), compute all items in one pass. No per-item listeners.

## 10.4 Performance (this is where the budget bites)

- Animate **only** `transform` (`scale`/`translateY`) — never width/layout, never `backdrop-filter`.
- The bar's blur is constant; magnification doesn't touch it.
- rAF-throttle pointer handling; bail when pointer leaves.
- Target 60fps with ~12 items on a mid laptop; perf story measures frame stats.
- `itemGlass` (per-item refraction) is opt-in, hero-only, and explicitly logged as over-budget if N>3.

## 10.5 A11y

- `role="toolbar"`, `aria-orientation="horizontal"`.
- Roving tabindex; Left/Right arrow navigation; Home/End; Enter/Space activate.
- Each item needs an accessible name (`label`) — required prop; tooltip on hover/focus reuses `Tooltip`.
- Magnification is **purely decorative** → fully disabled under `prefers-reduced-motion` (static dock, still operable).
- Focus ring per [03 §3.5]; works over any backdrop.

## 10.6 Refraction precision mode (optional)

This is the one place the `feImage` + canvas-generated displacement map ("precision" refraction, sharper edge-lensing than `feTurbulence`) may be justified — but only on the bar, regenerated on resize via a debounced `ResizeObserver`, single instance. Default Dock uses the standard `feTurbulence` preset like everything else. Document the trade-off; do not enable precision by default.

## 10.7 Tests

- Magnification math unit-tested (pure function: pointerX + items → scales).
- Keyboard nav + roving tabindex behavior.
- Reduced-motion → no scale changes on pointer move.
- jest-axe in 3 modes; toolbar semantics.
- Perf story (manual gate) + frame-stat note in PR.
