# Forms and mutations

Every entry here is the behavior the stack has to produce; the API that produces it lives in the framework seat's own prompt.

## A form's first validation pass is its submit; the correction pass is on change

**Trigger:** any form with validation — sign-up, settings, an inline edit with more than one field.
**Pattern:** three steps in order. An untouched form marks nothing. **Submit** runs the first pass and marks what failed. A field already marked invalid then re-checks **on change**, clearing the moment its value is good.
**Default it corrects:** wiring the whole form to change- or blur-time validation, so a field goes red while the user is still typing it, or the instant they tab out of one they meant to come back to.
**Why:** before submit the interface has no evidence the user is finished — an email is invalid for every keystroke but the last, and a blur fires on a field they intended to return to, so the error is a complaint about an unfinished thought. After submit that inverts: they've been told what's wrong and are now fixing it, and making them press the button again to learn whether the fix took is asking them to re-ask a question they can already see the answer to. Errors that fire early get tuned out; errors that clear late feel unresponsive.
**Shape:** track validity per field rather than one form-wide flag — a field renders its error once it has been submitted-and-failed, and re-runs its check on every change from then on.
**Applies when:** the field's rule is invisible until the value is complete. A field that teaches its rule as you type — password strength, live username availability — validates on change by design. A validation library's submit-then-revalidate mode is the usual mechanism; this is the ladder it has to produce.

## A failed submit moves focus to the first invalid field

**Trigger:** the failure branch of a submit — client-side or after a server round trip.
**Pattern:** on failure, move focus to the first control the pass marked invalid.
**Default it corrects:** re-rendering the form with its errors painted in and leaving focus where it was — on the submit button, or reset to the top of the document by the round trip.
**Why:** the first invalid field is often several screens above the button that was just pressed, so from where the user is standing the page looks unchanged and the submit looks broken. One focus move does three jobs at once: it scrolls the field into view, it announces the error to a screen reader, and it puts the caret in the control that has to be edited. A summary at the top of the form supplements this; it doesn't replace it, because a summary still leaves the user to find the field.
**Applies when:** every validated form. On a server round trip the error map comes back with the render, and the focus move is the component's to make.

## The control that caused the mutation reports its outcome

**Trigger:** a submit button, a per-row Save, a toggle that writes — anything the user presses that then succeeds or fails.
**Pattern:** the control carries its own state in place — `Save` → `Saving…` → `Saved` — and settles back after the moment passes.
**Default it corrects:** firing a toast for something the user is already looking at, so the confirmation appears in a corner while their eye is on the button they just pressed.
**Why:** the eye is already on the control; feedback anywhere else is a second thing to find, and a corner toast is the one region reliably tuned out. Reporting at the origin also makes the outcome unambiguous when several rows each have their own Save.
**Shape:**
```html
<button disabled={pending}>{pending ? 'Saving…' : saved ? 'Saved' : 'Save'}</button>
```
**Applies when:** the outcome lands on the screen the control is on. Cross-screen outcomes are the next entry. A failure that needs explaining still renders as an error at the control's field, not only in the button's label.

## A toast is for an outcome that lands on a different screen

**Trigger:** a mutation that redirects — create-then-go-to-detail, delete-then-return-to-list.
**Pattern:** carry the outcome as a **one-shot flash** — set server-side on the redirect, consumed by the first render that reads it — and show it as a toast on arrival.
**Default it corrects:** a persistent banner on the destination that stays until dismissed, or the message stuffed into a query parameter so the URL carries it.
**Why:** on the destination there is no originating control left to report at, so a toast is the only thing that ties the message to the action. It has to be one-shot because the message describes a moment: a query param survives a refresh, a bookmark, a share and a back-navigation, and reappears long after the thing it described is gone. A banner has the same problem in a shape that also takes layout space.
**Shape:** set the flash server-side on the redirect, read and clear it on the next render — a cookie cleared on read, or the framework's session flash.
**Applies when:** the outcome genuinely lands elsewhere. Same-screen is the previous entry. Errors that block the operation are neither — they belong at the field or control that produced them, where the user can act on them.

## A save that returns to the same screen doesn't move the scroll position

**Trigger:** a mutation that re-renders the current screen — a settings save, an inline edit, a row action on a long list.
**Pattern:** re-render in place rather than navigating; where a navigation is unavoidable, opt out of the scroll reset explicitly.
**Default it corrects:** navigating to the same URL to refresh the data, which most routers treat as a fresh navigation and scroll to the top.
**Why:** the operator is looking at the control they pressed, usually somewhere down a long form. Jumping to the top loses their place and reads as a failure — they can't see the thing they just changed, so they check it again. Only an outcome landing on a *different* screen earns the trip to the top.
**Applies when:** the current screen persists — this is the rule the component's callbacks have to leave room for.

## A confirmation step held in the URL keeps the operator where the trigger was

**Trigger:** a destructive action that confirms through URL state — `?confirm=<id>`, a `/confirm` child route — rather than a dialog.
**Pattern:** the confirm state appears without moving the operator: the page keeps its scroll position and focus stays on the trigger, which is where the confirm control now sits.
**Default it corrects:** reaching the confirm state through an ordinary navigation, so whatever the stack does on a route change happens — scroll to the top, focus reset to the document — while the control the operator now has to press is back down where they were.
**Why:** the confirm step exists to make the operator look before they act, and it just moved the thing to look at off screen. They pressed a control at the foot of a long list and the page appears to have jumped somewhere unrelated; the confirm becomes something to hunt for, which is the opposite of a deliberate second press.
**Applies when:** the confirm state renders on the same screen. One that genuinely lands on a different screen is a navigation and resets normally — and where the stack resets nothing on a same-route change, there is nothing to do: the rule is the operator's position, not the opt-out.

## An explanation goes on screen; `aria-describedby` points the control at it

**Trigger:** a control whose effect isn't obvious from its label — a toggle that changes what other people can see, a checkbox with a consequence, a destructive action.
**Pattern:** render the consequence as visible text near the control, give it an `id`, and point the control at it with `aria-describedby`.
**Default it corrects:** writing the explanation into the control's `aria-label` (or `title`), so the only person who gets it is the one using a screen reader.
**Why:** an accessible name is a name, not a place to put content — nothing paints it, so the sighted user infers the consequence from a bare toggle. Worse, it *replaces* the visible label rather than adding to it, so the string that was supposed to explain more explains less.
**Shape:**
```html
<input id="vis" type="checkbox" aria-describedby="vis-note">
<p id="vis-note">Anyone with the link can view this.</p>
```
**Applies when:** the string is a description. A genuinely icon-only control still needs `aria-label` for its *name*.

## A stateful control sits inside its own `<label>`

**Trigger:** a checkbox, radio or switch with visible text beside it.
**Pattern:** wrap the control and its text in one `<label>`, so the visible string *is* the accessible name.
**Default it corrects:** an `aria-label` on the input plus a separate `<span>` of visible text — two strings kept in step by hand, which drift the first time one is reworded.
**Why:** label-in-name (WCAG 2.5.3) requires the accessible name to contain the visible text, so a voice user can say what they can see. Wrapping makes that structural rather than a promise: there is only one string, so it can't drift.
**Shape:**
```html
<label><input type="checkbox" name="public"> Make this public</label>
```
**Applies when:** the text sits beside the control. A label placed elsewhere in the layout uses `<label for>` — same one-string rule, different mechanism.
