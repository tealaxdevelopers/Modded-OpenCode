import type { Plugin } from "@opencode-ai/plugin";

const PACKAGE_VERSION = "1.1.7";
const MAX_TITLE_LEN = 60;

export const OpencodeSessionTitlePlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "opencode-session-title",
      level: "info",
      message: `opencode-session-title v${PACKAGE_VERSION} loaded â€” auto session naming`,
    },
  });

  return {
    "message.finished": async (input, output) => {
      const sessionID = output.sessionID;
      if (!sessionID) return;

      const messages = output.messages;
      if (!messages || messages.length === 0) return;

      const firstUserMsg = messages.find((m: any) => m.role === "user");
      if (!firstUserMsg) return;

      const text = extractText(firstUserMsg);
      if (!text || text.length < 5) return;

      const title = generateTitle(text);
      if (title) {
        await client.session.update({ id: sessionID, title });
      }
    },
  };
};

function extractText(info: any): string {
  if (info.text) return info.text;
  if (typeof info.content === "string") return info.content;
  if (Array.isArray(info.content)) {
    return info.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join(" ");
  }
  return "";
}

function generateTitle(text: string): string {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "[code]")
    .replace(/`[^`]+`/g, "[snippet]")
    .replace(/\n+/g, " ")
    .trim();

  const words = cleaned.split(/\s+/).slice(0, 8);
  let title = words.join(" ");

  if (title.length > MAX_TITLE_LEN) {
    title = title.slice(0, MAX_TITLE_LEN - 3) + "...";
  }

  return title || "Untitled Session";
}
