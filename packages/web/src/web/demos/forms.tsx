import { useState } from "react";
import { Button, Checkbox, Input, Radio, RadioGroup, Select, Switch } from "@forefront/ui";
import { Mail, Search } from "lucide-react";
import { Demo } from "../components/docs/blocks";
import { Playground } from "../components/docs/playground";

/** Live examples for Input, Select, Checkbox, RadioGroup and Switch. */

const regions = [
	{ value: "us-east", label: "US East", description: "Virginia. Lowest latency for the current account." },
	{ value: "us-west", label: "US West", description: "Oregon." },
	{ value: "eu-central", label: "EU Central", description: "Frankfurt. Data stays in the EU." },
	{ value: "ap-south", label: "AP South", description: "Mumbai." },
	{ value: "sa-east", label: "SA East", description: "Sao Paulo. Not available on the current plan.", disabled: true },
];

export function InputPlayground() {
	return (
		<Playground
			interfaceName="InputProps"
			componentName="Input"
			props={["size", "required", "fullWidth"]}
			initial={{ size: "md" }}
		>
			{(values) => (
				<div style={{ width: "min(100%, 24rem)" }}>
					<Input
						size={values.size as never}
						required={Boolean(values.required)}
						fullWidth={Boolean(values.fullWidth ?? true)}
						label="Work email"
						description="We use this for billing receipts only."
						placeholder="you@company.com"
						iconStart={<Mail />}
						type="email"
						autoComplete="email"
					/>
				</div>
			)}
		</Playground>
	);
}

export function InputExamples() {
	const [email, setEmail] = useState("jeremy@");
	const invalid = !email.includes("@") || email.endsWith("@");

	return (
		<>
			<Demo
				title="Validation is derived from the error prop"
				caption="There is no invalid boolean. Passing an error is what turns the field red, so it is impossible to render a red field with no explanation."
				layout="column"
				code={`const invalid = !email.includes("@") || email.endsWith("@");

<Input
	label="Work email"
	value={email}
	onChange={(event) => setEmail(event.currentTarget.value)}
	error={invalid ? "Enter a full email address, including the domain." : undefined}
	required
/>`}
			>
				<div style={{ maxWidth: "26rem" }}>
					<Input
						label="Work email"
						value={email}
						onChange={(event) => setEmail(event.currentTarget.value)}
						error={invalid ? "Enter a full email address, including the domain." : undefined}
						description="Type a valid address and the message clears."
						required
						type="email"
					/>
				</div>
			</Demo>

			<Demo
				title="Sizes and adornments"
				caption="Adornments are decorative and hidden from assistive technology. The label always carries the name, even when the design shows none."
				layout="column"
				code={`<Input size="sm" iconStart={<Search />} placeholder="Filter rows" label="Filter" />
<Input size="lg" label="Invoice reference" iconEnd={<span>.pdf</span>} />
<Input label="Disabled" disabled value="Locked by your administrator" />`}
			>
				<div style={{ display: "grid", gap: "var(--fds-space-6)", maxWidth: "26rem" }}>
					<Input size="sm" label="Filter" iconStart={<Search />} placeholder="Filter rows" />
					<Input size="lg" label="Invoice reference" iconEnd={<span>.pdf</span>} placeholder="INV-2026-" />
					<Input label="Disabled" disabled value="Locked by your administrator" readOnly />
				</div>
			</Demo>
		</>
	);
}

export function SelectPlayground() {
	const [value, setValue] = useState("us-east");
	return (
		<Playground
			interfaceName="SelectProps"
			componentName="Select"
			props={["size", "required", "disabled"]}
			initial={{ size: "md" }}
			code={(values) =>
				`<Select
	label="Primary region"
	size="${values.size}"
	options={regions}
	value={value}
	onChange={setValue}
	name="region"
/>`
			}
		>
			{(values) => (
				<div style={{ width: "min(100%, 24rem)" }}>
					<Select
						label="Primary region"
						description="Typeahead works: focus the trigger and type e-u."
						size={values.size as never}
						required={Boolean(values.required)}
						disabled={Boolean(values.disabled)}
						options={regions}
						value={value}
						onChange={setValue}
						name="region"
					/>
				</div>
			)}
		</Playground>
	);
}

export function SelectExamples() {
	const [value, setValue] = useState<string | undefined>(undefined);

	return (
		<>
			<Demo
				title="Placeholder, descriptions and a disabled option"
				caption="Option descriptions are the reason this is not a native select. Arrow to the last option: disabled rows are skipped by the keyboard as well as the pointer."
				layout="column"
				code={`<Select
	label="Primary region"
	placeholder="Choose a region"
	options={regions}
	value={value}
	onChange={setValue}
	error={!value ? "Pick a region to continue." : undefined}
/>`}
			>
				<div style={{ maxWidth: "26rem" }}>
					<Select
						label="Primary region"
						placeholder="Choose a region"
						options={regions}
						value={value}
						onChange={setValue}
						error={!value ? "Pick a region to continue." : undefined}
					/>
				</div>
			</Demo>

			<Demo
				title="Aligned with the other controls"
				caption="Select, Input and Button all read control.height, so they line up on one row at every size and in both densities. Switch density in the top bar and watch the row stay aligned."
				code={`<Input size="md" label="Search" />
<Select size="md" label="Region" options={regions} />
<Button size="md">Apply</Button>`}
			>
				<div
					style={{
						display: "flex",
						gap: "var(--fds-space-5)",
						alignItems: "flex-end",
						flexWrap: "wrap",
						width: "100%",
					}}
				>
					<Input label="Search" placeholder="Account name" iconStart={<Search />} />
					<Select label="Region" options={regions} defaultValue="eu-central" />
					<Button>Apply</Button>
				</div>
			</Demo>
		</>
	);
}

