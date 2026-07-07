# Roster — v0.2.1

The lead is the `engineering-team` skill (runs in the main thread). It delegates to the specialists below and to built-in agents (`Explore`, `Plan`) and skills (`/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`). Every specialist follows **official sources first** (`SOURCES.md`).

## Current specialists (`agents/`)
| Agent | Role | Backing source |
|---|---|---|
| `design-director` | Design system + direction (plan, no code) | `frontend-design:frontend-design`, `design-taste-frontend` skills |
| `sveltekit-builder` | Fullstack Svelte 5 / SvelteKit | Svelte MCP |
| `react-router-builder` | React Router 7 (framework mode) | Context7 (react-router v7) |
| `postgres-architect` | Schema, migrations, typed query surface | Context7 |
| `taste-reviewer` | Adversarial anti-slop design review | `design-taste-frontend` skill |
| `code-reviewer` | Adversarial correctness/quality review | Context7 per stack |

## Reused, not owned
Built-ins: `Explore` (codebase mapping), `Plan` (architecture).
Skills: `/grilling` (stress-test the brief before planning, PM judgment), `/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`.

## Planned (add as the team matures)
- `astro-builder` — content-heavy sites. Backing: Context7 (`astro`). Mint when Astro work recurs.
- `graphic-designer` — asset generation (hero art, textures, logos, OG images). Backing: image-gen MCP/tool. Tools should include the environment's `generate_image` / image MCP. Hand generated assets to the builder.

## Growing the team
Adding a specialist is a versioned change:
1. Write `agents/<name>.md` — single responsibility, official-source-first, quality floor. Copy the shape of an existing specialist.
2. Wire it to its official source: add a row to `SOURCES.md`.
3. Add a row here in **Current specialists**, and to the routing table in the `engineering-team` skill.
4. Bump `CHANGELOG.md` and `VERSION` (minor bump for a new agent).
5. `git add -A && git commit && git tag vX.Y.Z`.

Versioning: semver-ish. New agent or capability → **minor**. Prompt tweaks/fixes → **patch**. Breaking reorg of the orchestration contract → **major**.
