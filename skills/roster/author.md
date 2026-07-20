# author — mint or vendor a skill

A skill touches the **smaller** map (see `SKILL.md`): no agent-count bump. First decide **first-party vs vendored**.

## First-party (write it)
1. `skills/<name>/SKILL.md` to the `/writing-great-skills` standard. Decide **invocation** per that skill: model-invoked (keeps a trigger-rich `description`, pays context load) only if the agent or another skill must reach it on its own; else **user-invoked** (`disable-model-invocation: true`, zero context load). Disclose long reference to sibling files (disclosure-by-branch), keeping `SKILL.md` legible.
2. Wire: if it **backs a seat**, add it to that seat's `SOURCES.md` row and have the seat's file load it; note it in `ROSTER.md` → *Reused, not owned*.

## Vendored (bring it in verbatim)
1. Download the source **unmodified** into `skills/<name>/`. Add the provenance HTML comment at the top — source repo + branch + sha + a one-line re-sync instruction (copy the exact shape at the top of `skills/writing-great-skills/SKILL.md`).
2. Record it in `SOURCES.md` → *Vendored resources* (repo, license, what it backs) and in `ROSTER.md` → *Reused, not owned*. Confirm the license permits vendoring; note it.

## Both
Minor version bump — `VERSION` · `CHANGELOG.md` · `ROSTER.md` header, all equal. Leave commit/tag to the user (git rule).

Completion: the skill loads, meets the standard (or is verbatim-vendored with provenance), and is recorded in `ROSTER.md`/`SOURCES.md` if it backs a seat or is vendored.
