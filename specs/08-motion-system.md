# 08 — Motion System ("Liquid")

The product is named *Liquid* Glass — motion is a first-class engine concern, not per-component decoration. All motion is gated by `prefers-reduced-motion`.

## 8.1 Tokens (in `tokens.css`, surfaced via `motion.ts`)

```css
--glass-ease: cubic-bezier(0.32, 0.72, 0, 1);   /* Apple's standard spring-ish ease */
--glass-ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* decel for entrances */
--glass-duration: 220ms;     /* base */
--glass-duration-fast: 140ms;
--glass-duration-slow: 360ms;
```

`motion.ts` exports JS mirrors for any spring-driven (JS) animation (Dock):

```ts
export const springs = {
  press:  { stiffness: 400, damping: 28 },
  morph:  { stiffness: 260, damping: 30 },
  magnify:{ stiffness: 300, damping: 26 },   // Dock
};
```

## 8.2 The motion vocabulary

| Motion | Where | Implementation | Reduced-motion |
|--------|-------|----------------|----------------|
| **Press** | Button, interactive Card | CSS `:active { scale: 0.98 }` | keep (subtle, non-vestibular) — or drop scale, keep nothing |
| **Liquid morph** | Dialog/Popover/Tooltip/DropdownMenu open/close | CSS keyframes: scale `0.96→1` + opacity, `--glass-ease` | instant (no animation) |
| **Ripple** | Button press (optional) | pointer-positioned radial gradient that scales+fades on `:active` via a CSS custom prop set in JS for origin | disabled |
| **Magnify** | Dock | JS spring on `scale`/`translateY` per pointer distance ([10]) | disabled (static dock) |
| **Sheen** | optional hover on large surfaces | animated gradient highlight sweep | disabled |

## 8.3 Reduced-motion rule (global)

Reduced-motion kills **animations and decorative transforms**, but NOT color/opacity transitions (those are allowed and aid usability). So scope it — do **not** blanket-nuke all `transition` on every `lg-*` class:

```css
@media (prefers-reduced-motion: reduce) {
  /* kill keyframe animations (Dialog/Popover morph, sheen, ripple) */
  .lg-surface, [data-lg-animated] { animation: none !important; }
  /* freeze decorative transforms only — keep color/opacity transitions */
  .lg-surface { transition-property: color, background-color, opacity, box-shadow; }
  .lg-btn { transform: none; transition: color, background-color, opacity; }
}
```

Avoid `[class^="lg-"]` blanket selectors (they match every internal class and, with `!important`, prevent consumers restoring allowed transitions). Components must remain fully functional and correct in their final visual state with zero animation.

## 8.4 The ripple (optional, Button)

JS sets `--lg-ripple-x/y` from the pointer event; CSS animates a radial gradient pseudo-element from that origin. Origin only — no continuous JS loop, so it's cheap. Disabled under reduced-motion and when `data-lg-reduce-glass`.

## 8.5 Performance

- Prefer animating `transform`/`opacity`/`scale` only (compositor-friendly).
- Never animate `backdrop-filter` continuously (CPU fallback risk — verified). The morph animates scale/opacity while blur stays constant.
- `will-change` toggled transiently around open/close, removed after.
