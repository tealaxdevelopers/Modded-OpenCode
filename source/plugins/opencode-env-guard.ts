import type { Plugin } from "@opencode-ai/plugin";

const PACKAGE_VERSION = "1.1.6";

const SENSITIVE_PATTERNS = [
  /(?:api[_-]?key|secret[_-]?key|password|token|auth[_-]?token|access[_-]?token|private[_-]?key|credentials?)[\s]*[=:]+[\s]*[^\s]+/gi,
  /(?:sk|ak|pk|ghp|gho|glpat|npm_[A-Za-z0-9]{20,})[_-][A-Za-z0-9]{20,}/g,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g,
];

const ENV_EXTENSIONS = [".env", ".env.local", ".env.production", ".env.staging"];

export const OpencodeEnvGuardPlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "opencode-env-guard",
      level: "info",
      message: `opencode-env-guard v${PACKAGE_VERSION} loaded — sensitive file protection`,
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

      if (input.tool === "write" || input.tool === "edit") {
        const content =
          typeof output.args?.content === "string"
            ? output.args.content
            : typeof output.args?.newString === "string"
            ? output.args.newString
            : "";
        if (content) {
          for (const pattern of SENSITIVE_PATTERNS) {
            pattern.lastIndex = 0;
            if (pattern.test(content)) {
              throw new Error(
                `[opencode-env-guard] Detected secret/key material in write. Use environment variables or a vault instead of hardcoding secrets.`
              );
            }
          }
        }
      }
    },
  };
};
