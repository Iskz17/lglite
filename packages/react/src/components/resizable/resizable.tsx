"use client";
import * as React from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { cn, useGlassLens, useMergedRefs } from "@lglite/glass-core";
import "./resizable.css";

/** A resizable panel layout ([flat] — no glass material; the handle is a glass
 *  divider). Thin wrappers over react-resizable-panels. PanelGroup exposes an
 *  imperative ref (not a DOM ref), so we don't forwardRef here (matches shadcn). */
export const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) => (
  <PanelGroup className={cn("lg-resizable", className)} {...props} />
);

export const ResizablePanel = Panel;

export interface ResizableHandleProps
  extends React.ComponentPropsWithoutRef<typeof PanelResizeHandle> {
  withHandle?: boolean;
  /** Denser frosted material on the grip nub. Opt-in (default off). */
  frosted?: boolean;
  /** Live-backdrop refraction (Liquid Glass) on the grip nub. Opt-in (default off).
   *  `PanelResizeHandle` exposes no DOM ref, so the lens attaches to the grip nub —
   *  it requires `withHandle`. */
  lens?: boolean;
}

/** The drag divider: a bespoke-glass rim line that brightens on hover/focus.
 *  `withHandle` renders a small glass-rimmed grip nub (frosted + lens land here). */
export const ResizableHandle = function ResizableHandle({
  withHandle,
  frosted = false,
  lens = false,
  className,
  ...props
}: ResizableHandleProps) {
  const gripLens = useGlassLens<HTMLDivElement>();
  const setGripRef = useMergedRefs<HTMLDivElement>(lens && withHandle ? gripLens : undefined);
  return (
    <PanelResizeHandle className={cn("lg-resizable__handle", className)} {...props}>
      {withHandle && (
        <div
          ref={setGripRef}
          className={cn(
            "lg-resizable__grip",
            lens && "lg-lens",
            frosted && "lg-frosted",
          )}
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10" focusable="false">
            <circle cx="5" cy="2" r="0.8" fill="currentColor" />
            <circle cx="5" cy="5" r="0.8" fill="currentColor" />
            <circle cx="5" cy="8" r="0.8" fill="currentColor" />
          </svg>
        </div>
      )}
    </PanelResizeHandle>
  );
};
