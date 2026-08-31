---
description: "Find fastest free proxy and configure OpenCode to use it"
argument-hint: "[--protocol socks5|--json|--write]"
subtask: true
---

# Proxy Bridge

Resolve high-latency or connection-failure issues by finding the fastest available
free proxy and optionally configuring OpenCode to route API traffic through it.

## When to Use

- OpenCode reports "unable to connect", "ETIMEDOUT", "fetch failed", or "terminated"
- API provider responses are consistently slow (>5s)
- User is behind a firewall or in a network-restricted region
- User wants to route traffic through a different exit node

## Steps

1. Run the proxy bridge test:

   ```
   node scripts/proxy-bridge.mjs --json
   ```

   Flags:
   - `--json` — machine-readable output (recommended for agent parsing)
   - `--top N` — show top N fastest proxies (default 5)
   - `--protocol socks5` — filter by protocol (http/https/socks4/socks5)
   - `--write` — write the fastest proxy to `~/.config/opencode/proxy-bridge.env`

2. Parse the JSON output. Key fields:
   - `proxies[].url` — proxy URL (e.g., `socks5://1.2.3.4:1080`)
   - `proxies[].latencyMs` — TCP handshake latency in milliseconds
   - `proxies[].country` — proxy exit country
   - `proxies[].source` — which list it came from
   - `stats.total` / `stats.tested` / `stats.alive` — pool statistics

3. Report results to the user:
   - Show the fastest proxy with latency and country
   - Show how many proxies were tested vs alive
   - If no proxies found, suggest checking network or trying `--protocol` filter

4. If a proxy is found, offer to configure:
   - Run `node scripts/proxy-bridge.mjs --write` to persist to env file
   - Or tell the user to set manually:
     ```
     export HTTPS_PROXY=<proxy_url>
     export HTTP_PROXY=<proxy_url>
     ```
   - Remind user to restart OpenCode after setting proxy env vars

## Security Note

Free proxies are suitable for unauthenticated, read-only API calls. Never route
logins, payments, or personal data through free proxies. The operator can see
unencrypted traffic and some free proxies are honeypots.

## Sources

- **Databay** — 63.9% alive rate, ~1067ms median latency, 5min refresh
- **ProxyScrape** — 22k+ proxy pool, 1min refresh, richest metadata

Results refreshed live on each run. No cached or stale data.
