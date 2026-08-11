import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardTitle,
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from "@forefront/ui";
import { ArrowRight, Download, Plus, Trash2 } from "lucide-react";
import { Demo } from "../components/docs/blocks";
import { Playground } from "../components/docs/playground";

/** Live examples for Button, Badge, Card and Tabs. */

export function ButtonPlayground() {
	return (
		<Playground
			interfaceName="ButtonProps"
			componentName="Button"
			props={["variant", "size", "loading", "fullWidth"]}
			initial={{ variant: "primary", size: "md" }}
		>
			{(values) => (
				<Button
					variant={values.variant as never}
					size={values.size as never}
					loading={Boolean(values.loading)}
					fullWidth={Boolean(values.fullWidth)}
				>
					Save changes
				</Button>
			)}
		</Playground>
	);
}

export function ButtonExamples() {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<Demo
				title="Variants"
				caption="One primary per view. The variant is a hierarchy decision, which is why there is no colour prop."
				code={`<Button variant="primary">Publish</Button>
<Button variant="secondary">Save draft</Button>
<Button variant="subtle">Duplicate</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>`}
			>
				<Button variant="primary">Publish</Button>
				<Button variant="secondary">Save draft</Button>
				<Button variant="subtle">Duplicate</Button>
				<Button variant="ghost">Cancel</Button>
				<Button variant="danger">Delete</Button>
			</Demo>

			<Demo
				title="Sizes and icons"
				caption="Heights come from control.height, shared with Input and Select, so a button and a field line up on the same row without a magic number."
				code={`<Button size="sm" iconStart={<Plus />}>Add row</Button>
<Button size="md" iconEnd={<ArrowRight />}>Continue</Button>
<Button size="lg" variant="secondary" iconStart={<Download />}>Export CSV</Button>`}
			>
				<Button size="sm" iconStart={<Plus />}>
					Add row
				</Button>
				<Button size="md" iconEnd={<ArrowRight />}>
					Continue
				</Button>
				<Button size="lg" variant="secondary" iconStart={<Download />}>
					Export CSV
				</Button>
			</Demo>

			<Demo
				title="Loading is not disabled"
				caption="Click it and tab away. The button keeps focus and stays in the tab order while it works, because disabling on submit throws a keyboard user back to the top of the document."
				code={`const [loading, setLoading] = useState(false);

<Button
	loading={loading}
	onClick={() => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2200);
	}}
>
	Submit invoice
</Button>`}
			>
				<Button
					loading={loading}
					onClick={() => {
						setLoading(true);
						setTimeout(() => setLoading(false), 2200);
					}}
				>
					Submit invoice
				</Button>
				<Button variant="secondary" disabled>
					Disabled for comparison
				</Button>
				<Button variant="danger" iconStart={<Trash2 />}>
					Delete project
				</Button>
			</Demo>
		</>
	);
}

export function BadgePlayground() {
	return (
		<Playground
			interfaceName="BadgeProps"
			componentName="Badge"
			props={["tone", "variant", "dot"]}
			initial={{ tone: "success", variant: "subtle" }}
		>
			{(values) => (
				<Badge tone={values.tone as never} variant={values.variant as never} dot={Boolean(values.dot)}>
					Active
				</Badge>
			)}
		</Playground>
	);
}

