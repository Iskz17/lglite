"use client";
import * as React from "react";
import { bakeRimMap, RIM_BAND, RIM_SCALE, RIM_SATURATE } from "./edge-ramp";
import { refractionCapable } from "./chromium";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * The filter primitive chain (built once per size bucket — cheap vs. the canvas
 * bake). CSS applies the BAND blur (the sharper of the two) before this filter,
 * so `SourceGraphic` is already frosted with clean edges. This filter then:
 *   1. displaces the band-frosted backdrop by the SDF map → edge-only refraction
 *   2. adds `extraSigma` blur → brings the interior up to the (softer) open-part
 *      blur. `extraSigma = √(interior² − band²)` so band⊕extra = interior.
 *   3. saturates the displaced (band-blur) result → the band's colour pop
 *   4. masks the pop to the band (blue channel) and composites it OVER the
 *      interior-blurred base — so the band keeps its sharper blur, the open part
 *      is softer, and the band cleanly covers any blur bleed at the very edge.
 */
function filterInner(mapUrl: string, w: number, h: number, extraSigma: number): string {
  return (
    `<feImage href="${mapUrl}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>` +
    // negative scale → sample INWARD (the backdrop only exists inside the box);
    // an outward sample would fall outside the filter region and just clamp.
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${-RIM_SCALE}" xChannelSelector="R" yChannelSelector="G" result="disp"/>` +
    `<feGaussianBlur in="disp" stdDeviation="${extraSigma.toFixed(2)}" result="open"/>` +
    `<feColorMatrix in="disp" type="saturate" values="${RIM_SATURATE}" result="bsat"/>` +
    // map's blue channel (band coverage) → an alpha mask
    `<feColorMatrix in="map" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0" result="bandA"/>` +
    `<feComposite in="bsat" in2="bandA" operator="in" result="band"/>` +
    `<feMerge><feMergeNode in="open"/><feMergeNode in="band"/></feMerge>`
  );
}

/** Lazily create the one shared, offscreen <svg> that holds all rim <filter>s. */
function defsRoot(): SVGSVGElement {
  let svg = document.getElementById("lg-rim-defs") as SVGSVGElement | null;
  if (!svg) {
    svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
    svg.id = "lg-rim-defs";
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    document.body.appendChild(svg);
  }
  return svg;
}

/**
 * Shared <filter> pool keyed by geometry (size + radius + extra blur). N surfaces
 * of the same size share ONE <filter> node (ref-counted; removed at 0 refs), so a
 * grid of identical cards doesn't mint a filter graph apiece. The canvas bake is
 * already cached by geometry in edge-ramp.ts, so a pool miss is still cheap.
 */
interface PoolEntry {
  id: string;
  node: SVGElement;
  refs: number;
}
const pool = new Map<string, PoolEntry>();
let poolSeq = 0;

function acquireFilter(key: string, w: number, h: number, extraSigma: number, mapUrl: string): string {
  let entry = pool.get(key);
  if (!entry) {
    const node = document.createElementNS(SVG_NS, "filter");
    const id = `lg-rim-${poolSeq++}`;
    node.setAttribute("id", id);
    node.setAttribute("filterUnits", "userSpaceOnUse");
    node.setAttribute("primitiveUnits", "userSpaceOnUse");
    node.setAttribute("color-interpolation-filters", "sRGB");
    node.setAttribute("x", "0");
    node.setAttribute("y", "0");
    node.setAttribute("width", String(w));
    node.setAttribute("height", String(h));
    node.innerHTML = filterInner(mapUrl, w, h, extraSigma);
    defsRoot().appendChild(node);
    entry = { id, node, refs: 0 };
    pool.set(key, entry);
  }
  entry.refs++;
  return entry.id;
}

function releaseFilter(key: string): void {
  const entry = pool.get(key);
  if (!entry) return;
  if (--entry.refs <= 0) {
    entry.node.remove();
    pool.delete(key);
  }
}

/**
 * Edge-refraction lens (Chromium only — [D1]), imperative form. Bakes a rounded-rect
 * displacement map, acquires a shared `userSpaceOnUse` <filter> for the element's size,
 * and points its backdrop-filter at the filter via the `--lg-rim-filter` CSS var
 * (consumed by the gated rule in surface.css). Flips on the `data-lg-refraction` gate
 * so refraction works without a provider. Re-bakes (rAF-coalesced) on resize. Returns
 * a cleanup fn. No-op (returns a noop) off desktop Chromium / SSR. Use this directly
 * for nodes you don't own a React ref to (e.g. portalled toast DOM from sonner);
 * otherwise use the `useGlassLens` ref-callback wrapper below.
 */
