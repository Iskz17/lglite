import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@lglite/react";

const meta: Meta = { title: "Components/Form" };
export default meta;
type Story = StoryObj;

type Values = { email: string };

function ExampleForm() {
  const form = useForm<Values>({ defaultValues: { email: "" } });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => alert(`Submitted: ${v.email}`))}
        style={{ display: "grid", gap: "1rem", width: 320 }}
      >
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required.",
            pattern: { value: /.+@.+\..+/, message: "Enter a valid email address." },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const Basic: Story = {
  render: () => <ExampleForm />,
};
