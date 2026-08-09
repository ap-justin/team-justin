---
name: design-handoff
description: Generate developer handoff specs from a design. Use when a design is ready for engineering and needs a spec sheet covering layout, design tokens, component props, interaction states, responsive breakpoints, edge cases, and animation details.
argument-hint: "<design description, screenshot, or the built design-system gallery>"
---

<!-- vendored from the knowledge-work `design` plugin (design@knowledge-work-plugins v1.2.0, sha 15898ec).
     copied into the repo so the team keeps the skill without the plugin's ~9 auth-gated MCP servers
     (slack, figma, linear, asana, atlassian, notion, intercom, google calendar, gmail) loaded.
     upstream ships this as the namespaced `design:design-handoff`; this is the plain vendored copy.
     TEAM-ADAPTED, not verbatim: dead CONNECTORS.md pointer dropped, Figma-pull path replaced (no Figma MCP here),
     connector block rewritten as team equivalents, and the no-invented-measurement rule added — tokens go in by name, and a
     dimension the design does not settle becomes an open question, never a plausible default a builder would then write.
     the gap-routing column names `design-director` rather than "the design tool" — the greenfield design is made in
     `claude-design`, but nothing on the team can reach it (the user carries the brief there and brings the result back),
     so an element/state the system lacks routes to `design-director`, which extends the system and its coverage manifest together.
     re-sync: diff against the plugin cache after a plugin update, then re-apply all five. -->

# /design-handoff

Generate comprehensive developer handoff documentation from a design.

## Usage

```
/design-handoff $ARGUMENTS
```

Generate handoff specs for: @$1

Work from the description, screenshot, or design artifact you were given, plus repo files (`Read`/`Grep`/`Glob`). **There is no Figma MCP on this team** — vendored out on purpose. If a task genuinely needs the live file, say so and stop.

## Reference tokens by name; never invent a measurement
The spec is what a builder implements against, so a number in it that you didn't get from somewhere is worse than a blank: the builder writes it, and an invented value is exactly what the team's closed-set rule exists to prevent (`react-ui-builder`/`svelte-ui-builder`: *no value that isn't in the token file*).

- **Tokens go in as names**, resolved from `CLAUDE.md`'s `## Design system` pointer and the token file it names — `--space-4`, not `16px`. Exact values are `design-director`'s to set and the token file's to hold.
- **A dimension the design settles, you spec.** A dimension it doesn't, you **name as an open question** at the bottom — never a plausible default. That question is cheap here and expensive once it's a builder's mid-build gap.
- **"Exact measurements" below means exact where the artifact is exact.** Reading a pixel count off a screenshot by eye is a guess wearing a number's clothes; say "matches the card's padding step" instead.

## What to Include

### Visual Specifications
- Exact measurements (padding, margins, widths)
- Design token references (colors, typography, spacing)
- Responsive breakpoints and behavior
- Component variants and states

### Interaction Specifications
- Click/tap behavior
- Hover states
- Transitions and animations (duration, easing)
- Gesture support (swipe, pinch, long-press)

### Content Specifications
- Character limits
- Truncation behavior
- Empty states
- Loading states
- Error states

### Edge Cases
- Minimum/maximum content
- International text (longer strings)
- Slow connections
- Missing data

### Accessibility
- Focus order
- ARIA labels and roles
- Keyboard interactions
- Screen reader announcements

## Principles

1. **Don't assume** — If it's not specified, the developer will guess. Specify everything.
2. **Use tokens, not values** — Reference `spacing-md` not `16px`.
3. **Show all states** — Default, hover, active, disabled, loading, error, empty.
4. **Describe the why** — "This collapses on mobile because users primarily use one-handed" helps developers make good judgment calls.

## Output

```markdown
## Handoff Spec: [Feature/Screen Name]

### Overview
[What this screen/feature does, user context]

### Layout
[Grid system, breakpoints, responsive behavior]

### Design Tokens Used
Names and jobs. The **value column is the token file's**, not yours — quote it only where you read it from that file, and leave it blank rather than filling it from a screenshot.

| Token | Usage | Value (only if read from the token file) |
|-------|-------|------------------------------------------|
| `color-primary` | CTA buttons, links | |
| `spacing-md` | Between sections | |
| `font-heading-lg` | Page title | |

**Tokens the design needs and the system doesn't have** go here as named gaps, not as new tokens you coined:

| Needed for | Why nothing fit | Routed to |
|------------|-----------------|-----------|
| [element/state] | [what the system lacks] | `design-director` (extends the system + its coverage manifest) |

### Components
| Component | Variant | Props | Notes |
|-----------|---------|-------|-------|
| [Component] | [Variant] | [Props] | [Special behavior] |

### States and Interactions
| Element | State | Behavior |
|---------|-------|----------|
| [CTA Button] | Hover | [Background darken 10%] |
| [CTA Button] | Loading | [Spinner, disabled] |
| [Form] | Error | [Red border, error message below] |

### Responsive Behavior
| Breakpoint | Changes |
|------------|---------|
| Desktop (>1024px) | [Default layout] |
| Tablet (768-1024px) | [What changes] |
| Mobile (<768px) | [What changes] |

### Edge Cases
- **Empty state**: [What to show when no data]
- **Long text**: [Truncation rules]
- **Loading**: [Skeleton or spinner]
- **Error**: [Error state appearance]

### Animation / Motion
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| [Element] | [Trigger] | [Description] | [ms] | [easing] |

### Accessibility Notes
- [Focus order]
- [ARIA labels needed]
- [Keyboard interactions]
```

## Where the team gets this instead of a connector
Upstream's connector hooks (Figma, trackers) aren't vendored — the plugin's MCP fleet is deliberately out. The equivalents:

- **Tokens and component specs** — `CLAUDE.md`'s `## Design system` pointer and the token file it names; existing components read straight from the repo.
- **Assets** — already on disk, or generated by `graphic-designer` before the build. Builders never source assets mid-build, so the spec cites file paths that exist.
- **Tickets** — the plan store (`TRACKER.md`), via `planner` when the change is big enough to need a ticket graph. This skill writes the spec; it doesn't open tickets.

## Tips

1. **Point me at the design and the token file** — a screenshot or the returned design, plus `CLAUDE.md`'s `## Design system` pointer, is what makes the spec exact instead of plausible.
2. **Mention edge cases** — "What happens with 100 items?" helps me spec boundary conditions.
3. **Specify the tech stack** — "We use React + Tailwind" helps me give relevant implementation notes.
