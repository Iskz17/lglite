import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, Button } from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/Popover",
  component: Popover,
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={10} {...args}>
        <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem", fontWeight: 600 }}>Liquid Glass Popover</h3>
        <p style={{ margin: 0, color: "rgb(var(--glass-fg-muted))" }}>
          A floating glass panel with the refracted rim. Esc or click-outside closes; focus can tab out (non-modal).
        </p>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  ),
};

export const Frosted: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open (frosted)</Button>
      </PopoverTrigger>
      <PopoverContent frosted sideOffset={10}>
        <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem", fontWeight: 600 }}>Frosted material</h3>
        <p style={{ margin: 0, color: "rgb(var(--glass-fg-muted))" }}>
          Denser Apple-style white material via the <code>frosted</code> prop — legible while still glass,
          rim still at the edge.
        </p>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  ),
};

export const Plate: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open (plate)</Button>
      </PopoverTrigger>
      <PopoverContent plate sideOffset={10}>
        <p style={{ margin: 0 }}>Plate keeps text AA-legible over any backdrop.</p>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  ),
};
