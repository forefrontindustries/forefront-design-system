import { useState } from "react";
import { Button, Input, Modal, Tooltip, useToast } from "@forefront/ui";
import { CircleHelp, Info } from "lucide-react";
import { Demo } from "../components/docs/blocks";
import { Playground } from "../components/docs/playground";

/** Live examples for Modal, Tooltip and Toast. */

export function ModalPlayground() {
	const [open, setOpen] = useState(false);

	return (
		<Playground
			interfaceName="ModalProps"
			componentName="Modal"
			props={["size", "dismissOnBackdrop", "hideCloseButton"]}
			initial={{ size: "md", dismissOnBackdrop: true }}
			code={(values) =>
				`<Modal
	open={open}
	onClose={() => setOpen(false)}
	title="Delete workspace"
	description="This removes every project, integration and API key."
	size="${values.size}"
	dismissOnBackdrop={${Boolean(values.dismissOnBackdrop)}}
	footer={
		<>
			<Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
			<Button variant="danger" onClick={confirm}>Delete workspace</Button>
		</>
	}
>
	<Input label="Type the workspace name to confirm" data-fds-autofocus />
</Modal>`
			}
		>
			{(values) => (
				<>
					<Button onClick={() => setOpen(true)}>Open dialog</Button>
					<Modal
						open={open}
						onClose={() => setOpen(false)}
						title="Delete workspace"
						description="This removes every project, integration and API key. It cannot be undone."
						size={values.size as never}
						dismissOnBackdrop={Boolean(values.dismissOnBackdrop)}
						hideCloseButton={Boolean(values.hideCloseButton)}
						footer={
							<>
								<Button variant="ghost" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button variant="danger" onClick={() => setOpen(false)}>
									Delete workspace
								</Button>
							</>
						}
					>
						<Input
							label="Type the workspace name to confirm"
							placeholder="forefront-production"
							data-fds-autofocus
						/>
						<p style={{ margin: 0 }}>
							Tab through this dialog. Focus wraps at both ends, the page behind cannot be reached, Escape
							closes, and focus returns to the button that opened it.
						</p>
					</Modal>
				</>
			)}
		</Playground>
	);
}

export function ModalExamples() {
	const [unsaved, setUnsaved] = useState(false);
	const [minimal, setMinimal] = useState(false);

	return (
		<>
			<Demo
				title="Protecting unsaved work"
				caption="dismissOnBackdrop is false here, so a stray click cannot discard what the user typed. Escape still works, because removing every dismissal route traps people."
				code={`<Modal open={open} onClose={close} title="Edit segment" dismissOnBackdrop={false}>
	<Input label="Segment name" data-fds-autofocus />
</Modal>`}
			>
				<Button variant="secondary" onClick={() => setUnsaved(true)}>
					Open dialog with unsaved work
				</Button>
				<Modal
					open={unsaved}
					onClose={() => setUnsaved(false)}
					title="Edit segment"
					description="Clicking the backdrop will not close this one."
					dismissOnBackdrop={false}
					footer={
						<>
							<Button variant="ghost" onClick={() => setUnsaved(false)}>
								Discard
							</Button>
							<Button onClick={() => setUnsaved(false)}>Save segment</Button>
						</>
					}
				>
					<Input label="Segment name" defaultValue="High intent, no purchase" data-fds-autofocus />
				</Modal>
			</Demo>

			<Demo
				title="Small, decision-only"
				caption="The title states the decision rather than naming a feature, and the primary action sits last on the trailing edge to match reading order."
				code={`<Modal
	open={open}
	onClose={close}
	title="Publish to production?"
	size="sm"
	footer={<><Button variant="ghost">Not yet</Button><Button>Publish</Button></>}
/>`}
			>
				<Button variant="subtle" onClick={() => setMinimal(true)}>
					Open small dialog
				</Button>
				<Modal
					open={minimal}
					onClose={() => setMinimal(false)}
					title="Publish to production?"
					size="sm"
					footer={
						<>
							<Button variant="ghost" onClick={() => setMinimal(false)}>
								Not yet
							</Button>
							<Button onClick={() => setMinimal(false)} data-fds-autofocus>
								Publish
							</Button>
						</>
					}
				/>
			</Demo>
		</>
	);
}

