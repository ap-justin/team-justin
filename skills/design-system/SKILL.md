---
name: design-system
description: Audit, document, or extend your design system. Use when checking for naming inconsistencies or hardcoded values across components, writing documentation for a component's variants, states, and accessibility notes, or designing a new pattern that fits the existing system.
argument-hint: "[audit | document | extend] <component or system>"
---

<!-- vendored from `anthropics/knowledge-work-plugins` → `design` plugin (v1.2.0, sha 15898ec) → `skills/design-system`. Design-system audit/document/extend backing the `design-director` seat (NOT `ux-designer` — the system is the director's lane; upstream's framing said otherwise). Team-adapted, not verbatim: scores removed, connector hooks remapped. Re-sync: diff against https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/15898ec/design/skills/design-system/ and re-apply both divergences. -->

# /design-system

Manage your design system — audit for consistency, document components, or design new patterns.

**Whose skill this is:** `design-director`'s. It owns the visual system (palette, type, scales, signature, motion) and maintains the `## Design system` pointer in `CLAUDE.md`; auditing, documenting or extending that system is the same lane. `ux-designer` sits upstream of it and routes this work here. The seams either side: `ui-principles` supplies the *mechanism* behind a craft defect, `design-taste-frontend` (via `/taste-review`) owns anti-slop and templated design, `/visual-review` owns anything needing a rendered page.

**No score.** Report findings and let them stand. A count over a made-up denominator implies a precision a static read doesn't have, and the number gets quoted downstream long after the findings that produced it are gone — the team dropped scores from `ui-principles`, `ux-principles` and the review passes for that reason, and this skill is no exception. The `Score`/`X/10` cells in the templates below are struck for the same reason.

**The token file is the scale.** Follow `CLAUDE.md`'s `## Design system` pointer and read the real token file before judging any value. "Hardcoded" means *off that file*, not off a default from a book. A deliberate token is not a finding for disagreeing with one.

## Usage

```
/design-system audit                    # Full system audit
/design-system document [component]     # Document a component
/design-system extend [pattern]         # Design a new component or pattern
```

## Components of a Design System

### Design Tokens
Atomic values that define the visual language:
- Colors (brand, semantic, neutral)
- Typography (scale, weights, line heights)
- Spacing (scale, component padding)
- Borders (radius, width)
- Shadows (elevation levels)
- Motion (durations, easings)

### Components
Reusable UI elements with defined:
- Variants (primary, secondary, ghost)
- States (default, hover, active, disabled, loading, error)
- Sizes (sm, md, lg)
- Behavior (interactions, animations)
- Accessibility (ARIA, keyboard)

### Patterns
Common UI solutions combining components:
- Forms (input groups, validation, submission)
- Navigation (sidebar, tabs, breadcrumbs)
- Data display (tables, cards, lists)
- Feedback (toasts, modals, inline messages)

## Principles

1. **Consistency over creativity** — The system exists so teams don't reinvent the wheel
2. **Flexibility within constraints** — Components should be composable, not rigid
3. **Document everything** — If it's not documented, it doesn't exist
4. **Version and migrate** — Breaking changes need migration paths

## Output — Audit

```markdown
## Design System Audit

### Summary
**Components reviewed:** [X] | **Issues found:** [X] | **Token file audited against:** [path from the `## Design system` pointer, or "none — that's the first finding"]

### Naming Consistency
| Issue | Components | Recommendation |
|-------|------------|----------------|
| [Inconsistent naming] | [List] | [Standard to adopt] |

### Token Coverage
| Category | Defined | Hardcoded Values Found |
|----------|---------|----------------------|
| Colors | [X] | [X] instances of hardcoded hex |
| Spacing | [X] | [X] instances of arbitrary values |
| Typography | [X] | [X] instances of custom fonts/sizes |

### Component Completeness
| Component | States | Variants | Docs | What's missing |
|-----------|--------|----------|------|----------------|
| Button | ✅ | ✅ | ⚠️ | [the specific gap, `file:line`] |
| Input | ✅ | ⚠️ | ❌ | [the specific gap, `file:line`] |

### Priority Actions
1. [Most impactful improvement]
2. [Second priority]
3. [Third priority]
```

## Output — Document

```markdown
## Component: [Name]

### Description
[What this component is and when to use it]

### Variants
| Variant | Use When |
|---------|----------|
| [Primary] | [Main actions] |
| [Secondary] | [Supporting actions] |

### Props / Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| [prop] | [type] | [default] | [description] |

### States
| State | Visual | Behavior |
|-------|--------|----------|
| Default | [description] | — |
| Hover | [description] | [interaction] |
| Active | [description] | [interaction] |
| Disabled | [description] | Non-interactive |
| Loading | [description] | [animation] |

### Accessibility
- **Role**: [ARIA role]
- **Keyboard**: [Tab, Enter, Escape behavior]
- **Screen reader**: [Announced as...]

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| [Best practice] | [Anti-pattern] |

### Code Example
[Framework-appropriate code snippet]
```

## Output — Extend

```markdown
## New Component: [Name]

### Problem
[What user need or gap this component addresses]

### Existing Patterns
| Related Component | Similarity | Why It's Not Enough |
|-------------------|-----------|---------------------|
| [Component] | [What's shared] | [What's missing] |

### Proposed Design

#### API / Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| [prop] | [type] | [default] | [description] |

#### Variants
| Variant | Use When | Visual |
|---------|----------|--------|
| [Variant] | [Scenario] | [Description] |

#### States
| State | Behavior | Notes |
|-------|----------|-------|
| Default | [Description] | — |
| Hover | [Description] | [Interaction] |
| Disabled | [Description] | Non-interactive |
| Loading | [Description] | [Animation] |

#### Tokens Used
- Colors: [Which tokens]
- Spacing: [Which tokens]
- Typography: [Which tokens]

### Accessibility
- **Role**: [ARIA role]
- **Keyboard**: [Expected interactions]
- **Screen reader**: [Announced as...]

### Open Questions
- [Decision that needs design review]
- [Edge case to resolve]
```

## Where the team gets this instead of a connector
Upstream's connector hooks (Figma, knowledge base) aren't vendored — the plugin's MCP fleet is deliberately out. The equivalents:

- **The system to audit** — the token file behind `CLAUDE.md`'s `## Design system` pointer, plus the components and stylesheets in the repo, read with `Read`/`Grep`/`Glob`. No live Figma pull; there's no Figma MCP on this team.
- **Hardcoded-value detection** — grep the style layer once for value shapes (raw hex, `p-[13px]`, bare `px`/`rem` where a token exists, `rgba()` used as a lightener), not file by file. `/taste-review` runs the same sweep on a build's diff; this pass runs it on the system as a whole.
- **Existing documentation** — whatever the repo already carries. Updated docs are returned to the user or written into the repo; nothing is published to a wiki.

## Tips

1. **Start with an audit** — Know where you are before deciding where to go.
2. **Document as you build** — It's easier to document a component while designing it.
3. **Prioritize coverage over perfection** — 80% of components documented beats 100% of 10 components.
