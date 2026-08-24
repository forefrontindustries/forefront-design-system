/**
 * CI gate. `bun run validate` prints every rule violation and exits non-zero on error.
 * A token architecture is a convention until something checks it, so this runs on every PR.
 */
import { loadModel } from "./resolve.ts";

const model = loadModel();
const errors = model.violations.filter((v) => v.level === "error");
const warnings = model.violations.filter((v) => v.level === "warn");

const contractCount = Object.keys(model.contract).length;
console.log(
  `checked ${Object.keys(model.primitives).length} primitives, ${contractCount} contract tokens, ` +
    `${Object.keys(model.component).length} component tokens, ${model.themes.length} themes, ${model.densities.length} densities`,
);

for (const v of errors) console.error(`error  [${v.rule}] ${v.where}: ${v.detail}`);
for (const v of warnings) console.warn(`warn   [${v.rule}] ${v.where}: ${v.detail}`);

console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length) process.exit(1);
