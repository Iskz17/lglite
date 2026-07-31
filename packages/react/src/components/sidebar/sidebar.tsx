"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  cn,
  glassSurface,
  useGlass,
  useGlassSurface,
  type GlassSurfaceVariants,
} from "@lglite/glass-core";
import "./sidebar.css";

export interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    GlassSurfaceVariants {
  plate?: boolean;
  side?: "left" | "right";
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { className, intensity, tone, frosted, plate, side = "left", ...props },
  ref,
) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLElement>(ref);
  return (
    <aside
      ref={surfaceRef}
      data-side={side}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        "lg-sidebar",
        usePlate && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("lg-sidebar__header", className)} {...props} />;
  },
);

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("lg-sidebar__content", className)} {...props} />;
  },
);

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("lg-sidebar__footer", className)} {...props} />;
  },
);

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroup({ className, ...props }, ref) {
    return <div ref={ref} className={cn("lg-sidebar__group", className)} {...props} />;
  },
);

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarGroupLabel({ className, ...props }, ref) {
  return <div ref={ref} className={cn("lg-sidebar__group-label", className)} {...props} />;
});

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  function SidebarMenu({ className, ...props }, ref) {
    return <ul ref={ref} className={cn("lg-sidebar__menu", className)} {...props} />;
  },
);

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(function SidebarMenuItem({ className, ...props }, ref) {
  return <li ref={ref} className={cn("lg-sidebar__menu-item", className)} {...props} />;
});

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ className, asChild, ...props }, ref) {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn("lg-sidebar__menu-button", className)} {...props} />;
  },
);
