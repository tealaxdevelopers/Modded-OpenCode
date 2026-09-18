/**
 * openai-system-merge.ts -- Merge multiple system messages into one
 *
 * Problem: Strict OpenAI-compatible servers (Hetzner, OVHcloud, Scaleway,
 * Nebius, vLLM with Qwen template) accept exactly ONE system message.
 * OpenCode plugins (capabilities-knowledge, extensions-preview, etc.) push
 * multiple entries into the system array, causing:
 *   400 BadRequestError: System message must be at the beginning.
 *
 * Solution: Patch globalThis.fetch to intercept outgoing requests, detect
 * multiple leading system messages, and merge them into a single message
 * before the request reaches the wire.
 *
 * Anthropic requests are never touched (detected via anthropic-version header).
 * Only the leading run of system messages is merged -- mid-conversation system
 * messages are left in place.
 *
 * Based on: different-ai/openwork#3970
 */

const MERGE_LOG = "[openai-system-merge]";

// Prevent re-patching if the plugin is loaded multiple times (npm cache, local plugins dir, etc.)
const PATCHED_SYMBOL = Symbol.for("opencode-openai-system-merge-patched");

function isAnthropicRequest(headers: Headers): boolean {
  return headers.has("anthropic-version") || headers.has("anthropic-beta");
}

function mergeLeadingSystemMessages(messages: any[]): any[] {
  if (!Array.isArray(messages) || messages.length < 2) return messages;

  // Find the leading run of system messages
  let lastSystemIndex = -1;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i]?.role === "system") {
      lastSystemIndex = i;
    } else {
      break;
    }
  }

  // Need at least 2 leading system messages to merge
  if (lastSystemIndex < 1) return messages;

  // Extract all leading system messages
  const systemMessages = messages.slice(0, lastSystemIndex + 1);
  const rest = messages.slice(lastSystemIndex + 1);

  // Merge content: join strings, handle structured content parts
  const contents: string[] = [];
  let hasStructuredContent = false;

  for (const msg of systemMessages) {
    const content = msg.content;
    if (typeof content === "string") {
      contents.push(content);
    } else if (Array.isArray(content)) {
      hasStructuredContent = true;
      // Extract text parts from structured content
      for (const part of content) {
        if (typeof part === "string") {
          contents.push(part);
        } else if (part?.type === "text" && typeof part.text === "string") {
          contents.push(part.text);
        }
      }
    }
  }

  const mergedContent = hasStructuredContent
    ? [{ type: "text", text: contents.join("\n\n") }]
    : contents.join("\n\n");

  const mergedMessage = {
    role: "system",
    content: mergedContent,
  };

  return [mergedMessage, ...rest];
}

function patchFetch() {
  const originalFetch = globalThis.fetch;
  if (!originalFetch) return;
  // Symbol-based guard -- survives multiple plugin loads
  if ((globalThis as any)[PATCHED_SYMBOL]) return;
  (globalThis as any)[PATCHED_SYMBOL] = true;

  const patchedFetch = async function(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    try {
      // Only intercept requests with a body
      if (!init?.body || typeof init.body !== "string") {
        return originalFetch.call(globalThis, input, init);
      }

      // URL guard -- only intercept OpenAI-compatible chat completions endpoints
      // This avoids breaking if upstream fetches other URLs
      const url = typeof input === "string" ? input : (input as Request)?.url;
      if (url && !url.includes("/chat/completions") && !url.includes("/v1/chat/completions")) {
        return originalFetch.call(globalThis, input, init);
      }

      // Check headers for Anthropic -- never touch those
      const headers = new Headers(init.headers);
      if (isAnthropicRequest(headers)) {
        return originalFetch.call(globalThis, input, init);
      }

      // Try to parse the body as JSON
      let body: any;
      try {
        body = JSON.parse(init.body);
      } catch {
        return originalFetch.call(globalThis, input, init);
      }

      // Only process if there's a messages array with multiple system messages
      if (!body?.messages || !Array.isArray(body.messages)) {
        return originalFetch.call(globalThis, input, init);
      }

      const systemCount = body.messages.filter(
        (m: any) => m?.role === "system"
      ).length;

      if (systemCount < 2) {
        return originalFetch.call(globalThis, input, init);
      }

      // Merge leading system messages
      const merged = mergeLeadingSystemMessages(body.messages);
      body.messages = merged;

      // Re-serialize and send
      const newInit = { ...init, body: JSON.stringify(body) };
      return originalFetch.call(globalThis, input, newInit);
    } catch {
      // If anything goes wrong, pass through to original
      return originalFetch.call(globalThis, input, init);
    }
  };

  globalThis.fetch = patchedFetch;
}

// Apply patch on module load
patchFetch();

export default {
  id: "openai-system-merge",
  setup: () => {
    // Patch is already applied on import
    console.log(
      `${MERGE_LOG} loaded -- will merge multiple leading system messages for OpenAI-compatible providers`
    );
  },
};
