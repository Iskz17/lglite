# 20 — Popover (Phase 1)

Treatment: **Overlay** ([16]). Built on `@radix-ui/react-popover`. Reuses the Dialog glass-panel mechanics ([07]) **minus the modal scrim** (a popover is non-modal). This is the first reuse of the overlay pattern — get it right here and Tooltip/DropdownMenu/HoverCard/Select/Menubar all follow.

## Anatomy

```
<Popover>                          (Radix Root)
  <PopoverTrigger asChild>…</PopoverTrigger>
  <PopoverPortal>
    <PopoverContent class="lg-popover lg-surface">
      …children…
      <PopoverArrow class="lg-popover__arrow" />?
      <PopoverClose/>?
    </PopoverContent>
  </PopoverPortal>
</Popover>
```

No overlay/scrim element (non-modal). Content wears `.lg-surface` (intensity `medium`), refraction applies (it floats over page content). Re-export Radix parts.

## Props (PopoverContent)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `intensity` | preset | `medium` | glass strength. |
| `tone` | tone | `default` | |
| Radix Content props | | | `side`, `align`, `sideOffset`, `collisionPadding`, `onOpenAutoFocus`, … spread. |

forwardRef → Content.

## States / motion

`data-state="open"/"closed"` + `data-side` drive the morph: scale `0.96→1` + opacity, origin biased toward the trigger (`data-side`). Reduced-motion → instant ([08]).

## Glass application

`glassSurface({ intensity, tone })` on Content. Same layer stack as any Surface; the arrow is a small rotated glass square sharing the tint/rim. Because it overlays real content, the Chromium refraction reads the page behind it.

## A11y

- Radix: focus moves into content on open, returns to trigger on close, `Escape` closes, click-outside closes, `aria-expanded` on trigger, proper labelling.
- **Non-modal** — focus is NOT trapped; tab can leave (correct for popovers).
- forced-colors: solid `Canvas` panel + border (from [02 §2.3]).
- Content text follows the contrast contract — `plate`/`aa` for guaranteed legibility; small dense content should prefer plate.

## CSS (`popover.css`)

```css
.lg-popover {
  z-index: 50; min-width: 12rem; max-width: min(92vw, 22rem);
  padding: 1rem; border-radius: var(--glass-radius);
  transform-origin: var(--radix-popover-content-transform-origin);
}
.lg-popover__arrow { fill: rgb(var(--glass-tint) / var(--glass-tint-opacity)); }
@media (prefers-reduced-motion: no-preference) {
  .lg-popover[data-state="open"]  { animation: lg-pop-in  var(--glass-duration) var(--glass-ease); }
  .lg-popover[data-state="closed"]{ animation: lg-pop-out var(--glass-duration-fast) var(--glass-ease); }
}
@keyframes lg-pop-in  { from { opacity: 0; scale: .96; } to { opacity: 1; scale: 1; } }
@keyframes lg-pop-out { from { opacity: 1; scale: 1; } to { opacity: 0; scale: .96; } }
```

## Stories

basic; sides/alignments; with arrow; form-in-popover; over stressor (refraction visible); dark; aa; forced-colors; reduced-motion.

## Tests

- Radix: open/close via trigger, Escape, outside-click; focus moves in and returns; non-modal (tab escapes).
- Refraction class present only when gated on.
- jest-axe open + closed across modes.
- Visual baseline Chromium (refraction) vs WebKit (frost).
