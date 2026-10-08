# Artifact retired, 8 October 2026

Seat: Sam Oyelaran, DevOps and QA. Block 0 of the main cleanup game plan. Research only; nothing in the repository was edited.

## The file

| | |
|---|---|
| File | `6f0d2d43-ATUNED_MVP_Recursive_Final.html` (uploaded to this session) |
| Size | 4,962,481 bytes, 74,477 lines |
| SHA-256 | `293d2307fcaabe888fe9dd5d42e7950ae4cfc97d90962976110f9f58fe2b844c` |
| md5 | `2108f9d027e9ce5aaa0edb33ae705256` |
| Stamp it carries | `data-build="v1756 5ce3934 2026-10-06 12:21"` |
| Built from | `source.html` on branch `claude/laughing-feynman-xhfyj3`, committed at `999476c` ("stamp source.html and atuned-packed.html at 5ce3934"), 4,832,289 bytes, 73,380 lines, SHA-256 `11b40611...a1e9f260`, md5 `fc8504fc...` |
| Byte delta | +130,192 bytes, +1,097 lines |
| Raw diff | 130 places where the two files differ (`diff` hunks), none of them in `atuned_src/` |

This file is retired. It is never shipped. Its edits are recorded below so nothing in it is lost by accident.

Why it cannot ship, in one line each. It wears the same build stamp as `source.html` but is a different file, so the stamp no longer says which build you hold. It changes the ruled CQ maths. It carries 12 em dashes, twelve script blocks sharing one id, and a hand typed length marker, so `BUILD.sh` would refuse it. And its base file (`v13`) is in no repository, so it cannot be rebuilt.

## How this was read

- Diff: `diff /home/user/MOB/source.html <artifact>`, 130 raw hunks, 1,887 diff lines.
- Each raw hunk was attributed to its `atuned_src/` module by the build's own markers. Every module that `BUILD.sh` concatenates ends with `window.__at('<module path>')`, so a source line belongs to the first marker after it.
- The tool was checked against known cases first, and it lied once. Line 8221 (`</style></head><body>`) sits ahead of the first marker, so the marker rule called it `engine/data/nodes.js`. It is the shell. The real boundaries, measured: `shell/head.html` is lines 1 to 8221, `shell/body.html` about 8221 to 9419, `shell/guard.html` about 9420 to 9723, `nodes.js` from about 9724. The attributions below are corrected. `cqSum` (`engine/compute.js`), `authRecordSave` (`ui/auth.js`) and `pSave` (`engine/schema.js`) each landed in the right module.
- "Duplicate of main" was checked against a clone of MOB `main` at `869610b3`. Main is the line of record under the game plan.
- Server claims were read from Reboot-OS `main`, `atuned/server/src/index.js`, through `gh api`. Not run.
- Grouping is by what the change does, not by where it sits. 130 raw hunks become 20 groups, and every raw hunk is in exactly one group.

## The edits, grouped

Line ranges are in the artifact. "Lines" is about how many artifact lines the group adds or changes.

### 1. Blueprint "behavioural energy" layer injected into the page head
- Raw hunk H1. Would belong to: nothing in `atuned_src/` (it sits in `shell/head.html` in the artifact; by kind it is `engine/trace.js` plus a data table). Lines 8221 to 8456, about 236.
- **DROPPED.** It comes from the `v13` base file, which no repository holds. It adds a second trace rule table and new edge types (gap S10). It writes engine data onto `window`, which the host free rule forbids in engine code.

### 2. Tooltips rewritten as actions ("Story" to "Open your story.")
- Raw hunks H2 to H7, H54, H55, H67, H72. Would belong to: `shell/body.html` (nine tab buttons), `ui/storyui.js`, `ui/avatarui.js`, `ui/analytics.js`. Lines 8918 to 8949, 42576 to 42579, 46264, 47911, about 14.
- **UNCLEAR.** Not a duplicate: main still has `title="Story"` and the rest. The voice gate passes both the old and the new wording (run here, after it correctly failed a known bad line). What settles it: one line from the UX seat on whether a tab's tooltip repeats its label or says the action. If it is the action, port it as a copy pass.

