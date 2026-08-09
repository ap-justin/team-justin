# audit — report roster drift

Read-only. Assert every point of the wiring map (`SKILL.md`) agrees across files, then report a table: **check → OK / DRIFT → fix**. Report only; hand fixes to `hire`/`retire`, or apply on the user's say-so.

## Assertions
1. **Count** — `ls agents/*.md | wc -l` equals the "N specialist subagents" number in **both** `plugin.json` and `marketplace.json` descriptions.
2. **Version** — `VERSION` equals `plugin.json` `version` equals the `ROSTER.md` `# Roster — vX.Y.Z` header.
3. **Full registration** — every `agents/*.md` has (a) a `ROSTER.md` *Current specialists* row, (b) a *Model tiers* entry, (c) a `lead` *Step 3* routing row **or** *Step 4* review wiring **or** a `ROSTER.md` row marked **user-invoked** (user-triggered — via a thin invoker skill or direct spawn; absent from `lead` by design), and (d) a `SOURCES.md` row **or** an explicit stack-agnostic note.
4. **No orphans** — every `ROSTER.md` specialists row and every `lead` routing row names a real `agents/*.md` file.
5. **Model agreement** — every seat pins an explicit **full ID** (`claude-opus-5` / `claude-sonnet-5` — never omitted, never a floating `opus`/`sonnet` alias) and it matches its `ROSTER.md` *Model tiers* row.
6. **Shared-block integrity** — the assertions above are all *registration*; this one is the **prompt body**, where drift actually lands (a seat can be perfectly registered and still have lost a rule). Against `shared-blocks.md`:
   - every file-reading seat has `## Context hygiene (stay lean)`; every TS-writing seat has `## TypeScript (shared skill)` — exemptions are the four text-producing seats named in Block A, and nothing else
   - every **behavior seat** has `## Test-first (shared skill)` — the 8 named in Block D. Its exemptions are a **closed list with recorded reasons** (the two UI builders, `sanity-builder`, `vercel-perf-optimizer`, `toolchain-engineer`, `vercel-platform-engineer`, the reviewers, the four text seats): a seat exempt for a reason not written in Block D is drift, and so is a *new* code-writing seat that quietly landed in neither list
   - both **UI component builders** carry Block E's token-vocabulary bullet, identically — it has no tailored slot, so any divergence between the two is drift. A seat that **enumerates the token names** instead of reading them off the project's token file has cached a list that lives in the repo being built; that's drift too, and it goes stale silently
   - each block's **invariant clauses** are present verbatim — `grep -c "⚠" shared-blocks.md` for the marked ones rather than trusting a count in this sentence, and read each one you find. They are the clauses drift has actually dropped, so a shortened bullet is the drift, not a style choice
   - every seat ends with exactly one return contract (`Return:` line **or** `## Output`/`## Handoff`), per Block C
   - every **review seat** has `## What you return` *in addition to* `## Output` — the 6 named in Block C.1. Check the pair, not either alone: a seat carrying only `## Output` never learned the split, and one whose caps got folded *into* its `## Output` has quietly edited a skill template four of them are required to reproduce verbatim. The two recorded exceptions (`architecture-reviewer` design-mode specs, `ux-auditor`'s path map) are in Block C.1 — an uncapped return for any other reason is drift
   - **`{…}` slots differing per seat is correct** — report only missing/altered invariants, never "converge the tailored text"

   Cheap check: extract each block across `agents/*.md`, cluster by exact text, and look at the small clusters. A single seat differing from a 9-file majority is drift; a 3-seat cluster hired in one commit is *cohort* drift and the likeliest thing to find.

7. **Countable claims in `ROSTER.md` prose** — every number a skill row asserts about its own files is re-derived, not trusted: corpus entry counts (`grep -c "^## " skills/<name>/reference/*.md`), `Detect:` tier breakdowns, group counts, verified-URL counts. These drift silently in the opposite direction from the version header — a release bumps `VERSION` and the prose keeps the old figure, so the row reads authoritative and is wrong. Re-count rather than reading the sentence: the last row to carry a stale count carried it across three releases and was still wrong when the skill was deleted.

## Report
One row per failed assertion: which file(s), what disagrees, and the one-line fix (usually: run `hire`/`retire`, correct the count/version, or restore the clause from `shared-blocks.md`). If all pass, say so in one line. Do not edit files.
