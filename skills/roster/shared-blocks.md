# shared blocks — the canonical text every seat copies

`hire` copies from here; `audit` asserts against here. **This file is the source, not "the nearest peer"** — peer-copying is what produced the one real drift this file exists to prevent (three seats hired in one commit copied each other and dropped two load-bearing clauses).

Each block below has **invariant clauses** (copy verbatim — `audit` checks them) and **tailored slots** (`{…}` — fill per seat; tailoring here is correct and must not be flattened).

---

## Block A — `## Context hygiene (stay lean)`

Required on every seat that **reads or edits repo files**. The four text-producing seats (`design-director`, `ux-designer`, `graphic-designer`, `planner`) are exempt by decision: their input is a brief handed to them, and they already carry an `## Output`/`## Handoff` contract.

```
## Context hygiene (stay lean)
A {builder|specialist|reviewer} runs in its own context and can't be capped mid-run — keeping it lean is on you.
- Read only what the brief names — {the given files/ranges}, not the whole tree. If you're reading around to *find* code, stop and ask the lead for paths; broad search is `Explore`'s job, not {a builder's|yours}.
- Never re-read a file you just edited — the successful edit already confirms its state.
- {the seat's docs-source bullet — the ONE reference/section to pull, never broad dumps}
- If the task really needs many files/subsystems touched, say so and let the lead slice it — don't let one run sprawl to hundreds of K tokens.

Return: {what the lead gets back — paths, commands run, what the next seat still needs}
```

**Invariant clauses** — the two marked ⚠ are the ones that drift dropped:
- `can't be capped mid-run`
- ⚠ `If you're reading around to *find* code, stop and ask the lead for paths` — this is the rule's **trigger condition**. Without it the bullet degrades to a vague "read less" and stops telling the seat *when to stop and ask*.
- `broad search is` + `` `Explore`'s job ``
- `Never re-read a file` + `already confirms its state`
- `let the lead slice it`
- ⚠ `don't let one run sprawl to hundreds of K tokens` — the concrete number is what makes it bite, and it matches `lead` SKILL.md's own wording. "don't let one run sprawl" alone is not the rule.

