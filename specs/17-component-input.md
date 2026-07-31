# 17 — Input (Phase 1)

Treatment: **Inset** ([16 §16.1]) — recessed glass, NOT a blurred floating panel. The most contrast-critical surface in the library.

## Anatomy

```
<div class="lg-input-wrap" data-disabled? data-invalid?>   ← only when adornments present
  [startIcon?]
  <input class="lg-input" />                                ← native input
  [endIcon?]
</div>
```

Bare `<Input/>` with no adornments renders just the `<input>` (no wrapper — keep DOM minimal). Adornments add the wrapper. Native input, no Radix.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `inputSize` | `"sm" \| "md" \| "lg"` | `"md"` | named `inputSize` to avoid clashing native `size`. |
| `invalid` | `boolean` | `false` | sets `aria-invalid`, destructive rim. |
| `plate` | `boolean` | `false` | opaque fill (also forced by `contrast="aa"`). |
| `startIcon`/`endIcon` | `ReactNode` | — | adornments → wrapper. |
| native `<input>` props | | | `type`, `value`, `placeholder`, `disabled`, … spread to `<input>`. |

forwardRef → the `<input>` element (so RHF/`Label htmlFor` work).

## Variants matrix

Inset only (no glass/solid/ghost split). `invalid` and `disabled` are the meaningful visual states.

## States

- **rest:** tint fill + `inner-shadow` (recessed) + rim border, blur ≤ 8px.
- **hover:** rim brightens slightly.
- **focus-visible:** rim → tone-primary, focus ring ([03 §3.5]).
- **invalid:** rim → `--glass-tone-destructive` (≥3:1 non-text), focus ring tinted destructive.
- **disabled:** `opacity .5`, no pointer.
- **placeholder:** color `--glass-fg-muted` (AA per [13]); never the only label.

## Glass application

`glassSurface` is NOT used (Input is Inset, not a Surface). Dedicated `.lg-input` styles consume the same tokens (tint, inner-shadow, rim) but with low/no blur — a form of 10 inputs must not carry 10 backdrop-filters ([16] perf rule). `plate`/`aa` → fill becomes opaque `--glass-plate-bg`.

## A11y

- Label association required: pair with `<Label htmlFor>` or `aria-label`/`aria-labelledby`. Lint/runtime warn if an input has no accessible name.
- `aria-invalid` from `invalid`; error text wired via `aria-describedby` (Form handles this in Phase 3).
- Border meets 1.4.11 ≥3:1 against the page in rest AND invalid.
- Placeholder is decorative — content must remain understandable without it.
- forced-colors: collapses to `Canvas`/`CanvasText` field with a real border.

## CSS (`input.css`, `@layer lglite.components`)

```css
.lg-input {
  width: 100%; height: 2.5rem; padding-inline: 0.75rem;
  border-radius: calc(var(--glass-radius) - 4px);
  color: rgb(var(--glass-fg));
  background: rgb(var(--glass-tint) / calc(var(--glass-tint-opacity) + 0.04));
  backdrop-filter: blur(6px) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(6px) saturate(var(--glass-saturation));
  border: var(--glass-rim-width) solid rgb(var(--glass-rim) / var(--glass-rim-opacity));
  box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.12);
  transition: border-color var(--glass-duration) var(--glass-ease), box-shadow var(--glass-duration) var(--glass-ease);
}
.lg-input::placeholder { color: rgb(var(--glass-fg-muted)); }
.lg-input--sm { height: 2rem; font-size: .875rem; }
.lg-input--lg { height: 3rem; font-size: 1.125rem; }
.lg-input:focus-visible { border-color: rgb(var(--glass-tone-primary)); outline: 2px solid rgb(var(--glass-tone-primary)); outline-offset: 2px; }
.lg-input[aria-invalid="true"] { border-color: rgb(var(--glass-tone-destructive)); }
.lg-input:disabled { opacity: .5; }
[data-lg-contrast="aa"] .lg-input, .lg-input[data-plate] { background: rgb(var(--glass-plate-bg)); backdrop-filter: none; -webkit-backdrop-filter: none; }
.lg-input-wrap { position: relative; display: inline-flex; align-items: center; gap: .5rem; }
```

## Stories

sizes; with/without icons; invalid; disabled; over the dynamic-backdrop stressor (shows why placeholder uses a solid muted token); dark; `contrast="aa"`; forced-colors.

## Tests

- forwards ref to `<input>`; spreads native props; `value`/`onChange` controlled works.
- No accessible name → warns.
- `invalid` sets `aria-invalid` + destructive border.
- jest-axe clean across default/aa/forced-colors.
- Contrast-contract: placeholder (`--glass-fg-muted`) and value text pass in aa over black/white.
