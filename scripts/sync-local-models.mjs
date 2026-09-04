// Backwards-compatible entry point. New integrations should use sync-provider.mjs.
process.env.OPENCODE_PROVIDER_ID ??= "local";
process.env.OPENCODE_PROVIDER_NAME ??= "Local AI";
await import("./sync-provider.mjs");
