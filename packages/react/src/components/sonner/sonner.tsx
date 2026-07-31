"use client";
import * as React from "react";
import { Toaster as SonnerPrimitive, toast } from "sonner";
import { cn, attachGlassLens } from "@lglite/glass-core";
import "./sonner.css";

export type ToasterProps = React.ComponentProps<typeof SonnerPrimitive> & {
  /** Denser frosted Liquid Glass material on every toast. */
  frosted?: boolean;
};

/**
 * sonner renders toasts into its own portal, so we never get a React ref to attach
 * the refraction lens to (unlike every other Surface). Observe the document for
 * `.lg-toast` nodes appearing/leaving and attach/detach the imperative lens — this
 * gives toasts the real edge refraction, not just CSS frost. Chromium-gated +
 * a11y-stripped inside attachGlassLens, so it's a no-op elsewhere.
 */
function useToastLens() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const cleanups = new Map<Element, () => void>();
    const add = (el: Element) => {
      if (!(el instanceof HTMLElement) || cleanups.has(el)) return;
      cleanups.set(el, attachGlassLens(el));
    };
    const scan = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.classList.contains("lg-toast")) add(node);
      node.querySelectorAll?.(".lg-toast").forEach(add);
    };
    document.querySelectorAll(".lg-toast").forEach(add);
    const obs = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach(scan);
        r.removedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          const kill = (el: Element) => { cleanups.get(el)?.(); cleanups.delete(el); };
          if (n.classList.contains("lg-toast")) kill(n);
          n.querySelectorAll?.(".lg-toast").forEach(kill);
        });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      obs.disconnect();
      cleanups.forEach((c) => c());
      cleanups.clear();
    };
  }, []);
}

export function Toaster({ toastOptions, frosted, ...props }: ToasterProps) {
  useToastLens();
  return (
    <SonnerPrimitive
      toastOptions={{
        // CRITICAL: sonner's default styles are UNLAYERED, so they beat our
        // layered .lg-surface (unlayered always wins over @layer) — the toast
        // rendered opaque, no glass. `unstyled` drops sonner's box styling so our
        // classNames own the material entirely (the Toaster container positioning
        // is unaffected). Callers can still override per-toast.
        unstyled: true,
        ...toastOptions,
        classNames: {
          // lg-surface = the engine glass material + the a11y.css fallbacks
          // (forced-colors / reduced-transparency / reduce-glass). lg-toast only
          // adds toast layout — never re-implement the glass (contract rule 6).
          toast: cn("lg-surface lg-toast", frosted && "lg-frosted"),
          title: "lg-toast__title",
          description: "lg-toast__description",
          actionButton: "lg-toast__action",
          cancelButton: "lg-toast__cancel",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { toast };
