"use client";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@lglite/glass-core";
import "./label.css";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

/** Form label ([flat] — text colour only, no glass material). Radix associates it
 *  with the control via `htmlFor` and forwards `peer-disabled` styling. */
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root ref={ref} className={cn("lg-label", className)} {...props} />
  );
});
