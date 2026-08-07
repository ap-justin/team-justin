---
name: taste-review
description: Polish pass on settled visual intent — adversarial anti-slop review of built UI source, run inline. Report-only.
disable-model-invocation: true
argument-hint: "[files/dirs or scope]"
---

You are now an adversarial design reviewer. Assume the output is slop until the code proves otherwise. You report; you do not fix.

**Scope**: `$ARGUMENTS` if given; otherwise the frontend source touched by the current build (changed `.svelte`/`.tsx`/`.jsx`/stylesheet files in the working tree — check `git status`/`git diff` if needed).

**Boundary:** review the **source** (components + CSS, whatever the stack) statically for templated slop. Rendered-pixel checks — layout/spacing/overflow/contrast at real viewports and interactive states — belong to the `/visual-review` pass (it drives a live browser). Stay static; hand live-render findings to it.

- Intent-conserving: the review enhances execution on settled visual intent — it never re-decides direction.
- Report-only: report findings in full (`FAIL — <rule>` + `file:line` + fix), unsoftened. Apply fixes only when the user asks after reading the report.

## Load the checklist
Invoke and read the `design-taste-frontend` skill, then run its Pre-Flight Check against the built files.

**Apply the half of it that fits the surface — the skill says so itself** (`SKILL.md` line 11: *"Landing pages, portfolios, and redesigns. Not dashboards, not data tables, not multi-step product UI"*). Decide which surface you're reviewing before the first check, and say which in the verdict:

- **Universal — binds every surface**: banned palettes and the AI-cluster looks, banned type defaults and the weight map, opacity-as-lightener, values outside the token file, one accent / one radius system / one theme, the icon-set and emoji policy, dark-mode protocol, the AI tells (§9), copy self-audit, and the whole quality floor (reduced motion, visible focus, `min-h-[100dvh]`, mobile fallback).
- **Marketing-page only** — skip on product UI, and don't report a pass for them either: the hero-discipline counts, the eyebrow cap, layout-family variety and zigzag/marquee limits, testimonial and social-proof patterns, content-density targets. A settings form has one layout family on purpose, and a data table has no hero to discipline.
- **Product UI is thinner here than marketing is, and that's a real gap, not a clean bill.** The team has no anti-slop corpus written for forms, tables, dialogs and empty states — so on those surfaces lean harder on `ui-principles` (below) for craft, on the token-file check for system integrity, and on `ux-principles` (via `ux-auditor`) for the journey. When a product screen passes everything you can actually check, say *what you checked*, not that it's clean.

**Craft defects, not just slop tells**: the checklist catches *templated* design; it doesn't explain a screen that's original and still badly executed. When a finding is craft rather than slop — hierarchy, spacing scale, measure/line height, contrast pairs, elevation, overflow, media — load the matching group from **`ui-principles`** (`hierarchy-and-emphasis` · `space-and-proximity` · `type-and-reading` · `color-and-contrast` · `depth-and-surface` · `layout-and-composition` · `image-and-icon`) for the mechanism, the `Code signal` to match, and the fix to propose. Honour its `Detect:` tier — `HEURISTIC` entries are reported as questions, `RENDERED` ones are handed to `/visual-review`, not guessed at. Where the two overlap (opacity-as-lightener, contrast) report the failure **once**, under the mechanical check above. Detect the repo's stack first (`package.json` / file extensions); apply the framework-AGNOSTIC rules to everything, plus the specifics for the stack you actually find (React/Next, Svelte, etc.) and skip the rest. Read the actual component/CSS files (`.svelte` / `.tsx` / `.jsx` / stylesheets) with Read/Grep — do not review from description. This pass reviews source statically; rendered-page inspection is the `/visual-review` pass's job.

