# shared blocks — the canonical text every seat copies

`hire` copies from here; `audit` asserts against here. **This file is the source, not "the nearest peer"** — peer-copying is what produced the one real drift this file exists to prevent (three seats hired in one commit copied each other and dropped two load-bearing clauses).

Each block below has **invariant clauses** (copy verbatim — `audit` checks them) and **tailored slots** (`{…}` — fill per seat; tailoring here is correct and must not be flattened).

---

## Block A — `## Context hygiene (stay lean)`

Required on every seat that **reads or edits repo files**. The three text-producing seats (`ux-designer`, `graphic-designer`, `planner`) are exempt by decision: their input is a brief handed to them, and they already carry an `## Output`/`## Handoff` contract.

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

**Reviewer variant** (`code-reviewer`, `architecture-reviewer`): they never edit, so bullet 2 becomes `Never re-read a file already in context — you don't edit, so nothing you've read has changed under you.`, bullet 1 scopes to the diff, and the block opens by naming the read/change asymmetry. Their return contract is `## Output` **plus Block C.1's `## What you return`**, never a `Return:` line — this block caps what the seat *reads*, C.1 caps what it *hands back*, and the two are separate failure modes.

## Block B — `## TypeScript (shared skill)`

Required on every seat that **writes or edits TypeScript**.

Full form (12 seats — the default for any seat writing app code; re-derive with `grep -lc 'cheat-sheet baseline' agents/*.md` rather than trusting this number):

```
## TypeScript (shared skill)
For anything TypeScript-the-language — tsconfig/strictness, module-resolution or path-alias breakage, a cryptic type error, a gnarly generic/inference or a `.d.ts`, ESM/CJS, monorepo project references, JS→TS migration, or slow type-checking — load the **`typescript`** skill (cheat-sheet baseline + type craft) and solve it in-context, not from memory. It's ambient craft in the code you're already writing, not a separate hand-off. (That skill excludes the formatter/linter + monorepo task/package graph — Biome/ESLint/Prettier, pnpm, Turborepo are the `toolchain-engineer` seat's; route that to the lead for it.)
```

**Short form** — correct when the seat only meets TypeScript at its own narrow surface. Name that surface, then the invariant tail. `cloudflare-builder` (typed `Env`/bindings, `wrangler types`), `toolchain-engineer` (+ the "you own the *task*, that skill owns the *tsconfig*" seam), `vercel-platform-engineer` (config-adjacent), `vercel-perf-optimizer` (typed `dynamic()`, `next.config.ts`) all use it correctly. **These are tailoring, not drift — do not converge them onto the full form.**

Invariant in both forms: loads `` **`typescript`** `` **and** `solve it in-context`, plus a not-from-memory clause.

## Block I — `## Comments (earn the line)`

Required on every seat carrying **Block B** (16 seats — the same list, and it sits **immediately after** Block B in every one of them: both are ambient craft in the code the seat is already writing, so they read as a pair). Re-derive with `grep -L 'Comments (earn the line)' $(grep -l 'TypeScript (shared skill)' agents/*.md)` — it must return nothing.

**Exempt by decision** — record the reason, don't just omit:
- `graphic-designer` — its p5.js output comes from the `algorithmic-art` template, whose heavy instructional comments are what mark the VARIABLE sections a later run replaces. Pruning them breaks the template's own contract, and the artifact is an image, not code anyone maintains.
- reviewers and the other three text-producing seats — they write no code, so there are no comments to earn.

```
## Comments (earn the line)
A comment earns its line by carrying what the code can't: a constraint from outside the file, the reason a correct-looking alternative is wrong, the gotcha waiting for the next reader. Code that reads plainly gets none — a comment restating the line beneath it is a second thing to keep true, and it goes stale first.
- **Present tense, no archeology.** The comment describes the code as it stands. What it replaced, what you tried first, what the brief said, what you just changed — git owns all of that. A reason that outlives the session (`serialized — the pool is single-writer`) is *why* and stays; the story of arriving at it goes.
- **Write for the next reader of the code, not for whoever prompted you.** A summary of the work you just did belongs in your return, not in the file.
- **Terse over grammatical.** One line, fragments fine, in the file's existing style. Density is the bar, not sentences.
- **Comments already in the file survive your edit.** Code you move or refactor carries its comments with it — this block governs what you write, never what's already there.
```

