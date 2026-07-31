"use client";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "./popover.css";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    GlassSurfaceVariants {
  plate?: boolean;
}

/** Glass overlay panel ([spec 20]) — non-modal, reuses the Dialog surface mechanics
 *  minus the scrim. Content wears `.lg-surface`, so the rim refraction applies. */
export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(function PopoverContent(
  { className, intensity, tone, frosted, plate, align = "center", sideOffset = 8, children, ...props },
  ref,
) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={surfaceRef}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
          "lg-popover",
          usePlate && "lg-plate",
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

export const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(function PopoverArrow({ className, ...props }, ref) {
  return <PopoverPrimitive.Arrow ref={ref} className={cn("lg-popover__arrow", className)} {...props} />;
});
