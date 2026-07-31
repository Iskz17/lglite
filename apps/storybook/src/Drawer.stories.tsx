import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

type GlassArgs = { frosted?: boolean; plate?: boolean; tone?: "default" | "primary" | "destructive" | "success" };

const meta: Meta<GlassArgs> = {
  title: "Components/Drawer",
  argTypes: { ...glassSurfaceArgTypes },
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Liquid Glass Drawer</DrawerTitle>
          <DrawerDescription>
            A bottom sheet on a glass panel, drag-to-dismiss via vaul.
          </DrawerDescription>
        </DrawerHeader>
        <p>The page behind is scaled and frosted while the drawer is open.</p>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">Cancel</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="solid" size="sm">Confirm</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
