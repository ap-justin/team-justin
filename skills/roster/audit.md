# audit — report roster drift

Read-only. Assert every point of the wiring map (`SKILL.md`) agrees across files, then report a table: **check → OK / DRIFT → fix**. Report only; hand fixes to `hire`/`retire`, or apply on the user's say-so.

## Assertions
1. **Count** — `ls agents/*.md | wc -l` equals the "N specialist subagents" number in **both** `plugin.json` and `marketplace.json` descriptions.
2. **Version** — `VERSION` equals `plugin.json` `version` equals the `ROSTER.md` `# Roster — vX.Y.Z` header.
3. **Full registration** — every `agents/*.md` has (a) a `ROSTER.md` *Current specialists* row, (b) a *Model tiers* entry, (c) a `lead` *Step 3* routing row **or** *Step 4* review wiring, and (d) a `SOURCES.md` row **or** an explicit stack-agnostic note.
4. **No orphans** — every `ROSTER.md` specialists row and every `lead` routing row names a real `agents/*.md` file.
5. **Model agreement** — each seat's `model:` frontmatter matches its `ROSTER.md` *Model tiers* entry (inherit = no frontmatter `model:`).

## Report
One row per failed assertion: which file(s), what disagrees, and the one-line fix (usually: run `hire`/`retire`, or correct the count/version). If all pass, say so in one line. Do not edit files.
