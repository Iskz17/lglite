import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: glassSurfaceArgTypes,
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    plate: false,
    tone: "default",
    frosted: false
  },

  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader>
        <CardTitle>Liquid Glass Card</CardTitle>
        <CardDescription>Testing frosted</CardDescription>
      </CardHeader>
      <CardContent>
        Testing testing
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="solid">Confirm</Button>
        <Button size="sm" variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  )
};

export const Plate: Story = {
  args: {
    plate: true,
    tone: "default"
  },
  render: Basic.render,
};
