# Handshake for every agent on the Atüned cleanup (v2: read before you touch anything)

You are one seat on a team. The owner has ruled: main is the one line of the product, the foundation is made stable first, cosmetics come last. You build or review one work package (WP). The lead merges. You never push, merge, or open a pull request.

## 1. The product in four lines

Atüned (also SOURCE) is a somatic diagnostic instrument: a person writes a story, an engine in the browser reads emotional charge out of it, the app shows where that charge sits in the body. One HTML file, no dependencies, no network, with one seam: a Cloudflare Worker for accounts, record sync, the first visit funnel and billing. It is consumer health data adjacent to mental health. A person may be in distress when they use it. Treat every change as one a person in distress could meet.

## 2. Where you work

- Your worktree path, branch and base commit are in your prompt. Work only inside that path. Never `cd` into `/home/user/MOB` (a different line of the product) or into another seat's worktree.
- If you need something that exists only on the other line, read it with `git show <sha>:<path>` and say so in your report. Do not copy files across.
- Edit only the paths your prompt lists. If you must edit anything else, stop and tell the lead.
- **Built files, never edit by hand and never commit unless your prompt says so:** `source.html`, `engine.js`, `atuned-packed.html`, `funnel/dist/`, `funnel/tokens.css`, `MONITOR.log`. The stamp inside them changes on every build, so two branches that carry them always conflict. If a build rewrote them, restore before you commit: `git checkout <base> -- source.html engine.js atuned-packed.html funnel/dist funnel/tokens.css`. The lead rebuilds after merging.
- Never edit: `baseline/`, `HANDOFF-GAPS-2026-10-08.md`, `GAME-PLAN-main-cleanup.md`, `ARTIFACT-RETIRED-2026-10-08.md`.
- Stage by path (`git add <path>`), never `git add -A` or `.`. Read `git status` before every commit.

## 3. House rules (from CLAUDE.md, short)

- No em dashes anywhere: code, comments, strings, commit messages, reports. Never write the number 108; the count stated to users is 112.
- Sentence case. Plain words. Mechanical and precise. Short sentences. A term of art gets its meaning in the same sentence.
- The engine (`atuned_src/engine/`) is host free: no `document`, `window`, `navigator`, `localStorage`, `fetch`. `atuned_src/ui/auth.js` is the only file allowed to call `fetch`.
- `atuned_src/MANIFEST` is the load order and it is load bearing. Data before engine, engine before renderers, renderers before ui.
- Never renumber the TAB integers. Look a tab up by `.k` or by id, never by position.
- Validate at the boundary and never lie about a failure. A write that can fail reports through `status()`.
- Port, do not rebuild. Arithmetic core keeps its bodies and signatures.
- Before writing or changing any string or control a person can see, load the `atuned-voice` and `atuned-ux` skills.
- Numbers in documents are read off a run, never typed from memory. Cite the command.

## 4. Gates, and how to run them

**Environment does not persist between shell calls.** Prefix every gate command like this, with your own WP name in the temp directory, and create that directory first:

    mkdir -p /tmp/atuned-<wp> && env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers TMPDIR=/tmp/atuned-<wp> <command>

`tests/engine.js` writes fixed file names into its temp directory and the coverage run writes to `$TMPDIR/cov`. Two agents sharing one temp directory made 5 of 9 concurrent engine runs fail; separate directories made 0 of 6 fail.

**Build order, and rebuild before any browser gate** (browser gates read the root `source.html`, and the quiz and `claims.js` read `engine.js`):

    ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh

