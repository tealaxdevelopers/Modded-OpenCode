---
name: deep-research
description: "Run autonomous research tasks that plan, search, read, and synthesize information into comprehensive reports."
---

# Deep Research Skill

Run autonomous research tasks that plan, search, read, and synthesize information into comprehensive reports.

## When to Use This Skill

Use this skill when:
- Performing market analysis
- Conducting competitive landscaping
- Creating literature reviews
- Doing technical research
- Performing due diligence
- Need detailed, cited research reports

## Requirements

- OpenCode with web search and read tools enabled
- No external API keys required — uses built-in tools

## How It Works

This skill uses OpenCode's built-in tools:
- **websearch** — search the web for current information
- **webfetch** — read and extract content from URLs
- **read** — analyze local files and documents

No Python, no external API keys, no additional setup.

## Usage

### Basic research
Just describe what you want researched. The agent will:
1. Break the topic into search queries
2. Search the web for relevant sources
3. Read and extract key information from top results
4. Synthesize findings into a structured report

### Example prompts
```
Research the current state of AI inference optimization in 2026
```
```
Compare React Server Components vs Astro for content-heavy sites
```
```
Analyze the EV battery supply chain — key players, bottlenecks, trends
```
```
Deep dive into Rust async runtime performance characteristics
```

### With specific format
```
Research Kubernetes security best practices. Output format:
1. Executive Summary
2. Top 10 Critical Controls
3. Comparison of Security Tools
4. Implementation Roadmap
```

### Follow-up research
```
You previously researched AI inference optimization. Now dig deeper into quantization techniques — INT8, INT4, GGUF, GPTQ. Compare accuracy loss vs speed gain.
```

## Workflow

1. User describes research topic
2. Agent plans search strategy (3-8 targeted queries)
3. Agent executes searches in parallel batches
4. Agent reads top results for each query
5. Agent cross-references and synthesizes findings
6. Agent delivers structured report with sources

## Output Formats

Reports include:
- **Executive Summary** — key findings in 3-5 sentences
- **Detailed Analysis** — organized by theme or question
- **Source Citations** — URLs and dates for every claim
- **Comparison Tables** — when comparing options
- **Recommendations** — actionable next steps

## Performance

| Metric | Value |
|--------|-------|
| Time | 30 seconds - 3 minutes |
| Cost | Uses your configured model's tokens |
| Searches | 3-8 per research task |
| Sources read | 5-15 per research task |

## Best Use Cases

- Market analysis and competitive landscaping
- Technical literature reviews
- Due diligence research
- Historical research and timelines
- Comparative analysis (frameworks, products, technologies)
- Current events and trend analysis
- Technology evaluation and POC research

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
- Web search results depend on search engine availability and index freshness.
