"use client";
import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import "./dropdown-menu.css";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuPortal = MenuPrimitive.Portal;
export const DropdownMenuSub = MenuPrimitive.Sub;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

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

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>,
    GlassSurfaceVariants {
  plate?: boolean;
}

/** Glass menu panel ([spec 23]) — only the panel carries `backdrop-filter` (rim
 *  applies); items are flat for perf. SubContent shares the same treatment. */
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Content>,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { className, intensity, tone, frosted, plate, sideOffset = 6, children, ...props },
  ref,
) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={surfaceRef}
        sideOffset={sideOffset}
        className={cn(
          glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
          "lg-menu",
          usePlate && "lg-plate",
          className,
        )}
        {...props}
      >
        {children}
      </MenuPrimitive.Content>
    </MenuPrimitive.Portal>
  );
});

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent> & GlassSurfaceVariants
>(function DropdownMenuSubContent({ className, intensity, tone, frosted, ...props }, ref) {
  const glass = useGlass();
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <MenuPrimitive.SubContent
      ref={surfaceRef}
      className={cn(glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }), "lg-menu", className)}
      {...props}
    />
  );
});

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & { inset?: boolean }
>(function DropdownMenuItem({ className, inset, ...props }, ref) {
  return (
    <MenuPrimitive.Item
      ref={ref}
      className={cn("lg-menu__item", inset && "lg-menu__item--inset", className)}
      {...props}
    />
  );
});

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.CheckboxItem ref={ref} className={cn("lg-menu__item lg-menu__item--inset", className)} {...props}>
      <span className="lg-menu__indicator">
        <MenuPrimitive.ItemIndicator><CheckIcon /></MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
});

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.RadioItem ref={ref} className={cn("lg-menu__item lg-menu__item--inset", className)} {...props}>
      <span className="lg-menu__indicator">
        <MenuPrimitive.ItemIndicator><DotIcon /></MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
});

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }
>(function DropdownMenuSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <MenuPrimitive.SubTrigger
      ref={ref}
      className={cn("lg-menu__item", inset && "lg-menu__item--inset", className)}
      {...props}
    >
      {children}
      <ChevronRight />
    </MenuPrimitive.SubTrigger>
  );
});

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & { inset?: boolean }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return <MenuPrimitive.Label ref={ref} className={cn("lg-menu__label", inset && "lg-menu__item--inset", className)} {...props} />;
});

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <MenuPrimitive.Separator ref={ref} className={cn("lg-menu__sep", className)} {...props} />;
});

export const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("lg-menu__shortcut", className)} {...props} />
);
