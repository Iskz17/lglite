"use client";
import * as React from "react";
import { cn, useGlassLens, useMergedRefs, useNameWarning } from "@lglite/glass-core";
import "./input.css";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Named `inputSize` to avoid clashing with the native `size` attribute. */
  inputSize?: "sm" | "md" | "lg";
  invalid?: boolean;
  plate?: boolean;
  /** Live-backdrop refraction (Liquid Glass). ON by default; the filter is pooled
   *  by geometry so a form of same-size fields shares ONE filter node. */
  lens?: boolean;
  /** Denser frosted material. ON by default for legibility over busy backdrops. */
  frosted?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/** Inset glass field ([spec 17]) — recessed (inner shadow), refraction lens +
 *  frosted material by default. The lens attaches to the bordered element (the
 *  bare input, or the wrapper when adorned). Set `lens={false}` to drop refraction. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, inputSize = "md", invalid, plate, lens = true, frosted = true, startIcon, endIcon, disabled, ...props },
  ref,
) {
  const adorned = Boolean(startIcon || endIcon);
  const inner = React.useRef<HTMLInputElement>(null);
  const fieldLens = useGlassLens<HTMLInputElement>();
  const wrapLens = useGlassLens<HTMLDivElement>();
  // lens lands on whichever node paints the glass: the bare input, or the wrapper.
  const setRef = useMergedRefs<HTMLInputElement>(ref, inner, lens && !adorned ? fieldLens : undefined);
  useNameWarning(inner, "Input");
  const input = (
    <input
      ref={setRef}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      data-plate={plate || undefined}
      className={cn(
        "lg-input",
        inputSize !== "md" && `lg-input--${inputSize}`,
        lens && !adorned && "lg-lens",
        frosted && "lg-frosted",
        !adorned && className,
      )}
      {...props}
    />
  );
  if (!adorned) return input;
  return (
    <div
      ref={lens ? wrapLens : undefined}
      className={cn("lg-input-wrap", lens && "lg-lens", frosted && "lg-frosted", className)}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
    >
      {startIcon}
      {input}
      {endIcon}
    </div>
  );
});
