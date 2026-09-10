#!/bin/bash
# pretooluse on every tool: the mechanized half of the lead contract's own
# precondition — skills/lead/SKILL.md loaded before building, reviewing or
# dispatching a seat, which /team-justin:setup writes into a repo's
# .claude/CLAUDE.md as a line the model may or may not act on. an instruction is
# discretionary and a hook is not.
#
# it gates the first tool call it sees, whatever that tool is: a session edits
# through bash as readily as through Edit or Write — sed -i, a heredoc, git
# apply — so the tools a build touches are every tool.
#
# it fires once per session: the mark is written whether or not the block lands,
# so a session that declines is nagged no further and a subagent's own tool call
# never trips a gate meant for the lead.
#
# fail open on anything that isn't a clear miss. kill switch:
# export TEAM_JUSTIN_NO_LEAD_GATE=1
command -v jq >/dev/null 2>&1 || exit 0
[ -n "$TEAM_JUSTIN_NO_LEAD_GATE" ] && exit 0
plugin_root="${1:-$CLAUDE_PLUGIN_ROOT}"
[ -f "$plugin_root/skills/lead/SKILL.md" ] || exit 0
input=$(cat) || exit 0

# the load itself is a Skill call — gating it would close the only door out
tool=$(printf '%s' "$input" | jq -r '.tool_name // empty' 2>/dev/null)
[ "$tool" = "Skill" ] && exit 0

sid=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
[ -z "$sid" ] && exit 0
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)
[ -r "$transcript" ] || exit 0

# anchored to how an invocation is recorded, never to the bare name: the seat
# roster and a repo's own CLAUDE.md both spell "team-justin:lead" as prose, and
# a session that only read that text is exactly the session this gate is for.
grep -qE '"skill":"(team-justin:)?lead"|<command-name>/?team-justin:lead' "$transcript" && exit 0

# a /team-justin:<skill> run is that skill's contract, not the lead's — the ones
# that dispatch load lead themselves. exempt only while the command is still the
# session's latest word: a plain turn after it is an ordinary session again.
cmd_line=$(grep -nE '<command-name>/?team-justin:' "$transcript" | tail -1 | cut -d: -f1)
if [ -n "$cmd_line" ]; then
  say_line=$(grep -n '"type":"user"' "$transcript" |
    grep -v 'tool_use_id' | grep -v '<command-name>' | grep -v 'local-command' |
    tail -1 | cut -d: -f1)
  case "$say_line" in ''|*[!0-9]*) say_line=0 ;; esac
  [ "$say_line" -le "$cmd_line" ] && exit 0
fi

mark_dir="$HOME/.claude/team-justin/lead-gate"
mark="$mark_dir/$sid"
[ -e "$mark" ] && exit 0
mkdir -p "$mark_dir" 2>/dev/null && : > "$mark" 2>/dev/null

printf 'team-justin: this session has not loaded the lead contract. Invoke the team-justin:lead skill before building, reviewing or dispatching a seat, then take the action again. Nothing else about the request has changed.\n' >&2
exit 2
