"use client";
import * as React from "react";
import { springs, prefersReducedMotion } from "@lglite/glass-core";

/**
 * Pointer-proximity magnification, shared by Dock and Navbar (DRY). A pure curve
 * plus ONE rAF spring loop with ONE `pointermove` listener on the container. The
 * loop runs only while something is in motion and stops the instant everything
 * settles (no idle rAF). Transform-only writes; disabled wholesale under
 * reduced-motion so the surface stays static and operable.
 */

export interface MagnifyConfig {
  /** Peak scale at the pointer. */
  maxScale: number;
  /** Peak upward lift (px) at the pointer. */
  maxLift: number;
}

/**
 * Pure magnification curve ([spec 10.3] — unit-tested). Squared falloff eases the
 * curve so neighbours grow gently. No DOM, no state.
 */
export function magnifyValue(
  pointerX: number,
  centerX: number,
  range: number,
  { maxScale, maxLift }: MagnifyConfig,
): { scale: number; lift: number } {
  const influence = Math.min(1, Math.max(0, 1 - Math.abs(pointerX - centerX) / range));
  return {
    scale: 1 + influence * influence * (maxScale - 1),
    lift: influence * maxLift,
  };
}

interface ItemSpring {
  scale: number;
  scaleV: number;
  lift: number;
  liftV: number;
}

export interface UseMagnifyOptions extends MagnifyConfig {
  /** Selector for the magnifiable items within the container. */
  itemSelector: string;
  /** Influence range factor: RANGE = factor × item size. */
  rangeFactor: number;
  /** When false, no listeners attach (e.g. Navbar without `magnify`). */
  enabled?: boolean;
}

export function useMagnify(
  barRef: React.RefObject<HTMLElement | null>,
  { itemSelector, rangeFactor, maxScale, maxLift, enabled = true }: UseMagnifyOptions,
) {
  const frame = React.useRef(0);
  const pointerX = React.useRef<number | null>(null); // null = pointer absent → spring to rest
  const springsRef = React.useRef<ItemSpring[]>([]);

  // Track reduced-motion LIVE so toggling the OS setting mid-session re-attaches or
  // tears down the spring (not just read-once-at-mount). The CSS `transform: none`
  // also guards the visual, but this keeps the listeners honest.
  const [reduced, setReduced] = React.useState(prefersReducedMotion);
  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar || !enabled || reduced) return;

    const dt = 1 / 60;
    const { stiffness, damping } = springs.magnify;
    const items = () => Array.from(bar.querySelectorAll<HTMLElement>(itemSelector));

    const step = () => {
      const el = barRef.current;
      if (!el) {
        frame.current = 0;
        return;
      }
      const els = items();
      const barLeft = el.getBoundingClientRect().left;
      const base = els[0]?.offsetWidth || 48;
      const range = rangeFactor * base;
      const px = pointerX.current;
      let moving = false;

      els.forEach((node, i) => {
        const s = (springsRef.current[i] ??= { scale: 1, scaleV: 0, lift: 0, liftV: 0 });
        let targetScale = 1;
        let targetLift = 0;
        if (px != null) {
          // offsetLeft is layout-relative to the bar and immune to our scale
          // transform, so centers stay stable as items grow. Pointer X → bar space.
          const center = node.offsetLeft + node.offsetWidth / 2;
          const m = magnifyValue(px - barLeft, center, range, { maxScale, maxLift });
          targetScale = m.scale;
          targetLift = m.lift;
        }
        s.scaleV += (-stiffness * (s.scale - targetScale) - damping * s.scaleV) * dt;
        s.scale += s.scaleV * dt;
        s.liftV += (-stiffness * (s.lift - targetLift) - damping * s.liftV) * dt;
        s.lift += s.liftV * dt;

        const settled =
          Math.abs(s.scale - targetScale) < 0.0005 &&
          Math.abs(s.scaleV) < 0.0005 &&
          Math.abs(s.lift - targetLift) < 0.01 &&
          Math.abs(s.liftV) < 0.01;
        if (settled) {
          s.scale = targetScale;
          s.scaleV = 0;
          s.lift = targetLift;
          s.liftV = 0;
        } else {
          moving = true;
        }
        node.style.transform = `translateY(${-s.lift}px) scale(${s.scale})`;
      });

      if (moving) {
        frame.current = requestAnimationFrame(step);
      } else {
        frame.current = 0;
        if (px == null) {
          els.forEach((node) => {
            node.style.transform = "";
            node.style.willChange = "";
          });
        }
      }
    };

    const ensure = () => {
      if (!frame.current) frame.current = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // magnification is a fine-pointer affordance
      pointerX.current = e.clientX;
      items().forEach((node) => (node.style.willChange = "transform"));
      ensure();
    };
    const onLeave = () => {
      pointerX.current = null;
      ensure();
    };

    bar.addEventListener("pointermove", onMove);
    bar.addEventListener("pointerleave", onLeave);
    return () => {
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerleave", onLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [barRef, itemSelector, rangeFactor, maxScale, maxLift, enabled, reduced]);
}
