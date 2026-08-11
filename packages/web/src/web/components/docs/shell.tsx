import { Link, useLocation } from "wouter";
import { componentMeta } from "@forefront/ui/meta";
import manifest from "@forefront/tokens/manifest";
import type { ReactNode } from "react";
import { ThemeControls } from "./theme";

/**
 * Documentation shell: dense left navigation, sticky top bar, capped content
 * column. Enterprise design system docs converge on this layout because it
 * scales to sixty components without a redesign, and because engineers arriving
 * from a search result need to see where they landed inside the system.
 */

interface NavItem {
	label: string;
	href: string;
	trailing?: string;
}

interface NavGroup {
	label: string;
	items: NavItem[];
}

const groups: NavGroup[] = [
	{
		label: "Overview",
		items: [
			{ label: "Introduction", href: "/" },
			{ label: "Contributing", href: "/contributing" },
		],
	},
	{
		label: "Foundations",
		items: [
			{ label: "Token architecture", href: "/foundations/tokens" },
			{ label: "Color and theming", href: "/foundations/color" },
			{ label: "Typography", href: "/foundations/typography" },
			{ label: "Space and density", href: "/foundations/space" },
			{ label: "Motion", href: "/foundations/motion" },
			{ label: "Accessibility", href: "/accessibility" },
		],
	},
	{
		label: "Components",
		items: componentMeta.map((meta) => ({
			label: meta.name,
			href: `/components/${meta.slug}`,
			trailing: meta.status === "stable" ? undefined : meta.status,
		})),
	},
];

export function Shell({ children }: { children: ReactNode }) {
	const [location] = useLocation();

	return (
		<div className="docs">
			<a className="skip-link" href="#docs-main">
				Skip to content
			</a>
			<nav className="docs__sidebar" aria-label="Documentation">
				<Link href="/" className="brand">
					<span className="brand__mark">Forefront</span>
					<span className="brand__meta">
						Design System v1.0 &middot; {manifest.counts.totalCustomProperties} tokens
					</span>
				</Link>

				{groups.map((group) => (
					<div className="nav-group" key={group.label}>
						<p className="nav-group__label">{group.label}</p>
						<ul className="nav-list">
							{group.items.map((item) => {
								const active = location === item.href;
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											className={`nav-link${active ? " is-active" : ""}`}
											aria-current={active ? "page" : undefined}
										>
											<span>{item.label}</span>
											{item.trailing ? (
												<span className={`pill pill--${item.trailing}`}>{item.trailing}</span>
											) : null}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				))}
			</nav>

			<div className="docs__main">
				<header className="docs__topbar">
					<span className="brand__meta">Theme and density are live. Every component reacts.</span>
					<ThemeControls />
				</header>

				<main className="docs__content" id="docs-main">
					{children}
				</main>

				<footer className="docs__footer">
					<span>
						Built by Jeremy Maendel. Hand-authored components, no third-party primitives.
					</span>
					<span className="mono mono--subtle">
						{manifest.counts.primitives} primitives / {manifest.counts.semanticContract} semantic /{" "}
						{manifest.counts.componentTokens} component
					</span>
				</footer>
			</div>
		</div>
	);
}

export function PageHeader({
	eyebrow,
	title,
	lede,
	trailing,
}: {
	eyebrow: string;
	title: string;
	lede: string;
	trailing?: ReactNode;
}) {
	return (
		<header>
			<div className="control-row" style={{ justifyContent: "space-between" }}>
				<p className="eyebrow">{eyebrow}</p>
				{trailing}
			</div>
			<h1 className="page-title">{title}</h1>
			<p className="page-lede">{lede}</p>
		</header>
	);
}

export function Section({
	number,
	title,
	subtitle,
	children,
	id,
}: {
	number: string;
	title: string;
	subtitle?: string;
	children: ReactNode;
	id?: string;
}) {
	return (
		<section className="section" id={id}>
			<div className="section__head">
				<span className="section__number" aria-hidden="true">
					{number}
				</span>
				<div>
					<h2 className="section__title">{title}</h2>
					{subtitle ? <p className="section__subtitle">{subtitle}</p> : null}
				</div>
			</div>
			{children}
		</section>
	);
}
