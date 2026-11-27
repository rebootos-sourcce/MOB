# P1 addendum (read after HANDSHAKE.md; where they differ, this wins)

The owner's rule: P0 and P1 only; P2 and P3 later. Alpha means existing features complete and bug free, nothing new. You are integrating work that was built on an older line and never reached main. Finish it all the way: no gaps, no half wired controls, no placeholders, no TODO left in what you ship.

- **Base:** `origin/main` (Block 1 is merged: CI now runs every gate on every pull request, the lead pushes and merges). Your worktree is sparse (no `mockups/` or `proto/`). Commit locally only.
- **Where the old work lives:** in this same git repository's object store. Read it with `git log`, `git show <sha>`, `git diff <a>..<b>` from your worktree. Never `cd` into `/home/user/MOB` and never edit anything outside your worktree.
- **Port by hand, do not merge the old branch wholesale.** Main moved on a different line (123 commits the old line lacks). Apply the intended change on top of today's main. Keep the tests that came with the old work, adapt them to today's main, and add a test that fails without every defect you fix (commit 1 of your branch is that failing test where a fix is involved; for a pure port, commit 1 is the ported tests failing without the ported code).
- **Never port:** the crisis check (`srcSafe`, e2aa6f8, `f1-distress-detector*`: parked by ruling); the old line's record sync (`authRecordSave`, `authRecordPull`, the push hook in `pSave`); the Guest button removal. If your scope touches them, leave main's behaviour.
- **Scope is defects and finishing existing features.** A new capability, a visual redesign, a mockup: out of scope, list it under FOUND with the branch and sha so the lead can queue it (P2 or P3).
- **Gates:** targeted only (`node tests/engine.js`, your own tests, and the browser gates for the surfaces you touch, with the flock wrapper). The full suite runs in CI on the pull request; do not run `functional.js` or `design.js`. Rebuild before browser gates. Restore built files before you commit (`git checkout origin/main -- source.html engine.js atuned-packed.html funnel/dist funnel/tokens.css`).
- **User facing words:** load `atuned-voice` and `atuned-ux` first. List every new or changed string in WORDS.
- **Done means:** integrated on main's tip, builds, its tests green, nothing half built. If part of your scope genuinely cannot be completed, say exactly what, why, and the smallest next step; do not leave it silently partial.
- **Report:** handshake format, under 350 words, plus `FILES`, `WORDS`, and a table `item | done y/n | note`. No em dashes.