export function BadgeExamples() {
	return (
		<>
			<Demo
				title="Tones, subtle"
				caption="Subtle badges carry a hairline border of the same family. Without it the tint is nearly invisible on a raised surface in the light themes."
				code={`<Badge tone="neutral">Draft</Badge>
<Badge tone="accent">New</Badge>
<Badge tone="success">Paid</Badge>
<Badge tone="warning">Review</Badge>
<Badge tone="danger">Failed</Badge>
<Badge tone="info">Syncing</Badge>`}
			>
				<Badge tone="neutral">Draft</Badge>
				<Badge tone="accent">New</Badge>
				<Badge tone="success">Paid</Badge>
				<Badge tone="warning">Review</Badge>
				<Badge tone="danger">Failed</Badge>
				<Badge tone="info">Syncing</Badge>
			</Demo>

			<Demo
				title="Tones, bold"
				caption="Every filled tone is paired with an on-* text token rather than plain white, and those pairs are the ones audited on the accessibility page for both themes."
				code={`<Badge tone="neutral" variant="bold">Draft</Badge>
<Badge tone="success" variant="bold">Paid</Badge>
<Badge tone="danger" variant="bold">Failed</Badge>`}
			>
				<Badge tone="neutral" variant="bold">
					Draft
				</Badge>
				<Badge tone="accent" variant="bold">
					New
				</Badge>
				<Badge tone="success" variant="bold">
					Paid
				</Badge>
				<Badge tone="warning" variant="bold">
					Review
				</Badge>
				<Badge tone="danger" variant="bold">
					Failed
				</Badge>
			</Demo>

			<Demo
				title="Status dots and screen reader labels"
				caption="The dot supplements the label, never replaces it. srLabel supplies full text when the visible label is abbreviated for space."
				code={`<Badge tone="success" dot>Live</Badge>
<Badge tone="warning" dot>Degraded</Badge>
<Badge tone="neutral" srLabel="Requires attention">RQA</Badge>`}
			>
				<Badge tone="success" dot>
					Live
				</Badge>
				<Badge tone="warning" dot>
					Degraded
				</Badge>
				<Badge tone="danger" dot>
					Offline
				</Badge>
				<Badge tone="neutral" srLabel="Requires attention">
					RQA
				</Badge>
			</Demo>
		</>
	);
}

export function CardPlayground() {
	return (
		<Playground
			interfaceName="CardProps"
			componentName="Card"
			props={["variant", "interactive", "flush"]}
			initial={{ variant: "outlined" }}
		>
			{(values) => (
				<Card
					variant={values.variant as never}
					interactive={Boolean(values.interactive)}
					flush={Boolean(values.flush)}
					style={{ maxWidth: "22rem" }}
				>
					<CardHeader>
						<CardTitle level={3}>Retention pipeline</CardTitle>
						<Badge tone="success" dot>
							Live
						</Badge>
					</CardHeader>
					<CardBody>
						<p style={{ margin: 0 }}>
							Segments rebuild every four hours. Last run finished in 38 seconds.
						</p>
					</CardBody>
					<CardFooter>
						<span>Updated 12 minutes ago</span>
						<Button variant="ghost" size="sm" iconEnd={<ArrowRight />}>
							Open
						</Button>
					</CardFooter>
				</Card>
			)}
		</Playground>
	);
}

export function CardExamples() {
	return (
		<>
			<Demo
				title="Surface treatments"
				caption="Outlined is the default. Raised is for content floating above a list, sunken for read-only detail inside another surface."
				layout="row"
				code={`<Card variant="outlined">...</Card>
<Card variant="raised">...</Card>
<Card variant="sunken">...</Card>`}
			>
				{(["outlined", "raised", "sunken"] as const).map((variant) => (
					<Card key={variant} variant={variant} style={{ flex: "1 1 14rem", minWidth: "13rem" }}>
						<CardHeader>
							<CardTitle level={3}>{variant}</CardTitle>
						</CardHeader>
						<CardBody>
							<p style={{ margin: 0 }}>Hairlines define structure. Elevation is reserved for overlays.</p>
						</CardBody>
					</Card>
				))}
			</Demo>

			<Demo
				title="Stretched link, not a clickable div"
				caption="Tab to the title. The anchor holds the accessible name and the keyboard behaviour, its pseudo-element covers the card for the pointer, and the ring is drawn by the card through :focus-within."
				code={`<Card interactive>
	<CardHeader>
		<CardTitle level={3}>
			<a className="fds-card__link" href="/components/card">
				Q3 revenue model
			</a>
		</CardTitle>
	</CardHeader>
	<CardBody>Whole card is a pointer target, one accessible name.</CardBody>
</Card>`}
			>
				<Card interactive style={{ maxWidth: "24rem" }}>
					<CardHeader>
						<CardTitle level={3}>
							<a className="fds-card__link" href="/components/card">
								Q3 revenue model
							</a>
						</CardTitle>
						<Badge tone="accent">Shared</Badge>
					</CardHeader>
					<CardBody>
						<p style={{ margin: 0 }}>
							The whole card is a pointer target and there is still exactly one accessible name.
						</p>
					</CardBody>
					<CardFooter>
						<span>Owner: Finance</span>
					</CardFooter>
				</Card>
			</Demo>
		</>
	);
}

