# Changelog

Semver-ish: new agent/capability → minor, prompt fix → patch, orchestration-contract break → major.

Last 5 releases only — older entries live in git: `git show vX.Y.Z:CHANGELOG.md`.

## v0.1.0 — the lead talks to a PM
New orchestration-wide principle in `skills/lead` (+ a Rules bullet): the lead translates at the boundary instead of passing seat vocabulary through. Say it without jargon or code when nothing is lost; a load-bearing term is introduced once in plain words; grill in outcomes the user can feel, and anything unaskable in plain words is a fact the lead looks up rather than a decision; plain is never vague (numbers, real names, risk, cost survive); no code/diffs/file trees in reports unless asked; seat names stay visible, process nouns don't. Scoped to what the lead *says* — the plan store's file formats and the builders' handoffs stay exact.

## v0.0.1 — the team, reset to one release
History squashed and versioning restarted at `0.0.1`. Prior release notes and the per-release lineage that had accumulated across `ROSTER.md`, `SOURCES.md` and the skill files are gone — a rule reads better than a rule plus the release that introduced it, and the repo has one user, so the archaeology was cost without a reader.

What ships: a `lead` skill orchestrating **25 specialist subagents**, a vendored skill set (design, UX, marketing, testing, stack playbooks), the plan store (`TRACKER.md`), and the roster discipline in `skills/roster/` (`hire`, `author`, `audit`, `shared-blocks`).
