---
name: visual-review
description: Measurement pass on the rendered UI in a live browser — computed contrast, rects, overflow, off-scale values, tap targets, missing states, across viewports and interactive states, plus an outside eye (a second model reads the same screenshots). Dispatched to a spawned agent so the main thread stays free. Reports numbers and labelled proposals, never a verdict on design intent. Report-only.
disable-model-invocation: true
argument-hint: "[url or pages/states]"
---

You now review the UI as it actually renders — not the source. The `/taste-review` pass reads component/CSS source for templated slop; this pass drives a real browser.

## What this pass is for — measure what an eye can't
**A browser is better than a person at measuring and worse at judging.** It can tell you a contrast ratio is 3.9:1, that the page scrolls horizontally at 375, that a tap target is 31px, that a gap is 14px against a 16px scale, that focus never becomes visible. It cannot tell you whether the build *looks like the design* — that's a judgment a person makes in a glance and an agent burns twenty minutes failing to reach. **Don't attempt it.** Conformance is prevented at the handoff (an authoritative token file plus a brief that closes the set), enforced statically in source by `/taste-review`, and judged by the user. This pass supplies numbers, not verdicts on intent.

So: every finding here is something **measured or plainly visible in a capture** — a ratio, a rect, an overflow, a missing state. If you catch yourself writing "feels off," "doesn't quite match," or "could be more refined," delete it; that's the user's call and you're guessing at it. The one thing that *does* carry an impression is the **outside eye** below — a different model's read of the same screenshots, routed as a labelled proposal rather than laundered into a measured finding.

**Target**: `$ARGUMENTS` if given (URL, pages, specific states/viewports); otherwise the running dev server's pages touched by the current build. Read the `CLAUDE.md` `## Design system` pointer and the token file it names before sweeping — not to certify intent, but because **the scales are what make a measurement a finding**: 14px is only wrong once you know the scale step is 16.

- Report-only: report findings with their evidence (screenshot/measurement + severity), unsoftened. Apply fixes only when the user asks after reading the report.

## Dispatch — spawn the sweep, never run it in the main thread
The sweep is browser-driven and pins a thread for minutes (viewport drives, screenshots, measurements); the main thread must stay free for the user. After gathering the target + intent context above, spawn the **`visual-reviewer`** agent with a prompt carrying: the target (URL/pages/states/viewports), the intent context (design plan / token pointer / user-named states), and the project-scoped session name (`bg-$(basename "$PWD")`). Relay the returned report unedited. Everything below is the sweep body that seat executes.

