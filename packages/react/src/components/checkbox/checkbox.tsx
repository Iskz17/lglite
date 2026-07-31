"use client";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn, useGlassLens, useMergedRefs, useNameWarning } from "@lglite/glass-core";
import "./checkbox.css";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Opt-in live-backdrop refraction on the box (visible in the UNchecked state). */
  lens?: boolean;
  /** Denser frosted material; pair with `lens` for a frosted Liquid Glass control. */
  frosted?: boolean;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden focusable="false">
    <path d="M13 4.5 6.5 11 3 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden focusable="false">
    <path d="M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Control ([spec 18]) — glass box (tint fill + rim border + inner shadow, no
 *  blur for perf); checked fills with tone-primary + white mark. Not a Surface. */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox({ className, lens, frosted, ...props }, ref) {
  const inner = React.useRef<React.ElementRef<typeof CheckboxPrimitive.Root>>(null);
  const lensRef = useGlassLens<React.ElementRef<typeof CheckboxPrimitive.Root>>();
  const setRef = useMergedRefs<React.ElementRef<typeof CheckboxPrimitive.Root>>(
    ref,
    inner,
    lens ? lensRef : undefined,
  );
  useNameWarning(inner, "Checkbox");
  return (
    <CheckboxPrimitive.Root ref={setRef} className={cn("lg-checkbox", lens && "lg-lens", frosted && "lg-frosted", className)} {...props}>
      <CheckboxPrimitive.Indicator className="lg-checkbox__indicator">
        {/* Both render; CSS shows the right one per data-state so uncontrolled
            indeterminate works too. */}
        <span className="lg-checkbox__check"><CheckIcon /></span>
        <span className="lg-checkbox__dash"><DashIcon /></span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
