export { cn } from "./cn";
export { glassSurface, type GlassSurfaceVariants } from "./glass-surface";
export { GlassProvider, type GlassProviderProps } from "./glass-provider";
export { GlassFilters } from "./glass-filters";
export { GlassScript } from "./glass-script";
export { GlassText, type GlassTextProps } from "./glass-text";
export { GlassContext, useGlass, type GlassContextValue } from "./use-glass";
export { useGlassLens, useGlassSurface, useMergedRefs, attachGlassLens } from "./glass-lens";
export { useNameWarning } from "./dev-warn";
// NOTE: `attachGlassLens` is retained — the Chromium toast refraction (sonner) uses it.
export { bakeRimMap, RIM_BAND, RIM_SCALE, type RimMapParams } from "./edge-ramp";
export { springs, prefersReducedMotion } from "./motion";
export {
  cssLens,
  registerLensEngine,
  getLensEngine,
  type LensEngine,
  type LensName,
  type LensOptions,
} from "./lens";
