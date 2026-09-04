# Evals — `/tdd-loop`

This skill owns its evals. Everything needed to judge `/tdd-loop` is in this folder.

| File | What it is |
| :--- | :--- |
| [`evals.json`](evals.json) | The routing test set, plus the `last_run` evidence record |
| [`test-cases.md`](test-cases.md) | Readable form of the test set, with the sibling each negative routes to |
| [`rubric.md`](rubric.md) | How to score: routing pass bar + the eleven quality categories |
| [`baseline.md`](baseline.md) | Scores before the improvement pass |
| [`final.md`](final.md) | Scores after, and any blocker |

## Running the trigger eval

From the repo root:

```bash
bash tools/trigger-evals/build-catalog.sh > /tmp/ev/catalog.md
python3 tools/trigger-evals/build-queryset.py /tmp/ev
# run 3 independent judge agents on judge-prompt.md + catalog + queryset
python3 tools/trigger-evals/score.py /tmp/ev/query-manifest.json j1.jsonl j2.jsonl j3.jsonl
```

The queryset mixes every skill's queries, so a run scores the whole kit at once. That is deliberate:
routing is only meaningful against the full catalog of competitors.

## `last_run` is an evidence record

The `last_run` block in `evals.json` names the judge model, method, date, and result of a **real**
run. Never refresh, restamp, or fabricate it. A stale-but-honest record beats a fresh-looking
invented one — and a stale record is exactly how the kit once carried a 280/280 claim while actually
scoring 277/280, after a description changed and nobody re-ran.

Editing this skill's frontmatter `description` invalidates the recorded result. Re-run, or say in
the commit body that the baseline is now stale.
