"use client";
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn, useGlassLens, useMergedRefs, useNameWarning } from "@lglite/glass-core";
import "./slider.css";

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  size?: "sm" | "md";
  tone?: "primary" | "default";
  /** Opt-in live-backdrop refraction on the rail (hero use — over budget for forms). */
  lens?: boolean;
  /** Denser frosted material; pair with `lens` for a frosted Liquid Glass control. */
  frosted?: boolean;
}

/** Control ([spec 19]) — glass track, tone-filled range, glass thumb with its own
 *  focus halo. One thumb per value (range = multiple). Not a Surface (no rim lens). */
export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(function Slider({ className, size = "md", tone = "primary", lens, frosted, value, defaultValue, "aria-label": ariaLabel, ...props }, ref) {
  // Radix needs one <Thumb> per value; derive the count from the controlled or
  // default value. Clamp to ≥1 so a controlled empty array still renders a thumb.
  const count = Math.max(1, (value ?? defaultValue ?? [0]).length);
  const inner = React.useRef<React.ElementRef<typeof SliderPrimitive.Root>>(null);
  const setRef = useMergedRefs<React.ElementRef<typeof SliderPrimitive.Root>>(ref, inner);
  const trackLens = useGlassLens<HTMLSpanElement>();
  useNameWarning(inner, "Slider", !!ariaLabel);
  return (
    <SliderPrimitive.Root
      ref={setRef}
      data-tone={tone}
      value={value}
      defaultValue={defaultValue}
      className={cn("lg-slider", size === "sm" && "lg-slider--sm", className)}
      {...props}
    >
      <SliderPrimitive.Track
        ref={lens ? trackLens : undefined}
        className={cn("lg-slider__track", lens && "lg-lens", frosted && "lg-frosted")}
      >
        <SliderPrimitive.Range className="lg-slider__range" />
      </SliderPrimitive.Track>
      {/* role="slider" lives on the THUMB (Radix), so the accessible name must land
          there, not on the root span; multi-thumb sliders get an indexed name. */}
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="lg-slider__thumb"
          aria-label={ariaLabel ? (count > 1 ? `${ariaLabel} ${i + 1}` : ariaLabel) : undefined}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
