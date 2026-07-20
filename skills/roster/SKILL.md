---
name: roster
description: Roster operations for this team plugin — hire or retire a specialist, author a skill, or audit the roster for drift. The versioned "Growing the team" checklist, executed as a tool.
disable-model-invocation: true
argument-hint: "<hire|author|retire|audit> [name]"
---

You run in the **main thread** (like `lead`) — minting a seat edits the orchestration contract (the `lead` routing table) and bumps + tags a version, which a subagent can't own. This skill operationalizes `ROSTER.md` → *Growing the team* so every seat is wired **identically** and nothing drifts.

**Roster-ops, not the excluded "ops/HR."** `ROSTER.md` → *Scope* excludes ops/HR as a *product-org* seat that serves end users. This skill mints the team's **own members** — self-authoring/governance, a different thing. It adds seats and skills; it never adds a business function.

## The standard (every branch)
Everything authored here meets **`/writing-great-skills`** (invocation model · information hierarchy · single source of truth · aggressive pruning) and the team's **official-sources-first** floor. Don't restate the repo's conventions — **copy the shape of the nearest existing peer** (a builder for a builder, a reviewer for a reviewer) and diff against it.

## Wiring map — the single source of truth
Every place a **seat (agent)** is registered. `hire` writes all of them, `retire` removes all of them, `audit` asserts all of them agree. This table is the authority; the verb files point back here rather than restating it.

| # | File | Entry |
|---|---|---|
| 1 | `agents/<name>.md` | the definition — frontmatter `name`/`description`/`tools`/`model`; body copies a peer's shape |
| 2 | `ROSTER.md` → *Current specialists* | one role row (agent · role · backing source) |
| 3 | `ROSTER.md` → *Model tiers* | add to the `inherit (→ opus)` list, or a **pinned** row + one-line why |
| 4 | `SOURCES.md` | backing-source row (skip only for a genuinely stack-agnostic seat, e.g. a pure reviewer — and say so) |
| 5 | `lead` SKILL.md → *Step 3* routing table | the `detected/needed → specialist` row (a review-only seat wires into *Step 4* instead) |
| 6 | `.claude-plugin/plugin.json` | `version` bump **and** the "routes to N specialist subagents" **count** in `description` |
| 7 | `.claude-plugin/marketplace.json` | the "N specialist subagents" **count** in `description` |
| 8 | `VERSION` · `CHANGELOG.md` · `ROSTER.md` header | version — minor for a new seat: `VERSION`, a changelog entry, and the `# Roster — vX.Y.Z` header, all equal |
| 9 | git | `commit` + `tag vX.Y.Z` — **only when the user asks** (team git rule) |

A **skill** touches a smaller map: `skills/<name>/SKILL.md` (+ any disclosed sibling files), a note in `ROSTER.md` → *Reused, not owned* (and `SOURCES.md` if it backs a seat), `VERSION`/`CHANGELOG`/header, git. **No agent-count bump** (#6–#7 count is agents only). A *vendored* skill also needs the provenance HTML comment + a `SOURCES.md` → *Vendored resources* note — copy the shape at the top of `skills/writing-great-skills/SKILL.md`.

The **count N** (#6–#7) is drift-prone — never hand-increment it; recompute from `ls agents/*.md | wc -l`.

## Dispatch
Read the one file for the requested verb, then execute it against the wiring map above.

| `$ARGUMENTS` | Do | File |
|---|---|---|
| `hire [role]` | mint a specialist + wire #1–#9 | `hire.md` |
| `author [name]` | mint or vendor a skill | `author.md` |
| `retire <name>` | remove a seat + unwire everywhere | `retire.md` |
| `audit` | report roster drift (read-only) | `audit.md` |

No verb given → run `audit` and report, then ask which of the others they want.
