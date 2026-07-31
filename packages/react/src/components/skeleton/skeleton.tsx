"use client";
import * as React from "react";
import { cn } from "@lglite/glass-core";
import "./skeleton.css";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Loading placeholder ([flat] — muted fill with a shimmer, no glass material).
 *  Shimmer is reduced-motion gated to a static fill. */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, ...props }, ref) {
    return <div ref={ref} className={cn("lg-skeleton", className)} {...props} />;
  },
);
