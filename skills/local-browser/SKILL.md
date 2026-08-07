---
name: local-browser
description: Test the local dev app in a real browser using agent-browser. Use when the user asks to test, check, verify, or QA something at localhost, or says "check with browser", "test in browser", "open localhost", etc. Handles auth session persistence so login is only needed once.
allowed-tools: Bash(agent-browser:*), Bash(npx agent-browser:*)
---

<!-- vendored (locally authored — no upstream) → `skills/local-browser`. Thin project wrapper over the `agent-browser` CLI (vercel-labs/agent-browser) with persistent-auth session handling, backing the `/visual-review` skill. NOTE: the provisioning table listed `mattpocock/skills` as the source, but no `local-browser` skill exists anywhere in that repo's tree (verified against main, sha 9603c1c); no matching upstream skill exists, so there is no re-sync source. Kept verbatim. -->

# local-browser

Browser-test the local dev app using agent-browser with persistent auth.

## Prerequisites

- The dev server must already be running — **never start it yourself**. If it's not running, ask the user to start it.

## Workflow

### 1. Open with a project-scoped persistent session

```bash
SESSION="bg-$(basename "$PWD")"
agent-browser --session-name "$SESSION" --headed open <url>
```

- **Scope the session name to the project** (`bg-<dir>`) — each named session is a separate, isolated browser instance, so concurrent agents/projects don't stomp each other's tab/nav state. A single shared name (e.g. `bg-dev`) makes parallel runs collide.
- `--session-name` saves/restores cookies + localStorage across runs (per project; auth persists after first login)
- `--headed` shows the browser so the user can intervene (login, 2FA, etc.)
- Reuse the **same** `$SESSION` for every command in a run so they hit the same instance.

### 2. Check if auth redirect happened

```bash
agent-browser get url
```

If redirected to `/signup` or `/login`:
1. Tell the user to log in via the visible browser window
2. Wait for them to confirm
3. Navigate to the original target URL

### 3. Interact via snapshots

```bash
agent-browser snapshot -i              # interactive elements with @refs
agent-browser snapshot -i -s ".class"  # scoped to a selector
agent-browser click @e1                # click by ref
agent-browser fill @e2 "text"          # fill input
agent-browser type @e2 "text"          # type without clearing
```

Re-snapshot after every navigation or DOM change — refs are invalidated.

### 4. Inspect DOM / computed styles

```bash
cat <<'JSEOF' | agent-browser eval --stdin
(() => {
  const el = document.querySelector('.my-selector');
  return JSON.stringify({
    h: el?.getBoundingClientRect().height,
    display: getComputedStyle(el).display,
  });
})()
JSEOF

agent-browser eval "document.activeElement?.tagName"
```

Use IIFE wrapper to avoid redeclaration errors across multiple eval calls.

### 5. Change viewport by emulation — never resize the window

To review a breakpoint, set the **emulated** viewport. Do **not** resize the OS window: real headed Chrome enforces a minimum window width (tab strip + controls, ~400–500px, wider with more tabs open), so a physical resize clamps and silently renders the wrong width.

```bash
agent-browser set viewport 375 812        # rendered innerWidth=375 while the window stays full-size (CDP device-metrics override — immune to the min-width floor)
agent-browser set device "iPhone 16 Pro"  # adds DPR + touch + mobile UA on top of the viewport
```

- `set viewport <w> <h>` emulates the CSS viewport independently of the window — verified: `innerWidth` becomes 375 while `outerWidth` stays ~1470. Use it for arbitrary breakpoints (desktop 1440 / tablet 768 / mobile 375).
- `set device "<name>"` for higher-fidelity mobile (correct devicePixelRatio, touch, user-agent). Valid names only: `iPhone 15`, `iPhone 16`, `iPhone 16 Pro`, `iPhone 17`, `iPad`, `iPad Pro`, `Pixel 9`, `Galaxy S25` (note: no "iPhone 15 Pro").
- **The override does not survive a navigation — re-set it after every load.** Set viewport → navigate → and you're measuring at the default width again, silently. Sweep a breakpoint as `set viewport` *after* each `open`/`click`-through, not once at the top of the run, or every route after the first is wrong.

### 5b. Screenshots — the element-clip trap

```bash
agent-browser screenshot --path shot.png                 # viewport
agent-browser screenshot --path shot.png --full-page     # whole document
```

**An element-clipped screenshot of something scrolled out of view comes back blank or as empty space** — the clip rect is taken against the document, but offscreen regions aren't painted. Scroll it into view first; if it's still coming back empty (a tall element, a transformed ancestor, an offscreen slide/deck panel), stop fighting the clip and take a `--full-page` shot, or render the piece standalone at its own URL. Two blank captures is the signal to switch approach, not to retry the clip a third time.

### 6. Clean up

```bash
agent-browser close
```

## Key rules

- **Change breakpoints with `set viewport` / `set device` (emulated) — never resize the window.** A physical resize clamps at Chrome's min-width floor and renders the wrong width; emulation renders a true 375px inside a full-size window.
- **Use `snapshot -i` + `@refs` for interaction** — not screenshots
- **Always use a project-scoped `--session-name` (`bg-$(basename "$PWD")`)** so auth persists between runs *and* parallel projects stay isolated
- **Always use `--headed`** so the user can see and intervene
- **Re-snapshot after any page change** — refs expire on navigation/DOM updates
- **Re-set the viewport after every navigation** — the emulation override is dropped on load, so a breakpoint set once at the top of a multi-route sweep only holds for the first route
- **Two blank element screenshots = change approach** (`--full-page` or a standalone render), not a third attempt at the clip
- **Use `eval --stdin` with heredoc** for complex JS — shell escaping is unreliable
- **Never name a shell variable `path`** (or `PATH`, `cdpath`, `fpath`, `manpath`) — in zsh `path` is tied to `$PATH` as an array, so assigning it wipes the command search path and every subsequent command in the run fails. Use `p`, `target`, `shot_path`
