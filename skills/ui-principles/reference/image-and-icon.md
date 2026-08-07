# Image & icon

Media is where a layout meets content it didn't author. Every entry here is about the gap between the box the design reserved and the asset that actually arrives — a different aspect ratio, a missing file, a second icon set, a 4000px photo.

---

## Every image declares its box before it loads

**Principle:** an `<img>` carries `width` and `height` attributes (or its container carries `aspect-ratio`), so the space is reserved before the bytes arrive.
**Mechanism:** without intrinsic dimensions the browser reserves zero height, lays out everything below at the wrong position, then relays out when the image decodes. That jump is layout shift — the reader loses their place, and a tap can land on whatever moved into the gap.
**Code signal:**
  - `<img src=… >` with no `width`/`height` attributes and no `aspect-ratio` on it or its wrapper
  - a responsive image sized only in CSS (`w-full h-auto`) with no intrinsic dimensions declared
  - a lazy-loaded gallery or avatar list with no reserved boxes
  - late-loading embeds (iframes, video players, ad slots) dropped into flow with no placeholder box
**Fix:** set the real intrinsic `width`/`height` (CSS may still scale it), or give the wrapper `aspect-ratio` plus `width: 100%`.
**Detect:** STATIC
**Source:** https://web.dev/articles/optimize-cls (2020, rev. 2025) · https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio (rev. 2025)

---

## Images crop, never stretch

**Principle:** an image forced into a box that isn't its own aspect ratio is cropped with `object-fit`, and the crop's focal point is stated.
**Mechanism:** the default `fill` distorts — faces widen, logos skew — and distortion of a real-world subject is the single most conspicuous "unfinished" tell in an interface, because the eye holds a prior for what the subject should look like.
**Code signal:**
  - fixed `width` *and* `height` (or `w-full h-48`) on an `<img>` with no `object-fit` / `object-cover`
  - `background-size` unset on a decorative background image with a fixed-height box
  - `object-cover` with no `object-position` on portrait/subject imagery, so heads crop at the top edge
  - user-uploaded imagery rendered without a normalizing aspect box, so each card is a different height
**Fix:** `object-fit: cover` plus an `object-position` chosen for the subject, inside an `aspect-ratio` box; use `contain` for logos, where cropping is worse than letterboxing.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit (rev. 2025)

---

## One icon set, one weight, sizes from a scale

**Principle:** icons come from a single family at a consistent stroke weight and optical size, sized from the type or spacing scale.
**Mechanism:** icons are read as one alphabet. A second family mixes two drawing conventions — different stroke widths, corner radii, and grid sizes — and the mismatch is legible even to someone who can't name it, because the eye compares glyph weight against the text beside it.
**Code signal:**
  - imports from two icon packages in one component or route (`lucide-react` beside `react-icons`, `@heroicons` beside inline hand-drawn SVGs)
  - arbitrary icon sizes — `w-[18px]`, `h-[22px]` — beside scale-sized siblings
  - a hand-rolled decorative SVG sitting next to library icons in the same row
  - a filled icon variant used beside outline variants of the same set with no state meaning attached
