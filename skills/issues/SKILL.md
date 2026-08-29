---
name: issues
description: Print the project's known defects — the plan store's issues/, listed or one file in full.
disable-model-invocation: true
argument-hint: "[slug | substring]"
---

Print the defect files the store holds. `${CLAUDE_PLUGIN_ROOT}/TRACKER.md` → *`issues/`* holds the lifecycle; this skill runs without reading it.

**Verbatim.** A defect file reaches the user in its own words, every `_not investigated_` marker intact — that marker is what keeps a cheap stub from reading as a finished write-up, and summarizing one launders exactly the claim `issues/` exists to keep honest. **Zero-derail**: read, print, inline, spawn nothing, then back to whatever was in flight.

## Do

1. **List the dir** — `issues/` at `~/.claude/team-justin/management/<project-slug>/`, where `<project-slug>` is the working repo's dir name (no repo → the cwd's). Missing or empty → *no known defects*, said plainly: a fix **deletes** the defect file, so an empty dir is a true claim rather than a shrug. Name `/team-justin:issue <what's wrong>` as the way to open one; the store dir stays exactly as you found it.
2. **Bare `$ARGUMENTS`** → one line per file, read from its frontmatter and `#` heading (a few lines per file, never the whole write-up):

   ```
   critical · <kebab-slug> — <what's wrong, the file's one-liner>   [stub]
   ```

   `[stub]` on any file still carrying `_not investigated_`, so the list is as honest as the files under it. Order `critical` → `high` → `medium` → `low`, alphabetical within a severity. Close on the count and the dir's path. Done when every file in the dir has a line.
3. **Close the list on concentration** — the Pareto read, and it is arithmetic over filed fields, never a guess. Two or three lines at most, each stating its own denominator:

   ```
   7 defects — 1 critical, 2 high, 4 medium · 3 are stubs
   4 of 7 cite `src/billing/` in Call sites — the densest cluster
   ```

   Count severities, and count repeated paths across the `Call sites` lines that **are** filled in. A cluster earns its line at two or more files. Nothing concentrates, or too few files carry call sites to tell → print the counts alone and stop; a cluster is worth naming only when the files actually name one.
4. **With `$ARGUMENTS`** → an exact slug, else a case-insensitive substring over slug and heading. One hit prints whole. Several print as a list of just those, for the user to pick from. No hit says so and stops.
5. **Every file listed is open.** Membership is the status — a defect file exists until the change that fixes its bug deletes it — so the list carries no status column and you infer none.
6. **Hand it back and stop.** Filling a stub in is a normal `/team-justin:lead <task>`, and the user is the one who picks it. Return to whatever was in flight.

## Guardrails

- **The bug stays broken here.** Being shown the list is not being asked to fix one: no repro attempt, no root-cause theory, no patch, no offer of one, and no reading of the code a write-up cites. Fixing a defect deletes its file in that same change, along with the repro test that replaces it (`lead` Step 4.5).
- **The dir goes out unchanged.** `severity` prints as filed even where it reads wrong, and a file that looks stale still prints — only the change that fixes the bug removes one.
- **The concentration read counts; it doesn't rank.** Severity order and a cited-path cluster both come off what the files say. Fix *order* needs impact and frequency, and a stub's `Blast radius`, `Root cause` and `Call sites` all read `_not investigated_` — so a Pareto curve drawn over stubs is invented, and the honest 80/20 line is the one the filed fields support. What to fix next stays the user's call; they're the PM.
- **Wants live in `IDEAS.md`** — `/team-justin:todos` prints those.
