import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@lglite/react";
import { frostedControl, toneControl } from "./glass-controls";

// Args drive the glass surface, which is the TabsList (not the Tabs root).
const meta: Meta<typeof TabsList> = {
  title: "Components/Tabs",
  component: TabsList,
  argTypes: {
    frosted: frostedControl,
    tone: toneControl,
  },
};
export default meta;
type Story = StoryObj<typeof TabsList>;

export const Basic: Story = {
  args: { frosted: false, tone: "default" },
  render: (args) => (
    <Tabs defaultValue="overview" style={{ width: 380 }}>
      <TabsList {...args}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview — the glass indicator slid under this tab.</TabsContent>
      <TabsContent value="activity">Activity panel.</TabsContent>
      <TabsContent value="settings">Settings panel.</TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="a" orientation="vertical" style={{ display: "flex", gap: "1rem" }}>
      <TabsList>
        <TabsTrigger value="a">First</TabsTrigger>
        <TabsTrigger value="b">Second</TabsTrigger>
        <TabsTrigger value="c">Third</TabsTrigger>
      </TabsList>
      <TabsContent value="a">First panel.</TabsContent>
      <TabsContent value="b">Second panel.</TabsContent>
      <TabsContent value="c">Third panel.</TabsContent>
    </Tabs>
  ),
};
