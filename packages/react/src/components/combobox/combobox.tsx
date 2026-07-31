"use client";
import * as React from "react";
import { cn } from "@lglite/glass-core";
import { Popover, PopoverTrigger, PopoverContent } from "../popover/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../command/command";
import { Button } from "../button/button";
import "./combobox.css";

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false" className="lg-combobox__chevron">
    <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false" className="lg-combobox__check">
    <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "value" | "onChange"> {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Shown on the trigger when nothing is selected. */
  placeholder?: string;
  /** Shown when the search yields no matches. */
  emptyText?: string;
  /** Placeholder for the search input. */
  searchPlaceholder?: string;
  /** Denser frosted Liquid Glass material on the dropdown panel. */
  frosted?: boolean;
  /** Opaque plate panel (guaranteed contrast). */
  plate?: boolean;
}

/** Combobox = Command + Popover + Button composition ([spec 16]). The trigger Button
 *  is the `combobox`; cmdk owns the listbox/option roles + keyboard inside the popover. */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    onChange,
    defaultValue,
    placeholder = "Select option…",
    emptyText = "No results found.",
    searchPlaceholder = "Search…",
    frosted,
    plate,
    className,
    ...props
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const value = valueProp ?? uncontrolled;
  const listId = React.useId();

  const selected = options.find((o) => o.value === value);

  const select = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          className={cn("lg-combobox__trigger", className)}
          {...props}
        >
          <span className="lg-combobox__value">{selected ? selected.label : placeholder}</span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" frosted={frosted} plate={plate} className="lg-combobox__content">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList id={listId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => select(option.value)}
                >
                  <span className="lg-combobox__item-label">{option.label}</span>
                  {value === option.value && <CheckIcon />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
