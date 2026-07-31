"use client";
import * as React from "react";
import { DayPicker, type DayPickerProps, type ChevronProps } from "react-day-picker";
import { cn, useGlassSurface } from "@lglite/glass-core";
import "./calendar.css";

export type CalendarProps = DayPickerProps & {
  /** Render the calendar as a standalone glass Surface. Opt-in (default off —
   *  it normally sits inside a glass Popover). */
  glass?: boolean;
  /** Denser frosted material (only when `glass`). */
  frosted?: boolean;
};

/** Glass-flat chevron for the nav buttons (v10 `components.Chevron`). The calendar
 *  sits inside a glass Popover, so it stays transparent — no `.lg-surface` here. */
function CalendarChevron({ orientation, className, size = 16, ...props }: ChevronProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("lg-calendar__chevron", className)}
      {...props}
    >
      {orientation === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : orientation === "right" ? (
        <path d="m9 18 6-6-6-6" />
      ) : orientation === "up" ? (
        <path d="m18 15-6-6-6 6" />
      ) : (
        <path d="m6 9 6 6 6-6" />
      )}
    </svg>
  );
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  glass = false,
  frosted,
  ...props
}: CalendarProps) {
  // Wire the refraction lens onto DayPicker's own root node via a custom Root
  // (it forwards `rootRef` to the root <div>). Hook runs unconditionally; the
  // merge is gated by `glass`.
  const surfaceRef = useGlassSurface<HTMLDivElement>(undefined, glass);
  const GlassRoot = React.useCallback(
    ({ rootRef, ...rest }: { rootRef?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...rest} ref={glass ? surfaceRef : rootRef} />
    ),
    [glass, surfaceRef],
  );
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "lg-calendar",
        glass && "lg-surface",
        glass && frosted && "lg-frosted",
        className,
      )}
      classNames={{
        months: "lg-calendar__months",
        month: "lg-calendar__month",
        month_caption: "lg-calendar__caption",
        caption_label: "lg-calendar__caption-label",
        nav: "lg-calendar__nav",
        button_previous: "lg-calendar__nav-btn",
        button_next: "lg-calendar__nav-btn",
        month_grid: "lg-calendar__grid",
        weekdays: "lg-calendar__weekdays",
        weekday: "lg-calendar__weekday",
        week: "lg-calendar__week",
        day: "lg-calendar__day",
        day_button: "lg-calendar__day-btn",
        today: "lg-calendar__today",
        selected: "lg-calendar__selected",
        outside: "lg-calendar__outside",
        disabled: "lg-calendar__disabled",
        hidden: "lg-calendar__hidden",
        range_start: "lg-calendar__range-start",
        range_middle: "lg-calendar__range-middle",
        range_end: "lg-calendar__range-end",
        ...classNames,
      }}
      components={{ Chevron: CalendarChevron, Root: GlassRoot, ...components }}
      {...props}
    />
  );
}
