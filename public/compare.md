---
title: "GroundLens and other tools"
description: "When to use GroundLens, and when an evaluation framework, a guardrails library or an observability platform is the better tool. They work together."
canonical: https://groundlens.dev/compare
---

# GroundLens and other tools

Most teams that ship LLM answers end up with three kinds of tool. They answer
different questions, and GroundLens is only one of them.

| Question | Kind of tool | Examples |
| --- | --- | --- |
| How good is my system, on a test set, before release? | Evaluation framework | Ragas, DeepEval, promptfoo |
| What happened in production, and what did it cost? | Observability platform | Langfuse, Arize Phoenix, Grafana |
| May this answer be used, and can I prove why? | Runtime check with a record | GroundLens |

## When GroundLens is the right tool

- The answers carry **figures** (amounts, rates, dates, units) taken from
  documents, and a wrong figure is expensive.
- A real figure from **the wrong company, contract or year** is the error you
  fear most.
- You need a **decision per answer** (PASS, REVIEW or FAIL), not a score you
  still have to interpret.
- Someone else will **audit** the decisions: a risk team, a regulator, a
  customer. They need a signed record they can check without your software.
- You already run an **LLM judge** and want fewer calls to it, and a trail
  that does not rest on its opinion.

## When it is not

- Answers without figures, where the risk is tone, safety or style: use a
  judge or a guardrails library with those validators.
- Measuring a system before release across many metrics: use an evaluation
  framework. GroundLens's `measure` answers one question only, the share of
  wrong answers among those that passed.
- Checking facts against the world rather than against the passages you
  retrieved: GroundLens never looks beyond the passages.

## Side by side

| | Evaluation frameworks (Ragas, DeepEval) | Guardrails libraries (Guardrails AI, NeMo Guardrails) | GroundLens |
| --- | --- | --- | --- |
| When it runs | Mostly offline, on a test set | At runtime | At runtime, and offline to replay |
| How grounding is judged | Mostly with an LLM as judge | Validators or rails; grounding checks mostly use a model | Exact checks on figures, scope and intent; a judge only if you add one |
| What it returns | Scores per metric | Pass, fix or block per validator or rail | PASS, REVIEW or FAIL under a versioned policy, with reasons |
| What it keeps | Results of the run | Logs, if you keep them | A signed, hash-chained record, stored before the decision returns |
| Same input, same result | Depends on the judge | Depends on the validator | Yes for the exact checks, on every OS |

This table describes typical use. Each of these projects moves fast; check
their documentation for what they do today.

## Using them together

- **With your evaluation framework:** run GroundLens on the same test set,
  and its exact checks give a deterministic baseline next to the judged
  scores.
- **With Langfuse or Grafana:** GroundLens writes each check into the trace
  that produced the answer, so the decision sits next to the model call.
- **With your judge:** GroundLens runs first; a FAIL never reaches the judge,
  and the judge can escalate an answer, never pass one.

Install: `pip install groundlens`. Source: https://github.com/groundlens-dev/groundlens
