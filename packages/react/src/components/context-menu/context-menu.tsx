"use client";
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
// Reuse the DropdownMenu glass panel + item styling (DRY).
import "../dropdown-menu/dropdown-menu.css";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

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

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>,
    GlassSurfaceVariants {
  plate?: boolean;
}

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(function ContextMenuContent({ className, intensity, tone, frosted, plate, ...props }, ref) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={surfaceRef}
        className={cn(glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }), "lg-menu", usePlate && "lg-plate", className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
});

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & GlassSurfaceVariants
>(function ContextMenuSubContent({ className, intensity, tone, frosted, ...props }, ref) {
  const glass = useGlass();
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <ContextMenuPrimitive.SubContent
      ref={surfaceRef}
      className={cn(glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }), "lg-menu", className)}
      {...props}
    />
  );
});

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & { inset?: boolean }
>(function ContextMenuItem({ className, inset, ...props }, ref) {
  return <ContextMenuPrimitive.Item ref={ref} className={cn("lg-menu__item", inset && "lg-menu__item--inset", className)} {...props} />;
});

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(function ContextMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.CheckboxItem ref={ref} className={cn("lg-menu__item lg-menu__item--inset", className)} {...props}>
      <span className="lg-menu__indicator"><ContextMenuPrimitive.ItemIndicator><CheckIcon /></ContextMenuPrimitive.ItemIndicator></span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(function ContextMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.RadioItem ref={ref} className={cn("lg-menu__item lg-menu__item--inset", className)} {...props}>
      <span className="lg-menu__indicator"><ContextMenuPrimitive.ItemIndicator><DotIcon /></ContextMenuPrimitive.ItemIndicator></span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }
>(function ContextMenuSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.SubTrigger ref={ref} className={cn("lg-menu__item", inset && "lg-menu__item--inset", className)} {...props}>
      {children}
      <ChevronRight />
    </ContextMenuPrimitive.SubTrigger>
  );
});

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & { inset?: boolean }
>(function ContextMenuLabel({ className, inset, ...props }, ref) {
  return <ContextMenuPrimitive.Label ref={ref} className={cn("lg-menu__label", inset && "lg-menu__item--inset", className)} {...props} />;
});

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(function ContextMenuSeparator({ className, ...props }, ref) {
  return <ContextMenuPrimitive.Separator ref={ref} className={cn("lg-menu__sep", className)} {...props} />;
});

export const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("lg-menu__shortcut", className)} {...props} />
);
