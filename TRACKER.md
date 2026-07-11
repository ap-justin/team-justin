# Plan Store — git-tracked files (`management/`)

The team's `planner` and `product-manager` seats persist plans as **markdown files under `management/`**, committed to the working repo and versioned in git — **not** on GitHub Issues. This file **is** the "tracker doc" the vendored planning skills ask for — **do NOT run `/setup-matt-pocock-skills`**. When a vendored skill says "the issue tracker should have been provided to you," or offers a GitHub/Linear path, use the file layout here — it is the skills' own **local-markdown path**, made canonical for this team.

Why files, not Issues: the plan lives beside the code, every edit shows in `git log` and rides into review in the same PR, and no network / `gh` / tokens are needed. Git history *is* the plan's audit trail — the thing a comment timeline can't give you locally.

## Layout

```
management/
  roadmap/                 # durable, cross-cutting — belongs on the default branch, rides in via PRs
    ROADMAP.md             # the roadmap of record (Now / Next / Later index)
    briefs/<slug>.md       # one thin brief per roadmap item
  plan/                    # the current effort — lives on the current branch
    <effort-slug>/
      spec.md              # to-spec PRD (if the effort has one)
      map.md               # wayfinder map (wayfinder efforts only)
      tickets/             # to-tickets: one file per ticket
        <nnn>-<slug>.md    # a single ticket — YAML frontmatter (id/status/blocked_by) + prose body
```

**One file per ticket, not one `tickets.md`.** Each ticket is its own file under `plan/<effort>/tickets/`, named `<nnn>-<slug>.md` where `<nnn>` is a zero-padded dependency-order sequence (`010`, `020`, … — gaps left to insert later) and `<slug>` is kebab-case from the title. One-per-file keeps diffs clean, ids stable across renames, and cuts merge conflicts when tickets are edited in sequence.

**Two horizons, two lifetimes:**
- **`plan/`** is the *current* effort — one branch at a time (sequential execution). Created and edited on the feature branch; it merges with the code it plans. One `<effort-slug>/` dir per effort.
- **`roadmap/`** is *durable* and cross-cutting — it must outlive any one branch, so treat it as living on the **default branch**: edits ride in via the PR and merge to trunk. A mid-implementation "defer this — later" appends to `roadmap/` so the item survives after the current branch merges. (Two branches deferring at once can conflict on `ROADMAP.md`; resolve it like any merge.)

## Status & the frontier (frontmatter, not a prose scrape)

There are no issue labels and no tracker UI — status and edges are **typed YAML frontmatter** on each ticket file, so the frontier is a deterministic query, not a scan of prose. (This amends the vendored `<tickets-file-template>`, which is single-file and prose-only: keep its body verbatim, wrap it per-ticket with the frontmatter below. The template stays re-syncable; the frontmatter is this team's local override, same as the store itself.)

A **ticket file** is:

```markdown
---
id: t3                 # stable identity — edges point at this, never at the title
status: todo           # todo | doing | done
blocked_by: [t1, t2]   # ids of the tickets that gate this one; [] if none
---
# <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work — not a layer-by-layer list.

- [ ] acceptance criterion 1
- [ ] acceptance criterion 2
```

- **`id`** is the join key: short and stable (`t1`, `t2`, …). Renaming a ticket's title or slug never breaks an edge, because edges reference the id, not the title.
- **`status`** is the machine roll-up the frontier reads — `todo` → `doing` (claimed / in progress, since execution is sequential) → `done`. The `- [ ]` acceptance boxes stay as the builder's in-ticket checklist and the evidence for done-ness; the builder flips `status: done` once they're all checked and the slice is verified. Status is read from the field, never by scraping boxes.
- The **frontier** = every ticket with `status != done` whose `blocked_by` ids are **all** `status: done`. One query over the frontmatter (`grep`/parse), no prose reading. A frontier ticket is agent-grabbable by construction (replaces GitHub's native `blocked_by` + the `ready-for-agent` label).

Other artifacts:
- A **brief** carries frontmatter `id`, `horizon: now|next|later`, and `status: ready-for-planning` — the handoff signal to `planner` (replacing the `ready-for-planning` label). `planner` reads it as the already-scoped brief for to-spec.
- A **wayfinder ticket** is a ticket file under `plan/<effort>/tickets/` with the frontmatter above plus `type: research|prototype|grilling|task`. `status: doing` **is** the claim (replaces per-issue assignee) — an open ticket at `todo` is unclaimed. It is **closed** by setting `status: done` and gisting its one line into the map's *Decisions so far*. The `map.md` file itself is the `wayfinder:map` artifact.

**Ids join; titles narrate.** Frontmatter edges use ids; everything a human reads — your return, map bodies, *Decisions so far* — refers to a ticket by its **title** wrapping its file link, never a bare id. The id is a machine handle, not a human one.

## Roadmap operations (`product-manager`)

- **`ROADMAP.md`**: a single file, body grouped **Now / Next / Later** (themes/objectives → outcomes), each item linking its brief file and naming its evidence + priority score. **Update in place** — never spawn a second roadmap file. Quarterly / OKR horizons are `###` groupings inside a section, not separate objects (replaces GitHub Milestones).
- **`briefs/<slug>.md`**: one per roadmap item — problem, target outcome, priority rationale (framework + score), success metrics, constraints. Frontmatter `id:` + `horizon:` + `status: ready-for-planning`. Thin by construction (no seams / user-stories / file-paths — that's `planner`/spec territory, and specifics rot).

## Planning operations (`planner`)

- **to-spec** → `plan/<effort>/spec.md`, using the skill's spec template. The seam sketch still goes to the lead to confirm; the file is the published spec.
- **to-tickets** → one file per ticket under `plan/<effort>/tickets/`, keeping the skill's `<tickets-file-template>` body verbatim and wrapping each ticket with the `id`/`status`/`blocked_by` frontmatter above. Files named in dependency order (`<nnn>-<slug>.md`, blockers first); edges by **id**. This is the skill's *Local-files* path, made canonical here (per-file + frontmatter).
- **wayfinder** → `plan/<effort>/map.md` (Destination / Notes / Decisions-so-far / Not-yet-specified) plus its tickets as files under `tickets/` (frontmatter + `type:`); resolve one per session, setting `status: done` and gisting each closed ticket into *Decisions so far*.

## Naming

`<effort-slug>` and `<slug>` are short kebab-case, from the effort / brief title; a ticket file is `<nnn>-<slug>.md` (dependency-order sequence + title slug). One effort dir per plan. Once an effort's work has merged and every ticket is `status: done`, delete or archive its `plan/<effort>/` dir — git keeps the history.
