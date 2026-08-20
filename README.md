# team-justin

A versioned engineering team for Claude Code. A main-thread lead (the `lead` skill, `/team-justin:lead`) scopes work, detects the stack, routes to the right specialist subagent, and drives it to done — either building a project from scratch or contributing to an existing codebase.

## Requirements
- **Claude Code ≥ 2.1.220.** Not enforceable in `plugin.json` (no engine/min-version field exists) — older CLIs may silently ignore newer frontmatter fields rather than erroring.
- **Model access to `claude-opus-5` and `claude-sonnet-5`.** Every agent pins an explicit model ID rather than the floating `opus`/`sonnet` aliases, so behavior is reproducible across installs. If your plan or provider (Bedrock/Vertex/Foundry) doesn't expose those IDs, swap the `model:` line in `agents/*.md` back to the alias.

## Layout
- `skills/lead/SKILL.md` — the lead / orchestrator; invokes as `/team-justin:lead` (add the `brief` verb to grill a change and persist its brief). **You are the PM** — the team has no roadmap or prioritization function.
- `agents/*.md` — specialist subagents.
- `TRACKER.md` — the user-level plan store: the change's `brief.md` (incl. commit/PR cadence), `planner`'s tickets, captured `IDEAS.md` lines, one file per known defect under `issues/`, and freeform brainstorming under `notes/`. Nothing of it is written into the working repo.
- `SOURCES.md` — official MCP/skill/plugin each stack must use (official sources first).
- `ROSTER.md` — current + planned agents, and how to grow the team.
- `VERSION` — current release. History is git: `git log` / `git tag`.

## Install (as a Claude Code plugin)
This repo is a self-contained Claude Code **plugin** (`team-justin`, `.claude-plugin/plugin.json`) served by its own single-plugin **marketplace** (`.claude-plugin/marketplace.json`, name `team-justin`). Installing as a plugin — rather than symlinking into `~/.claude` — is what makes it work identically **locally and in Claude Code on the web**, because plugin content resolves `${CLAUDE_PLUGIN_ROOT}` (the install dir) in both, whereas the web VM never sees your machine's `~/.claude`.

**Most users — install from the marketplace:**
```
/plugin marketplace add ap-justin/team-justin
/plugin install team-justin@team-justin
```
**Contributors** (editing the plugin itself — no install, picks up edits live): clone the repo and point Claude at your clone:
```
git clone https://github.com/ap-justin/team-justin
claude --plugin-dir ./team-justin     # /reload-plugins after edits
```
**Claude Code on the web** — commit this to the `.claude/settings.json` of *each* repo you want the team in; the web session prompts once to install:
```json
{
  "extraKnownMarketplaces": {
    "team-justin": { "source": { "source": "github", "repo": "ap-justin/team-justin" } }
  },
  "enabledPlugins": { "team-justin@team-justin": true }
}
```
Skills/agents load namespaced as `team-justin:*` (e.g. the lead is `/team-justin:lead`). Edit here, version in git.

> Migrating from the old symlink setup? Remove the `~/.claude/agents` and `~/.claude/skills/*` symlinks that point here (they'd shadow the plugin copies with un-namespaced duplicates), then use one of the installs above.

## Use
- From scratch: "build a landing page for X" / "new SvelteKit app that…"
- Contribute: from inside a repo, "add feature Y" / "fix Z" — the lead maps the codebase and routes to the matching specialist.
- Or invoke explicitly: `/team-justin:lead <task>`.
- Plan it first: `/team-justin:lead brief <subject>` — the lead grills you to the studs, then writes a change-shaped brief (what lands, blast radius, **cadence** — commits are the steps; a PR split means an environment boundary or a partial ship — decisions, non-goals, done-when) to the plan store. A bare `lead <task>` still grills when the work warrants it; only `brief` persists. (`lead plan` still works — same verb.)
- Want it, but not now: `/team-justin:todo <the thing>` — logs it to the plan store's `IDEAS.md`. Run mid-session it expands the line from context already loaded (the `file:line` you were just in, why it's deferred); run cold it logs your sentence and nothing else. Never fetches to enrich it, never triages; the next `brief` grill reads it back and you decide whether it's in scope.
- Record a bug: `/team-justin:issue <what's wrong>` — opens a defect file in the plan store's `issues/` from what you just said. No investigation, no fix; the fields it didn't look into say `_not investigated_` so the stub can't pass for a finished write-up.
- `todo` and `issue` are their own skills, so you type them directly and the lead never loads. Both are user-invoked by design: the agent can't fire them, which is what keeps a deferred want from becoming work you didn't ask for.

