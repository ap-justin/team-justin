# The `pull` verb — land a batch off the parking lot

The full procedure behind `SKILL.md` → Step 2.56. Reached when the user types **`/team-justin:lead pull [n | substring]`**. It fires **only on those words** — the ranking is arithmetic anyone can run, and running it is not permission to start on what it returns.

`IDEAS.md` accumulates by design and, until this verb existed, only ever grew: `issues/` gets emptied by the fix that closes a file, and a want had no equivalent exit. This is that exit. It is also the only place in the store where a filed `value`/`effort` meets the codebase and gets corrected.

**Not a smaller `brief`.** `brief` takes one subject, grills it to exhaustion and persists an account of it. `pull` takes several unrelated lines, none of which earns a brief, and lands them. A line that turns out to need the grill leaves this verb and goes to that one (§3).

## 1. Read the list ranked

`IDEAS.md` at the store root, ranked `value ÷ effort` with stale marked. The arithmetic, the unscored block and the two stale signals are **`${CLAUDE_PLUGIN_ROOT}/skills/todos/SKILL.md`** → *Rank* and *Stale* — run them, don't restate them; a second copy of a sort rule is a second rule.

## 2. Propose the batch — the user picks it

Default proposal: the top-ranked lines whose filed `effort` is `1`–`2`, touching **different seams** so one review batch covers them, capped at what a session lands without a brief. `$ARGUMENTS` narrows it — an integer takes that capture-numbered line, anything else filters by substring.

**An unscored (`?`) line stays out of the default batch.** Nobody sized it, so a rank it never had can't select it. The user can name one directly; sizing it then becomes the first thing you do, in §3.

**Then stop and show it.** The batch goes back numbered, each line with the one-sentence account of what you'd do, and you **wait**. The user strikes and adds. This gate is the whole guardrail: the order is arithmetic, the batch is a proposal, and *what gets built* stays the user's call — the same call `brief` hands them when it reads this file back. Building off the ranking alone is the autonomous triage the parking lot is built to prevent.

## 3. Take each accepted line to one of three outcomes

This is the first moment in a want's life that **anything checks it against the code**. Every accepted line lands on exactly one outcome, and you name which:

- **Already done** → the codebase has since grown it, or another change made it moot. Say so, **delete the line**, build nothing. A parking lot outlives the code it was written against; this is what a stale marker suspects and what this step confirms.
- **Wanted, and the size it says** → build it. Step 3 routing, Step 4 review, **one commit per line** so a bad one reverts alone and the store reconciles against a commit that names it.
- **Bigger than its filed `effort`** → it leaves the batch. **Rescore the line in place** — the one place a filed number is corrected by contact with the code — then either leave it parked or hand it to `brief` (Step 2.55). Say which, and don't half-build it to justify the pull.

**Completion criterion: every accepted line is landed, deleted as already-done, or rescored and left — each named individually in the report.** A line that quietly stays in the batch without an outcome is a want the user now believes was handled.

## 4. A landed want deletes its line

At Step 4.5, in the same reconciliation as the commit that lands it. `IDEAS.md` is the **open** parking lot, never an archive — the same rule that makes an empty `issues/` a true claim, arriving in the file that had no way to shrink. The commit is where the want is written down now, so the line has nothing left to hold.

Rescored lines stay, carrying their corrected numbers. Nothing else in the file is touched: a line the batch never reached prints tomorrow exactly as it was filed.

## 5. Report

What landed and against which commits, what was already done, what got rescored and to what, and the file's entry count before and after. That count is the point of the verb — it's the first number in this store that has ever been allowed to fall.
