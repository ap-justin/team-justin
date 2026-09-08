# team-justin

An engineering team for Claude Code, as a plugin.

## Install
```
/plugin marketplace add ap-justin/team-justin
/plugin install team-justin@team-justin
```
Claude Code on the web: commit this to the repo's `.claude/settings.json`:
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
- **The `chrome-devtools` MCP server**, for the visual and accessibility reviewers only; without it they audit from source.
  ```
  claude mcp add chrome-devtools --scope user -- npx chrome-devtools-mcp@latest --headless=true --screenshotFormat=webp --screenshotMaxWidth=1440
  ```
- **`jq`**, for the hooks; they fail open without it.
- **Model access to `claude-opus-5` and `claude-sonnet-5`.**

## Commands
**Getting started**
- `/team-justin:setup`: set the team up in this repo. Once per repo, again when the repo or the plugin moves.
- Then ask: "add feature Y", "fix Z", "build a landing page for X". Or `/team-justin:lead <task>`.

**Coding sessions**
- `/team-justin:brief <subject>`: grill a change and keep the record before building.
- `/team-justin:todo <the thing>`, `/team-justin:issue <what's wrong>`: park a want or a defect without breaking the session.
- `/team-justin:landed`: after the PR merges, sync back onto the base branch.
- `/team-justin:comment-fix`, `/team-justin:prose-fix`, `/team-justin:doc-fix` `[<path> | <branch> | <pr>]`: fix comments, rendered copy, or doc prose in place.

**Backlog and tech debt**
- `/team-justin:todos`, `/team-justin:issues`: work the backlog; each entry landed is deleted.
- `/team-justin:design-system audit`: audit the design system.
- `/team-justin:seo-review`, `/team-justin:review-animations`, `/team-justin:improve-animations`, `/team-justin:design-gallery`: audits on shipped pages.

## Stack
- **UI**: React, Svelte 5, Web Components.
- **Framework**: React Router 7, Next.js App Router, TanStack Start, SvelteKit, Go-served React, Python.
- **Data**: Postgres, SQLite, Sanity.
- **Auth and payments**: Better Auth, Stripe.
- **Platform**: Vercel, Cloudflare, Fly.io.
- **Tooling**: pnpm, Turborepo, Biome.

Design runs upstream of every build (flows, the canvas, assets) and review after it (correctness, structure, rendered UI, accessibility, UX). The seats behind each layer, and how to spawn one directly: `ROSTER.md`.