## Principles
- **Official sources first** — no agent answers framework/API specifics from training data; it resolves via the official MCP/skill/plugin in `SOURCES.md`.
- **Single-responsibility agents** — each does one job well.
- **Reuse built-ins** — `Explore`, `Plan`, `/code-review`, `/tdd`, `/verify` instead of reinventing them.
- **Minimal diff in brownfield** — match the target repo's conventions, never impose the team's defaults.
- **The design is made in Claude Design; the repo owns the system** — `ux-designer`'s user flow + the **conventions corpus** (the constraints the design agent works inside, *not* palette, type, layout or the signature) → **the user carries both to Claude Design**, settles the look there, and brings it back → the UI builder's **Phase 0**: the real token file in the app's own style layer, and **the conformance gate that closes it** → the first components → `/design-sync` pushes those components, and from there screens are designed out of the real parts. The design is made where design is good; the *system* lives in the repo, so contributors read it in the diff and a change to it is a token edit. **The repo is upstream, in every direction** — it is where the system is authored, and the design project is rebuilt from it rather than merged into it (a resync that produces deletes is the practice working). Once a system exists, the conventions file **turns over**: it stops being pre-look constraints and becomes the briefing on the shipped system — the closed token set, the real class names, the fill-vs-ink pairs, and what the bundle's compiled stylesheet can't show. Claude Design decides the look; every other seat works on the material and the gates. The whole practice, including what the design agent can and can't see: `skills/lead/references/ui-practice.md`.
- **The design is authoritative** — a value that came back ships as authored, contrast included. No seat re-derives one, overrides one, or checks one against a preference. A pair the design authored together stays together, though: a fill token spent as a text colour is a **conformance** finding, and recording which pairs read as text (ratios included) is the system's ledger doing its job, not a seat computing a verdict. **This practice is React**, because the sync converter takes React; other stacks get the token file and its gate and stop there.
- **Brownfield has no design hop** — a feature in an existing repo routes `ux-designer` (flow, states, copy) → the builder, which follows the repo's `## Design system` pointer, or finds the token file and adds the missing pointer when the repo never wrote one. A builder's **named gap** goes to the user with the token name it would need; no seat on this team extends the system.
- **One token vocabulary, everywhere** — shadcn's semantic set (`--background`/`--foreground`, `--primary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, `--radius`, …) as plain custom properties: the naming convention only, no shadcn or Tailwind dependency. Restrictive on purpose — a closed vocabulary is what makes *"is this value in the system"* a grep, which is what the repo's own conformance gate runs at every commit. **The vocabulary is fixed; the values and the technique behind them are not** — whether a hover step is a named solid, an alpha step, or a `color-mix()` is the design system's call, and the team conforms to it rather than holding an opinion about the CSS. A repo *actually* on shadcn is the same story from the other end: the installed theme **is** the system, and the vendored `shadcn` skill is the playbook.
- **Conformance is prevented, then tested — never reviewed** — whether a build honors its design is a judgment a person makes in a glance and an agent can't make at all, so nothing tries to. The token file is a **closed set**: builders write no value that isn't in it and return a **named gap** instead of inventing one, and the handoff names what's available. What catches the rest is not a review pass but **the repo's own gate**, set up by the builder in Phase 0 — structural first, where the build itself makes an off-system value have no rule at all (a theme that zeroes the default palette leaves `gray-500` matching nothing), then a test in the suite for the rest: values (every length, colour, duration resolves to the token file) and names (every class a component writes is one the sheets actually draw — the one nothing else catches, since not existing *is* the failure mode). A gate runs in no context window and can't be skipped because the batch was busy. What's left for the two screen seats is what a test can't see: `accessibility-reviewer` supplies structural WCAG criteria and every measured target size — **contrast is the design's and audited by no seat, here or anywhere on this team**; `visual-reviewer` supplies **coverage and cause** — the states and widths nobody renders (empty, error, loading, disabled, focus-visible, 375, the content extremes), and the `file:line` behind a defect you spotted in a second. That split is the point: you have already looked at the happy path and win at *does this look right*, so the browser is pointed at where you never look and at the hour of tracing you'd otherwise do — not at re-judging your glance, and not at tabling numbers another seat owns. Both are lead-dispatchable seats **and** user-invocable slash passes off one shared body — but neither returns a verdict on intent. The verdict stays the user's.
