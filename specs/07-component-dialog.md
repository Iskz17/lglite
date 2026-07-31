# 07 — Dialog

The hardest Phase-0 component: it forces focus-trap, overlay, scroll-lock, portal, and **glass-over-content** all at once — exactly why it's in Phase 0 (de-risks the overlay pattern reused by Popover/Tooltip/DropdownMenu later). Built on `@radix-ui/react-dialog` (a11y for free).

## Anatomy

```
<Dialog>                         (Radix Root)
  <DialogTrigger asChild>…</DialogTrigger>
  <DialogPortal>
    <DialogOverlay class="lg-dialog__overlay" />     ← scrim (NOT glass; see below)
    <DialogContent class="lg-dialog lg-surface">     ← the glass panel
      <DialogHeader><DialogTitle/><DialogDescription/></DialogHeader>
      …children…
      <DialogFooter>…</DialogFooter>
      <DialogClose/>
    </DialogContent>
  </DialogPortal>
</Dialog>
```

Re-export Radix parts with glass styling; keep Radix's prop API.

## Glass decisions specific to Dialog

- **The panel (`DialogContent`) wears `.lg-surface`**, `intensity="strong"` by default (a modal is the one place strong blur is justified and on-budget — it's a single surface).
- **The overlay is a plain scrim, not glass.** It uses `background: rgb(0 0 0 / 0.4)` + an *optional* `backdrop-filter: blur(2px)` on the overlay to frost the whole page behind. Putting heavy glass on a full-viewport overlay would blow the perf budget. Keep overlay blur ≤ 4px or off by default.
- **Refraction (Layer 2)** on the panel is great here because the modal floats over real page content — the displacement reads the frosted page behind it. Gated by `data-lg-refraction` as usual.
- **Contrast:** modal text is critical. Default still glass-first, but Dialog **defaults `plate` behavior on its body region when `contrast="aa"`**; doc recommends `contrast="aa"` for dialogs carrying important text.

## States / motion

- Open/close uses the liquid morph ([08]): panel scales from `0.96`→`1` with the apple ease + opacity; overlay fades. Respects `prefers-reduced-motion` (instant).
- `data-state="open"/"closed"` from Radix drives the CSS transitions.

## A11y (mostly Radix, verify in tests)

- Focus trap, focus return to trigger on close, `Escape` to close, `aria-modal`, `role="dialog"`, labelled by `DialogTitle`, described by `DialogDescription`.
- Scroll-lock on body while open.
- Overlay click closes (Radix `onPointerDownOutside`).
- `forced-colors`: panel collapses to solid Canvas + border (from a11y.css); overlay stays a visible scrim.

## CSS (`dialog.css`)

```css
.lg-dialog__overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.lg-dialog {
  position: fixed; z-index: 51; left: 50%; top: 50%;
  translate: -50% -50%;
  width: min(92vw, 32rem); max-height: 85vh; overflow: auto;
  padding: 1.5rem; border-radius: calc(var(--glass-radius) + 4px);
}
.lg-dialog__title { font-size: 1.25rem; font-weight: 600; }
.lg-dialog__desc  { color: rgb(var(--glass-fg) / 0.72); margin-top: 0.25rem; }
.lg-dialog__footer{ display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; }
@media (prefers-reduced-motion: no-preference) {
  .lg-dialog[data-state="open"]  { animation: lg-dialog-in  var(--glass-duration) var(--glass-ease); }
  .lg-dialog[data-state="closed"]{ animation: lg-dialog-out var(--glass-duration) var(--glass-ease); }
}
@keyframes lg-dialog-in  { from { opacity: 0; scale: 0.96; } to { opacity: 1; scale: 1; } }
@keyframes lg-dialog-out { from { opacity: 1; scale: 1; } to { opacity: 0; scale: 0.96; } }
```

## Stories

Basic; long-scrolling content; over the dynamic-backdrop stressor (so refraction is visible); `contrast="aa"`; dark; reduced-motion; forced-colors emulation.

## Tests

- Radix a11y behaviors: focus trap, Escape, focus return, `aria-modal`, labelled/described — assert via Testing Library + user-event.
- jest-axe clean open + closed, in default + aa + forced-colors.
- Refraction class present only when `data-lg-refraction="on"`.
- Visual regression: panel over a fixed backdrop in Chromium (refraction) and WebKit (fallback) — they should both look correct, differently.
