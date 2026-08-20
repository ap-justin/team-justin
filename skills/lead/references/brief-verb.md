# The `brief` verb — grill, then persist the brief

The full procedure behind `SKILL.md` → Step 2.55. Reached when the user types `/team-justin:lead brief <subject>` (or `plan`, or asks to plan/grill something out before building). A bare `lead <task>` grills in-session per Step 2.5 and never loads this.

Same grill as Step 2.5, run to exhaustion — then **write it down**, so the shared understanding survives the session, the reset, and the hand-off to every seat downstream.

There is **no roadmap, no prioritization framework, and no PM pass** — the user is the PM and brings the subject. Your output is not "what should we build," it's **a holistic account of the change that's going to land**.

## 1. Read the intake first

The store's existing `plan/<effort>/brief.md` (if you're re-grilling an effort), `IDEAS.md` (the captured, untriaged one-liners from Step 4.5), and the store's `notes/` (freeform brainstorming — **input, never authority**: cite it as *"there's a note that says…"*, never as a decision, and never let it override the brief, the repo's docs, or the user).

Bring them back to the user during the grill: an old brief's open threads get re-decided, and an `IDEAS.md` line is either pulled into this change's scope or left where it is. You don't triage `IDEAS.md` on your own — you surface it and the user calls it.

**Walk `issues/` too — this is the dir's only reader.** Every file in it claims a live defect, and nothing else in the team ever checks that claim: read each one against the current code, **delete the ones the codebase has since fixed**, and surface the survivors to the user as scope candidates for this change. Completion criterion: **every file in `issues/` accounted for — reproduced, deleted, or explicitly left open** — because a dir nobody walks is how a bug fixed months ago stays on the books as a known defect.

**Re-grilling is reconciling, not re-reading.** Before you trust or tick anything in an old brief, check it against git — `git rev-list --count origin/main..main` plus the actual shas, and `gh pr list` for any PR the `Landing plan` claims landed. A brief claiming one unpushed commit when five are, or ticking a PR nobody opened, is the normal failure, not the odd one.

A brief pointer into `decisions.md` for a record that isn't there is a **finding, not a broken link** — handle it per `lossless-doc-compaction.md` → §4 (reconstruct only what the pointer itself asserts, log the rest as a dated gap), and take anything load-bearing back into the grill as a re-decided `Q → A`. Never backfill a missing decision from memory: an invented rationale reads identical to a recorded one.

## 2. Grill

Step 2.5's discipline — the frontier asked a round at a time, your recommended answer on every question, codebase-answerable questions answered from the codebase, and only the product calls and one-way doors reaching the round at all (`SKILL.md` → *talk to a PM*). Persisting the brief widens what's written down, never what's asked: a two-way door you settled goes into `Decisions resolved` as your call, with the reasoning, not into the round as a question.

## 3. Write `plan/<effort>/brief.md`

Per `TRACKER.md` — `Change` (one line, what lands) · `Why now` · `Blast radius` (files/subsystems touched + risk) · **`Landing plan`** (the cadence — see below) · `Decisions resolved` (the grill record, Q → A) · `Non-goals` · `Done when` (checkboxes).

**Rewrite in place, don't append**: a re-grill reads the old brief as input and replaces it, so the file is always the *current* account of the change, never an archaeology of every discussion. Strip the brief's self-archaeology in the same pass — `(Correction, …)`, `(Amendment, …)`, `(Rewritten <date> — this read…)` — and grepping for those markers is the done-check. The brief states the current shape; the story of how it got there is exactly what `decisions.md` is for.

Once `Decisions resolved` stops being re-readable, split its long-form records (grill transcripts, as-built notes, review outcomes) into `plan/<effort>/decisions.md` per `TRACKER.md` and leave the one-line `Q → A` summaries in the brief — a stale premise survives sweep after sweep when the section holding it is too long to check. **The split is a verification, not a formatting move**: run it per `lossless-doc-compaction.md` → §3, which is the rule that every bullet you delete must first resolve to a record in `decisions.md`.

## 4. Report

The brief's path + the one-line change, and say what's next — straight to Step 3 routing for a normal change, or `planner` (Step 2.6) when it won't fit one context.

## Cadence is yours, and it persists in the brief

You grill *and* you read the code (Step 2's `Explore` map) — you're the only seat holding both the intent and the seams, so *how this ships* is your call to make and write down. Two levels:

- **Commits are the steps.** Inside a PR, one commit per coherent step of the change. If the feature fits in one PR, the `Landing plan` is *just that commit list* — don't manufacture PRs to express sequencing.
- **A PR is an environment boundary or a partial ship.** Open a second PR only when (a) **something must land in a deployed environment before the rest can proceed** — a migration whose CI runs against a real branch database, a preview deploy or provisioned resource the next slice needs live — or (b) **part of the feature is shippable before it's perfect**, with the remainder following in its own PR. Diff size, file count, and review load are **not** split reasons on their own: a big single-environment change is one PR with many commits.

Grill for the cadence like any other load-bearing decision — the environment boundary is usually the question worth asking ("does anything here need to be deployed before the next step is even testable?"). It goes in `Landing plan` as nested checkboxes; Step 4.5 ticks each commit and PR as it lands. Don't leave it implicit in the ticket graph — a big effort's `planner` tickets *expand* the landing plan, they don't replace it.

The brief is the durable input for everything downstream: `planner` reads it instead of a spec-less prompt, builders get their scope from `Blast radius` + `Non-goals`, and `Landing plan` + `Done when` are what Step 4.5 reconciles against and what each PR description is written from.
