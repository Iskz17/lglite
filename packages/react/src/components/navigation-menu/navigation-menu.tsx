"use client";
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "../dropdown-menu/dropdown-menu.css";
import "./navigation-menu.css";

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return <NavigationMenuPrimitive.List ref={ref} className={cn("lg-navmenu__list", className)} {...props} />;
});

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden focusable="false" className="lg-navmenu__trigger-icon">
    <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger ref={ref} className={cn("lg-navmenu__trigger", className)} {...props}>
      {children}
      <ChevronDown />
    </NavigationMenuPrimitive.Trigger>
  );
});

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return <NavigationMenuPrimitive.Content ref={ref} className={cn("lg-navmenu__content", className)} {...props} />;
});

export const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(function NavigationMenuLink({ className, ...props }, ref) {
  return <NavigationMenuPrimitive.Link ref={ref} className={cn("lg-navmenu__link", className)} {...props} />;
});

export const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(function NavigationMenuIndicator({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Indicator ref={ref} className={cn("lg-navmenu__indicator", className)} {...props}>
      <span className="lg-navmenu__indicator-arrow" />
    </NavigationMenuPrimitive.Indicator>
  );
});

export interface NavigationMenuViewportProps
  extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>,
    GlassSurfaceVariants {
  plate?: boolean;
}

/** The floating glass surface ([spec 04]) — only the viewport carries
 *  `backdrop-filter` (rim applies); triggers/links are flat for perf. */
export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(function NavigationMenuViewport({ className, intensity, tone, frosted, plate, ...props }, ref) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <div className="lg-navmenu__viewport-wrapper">
      <NavigationMenuPrimitive.Viewport
        ref={surfaceRef}
        className={cn(
          glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
          "lg-navmenu__viewport",
          usePlate && "lg-plate",
          className,
        )}
        {...props}
      />
    </div>
  );
});

export interface NavigationMenuProps
  extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  /** Glass variants forwarded to the floating viewport surface. */
  intensity?: GlassSurfaceVariants["intensity"];
  tone?: GlassSurfaceVariants["tone"];
  frosted?: GlassSurfaceVariants["frosted"];
  plate?: boolean;
}

/**
 * Glass navigation menu ([spec 04]) — renders its children (list of triggers)
 * plus a floating `NavigationMenuViewport` that is the glass surface. Glass
 * variants pass through to the viewport.
 */
export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(function NavigationMenu({ className, intensity, tone, frosted, plate, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Root ref={ref} className={cn("lg-navmenu", className)} {...props}>
      {children}
      <NavigationMenuViewport intensity={intensity} tone={tone} frosted={frosted} plate={plate} />
    </NavigationMenuPrimitive.Root>
  );
});
