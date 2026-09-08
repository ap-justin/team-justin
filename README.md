# team-justin

An engineering team for Claude Code, as a plugin. Run `/team-justin:setup` once in a repo, then ask for the work; the lead routes it to the right specialist and drives it to done.

## Install
```
/plugin marketplace add ap-justin/team-justin
/plugin install team-justin@team-justin
```
Claude Code on the web: commit this to the repo's `.claude/settings.json`; the web session prompts once to install:
```json
{
  "extraKnownMarketplaces": {
    "team-justin": { "source": { "source": "github", "repo": "ap-justin/team-justin" } }
  },
  "enabledPlugins": { "team-justin@team-justin": true }
}
```

## Requirements
- **Claude Code 2.1.248 or newer.** An older CLI runs the seats but silently drops the newer settings they carry.
- **The `chrome-devtools` MCP server**, for `/visual-review` and `/accessibility-review` only; without it they audit from source and say so.
  ```
  claude mcp add chrome-devtools --scope user -- npx chrome-devtools-mcp@latest --headless=true --screenshotFormat=webp --screenshotMaxWidth=1440
  ```
- **`jq`**, for the hooks; they fail open without it.
- **Model access to `claude-opus-5` and `claude-sonnet-5`.**

## Commands
Everything is namespaced `team-justin:`. These are the skills only you can invoke; the seats load their own.

**Start**
- `/team-justin:setup`: set the team up in this repo. Once per repo, again when the repo or the plugin moves. On a blank repo it grills the subject and stack with you first.
- Then ask: "add feature Y", "fix Z", "build a landing page for X". Or `/team-justin:lead <task>`.

**Plan**
- `/team-justin:brief <subject>`: grill a change and keep the record before building.
- `/team-justin:to-spec`, `/team-justin:to-tickets`, `/team-justin:wayfinder`: turn a conversation into a spec, tracer-bullet tickets, or a map for work bigger than one session.

**Backlog**
- `/team-justin:todo <the thing>`, `/team-justin:issue <what's wrong>`: log a want or a defect for later.
- `/team-justin:todos`, `/team-justin:issues`: work the backlog; each entry landed is deleted.

**Review on demand**
- `/team-justin:visual-review`, `/team-justin:accessibility-review`: the rendered UI in a live browser.
- `/team-justin:seo-review`, `/team-justin:review-animations`, `/team-justin:improve-animations`, `/team-justin:design-gallery`.

**Change hygiene**
- `/team-justin:landed`: after the PR merges, sync back onto the base branch.
- `/team-justin:comment-fix`, `/team-justin:prose-fix`, `/team-justin:doc-fix` `[<path> | <branch> | <pr>]`: fix comments, rendered copy, or doc prose in place.

## Roster
The lead routes to these; you can also spawn one directly by name.

**Build**: `sveltekit-builder`, `react-router-builder`, `nextjs-builder`, `tanstack-start-builder` (the network boundary of each framework); `go-fullstack-builder` (Go-served React app); `python-developer`; `react-ui-builder`, `svelte-ui-builder`, `web-components-builder` (components); `cloudflare-builder` (Workers, D1); `sanity-builder` (CMS).

**Data, auth, money**: `postgres-architect`, `sqlite-architect`, `better-auth-specialist`, `stripe-specialist`.

**Platform**: `vercel-platform-engineer`, `vercel-perf-optimizer`, `fly-platform-engineer`, `toolchain-engineer` (pnpm, Turborepo, Biome).

**Design**: `ux-designer` (flows, IA, copy), `ui-designer` (the design canvas and the coverage ledger), `graphic-designer` (images, video, generative art).

**Review**: `code-reviewer`, `architecture-reviewer`, `visual-reviewer`, `accessibility-reviewer`, `ux-auditor`, `test-writer`.

**Process**: `planner` (the plan of record past one session).

Roles in full: `ROSTER.md`.
