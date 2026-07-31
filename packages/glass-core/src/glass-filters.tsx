"use client";

/**
 * No-op. The base glass is plain frosted glass (backdrop blur + saturate + a
 * bright specular rim, in CSS) — no SVG displacement filter. Kept as an exported
 * component so GlassProvider's tree is stable; a future displacement/WebGL lens
 * can re-populate this.
 */
export function GlassFilters(_props: { nonce?: string }) {
  return null;
}
