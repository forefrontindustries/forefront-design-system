import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Modal,
  Switch,
  Tabs,
  TextField,
  Tooltip,
  useToast,
} from "@forefront/ui";

interface PropRow {
  name: string;
  type: string;
  note: string;
}

function PropTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="d-scroll">
      <table className="d-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="d-token-name">{row.name}</td>
              <td className="d-mono d-muted">{row.type}</td>
              <td>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Specimen({
  name,
  summary,
  a11y,
  props,
  children,
}: {
  name: string;
  summary: string;
  a11y: string;
  props: PropRow[];
  children: React.ReactNode;
}) {
  return (
    <section className="d-specimen" id={name.toLowerCase()}>
      <div className="d-row">
        <h2 className="d-h2">{name}</h2>
        <a className="d-mono d-muted" href={`/storybook/index.html?path=/docs/${name.toLowerCase()}`}>
          open in Storybook
        </a>
      </div>
      <p className="d-body">{summary}</p>
      <div className="d-specimen-stage">{children}</div>
      <div className="d-check">
        <span className="d-check-mark" aria-hidden="true">
          A
        </span>
        <p style={{ margin: 0 }}>{a11y}</p>
      </div>
      <PropTable rows={props} />
    </section>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="d-row">
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Tokens rebuilt", description: "350 custom properties emitted.", tone: "success" })}
      >
        Success toast
      </Button>
      <Button
        variant="danger"
        onClick={() => toast({ title: "Contrast gate failed", description: "color-text-muted on canvas is 3.9:1.", tone: "danger" })}
      >
        Danger toast
      </Button>
    </div>
  );
}

