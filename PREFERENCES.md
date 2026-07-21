# Preference Store — how the team evolves

The team is **project-agnostic**: the same agents start from the same frozen definitions in every repo. Left alone, a preference the user expresses in one project — a liked UI pattern, a code convention they approved, a workflow they always want — dies with that session. Nothing carries it into the next project.

This file documents the loop that fixes that: **capture → sweep → evolve**. It is the preference-store sibling of `TRACKER.md` (the plan store). The distinction:

- **`TRACKER.md` / the Icebox** — *project-specific* ideas and roadmap items. They live **in the working repo** under `management/`, because they're about *that product*.
- **This store** — *cross-project* preferences about how **the team itself** should work. They live **outside any one repo**, because they belong to the team, not the product.

## The loop

```
any project (cwd = someone's repo)         ~/.claude/team-justin/
  /team-justin:remember  ───────────────▶  inbox.md   ◀─── agents append learnings
                                              │            (end-of-run, via lead handoff)
                                     /team-justin:roster learn
                                              │  (run from the plugin source repo; user gates each edit)
                                              ▼
                              the plugin, versioned + shared
                                skills/house-style/SKILL.md   (cross-cutting prefs agents read)
                                agents/<seat>.md              (seat-specific prompt edits)
                                → commit + tag  (minor bump)
```

Two halves, mirroring the Icebox → `product-manager` promotion the team already runs: **cheap lossless capture**, then a **curated, human-gated sweep** that edits the team.

## Tier 1 — capture (the inbox)

**Location: `~/.claude/team-justin/inbox.md`** — a single user-global file, created on first capture. Not per-project (the team is project-agnostic, so scattering captures into each repo's `management/` would be wrong), and **not** the plugin's install dir (that resolves to a read-only, version-pinned cache when installed from the marketplace — unwritable from other projects and blown away on update). Home dir is the one place writable from every project and durable across plugin updates.

It has **two writers**:

1. **The user, explicitly** — `/team-justin:remember <what they liked>`. Never inferred from approval; the team does not guess. A liked *pattern* with concrete code is saved as an artifact under `~/.claude/team-justin/patterns/<slug>.md` and indexed by an inbox line.
2. **Agents, as they work** — a builder/reviewer that discovers a durable preference (the user rejected X twice and chose Y; this repo's approved convention is Z) appends one line at end-of-run. This is journaling a *learning*, not reading approval — the same instinct as `test-writer` capturing a repo's testing conventions. The **lead** hands each dispatched seat the inbox path + this format so the learning lands (Step 3).

Entry format — one line, untriaged, lossless (mirrors the Icebox line):

```markdown
- [design] prefers bento-grid hero over centered-stack — _user · acme-site · 2026-07-21_
- [code] approved Result<T,E> returns over throwing at call boundaries — _agent:sveltekit-builder · acme-site · 2026-07-21_
- [workflow] wants the plan grilled before any build, always — _user · acme-site · 2026-07-21_
- [design] liked this pricing table → patterns/pricing-3col.md — _user · acme-site · 2026-07-21_
```

- **lane tag** `[design|code|workflow]` — routes the sweep to the right destination.
- **source** `user` or `agent:<seat-slug>` — who captured it.
- **project** the repo slug it surfaced in (context for the sweep), then the date captured.
- Optional `→ patterns/<slug>.md` when a concrete artifact backs it.

Capture never derails the task — park the line, keep working (Icebox discipline).

## Tier 2 — sweep (`/roster learn`)

The **curated, human-gated** half — it edits the team, so it lives under roster-ops (`/team-justin:roster learn`), reusing the same version/wiring machinery as `hire`/`author`. Run it **from the plugin source repo** periodically (not from a product repo — it commits the plugin). It:

1. Reads `~/.claude/team-justin/inbox.md` (+ `patterns/`); groups by lane, dedupes, drops noise.
2. For each keeper, picks a **destination**:
   - **cross-cutting** (applies to many seats / the house look) → an entry in `skills/house-style/SKILL.md`.
   - **seat-specific** (a default only `design-director`, or only the Svelte builder, should carry) → a **targeted prompt edit** to that `agents/<seat>.md`.
   - **reusable concrete pattern** → keep the `patterns/<slug>.md` artifact, reference it from the house-style entry.
3. **Proposes the diffs to the user and gates on approval** — editing agent prompts has global blast radius, so nothing lands unreviewed (same as `hire`'s hand-off).
4. Applies approved edits; **drains** the promoted lines from the inbox (leaves un-promoted lines for next time), archiving artifacts it kept.
5. Version-bumps (minor for new prefs/capability, patch for a tiny tweak), runs `audit`, hands off. Commit/tag left to the user (git rule).

## The destination — `skills/house-style/SKILL.md`

The promoted-preferences home, versioned and shared (rides the marketplace, so every install of the team inherits them; the raw inbox stays personal to the user's machine). Organized by the three lanes. The **lead reads it at routing time** and passes the lane-relevant slice into a seat's scoped context (the same way it hands down design tokens) — so a global file doesn't get auto-loaded into every agent, only the relevant prefs reach the relevant seat.

An empty house-style is the honest default: the team starts frozen and earns its house style one swept preference at a time.
