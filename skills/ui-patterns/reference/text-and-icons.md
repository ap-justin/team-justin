# Text and icons

## An icon beside a label aligns to the label's first line

**Trigger:** an icon, bullet, avatar or status dot set beside text that can wrap to two or more lines.
**Pattern:** give the icon a box exactly one line tall and align it to the start of the text.
**Default it corrects:** centering the icon against the whole text block, so it drifts to the middle of a two-line label and lands between the lines on three — or pinning it with a hand-tuned `margin-top` that is correct at exactly one font size.
**Why:** the reader's eye enters at the first line; the icon labels that entry point, not the paragraph's geometric center. A magic-number offset also silently breaks the moment the type scale, the line-height, or the user's zoom changes.
**Shape:**
```css
.icon { block-size: 1lh; align-self: start; }  /* one line tall, so it centers on the first line */
```
**Applies when:** the text can wrap. A single-line label that cannot wrap centers fine either way — reach for this when the string is user-supplied or the container is narrow. `lh` units carry a Baseline status; `modern-css` owns whether this stack needs a fallback. **Where the mark is also a tap target**, the one-line box is the *layout* box and the target grows around it — padding, or an overlay pseudo-element — so the alignment above still holds. A 44px layout box measures more than one line, and `align-self: start` only moves whichever box is shorter than the row: inert while the label is single-line, and moving the *label* instead once it wraps past 44px. Measure both boxes before accepting a one-line alignment fix.

## Explanatory prose enters on request, and the request is a defect report

**Trigger:** about to write helper text under a control, a sentence introducing a section, a caption beside an image, or an explanatory line at the top of a screen — or handed a request to add one.
**Pattern:** ship the screen without it. When prose is asked for, read the ask as a report that the control, its label, or the step order is unreadable — fix that, and write the line only where the words themselves were what was wanted.
**Default it corrects:** deciding on your own that the screen needs explaining — "Use the form below to update your profile" above a profile form, "Enter your email address" under a field labeled Email, a caption naming what the picture plainly shows — and then, once someone does ask for a line, pasting the sentence in and shipping, leaving the control that earned the ask exactly as it was.
**Why:** every redundant line is one more thing between the reader and the control they came for, and each one costs the *next* line credibility: prose that has been useless three times gets skipped on the fourth, including the time it mattered. That skip rate is also why the requested sentence is the wrong fix alone — the line reaches the few who read prose, while the unreadable label meets everyone. It's a second thing to keep true when the UI changes, too.
**Applies when:** always, for prose explaining the interface. Empty states, errors and confirmations are the opposite case — they say what happened and what to do next, because there is no UI demonstrating it. An empty state says what to do; a paragraph on what the section is for is the standfirst with fewer rows. Prose survives only for what the UI cannot show: a consequence in a confirm, a refusal, an errand elsewhere. A constraint the control genuinely can't express — a format, a limit, what happens after the button — is not a licence to write it unasked: build the control so it carries the constraint, and where nothing can, name the gap in your return.

## Copy states what the system guarantees, not the outcome downstream of it

**Trigger:** a line of copy claiming something about a number the product controls only one side of — a fee, a payout, a delivery date, a refund, a rate.
**Pattern:** state the side the rule actually fixes. Where the rule sets what the user is charged, say what they pay; say what someone else receives only where nothing between here and there can change it.
**Default it corrects:** promoting the rule into the outcome the reader cares about — "100% reaches the recipient" from a rule that only sets the sender's fee, so any cost further down the chain makes the sentence false.
**Why:** it's a promise the code cannot keep, and unlike a wrong label it is not wrong *on the screen where it's written* — it fails later, elsewhere, to someone counting the difference. Nothing on this screen can catch it, so the check happens as the line is written or not at all.
**Applies when:** money, time and quantity claims. A claim wholly inside the system's own control — "your changes are saved" — is not this.

## A stored display name sits after a fixed phrase

**Trigger:** attribution copy rendering a name the system stored — "set by", "edited by", an activity row, a byline.
**Pattern:** park the name after a phrase the product owns: `set by {name}`, `removed by {name}`, `worked on by {name}`.
**Default it corrects:** `{name} removed this` at the head of a sentence, or `{name}'s changes` — both assuming the stored string is capitalised and grammatically a person's name.
**Why:** display names are not reliably capitalised (an account seeded from a credentials file stores the lower-cased username), and capitalising one at render is a different bug — it rewrites someone's name. The English possessive fails on a name already ending in *s*, and on anything that is not a person. Neither breaks on the screen where it is written; both break on one user's row, in production.
**Applies when:** the name is user- or system-supplied. A literal the product controls is prose and reads normally.

## A section's status word reads standalone

**Trigger:** a per-section state summary in a settings or setup screen — one word per section, scanned down a column.
**Pattern:** pick words that parse alone — **Configured** / **Incomplete** — and spell the incomplete state the same way in every section. A section that cannot determine its own status reports one page-level failure, said once, in the shape the app already uses for a lost connection.
**Default it corrects:** relative words that only parse while reading the whole ledger top to bottom ("Ready", "Not yet", "None yet"), spelled differently per section — and the incomplete word doubling as the state a failed status fetch falls back to.
**Why:** per-section spellings read as variety to the author and as inconsistency to everyone else. The fallback is the expensive half: telling an operator their working setup is unconfigured sends them to fix something that is not broken, and a status word that can lie about a working system is worth less than no status word.
**Applies when:** several sections report status side by side. A lone status word has no column to be inconsistent with.

