# engineering

A versioned engineering team for Claude Code. A main-thread lead (the `team` skill, `/engineering:team`) scopes work, detects the stack, routes to the right specialist subagent, and drives it to done — either building a project from scratch or contributing to an existing codebase.

## Layout
- `skills/team/SKILL.md` — the lead / PM (orchestrator); invokes as `/engineering:team`.
- `agents/*.md` — specialist subagents.
- `SOURCES.md` — official MCP/skill/plugin each stack must use (official sources first).
- `ROSTER.md` — current + planned agents, and how to grow the team.
- `CHANGELOG.md` / `VERSION` — release history.

## Install (as a Claude Code plugin)
This repo is a self-contained Claude Code **plugin** (`engineering`, `.claude-plugin/plugin.json`) served by its own single-plugin **marketplace** (`.claude-plugin/marketplace.json`, name `engineering`). Installing as a plugin — rather than symlinking into `~/.claude` — is what makes it work identically **locally and in Claude Code on the web**, because plugin content resolves `${CLAUDE_PLUGIN_ROOT}` (the install dir) in both, whereas the web VM never sees your machine's `~/.claude`.

**Most users — install from the marketplace:**
```
/plugin marketplace add ap-justin/engineering
/plugin install engineering@engineering
```
**Contributors** (editing the plugin itself — no install, picks up edits live): clone the repo and point Claude at your clone:
```
git clone https://github.com/ap-justin/engineering
claude --plugin-dir ./engineering     # /reload-plugins after edits
```
**Claude Code on the web** — commit this to the `.claude/settings.json` of *each* repo you want the team in; the web session prompts once to install:
```json
{
  "extraKnownMarketplaces": {
    "engineering": { "source": { "source": "github", "repo": "ap-justin/engineering" } }
  },
  "enabledPlugins": { "engineering@engineering": true }
}
```
Skills/agents load namespaced as `engineering:*` (e.g. the lead is `/engineering:team`). Edit here, version in git.

> Migrating from the old symlink setup? Remove the `~/.claude/agents` and `~/.claude/skills/*` symlinks that point here (they'd shadow the plugin copies with un-namespaced duplicates), then use one of the installs above.

## Use
- From scratch: "build a landing page for X" / "new SvelteKit app that…"
- Contribute: from inside a repo, "add feature Y" / "fix Z" — the lead maps the codebase and routes to the matching specialist.
- Or invoke explicitly: `/engineering:team <task>`.

## Principles
- **Official sources first** — no agent answers framework/API specifics from training data; it resolves via the official MCP/skill/plugin in `SOURCES.md`.
- **Single-responsibility agents** — each does one job well.
- **Reuse built-ins** — `Explore`, `Plan`, `/code-review`, `/tdd`, `/verify` instead of reinventing them.
- **Minimal diff in brownfield** — match the target repo's conventions, never impose the team's defaults.
