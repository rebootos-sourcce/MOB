# Orientation, 15 October 2026

Every seat opens this first. It is short on purpose. Where it disagrees with
an older file, the older file loses. Where it disagrees with the repository,
the repository wins and this file is wrong: say so and fix it.

## 1. There are two applications, and only one is live

| | MOB (this repository) | Reboot-OS, folder `atuned/` |
|---|---|---|
| What it is | The instrument: `atuned_src/` built to `source.html`, the funnel in `funnel/`, nine tabs, the Field, the Story, the release, the paywall, the voice | A second application, 30 parts in `atuned/src/MANIFEST` built to `atuned/build/atuned.html` by `atuned/test/tools/build.py`. Its main surface is "Today, your mirror". Its own gate is `atuned/test/smoke.py` |
| Who built the last week | ChatGPT, 9 to 11 October: five commits on main, the last `ed5eca3` (atomic release save, quiz session, Alpha acceptance gate). Eleven draft pull requests of documents and P1 work remain open | ChatGPT, 10 to 14 October: 18 commits on main (canonical 112 node topology, release evidence, gift bank contract, source traceability), twelve open draft pull requests, the last being PR 54, the copy sweep the owner's handshake is about |
| Where it publishes | `.github/workflows/deploy.yml`: builds fresh, then `wrangler pages deploy --project-name=atuned --branch=main`, then reads production back | `.github/workflows/web.yml`: `pages deploy atuned/web/dist --project-name=atuned --branch=main` on a push to main that changes the built file |
| Last publish | 11 October, run 38169307942, commit `ed5eca3`. The step "Cloudflare serves this commit in production" passed | 10 October, run 38020152941: the publish step FAILED. 13 October run 38473125019 was a pull request event that only built an artifact |

**So atuned.world serves MOB main `ed5eca3`, verified by the deploy job on 11
October.** The server behind it is the Cloudflare Worker `atuned-api` in
Reboot-OS `atuned/server`, deployed from its main (`9b75a04` on 14 October,
run 38511837674, green).

**The collision is a P0.** Both workflows name the same Pages project and
branch. The next successful push from either side replaces the other's site.
ChatGPT saw it too: Reboot-OS draft PR 47 removes the publish from `web.yml`
and adds a guard. Until the owner rules which application is the product,
nobody publishes from Reboot-OS, and the guard merges on whichever side loses.

The handshake's "preview URL",
`copy-system-mirror-sweep-2026-10-14-atuned-api.lance-o-powell.workers.dev`,
is the Workers Builds preview of the API Worker on that branch. It does not
serve the application. There is no running preview of PR 54's application.

A third Cloudflare name, `atuned-os`, appears as a failing "Workers Builds"
check on every Reboot-OS commit. No configuration for it exists in either
repository. It is a Cloudflare dashboard binding pointing at nothing, and it
is the owner's to delete or point. It is not evidence that the site is down.

## 2. CI is stopped on both repositories, from outside the code

Every workflow run since 15 October 19:14 UTC fails in two seconds with no
runner and no steps. The annotation on each is the cause:

> The job was not started because an Actions budget is preventing further use.

That is the GitHub account's spending limit for Actions, not a workflow fault.
The handshake's Block 1 ("CI pre-step failure") is answered: it is external,
and the smallest unblock is the owner raising the limit on GitHub under
Settings, Billing and plans, Spending limits. Until then nothing merges by the
house rule (nothing merges red, and nothing can run), the voice cannot be
re-probed, and no deploy fires. Local runs are the only evidence available.

## 3. What was true on 9 October and is still true

- **The voice is ElevenLabs and only ElevenLabs.** App side merged (MOB PR
  43), Worker side merged (Reboot-OS 13, 14, 18). The owner's own
  `voice-connect` run on 9 October 17:59 UTC (run 37970159266) ended green at
  every step, including "ask the live server for a line", which only passes
  on real audio. Last verified then; not re-verifiable until CI runs.
- **Profile sync is off** (MOB PR 50, Reboot-OS PR 20). It stays off. Turning
  it on uploads name, birth data and stories against the privacy words.
