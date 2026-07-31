"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, glassSurface, useGlass } from "@lglite/glass-core";
import "./badge.css";

const badgeVariants = cva("lg-badge", {
  variants: {
    variant: {
      glass: "",
      solid: "lg-badge--solid",
      outline: "lg-badge--outline",
    },
    tone: {
      default: "",
      primary: "",
      destructive: "",
      success: "",
      warning: "",
    },
  },
  defaultVariants: { variant: "glass", tone: "default" },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  plate?: boolean;
  frosted?: boolean;
}

/** Small status label ([spec 24]). Glass by default; because text is tiny, docs
 *  steer toward `solid`/`plate` for meaning-bearing badges (contrast). */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant = "glass", tone = "default", asChild, plate, frosted, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "span";
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  return (
    <Comp
      ref={ref}
      data-tone={tone ?? undefined}
      data-plate={usePlate || undefined}
      className={cn(
        variant === "glass" && glassSurface({ tone: tone === "primary" || tone === "destructive" || tone === "success" ? tone : "default", frosted }),
        badgeVariants({ variant, tone }),
        className,
      )}
      {...props}
    />
  );
});
