import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/Command",
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <div style={{ width: "min(92vw, 32rem)" }}>
      <Command {...args}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              Calendar
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>Billing</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};
