/**
 * Pluggable lens engine ([spec 12]). The `css` engine (default) is a no-op —
 * the effect is pure CSS via `.lg-distort-*` + the gate. The `webgl` engine
 * (Phase 2, separate @lglite/webgl package) registers here and mounts a canvas.
 */
export type LensName = "css" | "webgl";

export interface LensOptions {
  source?: HTMLImageElement | HTMLVideoElement | string;
  preset: "subtle";
  aberration?: boolean;
  sourceMode?: "contain" | "page-fixed";
  reducedMotion: boolean;
}

export interface LensEngine {
  name: string;
  /** Mount the lens behind `el`'s content. Returns a cleanup fn. */
  mount(el: HTMLElement, opts: LensOptions): () => void;
}

const noop = () => {};

/** Default engine: CSS handles everything, nothing to mount. */
export const cssLens: LensEngine = { name: "css", mount: () => noop };

const registry = new Map<string, LensEngine>([["css", cssLens]]);

export const registerLensEngine = (engine: LensEngine) =>
  registry.set(engine.name, engine);

export const getLensEngine = (name: LensName): LensEngine =>
  registry.get(name) ?? cssLens;
