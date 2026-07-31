import type { Meta, StoryObj } from "@storybook/react";
import { Label, Input } from "@lglite/react";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8, width: 280 }}>
      <Label htmlFor="email">Email address</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
};
