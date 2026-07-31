import type { Meta, StoryObj } from "@storybook/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Button,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button>Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} {...args}>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>
          Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Show toolbar</DropdownMenuCheckboxItem>
        <DropdownMenuItem disabled>Disabled action</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
