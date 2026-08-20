# UI — the design is made in Claude Design, the system is owned by the repo

Behind `SKILL.md` → Step 2, *Greenfield UI* **and** *Brownfield UI*. Read it when any UI build starts: greenfield enters at *Bootstrap*, brownfield enters at *Steady state*.

The look is made in **Claude Design**, which invents one better than a plan written in prose and better than any seat here. What the team owns is the **material** it designs with — the repo's real token file and its real components — and the **conformance gate** that keeps a build inside them.

**The design is authoritative.** Every value it settled ships as authored, and the one place a value is ever authored is the repo's token file, transcribed from what came back.

**This practice is React.** The sync converter takes React components (a Storybook or a bare package), so a React repo pushes its **real** components and nothing is authored twice. Other stacks get the token file and its gate and stop there: a Svelte or vanilla build is a one-off, and a one-off carries no design system.

## Who owns what

| | owns |
| --- | --- |
| **Claude Design** | the look, and every value in it |
| `ux-designer` | flows, IA, the screen + state inventory, copy — and **the conventions file**, in both its eras (*The conventions file*, below) |
| the UI builder | the token file, the **conformance gate**, the components, and the bundle's machinery — the sync config, the export surface, the prop contracts, the notes file |
| the user | the design gate — the eye on the render, which is the only design verdict on this team |

## The conventions file

One file, authored by `ux-designer`, and **its content inverts once a system exists**. It is identified by role, not by path: it is whatever `cfg.readmeHeader` points at in the project's `.design-sync/config.json` — conventionally `.design-sync/conventions.md` — and the sync ships it as the bundle's `README.md`, which is the first thing the design agent reads.

- **Before the look exists — the corpus.** The constraints the design agent designs *inside*: decisions a look has to respect, in the product's own terms, one sentence each carrying its reason. Naming a hue, a face or a layout here hands back the one decision the design tool exists to take.
- **After the look exists — the header.** The briefing on the **shipped** system, and it is *majority look on purpose*: the closed token set and what each family is for, the real class names, type/shape/elevation, the fill-vs-ink pairs, voice. The corpus's rule is not just relaxed here, it is reversed — this is the only document that tells the design agent what the system already decided, and a header written under the corpus's rule strips exactly the sections that make the next design composable.

The bundle carries no other prose. `tokens/` and `guidelines/` exist in the bundle layout and are routinely **empty** — the design agent's picture of the system is the compiled stylesheet plus this file, so anything the stylesheet can't show has to be written here or it isn't known.

## Bootstrap — no components exist yet

The first pass runs on the inventory alone, because there is nothing to sync until something is built.

1. **`ux-designer` returns the flow** — flows, IA, the screens and their states. This is what the design is *about*, and it's what makes the design specific rather than generic.
2. **`ux-designer` writes the conventions file, in its corpus era** — the constraints the design agent designs inside, in the product's own terms, one sentence each, each carrying its reason (*there is no green — a green tick is the one colour that means "fine" in a product about money that has not necessarily moved yet*). The shape is the seat's, `ux-designer` → `## Output` #6. Two things to check when it comes back: a corpus of adjectives is the failure mode, and a rule naming a hue, a face or a layout has taken the one decision the design tool exists to take. It is the highest-leverage artifact in the practice, and it is maintained as the product takes decisions rather than written once.
3. **The user carries the inventory + corpus to Claude Design, settles the look there, and brings it back.** Human-in-the-loop, the only stop in the build, and **the design gate** — the look is settled in front of the user at the cheapest point it will ever be settled. Nothing on the team can fetch it. Hand the path over in one line, say plainly you're waiting, and put everything non-styling in flight meanwhile (scaffold, toolchain, data layer).
4. **The builder's Phase 0** — the token file at the destination in the app's own style layer, and **the conformance gate as a deliverable in the same slice**. Then the first components.
5. **Sync** — `/design-sync` pushes those components to the design project, and the conventions file turns over from corpus to header in the same slice. From here on the practice is steady state. Budget for the first push properly: standing up the bundle is its own piece of work (*The bundle*, below), not a command that runs.

## Steady state — the loop