### 3. An unused demo flag and a second canon register of 112
- Raw hunk H8. Would belong to: `engine/data/canon.js`. Lines 9959 to 9969, about 11.
- **DROPPED.** `var DEMO=false` is never read anywhere. `ATUNED_CANON_112`, the saboteur, hypercomplex and saboteur reference name lists, and a database hash are a canon register copied from a `canon.sqlite` that this repository does not hold.

### 4. The node table renamed (nerve names, pattern names, capitals)
- Raw hunk H9. Would belong to: `engine/data/nodes.js`. Line 9975, one JSON line carrying about 60 field edits.
- **DROPPED.** Canon register. It renames `Root_08_Unnamed` to "Entitlement", which CLAUDE.md lists as the owner's call; the artifact's own comment at line 47737 still says so. It also renames pattern names ("Resentment (Heart)" to "Grudge"). The anatomy corrections in it ("Iliac Nerve Branch" to "Iliohypogastric Nerve (L1)" and about 15 more) are worth a look, but they go through `BOOK-ERRATA.md` and the owner, not a port.

### 5. CQ replaced; a coherence formula added
- Raw hunks H10 to H19. Would belong to: `engine/compute.js`. Lines 16770 to 17226, about 50.
- **DROPPED.** It deletes `cqSum`, the ruled "21 laws over 210" CQ (25 September). The new `canonicalCQReading` returns nothing until all 21 laws are measured, so a partly measured person gets no CQ and an expression of 0. `tests/engine.js:236` asserts the opposite. It also adds a formula, intention times integrity over resistance, and clamps resistance at 10.

### 6. Every caller of `cqSum` moved to the new CQ
- Raw hunks H29, H30, H31, H66, H74, H75 to H77, H82, H83, H109. Would belong to: `engine/schema.js`, `engine/export.js`, `ui/analytics.js`, `ui/intakeui.js`, `ui/release.js`, `ui/cone.js`, `ui/personas.js`. Lines 19574, 28713 to 28724, 46143, 50069 to 50074, 51456 to 51465, 58251, 60154, 68777, about 16.
- **DROPPED.** These follow group 5 and mean nothing without it. `iqSimCQ` (H74) is a second CQ formula in the intake.

### 7. Scores shown as percentages (`fmtPct`), and "weight" renamed "load"
- Raw hunks H20 (the helper, `engine/plan.js`), then 67 call sites: H33 to H53, H56 to H65, H68 to H71, H73, H78 to H81, H84, H85, H94 to H100, H102, H112 to H128. Would belong to: `engine/plan.js`, `ui/component.js`, `ui/rings.js`, `ui/map.js`, `ui/mapshelf.js`, `ui/character.js`, `ui/imprints.js`, `ui/summary.js`, `ui/analytics.js`, `ui/avatarui.js`, `ui/release.js`, `ui/ritstage.js`, `ui/cone.js`, `ui/drills.js`, `ui/knowledge.js`, `ui/ui.js`. Lines 17925 to 73488, about 75.
- **DROPPED.** It contradicts voice rule V8, "a reading is not a score". The skill ships "at a weight of 7.4" and fails a weight shown against a total, which a bare "74%" is. It also contradicts round PQ: "it doesn't need to be a percent. Just a number." And renaming "weight" to "load" breaks one word per concept.

### 8. The trace graph gains a second body register, MOB rules and coherence nodes
- Raw hunks H21 to H28 (except the audit in group 9) and H32. Would belong to: `engine/trace.js`, `engine/export.js`. Lines 18257 to 18934 and 28894, about 150.
- **DROPPED.** A second canon register from MOB v336, with a body count that is not the 112 the product states. A second rule table appended to `TRACE_RULES` (gap S10). Coherence formula nodes on every graph object. And fetter validation loosened to accept MOB fetter names.

