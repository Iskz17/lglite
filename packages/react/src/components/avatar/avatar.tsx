"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, useGlassLens, useMergedRefs } from "@lglite/glass-core";
import "./avatar.css";

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  ring?: boolean;
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(function Avatar({ className, ring, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("lg-avatar", ring && "lg-avatar--ring", className)}
      {...props}
    />
  );
});

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image ref={ref} className={cn("lg-avatar__image", className)} {...props} />
  );
});

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  /** Denser frosted material. Opt-in (default off). */
  frosted?: boolean;
  /** Live-backdrop refraction (Liquid Glass). Opt-in (default off). */
  lens?: boolean;
}

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(function AvatarFallback({ className, frosted = false, lens = false, ...props }, ref) {
  const fallbackLens = useGlassLens<HTMLSpanElement>();
  const setRef = useMergedRefs<HTMLSpanElement>(ref, lens ? fallbackLens : undefined);
  return (
    <AvatarPrimitive.Fallback
      ref={setRef}
      className={cn(
        "lg-avatar__fallback",
        lens && "lg-lens",
        frosted && "lg-frosted",
        className,
      )}
      {...props}
    />
  );
});
