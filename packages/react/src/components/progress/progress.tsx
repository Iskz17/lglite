"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn, useGlassLens, useMergedRefs } from "@lglite/glass-core";
import "./progress.css";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Completion 0–100. */
  value?: number | null;
  /** Opt-in live-backdrop refraction on the track (visible in the UNfilled portion). */
  lens?: boolean;
  /** Denser frosted material; pair with `lens` for a frosted Liquid Glass control. */
  frosted?: boolean;
}

/** Control ([spec 19]) — glass track with a tone-filled indicator. Not a Surface
 *  (no rim lens / backdrop-filter). Radix sets role + aria-valuenow/min/max. */
export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress({ className, value, lens, frosted, ...props }, ref) {
  const lensRef = useGlassLens<React.ElementRef<typeof ProgressPrimitive.Root>>();
  const setRef = useMergedRefs<React.ElementRef<typeof ProgressPrimitive.Root>>(
    ref,
    lens ? lensRef : undefined,
  );
  return (
    <ProgressPrimitive.Root
      ref={setRef}
      value={value}
      className={cn("lg-progress", lens && "lg-lens", frosted && "lg-frosted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="lg-progress__indicator"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