**Invariant clauses** — the two marked ⚠ are what keep the block from inverting into either of its two failure modes:
- `earns its line by carrying what the code can't` + the three examples — the **positive target**. Without it the block reads as "fewer comments" and the seat prunes the useful ones alongside the noise.
- ⚠ `Present tense, no archeology` — the largest single source of bloat and the fastest to go stale: the seat narrates the change it just made into the file, where git already holds it. Paired with the `is *why* and stays` clause, which is what stops the rule eating durable rationale — the reason a choice survives is exactly what no config confesses. This is the same rule `SKILL.md` applies to seat prompts; one vocabulary, two surfaces.
- ⚠ `Comments already in the file survive your edit` — a pruning rule reads as a licence to delete, and on brownfield that turns a hygiene block into a net loss. The bound is what the seat *writes*, never what it *finds*.
- `not for whoever prompted you` + `belongs in your return` — names the wrong audience the seat defaults to, and where that text does go.
- `Terse over grammatical` + `fragments fine` — grammar is not the bar, and a seat without this clause pays for full sentences it doesn't need.

**Tailored slots**: none. Identical on every seat carrying it, by design — `audit`'s cluster check treats any divergence as drift, same as Block E.

## Block C — the return contract

Every seat ends with exactly one of:
- a trailing **`Return:`** line — builders and specialists, or
- a **`## Output`** / **`## Handoff`** section — reviewers, planners, and the asset seats, whose return is structured rather than a path list.

The two are exhaustive and disjoint, so `grep -Lc '^Return:' agents/*.md` and `grep -lE '^## (Output|Handoff)' agents/*.md` should partition the roster — re-derive rather than trusting a count here.

Pick by seat kind, not by whichever peer you opened.

### Block C.1 — `## What you return` (the six review seats)

Required on `code-reviewer`, `architecture-reviewer`, `visual-reviewer`, `accessibility-reviewer`, `ux-auditor`. It **follows** `## Output` and never replaces it: `## Output` is the **report**, this block is the **return**, and separating them is the whole point. Three of these seats say their Output is a skill's template *verbatim* — the caps here must not read as an edit to that template, or the two-callers-one-body rule forks.

Not on the builders/specialists: their `Return:` line is already a path list, which is the shape this block exists to produce. Not on the four text-producing seats: their output **is** the deliverable a next seat consumes.

```
## What you return (the return is not the report)
Your context is your own; the lead's is the scarce one, and it pays for every word you hand back. {The Output above|The skill's Output} is the **report**. What you **return** is the routing payload extracted from it — the lead needs enough to route a fix, not enough to re-run your review.
- **A report path in your brief → write the full Output there, return the pointer.** No path named → return inline under the same caps.
- **Cap the inline {findings|failures|defects} at 10**, {ordering rule}, one line each: `SEV — <what>` · `file:line` · the fix in one clause. Past the cap, state what you dropped and where (`+7 low → <path>`) — a dropped finding that goes uncounted reads as a clean pass.
- **Never capped, always inline**: the verdict, the severity counts, and {the seat's coverage line}. Those are what the lead routes on.
- **Return no code.** Not the diff, not the offending lines, not your proposed replacement — the lead can open `file:line`. A fix is a clause, not a patch.
- **No narration.** {what this seat is tempted to narrate}, a restatement of your brief — none of it is a finding. Open on the first one.
```

**Invariant clauses** — the two marked ⚠ are what makes the block load-bearing rather than a politeness note:
- `the return is not the report` in the heading, and the report/return split in the opener — a seat that loses this collapses the two back together, which is the state this block was written to fix
- `A report path in your brief` + `return the pointer`, **with** the `No path named → return inline` fallback. The fallback is not optional: the lead may legitimately name no path, and a seat missing it either invents a location or returns nothing.
- ⚠ `Cap the inline ... at 10` + `state what you dropped and where` — the count is the half that bites, and **the drop notice is the half that keeps it honest**. A cap without a stated remainder is indistinguishable from a clean pass, which turns a context optimization into a silently weaker review.
- ⚠ `Never capped, always inline` + the verdict/counts/coverage triple — the cap must never reach the fields the lead routes on. Without this clause the seat caps its way past its own verdict.
- `Return no code` + `the lead can open ` + `` `file:line` `` — the single largest line item in a review return, and the one every seat reaches for by default
- `No narration` + `Open on the first one`

