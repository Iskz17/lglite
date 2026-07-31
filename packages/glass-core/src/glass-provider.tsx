"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { GlassContext, type GlassContextValue } from "./use-glass";
import { GlassFilters } from "./glass-filters";
import { refractionCapable } from "./chromium";
import type { LensName } from "./lens";

export interface GlassProviderProps {
  theme?: "light" | "dark";
  contrast?: "default" | "aa";
  reduceGlass?: boolean;
  intensity?: "subtle";
  lens?: LensName;
  radius?: number | string;
  blur?: number | string;
  nonce?: string;
  /** Render onto the consumer's element instead of the default display:contents box. */
  asChild?: boolean;
  children?: React.ReactNode;
}

const px = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/**
 * Injects glass CSS vars (no JS theme state — SSR-safe) and flips on the
 * `data-lg-refraction` gate on desktop Chromium ([D1]). The rim lens itself
 * mounts its `<filter>` lazily per surface (see glass-lens.tsx) and also sets the
 * gate, so refraction works even without this provider; the provider just makes
 * it explicit and SSR-friendly via the pre-paint <GlassScript>. DRY: every
 * surface reads tokens from here.
 */
export function GlassProvider({
  theme = "light",
  contrast = "default",
  reduceGlass = false,
  intensity,
  lens = "css",
  radius,
  blur,
  nonce,
  asChild,
  children,
}: GlassProviderProps) {
  // Reflect theme/contrast/reduce + the Chromium gate onto <html> so PORTALLED
  // overlays (Dialog, Popover, Tooltip, DropdownMenu) — which render outside this
  // provider's div — still inherit the right CSS vars (e.g. aa's opaque plate,
  // dark theme). Without this, a portalled plate stays at the glass-first 0.82.
  React.useEffect(() => {
    const html = document.documentElement;
    // capture prior values so unmount restores them (no stuck global theme).
    const prev = {
      theme: html.getAttribute("data-lg-theme"),
      contrast: html.getAttribute("data-lg-contrast"),
      reduce: html.getAttribute("data-lg-reduce-glass"),
    };
    const set = (k: string, v: string | null) =>
      v == null ? html.removeAttribute(k) : html.setAttribute(k, v);
    set("data-lg-theme", theme);
    set("data-lg-contrast", contrast);
    set("data-lg-reduce-glass", reduceGlass ? "true" : null);
    if (refractionCapable()) html.setAttribute("data-lg-refraction", "on");
    return () => {
      set("data-lg-theme", prev.theme);
      set("data-lg-contrast", prev.contrast);
      set("data-lg-reduce-glass", prev.reduce);
      // data-lg-refraction is a global capability gate — intentionally left on.
    };
  }, [theme, contrast, reduceGlass]);

  const ctx = React.useMemo<GlassContextValue>(
    () => ({ intensity, contrast, lens }),
    [intensity, contrast, lens],
  );

  const style: React.CSSProperties = { display: "contents" };
  if (radius != null) (style as Record<string, string>)["--glass-radius"] = px(radius);
  if (blur != null) (style as Record<string, string>)["--glass-blur"] = px(blur);

  const Comp = asChild ? Slot : "div";

  return (
    <GlassContext.Provider value={ctx}>
      <Comp
        data-lg-theme={theme}
        data-lg-contrast={contrast}
        data-lg-reduce-glass={reduceGlass || undefined}
        style={style}
      >
        <GlassFilters nonce={nonce} />
        {children}
      </Comp>
    </GlassContext.Provider>
  );
}
