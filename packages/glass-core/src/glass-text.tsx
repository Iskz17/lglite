"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./cn";

export interface GlassTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

/** Wraps text in an opaque plate so it stays legible over any backdrop ([spec 03]). */
export const GlassText = React.forwardRef<HTMLSpanElement, GlassTextProps>(
  function GlassText({ className, asChild, ...props }, ref) {
    const Comp = asChild ? Slot : "span";
    return <Comp ref={ref} className={cn("lg-plate", className)} {...props} />;
  },
);
