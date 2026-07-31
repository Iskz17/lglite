# 24 — Badge (Phase 1)

Treatment: **Surface (small)**. A div (or Slot) — no Radix. Small static label; because text is small, legibility (contrast) is the main design tension.

## Anatomy

```
<span class="lg-badge lg-surface" data-tone>{children}</span>   (or Slot when asChild)
```

Single element. Glass on the badge itself.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"glass" \| "solid" \| "outline"` | `"glass"` | |
| `tone` | `"default" \| "primary" \| "destructive" \| "success" \| "warning"` | `"default"` | status colors. |
| `asChild` | boolean | `false` | render as `<a>`/custom. |
| `plate` | boolean | `false` | opaque label for guaranteed contrast. |
| native props | | | spread. |

forwardRef → root. (Add `success`/`warning` tone tokens to [13] when building — `--glass-tone-success: 48 209 88`, `--glass-tone-warning: 255 159 10`, with aa-darkened variants.)

## Variants matrix

| variant | bg | border | use |
|---------|----|--------|-----|
| glass | tint | rim | default, on imagery |
| solid | opaque tone | none | status that must read at a glance (recommended for small text) |
| outline | transparent | rim | subtle |

## States

Mostly static. If interactive (`asChild` → link/button), gains hover + focus ring + accessible name.

## Glass application

`glassSurface({ tone })` with `intensity` forced `subtle` (badges are tiny; strong blur is wasteful/noisy). **Because text is small, default stories demonstrate `plate`/`solid`** — glass-first small text is the worst case for the contrast contract, so docs steer users to `solid` or `plate` for badges carrying meaning (e.g. counts, status).

## A11y

- A badge conveying **status** should not rely on color alone (1.4.1) — include text/icon; for live-updating counts, consider `aria-label`/`role="status"` on the container that owns it.
- Tone fills meet AA with their label in `solid`/`plate`; glass variant over imagery should use `plate` for guaranteed contrast.
- forced-colors: `Canvas`/`CanvasText` + border; tone conveyed by border/text, not just fill.

## CSS (`badge.css`)

```css
.lg-badge {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .125rem .5rem; font-size: .75rem; font-weight: 600; line-height: 1.4;
  border-radius: 999px; color: rgb(var(--glass-fg));
}
.lg-badge--solid { color: #fff; border: 0; }
.lg-badge[data-tone="primary"].lg-badge--solid     { background: rgb(var(--glass-tone-primary)); }
.lg-badge[data-tone="destructive"].lg-badge--solid { background: rgb(var(--glass-tone-destructive)); }
.lg-badge--outline { background: transparent; }
.lg-badge[data-plate] { background: rgb(var(--glass-plate-bg)); }
```

## Stories

all variants × tones; counts; status set; on a photo backdrop (shows why solid/plate); as a link (`asChild`); dark; aa; forced-colors.

## Tests

- forwards ref; spreads props; `asChild` link is focusable with accessible name.
- jest-axe across modes.
- Contrast-contract: `solid` and `plate` badge text pass AA over black/white; `glass` variant is warn-only (documented).
