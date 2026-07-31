import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/Sheet",
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right" {...args}>
        <SheetHeader>
          <SheetTitle>Liquid Glass Sheet</SheetTitle>
          <SheetDescription>
            A side-anchored glass panel that slides in, refraction on Chromium, focus-trapped via Radix.
          </SheetDescription>
        </SheetHeader>
        <p>The page behind is frosted and (on Chromium) lensed at the panel&apos;s edges.</p>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost" size="sm">Close</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="solid" size="sm">Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
