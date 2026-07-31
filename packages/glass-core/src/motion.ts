/** Spring configs for JS-driven motion (e.g. Dock, Phase 2). CSS uses --glass-ease tokens. */
export const springs = {
  press: { stiffness: 400, damping: 28 },
  morph: { stiffness: 260, damping: 30 },
  magnify: { stiffness: 300, damping: 26 },
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
