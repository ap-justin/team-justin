# Layout & composition

Alignment, containers, responsive behaviour, and what happens when content is longer than the design assumed. Two questions run through the group: what is the content aligned *to*, and what gives way when the viewport or the string changes size.

---

## Content is constrained by a container, not by the viewport

**Principle:** a section may be full-bleed; its content is capped by a container width and centered within it.
**Mechanism:** the viewport is a variable nobody controls. Content bound to it has no designed width at all — it just happens to look right on the machine it was built on, and stretches to unreadable on the next one up.
**Code signal:**
  - a top-level `<section>` whose children carry no `max-width` / container class
  - a grid or text block at `w-full` with no cap at large breakpoints
  - container widths chosen per section rather than from one or two shared container tokens
**Fix:** one container component/class with the project's width tokens, applied inside full-bleed sections; a narrower inner cap for running text (see `type-and-reading`).
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://web.dev/articles/responsive-web-design-basics (2019)

---

## Everything aligns to a shared edge

**Principle:** blocks in a column share one start edge; adjacent columns share one grid. Alignment is inherited from the layout, not re-chosen per block.
**Mechanism:** alignment is the cheapest grouping signal there is — a shared edge implies relationship with no ink at all. Every additional edge is a line the eye has to track separately, which is why "misaligned by 8px" reads as broken while "misaligned by 200px" reads as a new section.
**Code signal:**
  - sibling blocks with different horizontal padding inside the same container (`px-4` beside `px-6`)
  - a heading centered above left-aligned body copy in the same block
  - one section using a container class and the next hand-rolling `mx-auto max-w-[1100px]`
  - `items-center` on a row whose items have different heights and should be baseline- or start-aligned
**Fix:** move the alignment decision to the container, and let blocks inherit it; align mixed-height rows on the baseline of their first line, not their boxes.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://lawsofux.com/law-of-common-region/ (2020)

---

## Fixed heights are a bet on content that hasn't been written

**Principle:** heights are set by content plus padding. Fixed pixel or viewport heights are reserved for genuinely fixed-size media.
**Mechanism:** a fixed height is a promise that no string will ever be longer and no font will ever fall back. Both are false, and the failure mode is silent — content clips or overflows in the one locale nobody previewed.
**Code signal:**
  - `h-[420px]` / `height: 640px` on a card, section, or text-bearing block
  - `h-screen` / `100vh` heroes — on mobile the browser chrome makes that taller than the visible area (`100dvh` is the fix)
  - a fixed-height row with `overflow-hidden` doing the clipping
  - a fixed height paired with `absolute` children to place text inside it
**Fix:** replace with `min-height` plus padding; use `dvh` where a viewport unit is genuinely wanted; let the content set the box.
**Applies when:** media with a known aspect (see `image-and-icon`) is the legitimate case for a fixed box — express it as `aspect-ratio`, not as a height.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (2023)

---

## Every layout has an owner for overflow

**Principle:** anything that can exceed its box — long strings, wide tables, many chips, deep nesting — has a stated behaviour: wrap, truncate, or scroll.
**Mechanism:** the default is neither of those three: flex items refuse to shrink below their content's intrinsic width (`min-width: auto`), so a long unbroken string pushes the whole row wider than the page and the horizontal scrollbar appears on `<body>` instead of on the guilty container.
**Code signal:**
  - a flex child holding user-supplied text with no `min-w-0` / `min-width: 0` and no `truncate`
  - a `<table>` with no wrapper carrying `overflow-x: auto`
  - user-generated strings (emails, URLs, filenames, names) rendered with no `truncate` / `break-words` / `overflow-wrap`
  - a nav or chip row with a fixed set of items and no wrap or scroll behaviour
**Fix:** name the behaviour per container — `min-w-0` + `truncate` (with the full value available on hover/title), `overflow-x-auto` on a wrapper, or `flex-wrap`.
**Applies when:** truncation needs a recovery path — a tooltip, title attribute, or detail view — or the data is simply gone from the UI.
**Detect:** STATIC
**Source:** https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (2023) · https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Mastering_wrapping_of_flex_items (rev. 2025)

---

## Don't stretch one element to fill a row

