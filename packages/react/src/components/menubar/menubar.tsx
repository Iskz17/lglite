"use client";
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "../dropdown-menu/dropdown-menu.css";
import "./menubar.css";

// Explicit annotation avoids TS2742 (inferred type names an internal Radix context path).
export const MenubarMenu: typeof MenubarPrimitive.Menu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarPortal = MenubarPrimitive.Portal;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
export const MenubarSub = MenubarPrimitive.Sub;

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden focusable="false">
    <path d="M13 4.5 6.5 11 3 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden focusable="false">
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden focusable="false" className="lg-menu__chevron">
    <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface MenubarProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>,
    GlassSurfaceVariants {
  plate?: boolean;
}

/**
 * Glass menubar ([spec 04]) — the bar is one glass surface (rim applies via
 * `useGlassSurface`); triggers/items are flat (tint/hover only) for perf. Menu
 * panels reuse the DropdownMenu `.lg-menu` treatment.
 */
export const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  MenubarProps
>(function Menubar({ className, intensity, tone, frosted, plate, ...props }, ref) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <MenubarPrimitive.Root
      ref={surfaceRef}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        "lg-menubar",
        usePlate && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(function MenubarTrigger({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Trigger ref={ref} className={cn("lg-menubar__trigger", className)} {...props} />
  );
});

export interface MenubarContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>,
    GlassSurfaceVariants {
  plate?: boolean;
}

/** Glass menu panel — only the panel carries `backdrop-filter` (rim applies);
 *  items are flat for perf. SubContent shares the same treatment. */
export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  MenubarContentProps
>(function MenubarContent(
  { className, intensity, tone, frosted, plate, align = "start", sideOffset = 6, alignOffset = -3, children, ...props },
  ref,
) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={surfaceRef}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
          "lg-menu",
          usePlate && "lg-plate",
          className,
        )}
        {...props}
      >
        {children}
      </MenubarPrimitive.Content>
    </MenubarPrimitive.Portal>
  );
});

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> & GlassSurfaceVariants
>(function MenubarSubContent({ className, intensity, tone, frosted, ...props }, ref) {
  const glass = useGlass();
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <MenubarPrimitive.SubContent
      ref={surfaceRef}
      className={cn(glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }), "lg-menu", className)}
      {...props}
    />
  );
});

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }
>(function MenubarItem({ className, inset, ...props }, ref) {
  return (
    <MenubarPrimitive.Item
      ref={ref}
      className={cn("lg-menu__item", inset && "lg-menu__item--inset", className)}
      {...props}
    />
  );
});

export const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(function MenubarCheckboxItem({ className, children, ...props }, ref) {
  return (
    <MenubarPrimitive.CheckboxItem ref={ref} className={cn("lg-menu__item lg-menu__item--inset", className)} {...props}>
      <span className="lg-menu__indicator">
        <MenubarPrimitive.ItemIndicator><CheckIcon /></MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});

export const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(function MenubarRadioItem({ className, children, ...props }, ref) {
  return (
    <MenubarPrimitive.RadioItem ref={ref} className={cn("lg-menu__item lg-menu__item--inset", className)} {...props}>
      <span className="lg-menu__indicator">
        <MenubarPrimitive.ItemIndicator><DotIcon /></MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(function MenubarSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      className={cn("lg-menu__item", inset && "lg-menu__item--inset", className)}
      {...props}
    >
      {children}
      <ChevronRight />
    </MenubarPrimitive.SubTrigger>
  );
});

export const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(function MenubarLabel({ className, inset, ...props }, ref) {
  return <MenubarPrimitive.Label ref={ref} className={cn("lg-menu__label", inset && "lg-menu__item--inset", className)} {...props} />;
});

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(function MenubarSeparator({ className, ...props }, ref) {
  return <MenubarPrimitive.Separator ref={ref} className={cn("lg-menu__sep", className)} {...props} />;
});

export const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("lg-menu__shortcut", className)} {...props} />
);
