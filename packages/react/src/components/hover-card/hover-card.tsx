"use client";
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "../popover/popover.css";
import "./hover-card.css";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
    GlassSurfaceVariants {
  plate?: boolean;
}

/** Glass hover panel — mirrors PopoverContent, reusing the floating `.lg-popover`
 *  surface mechanics. Content wears `.lg-surface`, so the rim refraction applies. */
export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(function HoverCardContent(
  { className, intensity, tone, frosted, plate, align = "center", sideOffset = 8, children, ...props },
  ref,
) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={surfaceRef}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
          "lg-popover",
          "lg-hover-card",
          usePlate && "lg-plate",
          className,
        )}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
});
