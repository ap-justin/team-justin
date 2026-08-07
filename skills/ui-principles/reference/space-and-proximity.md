# Space & proximity

Every gap is a claim about what belongs together. This group audits two things: whether the values come from a system at all, and whether the grouping they assert matches the grouping the content actually has.

The highest-yield entries in the corpus live here — spacing defects are numeric, so they are `STATIC` almost without exception, and they are greppable across a whole style layer in one sweep.

---

## Every spacing value comes from the scale

**Principle:** padding, margin, and gap take values from the project's spacing scale. An arbitrary value is a defect regardless of how good it looks.
**Mechanism:** a scale is what makes spacing decisions transferable — the next component inherits the decision instead of re-deriving it by eye. One off-scale value doesn't look wrong on its own; it costs the *next* value the reference it needed.
**Code signal:**
  - arbitrary-value escapes — `p-[13px]`, `mt-[27px]`, `gap-[7px]`, `margin: 23px`, `padding: 0.9rem`
  - a spacing value that resolves to no token in the theme file, written as a raw unit in a component
  - `style="margin-top: 12px"` inline, bypassing the system entirely
**Fix:** snap to the nearest step on the project's scale; if no step fits the need, add the step to the scale rather than the value to the component.
**Applies when:** optical adjustments (a 1–2px nudge to align an icon with a cap height) are legitimate and should be commented as such — a commented nudge is answered, an uncommented `mt-[3px]` is not.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://tailwindcss.com/docs/theme (2025)

---

## The gap between groups exceeds the gap inside them

**Principle:** related elements sit closer to each other than to anything else. The outer gap is always a larger step than the inner gap.
**Mechanism:** proximity is read before content — grouping is inferred from distance faster than from any label, border, or heading. Equal gaps assert "these are all peers", so a uniform stack silently contradicts whatever structure the markup declares.
**Code signal:**
  - one `space-y-*` / `gap` applied across a container whose children are a heading, its body, and an unrelated next section
  - a label and its input separated by the same step as one field from the next
  - a card whose title, content and footer are separated by the same value as its own outer padding
**Fix:** step the inner gap down (or the outer up) so the ratio matches the nesting — a single step of difference is usually enough.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://lawsofux.com/law-of-proximity/ (2020) · https://www.nngroup.com/articles/gestalt-proximity/ (2020)

---

## A border is not a substitute for a gap

**Principle:** separation is done with space first; a border or divider is added only when space alone can't carry the grouping.
**Mechanism:** a divider is a visible line the eye has to process, and it asserts a boundary as strongly as a container does. Reaching for one usually means the spacing that would have grouped the content was never spent.
**Code signal:**
  - `divide-y` / `border-b` between list rows that already carry generous vertical padding
  - a card that is a border, a shadow, *and* a background change — three separations for one boundary
  - dividers between every field of a form
**Fix:** delete the divider, increase the gap a step, and re-add the line only if the grouping still fails to read — usually only where alignment can't be relied on (dense tables, mixed-width rows).
**Applies when:** inverts in dense data UI, where space is the scarce resource and a hairline rule genuinely costs less than a step of padding.
**Detect:** HEURISTIC — the divider and the padding beside it are visible; whether space alone would have carried the grouping is not.
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://lawsofux.com/law-of-common-region/ (2020)

---

## Space is set by the layout, not by empty elements

**Principle:** gaps come from the layout system's own properties — `gap`, padding, margin. Never from filler content.
**Mechanism:** a filler element is spacing that no longer responds to layout: it doesn't collapse at a breakpoint, doesn't participate in `gap`, and can't be re-tokenized. It is a fixed value wearing the costume of markup.
**Code signal:**
  - `<br />` used between blocks, `&nbsp;` used for horizontal space
  - a spacer element — `<div class="h-8" />`, `<Spacer size={4} />` — between siblings of a flex/grid parent that could carry `gap`
  - negative margins pulling a block back into place after something else pushed it out
**Fix:** delete the filler and move the value onto the parent's `gap` or the block's own padding.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://web.dev/articles/responsive-web-design-basics (2019)

---

## One owner per gap

**Principle:** the space between two siblings is set in one place — the parent's `gap` or the child's margin, never both.
**Mechanism:** two owners means the rendered gap is a sum nobody wrote down, so the next person edits one owner, sees half the effect, and doubles the other. This is how spacing scales drift out of a codebase that has one.
**Code signal:**
  - a flex/grid parent with `gap-6` whose children also carry `mb-4`
  - `space-y-*` on a container plus `margin-bottom` inside the child component
  - a `:last-child { margin-bottom: 0 }` reset — the tell that margins are doing a `gap`'s job
**Fix:** keep the parent's `gap` and strip the child margins; the child then spaces correctly wherever it's reused.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://tailwindcss.com/docs/theme (2025)

---

## Page rhythm comes from a small set of section paddings

**Principle:** the vertical space between major sections is drawn from two or three values across the whole page, not chosen per section.
**Mechanism:** the eye reads repeated intervals as structure. A page where every section pads differently has no interval to repeat, so nothing signals "new section" except the content changing.
**Code signal:**
  - each top-level `<section>` carrying a different vertical padding — `py-16`, `py-20`, `py-24`, `py-12` down one page
  - section padding written inline per section rather than on a shared section wrapper/class
  - a responsive section pad that changes step count between breakpoints (`py-8 md:py-32`)
**Fix:** define section-padding steps (standard / major) once and apply them by role, not by section.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/chunking/ (2016)

---

## An interactive target can't be smaller than a finger

**Principle:** anything tappable clears the platform minimum (24×24 CSS px as the WCAG floor, ~44px as the platform norm), including via padding rather than size.
**Mechanism:** pointer precision is a physical constant that the design system doesn't get a vote on. A 16px icon button is not a small button, it is a miss.
**Code signal:**
  - an icon-only button whose only sizing is the icon — `<button><Icon class="h-4 w-4" /></button>` with `p-0` or no padding
  - a tap target in a dense row with `p-1` / `py-0.5` and no minimum height
  - a text link acting as a primary mobile action with no block padding
**Fix:** add padding (or `min-h`/`min-w`) to reach the target size, keeping the icon its intended visual size — the hit area grows, the graphic doesn't.
**Applies when:** cross-lane with `accessibility-review` (WCAG 2.5.8); report the craft side and cite the overlap rather than re-auditing conformance.
**Detect:** STATIC
**Source:** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (2023) · https://www.nngroup.com/articles/touch-target-size/ (2019) · https://ishadeed.com/article/target-size/ (2024)
