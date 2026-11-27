#!/usr/bin/env bash
# Rebuild sendable ATUNED Alpha products only on the two unmerged QA branches.
# Does not commit, push, merge, deploy or trigger billing/sync.
set -euo pipefail

fail() { printf 'REBUILD REFUSED: %s\n' "$*" >&2; exit 2; }
root=$(git rev-parse --show-toplevel 2>/dev/null) || fail 'run from a full MOB git checkout'
cd "$root"
branch=$(git symbolic-ref --quiet --short HEAD) || fail 'detached HEAD; checkout a QA branch'
case "$branch" in
  qa/records-coverage-ledger|qa/deep-psyche-registry-recovery) ;;
  *) fail "branch $branch is not an approved QA review branch" ;;
esac
[[ $(git rev-parse --is-shallow-repository) == false ]] || fail 'shallow checkout: fetch full Git history before building'
count=$(git rev-list --count HEAD)
[[ "$count" =~ ^[0-9]+$ && "$count" -gt 1 ]] || fail 'incomplete Git history: refusing v1 build stamps'
[[ -z $(git status --porcelain --untracked-files=normal) ]] || fail 'dirty working tree: commit or stash edits first'
for path in atuned_src/BUILD-engine.sh atuned_src/BUILD.sh funnel/BUILD-single.sh tools/products.js; do
  [[ -f "$path" ]] || fail "missing $path"
done
head=$(git rev-parse HEAD)
printf 'BUILD START branch=%s head=%s history=%s commits\n' "$branch" "$head" "$count"
./atuned_src/BUILD-engine.sh
./atuned_src/BUILD.sh
./funnel/BUILD-single.sh
node tools/products.js --self-test
printf '\nBUILD COMPLETED (not committed, not CI). Reviewed source head=%s\n' "$head"
printf 'Changed delivery files (inspect before committing):\n'
git status --short
printf '\nNext: review changes, commit the generated products on %s, push as an authorized actor, and verify exact-commit PR CI.\n' "$branch"
