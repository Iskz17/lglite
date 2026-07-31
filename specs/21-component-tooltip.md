# 21 — Tooltip (Phase 1)

Treatment: **Overlay** (tiny). Built on `@radix-ui/react-tooltip`. Shares the overlay glass pattern ([20]/[07]) but is the smallest surface and has the strictest a11y constraints.

## Anatomy

```
<TooltipProvider delayDuration>           (app-level or local)
  <Tooltip>
    <TooltipTrigger asChild>…</TooltipTrigger>
    <TooltipPortal>
      <TooltipContent class="lg-tooltip lg-surface">
        {text}
        <TooltipArrow/>?
      </TooltipContent>
    </TooltipPortal>
  </Tooltip>
</TooltipProvider>
```

Re-export Radix parts incl. `TooltipProvider` (recommend mounting once near the app root for shared delay).

## Props (TooltipContent)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `intensity` | preset | `subtle` | tooltips are small → subtle blur. |
| Radix Content props | | | `side`, `sideOffset`, `align`. |

## States / motion

`data-state` morph like Popover but faster (`--glass-duration-fast`). Show/hide on hover + focus with Radix delay.

## Glass application

`glassSurface({ intensity: "subtle" })`. **Because text is tiny, default to `plate` styling on the label** so it stays legible regardless of backdrop — tooltips can't afford glass-first ambiguity. Effectively the tooltip ships contrast-safe by default.

## A11y (strict — read carefully)

- Radix: `role="tooltip"`, trigger described via `aria-describedby`, opens on hover AND keyboard focus, closes on `Escape`/blur.
- **No interactive content inside a tooltip** (no links/buttons) — if you need that, use Popover/HoverCard. Lint/doc this.
- Not focus-trapping; tooltip is supplementary, never the only place info lives.
- Touch: tooltips are unreliable on touch — important info must not be tooltip-only.
- forced-colors: solid `Canvas` + border; text `CanvasText`.

## CSS (`tooltip.css`)

```css
.lg-tooltip {
  z-index: 60; max-width: 18rem; padding: .375rem .625rem;
  font-size: .8125rem; line-height: 1.3; border-radius: calc(var(--glass-radius) - 6px);
  background: rgb(var(--glass-plate-bg) / .92);   /* plate-by-default for legibility */
  color: rgb(var(--glass-fg));
  transform-origin: var(--radix-tooltip-content-transform-origin);
}
@media (prefers-reduced-motion: no-preference) {
  .lg-tooltip[data-state="delayed-open"] { animation: lg-pop-in var(--glass-duration-fast) var(--glass-ease); }
}
```

(Reuses `lg-pop-in` from popover.css.)

## Stories

basic; sides; long text wrap; on an icon-button; keyboard-focus trigger; over stressor (shows plate legibility); dark; aa; forced-colors; reduced-motion. Plus a "don't do this" story documenting no-interactive-content.

## Tests

- Radix: opens on hover + focus, closes on Escape/blur, `aria-describedby` wired.
- Asserts tooltip text contrast passes by default (plate) over black/white — no opt-in needed.
- jest-axe across modes.