### 9. A graph integrity audit (duplicates, dangling links, isolated nodes)
- Part of raw hunk H28, `traceIntegrityAudit`. Would belong to: `engine/trace.js`, or `tests/engine.js` as a check. Lines 18837 to 18851, about 15.
- **UNCLEAR.** It might be a useful checker, but it fails any graph with a single unlinked node, and `traceOrphans` and `traceCycles` already exist. What settles it: run it over the graphs `tests/engine.js` already builds and holds valid. If a valid graph reads as failing, drop it.

### 10. The address drill rewritten
- Raw hunks H86 to H93, H101. Would belong to: `ui/drills.js`, `ui/knowledge.js`. Lines 61252 to 61287 and 63283, about 30.
- **DROPPED.** It deletes the "Run the protocol here" button and the story run at an address, both ruled in round JQ ("seeing the story ... and you can run those from there"). It replaces the measured figures ("Charge held here 5.4") with "strongly active" or "present but light", which undoes V21. It prints the coherence formula and "Current expression is N%". The `esc()` calls it adds wrap constant table text, so they fix nothing.

### 11. "Coherence, 0 to 100" loses its scale
- Raw hunk H103. Would belong to: `ui/panels.js`. Line 64926, 1.
- **DROPPED.** It removes the one phrase that says what the number is out of, which goes against round PO, "unpack every symbol".

### 12. A token refresh and retry on a 401
- Raw hunks H104 to H108. Would belong to: `ui/auth.js`. Lines 65398 to 65612, about 42.
- **DROPPED.** It was written for Supabase sign in, which this server does not use. The Worker (the small server program) issues its own sessions that last 90 days (`SESSION_DAYS`). It returns no refresh token from sign up, sign in or reset, and it has no `/v1/auth/refresh` route, so the retry can never fire.

### 13. A "Set a new password" screen
- Raw hunks H110, H111. Would belong to: `ui/login.js`, with the call in `ui/auth.js`. Lines 71577 to 71630 and 71769 to 71770, about 56.
- **PORT CANDIDATE, rewritten.** It fixes a dead end that no gap item records. Measured below: "Forgot your password?" sends a link that opens the app on the plain Log in card. As written, though, it reads the wrong link and sends the wrong field (see the port list). Gap item: none yet; new, proposed as S31.

### 14. Canon, database and holes manifests, and graph editor commands
- First part of raw hunk H129 (`atuned-system-integrity-v5`). Would belong to: nothing. Lines 73805 to 74061, about 257.
- **DROPPED.** Test harness. "30 server tests" is a 30 checked against a typed 30, and "58 holes" is a 58 checked against 58 (gap S1). The graph editor commands let any caller label an edge "user confirmed" (gap S10).

### 15. A 2,500 run random field sweep and a hypercomplex walk back
- Second part of raw hunk H129. Would belong to: `tests/engine.js`. Lines 74062 to 74152, about 91.
- **UNCLEAR.** It is a real property test (a check that rules hold on random inputs, not that answers are right). But it asserts "partial CQ is null", which is group 5's maths, and `tests/engine.js` already draws 2,000 seeded random fields for the release rules. What settles it: in a scratch copy, put a NaN into one node's charge and run `tests/engine.js`. If the gate already goes red, drop the sweep. If not, port it with the CQ check rewritten to the ruled rule, always a number from 0 to 100. That would help close S1 and S11.

### 16. Block 1: a wrapper on the Story commit
- Part of raw hunk H130. Would belong to: nothing (`ui/storyui.js` by location). Lines 74163 to 74199, about 37.
- **DROPPED.** It runs a second parse before each commit and still commits a crisis story (gap B13). Its four test sentences fall short of the seven phrases, both ways, that B13's gate needs.

### 17. Block 2: a wrapper on the release answer
- Part of raw hunk H130. Would belong to: nothing (`ui/release.js` by location). Lines 74200 to 74237, about 38.
- **DROPPED.** A second rule for repeated addresses beside the engine's own (gap M13). Its verification ids come from a blank practice record that is thrown away (gap S3).

### 18. Block 6: honest privacy words and no dead model switch
- Part of raw hunk H130. Would belong to: `ui/account.js`. Lines 74301 to 74340, about 40.
- **PORT CANDIDATE, as source edits, not as the wrapper.** It closes part of B1. In the artifact it is a regex rewrite of the rendered page, so the next real build would bring the old words back.

