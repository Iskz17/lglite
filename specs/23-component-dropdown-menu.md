# 23 — DropdownMenu (Phase 1)

Treatment: **Overlay**. Built on `@radix-ui/react-dropdown-menu`. Menu panel = glass surface; items are flat with a hover/focus highlight. Establishes the menu pattern reused by ContextMenu/Menubar/Select content in Phase 3.

## Anatomy

```
<DropdownMenu>                              (Radix Root)
  <DropdownMenuTrigger asChild>…</DropdownMenuTrigger>
  <DropdownMenuPortal>
    <DropdownMenuContent class="lg-menu lg-surface">
      <DropdownMenuLabel/>
      <DropdownMenuItem class="lg-menu__item"/>
      <DropdownMenuCheckboxItem/> <DropdownMenuRadioGroup/<DropdownMenuRadioItem/>>
      <DropdownMenuSeparator class="lg-menu__sep"/>
      <DropdownMenuSub> <DropdownMenuSubTrigger/> <DropdownMenuSubContent class="lg-menu lg-surface"/> </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenuPortal>
</DropdownMenu>
```

Re-export the full Radix part set (Item, CheckboxItem, RadioItem/Group, Label, Separator, Sub*, Shortcut). Content + SubContent wear `.lg-surface`; items are flat.

## Props (DropdownMenuContent)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `intensity` | preset | `medium` | |
| Radix Content props | | | `side`, `align`, `sideOffset`, `loop`, … |

## States / motion

Content morph like Popover ([20]). Items: highlighted state (`data-highlighted`) gets a tint wash; disabled `data-disabled` dims. Submenu opens to the side with its own morph.

## Glass application

`glassSurface({ intensity })` on Content + SubContent. Items themselves are NOT glass (flat) — only the panel carries `backdrop-filter`, keeping a long menu cheap. Highlight is a `--glass-tint` wash, not a second blur layer.

## A11y

- Radix: `role="menu"/"menuitem"`, full keyboard (↑/↓ navigate, →/← into/out of submenus, type-ahead, Enter/Space activate, Escape closes, Tab closes), focus returns to trigger, `aria-expanded` on trigger, checkbox/radio items expose `aria-checked`.
- Highlighted item meets ≥3:1 against the panel; item text meets AA (use `--glass-fg`, disabled uses muted).
- forced-colors: panel `Canvas`, highlighted item `Highlight`/`HighlightText`.

## CSS (`dropdown-menu.css`)

```css
.lg-menu {
  z-index: 50; min-width: 11rem; padding: .375rem; border-radius: var(--glass-radius);
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
}
.lg-menu__item {
  display: flex; align-items: center; gap: .5rem; padding: .375rem .5rem;
  border-radius: calc(var(--glass-radius) - 6px); cursor: default; color: rgb(var(--glass-fg)); outline: none;
}
.lg-menu__item[data-highlighted] { background: rgb(var(--glass-tint) / calc(var(--glass-tint-opacity) + 0.18)); }
.lg-menu__item[data-disabled] { color: rgb(var(--glass-fg-muted)); pointer-events: none; }
.lg-menu__sep { height: 1px; margin: .25rem 0; background: rgb(var(--glass-rim) / .3); }
@media (prefers-reduced-motion: no-preference) {
  .lg-menu[data-state="open"] { animation: lg-pop-in var(--glass-duration-fast) var(--glass-ease); }
}
```

## Stories

basic items; with icons + shortcuts; checkbox/radio items; submenus; disabled items; long scrolling menu; over stressor; dark; aa; forced-colors; reduced-motion.

## Tests

- Radix keyboard: arrows, type-ahead, submenu enter/exit, Escape, Tab-closes; focus returns to trigger; checkbox/radio `aria-checked`.
- Highlighted item contrast ≥3:1; disabled item text AA.
- Only the panel carries `backdrop-filter` (perf assertion: items don't).
- jest-axe open/closed across modes.
