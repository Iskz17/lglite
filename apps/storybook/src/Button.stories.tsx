import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@lglite/react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["glass", "solid", "ghost", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon"] },
    tone: { control: "inline-radio", options: ["default", "primary", "destructive", "success"] },
  },
  args: { children: "Liquid Glass" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Glass: Story = { args: {
  variant: "glass",
  size: "sm",
  tone: "default"
} };
export const Solid: Story = { args: { variant: "solid", children: "Primary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Outline: Story = { args: { variant: "outline" } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="glass">Glass</Button>
      <Button variant="solid">Solid</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="glass" tone="primary">Primary tone</Button>
      <Button variant="glass" tone="destructive">Destructive</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const SolidTones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="solid">Default</Button>
      <Button variant="solid" tone="primary">Primary</Button>
      <Button variant="solid" tone="success">Accept</Button>
      <Button variant="solid" tone="destructive">Delete</Button>
      <Button variant="outline" tone="success">Accept</Button>
      <Button variant="outline" tone="destructive">Delete</Button>
      <Button variant="ghost" tone="destructive">Delete</Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Button asChild>
      <a href="#top">I am an anchor</a>
    </Button>
  ),
};
