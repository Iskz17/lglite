# 22 — Tabs (Phase 1)

Treatment: **Surface** (the tablist). Built on `@radix-ui/react-tabs`. Showcases the sliding glass active-indicator.

## Anatomy

```
<Tabs defaultValue orientation>          (Radix Root)
  <TabsList class="lg-tabs__list lg-surface">
    <span class="lg-tabs__indicator" />   ← absolutely-positioned glass/tone pill
    <TabsTrigger class="lg-tabs__trigger" value="a">…</TabsTrigger>
    …
  </TabsList>
  <TabsContent value="a">…</TabsContent>
</Tabs>
```

The **list** is the glass surface; triggers are flat text; the **indicator** is one moving pill behind the active trigger.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `tone` | tone | `default` | indicator color. |
| Radix Tabs props | | | `value`/`defaultValue`, `orientation`, `activationMode` ("automatic"/"manual"), `dir`. |

forwardRef on each part → its Radix node.

## States / motion

The indicator slides from the previous active trigger to the new one via `transform: translateX()` + width, measured from the trigger's offset (ResizeObserver + on value change). Reduced-motion → snap instantly. Triggers have hover/focus states; active trigger text uses full `--glass-fg`, inactive uses `--glass-fg-muted`.

## Glass application

`glassSurface()` on TabsList. The indicator is a small glass/tone pill (its own tint + rim) — purely decorative, `aria-hidden`. Refraction on the list is optional (it's usually over solid app chrome); default lets the gate decide.

## A11y

- Radix: `role="tablist"/"tab"/"tabpanel"`, roving tabindex, ←/→ (or ↑/↓ vertical) navigation, Home/End, `aria-selected`, tab↔panel association, `activationMode` controls auto vs manual activation.
- Indicator is decorative (`aria-hidden`); selection is conveyed by `aria-selected`, not just the pill — so it works without the visual.
- Inactive trigger text (`--glass-fg-muted`) still meets AA.
- forced-colors: list `Canvas`, active trigger uses `Highlight`/border (indicator may vanish — selection still announced).

## CSS (`tabs.css`)

```css
.lg-tabs__list { position: relative; display: inline-flex; gap: .25rem; padding: .25rem; border-radius: var(--glass-radius); }
.lg-tabs__trigger {
  position: relative; z-index: 1; padding: .375rem .75rem; border-radius: calc(var(--glass-radius) - 4px);
  color: rgb(var(--glass-fg-muted)); font-weight: 500; cursor: pointer; background: transparent; border: 0;
  transition: color var(--glass-duration) var(--glass-ease);
}
.lg-tabs__trigger[data-state="active"] { color: rgb(var(--glass-fg)); }
.lg-tabs__indicator {
  position: absolute; z-index: 0; top: .25rem; bottom: .25rem; left: 0; border-radius: calc(var(--glass-radius) - 4px);
  background: rgb(var(--glass-tint) / calc(var(--glass-tint-opacity) + 0.1));
  border: var(--glass-rim-width) solid rgb(var(--glass-rim) / var(--glass-rim-opacity));
  box-shadow: var(--glass-inner-shadow);
  transition: transform var(--glass-duration) var(--glass-ease), width var(--glass-duration) var(--glass-ease);
}
@media (prefers-reduced-motion: reduce) { .lg-tabs__indicator { transition: none; } }
.lg-tabs[data-orientation="vertical"] .lg-tabs__list { flex-direction: column; }
```

The indicator position is set in JS (a small hook measuring the active trigger's `offsetLeft`/`offsetWidth`), written to `transform`/`width`.

## Stories

horizontal/vertical; many tabs (scroll); manual vs automatic activation; tones; over stressor; dark; aa; forced-colors; reduced-motion (snap).

## Tests

- Radix: arrow nav, Home/End, roving tabindex, `aria-selected`, panel association; manual vs automatic activation.
- Indicator hook positions under the active trigger; updates on resize and value change; `aria-hidden`.
- Inactive trigger color passes AA.
- jest-axe across modes; reduced-motion snaps.
