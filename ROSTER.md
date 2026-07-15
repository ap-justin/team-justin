# Roster — v0.24.0

The lead is the `engineering-team` skill (runs in the main thread). It delegates to the specialists below and to built-in agents (`Explore`, `Plan`) and skills (`/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`). Every specialist follows **official sources first** (`SOURCES.md`).

## Scope — where this team stops
Engineering-led, cross-functional at the top. The team spans **product-development**: engineering (core) + design + the upstream product layer that feeds it. `product-manager` and `planner` are **upstream adapters** — they turn goals into a prioritized roadmap and a spec/ticket graph that hand *into* engineering; they don't run a separate org. `design-director`/`graphic-designer` feed the build; `seo-engineer` is technical growth on shipped pages.

The team stops at product-development. **Company functions are out of scope and stay uninstalled**: sales, marketing campaigns/content, finance, legal, support, ops/HR. This is the same discipline as v0.14.0 (vendor only the upstream skills that feed the build; don't drag in whole plugins). Adding a seat is fine (see *Growing the team*); adding a *business function* is a different product — don't.

## Current specialists (`agents/`)
| Agent | Role | Backing source |
|---|---|---|
| `ux-designer` | Experience layer upstream of visual design: user research, user flows + IA, mockup-stage usability critique, UX copy, design→eng handoff spec (artifacts, no code). Sits **before** `design-director` | vendored `design`-plugin skills: `user-research`, `research-synthesis`, `design-critique`, `ux-copy`, `design-handoff` |
| `design-director` | Design system + direction (plan, no code) | `frontend-design:frontend-design`, `design-taste-frontend` skills |
| `graphic-designer` | Generates/enhances web-ready image assets + ambient hero video (Veo) + code-generated generative art (p5.js) + true-alpha cutouts (rembg) from the plan | `scripts/gen-asset.ts` (`@google/genai`, ffmpeg, rembg) + vendored `algorithmic-art` skill + Context7 |
| `sveltekit-builder` | Fullstack Svelte 5 / SvelteKit | Svelte MCP + `svelte:*` skills (official AI surface) |
| `react-router-builder` | React Router (framework/data/declarative/RSC) | vendored official `react-router` skill → installed docs → Context7 |
| `nextjs-builder` | Fullstack Next.js App Router | `vercel:nextjs` + `vercel:*` skills + Vercel MCP → Context7 |
| `sanity-builder` | Sanity content model, GROQ, TypeGen, integration | `sanity:*` skills + Sanity MCP |
| `vercel-perf-optimizer` | Web perf: CWV, caching, rendering, bundle (post-build) | `vercel:performance-optimizer` + `vercel:*` skills + Vercel MCP |
| `seo-engineer` | Technical SEO + AEO: metadata/OG, canonical/hreflang, sitemaps/robots, JSON-LD, indexability, AI-answer readiness (audits + applies markup fixes; post-build) | `sanity:seo-aeo-best-practices` skill + the stack's meta API (Context7 / Vercel) |
| `postgres-architect` | Schema, migrations, typed query surface | Context7 |
| `better-auth-specialist` | Auth layer: server config, adapter + CLI schema, plugins (2FA/passkey/org/social/SSO), sessions/cookies, typed client. Hands a typed auth surface to the framework builder | Better Auth docs MCP → official Skills → `llms.txt` → Context7 |
| `ark-ui-specialist` | Headless UI component layer: accessible unstyled primitives (dialog/menu/combobox/select/date-picker/tabs/…) on Zag.js, across React/Vue/Solid/Svelte. Owns component behavior + a11y + styling hookup to `design-director`'s tokens; hands a styled, accessible component to the framework builder to place. Same cross-framework, hand-to-builder pattern as `better-auth-specialist` | Ark UI MCP → `llms.txt` → Context7 |
| `taste-reviewer` | Adversarial anti-slop design review (static source) | `design-taste-frontend` skill |
| `visual-reviewer` | Meticulous rendered-UI review in a live browser (viewports, states, measured) | `local-browser` skill (`agent-browser`) |
| `code-reviewer` | Adversarial correctness/quality review | Context7 per stack |
| `architecture-reviewer` | Structural integrity: seams, interface depth, coupling (design-time + review-time) | `codebase-design` skill |
| `test-writer` | Writes/updates/fixes tests; portable principles, defers to (and captures) per-repo testing conventions | `/tdd` skill + Context7 per runner; project testing skill/docs |
| `planner` | Persisted plan of record for work bigger than one context: spec, tracer-bullet ticket graph, or wayfinder map, in git-tracked files (AFK synthesis+publish; lead owns the human loop) | vendored `to-spec`/`to-tickets`/`wayfinder` skills + `TRACKER.md` (files under `management/plan/`) |
| `product-manager` | Upstream product layer: prioritized roadmap (Now/Next/Later, quarterly/OKR) + thin per-item briefs, persisted as git-tracked files (`management/roadmap/ROADMAP.md` + briefs); also **triages the Icebox** (drains the lead's captured-idea one-liners into real horizon items or drops them). Sets what/why/when; hands `ready-for-planning` briefs to `planner`. AFK synthesis+publish; lead owns the human loop | **vendored Product-Management skills** (from `knowledge-work-plugins`, in `skills/`) + `TRACKER.md` (files under `management/roadmap/`) |

## Model tiers
Agents inherit the session model unless pinned via a `model:` frontmatter field. Policy — spend on correctness (lead, implementers, code review), economize where the work is pattern-matching.

| Agent(s) | `model:` | Why |
|---|---|---|
| `engineering-team` lead | inherit (main thread) | routes/integrates/verifies; Opus 4.8 suffices. Not settable via frontmatter |
| `ux-designer`, `design-director`, `graphic-designer`, all `*-builder`, `ark-ui-specialist`, `postgres-architect`, `better-auth-specialist`, `vercel-perf-optimizer`, `seo-engineer`, `test-writer`, `planner`, `product-manager` | inherit (→ opus) | code correctness + design judgment; Opus 4.8 is the coding tier. `ux-designer` sets flows/IA/copy the whole build inherits — research synthesis + interaction judgment want the top tier. `better-auth-specialist` writes security-critical auth config — a wrong default (disabled verification, permissive origins) is expensive; keep it on the coding tier. `ark-ui-specialist` owns component accessibility (ARIA/focus/keyboard) — a broken part anatomy silently defeats it, so keep the wiring on the coding tier. `graphic-designer` needs opus-level prompt craft + slop curation. `test-writer` writes real code + debugs failures. `seo-engineer` applies markup fixes + must get JSON-LD/canonical/hreflang correct. `planner` decomposition quality gates all downstream parallelism — keep it on the coding tier. `product-manager` sets the priority order everything downstream inherits — misprioritization is the most expensive error, keep it on the top judgment tier |
| `code-reviewer` | **opus** (pinned) | adversarial bug-finding stays strong even if the session drops to a cheaper model |
| `architecture-reviewer` | **opus** (pinned) | seam/coupling judgment is the hardest review; keep it on the top tier regardless of session model |
| `visual-reviewer` | **opus** (pinned) | multimodal — reads screenshots + reasons over measurements; needs the vision-capable top tier regardless of session model |
| `taste-reviewer` | **sonnet** (pinned) | anti-slop review is pattern-matching; cheaper tier is enough |

Fable 5 is the premium tier ($10/$50) — reserve for long autonomous multi-file runs, not routing or routine builds. Drop implementers to `sonnet` only for cost/volume-sensitive work.

## Reused, not owned
Built-ins: `Explore` (codebase mapping), `Plan` (architecture).
Repo-authored shared skill: **`typescript`** (`skills/typescript/` — cheat-sheet baseline + type craft + compiler-config discipline). Loaded by every TS-writing builder (`*-builder`, `better-auth-specialist`, `ark-ui-specialist`, `postgres-architect`, `test-writer`) — **TypeScript is ambient, not a seat**: no fuzzy builder/expert seam, no extra hop for routine typing. Repo-wide TS-infra work (strict migration, monorepo project references, type-perf profiling) = the lead dispatches a general agent with this skill; mint a dedicated seat only if that recurs. Excludes the formatter/linter (Biome/ESLint/Prettier — a separate tooling concern, not yet seated).
Skills: `/grilling` (stress-test the brief before planning, PM judgment), `/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`, `/writing-great-skills` (authoring standard for this repo — see Growing the team).
Vendored official skills: `react-router` (backs `react-router-builder`); `to-spec`/`to-tickets`/`wayfinder` (back `planner`); `accessibility-review` (WCAG audit, a11y sibling of `visual-reviewer`); `user-research`/`research-synthesis`/`design-critique`/`ux-copy`/`design-handoff` (back `ux-designer`); `roadmap-update`/`synthesize-research`/`competitive-brief`/`metrics-review`/`stakeholder-update`/`product-brainstorming` (back `product-manager`) — all from the knowledge-work plugins, vendored so their MCP fleets stay out. See `SOURCES.md` → Vendored resources. Optional official subagent: `svelte:svelte-file-editor`.
Plan store: `TRACKER.md` (git-tracked markdown under `management/`) — the planner's + product-manager's plan-of-record store; replaces `/setup-matt-pocock-skills` and GitHub Issues. The **lead reconciles it at commit** (`engineering-team` Step 4.5): flip done tickets, advance the roadmap, and capture pitched/discovered ideas to the roadmap **Icebox** — plan and code share one commit, no drift.

## Planned (add as the team matures)
- `astro-builder` — content-heavy sites. Backing: Context7 (`astro`). Mint when Astro work recurs.

## Growing the team
Adding a specialist is a versioned change:
1. Write `agents/<name>.md` against the **`/writing-great-skills`** standard (invocation model, information hierarchy, single source of truth, aggressive pruning) — single responsibility, official-source-first, quality floor. Copy the shape of an existing specialist.
2. Wire it to its official source: add a row to `SOURCES.md`.
3. Add a row here in **Current specialists**, and to the routing table in the `engineering-team` skill.
4. Bump `CHANGELOG.md` and `VERSION` (minor bump for a new agent).
5. `git add -A && git commit && git tag vX.Y.Z`.

Versioning: semver-ish. New agent or capability → **minor**. Prompt tweaks/fixes → **patch**. Breaking reorg of the orchestration contract → **major**.
