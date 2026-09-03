<!-- The minted block's shape. `/team-justin:deploy` writes this into a repo's `.claude/CLAUDE.md`
     with the sheet filled from that repo. The prose here is constant across every engagement and is
     edited here; the sheet is derived per repo. A repo's copy is a cache the next re-run rewrites. -->

<!-- team-justin vX.Y.Z · /team-justin:deploy · re-run to re-derive -->
## team
Run by the **team-justin** engineering team (`/plugin install team-justin@team-justin`). Load
**`team-justin:lead`** before building, routing, reviewing, or dispatching a seat — it carries how the
team works. Below is who is on it here.

<the sheet — one line per answer, each citing what it was derived from>

A slice needing a seat listed under `not here` is a question for the user, naming that seat — never a
nearby seat pressed into the gap.
<!-- /team-justin -->

---

The sheet's shape: a label, the answer, and the evidence, aligned so the whole thing reads in one
pass. Roles first, then what this repo has no seat for.

```
routes     team-justin:react-router-builder   ← react-router 7.16.0 framework mode, fs-routes
ui         team-justin:react-ui-builder       ← packages/ui components, tailwind 4
data       team-justin:postgres-architect     ← drizzle-orm, apps/api/.server/pg/migrations
project    .claude/skills/db-admin · e2e      ← prefer these over a plugin seat

not here   sveltekit-builder · svelte-ui-builder · nextjs-builder · go-fullstack-builder ·
           python-developer · cloudflare-builder · sqlite-architect
```

A repo whose own always-loaded docs already carry its commands, its token file and the gate that
closes it **ends there** — those are the repo's lines to state and the block's to leave alone. Where
one of them is genuinely unwritten anywhere, it joins the sheet in the same shape, with its evidence:

```
tokens     packages/brand/src/colors.css      ← gate: lefthook test-brand (colors.ts ↔ colors.css)
test       `pnpm test` · api `go test ./...`
⚠ suite    ~9 min cold, no watch mode         ← measured; no config states it
```

A cost line is the one field with no file to read it off, so it is the one to be most careful about:
measure it or cite the config that sets it. A plausible cost asserted from the runner's reputation is
the failure this shape invites — the sheet is read as derived fact on every later session.
