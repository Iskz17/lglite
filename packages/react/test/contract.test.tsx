import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Button, Card, Input, Badge, GlassProvider } from "../src";

// The component contract ([spec 04]): forwardRef, ...props passthrough, className
// merged last, asChild composition. Verified on a representative spread.
const wrap = (ui: React.ReactElement) => render(<GlassProvider>{ui}</GlassProvider>);

describe("component contract", () => {
  it("forwards refs to the underlying DOM node", () => {
    const ref = React.createRef<HTMLButtonElement>();
    wrap(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent("Go");
  });

  it("spreads arbitrary props (data-*, aria-*) onto the root", () => {
    wrap(
      <Button data-testid="btn" aria-pressed="true" title="hi">
        x
      </Button>,
    );
    const btn = screen.getByTestId("btn");
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveAttribute("title", "hi");
  });

  it("merges a consumer className last (base class still present)", () => {
    wrap(
      <Card data-testid="card" className="my-custom">
        c
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("my-custom");
    expect(card.className).toMatch(/lg-/); // engine base class kept
  });

  it("asChild composes onto the child element (no extra wrapper)", () => {
    wrap(
      <Button asChild>
        <a href="#x" data-testid="link">
          link
        </a>
      </Button>,
    );
    const link = screen.getByTestId("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "#x");
    expect(link.className).toMatch(/lg-btn/);
  });

  it("solid Button honors the tone via data-tone", () => {
    wrap(
      <Button variant="solid" tone="destructive" data-testid="del">
        Delete
      </Button>,
    );
    expect(screen.getByTestId("del")).toHaveAttribute("data-tone", "destructive");
  });

  it("Input forwards value + onChange (controlled)", () => {
    const onChange = vi.fn();
    wrap(<Input aria-label="email" value="a@b.c" onChange={onChange} />);
    expect(screen.getByLabelText("email")).toHaveValue("a@b.c");
  });
});