**Tailored slots**: the finding noun (`findings` / `failures` / `defects`), the **ordering rule** (severity for most; `systemic first` for `visual-reviewer`, **path order** for `ux-auditor` — its findings compound along the walk), the seat's coverage line (the `handed to visual-reviewer` line · the coverage line · *how it was checked* + *what wasn't verified* · where the dependency trace stopped · the resolved entry route), and what the seat narrates by habit. A seat may add a bullet for the payload *it specifically* over-returns — `visual-reviewer`'s screenshots-are-paths, `accessibility-reviewer`'s criterion tables, `ux-auditor`'s questions-and-gaps-as-counts. Additions are fine, deletions are drift.

**Two documented exceptions to the caps**, both recorded rather than inferred:
- `architecture-reviewer` **design mode returns its interface spec in full** — the spec is not a finding list, it's what a builder implements, and capping it breaks the build it was dispatched to unblock. Signatures are that mode's exception to *return no code*. Review mode caps normally.
- `ux-auditor`'s **path map goes to the report, not the return** — it's the artifact that makes findings checkable, so it stays written in full, but the lead routes off defects. Its header (resolved entry route, step count, unfollowed branches) returns; the map doesn't.

**The lead's half.** A seat can only write the long half somewhere if the lead names where — `lead` SKILL.md Step 4 puts `report: ${TMPDIR:-/tmp}/team-justin-review/<project-slug>/<seat>-<slice-slug>.md` in every review brief. That location is **deliberately ephemeral and outside the plan store**: a review is per-run and has none of the four lifetimes `TRACKER.md` defines, so nothing durable may point at it. What survives is the routed fix list and any `issues/<kebab-slug>.md` capture — never the report file.

## Block D — `## Test-first (shared skill)`

Required on every seat that implements **executable behavior with a specifiable contract** (9 seats: the three framework builders, `cloudflare-builder`, both data architects, `better-auth-specialist`, `stripe-specialist`, `web-components-builder`).

**Exempt by decision** — record the reason, don't just omit:
- `react-ui-builder`, `svelte-ui-builder` — you can't go red on a layout or a motion curve; their gate is the user's visual-intent inspection. Logic-dense component internals (a reducer, validation rules) route to `test-writer` after the build.
- `web-components-builder` is the **partial**, and it's in rather than out: its element's public API (attribute→property reflection and the pre-upgrade path, emitted events and their `detail`, `ElementInternals` form value/validity, idempotent connect/disconnect) is a specifiable contract other people's pages depend on, and every one of its failures is invisible on screen — so Block D applies to it in full. What it *renders* is covered by the block's existing screen exemption, which the lead names in the brief; it needs no fourth case.
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

## Block F — `## Scope — build the real path, not every path`

Required on every seat that **writes app code** (12 seats: the three framework builders, `cloudflare-builder`, `sanity-builder`, both data architects, `better-auth-specialist`, `stripe-specialist`, the three UI component builders). Reviewers, config seats and the four text-producing seats don't build, so there is no breadth to bound.

```
## Scope — build the real path, not every path
Pareto: traffic that exists gets built well; traffic that doesn't gets no branch. {four examples of what the seat therefore doesn't build}. Code that never executes is never known to work — it reads as coverage while being the least trustworthy code in the file.

This bounds **breadth, never rigor**{, and where the bound bites hardest on this seat: the seat's hard-rigor clause}. The paths you do build handle their real failures — an error a user can hit, a null the query can return, a request that can arrive twice. Cutting one of those is a bug, not restraint. Genuinely unsure a path carries traffic? Name it in your return and let the lead call it — don't build it speculatively, and don't silently drop it.
```

**Invariant clauses** — the two marked ⚠ are what stop the block being read as a licence to cut:
- `Pareto:` as the opener — the leading word the whole block hangs on
- `Code that never executes is never known to work` + the least-trustworthy-code clause
- ⚠ `This bounds **breadth, never rigor**` — without it a seat prunes error handling under a scope heading, which is the exact inversion this block causes when shortened
- ⚠ `Name it in your return and let the lead call it` + `don't silently drop it` — the escape hatch, and the half that keeps an unsure call from becoming a silent omission. A block with the bound and no escape hatch makes the seat decide alone.

