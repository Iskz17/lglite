import { cva, type VariantProps } from "class-variance-authority";

/**
 * The single glass recipe every Surface composes (DRY). One glass level
 * (`subtle`) carries the blur + distortion filter; `tone` tints the material.
 */
export const glassSurface = cva("lg-surface", {
  variants: {
    intensity: {
      subtle: "lg-distort-subtle",
    },
    tone: {
      default: "",
      primary: "lg-tone-primary",
      destructive: "lg-tone-destructive",
      success: "lg-tone-success",
    },
    /** Denser, more opaque white material (Apple-menu-like) for legibility —
     *  between glass-first (default) and `plate` (opaque). Opt-in per instance. */
    frosted: {
      true: "lg-frosted",
      false: "",
    },
  },
  defaultVariants: { intensity: "subtle", tone: "default", frosted: false },
});

export type GlassSurfaceVariants = VariantProps<typeof glassSurface>;
