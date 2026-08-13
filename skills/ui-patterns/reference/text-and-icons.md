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
**Applies when:** the text can wrap. A single-line label that cannot wrap centers fine either way — reach for this when the string is user-supplied or the container is narrow. `lh` units carry a Baseline status; `modern-css` owns whether this stack needs a fallback.

## No prose for what the UI already demonstrates

**Trigger:** about to write helper text under a control, a sentence introducing a section, a caption beside an image, or an explanatory line at the top of a screen.
**Pattern:** write the words only where they carry what the interface can't show — a constraint, a consequence, a format the field doesn't reveal, what happens after the button.
**Default it corrects:** a paragraph restating what is visible — "Use the form below to update your profile" above a profile form, "Enter your email address" under a field labeled Email, a caption naming what the picture plainly shows.
**Why:** every redundant line is one more thing between the reader and the control they came for, and each one costs the *next* line credibility: prose that has been useless three times gets skipped on the fourth, including the time it mattered. It's also a second thing to keep true when the UI changes.
**Applies when:** always for decorative prose. Empty states, errors and confirmations are the opposite case — they say what happened and what to do next, because there is no UI demonstrating it.