export function TooltipPlayground() {
	return (
		<Playground
			interfaceName="TooltipProps"
			componentName="Tooltip"
			props={["placement", "delay", "disabled"]}
			initial={{ placement: "top", delay: 200 }}
			code={(values) =>
				`<Tooltip content="Rebuilds every segment from scratch." placement="${values.placement}" delay={${values.delay}}>
	<Button variant="secondary" iconStart={<Info />}>Full resync</Button>
</Tooltip>`
			}
		>
			{(values) => (
				<Tooltip
					content="Rebuilds every segment from scratch. Takes about four minutes."
					placement={values.placement as never}
					delay={Number(values.delay ?? 200)}
					disabled={Boolean(values.disabled)}
				>
					<Button variant="secondary" iconStart={<Info />}>
						Full resync
					</Button>
				</Tooltip>
			)}
		</Playground>
	);
}

export function TooltipExamples() {
	return (
		<>
			<Demo
				title="Focus shows it immediately"
				caption="Tab across these three. Hover waits out the delay, keyboard focus does not, because a keyboard user has already committed to the element. Escape dismisses without moving focus."
				code={`<Tooltip content="Copy the raw token value" placement="top">
	<Button variant="ghost" size="sm">Copy</Button>
</Tooltip>`}
			>
				{(["top", "bottom", "left"] as const).map((placement) => (
					<Tooltip key={placement} content={`Placed ${placement}. Flips when the viewport runs out.`} placement={placement}>
						<Button variant="ghost" size="sm">
							{placement}
						</Button>
					</Tooltip>
				))}
				<Tooltip content="An icon button still needs a real accessible name. The tooltip only describes it.">
					<Button variant="secondary" size="sm" aria-label="Help">
						<CircleHelp size={16} />
					</Button>
				</Tooltip>
			</Demo>

			<Demo
				title="Attached to a field label"
				caption="Anything a user must have to finish the task belongs in a field description instead. This is the acceptable case: a definition that is useful but not required."
				layout="column"
				code={`<Tooltip content="A segment is a saved filter over the customer table.">
	<Button variant="ghost" size="sm" iconStart={<Info />}>What is a segment?</Button>
</Tooltip>`}
			>
				<Tooltip content="A segment is a saved filter over the customer table. It recomputes on write.">
					<Button variant="ghost" size="sm" iconStart={<Info />}>
						What is a segment?
					</Button>
				</Tooltip>
			</Demo>
		</>
	);
}

export function ToastPlayground() {
	const { toast } = useToast();

	return (
		<Playground
			interfaceName="ToastOptions"
			componentName="toast"
			props={["tone", "duration"]}
			initial={{ tone: "success", duration: 5000 }}
			code={(values) =>
				`const { toast } = useToast();

toast({
	title: "Invoice sent",
	description: "Ed at Titan Sports Flooring will get it within a minute.",
	tone: "${values.tone}",
	duration: ${values.duration},
	action: { label: "Undo", onClick: revert },
});`
			}
		>
			{(values) => (
				<Button
					onClick={() =>
						toast({
							title: "Invoice sent",
							description: "Hover it to pause the timer, or tab to the action.",
							tone: values.tone as never,
							duration: Number(values.duration ?? 5000),
							action: { label: "Undo", onClick: () => undefined },
						})
					}
				>
					Fire toast
				</Button>
			)}
		</Playground>
	);
}

export function ToastExamples() {
	const { toast } = useToast();

	return (
		<>
			<Demo
				title="Politeness follows severity"
				caption="Danger and warning use role=alert and interrupt. Neutral and success use role=status and wait for a gap in speech. Making everything assertive trains people to ignore the region."
				code={`toast({ title: "Segment saved", tone: "success" });
toast({ title: "Sync failed", description: "Retry in a minute.", tone: "danger", duration: 0 });`}
			>
				<Button variant="secondary" onClick={() => toast({ title: "Segment saved", tone: "success" })}>
					Success, polite
				</Button>
				<Button
					variant="secondary"
					onClick={() =>
						toast({
							title: "Rate limit approaching",
							description: "82% of the hourly quota used.",
							tone: "warning",
						})
					}
				>
					Warning, assertive
				</Button>
				<Button
					variant="danger"
					onClick={() =>
						toast({
							title: "Sync failed",
							description: "The provider rejected the last batch. Nothing was written.",
							tone: "danger",
							duration: 0,
							action: { label: "Retry", onClick: () => undefined },
						})
					}
				>
					Error, never auto-dismisses
				</Button>
			</Demo>

			<Demo
				title="Queue limit"
				caption="Three visible at once. Older toasts are dropped rather than stacked, because a column of nine notifications is a log file, not feedback."
				code={`<ToastProvider placement="bottom-end" max={3}>
	<App />
</ToastProvider>`}
			>
				<Button
					variant="subtle"
					onClick={() => {
						for (let index = 1; index <= 5; index += 1) {
							toast({ title: `Batch ${index} processed`, tone: "neutral" });
						}
					}}
				>
					Fire five at once
				</Button>
			</Demo>
		</>
	);
}
