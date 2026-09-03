---
name: deploy
description: Mint this repo's team block — derive its standing answers and write them into .claude/CLAUDE.md. Re-run to re-derive.
disable-model-invocation: true
argument-hint: "[repo path — omit for cwd]"
---

The plugin is the **fractional CTO**: one practice, carried across every engagement. What it cannot
carry is the engagement itself — this stack, this token file, this gate, this machine. Those are
**answers**, and a session that re-derives them every time pays twice: once reading the repo, and
again in the routing deliberation it spends reaching a conclusion this repo settled long ago.

This skill runs that derivation once and writes the answers into the repo's `.claude/CLAUDE.md`,
which loads on every session there with nothing typed. The block is deliberately thin — a pointer at
`team-justin:lead` plus the sheet — because *how the team works* is needed only once work starts,
while *who is on the team here* is what tells a session there is a team at all.

## Do

### 1. Derive the sheet
Read the repo. Every line **cites what it came from**: a line with no derivation is a guess, and a
re-run has no way to check it.

| Field | Derive from | What it retires |
|---|---|---|
| seat pointers | the repo's dependency manifests and lockfile, run through **`${CLAUDE_PLUGIN_ROOT}/references/routing.md`** | that table, on every later session |
| project seats | `.claude/skills/*`, `.claude/agents/*` | seats this plugin has no way to know exist |
| `tokens` | the design system's file, and the gate that closes it (hook config, test script) | a builder's hunt for the `## Design system` pointer — and the from-scratch design chain, since a system already exists |
| `screens` | whether this repo renders UI, and what starts its dev server | the screen passes and the design gate |
| `test` | the runner, its command, and **what a run costs** | rediscovering the repo's testing conventions |
| `verify` | typecheck and lint commands | the behavior gate's generic form |
| `not here` | every seat in `${CLAUDE_PLUGIN_ROOT}/ROSTER.md` with no footing in this repo | routing deliberation over stacks that are absent |

**Cost is a field.** A runner that spawns a browser per test file, a suite that takes ten minutes, a
machine that swaps under a fan-out — none of it is knowable from the plugin, and it decides whether a
coverage sweep is a scoped run or a stalled one. Where a cost binds, write the bound.

Prefer a **project seat** over a plugin seat wherever the two overlap: a repo that wrote its own skill
for its own subsystem knows something the plugin does not.

Completion: every field carries a value with its derivation, or is absent — because this repo has no
answer for it, or because the repo's own docs already are the answer (step 2).

### 2. Read what the repo already says
Open the repo's `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*` and `AGENTS.md`. Everything there
is **already loaded alongside your block**, so a line you repeat is paid for twice and drifts from
whichever copy is edited first. Derive from those files; restate nothing in them.

Completion: the sheet answers nothing the repo's own always-loaded files answer.

### 3. What earns a line in the block
The block is **always-loaded context** in every session in that repo, so it is held to
`writing-for-agents` at its strictest — the two loads, the cache rule, and the no-op test
(`${CLAUDE_PLUGIN_ROOT}/skills/writing-for-agents/SKILL.md`). Four bars, and a line clears all four
or it stays out:

1. **The environment is a source of truth; a line restating it is a cache.** A cache earns its load
   only when the lookup is expensive. `pnpm test` sitting in `package.json` is a one-file lookup and
   stays there — unless the sheet is adding what the file can't say (what the run *costs*). A **seat
   pointer** earns its line for the opposite reason: reaching it means running a routing table over
   the manifest, which is exactly the expensive lookup a cache is for.
2. **No line that would read the same in every repo.** That is a no-op paying rent — it changes no
   behavior against the default, and the model already had it from the plugin.
3. **The pointer line is a pointer, and its wording is what fires it.** Front-load the leading word,
   name one trigger per branch, and cut identity the target already carries.
4. **Every line cites its derivation**, which is what makes the cache checkable on a re-run.

Completion: each line names an expensive lookup or an unwritten fact, and none restates the plugin,
the repo's own docs, or the environment.

### 4. Assemble
`${CLAUDE_PLUGIN_ROOT}/skills/deploy/block.md` is the shape: constant prose, then the sheet, between
one pair of markers.

```
<!-- team-justin vX.Y.Z · /team-justin:deploy · re-run to re-derive -->
…
<!-- /team-justin -->
```

The markers are what make a re-run an edit rather than a second copy. Rewrite between them and leave
every other line of the file as it stands.

### 5. Confirm, then write
`.claude/CLAUDE.md` is checked in and read by everyone who clones the repo — teammates without this
plugin included. Show the block, name the file it lands in, and write on the user's OK.

Completion: the file holds exactly one marked block, and the user has seen what went in it.

### 6. Report
The seats this repo runs, the seats it does not, and anything the derivation turned up that the repo
had never written down. One paragraph, in the user's vocabulary.

Completion: every line that went in the block is accounted for in what you said, and every line the
bars deleted is named with the file that already answers it.

## Re-run — the block's only update path
A block goes stale from two directions and one verb settles both, because it is a function of
*(plugin version × repo state)* and re-deriving from scratch answers either.

- **The repo moved** — a dependency swap, a new gate, a design system where there was none. The
  citations are the signal: a derived line that no longer matches disk is a line to re-derive.
- **The plugin moved** — `/roster learn` promoted a preference, a seat was hired or renamed. The
  stamp is the signal: a block stamped below the installed `VERSION` is behind.

## The line between the plugin and the block
The block holds the **engagement**; the plugin holds the **practice**. A rule that would still be true
in the next repo belongs upstream — `/team-justin:remember` files it and `/roster learn` gates it
(`${CLAUDE_PLUGIN_ROOT}/PREFERENCES.md`). A rule true only here stays in the block.

The plan store stays outside the working repo, its pointer included
(`${CLAUDE_PLUGIN_ROOT}/TRACKER.md`): the block describes the repo, never where the repo's plans live.
