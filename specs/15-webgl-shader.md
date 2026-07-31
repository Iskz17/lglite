# 15 — WebGL Lens Engine: Shader Spec (`@lglite/webgl`, Phase 2)

Concrete spec for the opt-in `webgl` engine ([12]). It lenses a **supplied** source (image/video/static bg) cross-browser incl. Safari/iOS, reusing the same edge-ramp map ([14]) so it matches the CSS engine.

## 15.1 Pipeline

```
supplied source (img/video/bg)  ──►  [blur pass]  ──►  [displacement + aberration pass]  ──►  canvas
                                       (frost)            (edge-ramp uMap, uScale, uOffset)
```

Two-pass: (1) a separable Gaussian blur on the source for the frosted base (matches `--glass-blur`); (2) edge-ramp displacement + chromatic aberration. A single fullscreen quad per pass.

## 15.2 Uniforms

| Uniform | Meaning |
|---------|---------|
| `uSource` | sampler2D — blurred source texture |
| `uMap` | sampler2D — the baked edge-ramp map ([14]) |
| `uScale` | float — displacement strength in px (preset 30/55/90) |
| `uResolution` | vec2 — surface size in px |
| `uOffset` | vec2 — UV offset for `page-fixed` scroll-trueness (else 0) |
| `uAberration` | float — chromatic split (0 = off) |
| `uTime` | float — only if animated wobble enabled |

## 15.3 Displacement + aberration fragment shader (GLSL ES 1.00)

```glsl
precision highp float;
varying vec2 vUv;
uniform sampler2D uSource;
uniform sampler2D uMap;
uniform float uScale;
uniform vec2  uResolution;
uniform vec2  uOffset;
uniform float uAberration;

void main() {
  // offset vector from the edge-ramp map, in pixels, → UV space
  vec2 disp = (texture2D(uMap, vUv).rg - 0.5) * uScale / uResolution;

  // base sampling coordinate, including page-fixed scroll offset
  vec2 base = vUv + uOffset;

  // chromatic aberration: split R/B displacement around G
  vec2 dR = disp * (1.0 + uAberration);
  vec2 dB = disp * (1.0 - uAberration);

  float r = texture2D(uSource, base + dR).r;
  float g = texture2D(uSource, base + disp).g;
  float b = texture2D(uSource, base + dB).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
```

The blur pass is a standard separable Gaussian (two draws, horizontal then vertical, kernel sized from `--glass-blur`); omitted here for brevity — reuse any small separable-blur shader.

## 15.4 Source handling

- **Image:** decode once, `texImage2D` once. Static.
- **Video:** on each RAF, `texImage2D(gl.TEXTURE_2D, 0, …, videoEl)` to pull the current frame → lenses live playback. Respect `playsInline`/`muted` for autoplay.
- **CSS background string (`page-fixed`):** load the image once; set `uOffset = rectInPage / pageSize` each frame so the lensed slice tracks the real page background while scrolling (the scroll-sync, in-shader, jank-free).
- Use `RGBA`, `LINEAR` filtering, `CLAMP_TO_EDGE`. Premultiplied-alpha off.

## 15.5 Lifecycle & integration (`LensEngine.mount`)

```ts
export const webglLens: LensEngine = {
  name: "webgl",
  mount(el, opts) {
    const canvas = makeCanvas(el);          // aria-hidden, inset:0, z-index:-1, behind content
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    const ro = new ResizeObserver(() => resize(gl, el));         // resize textures/viewport
    const io = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop()); // pause offscreen
    // RAF loop: update video texture (if any) + uOffset (if page-fixed) + draw
    // gates: reducedMotion → render ONE static frame; contrast/forced-colors/reduceGlass → hide canvas
    return () => { stop(); ro.disconnect(); io.disconnect(); canvas.remove(); releaseGL(gl); };
  },
};
```

## 15.6 Performance / robustness

- **Pause offscreen** via IntersectionObserver (battery/thermal).
- **Shared context**: prefer ONE `WebGLRenderingContext` rendering all `webgl` surfaces into their canvases (or a texture atlas); browsers cap live contexts (~16). Document a soft cap and warn beyond it.
- **Context loss**: handle `webglcontextlost` (preventDefault) / `webglcontextrestored` (rebuild); on permanent loss → detach and fall back to the `css` engine / frost.
- **DPR**: size the drawing buffer to `min(devicePixelRatio, 2)` to bound fill cost.
- **No text in the canvas** — it's purely decorative; all content is real DOM above it, so removing the canvas (any a11y gate) is always safe.

## 15.7 SSR / hydration

Server renders the Layer-1 frost (`.lg-surface::before`). The canvas mounts client-side after hydration; until then the surface is frosted glass (correct, no FOUC beyond frost→lens which is post-paint, same as the CSS gate).

## 15.8 Consistency requirement

A surface rendered by `webgl` (given an equivalent source) must visually match the same surface rendered by `css` on Chromium — same edge-ramp map, same `uScale` per preset, same blur radius. This is asserted in [14 §14.5] validation step 3.
