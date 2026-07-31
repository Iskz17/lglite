import type { Meta, StoryObj } from "@storybook/react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow, Button } from "@lglite/react";
import { frostedControl, toneControl } from "./glass-controls";

// TooltipContent is plate-by-default in CSS and has no `plate` prop — only frosted + tone.
type GlassArgs = { frosted?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/Tooltip",
  argTypes: { frosted: frostedControl, tone: toneControl },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover or focus me</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8} {...args}>
          Glass tooltip — plate-by-default for legibility
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
