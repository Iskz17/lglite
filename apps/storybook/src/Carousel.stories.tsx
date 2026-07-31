import type { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Card,
  CardContent,
} from "@lglite/react";
import { glassControl, frostedControl } from "./glass-controls";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    glass: glassControl,
    frosted: frostedControl,
  },
};
export default meta;
type Story = StoryObj<typeof Carousel>;

const slides = [1, 2, 3, 4, 5];

export const Basic: Story = {
  args: { orientation: "horizontal", glass: true, frosted: true },
  render: (args) => (
    <Carousel {...args} style={{ width: 260, margin: "0 3rem" }}>
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n}>
            <Card>
              <CardContent
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 160,
                  fontSize: "2.5rem",
                  fontWeight: 600,
                }}
              >
                {n}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
