#!/bin/bash
# stop hook: if this session has unaudited team-seat dispatches, block the stop
# once and hand back the audit instruction. the auditor deletes the ledger, so
# absence == audited. fail open — never trap a session over a missing tool.
command -v jq >/dev/null 2>&1 || exit 0
input=$(cat) || exit 0

# kill switch: export TEAM_JUSTIN_NO_AUDIT=1 to silence the loop
[ -n "$TEAM_JUSTIN_NO_AUDIT" ] && exit 0

# already continuing because of a stop hook — never block twice in one cycle
active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false' 2>/dev/null)
[ "$active" = "true" ] && exit 0

sid=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
[ -z "$sid" ] && exit 0
ledger="$HOME/.claude/team-justin/audit/$sid.jsonl"
[ -s "$ledger" ] || exit 0

plugin_root="${1:-$CLAUDE_PLUGIN_ROOT}"
n=$(wc -l < "$ledger" | tr -d ' ')
jq -n --arg ledger "$ledger" --arg n "$n" --arg contract "$plugin_root/skills/lead/SKILL.md" '{
  decision: "block",
  reason: "team-justin dispatch audit pending: \($n) team-seat dispatch(es) this session, logged at \($ledger). Dispatch the team-justin:dispatch-auditor subagent exactly once, with the prompt: Audit the dispatch ledger at \($ledger). Lead contract (for exact wording only): \($contract), Step 3. The seat carries its own rulebook; it files durable orchestration learnings to the preference inbox and deletes the ledger. Relay its one-line return, then stop."
}'
exit 0