export function TabsPlayground() {
	return (
		<Playground
			interfaceName="TabsProps"
			componentName="Tabs"
			props={["orientation", "activation"]}
			initial={{ orientation: "horizontal", activation: "automatic" }}
			code={(values) =>
				`<Tabs defaultValue="overview" orientation="${values.orientation}" activation="${values.activation}">
	<TabList aria-label="Project sections">
		<Tab value="overview">Overview</Tab>
		<Tab value="activity" badge={12}>Activity</Tab>
		<Tab value="settings">Settings</Tab>
		<Tab value="billing" disabled>Billing</Tab>
	</TabList>
	<TabPanel value="overview">...</TabPanel>
</Tabs>`
			}
		>
			{(values) => (
				<Tabs
					defaultValue="overview"
					orientation={values.orientation as never}
					activation={values.activation as never}
					style={{ width: "100%" }}
				>
					<TabList aria-label="Project sections">
						<Tab value="overview">Overview</Tab>
						<Tab value="activity" badge={12}>
							Activity
						</Tab>
						<Tab value="settings">Settings</Tab>
						<Tab value="billing" disabled>
							Billing
						</Tab>
					</TabList>
					<TabPanel value="overview">
						<p className="prose" style={{ margin: 0 }}>
							Focus a tab and use the arrow keys. The list is one tab stop, arrows wrap at both ends, and
							Home and End jump to the first and last enabled tab.
						</p>
					</TabPanel>
					<TabPanel value="activity">
						<p className="prose" style={{ margin: 0 }}>
							Twelve events since Monday. Switch activation to manual and the panel only changes on Enter
							or Space, which is what you want when a panel fetches data.
						</p>
					</TabPanel>
					<TabPanel value="settings">
						<p className="prose" style={{ margin: 0 }}>
							Tab order comes from the DOM rather than a registry in React state, so a conditionally
							rendered tab cannot desynchronise the arrow keys.
						</p>
					</TabPanel>
					<TabPanel value="billing">
						<p className="prose" style={{ margin: 0 }}>
							Unreachable: disabled tabs are skipped by the arrow keys as well as by the pointer.
						</p>
					</TabPanel>
				</Tabs>
			)}
		</Playground>
	);
}

export function TabsExamples() {
	return (
		<Demo
			title="Vertical orientation"
			caption="Vertical also changes which arrows navigate. A keyboard model that does not match the visual direction is worse than no keyboard model."
			layout="column"
			code={`<Tabs defaultValue="general" orientation="vertical">
	<TabList aria-label="Settings">
		<Tab value="general">General</Tab>
		<Tab value="members" badge={4}>Members</Tab>
		<Tab value="api">API keys</Tab>
	</TabList>
	<TabPanel value="general">...</TabPanel>
</Tabs>`}
		>
			<Tabs defaultValue="general" orientation="vertical" style={{ width: "100%" }}>
				<TabList aria-label="Settings">
					<Tab value="general">General</Tab>
					<Tab value="members" badge={4}>
						Members
					</Tab>
					<Tab value="api">API keys</Tab>
				</TabList>
				<TabPanel value="general">
					<p className="prose" style={{ margin: 0 }}>
						Up and down move between tabs here. Left and right are left alone for text navigation.
					</p>
				</TabPanel>
				<TabPanel value="members">
					<p className="prose" style={{ margin: 0 }}>
						Four members, two pending invitations.
					</p>
				</TabPanel>
				<TabPanel value="api">
					<p className="prose" style={{ margin: 0 }}>
						Rotate keys every 90 days.
					</p>
				</TabPanel>
			</Tabs>
		</Demo>
	);
}
