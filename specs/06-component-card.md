# 06 — Card

A static glass container; the cleanest place to showcase the material and to validate the contrast contract for body text.

## Anatomy

```
<div class="lg-card lg-surface">
  <CardHeader>  <CardTitle/> <CardDescription/> </CardHeader>
  <CardContent> … </CardContent>
  <CardFooter>  … </CardFooter>
</div>
```

Compound, all presentational `<div>`s. Only the root `Card` wears `.lg-surface`. Sub-parts are layout-only (no nested glass — nesting glass surfaces compounds blur cost and looks muddy).

## Props (root `Card`)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `intensity` | preset | `medium` | glass blur/distortion |
| `tone` | tone | `default` | |
| `asChild` | boolean | false | |
| `plate` | boolean | `false` | if true, `CardContent`/text get `.lg-plate` |
| native `<div>` props | | | spread |

Sub-components (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) each forwardRef + spread + className.

## Glass application

`glassSurface({ intensity, tone })` on root. Cards are larger surfaces → `medium` default is fine; `strong` allowed but counts heavily against the perf budget ([02 §2.10]) — Storybook perf story tracks it.

## Contrast (key validation point)

Cards are where long-form body text meets glass. Default mode: text sits on the glass and may fail over busy backdrops (documented). `plate` or `contrast="aa"` puts `CardContent` text on `.lg-plate`. This component drives the contrast-contract CI test (black/white backdrop sampling — [03 §3.6]).

`CardTitle` renders as `<h3>` by default (configurable via `as`/`asChild`); `CardDescription` is muted text using a token (`--glass-fg` at reduced opacity) that still meets 4.5:1 on a plate.

## States

Mostly static. Optional `interactive` prop → adds hover lift + focus ring + `role`/`tabIndex` when the whole card is a link/button (then it must have an accessible name).

## CSS (`card.css`)

```css
.lg-card { display: flex; flex-direction: column; padding: 1.25rem; border-radius: var(--glass-radius); }
.lg-card__header { display: flex; flex-direction: column; gap: 0.25rem; }
.lg-card__title { font-size: 1.125rem; font-weight: 600; }
.lg-card__desc  { color: rgb(var(--glass-fg) / 0.72); font-size: 0.875rem; }
.lg-card__content { padding-block: 0.75rem; }
.lg-card__footer  { display: flex; gap: 0.5rem; padding-top: 0.75rem; }
.lg-card[data-interactive]:hover { transform: translateY(-2px); }
```

## Stories

Default; over photo/video stressor; `plate` vs not (side-by-side over busy image to show the contrast difference); dark; `contrast="aa"`; `intensity` matrix; `interactive` linked card.

## Tests

- Compound parts render/forward/spread/merge.
- `CardTitle` renders `<h3>` and respects `as`.
- jest-axe clean across modes.
- `interactive` card has accessible name + keyboard activation.
- Contrast-contract test runs against `CardContent` text in aa mode over black & white.
