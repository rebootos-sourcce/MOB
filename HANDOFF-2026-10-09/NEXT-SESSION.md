# Next session: where everything stands, 9 October 2026

Written so a new session, on any model, can pick up with no memory of this one.
Read `WHAT-IS-LEFT-2026-10-09.md` (same folder) for the plain-words list the owner has.
Read `CLAUDE.md` first. Its rules hold: never edit build products, no em dashes, never say 108.

## The owner's standing rulings (short)

- Main is the one line. P0 (blocker) and P1 (highest) first. P2 moderate. P3 cosmetic comes after P1.
- "Done is zero bugs. For alpha. Existing features complete. They don't need to be perfect."
- Finish what you start. No gaps. No questions to the owner. Stop burning tokens on process; hardening and patching are fine.
- The crisis check (988, 741741) is deferred to the MVP beta. Do not ship it before then.
- Reply style: plain short words, bullets, steps like he is ten for anything outside the codebase.
- Files he needs are SENT (attached), never pointed at. Documents also go to Drive folder "From Claude" (id 18mDYCwYZshrNJ8ptPzChXDpYam7_ugaC).

## State at the end of this session

- MOB main: `8b22950` (PR 39 merged: the guard tests run on every change; functional, design and monitor are required). Before it: `b2b7a03` (PR 38) is the build the owner holds as `atuned.html`, md5 `d824e8a7a93cc30de2617143e58fe3d5`.
- Worker repo `rebootos-sourcce/Reboot-OS`, folder `atuned/server`: CORS fix merged (`24327d0`); deploy, live smoke and rollback proven in `server.yml`. The local clone `/home/user/reboot-os` has a stale `origin/main` ref: use `git ls-remote` and `FETCH_HEAD`.
- Pull requests 35, 36, 37, 38, 39 are all merged. Deploys were green.
- The committed build products (`source.html`, `engine.js`, `atuned-packed.html`, `funnel/dist`) on main are STALE (stamped `869610b`, old privacy words, fail the copy gate) and are publicly reachable through GitHub Pages and raw addresses. Fix: after the last merge, run the three build scripts and the packer, commit only those files in their own commit, gates green.

## Work that exists only on branches (pushed to origin as backups)

| Branch | What | State when written |
|---|---|---|
| `claude/p3-heads` | sentence-case heads, tab tooltips say what is there, Help reads the build stamp | built, gates not yet confirmed |
| `claude/p3-menu` | Field left menu, one bar style, CQ and DQ on one bar | built, gates not yet confirmed |
| `claude/p3-sound` | atmospheric sound under every press, overlay, hover, zoom; sound map | built, gates not yet confirmed |
| `claude/p3-rail` | Field rail headline CQ and DQ are bare numbers; Compass icons | early |
| `claude/p1g-red` | the checks already red on main: Loop screen count (loopui), labels, brief gate | in progress |
| `claude/p1h-golden` | the golden journey test (`tests/golden.js`) and write honesty | in progress, no commit yet |

Each was an agent working in its own folder (`/home/user/wp-p1a`, `wp-p1b`, `wp-p1c`, `wp-p1d`, `wp1-e`, `wp2a-lean`). If those folders are gone, the branches above are what is left. A branch is merged only after: sources only (restore build products with `git checkout origin/main -- source.html engine.js atuned-packed.html funnel/dist funnel/tokens.css`), a pull request, and `gates-pass` green.

Older side branches, all triaged and listed in `WHAT-IS-LEFT-2026-10-09.md`: `claude/rb-field-rail-bars`, `claude/sweet-ptolemy-p0pkgw`, `claude/b2a-crisis*` (crisis, parked), `claude/p1e-bypass-parked` (returning account, parked on sync). Worker branch `claude/app-migration-decision-yx56cj` in Reboot-OS holds three routes main lacks (voice synthesize, feedback, whoami).

## What to do next, in this order

1. **Collect the six branches above.** For each: open its worktree, run the gates its handshake names (`HANDSHAKE-P3.md`, `HANDSHAKE-P1.md`), open a pull request, wait for `gates-pass`, merge. Unfinished ones stay branches and go on the list.
2. **Wire the golden gate into CI** once `tests/golden.js` lands: add its line in `gates-report` of `.github/workflows/deploy.yml`, add the floor from the printed summary in `tests/floors.json`, add the name to `BROWSER` in `tools/workflow-lint.py`.
3. **Regenerate and commit fresh build products** (see above), then verify the live site serves the new commit (the deploy job reads it back).
4. **Alpha blocks that remain** (details with failing-first tests in `REVIEW-audit-2026-10-09/pass2.md`, `pass4.md`, `pass5.md`):
   - W3 first-visit data path: Supabase migration 0015 (two id columns to text, issue the starter gift, renew the pass). Worker repo.
   - P5-F, P5-B, P5-A step 1: duplicate import, future-dated ritual day, side store left behind on profile delete. Small engine fixes.
   - G0, G1, G5: the golden journey and its failure matrix.
   - CI1 to CI6 in `pass1.md`: keep evidence, stable build stamp, live check after deploy, the last tests.
   - Two wording fixes: PR 38 line "36 + 78 = 114" should say 5 sentences have both, so 109; the retired build note.
5. **After alpha:** Block A, B, C of `pass3.md` (honest privacy words kept true, delete everywhere, designed sync), W4 to W6 of `pass2.md`, the Story page Mirror and the full sniffer bundle (`pass4.md`, about 13 days).

## Do not do these

- Do not turn on profile sync. `profileSyncEligible` is dead code (`ui/auth.js:189`); turning it on uploads name, birth data and stories every 30 seconds, which the privacy words deny.
- Do not ship the crisis check before the beta.
- Do not push or merge to main with a gate red or unread. No `--no-verify`.
- Do not commit secrets. The service key lives only in GitHub secrets.
- Do not touch the Pages or branch-protection settings: only the owner can (steps are in `WHAT-IS-LEFT-2026-10-09.md`).

## Commands and gotchas

- Build: `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`; pack with `node tools/pack.js atuned-slim.html atuned-packed.html`.
- Browser gates need `NODE_PATH=/opt/node22/lib/node_modules` and `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; take the lock with `flock -o -w N /tmp/atuned-browser.lock`; give each package its own `TMPDIR`. Never hard-code a chromium path, even in a comment (`tests/chrome-path.js` fails it).
- Never `pkill -f` with a pattern that appears in your own command line. Never run `( ... ) &` inside a background command. Wait on a condition with an until-loop, not a bare `sleep`.
- The sandbox cannot reach atuned.world or the live Worker. Claims about live behaviour rest on the deploy job logs.
- The scratchpad under `/tmp` is not durable. Everything worth keeping is in this folder, `REVIEW-audit-2026-10-09/`, and git.
- Watch a pull request: `/tmp/atuned-s2/watch.sh N` (polls check runs until the gates finish). If it is gone, poll `gh api repos/rebootos-sourcce/MOB/commits/<sha>/check-runs`.
