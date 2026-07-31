"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@lglite/glass-core";
import "../button/button.css";
import "./pagination.css";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export const Pagination = ({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) => (
  <nav role="navigation" aria-label="pagination" className={cn("lg-pagination", className)} {...props} />
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  function PaginationContent({ className, ...props }, ref) {
    return <ul ref={ref} className={cn("lg-pagination__content", className)} {...props} />;
  },
);

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  function PaginationItem({ className, ...props }, ref) {
    return <li ref={ref} {...props} className={cn("lg-pagination__item", className)} />;
  },
);

export interface PaginationLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
  isActive?: boolean;
  size?: ButtonSize;
}

const sizeClass: Record<ButtonSize, string> = {
  sm: "lg-btn--sm",
  md: "lg-btn--md",
  lg: "lg-btn--lg",
  icon: "lg-btn--icon",
};

export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationLink({ className, asChild, isActive, size = "icon", ...props }, ref) {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "lg-btn",
          sizeClass[size],
          isActive ? "lg-btn--outline" : "lg-btn--ghost",
          className,
        )}
        {...props}
      />
    );
  },
);

export const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationPrevious({ className, size = "md", ...props }, ref) {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to previous page"
        size={size}
        className={cn("lg-pagination__prev", className)}
        {...props}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Previous</span>
      </PaginationLink>
    );
  },
);

export const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationNext({ className, size = "md", ...props }, ref) {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to next page"
        size={size}
        className={cn("lg-pagination__next", className)}
        {...props}
      >
        <span>Next</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </PaginationLink>
    );
  },
);

export const PaginationEllipsis = ({ className, ...props }: React.ComponentPropsWithoutRef<"span">) => (
  <span aria-hidden="true" className={cn("lg-pagination__ellipsis", className)} {...props}>
    …
    <span className="lg-sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
