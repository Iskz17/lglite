# 19 — Slider (Phase 1)

Treatment: **Control**. Built on `@radix-ui/react-slider`. Glass rail, tone-filled range, glass thumb with focus ring.

## Anatomy

```
<SliderPrimitive.Root class="lg-slider" orientation>
  <SliderPrimitive.Track class="lg-slider__track">
    <SliderPrimitive.Range class="lg-slider__range" />
  </SliderPrimitive.Track>
  <SliderPrimitive.Thumb class="lg-slider__thumb" />   ← one per value (range sliders → multiple)
</SliderPrimitive.Root>
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `tone` | `"primary" \| "default"` | `"primary"` | range fill color. |
| `size` | `"sm" \| "md"` | `"md"` | rail thickness. |
| Radix Slider props | | | `value`/`defaultValue` (array), `min`, `max`, `step`, `orientation`, `disabled`, `onValueChange`. |

forwardRef → Root.

## Variants matrix

`tone` × `size` × `orientation` (horizontal/vertical). Multi-thumb (range) supported by passing an array value (Radix native).

## States

- **rest:** glass track, tone range, glass thumb.
- **thumb hover/active:** thumb lifts/scales subtly.
- **focus-visible:** focus ring on the thumb ([03 §3.5]) — keyboard target.
- **disabled:** `opacity .5`.

## Glass application

Track + thumb use small glass (tint + rim + inner-shadow, blur ≤ 6px). Range fill is tone (aa-darkened in aa mode). Not `glassSurface`.

## A11y

- Radix gives each thumb `role="slider"`, `aria-valuemin/max/now`, `aria-orientation`, and keyboard: ←/↓ decrement, →/↑ increment, PageUp/Down (large step), Home/End. Support `aria-valuetext`/`aria-label` per thumb for meaningful values (e.g. "$40").
- Thumb focus ring ≥3:1 over any backdrop (own halo).
- Range fill vs track meets 1.4.11 ≥3:1.
- forced-colors: track `Canvas`, range `Highlight`, thumb `CanvasText`+border.

## Motion

Thumb scale/lift on interaction via `transform`. No range animation needed (tracks value). Reduced-motion: drop thumb scale.

## CSS (`slider.css`)

```css
.lg-slider { position: relative; display: flex; align-items: center; width: 100%; height: 1.25rem; touch-action: none; user-select: none; }
.lg-slider[data-orientation="vertical"] { flex-direction: column; width: 1.25rem; height: 12rem; }
.lg-slider__track {
  position: relative; flex-grow: 1; height: 0.375rem; border-radius: 999px; overflow: hidden;
  background: rgb(var(--glass-tint) / calc(var(--glass-tint-opacity) + 0.06));
  border: var(--glass-rim-width) solid rgb(var(--glass-rim) / var(--glass-rim-opacity));
  box-shadow: var(--glass-inner-shadow);
}
.lg-slider__range { position: absolute; height: 100%; background: rgb(var(--glass-tone-primary)); }
.lg-slider__thumb {
  display: block; width: 1.125rem; height: 1.125rem; border-radius: 999px;
  background: rgb(var(--glass-tint) / 0.9); backdrop-filter: blur(4px);
  border: var(--glass-rim-width) solid rgb(var(--glass-rim) / .8);
  box-shadow: 0 1px 4px rgb(0 0 0 / .3);
  transition: transform var(--glass-duration) var(--glass-ease);
}
.lg-slider__thumb:hover { transform: scale(1.1); }
.lg-slider__thumb:focus-visible { outline: 2px solid rgb(var(--glass-fg)); outline-offset: 2px; box-shadow: 0 0 0 4px rgb(var(--glass-tint) / .9); }
.lg-slider--sm .lg-slider__track { height: 0.25rem; }
.lg-slider[data-disabled] { opacity: .5; }
```

## Stories

single value; range (two thumbs); tones; sizes; vertical; with `aria-valuetext` (currency); disabled; over stressor; dark; aa; forced-colors; reduced-motion.

## Tests

- Radix keyboard: arrows/page/home/end change value; `onValueChange` fires; controlled + uncontrolled; range clamps.
- Thumb has accessible name/valuetext.
- 1.4.11: range-vs-track ≥3:1.
- jest-axe across modes.