### 19. Blocks 3, 4, 5 and 7 to 12: audits, regression and sign off
- Part of raw hunk H130. Would belong to: nothing. Lines 74238 to 74300 and 74341 to 74475, about 200.
- **DROPPED.** Test harness. Block 4 overwrites a signed in person's server profile with a test profile (gap S5). Block 7's editor has no caller (S10). Block 8 compares a value with itself, block 11 passes on any input, and block 12's sign off reads only 2 of the audits (S1).

### 20. The end of file length marker typed by hand
- The replaced last line of raw hunk H130. Would belong to: nothing (`BUILD.sh` writes it). Line 74476, 1.
- **DROPPED.** `data-len="4962481"` against the nine digit form `004832289` that `BUILD.sh` writes. The build writes this marker; a person never types it.

## Count

Read off the grouping above: **20 hunks. DROPPED 15. PORT CANDIDATE 2. UNCLEAR 3.** They cover all 130 raw diff hunks, each counted once.

## Port candidates

Backlog lines. Each is one port, one pull request, onto main.

- **Set a new password from the emailed link.** What it does: when the app opens with `?reset=<token>` in the address, it shows "Set a new password" (two fields), posts `{token, password}` to `POST /v1/auth/reset`, keeps the session token the server returns, and clears the token out of the address. Where: `atuned_src/ui/login.js` (screen and wiring) and `atuned_src/ui/auth.js` (the call), on main. Gap item: none recorded; new, proposed as S31. Port the screen, not the artifact's parsing. The artifact reads a Supabase style `#type=recovery&access_token=` and posts `access_token`; the Worker's link is `https://atuned.world/?reset=<token>` (Reboot-OS `atuned/server/src/index.js:168`), and the route refuses anything without `token` (line 176). The reset also signs out every device (line 186), so the screen should say so. It needs a browser gate that fails today (the reproduction below is that gate's first half).
- **Tell the truth about where the record goes.** What it does: rewrites the account copy that says stories "stay on this device" and "Signing in does not copy them anywhere", and removes the "Improve the Models" switch that nothing reads. Where: `atuned_src/ui/account.js` on main, lines 127, 139 and 447 to 448, plus the three Block 6 missed: 250 and 430 ("Held in this browser and nowhere else") and 476 ("There is no store yet"). The handler at 642 goes with the switch. Gap item: B1. Write the words for main's sync, not this branch's, and run the voice gate. The switch's replacement is B6's plain consent question, so do not leave the space looking like a removed promise. B1's own gate (fail on "this device", "nowhere else" or "no store" while the build can sync) lands with it.

## Reproductions somebody else can run

Run from `/home/user/MOB`, with `NODE_PATH=/opt/node22/lib/node_modules`.

    # the stamp is the same, the bytes are not
    A=/root/.claude/uploads/e909b21c-7092-5fcd-af76-1092a869307f/6f0d2d43-ATUNED_MVP_Recursive_Final.html
    sha256sum $A source.html
    grep -o 'data-build="[^"]*"' source.html $A
    diff source.html $A | grep -c '^[0-9]'          # 130

    # the reset dead end, in Chromium, probe in the scratchpad
    P=/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/reset_probe.js
    node $P $A '#type=recovery&access_token=abc'       # known good: "Set a new password", 2 new password fields
    node $P source.html '?reset=abc'                  # the Worker's real link: "Log in", no new password field

The probe was checked against the known good case first, and it found the screen. The failing case ran three times on `source.html` with the same result each time, so it is not a flake. The artifact gives the same "Log in" for the real link. On main the result is read, not run: no file under main's `atuned_src/ui/` reads `reset` from the address.

## Gates

No repository change was made, so no gate was run this pass. The last counts on this branch are in `gaps-evidence.md`: engine 4678 passed, 0 failed; functional, collide and design not run.

**Retirement record: complete. The artifact: not signed off, and never will be.**
