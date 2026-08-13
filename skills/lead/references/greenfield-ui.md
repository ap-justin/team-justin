# Greenfield UI — the design is made in `claude-design`, the system is formalized in the repo

The full sequence behind `SKILL.md` → Step 2, *Greenfield UI*. Reached only on a greenfield UI build; brownfield has no design hop and never loads this.

A greenfield UI is **not built and then designed**. The look is made in **`claude-design`**, which is far better at inventing one than a plan written in prose; `design-director` briefs it on brand and feel, formalizes what comes back into the repo's token contract, and stewards it from there. A UI builder then renders that system as a **real token file plus a static gallery**. The gallery is plain semantic HTML + CSS that opens straight from disk, so it's on screen before the app can boot and a change to it is a token edit rather than a component refactor. The gallery is also the screen you show for feedback — unlike a scaffold it's the artifact the real tokens already live in, so nothing built to get feedback has to be undone.

## The order, and who hands to whom

1. **The user** brings the subject.
2. **You** scope it (Step 2, grilling per Step 2.5).
3. **`ux-designer` returns the user flow** — flows, IA, the screens and their states. This is what the design work is *about*; it's upstream of styling and it's what makes the brief specific instead of generic.
4. **`design-director` returns a direction brief** at `design/claude-design-brief.md` — brand and feel, dials, the element vocabulary the flow implies, and the hard floors (the token contract, light+dark, AA, 375, a named state ladder on every interactive element). **It deliberately does not decide palette, type, layout, or the signature** — those are `claude-design`'s, and a brief that pre-decides them wastes the handoff.
5. **The user carries the brief to `claude-design`, iterates on the look there, and brings the result back.** This is a **human-in-the-loop stop, and the only one in the build** — nothing on the team can fetch that design. Hand the user the path in one line, say plainly that you're waiting on the design, and put the rest of the worklist in flight meanwhile (scaffold, toolchain, data layer — anything not styling). **This is also the design gate**: the look is settled in front of the user, at the cheapest point it will ever be settled.
6. **`design-director` formalizes it** — the token spec (transcribed, not re-decided) against the destination in this stack's own style layer, the coverage manifest `design-system.md` beside it, the gap list split into what goes back to `claude-design` versus what the director authors, and the floor violations it corrected. It records the `## Design system` pointer as always.
7. **The UI builder builds the system before it builds any screen** — its Phase 0. Tokens into the destination named; `design/gallery/*.html` importing that same file rather than restating it; one page per element group, every state on the manifest, at 1440 and 375. It ships in **slices** — buttons, then forms, then feedback — because each page stands alone and reviews alone.
8. **`design-director` coverage-checks the gallery against its own manifest** — mechanical, coverage only, never direction, so it goes in **the same parallel batch as the gallery-complete screen passes** below, never as a step anything waits behind. There is no second design gate here: the look was settled at step 5, and the gallery is the coverage artifact, not a re-opening of it. It returns either "nothing to add, dispatch" (one line, the common answer) or the gaps phrased as the builder's next slice, never a value it filled in itself.
9. **Then feature work dispatches** — domain screens composed from the vocabulary against `ux-designer`'s inventory. Composition is the builder's engineering work; what it may not do is reach outside the token file for a value (*Conformance is prevented, not detected*, `SKILL.md` Step 3).
10. **The gallery retires per-element, as real components land.** In the same change that builds the component for an element, the builder deletes `design/gallery/<element>.html` and adds that element to an in-app `/_design` route mounting the **real** component in every state on the manifest, then reports it so `design-director` ticks the ledger. The route can't drift — it renders what the product renders — where static HTML duplicating a shipped component silently can. When the last page goes, `design/` goes with it; the token file never moved, so nothing migrates.

## Reviewing `design/` while it's still being built

The gallery is the cheapest review target this project will ever have — one static page per element group, no auth, no seed data, no dev server, every state visible at once — and a defect found there is a defect in a **token**, fixed once, rather than the same defect found later in nine components. What runs against it:

- **Per slice, yours:** the builder's Phase 0 self-check comes back in its return — every value in the gallery a `var(--token)`, literals only in the token file. It's a grep, it's cheap, and at this stage it *is* the whole conformance story. A slice that returns without it isn't reviewed.
- **Once, yours:** the step 8 coverage check above.
- **At gallery-complete, yours to dispatch — and this is the cheapest they will ever be:** `taste-reviewer`, `accessibility-reviewer` and `visual-reviewer`, in one parallel batch (Step 4). Every finding here is a finding about a **token**, so it's fixed once instead of at nine call sites later, and `visual-reviewer` especially earns it — the gallery is static HTML, so there's no dev server, no auth and no seed data standing between it and **every state at once**, which is exactly the half of a real app it usually can't reach; a state that breaks here breaks in the system rather than in one page that happens to use it. Run them **before** feature work dispatches.
- **Still the user's, still not yours:** the look itself (step 5, in `claude-design`) — the passes measure and grep, they don't tell you whether the system is any good.

## Team defaults (greenfield only)

Applied when scaffolding a new project; brownfield always matches the existing repo instead.

- **Package manager (JS/Node): `pnpm`** — install, scripts, lockfile (`pnpm-lock.yaml`). Don't emit `package-lock.json`/`yarn.lock`. N/A for non-JS stacks.