export function CheckboxPlayground() {
	return (
		<Playground
			interfaceName="CheckboxProps"
			componentName="Checkbox"
			props={["indeterminate", "required", "disabled"]}
		>
			{(values) => (
				<Checkbox
					label="Send me the weekly digest"
					description="A summary of pipeline changes every Monday at 08:00."
					indeterminate={Boolean(values.indeterminate)}
					required={Boolean(values.required)}
					disabled={Boolean(values.disabled)}
				/>
			)}
		</Playground>
	);
}

export function CheckboxExamples() {
	const [items, setItems] = useState([true, false, false]);
	const all = items.every(Boolean);
	const some = items.some(Boolean) && !all;

	return (
		<Demo
			title="Mixed state driven by children"
			caption="The parent writes the indeterminate DOM property, which is what makes a screen reader announce mixed rather than unchecked. There is no HTML attribute for it, so it has to be set on every commit."
			layout="column"
			code={`const all = items.every(Boolean);
const some = items.some(Boolean) && !all;

<Checkbox
	label="All regions"
	checked={all}
	indeterminate={some}
	onChange={(event) => setItems(items.map(() => event.currentTarget.checked))}
/>`}
		>
			<div style={{ display: "grid", gap: "var(--fds-space-5)" }}>
				<Checkbox
					label="All regions"
					checked={all}
					indeterminate={some}
					onChange={(event) => setItems(items.map(() => event.currentTarget.checked))}
				/>
				<div style={{ display: "grid", gap: "var(--fds-space-5)", paddingInlineStart: "var(--fds-space-8)" }}>
					{["US East", "EU Central", "AP South"].map((label, index) => (
						<Checkbox
							key={label}
							label={label}
							checked={items[index]}
							onChange={(event) =>
								setItems(items.map((value, i) => (i === index ? event.currentTarget.checked : value)))
							}
						/>
					))}
				</div>
				<Checkbox label="Disabled option" description="Requires the Scale plan." disabled />
				<Checkbox
					label="Accept the processing agreement"
					required
					error="You have to accept the agreement to continue."
				/>
			</div>
		</Demo>
	);
}

export function RadioPlayground() {
	return (
		<Playground
			interfaceName="RadioGroupProps"
			componentName="RadioGroup"
			props={["orientation", "required", "disabled"]}
			initial={{ orientation: "vertical" }}
			code={(values) =>
				`<RadioGroup
	label="Deployment strategy"
	defaultValue="rolling"
	orientation="${values.orientation}"
>
	<Radio value="rolling" label="Rolling" description="..." />
	<Radio value="blue-green" label="Blue / green" description="..." />
	<Radio value="canary" label="Canary" description="..." />
</RadioGroup>`
			}
		>
			{(values) => (
				<RadioGroup
					label="Deployment strategy"
					defaultValue="rolling"
					orientation={values.orientation as never}
					required={Boolean(values.required)}
					disabled={Boolean(values.disabled)}
					description="Arrow keys move and select. The group is one tab stop, provided by the browser."
				>
					<Radio value="rolling" label="Rolling" description="Replace instances in batches of 25%." />
					<Radio value="blue-green" label="Blue / green" description="Full parallel environment, instant cutover." />
					<Radio value="canary" label="Canary" description="5% of traffic for 30 minutes, then promote." />
				</RadioGroup>
			)}
		</Playground>
	);
}

export function RadioExamples() {
	return (
		<Demo
			title="No answer is an option, not an empty group"
			caption="A radio group cannot be cleared with the keyboard or the mouse. When empty is a valid answer, give it a row of its own instead of expecting the user to unselect."
			layout="column"
			code={`<RadioGroup label="Notify the team" defaultValue="none">
	<Radio value="all" label="Everyone in the workspace" />
	<Radio value="owners" label="Owners only" />
	<Radio value="none" label="Do not notify anyone" />
</RadioGroup>`}
		>
			<RadioGroup label="Notify the team" defaultValue="none">
				<Radio value="all" label="Everyone in the workspace" />
				<Radio value="owners" label="Owners only" />
				<Radio value="none" label="Do not notify anyone" />
			</RadioGroup>
		</Demo>
	);
}

export function SwitchPlayground() {
	return (
		<Playground
			interfaceName="SwitchProps"
			componentName="Switch"
			props={["labelPosition", "disabled"]}
			initial={{ labelPosition: "start" }}
		>
			{(values) => (
				<div style={{ width: "min(100%, 22rem)" }}>
					<Switch
						label="Two factor authentication"
						description="Applies immediately. No save step."
						labelPosition={values.labelPosition as never}
						disabled={Boolean(values.disabled)}
						defaultChecked
					/>
				</div>
			)}
		</Playground>
	);
}

export function SwitchExamples() {
	return (
		<Demo
			title="Settings list"
			caption="labelPosition end puts the controls on the trailing edge, which is the pattern for a list of settings. The label names the setting and never changes with the state."
			layout="column"
			code={`<Switch labelPosition="end" label="Weekly digest" defaultChecked />
<Switch labelPosition="end" label="Slack alerts" />
<Switch labelPosition="end" label="SMS alerts" disabled description="Add a phone number first." />`}
		>
			<div style={{ display: "grid", gap: "var(--fds-space-7)", maxWidth: "26rem", width: "100%" }}>
				<Switch labelPosition="end" label="Weekly digest" defaultChecked />
				<Switch labelPosition="end" label="Slack alerts" defaultChecked />
				<Switch
					labelPosition="end"
					label="SMS alerts"
					description="Add a phone number to enable this."
					disabled
				/>
			</div>
		</Demo>
	);
}
