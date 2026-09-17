# Agents

Configure and use specialized agents.

Agents are specialized AI assistants that can be configured for specific tasks and workflows. They allow you to create focused tools with custom prompts, models, and tool access.

> **Tip:** Use the plan agent to analyze code and review suggestions without making any code changes.

You can switch between agents during a session or invoke them with the `@` mention.

---

## Types

There are two types of agents in OpenCode; primary agents and subagents.

### Primary agents

Primary agents are the main assistants you interact with directly. You can cycle through them using the **Tab** key, or your configured `switch_agent` keybind. These agents handle your main conversation.

OpenCode comes with two built-in primary agents, **Build** and **Plan**.

### Subagents

Subagents are specialized assistants that primary agents can invoke for specific tasks. You can also manually invoke them by **@ mentioning** them in your messages.

OpenCode comes with three built-in subagents, **General**, **Explore**, and **Scout**.

---

## Built-in

### Build
*Mode:* `primary`
Default primary agent with all tools enabled. Standard agent for development work.

### Plan
*Mode:* `primary`
Restricted agent for planning and analysis. All file edits and bash commands default to `ask`.

### General
*Mode:* `subagent`
General-purpose agent for researching complex questions and executing multi-step tasks. Full tool access.

### Explore
*Mode:* `subagent`
Fast, read-only agent for exploring codebases. Cannot modify files.

### Scout
*Mode:* `subagent`
Read-only agent for external docs and dependency research.

### Compaction
*Mode:* `primary`
Hidden system agent that compacts long context. Runs automatically.

### Title
*Mode:* `primary`
Hidden system agent that generates short session titles. Runs automatically.

### Summary
*Mode:* `primary`
Hidden system agent that creates session summaries. Runs automatically.

---

## Usage

1. For primary agents, use the **Tab** key to cycle through them
2. Subagents can be invoked automatically by primary agents or manually via `@ mentioning`
3. Navigate between sessions using keyboard shortcuts

---

## Configure

Agents can be configured via JSON or Markdown.

### JSON

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}",
      "permission": {
        "edit": "allow",
        "bash": "allow"
      }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer.",
      "permission": {
        "edit": "deny"
      }
    }
  }
}
```

### Markdown

Place in `~/.config/opencode/agents/` or `.opencode/agents/`:

```markdown
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash: deny
---
You are in code review mode.
```

---

## Options

### Description
Brief description of what the agent does. **Required.**

### Temperature
Control randomness (0.0-1.0). Lower = more focused, higher = more creative.

### Max steps
Control maximum agentic iterations before forced text response.

### Disable
Set to `true` to disable the agent.

### Prompt
Custom system prompt file path.

### Model
Override the model for this agent using `provider/model-id` format.

### Tools (deprecated)
Prefer `permission` field for new configs.

### Permissions
Configure what actions an agent can take: `"ask"`, `"allow"`, or `"deny"`.

Available permission keys: `read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `external_directory`, `todowrite`, `webfetch`, `websearch`, `lsp`, `skill`, `question`, `doom_loop`.

### Mode
`primary`, `subagent`, or `all` (default).

### Hidden
Hide subagent from `@` autocomplete with `hidden: true`.

### Task permissions
Control which subagents an agent can invoke via glob patterns.

### Color
Customize visual appearance with hex color or theme color.

### Top P
Alternative to temperature for controlling randomness (0.0-1.0).

### Additional
Other options are passed through to the provider as model options.

---

## Create agents

```bash
opencode agent create
```

Interactive command that generates agent configuration.

---

## Use cases

- **Build agent**: Full development work
- **Plan agent**: Analysis and planning
- **Review agent**: Code review
- **Debug agent**: Investigation
- **Docs agent**: Documentation writing

---

## Examples

### Documentation agent

```markdown
---
description: Writes and maintains project documentation
mode: subagent
permission:
  bash: deny
---
You are a technical writer.
```

### Security auditor

```markdown
---
description: Performs security audits and identifies vulnerabilities
mode: subagent
permission:
  edit: deny
---
You are a security expert.
```
