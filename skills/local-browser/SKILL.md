---
name: local-browser
description: Drive the running local dev app in a real browser at localhost — QA a change, reproduce a UI bug, measure rendered DOM and computed styles. Use whenever the target URL is localhost.
allowed-tools: mcp__chrome-devtools__new_page, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__list_pages, mcp__chrome-devtools__select_page, mcp__chrome-devtools__close_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__emulate, mcp__chrome-devtools__resize_page, mcp__chrome-devtools__click, mcp__chrome-devtools__hover, mcp__chrome-devtools__fill, mcp__chrome-devtools__fill_form, mcp__chrome-devtools__press_key, mcp__chrome-devtools__wait_for, mcp__chrome-devtools__evaluate_script, mcp__chrome-devtools__list_console_messages, mcp__chrome-devtools__list_network_requests, Read
---

<!-- vendored (locally authored — no upstream) → `skills/local-browser`. Thin project wrapper over the `chrome-devtools` MCP server (ChromeDevTools/chrome-devtools-mcp), backing the `/visual-review` and `/accessibility-review` passes. Every fact below was verified against chrome-devtools-mcp@1.7.0 on 2026-08-24 by driving the server directly — re-verify the clamp and the whole-state behaviour after a server upgrade rather than trusting this file. No upstream skill exists → no re-sync source; maintain it here. -->

# local-browser

The tool schemas are in your context — this file carries only what they do not say.

The server runs **headless** on a persistent profile at `~/.cache/chrome-devtools-mcp/chrome-profile`, so nothing appears on the user's screen and logins survive across runs. One browser serves the whole session: every seat driving it shares the same pages.

## 1. The dev server is the user's

Ask the user to start it, and wait for their confirmation before opening anything. If nothing responds at the target URL, stop and ask — a failed load is theirs to fix, not yours to route around.

## 2. Work from snapshots, not screenshots

`take_snapshot` returns the a11y tree with a `uid` per element, and every interaction tool takes that `uid`. Screenshots are for the human reading the report: capture with `filePath` and `Read` the file when a defect needs to be *seen*.

## 3. Set a breakpoint with `emulate`, and carry every override on every call

`emulate` takes the viewport as a string — `"375x812x3,mobile,touch"` — and renders a true 375px CSS viewport. Two verified behaviours decide whether a sweep is measuring what it thinks:

- **`resize_page` clamps at ~500px.** It sizes the window, and Chrome's minimum window width floors it — headless included. `resize_page` to 375 leaves `innerWidth` at 500 and reports success. Widths below ~500 belong to `emulate`.
- **`emulate` sets whole state, not a patch.** Each call replaces the emulation config, so an `emulate` carrying only `colorScheme: "dark"` silently drops a viewport set earlier and the page snaps back to 500px. Send every override you still want in the same call: `{viewport: "375x812x3,mobile,touch", colorScheme: "dark"}`.

The viewport override **survives navigation** — set it once per breakpoint and drive the whole route list under it.

## 4. On an auth redirect, hand back

Headless means there is no window for the user to log into. The profile is the seam: it persists, so one interactive login serves every later run. Give them the command, wait for confirmation, then re-navigate.

```bash
# user runs this, logs in, quits Chrome — the headless server picks up the cookies
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --user-data-dir="$HOME/.cache/chrome-devtools-mcp/chrome-profile"
```

Chrome locks that directory, so their window and the server's browser take turns — confirm they have quit before driving again. For a deliberately **logged-out** state, `new_page` with `isolatedContext` gives a clean cookie jar without touching the profile.

## 5. Measure with `evaluate_script`

It takes a function declaration — `() => getComputedStyle(document.querySelector('.x')).outlineWidth` — evaluated fresh each call, so there is no cross-call redeclaration to work around. Ask one question per call and put the value inline next to the finding. `filePath` diverts a large result to a file instead of your context.

`list_console_messages` and `list_network_requests` cover the errors a rendered page hides: a failed fetch, a hydration warning, a 404 on an asset that leaves a gap rather than an error.

## Done when

Every claim about the app is backed by an observed snapshot, screenshot, or `evaluate_script` result — never inferred from source — and `close_page` has run on the pages you opened.
