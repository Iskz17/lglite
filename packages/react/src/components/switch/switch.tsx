"use client";
import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn, useGlassLens, useMergedRefs, useNameWarning } from "@lglite/glass-core";
import "./switch.css";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: "sm" | "md";
  tone?: "primary" | "default";
  /** Opt-in live-backdrop refraction on the track (hero use — over budget for forms). */
  lens?: boolean;
  /** Denser frosted material; pair with `lens` for a frosted Liquid Glass control. */
  frosted?: boolean;
}

/** Control ([spec 18]) — glass track, SOLID thumb so it always meets 1.4.11 ≥3:1
 *  against the track in both states. No rim lens by default (perf); `lens` opts in. */
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(function Switch({ className, size = "md", tone = "primary", lens, frosted, ...props }, ref) {
  const inner = React.useRef<React.ElementRef<typeof SwitchPrimitive.Root>>(null);
  const lensRef = useGlassLens<React.ElementRef<typeof SwitchPrimitive.Root>>();
  const setRef = useMergedRefs<React.ElementRef<typeof SwitchPrimitive.Root>>(
    ref,
    inner,
    lens ? lensRef : undefined,
  );
  useNameWarning(inner, "Switch");
  return (
    <SwitchPrimitive.Root
      ref={setRef}
      data-tone={tone}
      className={cn("lg-switch", size === "sm" && "lg-switch--sm", lens && "lg-lens", frosted && "lg-frosted", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className="lg-switch__thumb" />
    </SwitchPrimitive.Root>
  );
});
