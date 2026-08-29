---
name: todos
description: Print the project's parked wants — the plan store's IDEAS.md, ranked high-value/low-effort first, or one line in full.
disable-model-invocation: true
argument-hint: "[n | substring]"
---

Print what past sessions parked, so the user can see it. The artifact is `IDEAS.md` at the plan store root; `${CLAUDE_PLUGIN_ROOT}/TRACKER.md` → *`IDEAS.md`* holds its lifecycle, and this skill runs without reading it.

**Verbatim, reordered.** Every line reaches the user in the words it was **filed** in, and *filed* is the whole skill: you print what someone else wrote, in the order two numbers someone else wrote put it. That order is the one thing computed here. **Zero-derail**: one read, inline, spawn nothing, then back to whatever was in flight.

## Do

1. **Read the file** — `IDEAS.md` at `~/.claude/team-justin/management/<project-slug>/`, where `<project-slug>` is the working repo's dir name (no repo → the cwd's). One command. Missing or empty → say so, name `/team-justin:todo <the thing>` as the way to add one, and stop; a read leaves the store exactly as it found it.
2. **Bare `$ARGUMENTS`** → every headline, ranked (*Rank*), each numbered by its **capture position** — the nth entry in the file:

   ```
   4. <the want> — value: 5 · effort: 1 · plan: — · 2026-07-12
   1. <the want> — value: 3 · effort: 2 · plan: checkout · 2026-05-02 · 119d · effort archived
   ```

   Out-of-order numbers are the design: `n` survives an append, so `/team-justin:todos 4` means the same line tomorrow. Headlines only — sub-bullets are drill-in detail. Past ~30 entries print the top 20 ranked and count the scored ones below them; the **unscored block prints whole at any length**, since a `?` that never prints is a want that can never be re-decided.

   **Done when every entry is printed or counted** — the ranked block, the unscored block, and any cut count reconcile against the number of entries in the file. Close on that count, the stale count, and the path.
3. **With `$ARGUMENTS`** → an integer picks that capture-numbered line; anything else is a case-insensitive substring over the headlines. One hit prints whole — headline plus its `_from session:_` sub-bullets, which carry the `file:line`, the constraint, and why it was deferred, none of it reconstructible from the headline. Several hits print as a shorter ranked list keeping their numbers. No hit says so and stops.
4. **Hand it back** and return to whatever was in flight. A line becomes work when the user takes it to `/team-justin:lead brief`, which reads this same file back during the grill.

## Rank — filed `value` over filed `effort`

`value ÷ effort`, descending: `5/1` leads `4/1` leads `5/3`. Ties break to higher `value`, then capture order.

**A `?` in either number is unrankable, and stays that way.** Those entries print below the ranked ones under a plain `unscored` heading, placed in capture order — by the file, never by a number you supplied. A number you supplied reads identical to a filed one and ranks a want nobody sized; sizing it yourself is the fetch the *Guardrails* ban, wearing a digit.

**Legacy lines** — `effort:` holding a slug rather than a digit, from before the field split — are unscored. Say so once at the close: they predate `value:`/`effort:`, and re-filing with `/team-justin:todo` is what scores them.

## Stale — two signals already in hand

Marked on the printed line, never sorted on: an old want filed `value: 5` is still the top line.

- Captured **90+ days ago** → append the age (`· 119d`).
- `plan: <slug>` whose `plan/<slug>/` is gone → append `· effort archived`. `TRACKER.md` deletes that dir once its work merges, so the line has outlived the change it was raised against. One `ls` of the store's own `plan/` reads it — the only lookup this skill makes.

Stale says *old*, which is a fact off the line — never *done*, which nothing here has checked. Close on the count and one sentence: they're re-decided in the next `/team-justin:lead brief` grill.

## Guardrails

- **A `todos` run leaves the file exactly as it found it.** A line that looks stale, shipped, or duplicated prints exactly as filed — a quiet edit loses a want silently. Two verbs move the file and neither is this one: `/team-justin:todo` files a line, and `/team-justin:lead pull` retires one once the work has actually landed.
- **Anything you'd have to fetch stays out** — no `Explore`, no grep, no opening a file a line names, no checking whether it's since been done. The `ls` in *Stale* is the one exception and goes no further. That fetch is the work the user deferred, and *which of these to do next* stays `brief`'s call to make with the user: this skill orders the list, it doesn't pick off it.
- **Defects live in `issues/`** — `/team-justin:issues` prints those.
