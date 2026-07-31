import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "@lglite/react";
import { frostedControl, toneControl } from "./glass-controls";

// ToggleGroup is a Radix discriminated union (single|multiple); typing the story
// to only the glass props avoids widening `value`/`defaultValue`.
type GlassArgs = { frosted?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    frosted: frostedControl,
    tone: toneControl,
  },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <ToggleGroup {...args} type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">L</ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">C</ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">R</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">I</ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">U</ToggleGroupItem>
    </ToggleGroup>
  ),
};
