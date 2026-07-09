# Roster — v0.6.0

The lead is the `engineering-team` skill (runs in the main thread). It delegates to the specialists below and to built-in agents (`Explore`, `Plan`) and skills (`/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`). Every specialist follows **official sources first** (`SOURCES.md`).

## Current specialists (`agents/`)
| Agent | Role | Backing source |
|---|---|---|
| `design-director` | Design system + direction (plan, no code) | `frontend-design:frontend-design`, `design-taste-frontend` skills |
| `graphic-designer` | Generates/enhances web-ready image assets from the plan | `scripts/gen-asset.ts` (`@google/genai`) + Context7 |
| `sveltekit-builder` | Fullstack Svelte 5 / SvelteKit | Svelte MCP + `svelte:*` skills (official AI surface) |
| `react-router-builder` | React Router (framework/data/declarative/RSC) | vendored official `react-router` skill → installed docs → Context7 |
| `nextjs-builder` | Fullstack Next.js App Router | `vercel:nextjs` + `vercel:*` skills + Vercel MCP → Context7 |
| `sanity-builder` | Sanity content model, GROQ, TypeGen, integration | `sanity:*` skills + Sanity MCP |
| `vercel-perf-optimizer` | Web perf: CWV, caching, rendering, bundle (post-build) | `vercel:performance-optimizer` + `vercel:*` skills + Vercel MCP |
| `postgres-architect` | Schema, migrations, typed query surface | Context7 |
| `taste-reviewer` | Adversarial anti-slop design review | `design-taste-frontend` skill |
| `code-reviewer` | Adversarial correctness/quality review | Context7 per stack |
| `architecture-reviewer` | Structural integrity: seams, interface depth, coupling (design-time + review-time) | `codebase-design` skill |

## Model tiers
Agents inherit the session model unless pinned via a `model:` frontmatter field. Policy — spend on correctness (lead, implementers, code review), economize where the work is pattern-matching.

| Agent(s) | `model:` | Why |
|---|---|---|
| `engineering-team` lead | inherit (main thread) | routes/integrates/verifies; Opus 4.8 suffices. Not settable via frontmatter |
| `design-director`, `graphic-designer`, all `*-builder`, `postgres-architect`, `vercel-perf-optimizer` | inherit (→ opus) | code correctness + design judgment; Opus 4.8 is the coding tier. `graphic-designer` needs opus-level prompt craft + slop curation |
| `code-reviewer` | **opus** (pinned) | adversarial bug-finding stays strong even if the session drops to a cheaper model |
| `architecture-reviewer` | **opus** (pinned) | seam/coupling judgment is the hardest review; keep it on the top tier regardless of session model |
| `taste-reviewer` | **sonnet** (pinned) | anti-slop review is pattern-matching; cheaper tier is enough |

Fable 5 is the premium tier ($10/$50) — reserve for long autonomous multi-file runs, not routing or routine builds. Drop implementers to `sonnet` only for cost/volume-sensitive work.

## Reused, not owned
Built-ins: `Explore` (codebase mapping), `Plan` (architecture).
Skills: `/grilling` (stress-test the brief before planning, PM judgment), `/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`.
Vendored official skill: `react-router` (see `SOURCES.md` → Vendored resources). Optional official subagent: `svelte:svelte-file-editor`.

## Planned (add as the team matures)
- `astro-builder` — content-heavy sites. Backing: Context7 (`astro`). Mint when Astro work recurs.
- **Video generation** (Veo) for `graphic-designer` — hero loops, motion accents. Backing: extend `scripts/gen-asset.ts` with a Veo path. Add when a project needs motion; expect mp4 + poster-frame + web-encode handling.

## Growing the team
Adding a specialist is a versioned change:
1. Write `agents/<name>.md` — single responsibility, official-source-first, quality floor. Copy the shape of an existing specialist.
2. Wire it to its official source: add a row to `SOURCES.md`.
3. Add a row here in **Current specialists**, and to the routing table in the `engineering-team` skill.
4. Bump `CHANGELOG.md` and `VERSION` (minor bump for a new agent).
5. `git add -A && git commit && git tag vX.Y.Z`.

Versioning: semver-ish. New agent or capability → **minor**. Prompt tweaks/fixes → **patch**. Breaking reorg of the orchestration contract → **major**.
