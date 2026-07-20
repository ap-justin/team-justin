# hire — mint a specialist

Wire every point of the **wiring map** in `SKILL.md`. Steps:

## 1. Justify the seam
State, in one line each: the seat's **single responsibility**, its **boundary** against the nearest existing seat (what it owns / where it stops), and its **backing official source**. If the responsibility overlaps a seat that already exists, **stop** — sharpen the boundary until it's distinct, or don't mint it. A seat with a fuzzy boundary is worse than no seat (`ROSTER.md` → *Scope*: adding a seat is fine, adding a blurred lane is not).

Completion: role + boundary-vs-nearest-peer + named source, all one line, no overlap.

## 2. Draft `agents/<name>.md` (map #1)
Copy the **nearest peer's shape** — read it first. Optionally spawn a drafting agent with that peer file and `/writing-great-skills` in context to write the body, then review it yourself. Frontmatter:
- `description` — trigger-rich, ending in a **boundary clause** that names its complementary seat (see how `code-reviewer`/`taste-reviewer` name each other).
- `tools` — omit for a full-access builder; scope it for a read-only reviewer (copy a reviewer's list).
- `model` — **omit to inherit** (→ opus, the default for builders/judgment seats); pin `opus` only for the hardest-judgment review that must survive a session downgrade, `sonnet` only for mechanical pattern-matching. Match an existing peer's choice.

Completion: file exists, meets the standard, description carries a boundary clause.

## 3. Register (map #2–#5)
- `ROSTER.md` *Current specialists* row and *Model tiers* entry (grouped `inherit` list, or a pinned row with a one-line why in the ROSTER rationale style).
- `SOURCES.md` backing-source row (skip only if genuinely stack-agnostic — then say so in the ROSTER row).
- `lead` SKILL.md *Step 3* routing row — the `detected/needed → specialist`. A **review-only** seat wires into *Step 4* (review & verify) instead, next to its sibling reviewer.

## 4. Version + count (map #6–#8)
Recompute the count — `ls agents/*.md | wc -l` — and set it in **both** `plugin.json` and `marketplace.json` descriptions (don't hand-increment). Minor bump: `VERSION`, `plugin.json` `version`, `ROSTER.md` header, and a `CHANGELOG.md` entry, all equal.

Completion: **run `audit` (see `audit.md`) — it must pass.**

## 5. Hand off
Report the new seat + its boundary. Leave `commit`+`tag` to the user unless they asked (git rule). Then route work to the seat.
