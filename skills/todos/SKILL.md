---
name: todos
description: Print the project's parked wants — the plan store's IDEAS.md, ranked high-value/low-effort first, or one line in full.
disable-model-invocation: true
argument-hint: "[n | substring]"
---

Print what past sessions parked, so the user can see it. The artifact is `IDEAS.md` at the plan store root; `${CLAUDE_PLUGIN_ROOT}/TRACKER.md` → *`IDEAS.md`* holds its lifecycle, and this skill runs without reading it.

**Verbatim, reordered.** Every line reaches the user in the words it was filed in — nothing added, nothing concluded, nothing edited. The *order* is the one thing this skill computes: filed `value` over filed `effort`, arithmetic over numbers someone else wrote. It ranks; it does not score, and it never fills in a `?`. **Zero-derail**: one read, inline, spawn nothing, then back to whatever was in flight.

## Do

1. **Read the file** — `IDEAS.md` at `~/.claude/team-justin/management/<project-slug>/`, where `<project-slug>` is the working repo's dir name (no repo → the cwd's). One command. Missing or empty → say so and name `/team-justin:todo <the thing>` as the way to add one; the store dir stays exactly as you found it, since a read leaves no trace.
2. **Bare `$ARGUMENTS`** → print every entry's headline, **ranked** (below), each numbered by its **capture position** — the nth entry in the file:

   ```
   4. <the want> — value: 5 · effort: 1 · plan: — · 2026-07-12
   1. <the want> — value: 3 · effort: 2 · plan: checkout · 2026-05-02 · 119d
   ```

   The numbers run out of order, and that's the point: `n` is a stable handle that survives an append, so `/team-justin:todos 4` means the same line tomorrow. Headlines only — sub-bullets are drill-in detail. Close on the count, the unscored count, and the file's path.

   Past ~30 entries, print the top 20 ranked and say how many scored lines sit below them — but **never truncate the unscored block away**, since a `?` that never prints is a want that can never be re-decided; if it's long, name its count and say `todos <substring>` reaches into it.
3. **Rank: value over effort, descending.** `value ÷ effort` — so `5/1` leads `4/1` leads `5/3`. Ties break to higher `value` first, then capture order.
   - **A `?` in either number is unrankable.** Those entries print **below** the ranked ones under a plain `unscored` heading, in capture order. Never estimate a missing number to place a line — that ranks a want the user never scored, and the guess reads identical to a filed one.
   - **Legacy lines** — `effort:` holding a slug rather than a digit, from before the field split — are unscored too. Say once, at the close, that they predate `value:`/`effort:` and are rescored by re-filing with `/team-justin:todo`; don't rewrite them here.
4. **Flag stale, change nothing.** Two signals, both free — one is the entry's own date, the other is one `ls` of the store's own `plan/` dir, which is the store you already opened, not the repo:
   - captured **90+ days ago** → append the age (`· 119d`) to its printed line;
   - `plan: <slug>` whose `plan/<slug>/` no longer exists → append `· effort archived`. Per `TRACKER.md`, that dir is deleted once its work merges, so the line has outlived the change it was raised against.

   Both are **markers, not sort keys** — an old want with `value: 5` is still the top line. Close on the stale count and one sentence: they're re-decided in the next `/team-justin:lead brief` grill, which reads this file back. Nothing here deletes or edits one.
5. **With `$ARGUMENTS`** → an integer picks that capture-numbered line; anything else is a case-insensitive substring over the headlines. One hit prints whole — headline plus its `_from session:_` sub-bullets, which carry the `file:line`, the constraint, and why it was deferred, none of it reconstructible from the headline. Several hits print as a shorter ranked list keeping their numbers. No hit says so and stops.
6. **Hand it back and stop.** The user reads and decides; a line becomes work when they take it to `/team-justin:lead brief`, which reads this same file back during the grill. Return to whatever was in flight.

## Guardrails

- **The file goes out unchanged.** A line that looks stale, shipped, or duplicated still prints — the stale markers say *old*, which is a fact off the line, never *done*, which nothing here has checked. `/team-justin:todo` is the only writer; a quiet edit loses a want silently.
- **Rank the filed numbers; never supply one.** The ranking is arithmetic over what two other sessions wrote down, and its denominator is stated (the unscored count). Scoring a `?` from your own read of the codebase is the fetch below wearing a number.
- **Anything you'd have to fetch stays out** — no `Explore`, no grep, no opening a file a line names, no checking whether it's since been done. The single exception is the `ls` of the store's own `plan/` in step 4, and it goes no further. That fetch is the work the user deferred, and *which of these to do next* stays `brief`'s call to make with the user: this skill orders the list, it doesn't pick off it.
- **Defects live in `issues/`** — `/team-justin:issues` prints those.
