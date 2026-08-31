---
name: doc-fix
description: Audit the human-facing doc prose in a target — README, DEPLOY, CONTRIBUTING, docs/ — and fix it in place.
disable-model-invocation: true
argument-hint: "[<path> | <glob> — omit for the repo's human docs]"
---

The prose is the deliverable and the only thing that moves. The house standard, in one line: **a doc keeps the traps, the consequences, and what no run can teach — and points at the canonical file for everything else.** Doc prose drifts off that standard by accumulating: denials of paths nobody implied, narration of what running the thing already shows, restatements of what the code already carries, and status notes that expire the day the doc's audience arrives.

**Every hunk in the resulting diff is doc prose.** No code moves, no config changes, nothing the doc points at is "fixed" along the way. That's the completion criterion, and it's checkable: read `git diff` at the end, and revert anything else the pass touched.

## Do

1. **Resolve the target** from `$ARGUMENTS`:

   | argument | scope |
   | --- | --- |
   | *(none)* | the repo's human docs — `README*`, `CONTRIBUTING*`, `DEPLOY*`, `docs/**`, root-level `*.md` |
   | a path or glob | those files, whole |

   Agent-consumed documents — `AGENTS.md`, `CLAUDE.md`, skill and agent definitions — are `writing-for-agents`' standard, not this one; leave them out unless named.

2. **Cut** — each is a class, not a phrasing:
   - **Negatives** — what a doc doesn't state is simply not a path, so there's no need to deny it: "there is no X", "no A, no B, no C" enumerations, "X does not do Y" where nothing implied it would. Whole sections of the form *what is deliberately not here* go entirely.
   - **Run-output narration** — if running `a` shows `b`, the doc doesn't describe `b`: UI walkthroughs ("press X, a confirm names Y"), CLI flag/output descriptions `--help` already covers, "the screen says / draws as / reports" sentences, tables restating what a screen lists.
   - **Code restatement** — details literally in the code (constant values, clamp ranges, example CSS a reader could derive) stay in the code; the doc keeps only the pointer to the canonical file.
   - **Era-bound status** — pre-release/private-repo notes, "history will be squashed", migration paths for deployments predating a change: moot the day the doc's audience exists, so cut rather than maintain.
3. **Keep, always:**
   - **Traps with consequences** — one-way doors, silent failures ("renders fine but refuses every gift"), destructive-command warnings.
   - **Facts no UI or run can teach** — headless escape hatches, env vars, recovery-is-you, external-service behavior (ports, vendor limits).
   - **Interpretation of confusing output** — a scary-but-harmless warning, what "ready" actually means.
   - **Pointers over prose** — a line naming the canonical file/screen survives where a description of it was cut.
4. **Report.** One line per edit, grouped *cut* · *reworded* · *pointed*, each with `file:line`. Then the diff check from the top of this file, in a line: what moved, and that it was doc prose only.

## Don't

- Don't invent coverage — this pass removes and tightens; a doc the repo is missing is its own task, not a sweep side effect.
- Don't restyle a doc's voice or structure while passing through — a fix that reorganized the README buries the prose edits under noise nobody asked for.
