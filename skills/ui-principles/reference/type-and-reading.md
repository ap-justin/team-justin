# Type & reading

Size, measure, line height, weight, case. Typography defects are the most reliably `STATIC` in the corpus because every one of them is a number sitting in a class string or a rule — and the most commonly shipped, because the browser's defaults are tuned for a 1996 document, not for an interface.

---

## Font sizes come from the scale

**Principle:** every size resolves to a step on the project's type scale. Steps are chosen, not interpolated.
**Mechanism:** two sizes one or two pixels apart read as a mistake rather than a rank — the difference is visible but not legible as intent. A scale with visible gaps is what makes a size change read as a hierarchy change.
**Code signal:**
  - arbitrary sizes — `text-[15px]`, `font-size: 17px`, `text-[1.05rem]`
  - two nearby elements one step apart in raw px but resolving to no tokens
  - a heading sized with a class the theme file doesn't define
**Fix:** snap to the nearest defined step; add the step to the scale if the design genuinely needs it.
**Applies when:** a fluid `clamp()` heading is a scale of its own — check that its floor and ceiling are steps, not that it names one.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://practicaltypography.com/point-size.html (2010–)

---

## Sizes are absolute at each breakpoint, not derived from a parent

**Principle:** a heading's size, and a component's padding, are picked per breakpoint from the scale — not encoded as a multiple of the text they sit near.
**Mechanism:** the ratio between a large element and a small one is not constant across screens; large things must shrink faster. A 45px headline over 18px body encoded as `2.5em` renders at 35px once body drops to 14px on mobile, where 20–24px was right — so the relationship the `em` preserved was never a real one. Nested `em` compounds the same error at every level.
**Code signal:**
  - `font-size: 2.5em` on headings, or any `em` heading size in a component that reflows
  - padding expressed off the component's own font-size — `padding: .75em 1em` on a button — so one size change moves every dimension with it
  - a single root `font-size` change, or a `transform: scale()`, standing in for a per-breakpoint type strategy
**Fix:** set each size from the scale at each breakpoint; keep `em` for the few things that genuinely track their text, like an icon sized inline with its label.
**Applies when:** `rem` against a fixed root is an absolute unit for this purpose — the defect is sizing relative to a *parent* that itself changes.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018), pp. 92–95

---

## Line height moves opposite to size

**Principle:** as type gets larger, line height gets tighter; as the measure gets wider, line height gets looser. Headings run tight (~1.1–1.25), body runs loose (~1.5–1.7).
**Mechanism:** line spacing exists to help the eye find the start of the next line. A long line needs more vertical separation to make that return unambiguous; a two-word headline needs none, and inherits a body line height as a visible gap in the middle of one thought.
**Code signal:**
  - a display-size heading with no line-height set, or with the body's `leading-normal` / `leading-relaxed`
  - body copy at the browser default (`1.2` from the UA stylesheet — i.e. no `line-height` anywhere in the cascade for that element)
  - one global `line-height` on `body` with no per-role override for headings
**Fix:** set line height per type role, not per element — tight on display/heading tokens, 1.5+ on body tokens.
**Detect:** STATIC
**Source:** https://practicaltypography.com/line-spacing.html (2010–) — 120–145% of point size · https://www.smashingmagazine.com/2020/07/css-techniques-legibility/ (2020)

---

## Constrain the measure

**Principle:** running text is capped at a readable line length — roughly 45–90 characters — by a `max-width` on its container, not by the viewport.
**Mechanism:** at the end of every line the eye has to travel back and find the next one. The longer the line, the further that return and the higher the chance of landing on the wrong line, which is felt as fatigue rather than as a layout problem.
**Code signal:**
  - a paragraph container with no `max-width` / `max-w-prose` / `ch`-based cap, inside a full-width section
  - prose set to a container width that was chosen for cards or media (`max-w-7xl`) with no narrower inner wrapper
  - `width: 100%` on a text block at desktop breakpoints
