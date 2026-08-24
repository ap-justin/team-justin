---
name: todos
description: Print the project's parked wants — the plan store's IDEAS.md, listed or one line in full.
disable-model-invocation: true
argument-hint: "[n | substring]"
---

Print what past sessions parked, so the user can see it. The artifact is `IDEAS.md` at the plan store root; `${CLAUDE_PLUGIN_ROOT}/TRACKER.md` → *`IDEAS.md`* holds its lifecycle, and this skill runs without reading it.

**Verbatim.** Every line reaches the user as filed — same words, same order, nothing added and nothing concluded. That one word settles the whole skill: what to print (the file), what to add (nothing), what to decide (nothing). **Zero-derail**: one read, inline, spawn nothing, then back to whatever was in flight.

## Do

1. **Read the file** — `IDEAS.md` at `~/.claude/team-justin/management/<project-slug>/`, where `<project-slug>` is the working repo's dir name (no repo → the cwd's). One command. Missing or empty → say so and name `/team-justin:todo <the thing>` as the way to add one; the store dir stays exactly as you found it, since a read leaves no trace.
2. **Bare `$ARGUMENTS`** → print every entry's headline, numbered in file order (capture order is the only order the file has):

   ```
   1. <the want> — pitched · effort: <slug|—> · 2026-07-12
   ```

   Headlines only — sub-bullets are drill-in detail. Close on the count and the file's path. Past ~30 entries, print the newest 20 and say how many sit above them. Done when every entry carries a number, or the count names the ones you cut.
3. **With `$ARGUMENTS`** → an integer picks that numbered line; anything else is a case-insensitive substring over the headlines. One hit prints whole — headline plus its `_from session:_` sub-bullets, which carry the `file:line`, the constraint, and why it was deferred, none of it reconstructible from the headline. Several hits print as a shorter list keeping their numbers. No hit says so and stops.
4. **Hand it back and stop.** The user reads and decides; a line becomes work when they take it to `/team-justin:lead brief`, which reads this same file back during the grill. Return to whatever was in flight.

## Guardrails

- **The file goes out unchanged.** A line that looks stale, shipped, or duplicated still prints — nothing here has checked, and a quiet edit loses a want silently. `/team-justin:todo` is the only writer.
- **Anything you'd have to fetch stays out** — no `Explore`, no grep, no opening a file a line names, no checking whether it's since been done. That fetch is the work the user deferred, and the parking lot is pre-decision by construction: ranking, scoring, and "these look easy" are `brief`'s call to make with the user, not this skill's.
- **Defects live in `issues/`** — `/team-justin:issues` prints those.
