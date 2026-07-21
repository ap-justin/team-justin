# Plan Store — user-level files (`~/.claude/team-justin/management/<project-slug>/`)

The team's `planner` and `product-manager` seats persist plans as **markdown files under `~/.claude/team-justin/management/<project-slug>/`** — at the **user level**, keyed per project, beside the preference store (`PREFERENCES.md`) — **not** committed to the working repo, and **not** on GitHub Issues. This file **is** the "tracker doc" the vendored planning skills ask for — **do NOT run `/setup-matt-pocock-skills`**. When a vendored skill says "the issue tracker should have been provided to you," or offers a GitHub/Linear path, use the file layout here — it is the skills' own **local-markdown path**, made canonical for this team.

**`<project-slug>` = the working repo's dir name** — the same slug convention `/remember` stamps on inbox lines, so one name identifies a project across both user-level stores. No repo → the cwd's dir name. Create the dir on first write.

Why user-level files, not in-repo and not Issues: the working repo stays clean — no `management/` files in a product repo, its PRs, or its history — while the plan still survives context resets, branch churn, and even a re-clone. The home dir is the one place writable from every project (the same argument that placed the preference inbox there — `PREFERENCES.md`), and no network / `gh` / tokens are needed. Trade-off, recorded: the plan no longer rides into the PR beside the code — commit-time reconciliation (below) is what keeps plan and code honest instead. If you want an audit trail back, `git init ~/.claude/team-justin` once — history returns without touching any product repo.

## Layout

```
~/.claude/team-justin/management/<project-slug>/
  roadmap/                 # durable, cross-cutting — outlives any effort or branch
    ROADMAP.md             # the roadmap of record (Now / Next / Later index)
    briefs/<slug>.md       # one thin brief per roadmap item
  plan/                    # the current effort
    <effort-slug>/
      spec.md              # to-spec PRD (if the effort has one)
      map.md               # wayfinder map (wayfinder efforts only)
      tickets/             # to-tickets: one file per ticket
        <nnn>-<slug>.md    # a single ticket — YAML frontmatter (id/status/blocked_by) + prose body
```

**One file per ticket, not one `tickets.md`.** Each ticket is its own file under `plan/<effort>/tickets/`, named `<nnn>-<slug>.md` where `<nnn>` is a zero-padded dependency-order sequence (`010`, `020`, … — gaps left to insert later) and `<slug>` is kebab-case from the title. One-per-file keeps diffs clean, ids stable across renames, and keeps edits from trampling each other when tickets are edited in sequence.

**Two horizons, two lifetimes:**
- **`plan/`** is the *current* effort — one effort at a time (sequential execution). One `<effort-slug>/` dir per effort; archive it once the effort ships (see *Naming*).
- **`roadmap/`** is *durable* and cross-cutting — it must outlive any one effort or branch. A mid-implementation "defer this — later" appends to `roadmap/` so the item survives after the current effort ships. The store sits outside every worktree, so there is exactly one copy — no branch-vs-branch merge to resolve, and the sequential-execution rule is what keeps concurrent writers from racing it.

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

## Reconcile & capture (the lead, at commit)

The store only stays truthful if the plan moves **with** the code. There is no git hook and no tracker daemon — reconciliation is a **lead** action (`lead` skill, Step 4.5), run at the **same moment** as the commit that lands each slice. The store lives outside the repo, so the write doesn't ride in the commit — reconciling as each slice lands is precisely what keeps `git log` and the plan telling the same story instead of drifting. It's automatic (write, then report) and applies whenever the project's store exists:

- **Ticket status** → set `status: done` on every ticket whose acceptance boxes are all satisfied; recompute the frontier and report the new takeable set. Never `done` on unchecked acceptance — that's what makes the frontier lie.
- **Roadmap** → move any now-complete item in `ROADMAP.md` (Now → shipped), in place.
- **Idea capture** → a pitched or discovered idea, out of scope for the current slice, appends **one line** to the `## Icebox` section of `ROADMAP.md`. Zero-friction and pre-triage: no brief, no evidence, no score — just the line — and never derail the task to build it.

**The Icebox — captured, untriaged.** A single `## Icebox (captured, untriaged)` section at the **bottom of `ROADMAP.md`** (not a separate file, not a brief). It is a lossless parking lot deliberately **outside** the curated Now/Next/Later — raw ideas don't pollute the prioritized horizons, and nothing is lost mid-task. Entry format:

```markdown
## Icebox (captured, untriaged)
- <one-line idea> — _pitched|discovered · effort: <slug> · 2026-07-12_
```

`pitched` = user, `discovered` = team; `effort` is the slug it surfaced in; the date is when captured. `product-manager` **triages** the Icebox on its next run — promoting a line into a real Now/Next/Later item with a brief + priority score, or dropping it — so the Icebox drains rather than growing forever. Until then a line here is a reminder, explicitly **not** a prioritized commitment.

## Roadmap operations (`product-manager`)

- **`ROADMAP.md`**: a single file, body grouped **Now / Next / Later** (themes/objectives → outcomes), each item linking its brief file and naming its evidence + priority score, plus a trailing **`## Icebox`** section of captured-but-untriaged one-liners (see *Reconcile & capture*). **Update in place** — never spawn a second roadmap file. Quarterly / OKR horizons are `###` groupings inside a section, not separate objects (replaces GitHub Milestones).
- **Triage the Icebox**: each run, promote Icebox lines into real horizon items (brief + score) or drop them, so raw captures become prioritized work rather than accumulating.
- **`briefs/<slug>.md`**: one per roadmap item — problem, target outcome, priority rationale (framework + score), success metrics, constraints. Frontmatter `id:` + `horizon:` + `status: ready-for-planning`. Thin by construction (no seams / user-stories / file-paths — that's `planner`/spec territory, and specifics rot).

## Planning operations (`planner`)

- **to-spec** → `plan/<effort>/spec.md`, using the skill's spec template. The seam sketch still goes to the lead to confirm; the file is the published spec.
- **to-tickets** → one file per ticket under `plan/<effort>/tickets/`, keeping the skill's `<tickets-file-template>` body verbatim and wrapping each ticket with the `id`/`status`/`blocked_by` frontmatter above. Files named in dependency order (`<nnn>-<slug>.md`, blockers first); edges by **id**. This is the skill's *Local-files* path, made canonical here (per-file + frontmatter).
- **wayfinder** → `plan/<effort>/map.md` (Destination / Notes / Decisions-so-far / Not-yet-specified) plus its tickets as files under `tickets/` (frontmatter + `type:`); resolve one per session, setting `status: done` and gisting each closed ticket into *Decisions so far*.

## Naming

`<effort-slug>` and `<slug>` are short kebab-case, from the effort / brief title; a ticket file is `<nnn>-<slug>.md` (dependency-order sequence + title slug). One effort dir per plan. Once an effort's work has merged and every ticket is `status: done`, delete or archive its `plan/<effort>/` dir.
