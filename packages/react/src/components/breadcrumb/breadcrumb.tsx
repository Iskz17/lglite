"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@lglite/glass-core";
import "./breadcrumb.css";

export const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  function Breadcrumb({ className, ...props }, ref) {
    return <nav ref={ref} aria-label="breadcrumb" className={cn("lg-breadcrumb", className)} {...props} />;
  },
);

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  function BreadcrumbList({ className, ...props }, ref) {
    return <ol ref={ref} className={cn("lg-breadcrumb__list", className)} {...props} />;
  },
);

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn("lg-breadcrumb__item", className)} {...props} />;
  },
);

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, asChild, ...props }, ref) {
    const Comp = asChild ? Slot : "a";
    return <Comp ref={ref} className={cn("lg-breadcrumb__link", className)} {...props} />;
  },
);

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  function BreadcrumbPage({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("lg-breadcrumb__page", className)}
        {...props}
      />
    );
  },
);

export const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentPropsWithoutRef<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("lg-breadcrumb__separator", className)} {...props}>
    {children ?? (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
    )}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentPropsWithoutRef<"span">) => (
  <span role="presentation" aria-hidden="true" className={cn("lg-breadcrumb__ellipsis", className)} {...props}>
    …
    <span className="lg-sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
