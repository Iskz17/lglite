import type { Meta, StoryObj } from "@storybook/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lglite/react";
import { frostedControl, plateControl, toneControl } from "./glass-controls";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    plate: plateControl,
    frosted: frostedControl,
    tone: toneControl,
  },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Basic: Story = {
  args: { side: "left", plate: false, frosted: false, tone: "default" },
  render: (args) => (
    <div style={{ display: "flex", height: 480 }}>
      <Sidebar {...args}>
        <SidebarHeader>
          <strong>LGLite</strong>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton data-active>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Projects</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton>Sign out</SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};
