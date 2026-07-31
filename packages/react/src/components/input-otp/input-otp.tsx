"use client";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn, useGlassLens, useMergedRefs } from "@lglite/glass-core";
import "./input-otp.css";

// OTPInput's props include conditional members → use a type intersection, not
// `interface extends`. `maxLength` stays required (consumers pass it).
export type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput> & {
  containerClassName?: string;
};

/** Inset glass one-time-code field ([spec 17]) — bespoke recessed slots, NOT a
 *  Surface (no rim lens) so the row of cells carries no backdrop-filters. */
export const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  InputOTPProps
>(function InputOTP({ className, containerClassName, ...props }, ref) {
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn("lg-otp", containerClassName)}
      className={cn("lg-otp__input", className)}
      {...props}
    />
  );
});

export const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function InputOTPGroup({ className, ...props }, ref) {
  return <div ref={ref} className={cn("lg-otp__group", className)} {...props} />;
});

export interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<"div"> {
  index: number;
  /** Live-backdrop refraction (Liquid Glass). ON by default; the filter is pooled
   *  by geometry so all same-size slots share ONE filter node. */
  lens?: boolean;
  /** Denser frosted material. ON by default for legibility over busy backdrops. */
  frosted?: boolean;
}

export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  function InputOTPSlot({ index, className, lens = true, frosted = true, ...props }, ref) {
    const context = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = context.slots[index] ?? {};
    const slotLens = useGlassLens<HTMLDivElement>();
    const setRef = useMergedRefs<HTMLDivElement>(ref, lens ? slotLens : undefined);
    return (
      <div
        ref={setRef}
        data-active={isActive || undefined}
        className={cn("lg-otp__slot", lens && "lg-lens", frosted && "lg-frosted", className)}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="lg-otp__caret-wrap">
            <div className="lg-otp__caret" />
          </div>
        )}
      </div>
    );
  },
);

export const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function InputOTPSeparator({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn("lg-otp__sep", className)}
      {...props}
    >
      {children ?? "-"}
    </div>
  );
});
