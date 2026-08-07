# Depth & surface

Elevation, shadow, scrims, focus, and stacking. Depth is a language with a small vocabulary — raised, floating, overlaying — and most defects here are the same word used for three different meanings, or three words used for one.

---

## Elevation is a scale mapped to purpose

**Principle:** shadows come from a small set of levels, each assigned to a kind of element: resting surface, raised control, floating menu, overlay.
**Mechanism:** shadow size is read as height. When every shadow is bespoke, the height ordering stops being consistent, so the eye can no longer tell what is above what — which is the only information the shadow was carrying.
**Code signal:**
  - one-off `box-shadow` literals in component files rather than elevation tokens
  - the same shadow token on a card and on a modal — two very different heights claiming the same one
  - a dropdown or popover with no shadow at all, sitting over content it's supposed to float above
**Fix:** define three or four elevation steps as tokens, assign by element role, and replace the literals.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://atlassian.design/foundations/elevation (2024)

---

## A shadow is layered and transparent

**Principle:** shadows are stacked transparent-dark layers — a tight one for the contact edge, a wider soft one for ambient falloff. Never a single blur of an opaque gray.
**Mechanism:** real occlusion has two components, a sharp near-shadow and a diffuse far one. One blur can approximate either but not both, and an opaque gray shadow doesn't darken what's under it — it paints over it, which is why it reads as a gray smear on any non-white surface.
**Code signal:**
  - `box-shadow: 0 4px 12px #ccc` / `… rgba(0,0,0,1)` — an opaque or fully-solid shadow color
  - a single large-blur shadow as the only elevation (`0 20px 40px rgba(0,0,0,.4)`) — heavy, with no contact edge
  - a shadow tinted with a hue unrelated to the surface it falls on
**Fix:** compose two or three layers of low-alpha black (or a very dark palette step) — small offset/blur plus a larger softer one — and store the result as the elevation token.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://tobiasahlin.com/blog/layered-smooth-box-shadows/ (n.d.)

---

## One light source, and it is above

**Principle:** shadows carry a positive y-offset and never a negative one; a raised element gets a lighter top edge, a pressed or recessed one an `inset` shadow at the top.
**Mechanism:** depth is inferred from a single consistent light direction — a raised panel's top edge is lighter because it faces the sky, its bottom darker because it faces away, and no other geometry could produce those edges. Two elements lit from different directions on one screen cancel that inference, and the surface reads as flat with artifacts rather than as layers.
**Code signal:**
  - a negative y-offset — `box-shadow: 0 -4px 12px …` — on anything but a genuinely upward-facing edge (a bottom sheet, a sticky footer)
  - y-offsets of mixed sign across components in one system, or `0 0 Npx` glows standing in for elevation
  - a pressed/active state that changes color but keeps the raised outer shadow, with no `inset`
  - a raised control with no lighter top edge, or one faked with translucent white over a saturated fill — which desaturates the color underneath
**Fix:** take the y-sign and the top-edge highlight from the elevation scale, as solid steps; give pressed states `inset` with the offset flipped.
**Applies when:** cross-ref "Elevation is a scale mapped to purpose" for which step, and "In dark mode elevation is lightness, not shadow" for where shadow stops carrying it at all.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018), pp. 172–179

---

## One separation per edge

**Principle:** a boundary is drawn once — a border, *or* a shadow, *or* a background change. Not all three.
**Mechanism:** each device says "this is a different plane". Saying it three times doesn't make the plane more distinct, it makes the boundary the loudest thing in the component, competing with the content it contains.
**Code signal:**
  - a card carrying `border`, `shadow-md`, and a surface color different from the page in one class string
  - a section separated by a background change *and* a top border *and* a shadow
  - a hover state that adds a border while the resting state already had a shadow (the element grows by 1px on hover, too)
**Fix:** keep the one device the design system uses for that role — typically border on flat/dense UI, shadow on elevated UI — and drop the others.
**Applies when:** a border *plus* shadow is legitimate where the surface and the page share a color (a white card on white), because the shadow alone can't hold the edge in high-brightness viewing.
**Detect:** STATIC
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://lawsofux.com/law-of-common-region/ (2020)

---

## In dark mode elevation is lightness, not shadow