**Principle:** an element's width comes from its content and its role. Full-width is for containers and mobile controls, not for every button and input at desktop.
**Mechanism:** width is read as importance and as target size. A 900px-wide "Save" button doesn't look more important, it looks like a layout bug, and a 900px input makes the eye travel to a field that will hold eight characters.
**Code signal:**
  - `w-full` on a button with no `sm:w-auto` at larger breakpoints
  - form fields stretched to the container width regardless of the length of what they hold (a ZIP code field at full row width)
  - a two-item row using `justify-between` so the gap grows to the container instead of staying a spacing step
**Fix:** size controls to their content class (short/medium/long), keep `w-full` for the mobile breakpoint, and use a `gap` rather than `justify-between` where the pair should stay together.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/form-design-white-space/ (2013) — field width as a cue to expected input length

---

## An element with an intrinsic size gets a fixed width, not a fraction

**Principle:** sidebars, nav rails, icon columns, avatars, and form fields take a fixed width; only the element meant to absorb what's left is fluid.
**Mechanism:** a percentage asserts that the element's ideal width scales with the viewport, which is false for anything sized by its own content. A sidebar at 25% is cramped at 1024px and absurd at 2560px — and the content column beside it was the only thing that had a use for the extra pixels. A 12-column grid is just a constrained set of percentages, so putting a fixed-size element "on the grid" is the same bet with tidier numbers.
**Code signal:**
  - `w-1/4` / `col-span-3` / `width: 25%` on a sidebar, nav rail, or icon column
  - grid-column classes wrapped around content with a natural size — an avatar stack, a logo, a button group
  - a percentage width on an input or field pair, where field width is a cue to how much input is expected
**Fix:** give it its real width (`w-64`, a px `flex-basis`, a fixed grid track) and let the content area take `flex-1` / `1fr`.
**Applies when:** genuinely proportional content — equal card columns, a gallery — is what fractions are for. Cross-ref "Don't stretch one element to fill a row".
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018), pp. 84–91

---

## The mobile layout is designed, not inherited

**Principle:** every section states its behaviour at the small breakpoint — what stacks, what hides, what re-orders. The floor is a 375px viewport.
**Mechanism:** a desktop-first layout with no small-breakpoint statement doesn't degrade gracefully, it degrades arbitrarily: multi-column grids become squeezed columns, fixed paddings eat the content width, and the order that made sense left-to-right makes no sense top-to-bottom.
**Code signal:**
  - a multi-column grid with no single-column breakpoint variant (`grid-cols-3` with no `sm:`/`md:` prefix)
  - large paddings and type sizes with no smaller-breakpoint step — `py-32 px-24` unconditioned
  - `hidden md:block` with no small-screen equivalent for the same content — the content simply disappears below the breakpoint
  - absolute-positioned decoration with pixel offsets and no breakpoint handling
**Fix:** state the stacked layout for each section explicitly, step section padding and display sizes down at the small breakpoint, and give any `hidden`-on-mobile content a real mobile form.
**Applies when:** a mobile-first codebase inverts the signal — there the defect is an *unconditioned* desktop enhancement, not an unconditioned base.
**Detect:** STATIC — the presence of a stated mobile behaviour is static; whether it *looks* right at 375px is `RENDERED` and belongs to `/visual-review`.
**Source:** https://web.dev/articles/responsive-web-design-basics (2019) · https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (2023)

---

## Sticky elements pay for the space they take

**Principle:** a sticky or fixed header/toolbar is accompanied by the scroll offsets that keep anchored content out from under it.
**Mechanism:** a sticky element removes itself from the flow but not from the viewport, so anything scrolled to by anchor, by keyboard focus, or by validation lands underneath it. The element is visible in the layout and invisible in the scroll math.
**Code signal:**
  - `position: sticky` / `fixed` on a header with no `scroll-padding-top` on the scroll container (or `scroll-margin-top` on the anchor targets)
  - a fixed bottom bar with no matching bottom padding on the page content — the last row sits under it
  - a sticky element with no `top`/`bottom` offset, or with a z-index literal rather than a layer token (see `depth-and-surface`)
**Fix:** set `scroll-padding-top` to the sticky height on the scrolling element, pad the content for any fixed bottom bar, and take the stacking value from the layer scale.
**Detect:** STATIC
**Source:** https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding (rev. 2025) · https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html (2023)