| Gate | Command (inside your worktree, with the prefix) | Time here | Who runs it |
|---|---|---|---|
| builds | the three build scripts above | 30s | you, if you changed `atuned_src/` or `funnel/` |
| engine | `node tests/engine.js` | 30s | you, whenever you touch the engine or its tests |
| funnel package | `cd atuned_funnel_system && npm ci && npm test` | 5s | you, if you touch it |
| voice | `python3 .claude/skills/atuned-voice/check.py --objections` | 3s | you, if you touched a string. Note: it exits 0 on a missing file, so check the file path is right |
| boot | `node tests/boot.js` | 60s | targeted |
| collide | `node tests/collide.js` | 45s | targeted |
| funnel | `node tests/funnel.js` | 55s | targeted |
| design | `node tests/design.js` | 190s | only if your prompt says so; call it with a 600000 ms timeout |
| functional | `node tests/functional.js` | 16 minutes | the LEAD only, while builders are idle. If your prompt says you run it, use `run_in_background` |
| monitor | `node tools/monitor.js` | 50s | lead |

**One browser gate at a time on this machine.** Wrap every browser gate:

    flock -o -w 600 -E 75 /tmp/atuned-browser.lock <the whole command with its prefix>

`-o` closes the lock before the child runs, so an orphaned browser cannot hold it. Exit code 75 means the lock never came free: report it as NOT RUN, never as a pass or a fail. A failure under load is not a finding: re-run it alone before you report it.

**Chromium path.** Existing gates hardcode `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Any browser test you write uses exactly this expression so one search finds them all:

    process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

## 5. Evidence rules (the lead checks these)

1. **The failing test is commit 1 of your branch, and you report its SHA.** The lead checks: the diff to that commit touches tests only; the acceptance command exits 1 there on a printed FAIL line (not a crash, not a missing file); and exits 0 at your branch tip. A fix with no such first commit is not accepted.
2. Show the failing line, then the passing line, pasted from the run.
3. Check the checker. A test you wrote is run once against a known bad case and once against a known good case before you trust it. Two probes in this project's past reported defects that were the probe's own bug.
4. Counts are read off the run. Paste the exact summary line.
5. If you could not run something, write NOT RUN and why. Never write "should pass".
6. A control that claims success before the write has succeeded is a defect.

## 6. Git

- Commit to your branch, in your worktree. Say why, not only what. End each commit message with the `Claude-Session` line below, and with the `Co-Authored-By` line from your own system context if it gives you one:

      Claude-Session: https://claude.ai/code/session_016LLF9NZj8M8zDK26vbWgWq

- Never: push, merge, `--no-verify`, force, amend, `git stash` (the stash list is shared with the other line and holds its work), `git config`, `git gc`, `git worktree`, `git clean`.
- Scratch copies of a commit: `git archive <sha> | tar -x -C <dir>`. Never `cp -r` a worktree: the copy shares the original's index.
- If a gate you did not touch goes red, do not fix it. Record it under FOUND with the command and the line. The lead decides.

## 7. Report format (builders)

Under 300 words, plain words, in this order:

    DONE: <one sentence>
    FIRST COMMIT: <sha of the failing test commit>
    FILES: <path: what changed, one line each>
    PROOF: <command> -> <exact summary line>   (failing line, then passing line)
    NOT RUN: <what and why>
    FOUND: <other defects you saw and did not touch, file:line>
    RISK: <what could break that a gate would not catch>
    ASK: <at most one question, only if blocked. Otherwise "none">

## 8. Review brief (reviewers)

You have the diff (`git diff <base>...<branch>` in the worktree named in your prompt) and the acceptance criteria. You do not have the builder's summary and should not look for it. Assume the builder is capable and wrong somewhere.

1. Run the acceptance command yourself. Report the exact line.
2. Try to make the new test pass while the fault is still present: apply a plausible wrong fix in a scratch copy (`git archive`). A test that stays green is not a test.
3. Read the diff for: a path a person in distress could hit; a failure reported as success; a number typed into a gate; a gate that cannot fail (including one that exits 0 on a missing file); a second copy of a rule; an edit outside the allowed paths; a built file edited by hand or committed; an em dash.
4. Findings: `F<n> | blocker/serious/minor | file:line | what is wrong | how you know (command)`. No finding without a command or a line.
5. End with one line: `VERDICT: ship / patch then ship / do not ship`.
6. Do not fix. Do not edit.
