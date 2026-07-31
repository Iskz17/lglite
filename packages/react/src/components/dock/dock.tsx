"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  cn,
  glassSurface,
  useGlass,
  useGlassSurface,
  useMergedRefs,
  useNameWarning,
  type GlassSurfaceVariants,
} from "@lglite/glass-core";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../tooltip/tooltip";
import { useMagnify, magnifyValue, type MagnifyConfig } from "../../internal/magnify";
import "./dock.css";

// Magnification peak ([spec 10.3]). RANGE = RANGE_FACTOR × item size.
const DOCK_MAGNIFY: MagnifyConfig = { maxScale: 1.6, maxLift: 12 };
const RANGE_FACTOR = 2.5;

/** Dock's pure magnification curve (unit-tested) — the shared curve at dock strength. */
export function dockMagnify(pointerX: number, centerX: number, range: number) {
  return magnifyValue(pointerX, centerX, range, DOCK_MAGNIFY);
}

interface DockContextValue {
  itemGlass: boolean;
}
const DockContext = React.createContext<DockContextValue>({ itemGlass: false });

const ITEM_SELECTOR = "[data-dock-item]:not([disabled])";

// Read NODE_ENV off globalThis so the browser build needs no node types (mirrors dev-warn.ts).
const isProd =
  (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV ===
  "production";

export interface DockProps extends React.HTMLAttributes<HTMLDivElement>, GlassSurfaceVariants {
  /** Per-item refraction (hero docks only). Over the perf budget when >3 items — warns in dev. */
  itemGlass?: boolean;
  /** Influence range factor: RANGE = factor × item size. Default 2.5. */
  rangeFactor?: number;
}

/**
 * macOS-style floating Dock ([spec 10]). The bar is a SINGLE glass surface (one
 * backdrop-filter — the perf budget). Items magnify on pointer proximity via a JS
 * spring; transform-only, reduced-motion-safe, keyboard-operable (toolbar roving).
 */
export const Dock = React.forwardRef<HTMLDivElement, DockProps>(function Dock(
  {
    className,
    intensity,
    tone,
    frosted,
    itemGlass = false,
    rangeFactor = RANGE_FACTOR,
    children,
    onKeyDown,
    ...props
  },
  ref,
) {
  const glass = useGlass();
  const localRef = React.useRef<HTMLDivElement>(null);
  const setRef = useGlassSurface<HTMLDivElement>(useMergedRefs(ref, localRef));
  useMagnify(localRef, { itemSelector: ITEM_SELECTOR, rangeFactor, ...DOCK_MAGNIFY });

  if (!isProd && itemGlass) {
    const count = React.Children.toArray(children).length;
    if (count > 3) {
      console.warn(
        `[lglite] <Dock itemGlass> renders ${count} live glass surfaces — over the backdrop-filter budget ([spec 10.4]). itemGlass is hero-only; keep it to ≤3 items.`,
      );
    }
  }

  // Roving tabindex ([spec 10.5]): keep exactly one item tabbable; arrows move
  // focus + the tab stop. React never sets tabIndex (no prop), so these DOM writes
  // are authoritative — no fight with re-renders. Enter/Space activate natively.
  const setRoving = React.useCallback((active: HTMLElement | null) => {
    const bar = localRef.current;
    if (!bar) return;
    const els = Array.from(bar.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    const target = active && els.includes(active) ? active : els[0];
    els.forEach((el) => (el.tabIndex = el === target ? 0 : -1));
  }, []);

  React.useLayoutEffect(() => {
    const bar = localRef.current;
    if (!bar) return;
    const els = Array.from(bar.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    // Initialise (or repair after children change) without stealing an active stop.
    if (!els.some((el) => el.tabIndex === 0)) setRoving(els[0] ?? null);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const bar = localRef.current;
    if (!bar) return;
    const els = Array.from(bar.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    const idx = els.indexOf(document.activeElement as HTMLElement);
    if (idx === -1) return;
    let next = idx;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (idx + 1) % els.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (idx - 1 + els.length) % els.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = els.length - 1;
        break;
      default:
        return;
    }
    const target = els[next];
    if (!target) return;
    e.preventDefault();
    setRoving(target);
    target.focus();
  };

  return (
    <DockContext.Provider value={{ itemGlass }}>
      {/* self-contained so <Dock> works without an app-level provider; nesting under
          an existing TooltipProvider is harmless. Short delay = dock-like labels. */}
      <TooltipProvider delayDuration={300}>
        <div
          ref={setRef}
          role="toolbar"
          aria-orientation="horizontal"
          className={cn(
            glassSurface({ intensity: intensity ?? glass.intensity, tone, frosted }),
            "lg-dock",
            className,
          )}
          onKeyDown={handleKeyDown}
          onFocusCapture={(e) => setRoving(e.target as HTMLElement)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </DockContext.Provider>
  );
});

export interface DockItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name + the hover/focus label. Required ([spec 10.5]). */
  label: string;
  /** Icon node (preferred). Falls back to `children`. */
  icon?: React.ReactNode;
  asChild?: boolean;
}

/**
 * One dock item. A flat icon button by default (items are NOT individually glass —
 * that would be N backdrop-filters). Refracts only when the parent sets `itemGlass`.
 */
export const DockItem = React.forwardRef<HTMLButtonElement, DockItemProps>(function DockItem(
  { className, label, icon, children, asChild, ...props },
  ref,
) {
  const { itemGlass } = React.useContext(DockContext);
  const Comp = asChild ? Slot : "button";
  const localRef = React.useRef<HTMLButtonElement>(null);
  const setRef = useGlassSurface<HTMLButtonElement>(useMergedRefs(ref, localRef), itemGlass);
  useNameWarning(localRef, "DockItem");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Comp
          ref={setRef}
          data-dock-item=""
          aria-label={label}
          className={cn("lg-dock__item", itemGlass && glassSurface({ intensity: "subtle" }), className)}
          {...props}
        >
          {icon ?? children}
        </Comp>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
});
