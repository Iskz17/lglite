"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, glassSurface, useGlass, useGlassSurface } from "@lglite/glass-core";
import "./alert.css";

/** tone maps 1:1 onto the glass `tone` tint; "default" stays neutral. */
export const alertVariants = cva("lg-alert", {
  variants: {
    tone: {
      default: "",
      primary: "lg-alert--primary",
      destructive: "lg-alert--destructive",
      success: "lg-alert--success",
    },
  },
  defaultVariants: { tone: "default" },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  plate?: boolean;
  frosted?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, tone, plate, frosted, ...props },
  ref,
) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  // map alert tone onto the glass surface tone (default → no tint).
  const surfaceTone = tone && tone !== "default" ? tone : undefined;
  // destructive/success alerts default to FROSTED of their colour (the user-facing
  // "this is important" material) unless the caller explicitly opts out.
  const useFrosted = frosted ?? (tone === "destructive" || tone === "success");
  return (
    <div
      ref={surfaceRef}
      role="alert"
      className={cn(
        glassSurface({ intensity: glass.intensity, tone: surfaceTone, frosted: useFrosted }),
        alertVariants({ tone }),
        usePlate && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function AlertTitle({ className, ...props }, ref) {
    return <h5 ref={ref} className={cn("lg-alert__title", className)} {...props} />;
  },
);

export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function AlertDescription({ className, ...props }, ref) {
    return <div ref={ref} className={cn("lg-alert__desc", className)} {...props} />;
  },
);
