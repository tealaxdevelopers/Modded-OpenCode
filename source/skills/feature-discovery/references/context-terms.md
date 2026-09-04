# Candidate CONTEXT.md Terms — shared flow

Shared between `feature-discovery` and `feature-prompt` (duplicated by design so
each skill installs self-contained; `tools/validate.sh` enforces byte-parity —
edit both copies together). How to surface domain terms that code evidence
suggests are missing from or stale in `CONTEXT.md`, and how to apply approved
updates.

## What qualifies as a candidate

Candidate terms must be meaningful to product or domain experts: roles,
workflows, states, business rules, events, integrations, user-facing concepts,
or project-specific names. Skip generic programming terms, helper names,
low-level class names, and package names unless they carry domain meaning.
Prefer a small, high-confidence list over a glossary dump.

## Presenting candidates

For each candidate capture: **Term** — suggested action (add, clarify, rename,
deprecate, or ask user); a one-sentence description grounded in observed code
behaviour; **Evidence** refs; **Why it matters** for future planning. When
existing context may be stale, quote the current wording next to the code
evidence that contradicts it. Then ask:

```markdown
Candidate CONTEXT.md terms:

- `Term` — suggested action; short description; evidence; why it matters.

Reply with the term names to approve, wording changes, `approve all`, or `skip context updates`.
```

If the user is away, skip all `CONTEXT.md` updates, keep the candidate list in
the response, and continue with the skill's remaining output. If no candidates
exist, say so in one line — do not pad the section.

## Applying approved updates

1. Inspect the target `CONTEXT.md` first and preserve its existing structure
   and style.
2. Apply only approved additions, clarifications, renames, or deprecations.
3. Keep descriptions short and evidence-backed; never add implementation-only
   symbols as domain language.
4. Use the user's wording when they edit yours — unless it conflicts with code
   evidence; explain the mismatch before editing.
5. Report exactly which terms changed and which file was edited.

If no relevant `CONTEXT.md` exists, still report candidates and recommend
creating or locating the file before editing anything.
