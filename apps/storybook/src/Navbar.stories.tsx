import type { Meta, StoryObj } from "@storybook/react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, type NavbarProps } from "@lglite/react";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  argTypes: {
    magnify: { control: "boolean" },
    frosted: { control: "boolean" },
    plate: { control: "boolean" },
    tone: { control: "inline-radio", options: ["default", "primary", "destructive"] },
  },
};
export default meta;
type Story = StoryObj<typeof Navbar>;

export const Basic: Story = {
  args: { magnify: false },
  render: (args: NavbarProps) => (
    <Navbar {...args} aria-label="Main" style={{ maxWidth: 720 }}>
      <NavbarBrand>◆ LGLite</NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem active asChild>
          <a href="#home">Home</a>
        </NavbarItem>
        <NavbarItem asChild>
          <a href="#docs">Docs</a>
        </NavbarItem>
        <NavbarItem asChild>
          <a href="#components">Components</a>
        </NavbarItem>
        <NavbarItem asChild>
          <a href="#pricing">Pricing</a>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button size="sm" variant="ghost">
          Sign in
        </Button>
        <Button size="sm" variant="solid" tone="primary">
          Get started
        </Button>
      </NavbarContent>
    </Navbar>
  ),
};

/** Optional dock-style pointer magnification on the nav links (subtle). */
export const Magnify: Story = {
  args: { magnify: true },
  render: Basic.render,
};
