import { Command } from "commander";
import { createRequire } from "module";
import { installTemplate } from "../core/install-template.js";
import { resolveSharedTemplate, resolveTemplate, TEMPLATE_NAMES } from "../core/resolve-template.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

interface CliOptions {
  force: boolean;
  path: string;
}

function runInstall(template: string | undefined, options: CliOptions): void {
  const selectedTemplate = template ?? "shared";
  const result = installTemplate({
    force: options.force,
    sharedDir: resolveSharedTemplate(),
    targetDir: options.path,
    templateDir: resolveTemplate(selectedTemplate),
  });

  console.log(
    `Installed ${selectedTemplate} Cursor skills: ${result.written.length} written, ${result.skipped.length} skipped.`,
  );
}

const program = new Command();

program
  .name("agent-skills")
  .description("Install Cursor workspace skills into .cursor/skills")
  .version(version)
  .argument("[template]", `Template: ${TEMPLATE_NAMES.join(", ")} (default: shared)`)
  .option("--force", "Overwrite installed files", false)
  .option("--path <dir>", "Target project root", process.cwd())
  .action((template: string | undefined, options: CliOptions) => runInstall(template, options));

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