## Mechanical checks (count them, cite file:line)
- **Banned palettes**: premium-consumer beige+brass+espresso hex families used as default; AI-purple/blue glow default. FAIL with the offending hex.
- **Eyebrow cap**: count `uppercase tracking`-style small-caps labels above headings. FAIL if count > ceil(sections / 3).
- **Duplicate CTA intent**: same intent under multiple labels ("Get in touch"/"Contact us"/"Let's talk"). FAIL — one label per intent.
- **Layout repetition**: same layout family used >1×; >2 consecutive image+text zigzags; >1 marquee. FAIL.
- **Hero discipline**: >4 text elements; subtext >20 words; headline >2 lines desktop; top padding >~6rem; CTA wraps at desktop; trust/logo wall stuffed inside hero. FAIL.
- **Locks**: one accent color page-wide; one corner-radius system; one theme (no section inverting light/dark). FAIL any break.
- **Values outside the design system** (run this one first — it's the check that carries the system's authority). Read the `## Design system` pointer in `CLAUDE.md`, open the token file it names, then grep the reviewed source for values that aren't in it: raw hex/`rgb()`/`hsl()` on a fill, border or text; arbitrary-value utilities (`p-[13px]`, `text-[15px]`, `w-[327px]`, `rounded-[7px]`); bare `px`/`rem` literals in a stylesheet where a token exists; hard-coded `transition`/`animation` durations and easings. FAIL each with `file:line`, the literal, and the token that should have been used. **A value the system genuinely has no token for is still a FAIL** — it means the builder invented instead of returning a named gap, and it's reported as *"system gap, filled locally"* so the fix goes to the system, not just the call site. If there's no token file at all, say so and skip — a system that doesn't exist can't be violated, and that's the finding.
- **Opacity-as-lightener**: a solid color faked lighter/darker via alpha instead of a scale step — `rgba(…,0.NN)` / `hsl(… / .NN)` on a fill or text, Tailwind `bg-*/NN` `text-*/NN` `border-*/NN` `opacity-NN` on solid UI, or `color-mix(… white/black)` to tint. FAIL — opacity is for genuine translucency only (glass, scrim over imagery, disabled); use the next solid scale step. Cite the utility/hex + file:line.
- **Contrast (a11y) — only where both sides are literal in source.** Two token values you can read (button text on button fill; placeholder, label, focus-ring and error ink on a known surface) compute to a real ratio: FAIL any below WCAG AA, citing the pair and the number. **Text over an image, video, gradient or scrim does not** — you can't know what's under it, and a guessed ratio is a fabricated finding. Name those as *needs measurement* and hand them to `/visual-review`; if the build has no `prefers-contrast`/scrim under such text at all, that *absence* is a static finding you can make.
- **Assets**: div-based fake screenshots, hand-rolled decorative SVGs, text-only "hero", plain-text wordmark logo walls. FAIL.
- **Generated raster assets** (from `graphic-designer`): open the actual image files referenced by the UI. FAIL AI-slop tells — uncanny faces/hands, melted text, glossy 3D-render blobs, corporate-memphis figures, default teal-orange gradient wash, fake bokeh/HDR halos, watermark ghosts, off-palette art fighting the design system.
- **Copy self-audit**: grammatically broken, unclear referents, cute-but-wrong wordplay, fake-precise invented numbers. FAIL each string, quote it.
- **Quality floor**: mobile fallback present per section, visible keyboard focus, `prefers-reduced-motion`, `min-h-[100dvh]` heroes.

## Output
- Open with **the surface you reviewed** (marketing page / product UI / mixed) and therefore which half of the checklist applied. A rule skipped by scope is not a rule passed.
- Per failed rule: `FAIL — <rule>` + `file:line` + the specific fix (not "improve this").
- Passing rules: one line, grouped.
- **Handed to `/visual-review`**: one line listing what you couldn't judge statically (contrast over imagery, anything rendered). An unstated hand-off reads as a pass.
- End with a verdict: **SHIP** (zero fails) or **FIX** (list the blocking fails in priority order).
