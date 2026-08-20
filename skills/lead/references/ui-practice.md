# UI — the design is made in Claude Design, the system is owned by the repo

Behind `SKILL.md` → Step 2, *Greenfield UI* **and** *Brownfield UI*. Read it when any UI build starts: greenfield enters at *Bootstrap*, brownfield enters at *Steady state*.

The look is made in **Claude Design**, which invents one better than a plan written in prose and better than any seat here. What the team owns is the **material** it designs with — the repo's real token file and its real components — and the **conformance gate** that keeps a build inside them.

**The design is authoritative.** Every value it settled ships as authored, and the one place a value is ever authored is the repo's token file, transcribed from what came back.

**This practice is React.** The sync converter takes React components (a Storybook or a bare package), so a React repo pushes its **real** components and nothing is authored twice. Other stacks get the token file and its gate and stop there: a Svelte or vanilla build is a one-off, and a one-off carries no design system.

## Who owns what

| | owns |
| --- | --- |
| **Claude Design** | the look, and every value in it |
| `ux-designer` | flows, IA, the screen + state inventory, copy — and `design/conventions.md`, the corpus the design agent designs inside |
| the UI builder | the token file, the **conformance gate**, the components, the sync bundle |
| the user | the design gate — the eye on the render, which is the only design verdict on this team |

## Bootstrap — no components exist yet

The first pass runs on the inventory alone, because there is nothing to sync until something is built.

1. **`ux-designer` returns the flow** — flows, IA, the screens and their states. This is what the design is *about*, and it's what makes the design specific rather than generic.
2. **`ux-designer` writes `design/conventions.md`** — the constraints the design agent designs inside: the decisions a look has to respect, in the product's own terms, one sentence each, each carrying its reason (*there is no green — a green tick is the one colour that means "fine" in a product about money that has not necessarily moved yet*). The shape is the seat's, `ux-designer` → `## Output` #6. Two things to check when it comes back: a corpus of adjectives is the failure mode, and a rule naming a hue, a face or a layout has taken the one decision the design tool exists to take. It is the highest-leverage artifact in the practice, and it is maintained as the product takes decisions rather than written once.
3. **The user carries the inventory + conventions to Claude Design, settles the look there, and brings it back.** Human-in-the-loop, the only stop in the build, and **the design gate** — the look is settled in front of the user at the cheapest point it will ever be settled. Nothing on the team can fetch it. Hand the path over in one line, say plainly you're waiting, and put everything non-styling in flight meanwhile (scaffold, toolchain, data layer).
4. **The builder's Phase 0** — the token file at the destination in the app's own style layer, and **the conformance gate as a deliverable in the same slice**. Then the first components.
5. **Sync** — `/design-sync` pushes those components to the design project. From here on the practice is steady state.

## Steady state — the loop

Brownfield starts here, and greenfield lands here after step 5.

1. **Push.** The bundle is built from the tree and synced. Its stylesheets are the repo's own files and its component list is the repo's own components; what a person authors is `conventions.md` and nothing else.
2. **Design.** Screens get designed in Claude Design **out of the real parts**. A screen composed from what already exists implies no system change and is the common case — `conventions.md` steers toward it.
3. **Pull it as a spec.** What comes back is a design, and it lands in a quarantine path for a builder to read.
4. **Land it as an ordinary change** — the component, plus the token or sheet edit it needs, in the repo, by the builder. The repo is the only place the system is ever authored.
5. **Rebuild, resync.** The design project now holds what the repo holds.

**The repo is upstream of every design project, in every direction.** That is the whole design: a design project is downstream, so it is rebuilt from the repo and never merged into it. Merge both ways and you are maintaining a design system in two places, which holds at no size. What the tool produces is a design; what the repo holds is the system.

## System change — the trip that moves the token file

Most trips round the loop compose a screen out of parts that already exist and settle no new value. A **system change** is the other kind: the token file itself moves. Two things start one — a builder's **named gap**, blocked and reported (*the conformance gate*, below), or a deliberate improvement with nothing blocked, which is the user's to start and enters the loop at step 2. Both run the same five steps; what differs is what step 4 lands and what closes it.

- **The token edit is its own slice, and it lands first.** A value that is retuned, renamed or retired reaches every consumer in the tree, so it goes in ahead of the components that consume it rather than riding along inside one of them.
- **The gate runs over the whole tree on that slice**, not over the components that changed. Whether the rest of the tree still resolves is the question a system change asks, and a repo-wide sweep is what answers it — a name that stopped resolving is a rename that stranded its consumers, and it is a finding on the slice that renamed it.
- **`conventions.md` moves in the same change**, by `ux-designer`, in the corpus's own shape. A corpus that lags the system sends the next design session at constraints the repo no longer holds, and what comes back is the thing you just replaced.

Then step 5 as ever — rebuild, resync.

## The conformance gate is a deliverable, not a review pass

Whether a build honors its system is a **test**, written in Phase 0 and run at every commit. Two sweeps:

- **Values** — every colour, length, type bundle, radius, duration and easing in a screen resolves to the token file. A literal is a finding.
- **Names** — every class the components write is one the real sheets draw. A name nothing draws paints nothing and still looks correct in review, which is why a test catches it and a person does not.

Both return findings rather than asserting them: a finding carries the file and the name, which a caller's `expect(...).toEqual([])` already prints.

A value the system cannot express is a **named gap** — reported, never invented. It routes to the **user**, with the token name it would need. One line, not a round trip.

A gate runs in no context window, at every commit, and can't be skipped because the review batch was busy.

## Contrast ships as authored

The design decided every pair, and that pair is what ships. No seat on this team computes a ratio. Where a conformance *claim* is needed — procurement, public sector — that is a person with a tool, outside this team.

`accessibility-reviewer` keeps everything structural: keyboard operability, focus order and visibility, target size, name/role/value, error identification. Those are build defects. Colour is a design decision.

## Reviewing the built UI

The design project renders its own cards from the real components at build time, so the review artifact is a function of the tree rather than something anyone hand-writes.

What runs, and when:

- **Every commit, mechanical:** the two sweeps above.
- **At Step 4, in the parallel batch:** `visual-reviewer` (the rendered states nobody opens — empty, error, loading, disabled, focus-visible, 375, content extremes — and the `file:line` behind a defect), `accessibility-reviewer` (structural, per above), `ux-auditor` on a named flow.
- **Still the user's, still not yours:** the look. The passes measure and walk; the verdict on whether the design is any good stays a human glance.

## Team defaults (greenfield only)

Applied when scaffolding a new project; brownfield always matches the existing repo instead.

- **Package manager (JS/Node): `pnpm`** — install, scripts, lockfile (`pnpm-lock.yaml`). Don't emit `package-lock.json`/`yarn.lock`. N/A for non-JS stacks.
- **UI stack: React**, on the framework the brief names. A greenfield build that needs a design system is a React build (*This practice is React*, above).
