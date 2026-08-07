# learn — sweep the preference inbox back into the team

The **promote** half of the preference loop (`PREFERENCES.md`): read the cross-project inbox, and edit the good preferences into the team. It's roster-ops because it edits the orchestration surface (agent prompts) and bumps a version — a subagent can't own that. **Gated**: propose every edit, land nothing unreviewed.

Run this **from the plugin source repo** (it commits the plugin), not a product repo. The inbox is user-global, so it's the same source wherever you run it.

## 1. Read the inbox
Read `~/.claude/team-justin/inbox.md` (+ `~/.claude/team-justin/patterns/`). If missing or empty, say so and stop — nothing to sweep. Group the lines by lane (`design`/`code`/`workflow`), **dedupe** (collapse repeats, merge near-duplicates), and **drop noise** (one-off, contradictory, or too vague to act on — call these out so the user can override).

## 2. Route each keeper to a destination
For each surviving preference, pick the narrowest home:
- **Seat-specific** (only one seat should carry it — e.g. a Svelte-only idiom, a `design-director`-only default) → a **targeted prompt edit** to that `agents/<seat>.md`. Name the seat and show the exact insertion.
- **Cross-seat** (several seats should carry it) → the same targeted edit in each affected seat, or the owning skill (`lead` SKILL.md for orchestration-wide rules). There is no central style file — plugins can't ship auto-loaded context, so a preference lives where the seat already reads (see `PREFERENCES.md` → *The destination*).
- **Reusable concrete pattern** → keep the `patterns/<slug>.md` artifact in the plugin (copy it under a repo path if you want it version-shared), referenced from the seat/skill that uses it.

A preference that's really project-specific (not about the team) doesn't belong here — flag it to go to that project's plan store (`~/.claude/team-justin/management/<project-slug>/`, `TRACKER.md`) instead.

## 3. Propose, then gate
Show the user the full set of proposed diffs (agent-prompt + skill edits), grouped by destination, each with the inbox line it came from. **Land nothing until the user approves** — editing an agent prompt has global blast radius. The user can accept, drop, or reword per item.

## 4. Apply + drain
- Write the approved edits (`agents/<seat>.md` insertions, skill edits, kept artifacts).
- **Drain** the inbox: remove the promoted lines from `~/.claude/team-justin/inbox.md`, leaving un-promoted/deferred lines for next time. Move kept artifacts out of the inbox's `patterns/` if you copied them into the repo.

## 5. Version + hand off (wiring map #6–#8)
No agent added → **count stays the same** (don't touch the `plugin.json`/`marketplace.json` count). Bump version: **minor** if it adds a new default or capability, **patch** for a tiny prompt tweak. Set `VERSION`, `plugin.json` `version`, `ROSTER.md` header, and a `CHANGELOG.md` entry — all equal. Then **run `audit` (`audit.md`) — it must pass.** Report what landed where; leave `commit`+`tag` to the user (git rule).

Completion: approved preferences edited into seats/skills, inbox drained of them, version bumped, `audit` green.
