# Changelog

Semver-ish: new agent/capability → minor, prompt fix → patch, orchestration-contract break → major.

## v0.9.0 — planner seat (plan-of-record layer) + authoring standard
- **`planner`**: the missing PM-layer seat — persists a durable plan for work bigger than one context window, so the team can coordinate across sessions/parallel agents instead of re-deriving scope each reset. Three modes: **to-spec** (publish a PRD), **to-tickets** (tracer-bullet vertical slices with `blocked_by` edges), **wayfinder** (a map + investigation tickets for work too foggy to slice up front). inherits (→ opus) — decomposition quality gates all downstream parallelism.
- **AFK by design**: the planner synthesizes and publishes; the HITL loops the upstream skills assume (grill to name the destination, quiz ticket granularity) stay with the **lead** in the main thread — a subagent can't hold a live exchange with the user. It returns drafts + **open questions** when a decision is unresolved rather than guessing or faking an interview. New orchestration step **2.6** in `engineering-team` places it: grill → planner (publish) → dispatch the frontier to builders (worktree-isolated for parallel slices).
- **Backing (vendored, verbatim)**: `skills/{to-spec,to-tickets,wayfinder}/` ← `mattpocock/skills` (like `react-router`); symlinked into `~/.claude/skills` so the user also gets `/to-spec`, `/to-tickets`, `/wayfinder`. Tracker substrate = **`TRACKER.md`** (GitHub Issues via `gh`: `ready-for-agent` label, sub-issues, native `blocked_by`) — **replaces `/setup-matt-pocock-skills`** for this team; no-remote repos fall back to local-markdown `tickets.md`. Matches the CLAUDE.md `gh`-for-everything mandate.
- **Authoring standard**: wired **`/writing-great-skills`** (already installed via the mattpocock pack — reused, *not* vendored, to avoid a drifting duplicate) into `ROSTER.md` "Growing the team" step 1 and `SOURCES.md`, so every new `agents/*.md` / skill is authored against it (invocation model, information hierarchy, single source of truth, pruning).
- Wiring: `agents/planner.md`; `TRACKER.md`; `SOURCES.md` planning + authoring rows and Vendored-resources entries; `ROSTER.md` specialist + model-tier + reused/vendored rows, header → v0.9.0; `engineering-team` Step 2.6 + routing row.
- Considered and rejected: (1) vendoring `writing-great-skills` "like react-router" — it's already installed, so a copy would drift; the team's own convention treats installed skills as reused-not-owned. (2) Adopting mattpocock's full `/setup-matt-pocock-skills` tracker/CONTEXT.md substrate per repo — heavier footprint; a thin gh-native `TRACKER.md` gives the same store with no per-repo setup step.

## v0.8.2 — project-scoped browser sessions (parallel-safe visual-reviewer)
- `visual-reviewer`: `--session-name` now scoped per project (`bg-$(basename "$PWD")`) instead of a shared constant. Each named `agent-browser` session is a separate browser instance, so review runs across concurrent projects no longer stomp each other's tab/nav state. Root cause fixed in the `local-browser` skill (was hardcoding `bg-dev`); reinforced in the agent since concurrency is exactly its failure mode.
- Considered switching to Chrome MCP for the seat and rejected it: a subagent would need `mcp__claude-in-chrome__*` in frontmatter (deferred tools), interactive per-site permission grants, and a real Chrome — not headless/CI/cron-capable, and one Chrome is still a shared focus/dialog chokepoint. Named agent-browser sessions give true process/profile isolation with no tool-grant change. Tradeoff: auth is per-project (login once, then persists).

## v0.8.1 — greenfield team default: pnpm
- `engineering-team` Step 2 (greenfield): added a **Team defaults** block — JS/Node scaffolds use `pnpm` (install, scripts, `pnpm-lock.yaml`; no `package-lock.json`/`yarn.lock`). N/A for non-JS stacks. Brownfield unchanged — still matches the existing repo.
- Lives in the orchestrator, not per-builder: pnpm is stack-agnostic, so a single default beats duplicating it across every builder; no builder pins a manager, so none needed editing.

