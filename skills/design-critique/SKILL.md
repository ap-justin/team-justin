---
name: design-critique
description: Get structured design feedback on usability, hierarchy, and consistency. Trigger with "review this design", "critique this mockup", "what do you think of this screen?", or when sharing a screenshot or description for feedback at any stage from exploration to final polish. Mockup-stage — before a build exists.
argument-hint: "<screenshot, image file, or description>"
---

<!-- vendored from the knowledge-work `design` plugin (design@knowledge-work-plugins v1.2.0, sha 15898ec).
     copied into the repo so the team keeps the skill without the plugin's ~9 auth-gated MCP servers
     (slack, figma, linear, asana, atlassian, notion, intercom, google calendar, gmail) loaded.
     upstream ships this as the namespaced `design:design-critique`; this is the plain vendored copy.
     TEAM-ADAPTED, not verbatim: dead CONNECTORS.md pointer dropped, Figma-pull path replaced (no Figma MCP here),
     connector block rewritten as team equivalents, and the tier discipline added — this pass has no rendered page, so it flags
     a contrast/target risk and routes the verdict rather than asserting a pass/fail it never computed (contrast routes to
     `design-director`, which owns the token pairs; no pass on this team computes a ratio).
     re-sync: diff against the plugin cache after a plugin update, then re-apply all four. -->

# /design-critique

Get structured design feedback across multiple dimensions. In this team it is the **mockup-stage** pass — it runs on descriptions, wireframes and mockups *before* a build exists, upstream of `/taste-review` (built source) and `/visual-review` (rendered states + cause). Feed those passes; don't duplicate them.

## Usage

```
/design-critique $ARGUMENTS
```

Review the design: @$1

Work from what you were given: a description, a screenshot or image file, or repo files (`Read`/`Grep`/`Glob`). **There is no Figma MCP on this team** — it was vendored out on purpose. If a task genuinely needs the live file, say so and stop rather than describing what you'd have found in it.

## Say what you can see, and only that
This pass usually has a picture or a paragraph, not a rendered page — so it has no measurements, and inventing them is the one failure that makes the whole critique untrustworthy. The team's tier rule (`ux-principles`, `## Tier discipline`) applies here unchanged:

- **Visible in what you were given** → report as a finding.
- **Turns on intent the artifact doesn't state** ("is this the primary action?") → report as a **question**, never a verdict.
- **Needs pixels, computed styles or real timing** → you cannot see it. **Name it as out of scope and hand it on by name.** Tap-target *sizes* and text readability are in this tier whenever you're looking at an image or a description: `/accessibility-review` measures them on a rendered page; `/visual-review` renders the states nobody opens and traces what breaks in them back to source. Contrast is **settled** in the design system's token pairs — name a pairing that reads as at risk and route it to `design-director`, who owns them. A pass/fail you didn't compute is fabrication, and one of them costs more trust than ten real findings earn.

The Accessibility section below is where this goes wrong most often — keep it, but answer it in the right tier: flag the *risk* you can see (pale text on a tinted panel, a 24px icon-only control, body copy set small) and route the verdict.

## What I Need From You

- **The design**: a screenshot, an image file, or a detailed description
- **Context**: What is this? Who is it for? What stage (exploration, refinement, final)?
- **Focus** (optional): "Focus on mobile" or "Focus on the onboarding flow"

## Critique Framework

### 1. First Impression (2 seconds)
- What draws the eye first? Is that correct?
- What's the emotional reaction?
- Is the purpose immediately clear?

### 2. Usability
- Can the user accomplish their goal?
- Is the navigation intuitive?
- Are interactive elements obvious?
- Are there unnecessary steps?

### 3. Visual Hierarchy
- Is there a clear reading order?
- Are the right elements emphasized?
- Is whitespace used effectively?
- Is typography creating the right hierarchy?

### 4. Consistency
- Does it follow the design system?
- Are spacing, colors, and typography consistent?
- Do similar elements behave similarly?

### 5. Accessibility — risks you can see, not ratios you can't compute
- Color contrast — name the pairing that looks at risk; the **pairing** is `design-director`'s to settle, and no pass rates it
- Touch target sizes — name controls that look undersized; the **measurement** is `/accessibility-review`'s (WCAG 2.5.5/2.5.8)
- Text readability — size, measure and line height as *drawn*
- Alternative text for images, and anything the artifact states outright (focus order, labels, semantics)

## How to Give Feedback

- **Be specific**: "The CTA competes with the navigation" not "the layout is confusing"
- **Explain why**: Connect feedback to design principles or user needs
- **Suggest alternatives**: Don't just identify problems, propose solutions
- **Acknowledge what works**: Good feedback includes positive observations
- **Match the stage**: Early exploration gets different feedback than final polish

## Output

```markdown
## Design Critique: [Design Name]

### Overall Impression
[1-2 sentence first reaction — what works, what's the biggest opportunity]

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| [Issue] | 🔴 Critical / 🟡 Moderate / 🟢 Minor | [Fix] |

### Visual Hierarchy
- **What draws the eye first**: [Element] — [Is this correct?]
- **Reading flow**: [How does the eye move through the layout?]
- **Emphasis**: [Are the right things emphasized?]

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| [Typography/spacing/color] | [Inconsistency] | [Fix] |

### Accessibility
- **Contrast risks**: [Pairing that looks at risk — flag, don't rate. Route → design-director]
- **Target-size risks**: [Controls that look undersized. Measurement → /accessibility-review]
- **Text readability**: [Font size, line height, measure as drawn]
- **Handed on**: [What needs a rendered page, and to which pass]

### What Works Well
- [Positive observation 1]
- [Positive observation 2]

### Priority Recommendations
1. **[Most impactful change]** — [Why and how]
2. **[Second priority]** — [Why and how]
3. **[Third priority]** — [Why and how]
```

## Where the team gets this instead of a connector
Upstream's connector hooks (Figma, feedback tools) aren't vendored — the plugin's MCP fleet is deliberately out. The equivalents:

- **The design itself** — the description, screenshot or image file the user gave you, plus repo files via `Read`/`Grep`/`Glob`. Not a live Figma pull.
- **The existing design system to compare against** — `CLAUDE.md`'s `## Design system` pointer and the token file it names, read directly. That file is the scale; a value is off-system when it's off *that*.
- **Prior research and user feedback** — the plan store (`TRACKER.md`) and any research notes in the repo. Where a claim needs evidence the team doesn't hold, say so rather than asserting it.

## Tips

1. **Share the context** — "This is a checkout flow for a B2B SaaS" helps me give relevant feedback.
2. **Specify your stage** — Early exploration gets different feedback than final polish.
3. **Ask me to focus** — "Just look at the navigation" gives you more depth on one area.