Brownfield starts here, and greenfield lands here after step 5.

1. **Push.** The bundle is built from the tree and synced. Its stylesheet is the repo's own compiled CSS and its component list is the repo's own components; the only prose a person authors is the conventions file, in its **header** era.
2. **Design.** Screens get designed in Claude Design **out of the real parts**. A screen composed from what already exists implies no system change and is the common case — the header steers toward it.
3. **Pull it as a spec.** What comes back is a design, and it lands in a quarantine path for a builder to read.
4. **Land it as an ordinary change** — the component, plus the token or sheet edit it needs, in the repo, by the builder. The repo is the only place the system is ever authored.
5. **Rebuild, resync.** The design project now holds what the repo holds. **Rebuild means the app's stylesheet, not just the bundle** — see below.

**The repo is upstream of every design project, in every direction.** That is the whole design: a design project is downstream, so it is rebuilt from the repo and never merged into it. Merge both ways and you are maintaining a design system in two places, which holds at no size. What the tool produces is a design; what the repo holds is the system. It runs in both senses — a component deleted from the tree comes off the remote on the next resync, so a sync that produces deletes is the practice working, not a mistake to reverse.

## The bundle — what the design agent actually gets

The bundle is a **build product with its own maintenance**, and the practice fails quietly when it's treated as a command that runs. Four facts decide whether a design comes back composable, and none of them is visible from inside a design session.

- **The stylesheet is the app's prebuilt CSS, not the token file.** The bundle ships whatever `cfg.cssEntry` points at — a compiled artifact. Under a JIT engine (Tailwind v4 and kin) that sheet contains **only the utilities the app already writes**: the gaps are not symmetric between axes, arbitrary values exist only where some call site wrote that exact string, and **a missing utility fails silently** — no error, just a rule that doesn't exist and a layout that ignores the design. That constraint is the single most decision-relevant fact for a design session, and the header is the only place it can be stated.
- **That artifact is content-hashed and goes stale.** A new app build changes the filename; a `cfg.cssEntry` still pointing at the old one is skipped, and every preview renders unstyled. Refreshing it is a repo-specific procedure — invoke the framework's builder directly rather than the `build` script, whose lifecycle hooks may do things a sync has no business triggering.
- **Prop contracts are generated, and degrade to nothing by default.** The converter's extractor reads `.d.ts`. A repo whose components live in an app rather than a built package ships none, so every published contract collapses to `[key: string]: unknown` unless something regenerates it from source types. A component published with no props is a component the design agent guesses at.
- **The export surface is hand-maintained and easy to break.** A star-export over a source tree collides (two files exporting `Content`) and drags in assets no loader handles, so the entry file is explicit, one named export per published component, pointing at implementation files and never at directory barrels. It and the config's component map are **one artifact in two files** — regenerate them together.

**The notes file is part of the practice.** Every sync accumulates repo-specific truth that is nowhere else: converter bugs worked around and why the obvious fix is wrong, warnings triaged as expected, components with no intrinsic size, overlays that need opening synthetically, a fixed clock in the capture harness. It lives beside the config (`.design-sync/NOTES.md`), it is the builder's, and it is written **as each thing is discovered**. Skip it and the next sync re-derives all of it from scratch — at full cost, in a fresh context, usually wrong the first time.

## System change — the trip that moves the token file

Most trips round the loop compose a screen out of parts that already exist and settle no new value. A **system change** is the other kind: the token file itself moves. Two things start one — a builder's **named gap**, blocked and reported (*the conformance gate*, below), or a deliberate improvement with nothing blocked, which is the user's to start and enters the loop at step 2. Both run the same five steps; what differs is what step 4 lands and what closes it.

- **The token edit is its own slice, and it lands first.** A value that is retuned, renamed or retired reaches every consumer in the tree, so it goes in ahead of the components that consume it rather than riding along inside one of them.
- **The gate runs over the whole tree on that slice**, not over the components that changed. Whether the rest of the tree still resolves is the question a system change asks, and a repo-wide sweep is what answers it — a name that stopped resolving is a rename that stranded its consumers, and it is a finding on the slice that renamed it.
- **The conventions file moves in the same change**, by `ux-designer`, in its header shape. A header that lags the system sends the next design session at constraints the repo no longer holds, and what comes back is the thing you just replaced.

