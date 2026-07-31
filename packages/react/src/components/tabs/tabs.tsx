"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn, glassSurface, useGlass, useGlassLens, useMergedRefs, type GlassSurfaceVariants } from "@lglite/glass-core";
import "./tabs.css";

export const Tabs = TabsPrimitive.Root;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    GlassSurfaceVariants {}

/** Glass tablist ([spec 22]). The list is the surface (rim applies); triggers are
 *  flat; one glass pill slides behind the active trigger (measured in JS). */
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(function TabsList({ className, intensity, tone, frosted, children, ...props }, ref) {
  const glass = useGlass();
  const lensRef = useGlassLens<HTMLDivElement>();
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const setRef = useMergedRefs<HTMLDivElement>(ref, lensRef, listRef);

  React.useEffect(() => {
    const list = listRef.current;
    const ind = indicatorRef.current;
    if (!list || !ind) return;
    let first = true;
    const position = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) {
        ind.style.opacity = "0";
        return;
      }
      if (first) ind.style.transition = "none"; // no slide-from-origin on mount
      const vertical = list.getAttribute("data-orientation") === "vertical";
      if (vertical) {
        ind.style.transform = `translateY(${active.offsetTop}px)`;
        ind.style.height = `${active.offsetHeight}px`;
        ind.style.width = ""; // left/right pin the width
      } else {
        ind.style.transform = `translateX(${active.offsetLeft}px)`;
        ind.style.width = `${active.offsetWidth}px`;
        ind.style.height = ""; // top/bottom pin the height
      }
      ind.style.opacity = "1";
      if (first) {
        void ind.offsetWidth; // flush, then restore the CSS transition
        ind.style.transition = "";
        first = false;
      }
    };
    position();
    const mo = new MutationObserver(position);
    // data-state (active tab changes) + data-orientation (h/v flip → axis change)
    mo.observe(list, { attributes: true, subtree: true, attributeFilter: ["data-state", "data-orientation"] });
    const ro = new ResizeObserver(position);
    ro.observe(list);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={setRef}
      data-tone={tone}
      className={cn(glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }), "lg-tabs__list", className)}
      {...props}
    >
      <span ref={indicatorRef} className="lg-tabs__indicator" aria-hidden />
      {children}
    </TabsPrimitive.List>
  );
});

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return <TabsPrimitive.Trigger ref={ref} className={cn("lg-tabs__trigger", className)} {...props} />;
});

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return <TabsPrimitive.Content ref={ref} className={cn("lg-tabs__content", className)} {...props} />;
});
