# Preference Store — how the team evolves

The team is **project-agnostic**: the same agents start from the same frozen definitions in every repo. Left alone, a preference the user expresses in one project — a liked UI pattern, a code convention they approved, a workflow they always want — dies with that session. Nothing carries it into the next project.

This file documents the loop that fixes that: **capture → sweep → evolve**. It is the preference-store sibling of `TRACKER.md` (the plan store). The distinction:

- **`TRACKER.md` / `IDEAS.md` / `issues/` / `notes/`** — *project-specific* ideas, known defects, brainstorming, and the current change's brief. They live at user level too, but **keyed per project** (`~/.claude/team-justin/management/<project-slug>/`), because they're about *that product*.
- **This store** — *cross-project* preferences about how **the team itself** should work. They live **un-keyed at the team-justin root**, because they belong to the team, not any product.

## The loop

```
any project (cwd = someone's repo)         ~/.claude/team-justin/
  /team-justin:remember  ───────────────▶  inbox.md   ◀─── agents append learnings
                                              │            (end-of-run, via lead handoff)
                                     /team-justin:roster learn
                                              │  (run from the plugin source repo; user gates each edit)
                                              ▼
                              the plugin, versioned + shared
                                agents/<seat>.md              (targeted prompt edits)
                                skills/<owner>/SKILL.md       (incl. lead — orchestration-wide rules)
                                → commit + tag  (minor bump)
```

Two halves, mirroring the `IDEAS.md` → `lead brief` promotion the team already runs: **cheap lossless capture**, then a **curated, human-gated sweep** that edits the team.

## Tier 1 — capture (the inbox)

**Location: `~/.claude/team-justin/inbox.md`** — a single user-global file, created on first capture. Not per-project (the team is project-agnostic, so captures don't belong in any per-project plan store), and **not** the plugin's install dir (that resolves to a read-only, version-pinned cache when installed from the marketplace — unwritable from other projects and blown away on update). Home dir is the one place writable from every project and durable across plugin updates.

It has **two writers**:

1. **The user, explicitly** — `/team-justin:remember <what they liked>`. Never inferred from approval; the team does not guess. A liked *pattern* with concrete code is saved as an artifact under `~/.claude/team-justin/patterns/<slug>.md` and indexed by an inbox line.
2. **Agents, as they work** — a builder/reviewer that discovers a durable preference (the user rejected X twice and chose Y; this repo's approved convention is Z) appends one line at end-of-run. This is journaling a *learning*, not reading approval — the same instinct as `test-writer` capturing a repo's testing conventions. The **lead** hands each dispatched seat the inbox path + this format so the learning lands (Step 3).

Entry format — one line, untriaged, lossless (mirrors the `IDEAS.md` line):

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

Capture never derails the task — park the line, keep working (`IDEAS.md` discipline).

## Tier 2 — sweep (`/roster learn`)

The **curated, human-gated** half — it edits the team, so it lives under roster-ops (`/team-justin:roster learn`), reusing the same version/wiring machinery as `hire`/`author`. Run it **from the plugin source repo** periodically (not from a product repo — it commits the plugin). It:

1. Reads `~/.claude/team-justin/inbox.md` (+ `patterns/`); groups by lane, dedupes, drops noise.
2. For each keeper, picks a **destination**:
   - **seat-specific** (a default only `design-director`, or only the Svelte builder, should carry) → a **targeted prompt edit** to that `agents/<seat>.md`.
   - **cross-seat** (several seats should carry it) → the same targeted edit in each affected seat, or the owning skill (`lead` SKILL.md for orchestration-wide rules).
   - **reusable concrete pattern** → keep the `patterns/<slug>.md` artifact, reference it from the seat/skill that uses it.
3. **Proposes the diffs to the user and gates on approval** — editing agent prompts has global blast radius, so nothing lands unreviewed (same as `hire`'s hand-off).
4. Applies approved edits; **drains** the promoted lines from the inbox (leaves un-promoted lines for next time), archiving artifacts it kept.
5. Version-bumps (minor for new prefs/capability, patch for a tiny tweak), runs `audit`, hands off. Commit/tag left to the user (git rule).

## The destination — the seat definitions themselves

There is deliberately **no central style file** (the `house-style` skill was retired). Claude Code plugins cannot ship auto-loaded context (no plugin CLAUDE.md/rules mechanism), so a central file only reaches a seat if the lead remembers to re-read and re-hand a slice of it on every dispatch — a hop that silently drops. Promoted preferences are instead edited into the surfaces that already load: the seat's own `agents/<seat>.md` prompt, or the owning skill (`lead`'s SKILL.md for orchestration-wide rules). Versioned and shared all the same — every install inherits them; the raw inbox stays personal to the user's machine.

The team starts frozen and earns its defaults one swept preference at a time — in place.
