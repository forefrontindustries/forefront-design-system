/**
 * Generates the component API tables from the TypeScript source.
 *
 * Hand-written prop tables are wrong within two releases. This walks the real
 * declarations with the TypeScript compiler API, so the docs cannot describe a
 * prop that does not exist or miss one that does, and a renamed prop shows up in
 * the diff of the generated file.
 *
 * What it reads per prop: name, the literal type text as authored, optionality,
 * the JSDoc description, and the @default tag. It also records the extends
 * clause, because "plus every native button attribute" is information a consumer
 * needs and there is no point listing 250 inherited DOM props.
 *
 * It additionally classifies each prop into a playground control, so the live
 * prop editor on the docs site is derived from the types rather than configured
 * by hand. A union of string literals becomes a segmented control, a boolean
 * becomes a switch, and anything structural is marked unsupported instead of
 * being faked.
 *
 * Output is committed at packages/web/src/web/generated/component-api.json.
 * Committed, not gitignored: a fresh clone should render the docs without
 * running a build step first, and a reviewer should be able to read the
 * generated artifact on GitHub. There is no timestamp in it, deliberately, so
 * rebuilding does not produce a diff.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import ts from "typescript";

const uiRoot = resolve(import.meta.dir, "..");
const repoRoot = resolve(uiRoot, "../..");
const outputPath = join(repoRoot, "packages/web/src/web/generated/component-api.json");

type ControlKind = "text" | "number" | "boolean" | "enum" | "node" | "unsupported";

interface PropDoc {
	name: string;
	/** Type exactly as authored, so the table reads like the source. */
	type: string;
	/**
	 * The same type with aliases expanded, when that adds information. `variant`
	 * is authored as `ButtonVariant`, which is the right thing to show a reader,
	 * but the five allowed strings are what they actually need.
	 */
	resolvedType: string | null;
	required: boolean;
	description: string;
	defaultValue: string | null;
	control: { kind: ControlKind; options?: string[] };
}

interface InterfaceDoc {
	name: string;
	description: string;
	extends: string[];
	props: PropDoc[];
}

interface FileDoc {
	/** Path relative to the repo root, so the docs can link to the source. */
	source: string;
	interfaces: InterfaceDoc[];
}

/** Props every component accepts through the DOM element and that add no information to a table. */
const NOISE = new Set(["className", "style", "key", "ref"]);

/**
 * Decides which playground control a prop gets.
 *
 * The classification runs on the CHECKER type, not on the source text, which is
 * the whole reason this uses the compiler API rather than a regex over the file.
 * `variant?: ButtonVariant` is a bare identifier in the source: text matching
 * sees an unknown alias and gives up, so the playground silently loses its most
 * important control. Resolving the alias finds the five string literals behind
 * it, and adding a sixth variant to the union puts a sixth button in the
 * playground with no documentation change.
 */
