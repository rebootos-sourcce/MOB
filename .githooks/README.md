# .githooks

Git hooks this repository carries. Git does not run a hook from a cloned
repository on its own; each clone turns them on once, from the repository root:

    git config core.hooksPath .githooks

and turns them off with `git config --unset core.hooksPath`.

## pre-push

Refuses a push whose committed build products (`source.html`, `engine.js`,
`atuned-packed.html`, `funnel/tokens.css`, `funnel/dist/*.html`) are not what
that commit's own source builds. For each branch tip being pushed it checks
the commit out into a throwaway sparse worktree, never your own tree, runs the
three builds in CI's order and then `node tools/products.js`, the same check
`gates-fast` runs on every pull request. A build or check that cannot run is
a refusal too, with its reason, because a check that could not run has not
passed. It takes about one build per branch pushed.

`git push --no-verify` skips every pre-push hook. CI still runs the same check,
so a push made that way is checked there, only later.

## What is not here

No `.claude/settings.json` hook. A hook that changes what an agent's own tools
may do is the owner's to write, by his own hand, and no agent proposes itself
more of its own tool permission. This directory holds git hooks only.
