# Changelog

Semver-ish: new agent/capability → minor, prompt fix → patch, orchestration-contract break → major.

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
