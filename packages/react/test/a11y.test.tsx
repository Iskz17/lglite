import { describe, it, expect } from "vitest";
import * as React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label,
  Switch,
  Checkbox,
  GlassProvider,
} from "../src";

// Automated a11y smoke ([spec 09.2]): zero axe violations in BOTH the glass-first
// default and contrast="aa". (forced-colors + the pixel contrast contract need a
// real browser — Playwright — and are tracked separately.)
const Sample = () => (
  <main>
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="you@example.com" />
        <label>
          <Checkbox /> Remember me
        </label>
        <Switch aria-label="Notifications" />
        <Button>Save</Button>
      </CardContent>
    </Card>
  </main>
);

describe("a11y (jest-axe)", () => {
  it("has no violations in the default glass mode", async () => {
    const { container } = render(
      <GlassProvider>
        <Sample />
      </GlassProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations in contrast="aa" mode', async () => {
    const { container } = render(
      <GlassProvider contrast="aa">
        <Sample />
      </GlassProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
