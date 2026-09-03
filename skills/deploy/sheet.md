<!-- The sheet's content and its renderings. `/team-justin:deploy` writes this into a repo's
     `.claude/CLAUDE.md` in that file's own idiom. What each line says is derived from the repo; how
     it is laid out is derived from the host file. A repo's copy is a cache the next re-run rewrites. -->

Two lines carry fixed wording, because each does a job its phrasing decides. **The pointer** — the
one line that makes the sheet act rather than sit, since a session that never loads `lead` has
answers and no practice:

```
Load **`team-justin:lead`** before building, reviewing, or dispatching a seat — it carries how the
team works.
```

And **the gate** on the `not here` list, which is a routing instruction rather than an inventory:

```
A slice needing a seat listed under `not here` is a question for the user, naming that seat — never a
nearby seat pressed into the gap.
```

Everything between them is this repo's answers, one line per field, each citing what it was derived
from. Roles first, then what this repo has no seat for.

## Renderings

Match the host file. The same sheet, in the two idioms most files are already written in — an aligned
block for a file that reaches for code fences and tables:

```
routes     team-justin:react-router-builder   ← react-router 7.16.0 framework mode, fs-routes
ui         team-justin:react-ui-builder       ← packages/ui components, tailwind 4
data       team-justin:postgres-architect     ← drizzle-orm, apps/api/.server/pg/migrations
project    .claude/skills/db-admin · e2e      ← prefer these over a plugin seat

not here   sveltekit-builder · svelte-ui-builder · nextjs-builder · go-fullstack-builder ·
           python-developer · cloudflare-builder · sqlite-architect
```

and bold-led bullets for a file written in prose:

```markdown
- **routes** → `team-justin:react-router-builder` — react-router 7.16.0 framework mode, fs-routes
- **ui** → `team-justin:react-ui-builder` — `packages/ui` components, tailwind 4
- **data** → `team-justin:postgres-architect` — drizzle-orm, `apps/api/.server/pg/migrations`
- **project seats** — `.claude/skills/db-admin`, `e2e`; prefer these over a plugin seat where they overlap
- **not here** — sveltekit-builder, svelte-ui-builder, nextjs-builder, go-fullstack-builder,
  python-developer, cloudflare-builder, sqlite-architect
```

Both read in one pass, which is the property to preserve when the host file's idiom is a third thing.

## The fields past the seats

A repo whose own always-loaded docs already carry its commands, its token file and the gate that
closes it **ends at the seats** — those are the repo's lines to state and the sheet's to leave alone.
Where one of them is genuinely unwritten anywhere, it joins in the same shape, with its evidence, in
whichever section of the host file already owns that subject:

```
tokens     packages/brand/src/colors.css      ← gate: lefthook test-brand (colors.ts ↔ colors.css)
⚠ suite    ~9 min cold, no watch mode         ← measured; no config states it
```

A cost line is the one field with no file to read it off, so it is the one to be most careful about:
measure it or cite the config that sets it. A plausible cost asserted from the runner's reputation is
the failure this shape invites — the sheet is read as derived fact on every later session.
