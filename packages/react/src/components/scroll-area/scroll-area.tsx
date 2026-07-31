"use client";
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@lglite/glass-core";
import "./scroll-area.css";

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /** Denser frosted scrollbar-thumb material. Opt-in (default off). */
  frosted?: boolean;
}

/** Scrollable region ([flat] — no glass material; the scrollbar wears a frosted
 *  glass thumb). Mirrors shadcn: Root + Viewport + a vertical ScrollBar + Corner. */
export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(function ScrollArea({ className, children, frosted, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Root ref={ref} className={cn("lg-scroll", className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="lg-scroll__viewport">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar frosted={frosted} />
      <ScrollAreaPrimitive.Corner className="lg-scroll__corner" />
    </ScrollAreaPrimitive.Root>
  );
});

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  /** Denser frosted thumb material. Opt-in (default off; the thumb already reads
   *  as a subtle frosted glass). */
  frosted?: boolean;
}

/** The glass scrollbar: a frosted-glass rounded thumb on a transparent track. */
export const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(function ScrollBar({ className, orientation = "vertical", frosted = false, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn("lg-scroll__bar", className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn("lg-scroll__thumb", frosted && "lg-frosted")}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
