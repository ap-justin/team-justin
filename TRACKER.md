# Issue Tracker — GitHub Issues (`gh`)

The team's planner seat (`planner`) and its vendored planning skills (`wayfinder`, `to-tickets`, `to-spec`) persist plans as **GitHub Issues**, driven entirely by the `gh` CLI. This file **is** the "tracker doc" those skills ask for — **do NOT run `/setup-matt-pocock-skills`** (that upstream setup step is replaced by this file for this team). When a vendored skill says "the issue tracker should have been provided to you," it means this document.

Repo is inferred from `git remote -v` — `gh` resolves it automatically inside a clone. If the repo has **no GitHub remote**, tell the lead: fall back to the vendored skills' local-markdown path (`tickets.md` in the repo root, `Blocked by:` edges as text) — the ticket content is identical, only the edge representation changes.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."` (heredoc for multi-line bodies).
- **Read an issue**: `gh issue view <number> --comments`.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with `--label` / `--state` filters.
- **Comment**: `gh issue comment <number> --body "..."`
- **Label**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

"Publish to the issue tracker" = create a GitHub issue. "Fetch the relevant ticket" = `gh issue view <number> --comments`.

## Labels

Created on first use — `gh label create <name> --color <hex> 2>/dev/null || true` before applying, so a fresh repo self-provisions.

| Label | Meaning |
|---|---|
| `ready-for-agent` | Fully specified, agent-grabbable. `to-tickets` / `to-spec` apply this by construction. |
| `ready-for-human` | Requires human implementation. |
| `wayfinder:map` | The single map issue for a `wayfinder` effort. |
| `wayfinder:research` / `wayfinder:prototype` / `wayfinder:grilling` / `wayfinder:task` | Ticket type on a wayfinder child issue. |

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Destination / Notes / Decisions-so-far / Fog body. `gh issue create --label wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub **sub-issue**. Add it via the sub-issues endpoint: `gh api --method POST repos/<owner>/<repo>/issues/<map>/sub_issues -F sub_issue_id=<child-db-id>` (the child's numeric **database id** — `gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _not_ the `#number`). Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>`. Once claimed, assign the ticket to the driving dev.
- **Blocking**: GitHub's **native issue dependencies** — the canonical, UI-visible representation. Add an edge with `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric **database id**. GitHub reports `issue_dependencies_summary.blocked_by` (open blockers only — the live gate). Where dependencies aren't available, fall back to a `Blocked by: #<n>, #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children (`gh issue list --state open`, scoped to the map's sub-issues / task list), drop any with an open blocker (`issue_dependencies_summary.blocked_by > 0`, or an open issue in the `Blocked by` line) or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee @me` — the session's first write.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.

> GitHub's issue-dependencies + sub-issues APIs are recent and evolve; verify the endpoint shape with `gh api` before a first run in a new repo rather than trusting this doc blindly.
