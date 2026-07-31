import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "@lglite/react";

/**
 * THE PHASE-0 GATE ([spec 14 §14.5]): over NON-periodic detail (the moving
 * photo), the radial lens BENDS the backdrop near the rim in 2D and leaves the
 * centre clean. One glass level (`subtle`); tune scale/power/squareness in the
 * engine (glass-filters.tsx + edge-ramp.ts).
 */
const meta: Meta = {
  title: "Engine/Lensing",
  parameters: { backgrounds: { disable: true } },
};
export default meta;

type Story = StoryObj;

const Panel = ({ w = 220, h = 160 }: { w?: number; h?: number }) => (
  <Card style={{ width: w, height: h }}>
    <CardHeader>
      <CardTitle>Liquid Glass</CardTitle>
    </CardHeader>
    <CardContent>Watch the backdrop bend at the edges.</CardContent>
  </Card>
);

export const Default: Story = {
  render: () => <Panel />,
};

/** Same single filter at different sizes — the lens scales with the surface. */
export const Sizes: Story = {
  render: () => (
    <>
      <Panel w={140} h={120} />
      <Panel w={220} h={160} />
      <Panel w={320} h={220} />
    </>
  ),
};