**Two callers, one body.** The user runs `/visual-review` and lands here; the lead dispatches `visual-reviewer`, which reads this same file and executes from *Drive the browser via local-browser* down (it skips this section — it *is* what gets dispatched, and subagents can't spawn subagents). `disable-model-invocation` still holds on the skill, so the slash command stays the user's front door and nothing fires this ambiently. **What neither caller gets is a verdict on intent** — dispatching this pass buys numbers, never a judgment about whether the build matches its design (see *What this pass is for* above).

## Drive the browser via local-browser
Invoke and follow the **`local-browser`** skill — it wraps `agent-browser` with a persistent session. Its rules bind you:
- **The dev server must already be running — never start it.** If nothing responds at the target URL, stop and ask the user to start it.
- **Scope `--session-name` to the project** (`bg-$(basename "$PWD")`) — each named session is a separate browser instance, so review runs across concurrent projects stay isolated instead of stomping a shared one. `--headed` so the user can intervene (login/2FA); reuse the same session name for every command in the run.
- Re-snapshot after any navigation/DOM change (refs expire).

Measure, don't only eyeball — `agent-browser eval` (IIFE + `eval --stdin` heredoc for complex JS) gives you ground truth:
```bash
# measured evidence beats "looks off": rects for alignment/overflow, computed styles for contrast/tokens
agent-browser eval "JSON.stringify([...document.querySelectorAll('.card')].map(el=>el.getBoundingClientRect()))"
```
Capture screenshots to files and `Read` them for the vision pass. Every finding cites **either** a screenshot **or** a measurement — ideally both.

## Scope the sweep before you start — breadth is what makes this pass expensive
The full matrix is pages × viewports × states, and driven literally it runs for tens of minutes and returns the same finding many times. Cut it before the first screenshot:
- **One representative page per layout family gets the full matrix** — every viewport, every state. Pick the densest instance of each family (a form page, a list/table page, a detail page, the marketing hero). Every *other* page gets a targeted check only: does it overflow at 375, does its own unique content render.
- **Chase a systemic cause once, then stop enumerating.** A misalignment that appears on every route is one finding — a shared header, a token, a root `font-size` — not one per route. The moment a defect traces to something global, trace it to source, name the cause, state its scope ("all 7 admin routes"), and move on. Re-confirming it route by route is the single biggest way this pass burns time for no new information.
- **Measure the global things once per viewport, not per page**: root font-size and the rem scale, the container/measure width, the type ramp, the palette's computed values. They don't change between routes.
- **Don't re-derive what source can tell you faster.** When a measurement is off, one `Grep` for the token or the class usually gives the cause in a step; iterating screenshots to infer it does not.
- **Say what you skipped** in the report (see *Output*). A bounded sweep that names its bounds is honest; a bounded sweep presented as exhaustive is worse than either.

## Sweep — for each target page/state
1. **Viewports**: desktop (~1440), tablet (~768), mobile (~375). Set each by **emulation** — `agent-browser set viewport <w> <h>` (or `set device "iPhone 16 Pro"` for mobile DPR/touch fidelity), **never by resizing the window**. Headed Chrome can't shrink past a ~400–500px min-width floor (worse with tabs open), so a physical resize clamps and silently renders the wrong width; `set viewport 375 …` renders a true 375px CSS viewport inside a full-size window. 375 is the mobile **floor** — no real phone is narrower; don't test 320/360 widths. Screenshot each.
2. **Interactive states**: hover, focus, active, disabled, loading, empty, and error — not just the happy render. Drive them via snapshot+click/fill; capture each.
3. **Check the rendered values against the scales** — the one intent-adjacent check that *is* a measurement. Computed spacing, type sizes, radii and colors either land on a step in the token file or they don't; an off-scale value is a finding with a number attached ("gap computes to 14px; nearest steps are 12 and 16"). That's the limit. **Do not extend it into whether the composition is the right one** — "this should have been stacked cards, not a carousel" is a judgment about intent, and you are the wrong reader for it: report the structure you measured if it's useful, and leave the verdict to the user. If no token file exists, say so — off-scale is unmeasurable without a scale, and you're down to defects only.

## The outside eye — a second model reads the same screenshots
The captures are already on disk, so a different model can read them for the price of one API call. That is the whole value: the reviewing model is **not the model that built the page**, so it isn't marking its own homework — and it answers "what does this look like" in seconds, which is the question a browser sweep can't reach at all.

```bash
npm --prefix "${CLAUDE_PLUGIN_ROOT}" run vision-review -- \
  --shots <capture>,<capture> --labels "home @1440,home @375" \
  --context "<what this screen is supposed to be, one or two sentences>" \
  --tokens <the project's token file>
```

Needs `GOOGLE_API_KEY` (the same Google AI Studio key `gen-asset` uses) and `npm --prefix "${CLAUDE_PLUGIN_ROOT}" install` on first run. Unset key, or a failed call → say so in the coverage line and finish the sweep without it. **Write only a read you actually got.**

It returns three sections and no verdict — `SAW` (how the screen reads at a glance), `DEFECTS` (plainly visible breakage), `UNSURE`:
- **`DEFECTS` are leads, not findings.** Confirm each one yourself in the capture or with an `eval` before it enters your report; a confirmed one becomes an ordinary finding carrying *your* evidence, never the model's say-so, and routes to the builder in the same fix list as everything else. What you can't confirm goes into the coverage line as raised-and-unconfirmed.
- **`SAW` and anything verdict-shaped route too — as proposals**, in their own short quoted section marked as the outside model's read. They reach the lead and the builders like any other finding: the **user is the commit gate**, so a cheap reversible fix taken off a second model's read costs a diff they can reject, and holding it back just makes them the messenger.
- **Gate on blast radius, not on who saw it.** A one-line or token-level fix is the lead's to make. A change to the token system, the page's composition, or a direction already settled is **proposed and named**, never executed off an impression — that's the difference between fixing what an outside eye caught and letting it redesign the build.
- **It supplies no numbers.** A vision model can't compute a contrast ratio or a gap from a raster. Anything measurement-shaped is yours to measure or to drop.
- **Send the few shots that carry the sweep** — the representative page per layout family at each viewport, plus any state that looked wrong. The full matrix costs more than the sweep that produced it, and the script refuses a count past its cap rather than billing you for one.

## What to catch (cite viewport + evidence, assign severity)
- **Layout & alignment**: misaligned edges/baselines, inconsistent gaps vs the spacing scale, orphaned/overlapping elements, broken grids. Prove with rects.
- **Overflow/clipping**: horizontal scroll at any breakpoint, clipped text/controls, content escaping containers, `100vh` vs `100dvh` mobile cutoff.
- **Responsive**: does each breakpoint reflow correctly? tap targets ≥ ~44px on mobile? no desktop layout leaking into mobile?
- **Contrast & legibility (WCAG AA)** — the **composed** cases only, where what rendered isn't what the token file authored: ghost buttons and text over images or gradients, inherited or opacity-stacked color, a pair the build assembled that the system never authored. Compute from `getComputedStyle`, don't guess. An **authored** token pair failing AA is a system defect — one finding, routed to `design-director`, never re-argued per element — and the criterion number belongs to `/accessibility-review`, so hand it there rather than tabling ratios yourself.
- **State completeness**: missing focus ring, no loading indicator, empty/error states unstyled or absent, layout shift (CLS) between states.
- **Motion/a11y**: `prefers-reduced-motion` honored; keyboard focus visible and ordered; no motion-only affordances.
- **Asset render**: blurry/stretched images, wrong aspect ratio, missing art, icon misalignment.

Map to a `file:line` when you can trace the offending element back to source (Grep the class/testid); otherwise cite the selector + viewport.

## Output
- Per finding: `SEV(high|med|low) — <what>` + viewport + evidence (screenshot path and/or measured value) + concrete fix (e.g. "gap is 14px, scale step is 16px" — not "tighten spacing"). Note confidence.
- **Systemic findings lead, and carry their cause and scope**: "root `font-size` is 15px (`app.css:12` shorthand), so every rem is 6.25% short — affects the whole type and spacing scale" beats seven per-route alignment reports of the same thing. One entry, `file:line`, scope named.
- Passing dimensions: one line, grouped. Don't invent defects to look thorough; a clean render gets said plainly.
- **Outside eye**: its `SAW` block quoted in its own short section, unedited, naming the model that wrote it and marked as a proposal rather than a measured finding. Its `DEFECTS` appear only as findings you confirmed yourself, carrying your evidence like any other; the rest go to the coverage line.
- **Coverage line** — what you actually swept and what you didn't: pages given the full matrix vs. the targeted check, states you couldn't reach (behind auth, needs seed data), anything the browser wouldn't render, whether the outside eye ran and what it raised that you couldn't confirm. An unstated skip reads as a pass.
- End with a verdict: **SHIP** (no high/med) or **FIX** (blocking findings, priority order).

## Boundary
Measurable properties of the rendered page, plus the outside eye's read carried through as a labelled proposal. **Whether the build matches its design is not in scope** — that's the user's glance, and it's prevented upstream by a closed handoff rather than detected here. Correctness → `code-reviewer`; structure → `architecture-reviewer`; static slop, anti-templating, and **values that aren't in the token file** → the `/taste-review` pass (greppable, and much cheaper there than in a browser). Visual-regression baseline diffing (Percy/Playwright snapshots) is a CI concern, out of scope here.
