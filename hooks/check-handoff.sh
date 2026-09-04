#!/bin/bash
# pretooluse on the subagent-dispatch tool: the mechanized half of the lead
# contract's handoff scan (lead SKILL.md step 3). refuses a team-seat dispatch
# whose brief carries a file:line coordinate, a verbatim run of an always-loaded
# rule or of a file the brief itself names, a hedged term, or no learnings
# channel — or a planner brief naming no brief.md — and
# hands the reason back so the lead re-anchors and dispatches again. fail open on
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
# a hedge on a term the builder codes against is a decision delegated by
# accident — scan 3's hedge half. the imperative half stays a reading check.
hedge=$(printf '%s' "$prompt" | grep -oiE '\b(may|might|could) mean\b|\bunclear (whether|if)\b|\bnot sure (whether|if)\b' | head -1)
[ -n "$hedge" ] && reasons="${reasons}hedged term: \"${hedge}\" — settle what it means, or take the question to the user before dispatch (item 3, scan 3). "

# an always-loaded rule restated in the brief is a second source that drifts —
# scan 2 says point at the file instead. the mechanizable half is the verbatim
# one: a run of SHINGLE words from the brief found unchanged in a canonical
# text. paraphrase stays a reading check; a shorter run would misfire on
# ordinary phrasing, so the length is the fail-open margin.
SHINGLE=8
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
canon=""
for f in "$cwd/CLAUDE.md" "$cwd/.claude/CLAUDE.md" "$cwd/AGENTS.md" "$cwd"/.claude/rules/*.md \
         "$HOME/.claude/CLAUDE.md" "$plugin_root/skills/roster/shared-blocks.md"; do
  [ -f "$f" ] && canon="$canon $f"
done
# a file the brief names is canon too: naming it and pasting its text is the
# co-occurrence scan 2 refuses. resolved under cwd, capped so a brief listing
# a tree doesn't turn the check into a full-corpus read.
if [ -n "$cwd" ]; then
  for rel in $(printf '%s' "$prompt" | grep -oE '[A-Za-z0-9_./-]+\.md\b' | sed 's#^\./##' | sort -u | head -10); do
    f="$cwd/$rel"
    case " $canon " in *" $f "*) continue ;; esac
    [ -f "$f" ] && canon="$canon $f"
  done
fi
if [ -n "$canon" ]; then
  norm() { tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]\n' ' ' | tr -s ' \n' ' '; }
  hit=$(printf '%s' "$prompt" | norm | awk -v n="$SHINGLE" -v files="$canon" '
    BEGIN {
      split(files, fs, " ")
      for (i in fs) { f = fs[i]; if (f == "") continue
        text = ""
        while ((getline line < f) > 0) text = text " " tolower(line)
        close(f)
        gsub(/[^[:alnum:]]+/, " ", text)
        corpus[f] = text }
    }
    { for (i = 1; i + n - 1 <= NF; i++) {
        s = $i; for (j = 1; j < n; j++) s = s " " $(i + j)
        for (f in corpus) if (index(corpus[f], " " s " ")) { print f "\t" s; exit } } }')
  [ -n "$hit" ] && reasons="${reasons}restates a file verbatim: \"${hit#*	}\" is in ${hit%%	*} — point at the file instead (scan 2). "
fi

# planner reads a written brief.md (lead step 2.6)
if [ "$seat" = "planner" ] && ! printf '%s' "$prompt" | grep -q 'brief\.md'; then
  reasons="${reasons}planner brief names no brief.md: run /team-justin:brief first and point the seat at the written file (step 2.6). "
fi

[ -z "$reasons" ] && exit 0
printf 'team-justin handoff gate refused the dispatch to %s — %sFix the brief and dispatch again.\n' "$seat" "$reasons" >&2
exit 2
