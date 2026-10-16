---
title: "GroundLens"
description: "Guardrails for LLM answers. GroundLens checks an LLM answer against its sources without a model, decides PASS, REVIEW or FAIL under your policy, and keeps a signed record."
canonical: https://groundlens.dev
---

# GroundLens

Guardrails for LLM answers.

GroundLens checks an LLM answer against its sources without a model, decides
PASS, REVIEW or FAIL under your policy, and keeps a signed record.

```bash
pip install groundlens
```

## What it does

Your model writes an answer from the passages your retriever found. Before
anyone acts on it, GroundLens:

1. **Checks every figure.** It must be in the passages, or follow from figures
   that are (a sum, a difference, a ratio, a percentage change), compared as
   exact fractions, in the locale and units the documents use.
2. **Checks where each figure came from.** A real figure taken from another
   company, contract or year fails.
3. **Checks it is what was asked.** A percentage when the question asked for a
   percentage; euros when it asked for euros.
4. **Applies your policy.** PASS, REVIEW or FAIL, with the reasons a reviewer
   reads first.
5. **Signs and stores the record** before it returns the decision. No stored
   record, no decision.

| | |
| --- | --- |
| For | Teams whose LLM answers carry figures: finance, credit, insurance, legal, procurement, reporting. |
| Runs | In your process. Python 3.10+, Linux, macOS, Windows. No server, no account, no API key, no model, no network. |
| Works with | Langfuse, Grafana and any OpenTelemetry backend, MCP clients, your LLM judge (OpenAI-compatible, Azure OpenAI, Bedrock), AWS KMS, Azure Key Vault, PKCS#11 HSMs, S3 Object Lock, Azure Blob, Postgres. |
| Engine | Rust. One implementation: the same answer gives the same content hash on every machine. |
| Price | Free. Apache-2.0, all of it. |

## Quickstart

```python
import groundlens as gl

verifier = gl.Verifier(sink=gl.sinks.jsonl("records/"))
record = verifier.check(
    answer="Revenue was €42.1 million.",
    passages=["Revenue reached €41.2 million."],
)
print(record.decision, record.reasons)
```

```text
FAIL ['c2: groundlens.numeric contradicted: €42.1 million not in sources; nearest 41200000 EUR in ctx-0 (relative distance 0.021)']
```

## Already running an LLM-as-judge?

Keep it. GroundLens runs the exact checks first, and a FAIL never reaches the
judge. Your judge only sees the answers the exact checks could not reject, and
it can escalate an answer, never pass one. Every call is recorded: the
template, the hash of the prompt, the model that answered and the hash of its
reply.

## What it catches, and what it does not

| Error in the answer | Caught by |
| --- | --- |
| A figure that is not in the passages | exact check, FAIL |
| Wrong arithmetic: a sum, ratio or percentage change that does not follow | exact check, FAIL |
| A real figure from another company, contract or year | scope check, FAIL |
| A figure of another kind or unit than the question asked for | intent check, REVIEW |
| A request that does not say which entity it is about, when the policy requires it | policy, REVIEW |
| A record edited, deleted or reordered after the fact | `groundlens record verify`, offline |
| A real figure from the wrong row of the right table | your judge, not the exact checks |
| A sentence the passages never say | your judge, not the exact checks |
| A fact that is wrong in the passages themselves | nothing: GroundLens checks against the passages you give it, not against the world |

## Works with

- **Langfuse.** Each check appears in the trace that produced the answer, as a
  guardrail observation, with the decision as a categorical score.
  `pip install "groundlens[langfuse]"`
- **Grafana and OpenTelemetry.** Spans and metrics through the providers your
  application already uses, and a ready dashboard.
  `pip install "groundlens[otel]"`
- **MCP.** `groundlens-mcp` gives any MCP client three tools:
  `verify_answer`, `verify_run`, `verify_records`.
  `pip install "groundlens[mcp]"`
- **Your judge.** `gl.judges.openai_compatible` (OpenAI, vLLM, Ollama, any
  gateway), `gl.judges.azure_openai`, `gl.judges.bedrock`.
- **Your keys and storage.** Sign with AWS KMS, Azure Key Vault or a PKCS#11
  HSM; store in S3 Object Lock, Azure Blob, Postgres or JSON Lines.

## For regulated teams

The `eu_ai_act_high_risk_v1` policy maps each decision to Regulation (EU)
2024/1689: FAIL to Art. 15(1) accuracy, REVIEW to Art. 14(4)(a) human
oversight, and every record to Art. 12(1) record keeping. It produces
evidence for those controls; it does not make a system compliant on its own.

Every record carries a content hash, the hash of the record before it and a
signature. Anyone can check a whole log offline with the public key alone,
with `groundlens record verify` or with `glv`, a single binary that needs no
Python. `groundlens measure` estimates the share of wrong answers among those
that passed, from a small sample your team labels.

## FAQ

### Is GroundLens a hallucination detector?

It is narrower and stricter. It checks the figures in an answer against the
passages the answer was written from, and the policy decides what a mismatch
means. For sentences without figures, connect your own LLM judge.

### Does it need a GPU, a model or an API key?

No. The checks are exact and run in your process in about a millisecond. A
judge is optional, and it is the model you already use.

### Does any data leave my machine?

No. The engine has no network code. Other systems are reached only through
clients you create and pass in.

### Is it deterministic?

The checks are: the same answer, passages and policy give the same content
hash on Linux, macOS and Windows. A judge is not, and the record says so.

### How is it different from Guardrails AI, NeMo Guardrails, Ragas or DeepEval?

Those score or filter answers, mostly with a model. GroundLens decides with
exact checks, under a policy you version, and leaves a signed record of why.
It works next to them. See [GroundLens and other tools](https://groundlens.dev/compare.md).

### Does it work with LangChain, LlamaIndex or my own stack?

Yes. It is one call after your model answers: `verifier.check(answer=...,
passages=...)`.

### What does it cost?

The software costs nothing. Apache-2.0: engine, checks, policies, connectors,
command line and MCP server. Measuring it on your answers and running it in
your cloud is a paid service: write to javier@groundlens.dev.

## Links

- Source: https://github.com/groundlens-dev/groundlens
- Package: https://pypi.org/project/groundlens/
- Documentation: https://groundlens.readthedocs.io
- MCP registry: io.github.groundlens-dev/groundlens
- For agents: https://groundlens.dev/llms.txt
- Contact: javier@groundlens.dev