Then step 5 as ever — rebuild, resync.

## The conformance gate — structural first, test for the rest

Whether a build honors its system is **enforced, not reviewed**. Two mechanisms, and the first is the cheaper one:

- **Structural — the build makes an off-system value have no rule at all.** A Tailwind v4 theme that zeroes the default palette (`--color-*: initial`) leaves `gray-500` and `red-600` matching nothing; a stylesheet compiled from the app's own source leaves an off-ladder step matching nothing. Nothing to run, nothing to skip, and the closed set is enforced by the same artifact that ships. Reach for this wherever the stack offers it, and say in Phase 0's return which half of the system it covers.
- **Test — the sweeps the build can't make impossible.** In the repo's own runner, at every commit. **Values**: every colour, length, type bundle, radius, duration and easing in a screen resolves to the token file; a literal is a finding. **Names**: every class the components write is one the real sheets draw. Both return findings rather than asserting them — a finding carries the file and the name, which a caller's `expect(...).toEqual([])` already prints.

The **names** sweep is the one nothing else catches. A class name borrowed from another system — `btn-outline` where the recipe list is closed at `btn-primary`/`-secondary`/`-ghost`/… — has no rule, paints nothing, throws no error, and still reads as correct in a diff and in review. Structural enforcement doesn't help: not existing *is* the failure mode.

A value the system cannot express is a **named gap** — reported, never invented. It routes to the **user**, with the token name it would need. One line, not a round trip.

A gate runs in no context window, at every commit, and can't be skipped because the review batch was busy.

## Contrast — the design settles it, the system records it, the gate holds it

Three different things, and collapsing them is what makes this rule look like it forbids the ledger.

- **Settling a pair is the design's**, and that pair ships as authored. No seat re-derives one, overrides one, or argues one under an a11y heading. Where a conformance *claim* is needed — procurement, public sector — that is a person with a tool, outside this team.
- **Recording what was settled is the system's.** A mature token file has a ledger beside it saying what each token is *for* and which pairs are legible as text, ratio included, because the distinction between a **fill** and an **ink** is the single largest source of drift and no reader can recover it from the values. Those numbers are measurements of decisions already taken, written once, and they are what the header carries into the next design session. Recording a ratio is not computing a verdict.
- **Using a pair as authored is conformance**, and the gate's business. A fill token spent as a text colour — a warning fill on a body line, or a tint paired with its own full-strength ink — is not a design decision anyone took; it is a component reaching past the surface-and-ink pair the system authored for exactly that case. That is a **names/values** finding on the same footing as any other. (The token names differ per system; the failure doesn't.)

What stays banned is a **review seat computing a ratio to overturn a design**: `accessibility-reviewer`, `visual-reviewer`, `ux-auditor` and `ux-designer` report structure — keyboard operability, focus order and visibility, target size, name/role/value, error identification — and name 1.4.3/1.4.11 unassessed so a clean run never reads as full AA.

## Reviewing the built UI

The design project renders its own cards from the real components at build time, so the review artifact is a function of the tree rather than something anyone hand-writes.

What runs, and when:

- **Every commit, mechanical:** the gate above — whatever the build enforces structurally, plus the sweeps in the suite.
- **At Step 4, in the parallel batch:** `visual-reviewer` (the rendered states nobody opens — empty, error, loading, disabled, focus-visible, 375, content extremes — and the `file:line` behind a defect), `accessibility-reviewer` (structural, per above), `ux-auditor` on a named flow.
- **Still the user's, still not yours:** the look. The passes measure and walk; the verdict on whether the design is any good stays a human glance.

## Team defaults (greenfield only)

Applied when scaffolding a new project; brownfield always matches the existing repo instead.

- **Package manager (JS/Node): `pnpm`** — install, scripts, lockfile (`pnpm-lock.yaml`). Don't emit `package-lock.json`/`yarn.lock`. N/A for non-JS stacks.
- **UI stack: React**, on the framework the brief names. A greenfield build that needs a design system is a React build (*This practice is React*, above).
