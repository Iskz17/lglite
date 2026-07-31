"use client";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  cn,
  glassSurface,
  useGlass,
  useGlassSurface,
  type GlassSurfaceVariants,
} from "@lglite/glass-core";
import "./accordion.css";

// Root is a discriminated union (single | multiple) → type intersection, not interface.
export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> &
  GlassSurfaceVariants & { plate?: boolean };

/** Surface treatment ([spec 16]: panels can be Surface) — the accordion is a glass
 *  panel (one backdrop-filter for the whole list; rows are flat dividers inside).
 *  Honors `frosted` / `tone` / `plate` like every other Surface. */
export const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(function Accordion({ className, intensity, tone, frosted, plate, ...props }, ref) {
  const glass = useGlass();
  const usePlate = plate || glass.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(ref);
  return (
    <AccordionPrimitive.Root
      ref={surfaceRef}
      className={cn(
        glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
        "lg-accordion",
        usePlate && "lg-plate",
        className,
      )}
      {...props}
    />
  );
});

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return <AccordionPrimitive.Item ref={ref} className={cn("lg-accordion__item", className)} {...props} />;
});

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    aria-hidden
    focusable="false"
    className="lg-accordion__chevron"
  >
    <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="lg-accordion__header">
      <AccordionPrimitive.Trigger ref={ref} className={cn("lg-accordion__trigger", className)} {...props}>
        {children}
        <ChevronDown />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content ref={ref} className={cn("lg-accordion__content", className)} {...props}>
      <div className="lg-accordion__content-inner">{children}</div>
    </AccordionPrimitive.Content>
  );
});
