import type { Meta, StoryObj } from "@storybook/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@lglite/react";
import { frostedControl, lensControl } from "./glass-controls";

// The glass knobs (`frosted`/`lens`) and `withHandle` live on ResizableHandle, so
// the story drives the handle. Type the meta on the handle to expose them.
const meta: Meta<typeof ResizableHandle> = {
  title: "Components/Resizable",
  component: ResizableHandle,
  argTypes: {
    withHandle: { control: "boolean" },
    frosted: frostedControl,
    lens: lensControl,
  },
  args: { withHandle: true, frosted: true },
};
export default meta;
type Story = StoryObj<typeof ResizableHandle>;

const panelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  fontWeight: 600,
};

export const Basic: Story = {
  render: (args) => (
    <ResizablePanelGroup
      direction="horizontal"
      style={{ height: 220, width: 420, borderRadius: "0.75rem", overflow: "hidden", border: "1px solid rgb(var(--glass-rim) / 0.3)" }}
    >
      <ResizablePanel defaultSize={40}>
        <div style={panelStyle}>Sidebar</div>
      </ResizablePanel>
      <ResizableHandle {...args} />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={55}>
            <div style={panelStyle}>Header</div>
          </ResizablePanel>
          <ResizableHandle {...args} />
          <ResizablePanel defaultSize={45}>
            <div style={panelStyle}>Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