## v0.8.0 — visual-reviewer (rendered-UI review seat)
- `visual-reviewer`: reviews the UI as it actually renders, not the source — the gap `taste-reviewer` (static) left open. Drives a live browser via the `local-browser` skill (`agent-browser`), sweeps desktop/tablet/mobile viewports and interactive states (hover/focus/active/disabled/loading/empty/error), and cites **measured** evidence (`getBoundingClientRect` for alignment/overflow, `getComputedStyle` for contrast/tokens) plus screenshots (vision). Report-only; pinned `opus` (multimodal). Dev server must already be running — never starts it.
- Completes the review set: `code-reviewer` (correctness) · `architecture-reviewer` (structure) · `taste-reviewer` (static slop) · `visual-reviewer` (rendered pixels). Visual-regression diffing (Percy/Playwright snapshots) noted as a separate CI concern, out of scope.
- `taste-reviewer` fixes: (1) added a boundary note — it stays static, hands live-render findings to `visual-reviewer`; (2) **removed the hardcoded "Target stack is Svelte"** and its stray `local-browser` line — it now detects the repo's stack and applies framework-agnostic rules + the matching stack's specifics. Left over from the team's Svelte-first origins; wrong now that the roster spans React/Next/RR/etc.
- Wiring: `agents/visual-reviewer.md`; `SOURCES.md` rendered-UI row (`local-browser`); `ROSTER.md` specialist + opus-tier rows, header → v0.8.0; `engineering-team` design routing (`… → taste-reviewer (static) → visual-reviewer (rendered)`) + Step 4 note.

## v0.7.0 — test-writer (generic, project-deferring test seat)
- `test-writer`: fills the team's test gap (previously only the reused `/tdd` skill). Generic and portable — its *what-makes-a-good-test* judgment travels; its *how-this-repo-tests* judgment is learned from the repo every run. Owns the write→run→fix loop; inherits (→ opus), builder-class tools.
- Local sources first: discovers the repo's testing knowledge (a `.claude/skills/*test*` / `TESTING.md`, then config/setup, then existing tests) and follows it verbatim before writing. Verifies runner API via Context7, never memory; invokes `/tdd` for red-green discipline. If no testing knowledge is written down, it **captures** it into a project testing skill/doc so it compounds (knowledge-steward step) — and updates it when it learns something new.
- Design note: this supersedes the idea of promoting a project-local test skill to a project-local agent. One portable agent + per-repo testing skills is the clean layering — e.g. `better-giving/.claude/skills/test-writer` becomes exactly the local knowledge this agent defers to; nothing there needs deleting.
- Wiring: `agents/test-writer.md`; `SOURCES.md` testing row (local-first → `/tdd` + Context7); `ROSTER.md` specialist + inherit-tier rows, header → v0.7.0; `engineering-team` routing row + Step 4 note (spawn for non-trivial tests, it invokes `/tdd` itself).

## v0.6.0 — architecture-reviewer (structural integrity seat)
- `architecture-reviewer`: the missing structure seat, completing the review trio (`code-reviewer`=correctness, `taste-reviewer`=design/UX, `architecture-reviewer`=boundaries). Report/spec only, never edits. Pinned `opus` — seam/coupling judgment is the hardest review.
- Two modes: **design mode** (before a builder — settle the seam + emit an interface spec) and **review mode** (after — gate boundary erosion: shallow modules, leaked implementation, coupling drift, overloaded interfaces, testability/AI-navigability). Distinct from the reused built-in `Plan` (impl sequencing) — this owns module depth, not the build order.
- Backing = `codebase-design` skill (deep-module vocabulary), Context7 per stack for framework-specific seam rules.
- Wiring: `SOURCES.md` row (`codebase-design` skill); `ROSTER.md` specialist + model-tier rows, header → v0.6.0; `engineering-team` routing gains two rows (design-mode / review-mode) + a Step 4 note to run it before the builder for refactors/new boundaries and after as a gate.

## v0.5.1 — gen-asset arg hardening
- `scripts/gen-asset.ts`: `parseArgs` now greedily joins tokens until the next `--flag`, so a multi-word `--prompt` survives even when the shell/npm drops its quotes (previously truncated to the first word). Validated end-to-end: real Gemini 2.5 Flash Image call → `sharp` → on-prompt 1024² avif.

## v0.5.0 — graphic-designer (image asset generation)
- `graphic-designer`: generates + enhances web-ready image assets (hero art, textures, backgrounds, icons, OG images) from `design-director`'s plan. Executor only — takes the locked palette/vibe, never re-decides the design system or writes app code. inherits (→ opus) for prompt craft + slop curation.
- Backing = committed script `scripts/gen-asset.ts` (`@google/genai`, Gemini 2.5 Flash Image default / Imagen via `--model`, edit mode via `--input`), invoked with Bash; needs `GOOGLE_API_KEY`. Script owns a `sharp` optimization pass → emits `avif`/`webp` at requested sizes, drop-in for the builder. Team repo now has a `package.json` (deps: `@google/genai`, `sharp`, `tsx`). Video (Veo) deferred to ROSTER → Planned.
- Wiring: `SOURCES.md` row (Google GenAI → gen script + Context7 `/googleapis/js-genai`); `ROSTER.md` moves it Planned→Current + model-tier row; `engineering-team` routing gains a generated-asset row (`design-director → graphic-designer → builder → taste-reviewer`); `taste-reviewer` remit extended to fail AI-slop in generated raster assets.