function classify(
	typeText: string,
	resolved: ts.Type,
	checker: ts.TypeChecker,
	unionOrder: Map<string, string[]>,
): { control: { kind: ControlKind; options?: string[] }; resolvedType: string | null } {
	const parts = resolved.isUnion() ? resolved.types : [resolved];
	// Optional props carry `| undefined` at the declaration site. That is
	// optionality, already reported separately, so it is dropped here.
	const defined = parts.filter((part) => !(part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
	const text = defined.map((part) => checker.typeToString(part)).join(" | ");
	const resolvedType = text && text !== typeText.replace(/\s+/g, " ").trim() ? text : null;

	if (defined.length > 0 && defined.every((part) => part.isStringLiteral())) {
		const values = defined.map((part) => (part as ts.StringLiteralType).value);
		const authored = unionOrder.get(typeText.replace(/\s+/g, " ").trim());
		const options = authored ? authored.filter((value) => values.includes(value)) : values;
		return { control: { kind: "enum", options }, resolvedType };
	}
	if (defined.length > 0 && defined.every((part) => part.flags & ts.TypeFlags.BooleanLike)) {
		return { control: { kind: "boolean" }, resolvedType: null };
	}
	if (defined.length === 1) {
		const only = defined[0]!;
		if (only.flags & ts.TypeFlags.NumberLike) return { control: { kind: "number" }, resolvedType };
		if (only.flags & ts.TypeFlags.StringLike) return { control: { kind: "text" }, resolvedType };
	}

	const normalized = typeText.replace(/\s+/g, " ").trim();
	if (normalized === "ReactNode" || normalized === "React.ReactNode") {
		return { control: { kind: "node" }, resolvedType: null };
	}
	return { control: { kind: "unsupported" }, resolvedType };
}

function jsDocText(symbol: ts.Symbol | undefined, checker: ts.TypeChecker): string {
	if (!symbol) return "";
	return ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\s+/g, " ").trim();
}

function defaultTag(node: ts.Node): string | null {
	for (const tag of ts.getAllJSDocTags(node, (t): t is ts.JSDocTag => t.tagName.text === "default")) {
		const text = typeof tag.comment === "string" ? tag.comment : ts.getTextOfJSDocComment(tag.comment);
		if (text) return text.trim();
	}
	return null;
}

/**
 * Declaration order of every exported string-literal union alias.
 *
 * The checker returns union constituents in its own internal order, which is
 * neither the source order nor stable. Playground controls in the order
 * `danger, subtle, primary` would be a small, permanent papercut, so the
 * authored order is read back from the alias declaration.
 */
function collectUnionOrder(program: ts.Program, files: string[]): Map<string, string[]> {
	const order = new Map<string, string[]>();
	for (const file of files) {
		const source = program.getSourceFile(file);
		source?.forEachChild((node) => {
			if (!ts.isTypeAliasDeclaration(node) || !ts.isUnionTypeNode(node.type)) return;
			const literals = node.type.types
				.filter(ts.isLiteralTypeNode)
				.map((literal) => literal.literal)
				.filter(ts.isStringLiteral)
				.map((literal) => literal.text);
			if (literals.length === node.type.types.length) order.set(node.name.text, literals);
		});
	}
	return order;
}

function isExported(node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration): boolean {
	return (
		node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
	);
}

function collectComponentFiles(): string[] {
	const glob = new Bun.Glob("src/components/**/*.tsx");
	return [...glob.scanSync({ cwd: uiRoot, absolute: true })].sort();
}

function main() {
	const files = collectComponentFiles();
	if (files.length === 0) throw new Error("extract-props: no component sources found.");

	const program = ts.createProgram(files, {
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		jsx: ts.JsxEmit.ReactJSX,
		strict: true,
		skipLibCheck: true,
		noEmit: true,
		allowImportingTsExtensions: true,
	});
	const checker = program.getTypeChecker();
	const unionOrder = collectUnionOrder(program, files);

	const result: Record<string, FileDoc> = {};

	for (const file of files) {
		const source = program.getSourceFile(file);
		if (!source) continue;

		const interfaces: InterfaceDoc[] = [];

		source.forEachChild((node) => {
			if (!ts.isInterfaceDeclaration(node)) return;
			// Props interfaces plus *Options: the toast queue is called through a
			// function rather than rendered, so its API is ToastOptions, and leaving
			// it out would mean the one component with an imperative API is the one
			// component with no generated table.
			const documented = node.name.text.endsWith("Props") || node.name.text.endsWith("Options");
			if (!isExported(node) || !documented) return;

			const heritage =
				node.heritageClauses?.flatMap((clause) => clause.types.map((type) => type.getText(source))) ?? [];

			const props: PropDoc[] = [];
			for (const member of node.members) {
				if (!ts.isPropertySignature(member) || !member.name) continue;
				const name = member.name.getText(source);
				if (NOISE.has(name)) continue;

				const typeText = member.type ? member.type.getText(source) : "unknown";
				const symbol = checker.getSymbolAtLocation(member.name);
				const { control, resolvedType } = classify(
					typeText,
					checker.getTypeAtLocation(member),
					checker,
					unionOrder,
				);

				props.push({
					name,
					type: typeText.replace(/\s+/g, " "),
					resolvedType,
					required: member.questionToken === undefined,
					description: jsDocText(symbol, checker),
					defaultValue: defaultTag(member),
					control,
				});
			}

			const symbol = checker.getSymbolAtLocation(node.name);
			interfaces.push({
				name: node.name.text,
				description: jsDocText(symbol, checker),
				extends: heritage,
				props,
			});
		});

		if (interfaces.length > 0) {
			result[relative(uiRoot, file)] = {
				source: relative(repoRoot, file),
				interfaces,
			};
		}
	}

	const payload = {
		$comment:
			"GENERATED FILE. Produced by packages/ui/tooling/extract-props.ts from the TypeScript declarations. Do not edit by hand: the next build overwrites it. No timestamp is recorded so rebuilding does not create a diff.",
		counts: {
			files: Object.keys(result).length,
			interfaces: Object.values(result).reduce((sum, file) => sum + file.interfaces.length, 0),
			props: Object.values(result).reduce(
				(sum, file) => sum + file.interfaces.reduce((n, i) => n + i.props.length, 0),
				0,
			),
		},
		files: result,
	};

	mkdirSync(dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(payload, null, "\t")}\n`);

	console.log(
		`component api: ok  ${payload.counts.files} files, ${payload.counts.interfaces} interfaces, ${payload.counts.props} documented props  ->  ${relative(repoRoot, outputPath)}`,
	);

	// `children` is exempt: "the content" adds nothing a reader did not already
	// know, and forcing a comment on it would train people to write filler.
	const undocumented = Object.values(result).flatMap((file) =>
		file.interfaces.flatMap((i) =>
			i.props
				.filter((p) => p.description === "" && p.name !== "children")
				.map((p) => `${i.name}.${p.name}`),
		),
	);
	if (undocumented.length > 0) {
		// A warning rather than a failure: a prop that only forwards a native
		// attribute does not always need prose. It is still surfaced so the gap is
		// a decision instead of an accident.
		console.log(`\nwarning: ${undocumented.length} prop(s) have no JSDoc description`);
		for (const item of undocumented) console.log(`  - ${item}`);
	}
}

main();
