# 04 — Component Contract & DX

The invariant shape every component follows. Read this before writing any component.

## 4.1 The seven rules (non-negotiable)

1. **`React.forwardRef`** to the root DOM node (or the Radix primitive's node).
2. **`...props` passthrough** spread onto the root element.
3. **`asChild`** support via Radix `Slot` wherever it makes sense (composition without extra DOM).
4. **cva variants** for visual options; `VariantProps` feed the prop types.
5. **`className` merged LAST** via `cn()` so the consumer always wins.
6. **Glass via `glassSurface()`**, never bespoke glass CSS — DRY through the engine.
7. **A11y from Radix** primitives where one exists; otherwise hand-roll ARIA + keyboard and cover it in tests.

## 4.2 The canonical template

```tsx
"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, glassSurface, type GlassSurfaceVariants, useGlass } from "@lglite/glass-core";

const xVariants = cva("lg-x", {
  variants: { /* component-specific visual variants */ },
  defaultVariants: { /* … */ },
});

export interface XProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof xVariants>,
    GlassSurfaceVariants {           // intensity, tone
  asChild?: boolean;
  plate?: boolean;                   // opt-in guaranteed-contrast text region
}

export const X = React.forwardRef<HTMLDivElement, XProps>(function X(
  { className, asChild, intensity, tone, plate, /* variant props */ ...props }, ref,
) {
  const Comp = asChild ? Slot : "div";
  const glass = useGlass();
  return (
    <Comp
      ref={ref}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone }),
        xVariants({ /* … */ }),
        (plate || glass.contrast === "aa") && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});
```

## 4.2b Lens props (from the pluggable engine, [12])

Surfaces that can refract accept:
- `lens?: "css" | "webgl"` — default `"css"` (inherits `<GlassProvider lens>`).
- `lensSource?: string | RefObject<HTMLImageElement | HTMLVideoElement>` — required for `"webgl"`; missing → warn + fall back to `"css"`.
- `lensSourceMode?: "contain" | "page-fixed"`, `aberration?: boolean`.

Components pass these to `glass-core`'s lens registry; the `css` engine is a CSS no-op, the `webgl` engine (if registered) mounts a decorative canvas. Component code is engine-agnostic — it never imports WebGL.

## 4.3 The four customization layers (precedence low→high)

1. **Global tokens** — `<GlassProvider intensity blur radius>` injects `--glass-*`.
2. **Per-instance variant** — `<X intensity="strong" tone="primary" />`.
3. **Per-instance token override** — `style={{ "--glass-blur": "40px" }}` or Tailwind `[--glass-blur:40px]`.
4. **`className`** — merged last, wins (tailwind-merge resolves conflicts).

This is the DRY/extensibility answer: props for the common 90%, CSS vars for the long tail, `className` as the escape hatch. No source forking, ever.

## 4.4 "Add a prop easily" — the extension recipe

To add a visual option to a component: add a `variants` key to its cva, add the class to its `.css`, and the prop type updates automatically via `VariantProps`. To add a new glass dimension globally: add a token to `tokens.css` (a `minor`), reference it in `surface.css`. No component code changes — that's the leverage of the central engine.

## 4.5 Naming

- Components mirror shadcn 1:1: `Button`, `Card`, `Dialog`, `Input`, `Switch`, `Slider`, `Popover`, `Tooltip`, `Tabs`, `DropdownMenu`, `Badge`, …
- Compound parts mirror Radix: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`.
- Glass-only extras: `GlassProvider`, `GlassFilters`, `GlassScript`, `GlassText`, and the `Dock` capstone.
- Internal CSS classes: `lg-*`. Tokens: `--glass-*`.

## 4.6 A11y API surface (shared)

```tsx
<GlassProvider contrast="aa">…</GlassProvider>   // global AA
<GlassText>Always readable</GlassText>            // surgical plate
<Button plate>Buy</Button>                        // per-component plate
<GlassProvider reduceGlass>…</GlassProvider>      // manual reduce-transparency (Safari)
```

## 4.7 Per-component spec format

Each component spec ([05]–[07] and future) MUST contain: **Anatomy** (DOM/Radix parts), **Props table**, **Variants matrix**, **States** (hover/active/focus/disabled/open), **Glass application** (which element wears `.lg-surface`, intensity default), **A11y** (roles/keyboard/contrast notes), **CSS classes**, **Stories**, **Tests**.
