#!/bin/bash
# pretooluse on the subagent-dispatch tool: the mechanized half of the lead
# contract's handoff scan (lead SKILL.md step 3). refuses a team-seat dispatch
# whose brief carries a file:line coordinate or no learnings channel, and hands
# the reason back so the lead re-anchors and dispatches again. fail open on
# anything that isn't a clear hit — a gate that misfires costs more than one
# it lets through.
command -v jq >/dev/null 2>&1 || exit 0
[ -n "$TEAM_JUSTIN_NO_GATE" ] && exit 0
plugin_root="${1:-$CLAUDE_PLUGIN_ROOT}"
[ -d "$plugin_root/agents" ] || exit 0
input=$(cat) || exit 0

seat=$(printf '%s' "$input" | jq -r '.tool_input.subagent_type // empty' 2>/dev/null)
seat="${seat#team-justin:}"
[ -z "$seat" ] && exit 0
# the auditor's brief is the stop nudge's own template, not a handoff
[ "$seat" = "dispatch-auditor" ] && exit 0
[ -f "$plugin_root/agents/${seat}.md" ] || exit 0

prompt=$(printf '%s' "$input" | jq -r '.tool_input.prompt // empty' 2>/dev/null)
[ -z "$prompt" ] && exit 0

reasons=""
# a coordinate is a stale cache: file.ext:NN, or a bare "line 91" / "lines 20-21"
coords=$(printf '%s' "$prompt" | grep -oE '\.(tsx?|jsx?|mjs|cjs|svelte|vue|astro|md|go|py|rs|css|scss|json|sql|html|ya?ml|toml|sh)\b:[0-9]+|\blines? [0-9]+' | head -5 | tr '\n' ' ')
[ -n "$coords" ] && reasons="coordinates instead of named anchors: ${coords}(re-anchor each to its function/const/section — item 2, scan 1). "
printf '%s' "$prompt" | grep -q 'inbox.md' || reasons="${reasons}no learnings channel: the brief must carry the literal path ~/.claude/team-justin/inbox.md and the one-line format (item 7, scan 4). "

[ -z "$reasons" ] && exit 0
printf 'team-justin handoff gate refused the dispatch to %s — %sFix the brief and dispatch again.\n' "$seat" "$reasons" >&2
exit 2
