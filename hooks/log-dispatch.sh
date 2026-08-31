#!/bin/bash
# posttooluse on the subagent-dispatch tool: append one jsonl line per team-seat
# dispatch to the session ledger dispatch-auditor reads. fail open everywhere —
# a logging miss must never break the session.
command -v jq >/dev/null 2>&1 || exit 0
# plugin root arrives as $1 (substituted in hooks.json) — it is not a
# guaranteed env var here, and an empty root would silence logging forever
plugin_root="${1:-$CLAUDE_PLUGIN_ROOT}"
[ -d "$plugin_root/agents" ] || exit 0
input=$(cat) || exit 0

seat=$(printf '%s' "$input" | jq -r '.tool_input.subagent_type // empty' 2>/dev/null)
seat="${seat#team-justin:}"
[ -z "$seat" ] && exit 0
# the auditor's own dispatch would re-create the ledger it just deleted
[ "$seat" = "dispatch-auditor" ] && exit 0
# only team seats are auditable against the lead contract
[ -f "$plugin_root/agents/${seat}.md" ] || exit 0

sid=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
[ -z "$sid" ] && exit 0

dir="$HOME/.claude/team-justin/audit"
mkdir -p "$dir" 2>/dev/null || exit 0
# crashed sessions leave ledgers nothing will audit; keep the dir bounded
find "$dir" -name '*.jsonl' -mtime +7 -delete 2>/dev/null

# prompt head capped at 4000 chars — enough for a brief's handoff items;
# `truncated` tells the auditor an absent clause past the cut is not evidence
printf '%s' "$input" | jq -c --arg seat "$seat" '{
  ts: (now | todate),
  cwd: ((.cwd // "") | split("/") | last),
  seat: $seat,
  desc: (.tool_input.description // ""),
  prompt: ((.tool_input.prompt // "")[0:4000]),
  truncated: (((.tool_input.prompt // "") | length) > 4000)
}' >> "$dir/$sid.jsonl" 2>/dev/null

exit 0
