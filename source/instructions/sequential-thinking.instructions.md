---
name: sequential-thinking
description: >-
  Use sequential-thinking tool for complex reasoning, multi-step analysis,
  debugging, architecture decisions, and any problem that benefits from
  structured step-by-step thinking. Works on ALL models regardless of
  native thinking capability.
---

# Sequential Thinking

Use the `sequential-thinking` tool to break down complex problems into structured steps. This tool is available to ALL models — even those without native thinking/reasoning capability.

## When to Use

Activate sequential-thinking for:

- **Complex debugging**: Multiple possible causes, need to narrow down
- **Architecture decisions**: Evaluating trade-offs between approaches
- **Code review**: Analyzing security, performance, and correctness together
- **Multi-step planning**: Features with dependencies and ordering
- **Root cause analysis**: Tracing symptoms back to underlying issues
- **Trade-off analysis**: Comparing pros/cons of different solutions
- **Unclear requirements**: When the problem needs clarification before solving

## When NOT to Use

Skip sequential-thinking for:

- Simple file reads or edits
- Straightforward searches (grep, glob)
- Direct code changes with clear requirements
- Single-step operations

## How to Use

Call the tool with progressive thoughts:

```
sequential-thinking(
  thought="Analyzing the problem: [description]",
  thoughtNumber=1,
  totalThoughts=3,
  nextThoughtNeeded=true
)
```

Each thought builds on the previous one. Adjust `totalThoughts` as needed.

## Benefits for Non-Thinking Models

Models without native thinking capability (GPT-4o, Gemini, Llama, etc.) gain structured reasoning through this tool. It provides:

- Step-by-step breakdown
- Ability to revise previous thoughts
- Branching exploration of alternatives
- Clear chain of reasoning

Models WITH native thinking (Claude, o1, etc.) can use it for additional structured analysis beyond their internal reasoning.
