# Changelog

Semver-ish: new agent/capability → minor, prompt fix → patch, orchestration-contract break → major.

Last 5 releases only — older entries live in git: `git show vX.Y.Z:CHANGELOG.md`.

## v0.2.0 — the return is not the report

The six review seats (`code-reviewer`, `architecture-reviewer`, `taste-reviewer`, `visual-reviewer`, `accessibility-reviewer`, `ux-auditor`) now split what they **write** from what they **hand back**. Each gains a `## What you return` section *after* its existing `## Output` — the Output stays the report (verbatim skill template where four of them require it), the return is the routing payload extracted from it: full report to a path the lead names, top-10 findings inline with the dropped remainder counted, no code, no narration. The verdict, severity counts and coverage line are never capped — the cap must not reach the fields the lead routes on, and a silent remainder would make a context saving read as a clean pass.

The lead names that path (`report: ${TMPDIR:-/tmp}/team-justin-review/<project-slug>/<seat>-<slice-slug>.md`) in every Step 4 review brief. **Deliberately ephemeral and outside the plan store** — a review is per-run and has none of `TRACKER.md`'s four lifetimes, so nothing durable points at it; what survives is the routed fix list and any `issues/` capture. Canonicalized as `shared-blocks.md` **Block C.1** with its invariants, tailored slots, and two recorded exceptions (`architecture-reviewer` returns design-mode interface specs in full; `ux-auditor`'s path map goes to the report, its header to the return), and asserted by `/roster audit`.

Why: a Step 4 parallel batch is the largest thing the lead's context ever ingests, and most of it — passing rules, contrast tables, path maps, screenshot dumps, coverage matrices — is audit record nobody routes off.

## v0.1.0 — the lead talks to a PM
New orchestration-wide principle in `skills/lead` (+ a Rules bullet): the lead translates at the boundary instead of passing seat vocabulary through. Say it without jargon or code when nothing is lost; a load-bearing term is introduced once in plain words; grill in outcomes the user can feel, and anything unaskable in plain words is a fact the lead looks up rather than a decision; plain is never vague (numbers, real names, risk, cost survive); no code/diffs/file trees in reports unless asked; seat names stay visible, process nouns don't. Scoped to what the lead *says* — the plan store's file formats and the builders' handoffs stay exact.

## v0.0.1 — the team, reset to one release
History squashed and versioning restarted at `0.0.1`. Prior release notes and the per-release lineage that had accumulated across `ROSTER.md`, `SOURCES.md` and the skill files are gone — a rule reads better than a rule plus the release that introduced it, and the repo has one user, so the archaeology was cost without a reader.

What ships: a `lead` skill orchestrating **25 specialist subagents**, a vendored skill set (design, UX, marketing, testing, stack playbooks), the plan store (`TRACKER.md`), and the roster discipline in `skills/roster/` (`hire`, `author`, `audit`, `shared-blocks`).
