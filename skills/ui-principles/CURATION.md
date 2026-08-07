# Curating this corpus

Authoring guidance, not runtime context — `SKILL.md` does not point here, so this file costs nothing during an audit. Read it when adding or revising a principle. It is the visual-craft sibling of `skills/ux-principles/CURATION.md`; where the two agree, that one is the original statement and this one doesn't restate it.

## The entry bar

`skills/roster/author.md` is blunt: a skill that restates its sources is **worse than none**. *Refactoring UI* is one of the most widely-summarized design books there is, and every model already carries its headline advice — grayscale first, constrain your scales, don't rely on color. Restating that is not a contribution, and the existing community pack for it (skills.sh `refactoring-ui`) is exactly the restatement plus a Tailwind cheat sheet the framework's own docs serve better.

So the book is **not what this corpus contributes**. The `Code signal` is. Nobody has written down what "spend one emphasis lever" looks like as a class string, or that the tell for margins doing a `gap`'s job is a `:last-child { margin-bottom: 0 }` reset.

The consequence is a writing rule, applied per entry: **if you cannot name a concrete, source-visible tell, the principle does not go in.** Two live examples of what that excludes:

- **"Start with too much white space, then remove."** True, useful, unwriteable — the amount is a rendered judgement and there is no signal distinguishing "correctly generous" from "too much".
- **The squint/blur test.** The single most-cited technique in the book, and it needs eyes. It belongs to `/visual-review`, which has a browser.

Both are correctly absent. A `RENDERED` entry that exists only so the corpus can claim coverage is padding.

## No score

The community pack scores a UI out of ten by counting satisfied checklist rows. This corpus deliberately has no score: the denominator is arbitrary, the rows aren't independent, and a number carries an authority the underlying static read can't support — "7/10" gets quoted downstream long after the findings that produced it are gone. Findings with tiers, or nothing.

## The principle file

Entries live in `reference/<group>.md`, several per file, `##`-headed:

```markdown
## <Principle stated as an instruction>

**Principle:** the rule, one line, imperative.
**Mechanism:** the perceptual or physical cause — scan path, contrast
  perception, pointer precision, how the browser lays out. Never "it looks
  more professional"; that's taste asserted, not a mechanism.
**Code signal:**
  - <tell>, e.g. `p-[13px]`, `outline: none` with no replacement
  - <tell>
**Fix:** the edit shape to propose, one line.
**Applies when:** scope + where it inverts. Omit if genuinely universal.
**Detect:** STATIC | HEURISTIC | RENDERED
**Source:** <Book/authority> · <free URL> (YYYY)
```

~12 lines. Longer and it stops being matchable mid-pass.

- **`Code signal` is the field that earns the entry.** Two to four tells, each a *value shape* — a class, a declaration, an attribute that's absent. "The spacing feels arbitrary" is not a signal; `p-[13px]` is.
- **`Mechanism` is what stops misapplication.** Visual principles attract taste arguments more than UX ones do, and the mechanism is the only thing that outranks an opinion. If the cause you can state is "it looks better", the entry isn't ready.
- **`Detect` is honesty, not metadata.** This corpus skews toward things you *can* count, which makes the occasional `HEURISTIC` easy to mislabel — anything turning on which element was *meant* to be primary is `HEURISTIC`, however visible the styling is.
- **Title the instruction, not the concept.** "Every spacing value comes from the scale" — not "Spacing systems".

## Absolute values are the trap

Half of the book's advice is a specific number: this scale, these shades, that line height. Numbers are what make a signal greppable, and they are also what makes a corpus wrong in a repo that chose differently.

The resolution, stated in `SKILL.md` and enforced per entry: **the project's token file is the scale.** A number in an entry is a *default to compare against*, never the standard. Two rules follow:

- Write the signal as "off the project's scale", with the number as illustration — not "not a multiple of 4".
- Where a number is genuinely absolute because a platform enforces it (16px inputs and iOS zoom, the WCAG target-size floor, contrast ratios), say so and cite the enforcer. Those are the only unconditional numbers in the corpus.

## Grouping

By **what you are looking at**, never by which source it came from. Seven groups: `hierarchy-and-emphasis` · `space-and-proximity` · `type-and-reading` · `color-and-contrast` · `depth-and-surface` · `layout-and-composition` · `image-and-icon`.

A principle that fits two groups goes in the one matching the element where it'd be caught, and is cross-referenced from the other — never duplicated. Scrims live in `depth-and-surface` and are pointed at from `color-and-contrast` and `image-and-icon`; target size lives in `space-and-proximity` because it's a padding fix.

## Framework spread

Signals are written **framework-agnostically, with a concrete example** in whichever idiom shows it most clearly. A defect usually has two spellings — the utility-class one (`text-gray-400`, `w-full`, `p-[13px]`) and the stylesheet one (`color: #9ca3af`, `width: 100%`, `padding: 13px`) — and an entry should carry at least one of each where the difference matters, because a repo on Panda, vanilla-extract, or plain CSS shows the same defect in the second spelling only.

Utility-class examples use Tailwind's vocabulary because it's the most legible shorthand, not because the corpus assumes Tailwind. Never write a signal that only exists in one framework's API.

## The neighbours — what must not be restated here

More than any other corpus in the repo, this one's boundaries run through skills that overlap it:

- **`design-taste-frontend`** (via `/taste-review`) owns the anti-slop rule list — banned palettes, eyebrow caps, layout repetition, hero discipline. Where a rule is already there (opacity-as-lightener is the live example), this corpus may carry the *mechanism* but must say so and defer on reporting.
- **`/visual-review`** owns every `RENDERED` judgement. An entry that would need it is not an entry.
- **`accessibility-review`** owns WCAG conformance. Contrast, target size, and focus visibility appear here because they're craft defects with static signals, each carrying an `Applies when` that names the overlap. Never expand them into a conformance checklist.
- **`design-director`** owns the system. This corpus audits execution against a system; an entry that decides a palette, a type pairing, or a layout language is out of scope.

## Conflicts and revision

- **A design system disagrees with a principle** → that's not a conflict, it's the precedence rule: the project's system wins. Only add an `Applies when` if the disagreement is *common*, not because one repo did it differently.
- **A platform value changes** (target-size minimums, the iOS zoom threshold, a Baseline shift that makes a workaround unnecessary) → rewrite the entry to the current value and keep the citation dated. These are the entries that actually age.

Visual principles age slower than the platforms they're detected on, which is why the aging risk here is in the *signals*, not the principles. When a signal stops appearing in real code (a framework retires the syntax), rewrite the tell; the principle usually survives untouched.

## Adding to the corpus

1. Confirm it isn't already covered — `grep -ril "<term>" reference/` — and isn't a neighbour's (list above).
2. Write the `Code signal` **first**. If that stalls, the entry fails the entry bar; stop.
3. Verify the free URL resolves *and says what you claim* — several major design systems (Material, and other SPA doc sites) return a shell with no text to a fetch, which makes them unverifiable; cite something readable instead.
4. File it in the group matching the element where it'd be caught.
