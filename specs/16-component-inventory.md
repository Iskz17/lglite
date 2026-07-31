# 16 — Full Component Inventory & Glass Treatment

Every shadcn component mapped to its base primitive, glass treatment, and phase. This is the Phase-3 checklist and the contract for how glass is applied per component type.

## 16.1 Glass treatment categories

- **Surface** — wears `.lg-surface` (full glass material). Floating/elevated things.
- **Overlay** — portalled floating panel (surface) + a scrim overlay (not glass / light blur). Dialogs, menus, popovers.
- **Control** — small interactive element; glass on the track/thumb/box, not a big blurred panel (perf). Switch, Checkbox, Slider.
- **Flat** — no glass material; inherits text/token colors only. Label, Separator, Skeleton.
- **Inset** — recessed glass (inner shadow emphasized, low/no blur). Inputs, Textarea.

Perf rule ([02 §2.10]): only **Surface**/**Overlay** carry `backdrop-filter`. **Control**/**Inset** use tint + rim + inner-shadow, blur ≤ 8px or none, so a form full of inputs doesn't blow the GPU budget.

## 16.2 Inventory

| Component | Base primitive | Treatment | Phase | Notes |
|-----------|----------------|-----------|-------|-------|
| Button | native + Slot | Surface | **0** | [05] |
| Card | div compound | Surface | **0** | [06] |
| Dialog | @radix-ui/react-dialog | Overlay | **0** | [07]; strong blur, refraction shines |
| Input | native input | Inset | **1** | low blur; focus rim; contrast-critical |
| Switch | @radix-ui/react-switch | Control | **1** | glass track, solid thumb; 1.4.11 on track |
| Slider | @radix-ui/react-slider | Control | **1** | glass track, glass thumb; focus ring on thumb |
| Popover | @radix-ui/react-popover | Overlay | **1** | reuses Dialog overlay pattern, no scrim |
| Tooltip | @radix-ui/react-tooltip | Overlay | **1** | tiny surface; morph in |
| Tabs | @radix-ui/react-tabs | Surface (list) | **1** | glass tablist, active indicator slides |
| DropdownMenu | @radix-ui/react-dropdown-menu | Overlay | **1** | menu = surface; items flat |
| Badge | div + Slot | Surface (small) | **1** | tone variants; often `plate` for legibility |
| **Dock** | custom | Surface + physics | **2** | [10] |
| Navbar/Toolbar | custom + Slot | Surface | **2** | optional item magnification |
| Accordion | @radix-ui/react-accordion | Flat/Surface | 3 | panels can be surface |
| Alert | div | Surface | 3 | tone-driven |
| AlertDialog | @radix-ui/react-alert-dialog | Overlay | 3 | like Dialog, forced action |
| AspectRatio | @radix-ui/react-aspect-ratio | Flat | 3 | layout only |
| Avatar | @radix-ui/react-avatar | Flat/Surface | 3 | optional glass ring |
| Breadcrumb | nav compound | Flat | 3 | |
| Calendar | react-day-picker | Surface | 3 | grid; day cells Control |
| Carousel | embla | Flat | 3 | controls are Buttons |
| Checkbox | @radix-ui/react-checkbox | Control | 3 | glass box |
| Collapsible | @radix-ui/react-collapsible | Flat | 3 | |
| Combobox | Command + Popover | Overlay | 3 | composition |
| Command | cmdk | Overlay | 3 | glass palette |
| ContextMenu | @radix-ui/react-context-menu | Overlay | 3 | like DropdownMenu |
| DataTable | tanstack-table | Flat | 3 | container may be Surface |
| DatePicker | Calendar + Popover | Overlay | 3 | composition |
| Drawer | vaul | Overlay | 3 | glass sheet, slide |
| Form | react-hook-form + Label | Flat | 3 | wires Inputs |
| HoverCard | @radix-ui/react-hover-card | Overlay | 3 | |
| InputOTP | input-otp | Inset | 3 | per-slot |
| Label | @radix-ui/react-label | Flat | 3 | |
| Menubar | @radix-ui/react-menubar | Overlay/Surface | 3 | |
| NavigationMenu | @radix-ui/react-navigation-menu | Surface/Overlay | 3 | glass viewport |
| Pagination | nav | Flat | 3 | Buttons |
| Progress | @radix-ui/react-progress | Control | 3 | glass track |
| RadioGroup | @radix-ui/react-radio-group | Control | 3 | |
| Resizable | react-resizable-panels | Flat | 3 | glass handle |
| ScrollArea | @radix-ui/react-scroll-area | Flat | 3 | glass scrollbar |
| Select | @radix-ui/react-select | Overlay | 3 | trigger Inset, content Overlay |
| Separator | @radix-ui/react-separator | Flat | 3 | rim-colored line |
| Sheet | @radix-ui/react-dialog | Overlay | 3 | side Dialog |
| Sidebar | custom | Surface | 3 | large glass panel |
| Skeleton | div | Flat | 3 | shimmer respects reduced-motion |
| Sonner/Toast | sonner / radix-toast | Overlay | 3 | glass toasts, stack |
| Table | native table | Flat | 3 | |
| Textarea | native textarea | Inset | 3 | |
| Toggle | @radix-ui/react-toggle | Control/Surface | 3 | pressed = tone fill |
| ToggleGroup | @radix-ui/react-toggle-group | Surface | 3 | |
| Tooltip | (Phase 1) | — | — | see above |

## 16.3 Phase-1 component build notes (the runway after Phase 0)

Each follows the [04] contract. Specifics that need attention:

- **Input / Textarea (Inset):** the contrast-critical surfaces. Default: tint fill + inner shadow + rim, blur ≤ 8px. Placeholder uses `--glass-fg-muted` (AA per [13]). Focus → rim brightens + focus ring ([03 §3.5]). `aa` mode → opaque `--glass-plate-bg` fill. Invalid state uses `--glass-tone-destructive` rim (3:1 non-text).
- **Switch (Control):** track is glass (small), thumb is solid for 1.4.11 ≥3:1 against track in BOTH states; checked = `--glass-tone-primary` (aa-darkened) track. Reduced-motion: thumb still moves (state change), no springy overshoot.
- **Slider (Control):** glass rail, filled range = tone, glass thumb with focus ring; keyboard arrows from Radix; `aria-valuetext` supported.
- **Popover / Tooltip / DropdownMenu (Overlay):** all reuse the Dialog overlay pattern from [07] minus the scrim (Popover/Tooltip have no modal scrim; DropdownMenu uses Radix focus mgmt). Content = surface, `intensity="medium"`, morph-in ([08]). Refraction applies (floating over page content).
- **Tabs (Surface):** glass tablist; active indicator is an absolutely-positioned glass/tone pill that slides via transform (FLIP or CSS) — reduced-motion = instant. Roving tabindex from Radix.
- **Badge (small Surface):** tone variants; because text is small, default stories demonstrate `plate` for legibility and the aa-mode behavior.

## 16.4 Sequencing within Phase 3

Batch by treatment to reuse patterns: **Overlay batch** (AlertDialog, Sheet, Drawer, ContextMenu, Menubar, HoverCard, Select, Command, NavigationMenu) builds on the Dialog/DropdownMenu work; **Control batch** (Checkbox, RadioGroup, Progress, Toggle, ToggleGroup) builds on Switch/Slider; **Flat/Inset batch** (Label, Separator, Table, Textarea, InputOTP, Skeleton, ScrollArea) is mostly tokens. Compositions (Combobox, DatePicker, Form, Pagination, Calendar) come last since they assemble earlier components.
