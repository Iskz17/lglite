# 18 — Switch (Phase 1)

Treatment: **Control** ([16]). Built on `@radix-ui/react-switch`. The 1.4.11 (non-text contrast) showcase — the thumb must stay visible against the track in BOTH states.

## Anatomy

```
<SwitchPrimitive.Root class="lg-switch" data-tone>
  <SwitchPrimitive.Thumb class="lg-switch__thumb" />
</SwitchPrimitive.Root>
```

Two parts only. Track is glass (small Control, low blur); **thumb is solid** (not glass) so it always meets ≥3:1 against the track.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `tone` | `"primary" \| "default"` | `"primary"` | checked track color. |
| `size` | `"sm" \| "md"` | `"md"` | |
| Radix Switch props | | | `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value` — spread to Root. |

forwardRef → Root.

## Variants matrix

`tone` (checked color) × `size`. Unchecked track uses a neutral glass tint; checked uses `--glass-tone-primary` (aa-darkened in `contrast="aa"`).

## States

- **unchecked:** neutral glass track, thumb at left.
- **checked:** tone track, thumb at right.
- **focus-visible:** focus ring on Root ([03 §3.5]).
- **disabled:** `opacity .5`.

## Glass application

Track wears a small glass treatment (tint + rim + inner-shadow, blur ≤ 6px). Not `glassSurface` (it's a Control). Thumb is a solid `#fff`-ish disc with its own shadow.

## A11y

- Radix provides `role="switch"`, `aria-checked`, Space/Enter toggle, label association (`id`/`htmlFor` or wrap in `Label`).
- **1.4.11:** thumb-vs-track and track-vs-page both ≥3:1 in unchecked AND checked — verify in tests with the chosen tokens (white thumb on `#0A84FF` ≈ 3.6:1 ✓; on neutral glass ✓).
- forced-colors: track `Canvas`+border, thumb `CanvasText`, checked uses `Highlight`.
- Requires an accessible name (associated label) — warn if missing.

## Motion

Thumb translate via `transform` on `[data-state]` change ([08], `springs.press`-ish ease). Reduced-motion: thumb still moves to reflect state, but no overshoot/spring — instant transform.

## CSS (`switch.css`)

```css
.lg-switch {
  position: relative; width: 2.75rem; height: 1.5rem; border-radius: 999px; cursor: pointer;
  background: rgb(var(--glass-tint) / calc(var(--glass-tint-opacity) + 0.08));
  backdrop-filter: blur(6px) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(6px) saturate(var(--glass-saturation));
  border: var(--glass-rim-width) solid rgb(var(--glass-rim) / var(--glass-rim-opacity));
  box-shadow: var(--glass-inner-shadow);
  transition: background-color var(--glass-duration) var(--glass-ease);
}
.lg-switch[data-state="checked"] { background: rgb(var(--glass-tone-primary)); }
.lg-switch__thumb {
  display: block; width: 1.125rem; height: 1.125rem; border-radius: 999px;
  background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / .3);
  transform: translateX(0.1875rem);
  transition: transform var(--glass-duration) var(--glass-ease);
}
.lg-switch[data-state="checked"] .lg-switch__thumb { transform: translateX(1.4375rem); }
.lg-switch--sm { width: 2.25rem; height: 1.25rem; }
.lg-switch:disabled { opacity: .5; }
@media (prefers-reduced-motion: reduce) { .lg-switch__thumb { transition: transform 1ms linear; } }
```

## Stories

unchecked/checked; tones; sizes; disabled; with Label; over stressor; dark; aa; forced-colors; reduced-motion.

## Tests

- Radix behavior: Space/Enter toggles, `onCheckedChange` fires, controlled + uncontrolled.
- 1.4.11 assertions: thumb-vs-track ≥3:1 both states (sample computed colors).
- No label → warns.
- jest-axe across modes; reduced-motion removes spring.