**Tailored slots**: the seat noun, the scope nouns in bullet 1 (`the Worker + wrangler config` / `the config files + the package.jsons` / `the slow route plus its hot path`), the whole docs-source bullet, and the `Return:` line. A seat may add a bullet (the UI builders' no-mid-build-asset-fetch rule) — additions are fine, deletions are drift.

**Reviewer variant** (`code-reviewer`, `architecture-reviewer`): they never edit, so bullet 2 becomes `Never re-read a file already in context — you don't edit, so nothing you've read has changed under you.`, bullet 1 scopes to the diff, and the block opens by naming the read/change asymmetry. Their return contract is `## Output`, not a `Return:` line.

## Block B — `## TypeScript (shared skill)`

Required on every seat that **writes or edits TypeScript**.

Full form (10 seats — the default for any seat writing app code):

```
## TypeScript (shared skill)
For anything TypeScript-the-language — tsconfig/strictness, module-resolution or path-alias breakage, a cryptic type error, a gnarly generic/inference or a `.d.ts`, ESM/CJS, monorepo project references, JS→TS migration, or slow type-checking — load the **`typescript`** skill (cheat-sheet baseline + type craft) and solve it in-context, not from memory. It's ambient craft in the code you're already writing, not a separate hand-off. (That skill excludes the formatter/linter + monorepo task/package graph — Biome/ESLint/Prettier, pnpm, Turborepo are the `toolchain-engineer` seat's; route that to the lead for it.)
```

**Short form** — correct when the seat only meets TypeScript at its own narrow surface. Name that surface, then the invariant tail. `cloudflare-builder` (typed `Env`/bindings, `wrangler types`), `toolchain-engineer` (+ the "you own the *task*, that skill owns the *tsconfig*" seam), `vercel-platform-engineer` (config-adjacent), `vercel-perf-optimizer` (typed `dynamic()`, `next.config.ts`) all use it correctly. **These are tailoring, not drift — do not converge them onto the full form.**

Invariant in both forms: loads `` **`typescript`** `` **and** `solve it in-context`, plus a not-from-memory clause.

## Block C — the return contract

Every seat ends with exactly one of:
- a trailing **`Return:`** line — builders and specialists (11 seats), or
- a **`## Output`** / **`## Handoff`** section — reviewers, planners, and the design/asset seats (6 seats), whose return is structured rather than a path list.

Pick by seat kind, not by whichever peer you opened.

## Block D — `## Test-first (shared skill)`

Required on every seat that implements **executable behavior with a specifiable contract** (8 seats: the three framework builders, `cloudflare-builder`, both data architects, `better-auth-specialist`, `stripe-specialist`).

**Exempt by decision** — record the reason, don't just omit:
- `react-ui-builder`, `svelte-ui-builder` — you can't go red on a layout or a motion curve; their gate is the user's visual-intent inspection. Logic-dense component internals (a reducer, validation rules) route to `test-writer` after the build.
- `sanity-builder` — its primary artifact is declarative schema; TypeGen is the correctness gate on GROQ.
- `vercel-perf-optimizer` — already carries the same discipline in a different currency: `## Prove the win` demands a measured before/after.
- `toolchain-engineer`, `vercel-platform-engineer` — config, not behavior.
- reviewers and the four text-producing seats — they don't write the code.

```
## Test-first (shared skill)
Behavior you own gets its test **before** its implementation — load the **`tdd`** skill and run its loop: one failing test → the minimal code that passes it → the next behavior. Never write the whole test file up front (the skill's horizontal-slice anti-pattern) — tests written in bulk verify *imagined* behavior and go insensitive to the real thing. Your testable surface: {the seat's behavior surface}. A **bug fix has no exemption**: the failing test that reproduces the defect lands in the same change as the fix.

Load the **`testing`** skill with it — how to find this repo's conventions before writing a line, what makes each of those tests worth keeping, and the run→fix loop (including running the suite **one-shot, never watch**: plenty of repos wire the default `test` script to interactive watch, which never exits and hangs your run with no result to report).

The behavior list comes from the **brief the lead handed you**, not from asking the user — you have no user channel, so the **`tdd`** skill's "confirm the seams under test with the user" step was the lead's grill and the seams its brief names, already done before you were spawned. If the brief doesn't settle what the contract is, test what it does say and name the assumption in your return; don't stall, and don't invent scope to test.

Three cases where you build first — do it, then **say so in the return**, naming which: **no harness exists** (nothing to go red with; standing one up is `toolchain-engineer`'s job, don't scaffold a runner mid-feature), **the shape is genuinely unknown** (a spike against an unfamiliar API — let the interface settle, then cover it before you harden it), and **the slice's deliverable is a screen** (what the user has to react to is the rendered thing and their eye is the only oracle for it, so the route/action/`load` feeding it ships with it and is covered once that intent settles). The third is the lead's call and arrives **named in your brief** — never claim it on your own.

And it does not stretch: **where the eye can't tell, there is no exemption.** The end-to-end path that connects route → data layer → render → action → write is precisely what looking at a screen cannot verify — a session that dies on redirect and a write that silently no-ops both render fine — so it goes red-green like anything else, however early it is. "It's the first version" and "tests would slow this down" are not exemptions.
```

**Invariant clauses:**
- `` load the **`tdd`** skill `` — the loop is the skill's, not restated per seat
- `one failing test` + `the minimal code that passes it` — the vertical slice; a seat that drops this reverts to test-after
- ⚠ `Never write the whole test file up front` — horizontal slicing, the longest of the three anti-patterns the vendored skill names. Without it, "test-first" degrades into batch-writing tests, which is the failure mode that produces tests nobody trusts.
- ⚠ `A **bug fix has no exemption**` — the one case with the highest value and the lowest cost (you need the repro anyway), and the one most likely to get quietly skipped under fix-it-now pressure
- `` load the **`testing`** skill with it `` — `tdd` supplies the *loop*, `testing` supplies what makes each test in it good and how to run the suite. Both, or the seat writes red-green-shaped tests against conventions it never looked up.
- ⚠ `one-shot, never watch` — the only runner *mechanics* in the block, and it earns inlining rather than living only in the skill: a watch-mode hang costs the whole run and returns nothing, so the seat can't even report what failed. Stated runner-agnostically on purpose — naming a runner would bias a seat that must defer to the repo's.
- `you have no user channel` + the brief-is-the-approval clause — this is the **adaptation** that makes a user-facing skill work inside a subagent; drop it and the seat either stalls waiting for a user or invents scope. Names `` **`tdd`** `` explicitly, not "the skill" — two skills load by this point and only one asks the user to confirm the seams first.
- both named build-first cases, and the `not one of the two` closer

**Tailored slot**: `{the seat's behavior surface}` only. Everything else is invariant — this block is short precisely so there's nothing to shorten.

**Not a substitute for `test-writer`.** This block covers first coverage of behavior the seat is building right now. What needs its own context stays `test-writer`'s (`lead` SKILL.md Step 4): coverage sweeps and fan-out across many files, repairing a red/flaky suite when no builder is in flight, and **capturing** an unfamiliar repo's conventions into a project testing doc. The seat and this block run the same `testing` skill — the split is context, not craft.