- **Paid checkout is closed server side until explicit release approval**
  (Reboot-OS PR 31). The four Stripe tiers have not been made.
- **The first visit reaches the account** on the server (Supabase 0015
  applied, confirmed read-only on 14 October). The app sends it, joins it to
  an account made at the door, and ends its pass on sign out (MOB PR 46, 47).
- **The golden journey** (`tests/golden.js`) walks quiz, record, account,
  reading, release, CQ, pay, cancel, delete. Its quiz-only form is a required
  gate ("alpha-journey", floor 61). Two findings stay as expected red on a
  fresh build of main today (E2, the first visit is never read back; E3f, a
  downloaded copy blames the connection). The three others the 9 October
  notes named (E1q, E19, E20) were closed by `1d48f78` and `ed5eca3`, and
  `tests/floors.json` still allowed five, which would let three new failures
  pass unseen. It allows two now.

## 4. The owner's rulings, 9 to 15 October, in his words where he gave them

- "done is zero bugs. For alpha. Existing features complete. They don't need
  to be perfect."
- P0 and P1 before everything else. P2 moderate. P3 cosmetic after P1.
  "not going to do any of these designs... take a step back."
- No questions to the owner: decide, record, carry on. One question only when
  blocked.
- Plain words, bullets, steps as if he is ten for anything outside the code.
  Files are sent, never pointed at.
- The ElevenLabs voice "should be automatic. I don't want it to have to sign
  in or anything special." Built: no sign in, four ceilings on the bill.
- A first time user lands on Summary once, then wherever they left off.
  Built (MOB PR 44).
- The six gift natures: anxiety, overwhelm, burnout, depression, grief,
  sadness, each with its own frozen 100 pattern bank, separate from the
  twelve grounds (14 October, recorded in Reboot-OS). No bank has approved
  content yet.
- From the 15 October handshake, for the Reboot-OS application: the main
  daily surface is "Today, your mirror"; no raw scores, totals, weights or
  charges in copy; qualitative states; nonclinical language; "journey" is
  banned from rendered copy; do not merge PR 54 without authorisation.

## 5. The owner's handshake of 15 October

`HANDSHAKE-OWNER-2026-10-15.md` in this folder, as sent, em dashes made
commas. It is written for Reboot-OS PR 54 and its blocks are answered in
`AUDIT-2026-10-15.md` section 6: Block 1 is the budget above, Block 2 fails
on the branch as pushed (the committed build is seven bytes off its source),
Blocks 3 to 6 are what the next session on that branch does once CI can run.

## 6. What each seat does with this

- **Every seat:** read this, then the owner's handshake, then
  `AUDIT-2026-10-15.md`. Strategise the next flow for your discipline against
  the P0 list there. Write it as a finding, a cause, a move, a cost, and what
  it changes for the person. Name the application you mean, MOB or Reboot-OS,
  in every finding.
- **Project manager:** the queue is `TASKS.md` plus the task list in the
  session. Nothing cosmetic ahead of a P0 or P1.
- **DevOps and QA:** counts are read off the run and held by
  `tests/floors.json`. Local runs are the evidence while the budget is out.
- **Narrative, brand, marketing, sales:** the copy direction in the handshake
  (section 3) is the owner's and applies to both applications. The house
  voice is `.claude/skills/atuned-voice`. "Journey" is out of rendered copy.

## 7. Files that describe the state, newest first

- `HANDOFF-2026-10-15/AUDIT-2026-10-15.md`, the five passes of 15 October
- `HANDOFF-2026-10-15/HANDSHAKE-OWNER-2026-10-15.md`, the owner's
- `HANDOFF-2026-10-09/`, the state on 9 October (still right about the rules,
  wrong about what is on main)
- MOB draft PR 69 holds ChatGPT's master index, control board and KPI
  framework for both applications. Read as history, not as a ruling.
- Reboot-OS `atuned/server/P0-RELEASE-EVIDENCE-MATRIX.md`, ChatGPT's gates A
  to E for the second application, all open.
