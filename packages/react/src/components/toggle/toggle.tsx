"use client";
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lglite/glass-core";
import "./toggle.css";

export const toggleVariants = cva("lg-toggle", {
  variants: {
    variant: {
      default: "",
      outline: "lg-toggle--outline",
    },
    size: {
      sm: "lg-toggle--sm",
      md: "lg-toggle--md",
      lg: "lg-toggle--lg",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

/** A flat glassy pressable button ([spec 04]: Control/Surface, pressed = tone fill).
 *  No backdrop-filter — only a ToggleGroup bar carries the glass material. */
export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(function Toggle({ className, variant, size, ...props }, ref) {
  return (
    <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size }), className)} {...props} />
  );
});
