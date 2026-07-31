/**
 * Edge-ramp displacement map ([spec 14]). Bakes a per-element rounded-rect SDF
 * gradient into a PNG data URL for `feDisplacementMap`:
 *   - R channel → X offset, G channel → Y offset (128 = neutral, no shift).
 *   - Offset = inward edge-normal × a ramp that is 0 in the interior and peaks at
 *     the border, confined to a thin `band` px ring → EDGE-ONLY lensing, clean
 *     interior (no whole-surface smear — see [spec 14 §14.7]).
 *
 * Per-element + `userSpaceOnUse` (not a shared objectBoundingBox map) is what
 * avoids the aspect-ratio curvature asymmetry (W3C fxtf#596). Module-cached by
 * geometry so re-renders and HMR reuse one bake; computed during the call (NOT
 * React state) so edits always re-apply.
 */

/** Refraction band width (px): the edge ring the displacement lives in. */
export const RIM_BAND = 13.5;
/** feDisplacementMap `scale` (px): how far the rim bends the backdrop. */
export const RIM_SCALE = 55;
/** Extra displacement at the very border → a distinct, very-thin refraction line. */
export const RIM_EDGE_SPIKE = 1.5;
/** Width (px) of that border line. */
export const RIM_EDGE_SPIKE_W = 5.5;
/** In-band saturation multiplier (the refracted edge glows in the bg's own color). */
export const RIM_SATURATE = 1.5;

export interface RimMapParams {
  w: number;
  h: number;
  radius: number;
  band?: number;
  edgeSpike?: number;
  edgeSpikeW?: number;
}

const cache = new Map<string, string>();
const CACHE_CAP = 64;

export function bakeRimMap({
  w,
  h,
  radius,
  band = RIM_BAND,
  edgeSpike = RIM_EDGE_SPIKE,
  edgeSpikeW = RIM_EDGE_SPIKE_W,
}: RimMapParams): string {
  const W = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));
  const rad = Math.max(0, Math.min(radius, W / 2, H / 2));
  const key = `${W}x${H}x${rad}x${band}x${edgeSpike}x${edgeSpikeW}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (typeof document === "undefined") return ""; // SSR: no refraction server-side

  const cnv = document.createElement("canvas");
  cnv.width = W;
  cnv.height = H;
  const ctx = cnv.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(W, H);
  const D = img.data;

  // signed distance to the rounded-rect boundary; negative inside
  const sdf = (px: number, py: number) => {
    const qx = Math.abs(px - W / 2) - (W / 2 - rad);
    const qy = Math.abs(py - H / 2) - (H / 2 - rad);
    const ax = Math.max(qx, 0);
    const ay = Math.max(qy, 0);
    return Math.min(Math.max(qx, qy), 0) + Math.hypot(ax, ay) - rad;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
  // clamp the band so it never exceeds half the smallest side — otherwise on tiny
  // controls the ramp never reaches 0 in the centre and the whole surface smears.
  const eband = Math.min(band, Math.max(1, Math.min(W, H) / 2));

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const sd = sdf(px, py);
      // Displacement DIRECTION = a blend of the edge-normal (gradient of the SDF)
      // and the radial (outward-from-center) direction. Pure normal only shifts
      // perpendicular to a straight edge → lines parallel to that edge don't bend
      // (the "flat sides" problem). Mixing in the radial tilts the band's offset
      // toward the corners, so straight lines BOW near every edge — the 2D lens
      // look. Both are confined to the band by `m`, so the interior stays clean.
      const gx = sdf(px + 1, py) - sdf(px - 1, py);
      const gy = sdf(px, py + 1) - sdf(px, py - 1);
      const gl = Math.hypot(gx, gy) || 1;
      const rx = px - W / 2;
      const ry = py - H / 2;
      const rl = Math.hypot(rx, ry) || 1;
      const RADIAL = 0.45; // 0 = pure normal, 1 = pure radial
      let dx = (1 - RADIAL) * (gx / gl) + RADIAL * (rx / rl);
      let dy = (1 - RADIAL) * (gy / gl) + RADIAL * (ry / rl);
      const dl = Math.hypot(dx, dy) || 1;
      const nx = dx / dl;
      const ny = dy / dl;
      // main band: 0 at `eband` px inside → 1 at the edge; full just outside the box
      const mainRamp = sd <= 0 ? smooth(clamp(1 + sd / eband, 0, 1)) : 1;
      // edge spike: a sharp narrow boost in the last `edgeSpikeW` px → a distinct,
      // very-thin refraction line right at the border (same backdrop, just bent harder)
      const spike = edgeSpike * smooth(clamp(1 + sd / edgeSpikeW, 0, 1));
      const m = mainRamp + spike;
      const i = (y * W + x) * 4;
      D[i] = clamp(128 + nx * m * 127, 0, 255); // R → X offset
      D[i + 1] = clamp(128 + ny * m * 127, 0, 255); // G → Y offset
      // B → band-coverage mask (1 in the rim band, 0 in the interior): the filter
      // uses it to keep the band SHARP + boosted while blurring only the interior.
      D[i + 2] = clamp(m, 0, 1) * 255;
      D[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = cnv.toDataURL();

  if (cache.size >= CACHE_CAP) cache.delete(cache.keys().next().value as string);
  cache.set(key, url);
  return url;
}
