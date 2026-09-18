// NOTE: message.finished is not in the official plugin event list (plugins.md).
// If upstream removes this event, notification will stop working.
// Fallback: poll session.status periodically.
import type { Plugin } from "@opencode-ai/plugin";
import { execSync } from "child_process";
import { platform } from "os";

const PACKAGE_VERSION = "1.1.8";
let lastNotify = 0;
const COOLDOWN = 2000;

export const OpencodeNotifyPlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "opencode-notify",
      level: "info",
      message: `opencode-notify v${PACKAGE_VERSION} loaded Ã¢â‚¬â€ cross-platform notifications`,
    },
  });

  return {
    "message.finished": async (input, output) => {
      const now = Date.now();
      if (now - lastNotify < COOLDOWN) return;
      lastNotify = now;

      const text = typeof output.text === "string" ? output.text : "";
      if (!text) return;

      const title = "OpenCode";
      const body = truncate(text, 200);

      sendNotification(title, body);
    },
  };
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

function sendNotification(title: string, body: string) {
  const os = platform();
  try {
    if (os === "win32") {
      execSync(
        `powershell -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); $n=New-Object System.Windows.Forms.NotifyIcon; $n.Icon=[System.Drawing.SystemIcons]::Information; $n.Visible=$true; $n.BalloonTipTitle='${escapePS(title)}'; $n.BalloonTipText='${escapePS(body)}'; $n.BalloonTipIcon='Info'; $n.ShowBalloonTip(5000)"`,
        { timeout: 5000, stdio: "ignore" }
      );
    } else if (os === "darwin") {
      execSync(
        `osascript -e 'display notification "${escapeShell(body)}" with title "${escapeShell(title)}"'`,
        { timeout: 5000, stdio: "ignore" }
      );
    } else {
      execSync(
        `notify-send "${escapeShell(title)}" "${escapeShell(body)}"`,
        { timeout: 5000, stdio: "ignore" }
      );
    }
  } catch {
    // Notification failed silently Ã¢â‚¬â€ not critical
  }
}

function escapePS(s: string): string {
  return s.replace(/'/g, "''").replace(/"/g, '""');
}

function escapeShell(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\$/g, "\\$");
}
