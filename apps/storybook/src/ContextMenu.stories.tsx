import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <ContextMenu>
      <ContextMenuTrigger
        style={{
          display: "grid",
          placeItems: "center",
          width: 320,
          height: 160,
          borderRadius: 12,
          border: "1px dashed rgb(var(--glass-fg-muted))",
          color: "rgb(var(--glass-fg-muted))",
        }}
      >
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent {...args}>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>
          Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show toolbar</ContextMenuCheckboxItem>
        <ContextMenuItem disabled>Save as…</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
