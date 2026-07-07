# claude-eng-team

A versioned engineering team for Claude Code. A main-thread lead (the `engineering-team` skill) scopes work, detects the stack, routes to the right specialist subagent, and drives it to done — either building a project from scratch or contributing to an existing codebase.

## Layout
- `skills/engineering-team/SKILL.md` — the lead / PM (orchestrator).
- `agents/*.md` — specialist subagents.
- `SOURCES.md` — official MCP/skill/plugin each stack must use (official sources first).
- `ROSTER.md` — current + planned agents, and how to grow the team.
- `CHANGELOG.md` / `VERSION` — release history.

## Install (symlink into Claude Code)
Claude Code reads `~/.claude/agents/*.md` and `~/.claude/skills/*/SKILL.md`. This repo is symlinked in:
```
~/.claude/agents                    -> ~/projects/claude-eng-team/agents
~/.claude/skills/engineering-team   -> ~/projects/claude-eng-team/skills/engineering-team
~/.claude/skills/react-router       -> ~/projects/claude-eng-team/skills/react-router   # vendored official skill
```
Edit here, version in git; Claude Code picks up changes on the next session.

## Use
- From scratch: "build a landing page for X" / "new SvelteKit app that…"
- Contribute: from inside a repo, "add feature Y" / "fix Z" — the lead maps the codebase and routes to the matching specialist.
- Or invoke explicitly: `/engineering-team <task>`.

## Principles
- **Official sources first** — no agent answers framework/API specifics from training data; it resolves via the official MCP/skill/plugin in `SOURCES.md`.
- **Single-responsibility agents** — each does one job well.
- **Reuse built-ins** — `Explore`, `Plan`, `/code-review`, `/tdd`, `/verify` instead of reinventing them.
- **Minimal diff in brownfield** — match the target repo's conventions, never impose the team's defaults.
