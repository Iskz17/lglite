"use client";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "./tooltip.css";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    GlassSurfaceVariants {}

/**
 * Tiny glass overlay ([spec 21]). Plate-by-default (in CSS) so tooltip text stays
 * legible over any backdrop — tooltips can't afford glass-first ambiguity.
 *
 * A11y: a tooltip must contain TEXT ONLY — no links, buttons, or inputs. A
 * focusable child here is effectively unreachable (the tooltip isn't focus-managed)
 * and important info must never live only in a tooltip. Use Popover / HoverCard for
 * interactive or must-reach content.
 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(function TooltipContent({ className, intensity, tone, frosted, sideOffset = 6, children, ...props }, ref) {
  const glass = useGlass();
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={surfaceRef}
        sideOffset={sideOffset}
        className={cn(
          glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
          "lg-tooltip",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});

export const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(function TooltipArrow({ className, ...props }, ref) {
  return <TooltipPrimitive.Arrow ref={ref} className={cn("lg-tooltip__arrow", className)} {...props} />;
});
