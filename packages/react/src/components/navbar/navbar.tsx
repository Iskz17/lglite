"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  cn,
  glassSurface,
  useGlass,
  useGlassSurface,
  useMergedRefs,
  type GlassSurfaceVariants,
} from "@lglite/glass-core";
import { useMagnify, type MagnifyConfig } from "../../internal/magnify";
import "./navbar.css";

// Subtle magnification (a navbar is not a dock — gentle grow, small lift).
const NAVBAR_MAGNIFY: MagnifyConfig = { maxScale: 1.18, maxLift: 3 };
const ITEM_SELECTOR = "[data-navbar-item]";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement>, GlassSurfaceVariants {
  asChild?: boolean;
  plate?: boolean;
  /** macOS-dock-style pointer magnification on NavbarItems (subtle). Default off. */
  magnify?: boolean;
}

/**
 * Glass navigation bar / toolbar ([spec 16] — Surface). One glass surface (the bar)
 * with a `<nav>` landmark; flexible brand / content / action layout. Optional
 * `magnify` reuses the shared Dock magnification engine at a gentler strength.
 */
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { className, intensity, tone, frosted, asChild, plate, magnify = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "nav";
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const localRef = React.useRef<HTMLElement>(null);
  const setRef = useGlassSurface<HTMLElement>(useMergedRefs(ref, localRef));
  useMagnify(localRef, {
    itemSelector: ITEM_SELECTOR,
    rangeFactor: 3,
    ...NAVBAR_MAGNIFY,
    enabled: magnify,
  });

  return (
    <Comp
      ref={setRef}
      data-magnify={magnify || undefined}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        "lg-navbar",
        usePlate && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});

export const NavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(function NavbarBrand({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={cn("lg-navbar__brand", className)} {...props} />;
});

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position this group within the bar. `end` pushes it to the right, `center` centers it. */
  justify?: "start" | "center" | "end";
  asChild?: boolean;
}

export const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
  function NavbarContent({ className, justify = "start", asChild, ...props }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp ref={ref} data-justify={justify} className={cn("lg-navbar__content", className)} {...props} />
    );
  },
);

export interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  active?: boolean;
}

/**
 * A navbar entry (flat, hover-tinted). Defaults to a `<div>`; use `asChild` to make
 * it a link/button (`<NavbarItem asChild><a href>…</a></NavbarItem>`). Tagged for the
 * magnification engine.
 */
export const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(function NavbarItem(
  { className, asChild, active, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-navbar-item=""
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn("lg-navbar__item", className)}
      {...props}
    />
  );
});