**Fix:** pick the set the repo already depends on, delete the second import, and size icons from the scale (matching the adjacent text's step where they sit inline).
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/icon-usability/ (2014)

---

## An asset renders near the size it was drawn at

**Principle:** an icon, screenshot, or logo renders close to the size its artwork was drawn for. Several multiples in either direction calls for a different asset, not a different width.
**Mechanism:** vector doesn't mean scale-free. A glyph drawn on a 24px grid carries only the detail that grid affords, so at 4× the strokes grow and the information doesn't — it reads chunky and underdetailed. Downward is the mirror: a 2560px screenshot at a third size renders its 16px UI text at 5px, and a logo drawn at 128px turns to mush in a 16px favicon square, where the browser picks the compromises instead of you.
**Code signal:**
  - an icon from a 16/24px set at display size — `<Check className="size-16" />`, `w-20 h-20` on a features-grid icon, or an SVG with `viewBox="0 0 24 24"` in a box many multiples of 24
  - a full-resolution screenshot in a small box — a 2560px-wide `<img>` inside `max-w-sm`, or `width={1440}` rendered at a fraction of that by CSS
  - `<link rel="icon">` or a web-app manifest pointing at the full logo asset, with no version drawn at 16/32px
  - `transform: scale(3)`, or a `width`/`height` override on an `<svg>`, standing in for an asset authored at the target size
**Fix:** keep the glyph near its intended size and fill the space around it — a rounded tinted shape behind a 24px icon reads as a large feature icon. Take the screenshot at a narrower viewport, crop to the part that matters, or draw a simplified version with small text replaced by lines; redraw the favicon at its target size.
**Applies when:** artwork drawn as a composition — a hero illustration, a full logo lockup — scales as far as its own detail allows. The defect is a small-grid asset pushed far past that grid, or a dense one crushed below it. Cross-ref "One icon set, one weight, sizes from a scale" for family and weight.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018), pp. 208–213

---

## An icon alone is not a label

**Principle:** an icon-only control carries a text label, an accessible name, and — where the meaning isn't universal — a visible one.
**Mechanism:** icon recognition is learned, not innate: outside a handful of conventions (search, close, print), users identify an icon by the label that has always accompanied it. Removing the label doesn't make the meaning implicit, it makes it a guess.
**Code signal:**
  - `<button><Icon /></button>` with no `aria-label`, `title`, or visually-hidden text
  - a toolbar or bottom nav of icon-only actions where none is a universal convention
  - an icon whose meaning is carried entirely by color (see `color-and-contrast`)
  - a tooltip as the only label on a touch-primary surface — there is no hover to reveal it
**Fix:** add a visible label where space allows; otherwise an accessible name plus a tooltip, and reserve icon-only for conventions users already hold.
**Applies when:** cross-lane with `accessibility-review` for the accessible-name half; the *visible*-label judgement is this corpus's.
**Detect:** STATIC
**Source:** https://www.nngroup.com/articles/icon-usability/ (2014) · https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html (2023)

---

## Every avatar, logo, and thumbnail has a deterministic fallback

**Principle:** any image sourced from data renders something specific when the source is missing, broken, or slow — initials, a monogram, a neutral placeholder at the same box.
**Mechanism:** the empty case is the common case in real data, not the exception. Without a fallback the layout renders a broken-image glyph or a collapsed box, so the failure appears as a defect in the interface rather than as absent data.
**Code signal:**
  - `<img src={user.avatarUrl} />` with no conditional branch, `onError` handler, or fallback component
  - a logo grid mapping straight over data with no placeholder for a missing asset
  - a fallback that renders at a different size than the image it replaces, so the row height changes
  - `alt` text absent on meaningful imagery, or non-empty on purely decorative imagery
**Fix:** render a fallback component at the identical box (initials from the name, a neutral tile), branch on the missing source rather than relying on the browser's broken-image state, and match `alt` to whether the image carries meaning.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.nngroup.com/articles/empty-state-interface-design/ (2021)

---

## Decorative art is not the empty state

**Principle:** an empty state is a composition — a heading, one line of explanation, and the action that fills it. Illustration is optional garnish on top of that structure.
**Mechanism:** an empty screen is the moment a user has the least context and the most doubt about whether something is broken. An illustration answers none of that; the sentence and the button do.
**Code signal:**
  - an empty branch rendering only an image/illustration, or only a single muted sentence
  - an empty state with no action, in a view where the user could create the missing thing
  - the same generic empty component reused for empty, filtered-to-nothing, and errored — three different situations with one message
**Fix:** give each empty branch its own heading + explanation + action, and separate "nothing yet" from "nothing matched" from "failed to load".
**Applies when:** *whether the empty state exists at all* is `ux-principles`' `states-and-feedback` lane — this entry is about the composition of one that does. Report it once.
**Detect:** STATIC
**Source:** https://www.nngroup.com/articles/empty-state-interface-design/ (2021) · *Refactoring UI* (Wathan & Schoger, 2018)
