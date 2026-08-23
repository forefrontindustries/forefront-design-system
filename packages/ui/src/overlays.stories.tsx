import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Modal } from "./modal";
import { Tabs } from "./tabs";
import { ToastProvider, useToast } from "./toast";
import { Tooltip } from "./tooltip";

const meta = {
  title: "Components/Overlays",
  parameters: { controls: { disable: true }, layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardExample: Story = {
  name: "Card",
  render: () => (
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
      <Card title="Semantic contract">
        <p style={{ margin: 0 }}>66 named intents. Themes supply the values, components never see a hex.</p>
      </Card>
      <Card title="Component tokens" elevation="none">
        <p style={{ margin: 0 }}>67 geometry tokens. Density remaps these and nothing else.</p>
      </Card>
    </div>
  ),
};

export const TabsExample: Story = {
  name: "Tabs",
  parameters: {
    docs: {
      description: {
        story:
          "Roving tabindex with arrow keys, Home, and End. Tab moves out of the list into the panel instead of stepping through every tab.",
      },
    },
  },
  render: () => (
    <Tabs
      label="Token tiers"
      items={[
        { id: "primitives", label: "Primitives", content: <p>134 literals. The only tier where raw values exist.</p> },
        { id: "semantic", label: "Semantic", content: <p>66 intents. Value-less by design so themes stay complete.</p> },
        { id: "component", label: "Component", content: <p>67 geometry tokens, remapped by density.</p> },
        { id: "legacy", label: "Legacy", content: <p>Nothing here.</p>, disabled: true },
      ]}
    />
  ),
};

export const TooltipExample: Story = {
  name: "Tooltip",
  parameters: {
    docs: {
      description: {
        story: "Opens on hover and on keyboard focus, dismisses on Escape, and is wired with aria-describedby.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", gap: "1rem", paddingBlockStart: "4rem" }}>
      <Tooltip content="Runs the contrast gate against both themes before publish.">
        <Button variant="secondary">Why does CI fail?</Button>
      </Tooltip>
    </div>
  ),
};

export const ModalExample: Story = {
  name: "Modal",
  parameters: {
    docs: {
      description: {
        story:
          "Focus moves in on open and returns to the trigger on close. Tab is trapped, Escape closes, background scroll is locked.",
      },
    },
  },
  render: function ModalStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Deprecate token</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Deprecate color-surface-accent-soft?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Open deprecation PR
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Deprecation keeps the token alive for two minor releases with a console warning, then removes it in the next
            major.
          </p>
        </Modal>
      </>
    );
  },
};

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Button onClick={() => toast({ title: "Tokens rebuilt", description: "350 custom properties emitted." })}>
        Neutral
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Contrast gate passed", description: "40 pairs, both themes.", tone: "success" })}
      >
        Success
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            title: "Theme incomplete",
            description: "forefront-light is missing color-text-on-warning.",
            tone: "danger",
            duration: 0,
          })
        }
      >
        Danger (manual dismiss)
      </Button>
    </div>
  );
}

export const ToastExample: Story = {
  name: "Toast",
  parameters: {
    docs: {
      description: {
        story:
          "One live region for the whole app. Danger toasts switch it to assertive and never auto dismiss, because an error the user did not read is an error they cannot act on.",
      },
    },
  },
  render: () => (
    <ToastProvider max={3}>
      <ToastDemo />
    </ToastProvider>
  ),
};
