"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "./button.css";

const buttonVariants = cva("lg-btn", {
  variants: {
    variant: {
      glass: "",
      solid: "lg-btn--solid",
      ghost: "lg-btn--ghost",
      outline: "lg-btn--outline",
    },
    size: {
      sm: "lg-btn--sm",
      md: "lg-btn--md",
      lg: "lg-btn--lg",
      icon: "lg-btn--icon",
    },
  },
  defaultVariants: { variant: "glass", size: "md" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    GlassSurfaceVariants {
  asChild?: boolean;
  plate?: boolean;
  loading?: boolean;
}
// `tone` (default | primary | destructive | success) colors every variant: solid =
// filled, outline = border+text, ghost = text. Driven by data-tone in button.css.

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, intensity, tone, frosted, asChild, plate, loading, disabled, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLButtonElement>(ref, variant === "glass");
  return (
    <Comp
      ref={surfaceRef}
      data-tone={tone}
      className={cn(
        variant === "glass" && glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        buttonVariants({ variant, size }),
        usePlate && "lg-plate",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
    </Comp>
  );
});