**Tailored slots**: the four examples; the **hard-rigor clause** naming what is never marginal on this seat (`## Money rules (non-negotiable)` · `## Security (non-negotiable)` · `a constraint is not a marginal case` + `SQLITE_BUSY` · at-least-once delivery at the edge · the plan's named states on the UI builders). The data architects also swap the second sentence's closer for `an unused index is worse than dead code, since it's paid for on every write`.

## Block G — `## Build and return — no self-dispatch`

Required on the seats whose output **renders** (8 seats: the three framework builders, the three UI component builders, `cloudflare-builder`, `sanity-builder`) — the ones tempted to boot the app and look.

```
## Build and return — no self-dispatch
- Never spawn agents: no self-dispatched reviewers (visual/a11y/code), no delegated sub-builds. You build and return; dispatch and review routing is the lead's alone.
- Verify with the toolchain, not the app: {the seat's checks}. Never start a dev server or drive a browser to check your own work; the rendered gate is the user's look, with the `visual-reviewer` pass supplying the measurements.
```

**Exempt by decision** — record the reason, don't just omit:
- `vercel-perf-optimizer` — measuring a running app **is** the job; `## Prove the win` is its version of this rule.
- `toolchain-engineer`, `vercel-platform-engineer` — config; nothing renders to be tempted by.
- the data/auth/billing specialists — no rendered surface, and their gate is the suite (Block D).
- reviewers and the four text-producing seats — they don't build.

**Invariant clauses:**
- ⚠ the never-boot clause — `drive a browser` is the string to grep (all 8 carry it; the surrounding wording is `Never start a dev server or drive a browser to check your own work` on five and `Never boot the app, start a dev server, or drive a browser` on the three UI builders). This is the load-bearing half: a seat that boots the app burns the run and still can't judge the render. The bullet's *opener* is a tailored slot, so grep this clause, never the opener.
- `the rendered gate is the user's look` — names who *does* judge it, so the ban has a positive target.
- the no-spawn bullet is cheap insurance rather than a live risk (a subagent can't spawn subagents), so it may be one line — but it stays paired with `dispatch and review routing is the lead's alone`.

**Tailored slots**: the **opener** — `Verify with the toolchain, not the app:` on the seats that have one (the framework builders, `cloudflare-builder`, `sanity-builder`), `Self-check in isolation:` on the two UI component builders, whose toolchain can't render what they wrote either — and the seat's checks (`autofixer, typecheck/build, existing tests` · `typecheck/lint` · `wrangler deploy --dry-run` + `wrangler types` · TypeGen + typecheck).

## Block H — `## Match the repo`

Required on the seats that write app code **into an existing tree** (8 seats: the three framework builders, the three UI component builders, `sanity-builder`, `vercel-perf-optimizer`). The specialists that own a whole layer (data, auth, billing, platform, toolchain) carry their own brownfield rule instead — `toolchain-engineer`'s "match the repo's actual package manager" is that rule, and converging it onto this block would lose the package-manager specifics.

```
## Match the repo
Read `package.json` and {the seat's peer artifacts — existing routes / components / schema types / the hot path} first; follow the codebase's conventions ({its convention axes}) over your defaults. Minimal diff. Check `package.json` before importing anything — output the install command if a dep is missing, never assume it exists.
```

**Invariant clauses:**
- `follow the codebase's conventions` + `over your defaults` — the whole point; a seat that keeps this as "follow conventions" alone loses the tie-break rule
- ⚠ `Check `package.json` before importing anything — output the install command` — it lives **inside this block** on every seat, never under a heading of its own and never in the quality floor. One home, or it goes missing from whichever seat is written next.

**Tailored slots**: the peer artifacts and the convention axes only.

## Block J — the contrast clause

Required on every seat that could otherwise reach for a ratio: the three **UI component builders**, `ux-designer`, `accessibility-reviewer`, `visual-reviewer`. It rides inside whatever sentence already tells the seat where a value comes from, rather than as a bullet of its own.

```
contrast is the design's and ships as authored — no seat on this team computes a ratio
```

**Invariant clauses:**
- ⚠ `contrast is the design's` — the **positive** half, and it has to come first. Left as a bare prohibition the clause reads as a gap in the practice, and a seat helpfully fills a gap; stated as ownership it reads as a decision already taken, which is what it is.
- ⚠ `ships as authored` — this is what stops the softer failure: a seat that doesn't compute a ratio but still flags a pair as "worth checking," which routes a design decision back to the user as a defect.
- `no seat on this team computes a ratio` — team-wide, not seat-local. Scoped to the seat, each one assumes some *other* seat has it covered, and the criterion silently comes back.

**The pair carve-out — a permitted companion, never an edit to the clause.** The clause bans *deciding* a pair; it does not ban holding one together. Where the design authored a surface and its ink as one decision, a fill token spent as a text colour is a **conformance** finding — cited by token name against the system's own ledger, never by a ratio the seat worked out. The three UI builders carry it as a following sentence (*transcribing a pair includes keeping it a pair*), `ux-designer` as a clause on its critique bullet. The screen seats — `accessibility-reviewer`, `visual-reviewer` — carry **no** carve-out: for them the ban is total, because a finding they file reads as an a11y verdict whatever it cites. Recording measured ratios in a token ledger is likewise not covered by this block: that is the system documenting decisions already taken (`skills/lead/references/ui-practice.md` → *Contrast*).

**Tailored slots**: the host sentence. `accessibility-reviewer` and the `/accessibility-review` skill additionally name **1.4.3 / 1.4.11 as unassessed** in their output, so a clean run is never read as a full-AA claim — that naming is theirs alone and is not part of this block.

## Block E — the token-vocabulary bullet

Required on the three **UI component builders** (`react-ui-builder`, `svelte-ui-builder`, `web-components-builder`) — the seats that write style values. It sits inside `## Follow the plan exactly`, under the closed-set and named-gap bullets it depends on.

**Not on the framework builders.** They mount components and write no style values, so the vocabulary is nothing they can get wrong. The **conformance gate** the builder sets up in Phase 0 is what enforces it afterwards — structural in the build where the stack allows, plus a test in the repo, and never a seat.

```
- **The token vocabulary is shadcn's semantic set** — the naming convention only: no shadcn or Tailwind dependency is implied. Read the names off the project's token file, which is the only authority — it was transcribed from what Claude Design settled, and no seat here extends it. **How a value was derived is the system's business, not yours** — a hover step may be a named `--primary-hover`, an alpha step like `bg-primary/90`, or a `color-mix()`; use whichever the file has, and return a named gap when it has none. One trap, and it arrives by pasting shadcn's own component code rather than by inventing anything: `--accent` is the **hover/selected surface**, not the brand accent (that's `--primary`) — read backwards it puts brand hue on every resting row.
```

**Invariant clauses:**
- `the naming convention only` + the no-dependency clause — without it a seat installs shadcn or reaches for Tailwind because the names implied a stack. The names are a vocabulary, not a package.
- ⚠ `Read the names off the project's token file, which is the only authority` — this is what keeps the block from becoming a **stale cache** of a list that lives in the repo being built. Enumerating the ~30 names here instead is drift: the seat opens that file anyway, and a copy goes wrong the first time the contract grows.
- ⚠ `How a value was derived is the system's business, not yours` — the team conforms to the system it was given and holds no opinion on the CSS behind it. Without this clause a seat re-derives a state step it dislikes, which is a design decision taken from Claude Design at the last possible moment, in a file nobody reviews as design.
- ⚠ the `--accent` trap. It is the block's reason to exist — the part **no token file confesses**, because it's a plausible-looking line imported from shadcn's published components rather than a value the seat invented. Read backwards it tints every resting row, and it is expensive to unpick later.

**Tailored slots**: none. The bullet is identical on all three seats by design — `audit`'s cluster check (step 6) treats any divergence between them as drift. `web-components-builder` carries **one added bullet after it**, never an edit to it: inside a shadow root distributed beyond the app the token names take a prefix, because custom properties inherit across the boundary and a generic `--primary` on a host page the team doesn't own bleeds in. An addition is fine; changing the block's own text is drift.
