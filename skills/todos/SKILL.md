---
name: todos
description: Work the project's parked wants — reconcile IDEAS.md against the code, score what's unsized, propose a batch, and build what the user picks.
disable-model-invocation: true
argument-hint: "[n | substring]"
---

Take the parking lot to the user as a decision, not a listing. The artifact is `IDEAS.md` at the plan store root; `${CLAUDE_PLUGIN_ROOT}/TRACKER.md` → *`IDEAS.md`* holds its lifecycle. This is the one verb where a filed want meets the codebase: `IDEAS.md` only ever grows otherwise — `issues/` is emptied by the fix that closes a file, and a want has no other exit.

**The gate is the verb.** Steps 1–3 compute a proposal — nothing touches the file until the user has answered §4. The order is arithmetic, the batch is a proposal, *what gets built* is the user's call. Building off the ranking alone is the autonomous triage the parking lot exists to prevent, which is why this skill is user-invoked.

**Not a smaller `brief`.** `brief` takes one subject and grills it to exhaustion. `todos` takes several unrelated lines, none of which earns a brief, and lands them. A line that needs the grill leaves here for there (§5).

## 1. Reconcile — every line against the code

Read `IDEAS.md` at `~/.claude/team-justin/management/<project-slug>/` (`<project-slug>` = the working repo's dir name; no repo → the cwd's). Missing or empty → say so, name `/team-justin:todo <the thing>`, stop.

Then check each headline against the codebase — a targeted grep or file-open per line, `Explore` for the vague ones, budgeted at a read pass, not an investigation. Every line lands in one bucket:

- **done** — the code has since grown it, or another change made it moot. Cite the `file:line` or commit that shows it.
- **archived** — `plan: <slug>` whose `plan/<slug>/` is gone (`TRACKER.md` deletes it at merge). Still open; note it.
- **open** — still wanted, as far as the code says.

Mark age on every line captured 90+ days ago (`· 119d`). Age is a fact off the line; *done* is only what §1 verified.

**Done when every entry has a bucket** — the count of done + archived + open equals the number of entries in the file.

## 2. Score — every open line carries two digits

`value` / `effort`, `1`–`5` (`TRACKER.md` anchors). Three cases:

- **both bare digits** — the user's. Leave them.
- **`~n`** — a past session's proposal. Re-read it against what §1 just looked at; keep or revise, still `~`.
- **legacy** (`effort:` holding a slug, a `?`, or no numbers) — size it now from the §1 read, filed `~n`.

Every `~` is confirmed or corrected by the user at §4 and drops its tilde then. The digits are the user's the moment they answer; they never become bare on your own read.

## 3. Rank and propose the batch

**Rank** `value ÷ effort` descending (`5/1` leads `4/1` leads `5/3`); ties to higher `value`, then **newest first** — a fresh line still has its context in the user's head and the code hasn't drifted from it; an old one already wears its age. A `~n` ranks as `n`.

**Batch** = the top-ranked open lines whose `effort` is `1`–`2`, on **different seams** so one review pass covers them, capped at what one session lands without a brief. `$ARGUMENTS` narrows: an integer takes that capture-numbered line (the nth entry in the file — stable across appends), anything else filters headlines by case-insensitive substring. A filtered run still reconciles and scores the whole file; only the batch narrows.

## 4. Gate — show it, then wait

One message, then stop:

```
reconcile
  done      3. <headline> — src/x.ts:42 already does this           → delete?
  archived  7. <headline> — plan: checkout gone                      (stays)
scores
  5. <headline> — value: ~4 · effort: ~1   (was legacy)
  9. <headline> — value: ~3 → ~2 · effort: ~2                          (rescored)
batch
  5. <headline> — value: ~4 · effort: ~1 — <one sentence: what you'd do>
  2. <headline> — value: 5 · effort: 2  — <one sentence>
rest: 6 open, ranked: 1 (5/3) · 8 (4/3 · 119d) · …
```

Every done line, every `~` score, and the batch go back **numbered by capture position**. The user strikes, adds, confirms and corrects digits. **Nothing is written before they answer.** No answer → the file is exactly as you found it; say so and return to whatever was in flight.

## 5. Land what they picked

On the user's answer, in this order:

1. **Apply the file edits they confirmed**: delete confirmed-done lines; write confirmed digits bare, corrected digits bare, still-unconfirmed ones `~`.
2. **Each accepted batch line** → one of three outcomes, named individually:
   - **built** — `lead` Step 3 routing, Step 4 review, **one commit per line** so a bad one reverts alone; the line is **deleted** at Step 4.5, in the same reconciliation as the commit.
   - **already done** — turned out moot on contact. Delete the line, build nothing.
   - **bigger than its `effort`** — leaves the batch. Rescore in place, then leave it parked or hand it to `/team-justin:lead brief`. Say which; never half-build it to justify the pull.
3. **Report**: what landed against which commits, what was deleted as done, what was rescored and to what, and the file's entry count before and after. Lines the batch never reached are exactly as filed, plus whatever digit the user confirmed.

**Completion criterion: every accepted line has a named outcome, and every file edit the user confirmed is in the file.** A line that quietly stays without an outcome is a want the user now believes was handled.

## Guardrails

- **No write before §4.** Reconcile and score are proposals until the user answers; the file survives an interrupted run untouched.
- **Delete only what the user confirmed or what a landed commit satisfies.** Stale is old, not done; a duplicate is two lines until the user says which one goes.
- **Defects live in `issues/`** — `/team-justin:issues` works those the same way.
