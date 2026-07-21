---
name: house-style
description: The team's learned, cross-cutting preferences — design, code, and workflow defaults promoted from the preference inbox. Read by the lead at routing time and distributed into a seat's scoped context.
disable-model-invocation: true
---

The team's **house style** — preferences the user has taught the team, promoted here by `/roster learn` from the inbox (`${CLAUDE_PLUGIN_ROOT}/PREFERENCES.md`). Versioned and shared: every install inherits these.

**How it's used.** This file is **not** auto-loaded into every agent (a global load would bloat every context). Instead the **lead reads it at Step 3** and passes only the lane-relevant slice into a dispatched seat's scoped context — the same way it hands down design tokens. A seat may also consult it directly when told. Entries are defaults, not laws: an explicit instruction or a repo's own established convention (brownfield) always wins.

**How it grows.** Only `/roster learn` writes here (gated, version-bumped). Each entry is tight, names *why* (so a future sweep can revise it), and links a `patterns/<slug>.md` artifact when one backs it. Seat-specific preferences are **not** here — those are promoted as targeted edits to the relevant `agents/<seat>.md`.

---

## Design & UI
<!-- promoted [design] preferences — palette/type/layout/motion defaults, liked component patterns.
     format:  - <preference>, because <why>. [→ patterns/<slug>.md] _swept <date>_ -->

_None yet — the team starts frozen and earns its house style one swept preference at a time._

## Code & architecture
<!-- promoted [code] preferences — approved API shapes, error-handling style, file layout, conventions. -->

_None yet._

## Workflow
<!-- promoted [workflow] preferences — how the user wants the team to operate (grill-first, PR shape, commit style, review depth). -->

_None yet._