export default function Components() {
  const [modalOpen, setModalOpen] = useState(false);
  const [notify, setNotify] = useState(true);
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Library</p>
        <h1 className="d-h1">Components</h1>
        <p className="d-lead">
          Ten components, every one built on the same rules: token only styling, a documented keyboard model, and a
          prop surface small enough to review. These previews are the real package, running against the theme and
          density you picked in the top bar.
        </p>
      </section>

      <Specimen
        name="Button"
        summary="Four variants and three sizes, all geometry from tier 3 tokens so compact density resizes it without touching colour."
        a11y="Real button element, focus ring from the shared token pair, disabled state keeps a 3:1 contrast against its surface."
        props={[
          { name: "variant", type: `"primary" | "secondary" | "ghost" | "danger"`, note: "Default primary." },
          { name: "size", type: `"sm" | "md" | "lg"`, note: "Height, padding, and font size come from button tokens." },
          { name: "loading", type: "boolean", note: "Sets aria-busy and blocks the click without removing the element from the tab order." },
          { name: "iconOnly", type: "boolean", note: "Requires an aria-label. Square geometry from button-size tokens." },
        ]}
      >
        <div className="d-stack">
          <div className="d-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="d-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Specimen>

      <Specimen
        name="Badge"
        summary="Status tone for a compact label. Tones map to the semantic contract, never to a primitive colour."
        a11y="Colour is never the only signal, so the tone is always accompanied by text."
        props={[
          { name: "tone", type: `"neutral" | "accent" | "success" | "warning" | "danger"`, note: "Resolves to a themed surface and text pair." },
        ]}
      >
        <div className="d-row">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Stable</Badge>
          <Badge tone="warning">Beta</Badge>
          <Badge tone="danger">Deprecated</Badge>
        </div>
      </Specimen>

      <Specimen
        name="Field"
        summary="The wiring primitive for every form control. It owns the id, the description link, and the invalid flag, and hands them to whatever control you render."
        a11y="Label is always associated, hint and error share one describedby target, error text is announced through role alert."
        props={[
          { name: "label", type: "string", note: "Required. There is no unlabelled path." },
          { name: "hint", type: "ReactNode", note: "Replaced by error when both are present." },
          { name: "error", type: "ReactNode", note: "Marks the control invalid and announces the message." },
          { name: "children", type: "(ids) => ReactNode", note: "Render prop receiving id, describedBy, invalid." },
        ]}
      >
        <div className="d-stack" style={{ maxWidth: "var(--fds-size-form-max)" }}>
          <TextField label="Token name" hint="Lowercase, dash separated, intent first." placeholder="color-text-primary" />
          <TextField label="Theme" error="A theme must supply every contract token." defaultValue="forefront-mono" />
          <Field label="Alias target" hint="Reference a tier 1 primitive.">
            {({ id, describedBy, invalid }) => (
              <Input id={id} aria-describedby={describedBy} aria-invalid={invalid} placeholder="{color.blue.400}" />
            )}
          </Field>
        </div>
      </Specimen>

      <Specimen
        name="Checkbox"
        summary="Native input under a token drawn indicator, so form semantics and validation stay free."
        a11y="Indicator is aria-hidden, the input keeps focus, and indeterminate is a real DOM property rather than a class."
        props={[
          { name: "label", type: "ReactNode", note: "Rendered beside the control and linked to it." },
          { name: "indeterminate", type: "boolean", note: "Sets the DOM property so assistive tech reports mixed." },
        ]}
      >
        <div className="d-stack">
          <Checkbox label="Run the contrast gate on every push" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
          <Checkbox label="Indeterminate example" indeterminate />
          <Checkbox label="Disabled" disabled />
        </div>
      </Specimen>

      <Specimen
        name="Switch"
        summary="For settings that apply immediately. If the change needs a save button, use a checkbox instead."
        a11y="role switch with aria-checked, operable with Space and Enter, label linked through the control."
        props={[
          { name: "label", type: "ReactNode", note: "Accessible name. Required." },
          { name: "checked", type: "boolean", note: "Standard input prop. The control is a native checkbox with role switch." },
          { name: "onChange", type: "(event) => void", note: "Native change event, so the control works inside a form without extra wiring." },
        ]}
      >
        <div className="d-stack">
          <Switch
            label="Publish release notes automatically"
            checked={notify}
            onChange={(event) => setNotify(event.target.checked)}
          />
          <Switch label="Disabled switch" checked={false} disabled readOnly />
        </div>
      </Specimen>

      <Specimen
        name="Card"
        summary="The one surface container. Padding, radius, and border all come from card tokens, which is why compact density reflows it correctly."
        a11y="Interactive cards render as a link or button rather than a div with a click handler."
        props={[
          { name: "title", type: "ReactNode", note: "Rendered as the card heading." },
          { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", note: "Keeps the document outline correct. Default 3." },
          { name: "elevation", type: `"raised" | "none"`, note: "Chooses the surface token pair." },
        ]}
      >
        <div className="d-grid-2">
          <Card title="Raised">
            <p style={{ margin: 0 }}>Default surface for content that sits above the canvas.</p>
          </Card>
          <Card title="Flat" elevation="none">
            <p style={{ margin: 0 }}>No shadow, for dense lists where stacked elevation gets noisy.</p>
          </Card>
        </div>
      </Specimen>

      <Specimen
        name="Tabs"
        summary="Roving tabindex with automatic activation, which is the right call when panels are already rendered."
        a11y="Arrow keys move selection, Home and End jump to the ends, disabled tabs are skipped, one tab stop for the whole list."
        props={[
          { name: "items", type: "TabItem[]", note: "id, label, content, optional disabled." },
          { name: "label", type: "string", note: "Accessible name for the tablist. Required." },
          { name: "defaultId", type: "string", note: "Defaults to the first enabled tab." },
        ]}
      >
        <Tabs
          label="Platform output"
          items={[
            { id: "css", label: "CSS", content: <p style={{ margin: 0 }}>Custom properties with theme and density attributes.</p> },
            { id: "native", label: "React Native", content: <p style={{ margin: 0 }}>Resolved unitless numbers, no var() indirection.</p> },
            { id: "figma", label: "Figma", content: <p style={{ margin: 0 }}>Variables with real alias references, not flattened hex.</p> },
            { id: "md3", label: "Material 3", content: <p style={{ margin: 0 }}>md.sys.* bridge for Android surfaces.</p>, disabled: false },
          ]}
        />
      </Specimen>

      <Specimen
        name="Modal"
        summary="A dialog that actually behaves like one: focus trapped, background scroll locked, focus returned to the trigger on close."
        a11y="role dialog with aria-modal, labelled by its heading, Escape closes, first focusable element receives focus on open."
        props={[
          { name: "open", type: "boolean", note: "Controlled." },
          { name: "onClose", type: "() => void", note: "Called by Escape, the close button, and the backdrop." },
          { name: "title", type: "string", note: "Becomes the accessible name." },
        ]}
      >
        <div className="d-row">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Promote token to the contract">
            <p className="d-body">
              Promoting a primitive to the semantic contract requires every theme to supply a value. Two themes will be
              updated by this change.
            </p>
            <div className="d-row">
              <Button onClick={() => setModalOpen(false)}>Promote</Button>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
      </Specimen>

      <Specimen
        name="Tooltip"
        summary="Supplementary text only. If the content is essential, it belongs in the interface, not behind a hover."
        a11y="Opens on hover and on focus, closes on Escape, linked with aria-describedby so it is never the only label."
        props={[
          { name: "content", type: "ReactNode", note: "Short supplementary text. Never interactive content." },
          { name: "children", type: "ReactElement", note: "The trigger. Receives aria-describedby, so it must accept props." },
        ]}
      >
        <div className="d-row">
          <Tooltip content="Fails the build when a theme is missing a contract token">
            <Button variant="secondary">Validate</Button>
          </Tooltip>
          <Tooltip content="Measured against WCAG 2.2 AA">
            <Button variant="ghost">Contrast</Button>
          </Tooltip>
        </div>
      </Specimen>

      <Specimen
        name="Toast"
        summary="Provider plus hook. One live region for the whole app, capped so the viewport never fills up."
        a11y="Polite for neutral and success, assertive for danger, every toast has a real dismiss button so auto dismiss is never the only exit."
        props={[
          { name: "toast(options)", type: "(o: ToastOptions) => number", note: "title, description, tone, duration. Duration 0 requires manual dismiss." },
          { name: "max", type: "number", note: "Provider prop. Default 3." },
        ]}
      >
        <ToastDemo />
      </Specimen>
    </>
  );
}