## v0.4.1 — model tiers
- `code-reviewer` pinned to `opus` (adversarial bug-finding stays strong even if the session drops to a cheaper model); `taste-reviewer` pinned to `sonnet` (anti-slop review is pattern-matching). All other agents + the lead inherit the session model. Policy documented in `ROSTER.md` → Model tiers. No prior agent declared a `model:` field.

## v0.4.0 — Next.js, Sanity, and web-perf specialists
- `nextjs-builder`: fullstack Next.js App Router (Server/Client Components, Server Actions, route handlers, streaming, caching). Backed by `vercel:nextjs` + `vercel:next-cache-components`/`shadcn`/`react-best-practices` + Vercel MCP, Context7 fallback. Router-aware (App vs Pages).
- `sanity-builder`: Sanity content model, GROQ + TypeGen, Portable Text, Studio, and frontend integration. Backed by `sanity:*` skills + Sanity MCP (`get_schema` before any doc op); owns schema/queries/typed data, hands layout to the framework builder.
- `vercel-perf-optimizer`: post-build web-perf pass — CWV, rendering strategy, caching, bundle, image/font. Backed by `vercel:performance-optimizer` + `vercel:next-cache-components`/`runtime-cache` + Vercel MCP runtime logs. Diagnoses on real data, proves before/after, tunes not redesigns.
- `SOURCES.md`: Next.js, web-performance, and Sanity now route to their named specialists; Vercel row narrowed to deploy/AI/Functions. `ROSTER.md` + `engineering-team` SKILL routing table updated.

## v0.3.0 — first-class official sources
- Vendored React Router's **official** agent skill (`skills/react-router/`, from `remix-run/react-router/.agents/skills/react-router`, MIT) — mode-aware (framework/data/declarative/RSC) SKILL.md + 4 reference files. Symlinked at `~/.claude/skills/react-router`.
- `react-router-builder` now uses that skill first (defers to installed `node_modules/react-router/docs/` as truth), a repo's own vendored skill if present, then Context7 as fallback — no more Context7-as-primary for RR.
- `sveltekit-builder`: noted the official llms fallback (`svelte.dev/llms.txt`) if the Svelte MCP is unreachable; confirmed MCP + `svelte:*` skills are already Svelte's first-class AI surface.
- `SOURCES.md`: new RR source hierarchy + a "Vendored resources" provenance/refresh section. `ROSTER.md`/`README`/SKILL routing updated.

## v0.2.1 — tooling fixes
- `code-reviewer`: added `WebFetch` + Context7 MCP (`resolve-library-id`/`query-docs`) to its `tools` allowlist — it was told to verify via official sources but a strict allowlist excluded all MCP, so the instruction was unbacked.
- Fixed skill refs `frontend-design` → `frontend-design:frontend-design` (plugin-namespaced form the Skill tool needs) in `design-director`, `engineering-team` SKILL, and `ROSTER`.

## v0.2.0 — grilling awareness
- `engineering-team` PM now knows the `/grilling` skill and uses judgment (Step 2.5): for non-trivial work it grills, or asks the user whether to, before Plan/build. Trivial edits always skip. Not a hard gate.
- Placement: greenfield after scoping; brownfield after `Explore` (informed, not blind). Grill output supersedes design-director's single clarifying question.

## v0.1.0 — initial team
- Lead: `engineering-team` skill (main-thread PM) with greenfield + brownfield modes, stack detection & routing, gap recommendation (mint-a-specialist), official-sources enforcement.
- Specialists: `design-director`, `sveltekit-builder`, `react-router-builder`, `postgres-architect`, `taste-reviewer`, `code-reviewer`.
- `SOURCES.md` — official MCP/skill/plugin registry (Context7, Svelte MCP, Better Auth MCP, `vercel:*`/`sanity:*` skills, Cloudflare MCP).
- Reuses built-ins (`Explore`, `Plan`) and skills (`/code-review`, `/tdd`, `/diagnosing-bugs`, `/verify`, `/run`).
- Repo symlinked into `~/.claude/agents` and `~/.claude/skills/engineering-team`.
