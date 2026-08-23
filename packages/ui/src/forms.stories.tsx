import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Field, Input, TextField } from "./field";
import { Switch } from "./switch";

const meta = {
  title: "Components/Forms",
  parameters: {
    controls: { disable: true },
    layout: "padded",
    docs: {
      description: {
        component:
          "Field owns the label, hint, error, and id wiring. A consumer cannot ship an input without a programmatic label, because Field hands the id to the control instead of trusting the caller to pass one.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextFields: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "22rem" }}>
      <TextField label="Work email" placeholder="you@company.com" hint="We only use this to send the invite." />
      <TextField label="Team name" required placeholder="Design Systems" />
      <TextField label="Seats" defaultValue="0" error="Seats must be at least 1." />
      <TextField label="Billing owner" defaultValue="jeremy@forefrontindustries.io" disabled />
    </div>
  ),
};

export const CustomControl: Story = {
  parameters: {
    docs: {
      description: {
        story: "Field is a render prop, so any control can inherit the same labelling contract.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: "22rem" }}>
      <Field label="Search tokens" hint="Try surface, text, or radius.">
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} type="search" placeholder="color-surface-accent" />
        )}
      </Field>
    </div>
  ),
};

export const Checkboxes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Checkbox label="Ship the release notes" defaultChecked />
      <Checkbox label="Notify the consuming teams" indeterminate />
      <Checkbox label="Skip the changelog" disabled />
    </div>
  ),
};

export const Switches: Story = {
  render: function Switches() {
    const [dark, setDark] = useState(true);
    return (
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <Switch label="Reduced motion" />
        <Switch label="Dark theme" checked={dark} onChange={(event) => setDark(event.target.checked)} />
        <Switch label="Locked by policy" disabled />
      </div>
    );
  },
};

export const Badges: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Badge tone="neutral">Draft</Badge>
      <Badge tone="accent" dot>
        In review
      </Badge>
      <Badge tone="success" dot>
        Stable
      </Badge>
      <Badge tone="warning" dot>
        Deprecated
      </Badge>
      <Badge tone="danger" dot>
        Removed
      </Badge>
      <Badge tone="info">v1.0.0</Badge>
    </div>
  ),
};