**Principle:** dark themes convey height by making the raised surface lighter. Shadow tokens are reduced or dropped, not reused.
**Mechanism:** shadow works by darkening a surface, and there is nothing left to darken on a near-black one. Higher surfaces catching more light is the physically-consistent substitute, which is why every mature dark theme ships surface steps rather than shadow steps.
**Code signal:**
  - a `.dark` / `prefers-color-scheme: dark` block that changes colors but leaves the elevation tokens untouched
  - a dark theme with exactly one surface color, so cards, sheets, and modals are all the same value
  - `box-shadow` with a light color in dark mode, faking a glow to compensate
**Fix:** add surface steps to the dark scale (page → raised → overlay), map elevation roles onto them, and let the shadow tokens fall back to near-nothing in dark.
**Detect:** STATIC
**Source:** https://atlassian.design/foundations/elevation (2024) — "surfaces appear lighter at higher elevations" in dark mode · https://www.nngroup.com/articles/dark-mode/ (2020)

---

## Text over imagery sits on a scrim, not on hope

**Principle:** any text over a photo, video, or gradient art gets a deliberate scrim layer between them — a gradient or tinted overlay covering the text's own area.
**Mechanism:** an image's local luminance is unknown at build time and changes per asset, so the contrast of text over it is not a fixed value. A scrim replaces the unknown with a floor: the darkest the text's background can be.
**Code signal:**
  - text positioned over an `<img>`/`background-image` with no overlay element or gradient in between
  - a scrim applied to the whole image at a token opacity while the text sits in the lightest corner
  - `text-shadow` used as the only legibility device over a photo
  - `opacity` lowered on the image instead of a scrim layer over it — the image loses its own contrast and the text still floats on an unknown value
**Fix:** add a gradient scrim anchored to the text's edge (`linear-gradient(to top, rgb(0 0 0 / .6), transparent)`), and check the text against the scrim's floor rather than the image.
**Applies when:** this is where alpha is *correct* — a scrim is genuine translucency, not a shade (see `color-and-contrast`).
**Detect:** STATIC — the *presence* of a scrim is static; whether the rendered result clears contrast over a given photo is `RENDERED`, and belongs to `/visual-review`.
**Source:** *Refactoring UI* (Wathan & Schoger, 2018) · https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html (2023)

---

## Focus must stay visible on every surface it can land on

**Principle:** a focus indicator is never removed without a replacement, and its color is checked against every surface the element sits on.
**Mechanism:** focus is the only positional feedback a keyboard user gets. `outline: none` is one declaration that deletes the entire cursor for a whole class of users, and the reason it's so common is that the default outline is ugly on rounded controls — a styling problem answered by removal instead of by styling.
**Code signal:**
  - `outline: none` / `focus:outline-none` with no `focus-visible` ring, border, or shadow replacing it
  - a global reset removing outlines on `*` or on `:focus`
  - a ring token that matches the accent surface it lands on, or has no `outline-offset` on a filled control
  - focus styles defined on `:focus` only, so a mouse click leaves a ring behind (the tell that `:focus-visible` was never adopted)
**Fix:** replace with a `:focus-visible` ring at ≥3:1 against the adjacent surface, with an offset so it clears rounded fills.
**Applies when:** cross-lane with `accessibility-review` (WCAG 2.4.11/2.4.13); report the craft side and cite the overlap.
**Detect:** STATIC
**Source:** https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html (2023) · https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html (2023)

---

## Stacking order is a scale, not a number someone picked

**Principle:** `z-index` values come from a named set — dropdown, sticky, overlay, modal, toast — in one place.
**Mechanism:** z-index is only meaningful relative to siblings in the same stacking context, so ad-hoc values encode an ordering nobody can read and every new overlay has to out-bid. `9999` is the visible end state of that auction, and it still loses to a transform-created context somewhere up the tree.
**Code signal:**
  - literal `z-index: 9999` / `z-50` / `z-[100]` scattered across components
  - two different overlays with the same z-index and different intended order
  - a stacking fix applied as `position: relative; z-index: 1` on an ancestor, with no comment saying which context it was rescuing
**Fix:** define the layer scale as tokens and reference them; where a fix is really about a stacking context (`transform`, `filter`, `opacity` on an ancestor), fix the context and say so in a comment.
**Detect:** STATIC
**Source:** https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context (rev. 2025) — why a value only ranks against its own context · https://atlassian.design/foundations/elevation (2024)
