/**
 * Shared Storybook arg-control definitions (DRY) so every component exposes the
 * same Liquid Glass knobs in the Controls panel. Import the pieces a component
 * actually supports — never expose a control for a prop the component lacks.
 *
 *   import { frostedControl, lensControl, plateControl, toneControl } from "./glass-controls";
 *   const meta = { argTypes: { frosted: frostedControl, tone: toneControl } };
 */
export const frostedControl = {
  control: "boolean",
  description: "Denser frosted Liquid Glass material",
} as const;

export const lensControl = {
  control: "boolean",
  description: "Live-backdrop refraction lens (Chromium only)",
} as const;

export const plateControl = {
  control: "boolean",
  description: "Opaque plate (guaranteed-contrast surface)",
} as const;

export const glassControl = {
  control: "boolean",
  description: "Render as a Liquid Glass surface",
} as const;

export const toneControl = {
  control: "inline-radio",
  options: ["default", "primary", "destructive", "success"],
  description: "Colour tone (accent tones render colored-frosted)",
} as const;

/** Surface components (Card/Alert/Dialog content/…): frosted + plate + tone. */
export const glassSurfaceArgTypes = {
  frosted: frostedControl,
  plate: plateControl,
  tone: toneControl,
} as const;

/** Control components (Switch/Slider/Checkbox/…): lens + frosted. */
export const glassControlArgTypes = {
  lens: lensControl,
  frosted: frostedControl,
} as const;
