# 03 — The Contrast Contract (WCAG)

Implements decision **D4**: glass-first by default, **AA in one line**. This spec defines exactly how AA is achieved and tested, and exactly what the default mode does/doesn't guarantee.

## 3.1 The core problem

Blur reduces detail but **not luminance**. Over a dynamic backdrop (photo/video/scroll), the composited luminance under text is unknowable at author time, so no translucent surface can guarantee 4.5:1. Therefore **text never relies on the glass for contrast** — it relies on a **plate**.

## 3.2 What each mode guarantees

| Mode | How enabled | Body text (1.4.3) | Non-text/UI (1.4.11) | Focus ring |
|------|-------------|-------------------|----------------------|------------|
| **Default (glass-first)** | nothing | **Not guaranteed** over busy backdrops (documented) | Guaranteed (our colors) | Guaranteed (own halo) |
| **`contrast="aa"`** | `<GlassProvider contrast="aa">` | **Guaranteed 4.5:1** (opaque plates) | Guaranteed | Guaranteed |
| **`<GlassText>` / `plate` prop** | per element | Guaranteed for that text | Guaranteed | Guaranteed |
| **`prefers-contrast: more` / `forced-colors`** | OS setting | Guaranteed (solid Canvas) | Guaranteed | Guaranteed |

Honest public claim: **"AA-capable — glass-first by default, fully WCAG 2.2 AA in one line."**

## 3.3 The plate mechanism

A plate is an inner surface whose background is **opaque** so text on it passes 4.5:1 against the *plate's own* color — independent of the backdrop. The plate background is its **own token** (`--glass-plate-bg`), **never `--glass-tint`** (tint is a near-transparent wash and cannot guarantee contrast). All plate tokens are defined in `tokens.css` `:root`/dark (see [02 §2.1]) — no inline-fallback-only tokens.

```css
@layer lglite.components {
  .lg-plate {
    /* default mode: --glass-plate-opacity is 0.82 (a REAL scrim, not zero);
       aa mode flips it to 1.0 (fully opaque → guaranteed). */
    background: rgb(var(--glass-plate-bg) / var(--glass-plate-opacity));
    color: rgb(var(--glass-fg));
    border-radius: inherit;
  }
}
```

Default mode plate (0.82 opacity over `#FFFFFF`) already clamps worst-case composite enough to pass 4.5:1 for the default fg/bg pair (verified in §3.4); aa mode (1.0) is unconditionally guaranteed. So `<GlassText>` and `plate` **do** improve/guarantee contrast in default mode — the earlier transparent no-op is fixed.

**Two ways `.lg-plate` gets applied — both specified, CSS-only preferred (no-JS / criterion #3):**
- `<GlassText>` renders `<span class="lg-plate">` (explicit).
- A component `plate` prop adds `.lg-plate` to its text container (explicit).
- `contrast="aa"` global mode applies plates **via CSS only**, so it works without hydration. Each component ships a rule in its own `.css` targeting its known text slot, e.g. in `card.css`:
  ```css
  [data-lg-contrast="aa"] .lg-card__content,
  [data-lg-contrast="aa"] .lg-card__title,
  [data-lg-contrast="aa"] .lg-card__desc { background: rgb(var(--glass-plate-bg)); color: rgb(var(--glass-fg)); }
  ```
  (The JS path `glass.contrast === "aa" && "lg-plate"` is a convenience, not the source of truth — the CSS rules guarantee SSR correctness.)

## 3.4 The guaranteed color pairs (the actual AA math)

We don't compute contrast at runtime against the backdrop (impossible for video). Instead AA mode uses **known, pre-verified opaque pairs**:

| Theme | Plate bg (`--glass-plate-bg`) | Text fg | Token | Ratio | Passes |
|-------|------|---------|-------|-------|--------|
| light | `#FFFFFF` | `#111113` | `--glass-fg` | ~18.5:1 | AAA |
| light muted | `#FFFFFF` | `#5A5A5F` | `--glass-fg-muted` | ~5.7:1 | AA |
| dark | `#1C1C1E` | `#F5F5F7` | `--glass-fg` | ~15.8:1 | AAA |
| dark muted | `#1C1C1E` | `#AAAAB0` | `--glass-fg-muted` | ~8.0:1 | AAA |
| primary (text-bg) | apple blue `#0A84FF` + white text | — | — | ~3.6:1 | large only → aa mode swaps `--glass-tone-primary` → `#0066CC` (~5.1:1) |

`--glass-fg-muted` is a **solid color**, not an alpha of `--glass-fg` (alpha-over-plate gives unpredictable ratios). `CardDescription`/muted text uses it and is included in the contrast-contract sampling (§3.6).

Action item for Phase 0: lock exact hexes and regenerate this table from measured ratios. Where a tone accent can't hit 4.5:1 as a text background, aa mode **darkens the accent token** (set in `tokens.css` `[data-lg-contrast="aa"]`) rather than weakening text.

## 3.5 Focus & non-text contrast (all modes)

These we control regardless of backdrop, so they hold even in glass-first default:

```css
.lg-surface:focus-visible {
  outline: 2px solid rgb(var(--glass-fg));
  outline-offset: 2px;
  /* halo so the ring is visible over any backdrop (1.4.11) */
  box-shadow: var(--glass-shadow), 0 0 0 4px rgb(var(--glass-tint) / 0.9);
}
@media (forced-colors: active) {
  .lg-surface:focus-visible { outline-color: Highlight; box-shadow: none; }
}
```

Control boundaries (switch track, input border, etc.) use a `--glass-rim`-derived border meeting 3:1 against their own fill — verified per component in the a11y matrix.

## 3.6 The CI contrast test (the enforcement)

A Vitest + Playwright test (`contrast.contract.test.ts`) that:

1. Renders each component over a pure-black backdrop and a pure-white backdrop.
2. Screenshots the text region, samples text-pixel luminance vs plate-pixel luminance, computes WCAG2 ratio.
3. **HARD-fails** the build if below threshold (4.5:1, or 3:1 for ≥18.66px bold / ≥24px) in:
   - any `contrast="aa"` sample, **and**
   - any `<GlassText>` / `plate`-wrapped sample **in default mode** (because the §3.2 table advertises these as guaranteed — this catches the regression where the plate is a no-op).
4. **Warn-only** (report artifact, never fails CI): plain glass text (no plate) in **default** mode — that path is documented as backdrop-dependent.
5. Includes muted text (`--glass-fg-muted`, e.g. `CardDescription`) as its own sampled case.

This is acceptance criterion #1 and the literal definition of "AA in one line works."

## 3.7 Manual "reduce glass" — the Safari gap

`prefers-reduced-transparency` can't reach Safari, where Apple users actually toggle "Reduce Transparency." So LGLite ships a user-facing control pattern: setting `data-lg-reduce-glass="true"` (or `<GlassProvider reduceGlass>`) removes blur and raises tint opacity (see [02 §2.3]). Document this as the recommended app-level a11y toggle.
