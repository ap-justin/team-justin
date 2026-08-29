---
name: todo
description: Log something you want but don't want done now, into the project's plan store. Expands it from context already in the session; logs it as-is when there's none.
disable-model-invocation: true
argument-hint: "<the thing you want, later>"
---

Write the user's deferred want into the project's `IDEAS.md` and get out. They want something and don't want it done now. See `${CLAUDE_PLUGIN_ROOT}/TRACKER.md` → *`IDEAS.md`* for the artifact's lifecycle — you don't need to read it to run this.

**Zero-derail.** One append, not a task. Inline; spawn nothing. If something was in flight, log and go straight back to it.

## Expand from what's already loaded — never go get more

This is the one judgment the skill makes, and the line is **cost, not usefulness**: context you already hold is free, context you'd have to fetch is the task the user just declined.

- **Session has relevant context** — you just read the file, ran the failing command, made the decision, saw the error, or built the thing they're now deferring → **use it**. Name the file and symbol, the constraint, why it's deferred, what it depends on. A future reader gets what you knew at the moment it surfaced, which is exactly what evaporates.
- **Cold, or the context is unrelated** — fresh session, or they're parking something you know nothing about → **log the line as they said it** and stop. No exploration to make it look better.
- **The test, before writing anything extra:** *would knowing this require a tool call?* If yes, you don't know it — leave it out. No `Explore`, no grep, no opening a file, no checking whether it's already done, no dedupe against existing lines. A skill that "helpfully" investigated would turn a deferred want into work nobody asked for.

**Expansion adds detail, never commitment.** Past the two numbers below, no triage, no scheduling, no scoping it into the current effort, no verdict on whether it's a good idea. The parking lot is pre-decision by construction — the user is the PM, and thinking it through is `lead brief`'s job, later, if the line is ever pulled into scope.

## Score it in two numbers, or write `?`

Every line carries **`value:`** and **`effort:`**, `1`–`5`. They exist for one reason: `/team-justin:todos` ranks the file by them — high value, low effort first — so a parking lot that only grows stays readable. They are **estimates the user overwrites**, and they bind nobody.

Same cost rule as expansion — score from what you already hold, never from a fetch:

- **The user named it** — "quick one", "big job", "this matters", an explicit `value 4 effort 1` → theirs wins over your read, always.
- **The session already knows** — you just read the file and it's a one-line change in `src/x.ts`; you just hit the thing this would fix for the third time → estimate.
- **Neither** → write **`?`**. A cold capture is `value: ? · effort: ?` and that is the correct write, not an unfinished one. Opening a file to size the work *is* the task the user just declined, and a guessed number ranks a line the user never scored.

| n | `value` — payoff if it lands | `effort` — work to land it |
| --- | --- | --- |
| 1 | marginal; nothing is worse for it sitting here | one file, under an hour |
| 3 | clearly worth doing | one focused session |
| 5 | unblocks other work, or fixes something the user keeps hitting | multi-session; wants a `brief` first |

`2` and `4` sit between. Score the line **on its own terms** — never against the other entries, which would mean reading and re-ranking the file. The arithmetic is `todos`', the scope call is the user's.

## Do

1. **Read `$ARGUMENTS`** — the thing to log. If empty, ask one line ("What do you want logged?") and stop.
2. **Append** to `IDEAS.md` at the store root — `~/.claude/team-justin/management/<project-slug>/`, where `<project-slug>` is the working repo's dir name (no repo → the cwd's). **No precondition**: create the dir and the file if they don't exist.

   Cold — one line, the standing format:

   ```markdown
   - <the thing, one line> — _pitched · value: <1-5|?> · effort: <1-5|?> · plan: <slug|—> · <YYYY-MM-DD>_
   ```

   With context worth keeping — same line, plus at most two indented sub-bullets:

   ```markdown
   - <the thing, one line> — _pitched · value: 4 · effort: 1 · plan: <slug|—> · <YYYY-MM-DD>_
     - _from session:_ <what you already knew — `file.ts:42`, the constraint, why it's deferred>
   ```

   `pitched` always — this is the user's channel (`discovered` is for what the team turns up mid-task, the lead's Step 4.5 sweep). `plan` is the effort slug it surfaced in, and takes a slug only when the user names one or the store has exactly one `plan/<effort>/`; otherwise `—`. Never guess an effort to make the line look complete. Cite `file:line` for anything you name — the store sits outside the repo, so an unanchored reference is unfollowable.
3. **Stay short.** The headline stays one line no matter how much you know; the sub-bullets cap at two. If it's genuinely paragraphs of half-formed thinking the user wants kept whole, write `notes/<slug>.md` instead and say which you did — a note is input, never authority.
4. **Confirm in one line** — echo the headline **with both numbers**, and its path, and say whether you expanded it or logged it as-is. The numbers ride the confirmation so a wrong one is cheap to fix: if the user corrects either, rewrite that line in place and stop. Then return to whatever was in flight. The next `lead brief` run reads it back; until then it's a reminder, explicitly **not** a commitment.

## Don't

- **Don't take a defect.** Something *wrong* (an incorrect result, false info shown to a user, a condition the code claims to handle and doesn't) is `/team-justin:issue`'s artifact, not this one. Something you merely *want* — a feature, a refactor, a cleanup, a smell worth revisiting — is this one. The store's three-way split holds: **wrong → `issues/`, wanted → `IDEAS.md`, unformed → `notes/`**. Say in one line which you did; don't investigate either way.
- **Score the line alone, and attach nothing else.** `value` and `effort` are the whole score; a place in the order is `todos`' arithmetic, and scope is the user's call at the next grill. Nothing here reads the rest of the file.
- Don't start it. "Not now" is the entire instruction.
- Don't write into the working repo. Store files stay at user level, always (`TRACKER.md`).
