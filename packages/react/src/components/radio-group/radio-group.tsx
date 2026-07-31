"use client";
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn, useGlassLens, useMergedRefs, useNameWarning } from "@lglite/glass-core";
import "./radio-group.css";

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /** Opt-in live-backdrop refraction on the circle (visible in the UNchecked state). */
  lens?: boolean;
  /** Denser frosted material; pair with `lens` for a frosted Liquid Glass control. */
  frosted?: boolean;
}

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(function RadioGroup({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Root ref={ref} className={cn("lg-radio-group", className)} {...props} />
  );
});

/** Control ([spec 18]) — glass circle (tint fill + rim border + inner shadow,
 *  no blur); checked → tone-primary border + centered dot. Not a Surface. */
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(function RadioGroupItem({ className, lens, frosted, ...props }, ref) {
  const inner = React.useRef<React.ElementRef<typeof RadioGroupPrimitive.Item>>(null);
  const lensRef = useGlassLens<React.ElementRef<typeof RadioGroupPrimitive.Item>>();
  const setRef = useMergedRefs<React.ElementRef<typeof RadioGroupPrimitive.Item>>(
    ref,
    inner,
    lens ? lensRef : undefined,
  );
  useNameWarning(inner, "RadioGroupItem");
  return (
    <RadioGroupPrimitive.Item ref={setRef} className={cn("lg-radio", lens && "lg-lens", frosted && "lg-frosted", className)} {...props}>
      <RadioGroupPrimitive.Indicator className="lg-radio__indicator" />
    </RadioGroupPrimitive.Item>
  );
});
