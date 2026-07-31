"use client";
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import { toggleVariants } from "../toggle/toggle";
import "./toggle-group.css";

/** Shares `variant`/`size` from the group down to each item (shadcn parity). */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  variant: "default",
  size: "md",
});

// Root is a discriminated union (single | multiple), so use a type intersection,
// not `interface extends` (which can't extend a union). Consumers pass `type`.
export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> &
  GlassSurfaceVariants;

/** Glass segmented bar ([spec 04]: Surface). The bar is the glass material (rim +
 *  backdrop-filter); the Toggle items sit flat inside it. */
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(function ToggleGroup(
  { className, variant, size, intensity, tone, frosted, children, ...props },
  ref,
) {
  const glass = useGlass();
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref, true);
  return (
    <ToggleGroupPrimitive.Root
      ref={surfaceRef}
      data-tone={tone}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        "lg-toggle-group",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem({ className, variant, size, ...props }, ref) {
  const ctx = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({ variant: variant ?? ctx.variant, size: size ?? ctx.size }),
        "lg-toggle-group__item",
        className,
      )}
      {...props}
    />
  );
});