export function attachGlassLens(el: HTMLElement): () => void {
  if (typeof document === "undefined" || !refractionCapable()) return () => {};

  // Enable the CSS gate ourselves (idempotent) so a surface refracts even with
  // no <GlassProvider>/<GlassScript> mounted — no baking work that never shows.
  document.documentElement.setAttribute("data-lg-refraction", "on");

  let currentKey = "";
  let raf = 0;
  const apply = () => {
      const cs = getComputedStyle(el);
      // offsetWidth/Height = LAYOUT size, immune to the open-animation `scale`
      // transform. getBoundingClientRect() includes the transform, so baking
      // during the morph-in produced a distorted filter region (wrong shape until
      // a later re-measure). ResizeObserver reports the same transform-free box.
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w < 2 || h < 2) return;
      const radius = parseFloat(cs.borderTopLeftRadius) || 0;
      // CSS lays down the band blur; the filter adds the extra to reach the
      // (softer) open/interior blur. band is clamped ≤ open in edge-ramp math.
      const open = parseFloat(cs.getPropertyValue("--glass-blur")) || 0;
      const bandBlur = parseFloat(cs.getPropertyValue("--glass-rim-blur")) || open;
      const extraSigma = Math.sqrt(Math.max(0, open * open - bandBlur * bandBlur));
      const key = `${w}x${h}x${radius}x${extraSigma.toFixed(2)}`;
      if (key === currentKey) return;
      // bakeRimMap is a per-pixel SDF loop + PNG encode — far too costly to re-run every frame of a
      // resize animation (e.g. the accordion's `height` keyframe), which is what made expanding stutter.
      // Bake at dimensions bucketed to BAKE_STEP px so consecutive animation frames reuse one cached
      // bake; the feImage stretches that map (preserveAspectRatio="none") to the exact w/h below, and the
      // filter region stays the element's true size — so the lens still aligns and only the rim's
      // sub-bucket shape differs mid-animation.
      const BAKE_STEP = 16;
      const bakeW = Math.max(2, Math.round(w / BAKE_STEP) * BAKE_STEP);
      const bakeH = Math.max(2, Math.round(h / BAKE_STEP) * BAKE_STEP);
      const url = bakeRimMap({ w: bakeW, h: bakeH, radius, band: RIM_BAND });
      if (!url) return;
      const id = acquireFilter(key, w, h, extraSigma, url);
      if (currentKey) releaseFilter(currentKey); // swap buckets on resize
      currentKey = key;
      el.style.setProperty("--lg-rim-filter", `url(#${id})`);
    };

    apply(); // immediate, so the rim is correct on first paint
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(el);

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (currentKey) releaseFilter(currentKey);
      el.style.removeProperty("--lg-rim-filter");
    };
}

/**
 * Edge-refraction lens as a React ref callback (the common case). Wraps
 * `attachGlassLens`, tearing down + re-attaching as the element changes. No-op
 * off desktop Chromium / SSR, leaving the plain CSS frost + border fallback.
 */
export function useGlassLens<T extends HTMLElement = HTMLElement>(): React.RefCallback<T> {
  const cleanupRef = React.useRef<(() => void) | null>(null);
  return React.useCallback((el: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = el ? attachGlassLens(el) : null;
  }, []);
}

/** Merge several refs into one stable callback ref (no churn across renders). */
export function useMergedRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  const latest = React.useRef(refs);
  latest.current = refs;
  return React.useCallback((val: T | null) => {
    for (const r of latest.current) {
      if (typeof r === "function") r(val);
      else if (r) (r as React.MutableRefObject<T | null>).current = val;
    }
  }, []);
}

/**
 * One-call glue for a glass surface: attaches the edge-refraction lens and merges
 * it with the component's forwarded ref. `enabled=false` skips the lens (e.g. a
 * non-glass Button variant) while keeping hook order stable.
 */
export function useGlassSurface<T extends HTMLElement = HTMLElement>(
  externalRef?: React.Ref<T>,
  enabled = true,
): React.RefCallback<T> {
  const lensRef = useGlassLens<T>();
  return useMergedRefs<T>(externalRef, enabled ? lensRef : undefined);
}
