import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

// Accordion is a Radix discriminated union (single|multiple); typing the story to
// only the glass props avoids widening `defaultValue` while keeping the controls.
type GlassArgs = { frosted?: boolean; tone?: "default" | "primary" | "destructive" | "success"; plate?: boolean };

const meta: Meta<GlassArgs> = {
  title: "Components/Accordion",
  component: Accordion,
  argTypes: glassSurfaceArgTypes,
};
export default meta;
type Story = StoryObj<GlassArgs>;

export const Basic: Story = {
  args: { frosted: false, tone: "default", plate: false },
  render: (args) => (
    <Accordion {...args} type="single" collapsible style={{ width: 360 }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it glassy?</AccordionTrigger>
        <AccordionContent>Yes — flat inline content, no backdrop-filter here.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It uses Radix Accordion under the hood.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Does it animate?</AccordionTrigger>
        <AccordionContent>It slides open, and respects reduced-motion.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
