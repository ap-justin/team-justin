#!/bin/bash
# pretooluse on the subagent-dispatch tool: the mechanized half of the lead
# contract's handoff scan (lead SKILL.md step 3). refuses a team-seat dispatch
# whose brief carries a file:line coordinate, a verbatim run of an always-loaded
# rule or of a file the brief itself names, a paraphrase of the user CLAUDE.md
# machine budget or the comment standard, a hedged term, or no learnings
# channel — or a planner brief naming no brief.md, or a review brief naming no
# report path — and hands the reason back so the lead re-anchors and dispatches
# again. fail open on anything that isn't a clear hit — a gate that misfires
# costs more than one it lets through.
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

# the two texts briefs re-type as paraphrase, which no shingle sees — lead scan 2
# names these greps. the budget check runs only where the user's own file
# carries a memory figure, so a brief quoting a storage limit elsewhere passes.
USER_CANON="$HOME/.claude/CLAUDE.md"
if [ -f "$USER_CANON" ] && grep -qiE '\b[0-9]+ ?gb\b' "$USER_CANON"; then
  budget=$(printf '%s' "$prompt" | grep -oiE '\b[0-9]+ ?gb\b|\b(one|a single) [a-z-]+ at a time\b' | head -1)
  [ -n "$budget" ] && reasons="${reasons}paraphrases the user CLAUDE.md machine budget: \"${budget}\" — that file loads into every seat on its own; cut the sentence (scan 2). "
fi
comments=$(printf '%s' "$prompt" | grep -oiE '\bcomments?\b[^.]{0,80}\blowercase\b|\blowercase\b[^.]{0,80}\bcomments?\b' | head -1)
[ -n "$comments" ] && reasons="${reasons}paraphrases the comment standard: \"${comments}\" — Block I rides in the seat prompt; cut the sentence (scan 2). "

# a review seat writes its report where the brief says and returns a pointer —
# no path and the whole report lands in the lead's context (item 7, gates.md).
case "$seat" in
  code-reviewer|architecture-reviewer|accessibility-reviewer|visual-reviewer|ux-auditor)
    printf '%s' "$prompt" | grep -q 'team-justin-review' || reasons="${reasons}review brief names no report path: hand it report: \${TMPDIR:-/tmp}/team-justin-review/<project-slug>/<seat>-<slice-slug>.md (item 7, gates.md). " ;;
esac

# an always-loaded rule restated in the brief is a second source that drifts —
# scan 2 says point at the file instead. the mechanizable half is the verbatim
# one: a run of SHINGLE words from the brief found unchanged in a canonical
# text. paraphrase stays a reading check; a shorter run would misfire on
# ordinary phrasing, so the length is the fail-open margin. rule files are
# terse, so the run shortens with them: six words from the repo's own
# CLAUDE.md or rules, five from the user's, where the machine budget is the
# text briefs re-type most.
SHINGLE=8
SHINGLE_REPO=6
SHINGLE_USER=5
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
canon=""
repo_canon=""
for f in "$cwd/CLAUDE.md" "$cwd/.claude/CLAUDE.md" "$cwd/AGENTS.md" "$cwd"/.claude/rules/*.md; do
  [ -f "$f" ] && canon="$canon $f" && repo_canon="$repo_canon $f"
done
for f in "$USER_CANON" "$plugin_root/skills/roster/shared-blocks.md"; do
  [ -f "$f" ] && canon="$canon $f"
done
# the plan store's contract is the file a planner brief re-types (lead step 2.6)
[ "$seat" = "planner" ] && [ -f "$plugin_root/TRACKER.md" ] && canon="$canon $plugin_root/TRACKER.md"
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
  hit=$(printf '%s' "$prompt" | norm | awk -v n="$SHINGLE" -v nr="$SHINGLE_REPO" -v ns="$SHINGLE_USER" -v short="$USER_CANON" -v repo=" $repo_canon " -v files="$canon" '
    BEGIN {
      split(files, fs, " ")
      for (i in fs) { f = fs[i]; if (f == "") continue
        text = ""
        while ((getline line < f) > 0) text = text " " tolower(line)
        close(f)
        gsub(/[^[:alnum:]]+/, " ", text)
        corpus[f] = text }
    }
    { for (f in corpus) { m = (f == short) ? ns : (index(repo, " " f " ") ? nr : n)
        for (i = 1; i + m - 1 <= NF; i++) {
          s = $i; for (j = 1; j < m; j++) s = s " " $(i + j)
          if (index(corpus[f], " " s " ")) { print f "\t" s; exit } } } }')
  [ -n "$hit" ] && reasons="${reasons}restates a file verbatim: \"${hit#*	}\" is in ${hit%%	*} — point at the file instead (scan 2). "
fi

# planner reads a written brief.md (lead step 2.6)
if [ "$seat" = "planner" ] && ! printf '%s' "$prompt" | grep -q 'brief\.md'; then
  reasons="${reasons}planner brief names no brief.md: run /team-justin:brief first and point the seat at the written file (step 2.6). "
fi

[ -z "$reasons" ] && exit 0
printf 'team-justin handoff gate refused the dispatch to %s — %sFix the brief and dispatch again.\n' "$seat" "$reasons" >&2
exit 2
