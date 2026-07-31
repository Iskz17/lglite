"use client";
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn, glassSurface, useGlass, useGlassSurface, type GlassSurfaceVariants } from "@lglite/glass-core";
import { Dialog, DialogContent } from "../dialog/dialog";
import "../dropdown-menu/dropdown-menu.css";
import "./command.css";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false" className="lg-command__icon">
    <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="m11 11 3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive>,
    GlassSurfaceVariants {
  plate?: boolean;
}

export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(function Command({ className, intensity, tone, frosted, plate, ...props }, ref) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <CommandPrimitive
      ref={surfaceRef}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        "lg-command",
        usePlate && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});

export interface CommandDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  children: React.ReactNode;
}

export const CommandDialog = ({ children, ...props }: CommandDialogProps) => (
  <Dialog {...props}>
    <DialogContent className="lg-command__dialog">
      <Command>{children}</Command>
    </DialogContent>
  </Dialog>
);

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(function CommandInput({ className, ...props }, ref) {
  return (
    <div className="lg-command__input-wrap">
      <SearchIcon />
      <CommandPrimitive.Input ref={ref} className={cn("lg-command__input", className)} {...props} />
    </div>
  );
});

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(function CommandList({ className, ...props }, ref) {
  return <CommandPrimitive.List ref={ref} className={cn("lg-command__list", className)} {...props} />;
});

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(function CommandEmpty({ className, ...props }, ref) {
  return <CommandPrimitive.Empty ref={ref} className={cn("lg-command__empty", className)} {...props} />;
});

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(function CommandGroup({ className, ...props }, ref) {
  return <CommandPrimitive.Group ref={ref} className={cn("lg-command__group", className)} {...props} />;
});

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(function CommandItem({ className, ...props }, ref) {
  return <CommandPrimitive.Item ref={ref} className={cn("lg-menu__item", className)} {...props} />;
});

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(function CommandSeparator({ className, ...props }, ref) {
  return <CommandPrimitive.Separator ref={ref} className={cn("lg-menu__sep", className)} {...props} />;
});

export const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("lg-menu__shortcut", className)} {...props} />
);
