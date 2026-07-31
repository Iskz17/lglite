import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard, HoverCardTrigger, HoverCardContent, Button } from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/HoverCard",
  component: HoverCard,
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <HoverCard defaultOpen>
      <HoverCardTrigger asChild>
        <Button>Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} {...args}>
        <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem", fontWeight: 600 }}>Liquid Glass HoverCard</h3>
        <p style={{ margin: 0, color: "rgb(var(--glass-fg-muted))" }}>
          A floating glass panel with the refracted rim, shown on hover. Non-modal, dismissed on hover-out.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};
