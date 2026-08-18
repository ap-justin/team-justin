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
- **The design system is designed in `claude-design` and formalized in the repo (greenfield)** — `ux-designer`'s user flow → a **direction brief** from `design-director` (brand and feel, the dials, the element vocabulary, the hard floors — and explicitly *not* palette, type, layout or the signature) → **the user carries it to `claude-design`**, settles the look there, and brings it back → the director **formalizes** it into a token spec + coverage manifest → the UI builder's **Phase 0**: the real token file in the app's own style layer, plus a static `design/gallery/` (plain HTML+CSS, opens from disk, imports those same tokens) → feature builds. The design is made where design is good; the *system* lives in the repo, so contributors read it in the diff and a change to it is a token edit. `design-director` coverage-checks the gallery against its manifest alongside the gallery's review passes — coverage only, never direction, and no second design gate — and keeps a shipped ledger afterwards. The gallery is scaffolding with a scheduled death: it retires per-element into an in-app `/_design` route mounting the **real** components as they land, so it can't drift, and the token file never moves.
- **Brownfield has no design hop** — a feature in an existing repo routes `ux-designer` (flow, states, copy) → the builder, which follows the repo's `## Design system` pointer. `design-director` only comes back for a builder's **named gap**, an audit/extend request, or the ledger.
- **One token vocabulary, everywhere** — shadcn's semantic set (`--background`/`--foreground`, `--primary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, `--radius`, …) as plain custom properties: the naming convention only, no shadcn or Tailwind dependency. Restrictive on purpose — a closed vocabulary is what makes *"is this value in the system"* a grep, which is what `/taste-review` runs. **The vocabulary is fixed; the values and the technique behind them are not** — whether a hover step is a named solid, an alpha step, or a `color-mix()` is the design system's call, and the team conforms to it rather than holding an opinion about the CSS. A repo *actually* on shadcn is the same story from the other end: the installed theme **is** the system, and the vendored `shadcn` skill is the playbook.
- **Conformance is prevented, not detected** — whether a build honors its design is a judgment a person makes in a glance and an agent can't make at all, so nothing tries to. The token file is a **closed set**: builders write no value that isn't in it and return a **named gap** instead of inventing one; the handoff names what's available; `taste-reviewer` greps statically for values outside the system; `accessibility-reviewer` supplies WCAG criteria and every measured target size — contrast is **settled** on the token pairs by `design-director` and audited by no seat; `visual-reviewer` supplies **coverage and cause** — the states and widths nobody renders (empty, error, loading, disabled, focus-visible, 375, the content extremes), and the `file:line` behind a defect you spotted in a second. That split is the point: you have already looked at the happy path and win at *does this look right*, so the browser is pointed at where you never look and at the hour of tracing you'd otherwise do — not at re-judging your glance, and not at tabling numbers another seat owns. All three are lead-dispatchable seats **and** user-invocable slash passes off one shared body — but none of them returns a verdict on intent. The verdict stays the user's.
- **Test-first, minus one exemption** — the nine behavior seats build red-green, with four named exemptions. Only one is about speed: a slice whose deliverable is a screen, where the user's eye is the only oracle. Where the eye can't tell — end-to-end seam code above all — there's no exemption, and "it's early" isn't a reason.
