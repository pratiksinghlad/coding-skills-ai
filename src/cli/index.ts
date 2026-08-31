import { Command } from "commander";
import { createRequire } from "module";
import { installDefaultTemplate, installTemplate } from "../core/install-template.js";
import { AGENT_NAMES, parseAgentName } from "../core/ide-map.js";
import { resolveSharedTemplate, resolveTemplate, TEMPLATE_NAMES } from "../core/resolve-template.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

interface CliOptions {
  agent?: string;
  force: boolean;
  hardlink?: boolean;
  path: string;
}

function runInstall(template: string | undefined, options: CliOptions): void {
  const isAgent = template && AGENT_NAMES.includes(template.toLowerCase());
  const implicitAgent = isAgent ? parseAgentName(template) : undefined;

  if (implicitAgent && options.agent) {
    throw new Error("Choose an agent with either the argument or --agent, not both.");
  }

  const selectedTemplate = implicitAgent ? "default" : template ?? "default";
  const agent = implicitAgent ?? parseAgentName(options.agent);
  const targetDir = options.path;
  const hardlink = options.hardlink ?? true;

  const result =
    selectedTemplate === "default"
      ? installDefaultTemplate(resolveTemplate(selectedTemplate), {
          agent,
          force: options.force,
          hardlink,
          targetDir,
        })
      : installTemplate({
          agent,
          force: options.force,
          hardlink,
          sharedDir: resolveSharedTemplate(),
          targetDir,
          templateDir: resolveTemplate(selectedTemplate),
        });

  console.log(`Installed ${selectedTemplate}: ${result.written.length} written, ${result.skipped.length} skipped.`);
}

const program = new Command();

program
  .name("agent-skills")
  .description("Install shared coding-agent guidance and a framework template")
  .version(version)
  .argument("[template]", `Template: ${TEMPLATE_NAMES.join(", ")}; agent names install default guidance`)
  .option("--agent <name>", `Install one agent entry point: ${AGENT_NAMES.join(", ")}`)
  .option("--force", "Overwrite installed files", false)
  .option("--no-hardlink", "Copy agent entry points instead of hardlinking")
  .option("--path <dir>", "Target project root", process.cwd())
  .action((template: string | undefined, options: CliOptions) => runInstall(template, options));

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
