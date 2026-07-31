"use client";
import * as React from "react";
import { cn, useGlassLens, useMergedRefs, useNameWarning } from "@lglite/glass-core";
// Reuse the inset field look (.lg-input); .lg-textarea only adds the box shape.
import "../input/input.css";
import "./textarea.css";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  plate?: boolean;
  /** Live-backdrop refraction (Liquid Glass). ON by default; the filter is pooled
   *  by geometry so a form of same-size fields shares ONE filter node. */
  lens?: boolean;
  /** Denser frosted material. ON by default for legibility over busy backdrops. */
  frosted?: boolean;
}

/** Inset glass textarea ([spec 17]) — same recessed field as Input, NOT a Surface
 *  (no rim lens) so a form of many fields doesn't carry many backdrop-filters. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, plate, lens = true, frosted = true, ...props },
  ref,
) {
  const inner = React.useRef<HTMLTextAreaElement>(null);
  const fieldLens = useGlassLens<HTMLTextAreaElement>();
  const setRef = useMergedRefs<HTMLTextAreaElement>(ref, inner, lens ? fieldLens : undefined);
  useNameWarning(inner, "Textarea");
  return (
    <textarea
      ref={setRef}
      aria-invalid={invalid || undefined}
      data-plate={plate || undefined}
      className={cn("lg-input", "lg-textarea", lens && "lg-lens", frosted && "lg-frosted", className)}
      {...props}
    />
  );
});
