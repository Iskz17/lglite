"use client";
import * as React from "react";
import { cn } from "@lglite/glass-core";
import { Popover, PopoverTrigger, PopoverContent } from "../popover/popover";
import { Button, type ButtonProps } from "../button/button";
import { Calendar } from "../calendar/calendar";
import "./date-picker.css";

export interface DatePickerProps {
  /** Controlled selected date. */
  value?: Date;
  /** Default selected date (uncontrolled). */
  defaultValue?: Date;
  /** Fired when the selection changes. */
  onChange?: (date: Date | undefined) => void;
  /** Trigger placeholder when nothing is selected. */
  placeholder?: string;
  /** `Intl.DateTimeFormat` options for the trigger label. */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Locale(s) for formatting; defaults to the runtime locale. */
  locale?: string | string[];
  disabled?: boolean;
  className?: string;
  /** Variant for the trigger Button (default `outline`). */
  variant?: ButtonProps["variant"];
  /** Denser frosted Liquid Glass material on the calendar panel. */
  frosted?: boolean;
  /** Opaque plate panel (guaranteed contrast). */
  plate?: boolean;
}

const defaultFormat: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/** Calendar + this library's Popover composition. Controlled via `value`/`onChange`,
 *  or uncontrolled via internal state. Closes on select. */
export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  formatOptions = defaultFormat,
  locale,
  disabled,
  className,
  variant = "outline",
  frosted,
  plate,
}: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const isControlled = value !== undefined;
  const date = isControlled ? value : internal;

  const formatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, formatOptions),
    [locale, formatOptions],
  );

  const handleSelect = React.useCallback(
    (next: Date | undefined) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
      if (next) setOpen(false);
    },
    [isControlled, onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          disabled={disabled}
          aria-label={date ? formatter.format(date) : placeholder}
          data-empty={date ? undefined : ""}
          className={cn("lg-datepicker__trigger", className)}
        >
          <CalendarIcon />
          {date ? formatter.format(date) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg-datepicker__content" align="start" frosted={frosted} plate={plate}>
        <Calendar mode="single" selected={date} onSelect={handleSelect} autoFocus />
      </PopoverContent>
    </Popover>
  );
}
