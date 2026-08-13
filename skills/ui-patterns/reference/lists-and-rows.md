# Lists and rows

## A repeated control names its own row to assistive tech, not on screen

**Trigger:** an action that appears on every row — Remove beside each field group, Edit on each card, a per-row menu.
**Pattern:** keep the visible word constant; give each instance its own accessible name from the row it acts on.
**Default it corrects:** either twelve buttons all announcing "Remove", or a visible label padded out per row ("Remove line 3") that makes the column noisy to read.
**Why:** a screen-reader user hits the button out of context and needs to know which row it drops; a sighted user reads it inside the row and needs no repetition of what the row already says.
**Shape:**
```html
<button aria-label="Remove {row.name}">Remove</button>
```
**Applies when:** any repeated control. Where the row's name is itself rendered adjacent, `aria-labelledby` pointing at both nodes beats duplicating the string.
