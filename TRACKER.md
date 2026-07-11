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
      tickets.md           # to-tickets: all tickets, dependency order, "Blocked by" by title
```

**Two horizons, two lifetimes:**
- **`plan/`** is the *current* effort — one branch at a time (sequential execution). Created and edited on the feature branch; it merges with the code it plans. One `<effort-slug>/` dir per effort.
- **`roadmap/`** is *durable* and cross-cutting — it must outlive any one branch, so treat it as living on the **default branch**: edits ride in via the PR and merge to trunk. A mid-implementation "defer this — later" appends to `roadmap/` so the item survives after the current branch merges. (Two branches deferring at once can conflict on `ROADMAP.md`; resolve it like any merge.)

## Status & the frontier (no labels, no tracker UI)

There are no issue labels and no tracker UI — status is a file convention, and the frontier is computed by reading the files:

- A **ticket** is a `## <title>` section in `tickets.md` with a **Blocked by** line (dependency titles, or "None — can start immediately") and `- [ ]` acceptance criteria. It is **done** when every acceptance box is checked. The **frontier** = every not-done ticket whose blockers are all done — for a linear chain, top to bottom. (This replaces GitHub's native `blocked_by` + the `ready-for-agent` label: a frontier ticket is agent-grabbable by construction.)
- A **brief** carries frontmatter `horizon: now|next|later` and `status: ready-for-planning` — the handoff signal to `planner`, replacing the `ready-for-planning` label. `planner` reads it as the already-scoped brief for to-spec.
- A **wayfinder ticket** is a section in `map.md` (or in a sibling `tickets.md`); blocking by title; a ticket is **closed** by moving its one-line gist into the map's *Decisions so far* and dropping it from the open list. The `map.md` file itself is the `wayfinder:map` artifact.

Refer to every ticket/brief by its **title** (linking its file), never a bare id — same rule the skills state.

## Roadmap operations (`product-manager`)

- **`ROADMAP.md`**: a single file, body grouped **Now / Next / Later** (themes/objectives → outcomes), each item linking its brief file and naming its evidence + priority score. **Update in place** — never spawn a second roadmap file. Quarterly / OKR horizons are `###` groupings inside a section, not separate objects (replaces GitHub Milestones).
- **`briefs/<slug>.md`**: one per roadmap item — problem, target outcome, priority rationale (framework + score), success metrics, constraints. Frontmatter `horizon:` + `status: ready-for-planning`. Thin by construction (no seams / user-stories / file-paths — that's `planner`/spec territory, and specifics rot).

## Planning operations (`planner`)

- **to-spec** → `plan/<effort>/spec.md`, using the skill's spec template. The seam sketch still goes to the lead to confirm; the file is the published spec.
- **to-tickets** → `plan/<effort>/tickets.md`, using the skill's `<tickets-file-template>` verbatim: all tickets in dependency order (blockers first), each **Blocked by** listing the **titles** it depends on. This is the skill's *Local-files* path — the canonical one here.
- **wayfinder** → `plan/<effort>/map.md` (Destination / Notes / Decisions-so-far / Not-yet-specified) plus its tickets; resolve one per session, gisting each closed ticket into *Decisions so far*.

## Naming

`<effort-slug>` and `<slug>` are short kebab-case, from the effort / brief title. One effort dir per plan. Once an effort's work has merged and no ticket remains open, delete or archive its `plan/<effort>/` dir — git keeps the history.
