---
name: ui-principles
description: Visual-craft principles for interface work — hierarchy, spacing, type, color, depth, layout, imagery — each carrying the style-layer signal that betrays it in source and the fix that resolves it. Use when auditing built UI for craft defects, when specifying a design system's scales, or when another skill needs the mechanism behind a visual decision.
---

Visual-craft principles, written for an agent that has **only the source** — no browser, no screenshots. Each entry pairs the principle with its **signal**: what violating it looks like in a class string, a style rule, or a token file.

The principles are not the payload — any agent already half-knows them. The signal is. A principle you cannot spot in a file is a poster quote, and it does not belong here.

## The pass
A craft audit follows a **screen and the style layer under it**, never a principle checklist read top-down.

1. Resolve the **token layer first** — the theme/token file the project actually keeps its scales in (`CLAUDE.md`'s `## Design system` section points at it, if `design-director` has run). Every "is this value on the scale" judgement is decided against that file, not against a scale from a book. A project with no token layer is itself the first finding.
2. Read the component **and its styles together**. A class string is half the evidence; the token it resolves to is the other half.
3. Load the `reference/` group matching what you are looking at — a card pulls `depth-and-surface`; a marketing section pulls `layout-and-composition` and `space-and-proximity`. Two or three groups per screen, not seven.
4. Match the source against each principle's **Code signal**. Cite `file:line` for every match, quoting the offending value.
5. Grep the whole style layer for value-shaped signals once, rather than per file — off-scale values, raw hex, opacity-as-shade and `outline: none` are cheaper to find in one sweep than screen by screen.

## Tier discipline — the rule that keeps the audit trustworthy
Every principle carries a `Detect:` tier. It governs what you are allowed to *claim*, and it is not negotiable:

- **`STATIC`** — visible in the source itself. Report as a **defect**, with `file:line`.
- **`HEURISTIC`** — inferable from source, but it turns on intent the code doesn't state. Report as a **question** ("is this the primary action?"), never as a defect.
- **`RENDERED`** — needs pixels, layout, or real timing to judge. You **cannot see it**. Name it as out of scope if it matters; reporting one as a finding is fabrication.

The tier does more work here than in `ux-principles`, because visual judgement is where fabrication is cheapest. The squint test, "does the hierarchy read", "does it feel dense", contrast over a photograph, overflow at 375px — all real, all `RENDERED`, none of them yours. They belong to `/visual-review`, which drives a live browser. Hand them over by name instead of guessing.

There is no score. A count of satisfied checks over a made-up denominator implies a precision a static read doesn't have; findings and their tiers are the output.

## Applying a principle
- **The project's design system outranks this corpus.** The scales in the token file *are* the scale — a value is off-scale when it's off *that* scale. `design-director` decides direction; this corpus never re-decides it, and a deliberate token is not a defect for disagreeing with a default in a book.
- **Read `Applies when` before applying.** Several principles invert between a dense data tool and a marketing page, or between light and dark themes.
- **Propose the fix, don't make it.** Findings are a list a builder applies.
- **A stated override is not a violation — check for one before reporting.** A comment above the rule, `CLAUDE.md`, the design plan, an ADR. Where it exists and gives a reason, the principle is answered; report it as a question about the trade at most, never as a defect.
- **Brownfield defers.** In a repo with its own established visual conventions, a consistent choice you'd have made differently is a convention, not a finding.

## The groups
`reference/` — grouped by *what you are looking at*, not by which source it came from:
`hierarchy-and-emphasis.md` (what wins attention, and at whose expense) · `space-and-proximity.md` (the scale, and what grouping the gaps assert) · `type-and-reading.md` (size, measure, line height, weight) · `color-and-contrast.md` (scales, neutrals, contrast, meaning carried by color) · `depth-and-surface.md` (elevation, shadow, scrims, focus, layering) · `layout-and-composition.md` (alignment, containers, responsive behaviour, overflow) · `image-and-icon.md` (aspect, cropping, icon sets, fallbacks).

No group matches? `grep -ril "<term>" reference/` before concluding there's no principle. Still nothing — say so in your findings. An unlisted principle is a gap in the corpus, not licence to invent one and cite a book for it.

## Not this skill's job
- **Rendered-pixel review** — `/visual-review`. Everything the `RENDERED` tier forbids you to claim is that pass's whole job; name what needs it.
- **Anti-slop / templated design** — `design-taste-frontend` (via `/taste-review`) owns banned palettes, eyebrow caps, layout repetition, hero discipline. This corpus supplies the *mechanism* behind a craft defect; it does not restate those rules.
- **Deciding the system** — palette, type roles, layout language, signature and motion are `design-director`'s plan. This audits execution against a system; it doesn't author one.
- **WCAG conformance** — `accessibility-review`. The lanes touch on contrast, target size and focus visibility; cite the overlap, don't re-audit it.
- **The journey** — `ux-principles` walks a flow for dead ends and missing states. This reads a screen for craft.
- **Which CSS feature is safe to use** — `modern-css`. This says the border is doing the shadow's job, not whether `@container` is Baseline.
- **The words** — `ux-copy`.
