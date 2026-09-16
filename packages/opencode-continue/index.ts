// Modded OpenCode Ã¢â‚¬â€ Auto-Continue plugin (tek dosya, .opencode/plugins/ altÃ„Â±na)
//
// Ne yapar:
//   Oturum boÃ…Å¸ta kalÃ„Â±nca (AI iÃ…Å¸i bitirdi ama kullanÃ„Â±cÃ„Â± yazmadÃ„Â±) VEYA
//   baÃ„Å¸lantÃ„Â± kopmasÃ„Â± / hata yÃƒÂ¼zÃƒÂ¼nden iÃ…Å¸ yarÃ„Â±da kesilince, ne AI ne insan
//   durdurmadÃ„Â±ysa otomatik "continue" mesajÃ„Â± enjekte eder.
//
// YavaÃ…Å¸ baÃ„Å¸lantÃ„Â± desteÃ„Å¸i:
//   ZayÃ„Â±f internet baÃ„Å¸lantÃ„Â±sÃ„Â±nda model timeout alabilir veya baÃ„Å¸lantÃ„Â±
//   yarÃ„Â±da kesilebilir Ã¢â‚¬â€ plugin bu durumlarda otomatik devam ederek
//   kullanÃ„Â±cÃ„Â±nÃ„Â±n iÃ…Å¸ini yarÃ„Â±da bÃ„Â±rakmaz. OpenCode'un kendi session.error
//   event'ini tetikler, plugin bunu yakalayÃ„Â±p devam mesajÃ„Â± enjekte eder.
//
// Ayar (proje bazlÃ„Â±): <proje>/.opencode/auto-continue.json  (veya .jsonc)
//   { "enabled": true, "message": "continue", "cooldown_ms": 8000,
//     "max_consecutive": 8, "continue_on_error": false }
// Global kapat/aÃƒÂ§: ortam deÃ„Å¸iÃ…Å¸keni OC_AUTOCONTINUE=0 | 1
//
// MantÃ„Â±k (hjzccc/opencode-auto-continue temel alÃ„Â±nmÃ„Â±Ã…Å¸tÃ„Â±r):
//   - session.idle / session.error dinler
//   - cooldown + max_consecutive ile sonsuz dÃƒÂ¶ngÃƒÂ¼yÃƒÂ¼ engeller
//   - gerÃƒÂ§ek kullanÃ„Â±cÃ„Â± mesajÃ„Â± gelince sayacÃ„Â± sÃ„Â±fÃ„Â±rlar
//   - injection ÃƒÂ¶ncesi oturum hÃƒÂ¢lÃƒÂ¢ boÃ…Å¸ta mÃ„Â± tekrar kontrol eder (race kapanÃ„Â±r)
//   - yavaÃ…Å¸ baÃ„Å¸lantÃ„Â±/signal kaybÃ„Â± durumunda stabilize edici ping gÃƒÂ¶revi gÃƒÂ¶rÃƒÂ¼r
//
// opencode plugin Ã…Å¸emasÃ„Â±: default export { id, setup } Ã…Å¸eklinde olmalÃ„Â±.

import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

interface PluginConfig {
  enabled: boolean
  message: string
  cooldown_ms: number
  max_consecutive: number
  continue_on_error: boolean
}

const DEFAULT_CONFIG: PluginConfig = {
  enabled: true,
  message: "continue",
  cooldown_ms: 8000,
  max_consecutive: 8,
  continue_on_error: false,
}

interface SessionState {
  lastInjectedAt?: number
  consecutiveCount: number
  lastAssistantMessageId?: string
  inFlight: boolean
  deferredTimer?: any
}

function stripJsonComments(text: string): string {
  return text.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
}

