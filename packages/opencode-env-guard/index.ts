import type { Plugin } from "@opencode-ai/plugin";

const PACKAGE_VERSION = "1.1.7-hotfix";

const ENV_EXTENSIONS = [".env", ".env.local", ".env.production", ".env.staging"];

export const OpencodeEnvGuardPlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "opencode-env-guard",
      level: "info",
      message: `opencode-env-guard v${PACKAGE_VERSION} loaded Ã¢â‚¬â€ sensitive file protection`,
    },
  });

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read") {
        const filePath = output.args?.filePath;
        if (typeof filePath === "string") {
          const lower = filePath.toLowerCase();
          for (const ext of ENV_EXTENSIONS) {
            if (lower.endsWith(ext)) {
              throw new Error(
                `[opencode-env-guard] Blocked reading sensitive file: ${filePath}. Use terminal to read .env files directly.`
              );
            }
          }
        }
      }
    },
  };
};