**Fix:** wrap running text in a `ch`-based cap (`max-width: 65ch` or the project's prose token); leave full width to media and grids.
**Applies when:** does not apply to labels, table cells, or single-line UI strings — only to text meant to be read in runs.
**Detect:** STATIC
**Source:** https://practicaltypography.com/line-length.html (2010–) — 45–90 characters · https://www.nngroup.com/articles/legibility-readability-comprehension/ (2015)

---

## Body text is never lighter than regular

**Principle:** weights below 400 are for large display type only. Body, labels, and UI text sit at 400 or above.
**Mechanism:** a light weight thins the stroke, and stroke thinness costs contrast at exactly the sizes where contrast is already tightest. The result reads as "elegant" at 48px and as "blurry" at 14px, from the same declaration.
**Code signal:**
  - `font-light` / `font-thin` / `font-weight: 300` on body copy, labels, or helper text
  - a light weight combined with a muted color token — the two compound, and the result usually fails contrast
  - light weight on text reversed out of a dark or image background
**Fix:** move body roles to 400 (and emphasis to 600); keep 300 for display sizes only, if the face has a real 300.
**Applies when:** where the face isn't yours to control (an embed, or anything on `font-family: inherit`), spec 400/600 only — CSS font matching resolves 500 *down* to 400 and 600 *up* to 700 against a two-weight family.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://practicaltypography.com/bold-or-italic.html (2010–) · https://www.smashingmagazine.com/2020/07/css-techniques-legibility/ (2020)

---

## Uppercase needs tracking; lowercase doesn't

**Principle:** anything set in all caps gets positive letter-spacing. Lowercase running text keeps the face's own spacing.
**Mechanism:** a face's default spacing is drawn for lowercase word shapes. Caps remove the ascender/descender silhouette the eye reads words by, so without added tracking the letters crowd into a block; on lowercase, the same tracking destroys the word shape it was meant to help.
**Code signal:**
  - `uppercase` / `text-transform: uppercase` with no `tracking-*` / `letter-spacing` beside it
  - `tracking-wide` (or wider) applied to a lowercase paragraph or a body token
  - a small-caps label style defined once in a component rather than as a type role, so half the labels have tracking and half don't
**Fix:** define the eyebrow/label role once with case *and* tracking together; remove tracking from lowercase body roles.
**Detect:** STATIC
**Source:** https://practicaltypography.com/all-caps.html (2010–) · https://practicaltypography.com/letterspacing.html (2010–)

---

## Don't center multi-line text

**Principle:** centering is for short, self-contained blocks — a headline, a CTA pair, an empty state. Running copy is left-aligned (or start-aligned).
**Mechanism:** a consistent left edge gives the eye a fixed point to return to at the end of every line. Centered text moves that point on every line, so each return costs a search first.
**Code signal:**
  - `text-center` on a container holding paragraphs, lists, or any block that will wrap past two lines
  - centered body copy inside a card or feature grid cell
  - `text-center` inherited down a section wrapper onto everything inside it, rather than set on the one block that wanted it
**Fix:** set alignment on the specific short block; leave the section wrapper unaligned so running copy keeps its start edge.
**Applies when:** RTL locales invert the edge, not the rule — prefer `text-start` over `text-left` in any localized UI.
**Detect:** STATIC
**Source:** https://practicaltypography.com/centered-text.html (2010–) · https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/ (2019)

---

## Mixed sizes on one line align on the baseline

**Principle:** when a row mixes font sizes — a card title beside its actions, a metric beside its unit, a name beside a timestamp — align the items on their baseline, not their centers.
**Mechanism:** the baseline is an alignment reference the eye already tracks along a line of text. Centering two different sizes offsets their baselines by half the size difference, and that offset is read as misalignment even by someone who can't name it — the closer the two sit, the more obvious it gets.
**Code signal:**
  - `items-center` / `align-items: center` on a flex row whose children carry different text-size steps
  - `align-middle` on inline elements of mixed size — a currency symbol, a unit suffix, a superscript
  - a hand-tuned `margin-top` / `position: relative; top:` on the smaller item, compensating for the offset instead of removing it
**Fix:** `items-baseline` (`align-items: baseline`) on the row, and delete the nudge.
**Applies when:** a row mixing text with a box that has no baseline — icon, avatar, badge, toggle — centers correctly. This is text against text.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018), pp. 118–121

---

## Form inputs are 16px or the phone zooms

**Principle:** any `<input>`, `<select>`, or `<textarea>` renders at ≥16px on mobile viewports.
**Mechanism:** Safari on iOS zooms the viewport when focus lands on a control whose text is 15px or smaller. The layout the design specified is then gone for the rest of the form — a rendered defect with a purely static cause.
**Code signal:**
  - `text-sm` / `text-xs` / `font-size: 14px` on an input, select, or textarea with no `md:`-scoped override the other way
  - a shared `Input` component defaulting to the small size token
  - a compact form variant that shrinks the control's text rather than its padding
**Fix:** keep control text at 16px on small viewports (scale it *down* above a breakpoint if the desktop design needs smaller), and take density out of padding instead.
**Detect:** STATIC
**Source:** https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/ (2021) · https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html (2023)

---

## Two families, and every stack ends somewhere real

**Principle:** at most two faces (plus an optional mono), each declared once as a token, each with a fallback stack that terminates in a generic family.
**Mechanism:** every extra family is a new set of relationships to tune — weights, x-heights, and optical sizes that have to agree with each other. Two is the count most systems can actually keep consistent; the fallback matters because the stack is what renders for the first paint and for anyone the webfont fails on.
**Code signal:**
  - three or more `font-family` declarations, or `--font-*` tokens, in one style layer
  - a `font-family` naming one webfont with no fallbacks, or ending in a named font rather than `sans-serif`/`serif`/`monospace`
  - a family named inline in a component instead of resolving through a token
**Fix:** collapse to display + body (+ mono), define each as a token with a terminating stack, and replace inline families with the token.
**Applies when:** a metric-compatible fallback (`size-adjust`/`font-size-adjust` on the local stack) is the fix for layout shift at swap — that's `image-and-icon`'s CLS entry's sibling, not a separate defect here.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://practicaltypography.com/typography-in-ten-minutes.html (2010–)
