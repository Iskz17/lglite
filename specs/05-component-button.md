# 05 — Button

The simplest surface; the canonical example of the contract. No Radix primitive needed (native `<button>` + `Slot` for `asChild`).

## Anatomy

```
<button class="lg-btn lg-surface …">  (or Slot when asChild)
  [leading icon?] {children} [trailing icon?]
</button>
```

Single element. Glass is on the button itself. Icons are passed as children or via `startIcon`/`endIcon` props (consumer supplies the icon node — no hard icon dep).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"glass" \| "solid" \| "ghost" \| "outline"` | `"glass"` | `glass` wears `.lg-surface`; others are flat. |
| `tone` | `"default" \| "primary" \| "destructive"` | `"default"` | From `glassSurface`. |
| `intensity` | `"subtle" \| "medium" \| "strong"` | inherits provider, else `medium` | From `glassSurface`. |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | |
| `asChild` | `boolean` | `false` | Render as child (e.g. `<a>`). |
| `plate` | `boolean` | `false` | Wrap label in `.lg-plate` for guaranteed contrast. |
| `loading` | `boolean` | `false` | Shows spinner, sets `aria-busy`, disables. |
| `startIcon`/`endIcon` | `ReactNode` | — | |
| …native `<button>` props | | | spread through. |

## Variants matrix

| variant | bg | border | backdrop-filter | use |
|---------|----|--------|-----------------|-----|
| glass | tint | rim | blur+saturate(+url) | default, floating actions |
| solid | opaque tone | none | none | primary CTAs needing guaranteed contrast |
| ghost | transparent | none | none | toolbars, low-emphasis |
| outline | transparent | rim | none | secondary |

## States

- **hover:** lift `transform: translateY(-1px)`, brighten rim (`--glass-rim-opacity` ↑), toggle `will-change: backdrop-filter` on enter, remove on leave.
- **active:** `transform: translateY(0) scale(0.98)`; optional press "liquid" ripple from pointer (see [08]).
- **focus-visible:** shared focus ring from [03 §3.5].
- **disabled / loading:** `opacity: 0.5; pointer-events: none;` + `aria-disabled`/`aria-busy`.

## Glass application

`variant="glass"` → `glassSurface({ intensity, tone })` on the `<button>`. Default intensity `medium`. Buttons are small; `strong` blur is discouraged (perf + visual noise).

## A11y

- Native `<button>` semantics; `asChild` must forward to a focusable, role-correct element.
- `loading` sets `aria-busy="true"` and keeps an accessible label.
- `tone="primary"` as `variant="solid"` uses the AA-safe darkened blue in `contrast="aa"` (see [03 §3.4]); glass primary buttons should use `plate` or `solid` when the label must be guaranteed.
- Icon-only (`size="icon"`) requires `aria-label` — lint/runtime warn if missing.

## CSS (`button.css`, `@layer lglite.components`)

```css
.lg-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  font: inherit; font-weight: 500; cursor: pointer; user-select: none;
  border-radius: var(--glass-radius);
  transition: transform var(--glass-duration) var(--glass-ease);
}
.lg-btn--sm { height: 2rem; padding-inline: 0.75rem; font-size: 0.875rem; }
.lg-btn--md { height: 2.5rem; padding-inline: 1rem; }
.lg-btn--lg { height: 3rem; padding-inline: 1.5rem; font-size: 1.125rem; }
.lg-btn--icon { height: 2.5rem; width: 2.5rem; padding: 0; }
.lg-btn--solid   { background: rgb(var(--glass-tone-primary)); color: white; border: 0; }
.lg-btn--ghost   { background: transparent; border: 0; box-shadow: none; }
.lg-btn--outline { background: transparent; }
.lg-btn:hover    { transform: translateY(-1px); }
.lg-btn:active   { transform: scale(0.98); }
.lg-btn:disabled,[data-loading] .lg-btn { opacity: 0.5; pointer-events: none; }
```

## Stories (`button.stories.tsx`)

All variants × tones × sizes grid; over the dynamic-backdrop stressor; loading; icon-only; `asChild` as link; `contrast="aa"` snapshot; dark theme.

## Tests (`button.test.tsx`)

- Renders, forwards ref, spreads props, merges className.
- `asChild` renders an `<a>` and stays focusable.
- Icon-only without `aria-label` warns.
- jest-axe clean in default + `contrast="aa"` + forced-colors emulation.
- Contrast-contract: `tone="primary"` label ≥4.5:1 (or ≥3:1 large) in aa mode.