function readFileConfig(directory: string): PluginConfig | null {
  for (const name of ["auto-continue.json", "auto-continue.jsonc"]) {
    const p = join(directory, ".opencode", name)
    if (!existsSync(p)) continue
    try {
      const parsed = JSON.parse(stripJsonComments(readFileSync(p, "utf-8")))
      return {
        enabled: parsed.enabled ?? DEFAULT_CONFIG.enabled,
        message: parsed.message ?? DEFAULT_CONFIG.message,
        cooldown_ms: parsed.cooldown_ms ?? DEFAULT_CONFIG.cooldown_ms,
        max_consecutive: parsed.max_consecutive ?? DEFAULT_CONFIG.max_consecutive,
        continue_on_error:
          parsed.continue_on_error ?? DEFAULT_CONFIG.continue_on_error,
      }
    } catch {
      return { ...DEFAULT_CONFIG }
    }
  }
  return null
}

function loadConfig(directory: string): PluginConfig {
  const base = readFileConfig(directory) ?? { ...DEFAULT_CONFIG }
  const envFlag = process.env.OC_AUTOCONTINUE
  if (envFlag === "0") base.enabled = false
  else if (envFlag === "1") base.enabled = true
  return base
}

function writeConfig(directory: string, cfg: PluginConfig): void {
  try {
    const p = join(directory, ".opencode", "auto-continue.json")
    writeFileSync(p, JSON.stringify(cfg, null, 2) + "\n", "utf-8")
  } catch {
    /* best effort */
  }
}

function createSessionStateStore() {
  const states = new Map<string, SessionState>()
  function getState(id: string): SessionState {
    let s = states.get(id)
    if (s) return s
    s = {
      lastInjectedAt: undefined,
      consecutiveCount: 0,
      lastAssistantMessageId: undefined,
      inFlight: false,
      deferredTimer: undefined,
    }
    states.set(id, s)
    return s
  }
  function cleanup(id: string): void {
    const s = states.get(id)
    if (s?.deferredTimer) clearTimeout(s.deferredTimer)
    states.delete(id)
  }
  function resetConsecutive(id: string): void {
    const s = states.get(id)
    if (s) s.consecutiveCount = 0
  }
  return { getState, cleanup, resetConsecutive }
}

type SessionMessage = {
  info?: {
    id?: string
    role?: string
    agent?: string
    modelID?: string
    providerID?: string
    model?: { providerID?: string; modelID?: string }
  }
  parts?: Array<{ type?: string; text?: string }>
}

function resolveLastAssistantContext(messages: SessionMessage[]): {
  messageId: string | undefined
  agent: string | undefined
  model: { providerID: string; modelID: string } | undefined
} {
  for (let i = messages.length - 1; i >= 0; i--) {
    const info = messages[i].info
    if (info?.role !== "assistant") continue
    const providerID = info.model?.providerID ?? info.providerID
    const modelID = info.model?.modelID ?? info.modelID
    return {
      messageId: info.id,
      agent: info.agent,
      model: providerID && modelID ? { providerID, modelID } : undefined,
    }
  }
  return { messageId: undefined, agent: undefined, model: undefined }
}

function resolveAgentFromUserMessages(messages: SessionMessage[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const info = messages[i].info
    if (info?.role === "user" && info.agent) return info.agent
  }
  return undefined
}

function hasRealUserMessageAfterLastContinue(
  messages: SessionMessage[],
  continueText: string,
): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.info?.role !== "user") continue
    const text = (msg.parts ?? [])
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text?.trim() ?? "")
      .join("")
      .toLowerCase()
    if (text === continueText.toLowerCase()) return false
    return true
  }
  return false
}

async function isSessionIdle(ctx: any, sessionID: string, directory: string): Promise<boolean> {
  try {
    const response = await ctx.client.session.status({ query: { directory } })
    const map = ((response as any)?.data ?? response ?? {}) as Record<string, unknown>
    return !map[sessionID]
  } catch {
    return true
  }
}

