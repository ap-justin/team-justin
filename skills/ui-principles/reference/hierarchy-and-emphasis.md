# Hierarchy & emphasis

What wins attention on this screen, and what was de-emphasized to pay for it. Emphasis is a zero-sum budget: every lever spent raises the floor everything else has to clear, which is why most "flat, nothing stands out" screens are over-emphasized rather than under-emphasized.

Tiers run lower here than in other groups — the code shows *which* levers were spent, but rarely states which element was meant to win. Report the spend; ask about the intent.

---

## Spend one emphasis lever, not all of them

**Principle:** an element is raised by one of size, weight, or color. Stacking all three is reserved for the single most important thing on the screen.
**Mechanism:** emphasis is relative, not absolute. Three levers on a secondary element raise the baseline the primary must exceed, so the screen reads as louder without reading as clearer.
**Code signal:**
  - a class string carrying size + weight + color + case + tracking at once, on something that isn't the page's lead element — `text-2xl font-bold uppercase tracking-wide text-gray-900`
  - `font-bold` (or the boldest token) appearing on most text nodes in one component
  - every heading level in a section resolving to the same size *and* weight — the levels exist in markup only
**Fix:** name the one element that should win, keep its stacked emphasis, and return the rest to a single lever each.
**Applies when:** the "one element" is per view, not per component — a card in a grid of twelve is not a page's lead element.
**Detect:** HEURISTIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ (2021)

---

## Labels rank below the values they describe

**Principle:** the label, header, or unit is supporting text; the value it introduces carries the weight.
**Mechanism:** the label is read once to learn the structure and skipped on every pass after. Scanning is for the values, so a label styled equal to its value doubles the count of things competing for the same scan.
**Code signal:**
  - a definition/stat pair whose label and value resolve to the same size, weight and color — `<dt class="text-base font-semibold">` beside `<dd class="text-base font-semibold">`
  - `<th>` styled identically to `<td>`, or a table header row with no distinguishing class
  - form `<label>` at the same size and weight as the input's own text, with no muting
**Fix:** drop the label a step — smaller, lighter, or muted (one lever, per the entry above) — and leave the value at full weight.
**Applies when:** inverts on a form the user is *filling* rather than reading: the empty input has no value to out-rank yet, so the label must stay legible. Mute label-vs-value on read views, not on entry forms.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/data-tables/ (2022)

---

## One primary action per view

**Principle:** the filled/solid button variant appears once in a view. Everything else is the outline, muted, or text variant.
**Mechanism:** a primary style is a claim about what to do next. Two claims cost a decision the interface was supposed to have made, and the second one devalues the first rather than adding to it.
**Code signal:**
  - the primary button variant used more than once in a single route/page component — `<Button variant="primary">` ×3
  - every button in a form group rendering with the same filled style, including Cancel
  - a "secondary" action that only differs by color, still filled and still at full weight
**Fix:** keep the one action the view exists for as primary; demote the rest to outline/ghost/text, and Cancel to plain text.
**Applies when:** a dashboard aggregating several independent cards can carry one primary per card — the rule is per decision context, not per file.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://lawsofux.com/von-restorff-effect/ (2020)

---

## De-emphasize with contrast, not by shrinking below the floor

**Principle:** secondary text gets lighter, not smaller than the body floor. Below roughly 14px, size stops being a hierarchy lever and starts being a legibility defect.
**Mechanism:** reducing size costs legibility for every reader, while reducing contrast costs prominence only. The first is paid by people who need the text; the second by people who don't.
**Code signal:**
  - body-carrying copy at `text-xs` / `text-[11px]` / `font-size: 12px` or below — captions, helper text, legal lines, metadata
  - a size token below the scale's smallest defined step, written as an arbitrary value
  - the same string rendered smaller on mobile than on desktop (`text-[10px] sm:text-sm`)
**Fix:** restore the body size and mute the color instead, keeping it above the contrast minimum.
**Applies when:** dense data tools legitimately run a smaller base size overall — the floor is relative to the product's base, not an absolute px value.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/legibility-readability-comprehension/ (2015)

---

## Hierarchy must survive with the color removed

**Principle:** no rank in the hierarchy is carried by hue alone — size, weight, or position carries it too.
**Mechanism:** color is the least reliable lever it is possible to lean on: it changes with theme, degrades in dark mode, and is unavailable to a share of readers. A hierarchy resting on it is one theme switch from flat.
**Code signal:**
  - two ranks differing only by a color token — `text-gray-900` vs `text-gray-500` at identical size and weight, as the *only* distinction between a heading and its body
  - a "selected"/"active" item styled with a color change alone, no weight, border, or marker
  - status or category conveyed by a colored dot/badge with no text or icon inside it
**Fix:** add a non-color lever to the rank — weight, size step, border, or an explicit marker — and keep the color as reinforcement.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html (2023)

---

## A routine destructive action is not the loudest thing on screen

**Principle:** semantic color is a meaning, not a weight. A red-filled button is for the confirmation step, not for every Delete in a list.
**Mechanism:** the loudest element on a screen is read as the intended one. Making destruction the visual primary invites the click it is warning about, and running it at full alarm everywhere spends the alarm before the moment it's needed.
**Code signal:**
  - the destructive filled variant repeated per row in a list or table
  - a destructive action rendered as the view's only filled button, with the constructive action as outline
  - the error/danger token used as a background on non-blocking UI
**Fix:** render routine destructive actions as muted or text variants with the danger color on the label; save the filled danger variant for the confirmation step that actually destroys something.
**Applies when:** inverts inside the confirmation dialog itself — there, the destructive action *is* the primary.
**Detect:** HEURISTIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://lawsofux.com/von-restorff-effect/ (2020)

---

## Emphasis must not be used to bury price, terms, or cancellation

**Principle:** the cost, the commitment, and the way out are rendered at the same rank as the benefit that sits beside them.
**Mechanism:** de-emphasis works — that's the point of the whole group — which is exactly what makes it a dark pattern when it's pointed at the information a decision depends on. This is the one entry in the corpus that is an ethical floor rather than a craft default.
**Code signal:**
  - price, billing period, renewal terms, or trial-end copy at the smallest size and lightest color available, next to a full-weight benefit list
  - a cancel/unsubscribe/downgrade path styled as muted body text while its opposite is a filled button
  - a total, fee, or "auto-renews" line placed below the fold of a card while the headline number sits above it
**Fix:** raise the buried element to the rank of the decision it belongs to — same size and contrast as the benefit it qualifies.
**Detect:** STATIC
**Source:** *Deceptive Patterns* (Brignull, 2023) · https://www.nngroup.com/articles/deceptive-patterns/ (2023)
