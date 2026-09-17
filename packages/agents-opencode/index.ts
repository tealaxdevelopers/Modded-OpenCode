import type { Plugin } from "@opencode-ai/plugin";

const PACKAGE_VERSION = "1.1.8";

export const AgentsOpencodePlugin: Plugin = async ({
  client,
  project,
  directory,
  worktree,
  $,
}) => {
  await client.app.log({
    body: {
      service: "agents-opencode",
      level: "info",
      message: `Agents Opencode v${PACKAGE_VERSION} loaded Ã¢â‚¬â€ 13 agents, 105 skills, 19 commands available`,
    },
  });

  return {
    /**
     * Inject agent-specific state into compaction so critical context
     * survives context window truncation.
     */
    "experimental.session.compacting": async (input, output) => {
      output.context.push(`## Agents Opencode Context

You are operating with the agents-opencode v${PACKAGE_VERSION} agent pack.

Available agents (invoke via @mention):
- @codebase Ã¢â‚¬â€ Multi-language development with profile detection
- @orchestrator Ã¢â‚¬â€ Strategic planning and complex workflow coordination
- @planner Ã¢â‚¬â€ Read-only analysis and implementation planning
- @review Ã¢â‚¬â€ Code review for security, performance, and best practices
- @docs Ã¢â‚¬â€ Documentation creation and maintenance
- @blogger Ã¢â‚¬â€ Content creation for blogging, podcasting, YouTube
- @brutal-critic Ã¢â‚¬â€ Content quality review with framework-based scoring
- @em-advisor Ã¢â‚¬â€ Engineering management guidance
- @legal-advisor Ã¢â‚¬â€ License auditing, compliance, and regulatory guidance
- @ivan Ã¢â‚¬â€ Senior code implementor
- @jester Ã¢â‚¬â€ High-temperature oracle
- @oscar Ã¢â‚¬â€ Senior code reviewer
- @scout Ã¢â‚¬â€ Research and planning

Active skills: 105 language/domain/utility skill packs.
Active commands: 19 slash commands (type / to see autocomplete).
Autoupdate: enabled (OpenCode checks for updates on startup).`);

    },

    /**
     * Safety hook: block agents from reading sensitive files.
     */
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read") {
        const filePath = output.args?.filePath;
        if (typeof filePath === "string") {
          const basename = filePath.split(/[/\\]/).pop()?.toLowerCase() || "";
          const blockedPatterns = [
            ".env",
            "credentials.json",
            "secrets.yaml",
            "id_rsa",
            "id_ed25519",
            ".pem",
          ];
          for (const pattern of blockedPatterns) {
            if (basename === pattern || basename.endsWith(pattern)) {
              throw new Error(
                `[agents-opencode] Blocked reading sensitive file: ${filePath}. Do not read credential or secret files.`
              );
            }
          }
        }
      }
    },

    /**
     * Inject package version into shell environment for script awareness.
     */
    "shell.env": async (input, output) => {
      output.env["AGENTS_OPENCODE_VERSION"] = PACKAGE_VERSION;
    },
  };
};
