import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@lglite/react";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Basic: Story = {
  render: () => (
    <Collapsible style={{ width: 340 }}>
      <CollapsibleTrigger asChild>
        <Button size="sm" variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div style={{ paddingTop: 12 }}>
          Hidden content revealed via Radix Collapsible. Animates with reduced-motion safety.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