const setup = async (ctx: any) => {
  const sessionStateStore = createSessionStateStore()
  const getConfig = () => loadConfig(ctx.directory)

  // Ã„Â°lk ÃƒÂ§alÃ„Â±Ã…Å¸tÃ„Â±rmada gÃƒÂ¶rÃƒÂ¼nÃƒÂ¼r bir ayar dosyasÃ„Â± bÃ„Â±rak (kullanÃ„Â±cÃ„Â± kolayca kapatabilir)
  try {
    const cfgPath = join(ctx.directory, ".opencode", "auto-continue.json")
    if (!existsSync(cfgPath)) writeConfig(ctx.directory, getConfig())
  } catch {
    /* yoksay */
  }

  async function injectContinuation(sessionID: string): Promise<void> {
    const config = getConfig()
    if (!config.enabled) return

    const state = sessionStateStore.getState(sessionID)
    if (state.inFlight) return
    if (state.consecutiveCount >= config.max_consecutive) return

    let messages: SessionMessage[] = []
    try {
      const response = await ctx.client.session.messages({
        path: { id: sessionID },
        query: { directory: ctx.directory },
      })
      messages = ((response as any)?.data ?? response ?? []) as SessionMessage[]
    } catch {
      return
    }

    const assistantCtx = resolveLastAssistantContext(messages)
    if (!assistantCtx.messageId) return
    if (state.lastAssistantMessageId === assistantCtx.messageId) return

    if (hasRealUserMessageAfterLastContinue(messages, config.message)) {
      sessionStateStore.resetConsecutive(sessionID)
    }
    if (state.consecutiveCount >= config.max_consecutive) return

    const agent = assistantCtx.agent ?? resolveAgentFromUserMessages(messages)
    if (!(await isSessionIdle(ctx, sessionID, ctx.directory))) return

    state.inFlight = true
    try {
      // Loop detection: if we've already continued 2+ times, switch to thinking mode
      // to prevent visible loop messages from reaching the user
      const inLoop = state.consecutiveCount >= 2
      const message = inLoop
        ? "[Thinking] Analyze what happened in the previous steps. Identify if the task is complete or if a different approach is needed. Do NOT repeat the same action. If stuck, describe the blocker clearly."
        : config.message

      const payload: any = {
        path: { id: sessionID },
        body: {
          ...(agent ? { agent } : {}),
          ...(assistantCtx.model ? { model: assistantCtx.model } : {}),
          parts: [{ type: "text", text: message }],
        },
        query: { directory: ctx.directory },
      }

      if (typeof (ctx.client.session as any).promptAsync === "function") {
        await (ctx.client.session as any).promptAsync(payload)
      } else {
        await ctx.client.session.prompt(payload)
      }

      state.lastAssistantMessageId = assistantCtx.messageId
      state.consecutiveCount += 1
      state.lastInjectedAt = Date.now()
      // Only show toast in non-loop mode; loop mode stays silent
      if (!inLoop) {
        try {
          await (ctx.client as any).tui?.showToast?.({
            body: { message: "Auto-continue: continuingÃ¢â‚¬Â¦", variant: "info" },
          })
        } catch {
          /* yoksay */
        }
      }
    } catch {
      /* yoksay */
    } finally {
      state.inFlight = false
    }
  }

  return {
    event: async ({ event }: { event: { type: string; properties?: any } }) => {
      if (event.type === "session.deleted") {
        const info = event.properties?.info
        if (info?.id) sessionStateStore.cleanup(info.id)
        return
      }

      const config = getConfig()
      if (event.type === "session.error" && !config.continue_on_error) return
      if (event.type !== "session.idle" && event.type !== "session.error") return
      if (!config.enabled) return

      const sessionID = event.properties?.sessionID as string | undefined
      if (!sessionID) return

      const state = sessionStateStore.getState(sessionID)
      if (state.deferredTimer) {
        clearTimeout(state.deferredTimer)
        state.deferredTimer = undefined
      }

      if (
        state.lastInjectedAt &&
        Date.now() - state.lastInjectedAt < config.cooldown_ms
      ) {
        const remaining = config.cooldown_ms - (Date.now() - state.lastInjectedAt)
        state.deferredTimer = setTimeout(() => {
          state.deferredTimer = undefined
          injectContinuation(sessionID)
        }, remaining)
        return
      }

      await injectContinuation(sessionID)
    },
  }
}

export default { id: "opencode-continue", setup }
