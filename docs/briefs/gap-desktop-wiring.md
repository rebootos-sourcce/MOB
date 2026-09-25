# Atüned desktop: is it current, is it wired, what is the gap

Measured 2026-09-25 against rebootos-sourcce/reboot-os, branch `claude/app-migration-decision-yx56cj`, HEAD `8ba42de` (13:32:40 UTC). Read only. Nothing in either repo was edited or committed. Builds, gates and probes ran in a scratch copy at `scratchpad/reboot-verify/` and a scratch Python venv. Every number below was read off a run, a file or the GitHub API.

## Verdict in one paragraph

The desktop file is exactly what the source builds. It is byte for byte current, with no drift, and the local gate is effectively green. It is **not** "completely wired in". The database exists as code and 28 passing tests, but nothing deployed and nothing the client ships ever talks to it. Four client arrays would never sync even if it did. The CI gate has been red for 81 pushes straight since 2026-09-19. The calibrated pattern-map geometry never moved into the build. The desktop recolour reaches CSS but not the 88 places that draw seat colour from script. Nine of the app's screens got no desktop pass.

---

## 1. Is the build current

| Check | Result |
|---|---|
| Build tool | `atuned/test/tools/build.py`. The README says `tools/build.py` and `atuned/tools/` does not exist |
| `build.py --check` in place | `BUILD CHECK build/atuned.html is exactly src/`, exit 0 |
| Full rebuild in scratch, `cmp` with committed | `atuned.html` IDENTICAL, `atuned.demo.html` IDENTICAL. No stamp: the build is a plain concatenation of the 30 MANIFEST parts |
| md5 | `atuned.html` 2d333c9672355db6f04d4cdb865b03af, `atuned.demo.html` 5c148fd86c7d1c1ee87d2993963cbff6 |
| Size | 1,227,088 bytes and 17,870 lines each. README still says 1362 KB and 14,630 lines |
| Remote | `git ls-remote`: the branch head on origin is `8ba42de`, so nothing is newer on this branch. `main` is `7d7e788` (2026-05-31) and has **no `atuned/` directory at all**. `claude/keen-brahmagupta-qt32zr` (`76f1192`, 2026-09-25 13:25) is the book manuscript branch. It has no `atuned/` either, but it carries three handoffs addressed to Atüned (see 6d) |
| Tag `last-green` | `76539d2`, 2026-09-17. That is 81 commits behind HEAD |

**Verdict:** the desktop file is the most recent source, with no drift. The sibling's "build confirmed current at 8ba42de; no drift" holds.

### MANIFEST.source.json

This file is a snapshot of the 2026-09-10 inbound bundle (last touched `6910ce4`). It does not describe today's tree.

| Entry | State |
|---|---|
| `README.md` | STALE (md5 differs) |
| `build/Atuned_Core_Loop_Interactive_v1.html`, `build/atuned_smoke.py`, `build/index.html` | MISSING. None was ever committed under those paths. `index.html` became `atuned.demo.html` in `96f8f24` |
| `build/chakra_calibrate.py` | moved to `test/tools/chakra_calibrate.py`, md5 matches |
| `read-first/*` (10 entries) | directory gone, files now in `docs/`. 6 still match by md5. 4 have changed since: `ATUNED_PRODUCT_BIBLE_v1.md`, `HANDSHAKE_CLAUDE_CODE.md`, `IA_SCHEMATIC.md`, `WHATS_LEFT.md` |
| `data/*` (7) and `unwired/*` (6) | all 13 match |

---

## 2. Is everything wired

### 2a. `unwired/`

| File | What it is | Should it be in the build |
|---|---|---|
| `Atuned_Pattern_Map_T3.html` (539,420 B) | "Pattern map, team three". HANDSHAKE_v2 calls it "THE PATTERN MAP. version four ruled. calibrated. NOT IN THE BUILD". It carries 113 fetters on the artist's own nerve ink plus seven calibrated chakra orbs | **Yes, partly, and it is not.** The build ported a different layout, `toolPatternMap` ("Energy, B opened up", 1248). That layout places every imprint by a **hash-seeded scatter around a band height** (`pmNode`, `src/40_the-archetypes.js:289`), not on the calibrated nerve positions. The calibrated values exist only in this file and in `data/fetter_positions.json`, and 0 of them appear in `src/` |
| `Atuned_Pattern_Map_Reviewed.html`, `_Four_v2.html`, `_v3.html` | the four escalations, the critiques, masks and connections | reference, superseded by the T3 pick |
| `Atuned_Release_Directions.html` | "The release loop, four" | "never ruled" (HANDSHAKE) |
| `Atuned_Three_Concepts.html` | rebound ring, pair, accountability mock | "two are wired now" (HANDSHAKE_v2). The third was never ruled |

### 2b. Unreached functions

`KNOWN_UNWIRED` lives in `atuned/test/smoke.py:17`. It holds **33** names. `callers.transitive_unreachable()` on the build returns exactly the same 33, and the gate enforces equality both ways. `callers.py` in its direct mode reports 26. MVP_STATUS's "62" is stale.

The 33: advance, askGate, avatarActivate, avatarDaysLeft, avatarGap, avatarProgress, channelCounts, checkWins, clientLink, clientOpen, exportAll, fin, ledgerRows, ledgerSummary, letGoAt, letGoByChannel, letGoByLayer, letGoCount, letGoTopics, onbApply, practicesFor, renderPolarity, replayOnboarding, rnd, rollUp, rrBack, rungOf, simulateReadings, toolIcon, verpSheet, winRead, winSnapshot, winTotals.

Five of these are kept on purpose because only the gate or a tool calls them: simulateReadings, fin, rnd, rungOf, toolIcon. There are 663 declarations, 660 of them unique, and no dynamic dispatch.

### 2c. `python3 atuned/test/smoke.py`

- Run in the scratch copy with Playwright 1.56 and chromium-1194: **`SMOKE TEST PASS 790 FAIL 1`**, exit 1. The server step inside it read 28 tests green.
- The single failure is the gate's own defect, not the product. `test/tools/undeclared.py:22-23` and `test/tools/routes.py:11` hard-code `/home/user/Reboot-OS/...`. The repo is not at that path here, and it is not at that path in CI either.
- I ran a copy of `undeclared.py` with the path corrected: 814 candidates, 0 undeclared, "every table and every call resolves". **In substance the gate is 791 of 791.**
- **CI tells a different story.** The GitHub Actions `gate` workflow has had **81 consecutive failing runs**. The last success was run 62 on `76539d2` (2026-09-17). The first red run is `cc0b043`, the commit that added `undeclared.py` with the hard-coded path. Runs 63 to 113 ran for 97 to 238 s and failed. Runs 114 to 143, including all 13 desktop commits, fail in **3 to 4 seconds**, so the gate never started. I cannot read the job logs from here to say why. The `server` workflow fails in about 3 s on its latest runs too. "Nothing merges red" is not being held.

### 2d. The server: database built, not wired in

- `wrangler.toml`: `database_id = "REPLACE_AFTER_wrangler_d1_create"`. **Still the placeholder.**
- There are 8 migrations, 0001 to 0008. `npm test` (node:test against a `node:sqlite` shim, not real D1): **28 pass, 0 fail**. `wrangler` is not installed here, so a real D1 or deploy was not exercised.
- `server.yml` deploys only on `refs/heads/main`, and it exits early if the placeholder is present. `web.yml` triggers only on `main`. `main` has no `atuned/`, and the GitHub API returns 404 for `web.yml` runs. **The Worker has never been deployed and the web build has never been published from this repo.**
- **Client:** the only network calls are the service worker's pass-through `fetch` and `cloudFetch` in `src/42b_cloud.js`. Both are gated on `ATUNED_API`, which reads `window.ATUNED_API || ''`. Nothing in `src/` or `build/` sets it (1 occurrence in the build, the reader itself). Only `test/tools/web.py --api URL` would inject it. The Capacitor `shell/sync.sh` copies the build without it. Measured at runtime: `ATUNED_API === ''` and `cloudOn() === false`, so push, pull, purchase, crash report, reset link and version check are all no-ops.
- **The shipped client is fully offline.** Accounts, sync, consent, entitlements and push exist as code and tests only. Settings tells the person "Accounts arrive with the phone app".

---

## 3. The JSON acting as a database

Direction matters here. `build.py` transforms nothing, so **no JSON is inlined at build time.** The 126 canon tables are literals inside `src/`. `canon.py` extracts them *from* the build into `data/canon_tables/*.json` and `canon.sqlite`, and the gate asserts they agree. `canon.py --check`: **126 tables, drift 0.** The client reads **no JSON file at runtime.**

| File | Class | Note |
|---|---|---|
| `canon_tables/*.json` (126), `canon.sqlite` | (c) mirror of the build, held by the gate | also `holes.json` (baseline of 58 known canon holes) and `manifest.json` |
| `lattice.json`, `trace.json`, `readings_fixture.json` | (c) tool and gate; named only in `src/` comments | |
| `letgo/letgo_2026.json` (376 topics), `letgo_tails.json`, `letgo_fetter_join.json`, `letgo_join.json`, `letgo_cards.json` (233 sets, held apart by ruling), `manifest.json` | (c) tools and gate | the build carries **150** let go topic rows (`LETGO_TOTAL=150`) and derived tails, against 376 dictated topics |
| `nodes_112.json`, `pattern_data.json`, `register_join.json`, `personas.json`, `validation.json`, `nine_laws.json`, `user_schema.json`, `retention_*.json` (5), `simulation_report.json`, `intake/*.json` (2) | (c) tools and gate | |
| **`fetter_positions.json`** (113 calibrated positions) | **(d) orphan** | read by nothing, and absent from the build. Foundation that did not migrate |
| **`chakra_orbs_calibrated.json`** (7 orbs) | **(d) orphan** | same |
| **`left_arm_nodes.json`** (6 named arm nodes) | **(d) orphan** | same |
| **`canon.json`** (SOURCE_OS_CANON_v1, "GOVERNS" per HANDSHAKE_v2) | **(d) orphan** | no tool, test or source reads it, so nothing enforces what it says it governs |
| `FETTER_CORPUS_MAP.json` | (d) orphan, superseded | replaced by `letgo_fetter_join.json` (1196) |
| `letgo/letgo_pdf_a.json`, `letgo_pdf_b.json` | (d) orphan, archival | earlier typed versions of the dictation |
| `cq_icp_probe.json` | (d) orphan, a one-off analysis snapshot | |

Canon schema: `canon_schema.py` reports **58 holes**, all in the baseline. SABAUTH has 25 (authorship missing), SABBEH 4, and eye and crown are missing across 12 tables.

---

## 4. Schema per system: client against D1

- **Client:** IndexedDB database `atuned`. Keys `state` (one blob), `account`, `sync`, `crashes`, `lock`, `state_refused`. `snapshot()` has **48 keys**, and `data/user_schema.json` has **48**. They match exactly in both directions.
- **D1:** `records(account_id, kind, id, version, body JSON)` plus `research_records`, accounts, sessions, consent, audit, entitlements, store_events, push_subs, resets, attempts, crashes, server_errors, and `canon_*` tables. `body` is opaque JSON, so D1 can hold any client field. The gap is in the **mapping** (`cloudRecords()`), not the columns.

Measured on the `sofia` profile:

| Client key | Synced as | Gap |
|---|---|---|
| 37 non-array keys | kind `state` | none |
| stories, runLog, HIST, LEDGER, proto, CLIENTS, DECKLOG | imprint, release, reading, ledger, step, client, card | none |
| **`week`** (7 rows on this profile) | **nothing** | never leaves the device |
| **`cascade`** | **nothing** | server `KINDS` accepts `cascade` and the client never sends it |
| **`applied`** | **nothing** | no kind exists for it |
| **`WINS`** | **nothing** | no kind exists for it |
| (none) | server kind `day` | accepted, never sent |

A second device, or a restore after a reinstall, would lose the week, the cascade queue, the applied report and the wins. This is latent today only because the client never connects. Other structural notes:

- `LOCK` is a PIN overlay. It stores a salted SHA-256 digest only, and the record itself is **not encrypted at rest**, although ruling 1141 said it would be.
- `PERSON.name` travels inside `state` to `records` (not to `research_records`).

---

## 5. The desktop specifically

**One build.** There is no separate desktop file. Three `@media (min-width:1201px)` blocks were added (37 rules plus two single rules) and one `max-width:1200px` block. From 901 to 1200 px the app shows the old centred phone frame. Every surface renders the same markup at 1600 and 390; I measured this per surface and found no page errors at either width. The gate runs its surface checks at 393 wide. Its **only** desktop-width assertion is that each lighting keeps `#dev` wider than 1000 px.

**Touched by the 13 commits:** shell and nav (top tab bar), tokens and seven lightings, Home (two columns), Tools hub (three columns), Journal / Story `p0` (two columns), Release `p2` (600 px column), Ritual `p3` (two columns), Field (**new screen**, reachable only from the desktop tab), Compass (sphere capped at 460 px), Structure / `saboteur` (browse and detail), Boundary (browse and detail), Psyche (browse and detail), and the Signal overlay (centred). Imprints `p1`, Settings and Band page were "audited, no change".

**Not touched by any desktop commit.** Each renders the phone layout stretched into the 1060 px frame:

- **Energetics tab → `flow`.** The figure is blown up to the full column (I looked at the capture).
- **Body tab → `pain`.**
- **Knowledge tab → `kb`.**
- **Games tab → `match`.**
- The rest: `patternmap` (and `balance` and `bodymap`, which alias to it), `polarity`, `overlay`, `lexicon`, `diag`, `practices`, `observer`, `avatar`, `archetypes`, `source` and `load`.
- The release flow sheet, onboarding and landing were not examined.
- `polarity` (Balance) and `load` are hidden from the hub, and the tab bar adds no door. They are still unreachable (BACKLOG G-6.13).

**Nav defects, measured:**

1. **The lit tab is not the current screen.** The app boots to Home while the bar lights "Field", at both widths and with or without `#dev`. After you click Body then go back, Home is showing and "Body" stays lit. `dtabSet` records the last click, by design comment, so every in-app route leaves the bar wrong.
2. **Home has no tab.** The wordmark is its only door.
3. **Tab names mean different things from the MOB build they were ported from.** In MOB, Energetics is the intake. In Atüned it opens the flow figure. In MOB, Body is the energy map. In Atüned it opens the pain map. One word, two concepts.

**Lightings, against the brief values given and against MOB's own source:**

- **CSS tokens: 59 of 59 match** the MOB reference across all seven lightings. That covers bg, panel, panel-2, sunk, ink, mid, dim, accent, on-accent and good, and every value in the brief list.
- Dark matches every brief hex: Root #D6524C, Sacral #D8924E, Solar #DABF6A, Heart #5FD5A6, Throat #5EBBDB, 3rd Eye #7D93E0, Crown #A77EDB, accent #7EB8D4, --bg #0C0D12, --panel #1A1D26, --panel-2 #252833, --sunk #090A0E, ink #EFEDE8, mid #B4B0A8, dim #94908A.
- **Script-drawn seat colour does not follow, in 6 of 7 lightings.** `PAL.dark` is built from `RULED`, so `BANDS[b].c` stays at the old palette. Root is #E0524B, Sacral #F08A2E, Solar #EFC53F, Heart #4CD9A0, Throat #3FC3E8, Eye #6E8CF0, Crown #B77DE8. Snow's script colours are the saturated set (#E01B24 and so on), not PAL_LIGHT. Only Lumen agrees.
- There are **88** `BANDS[..].c` reads in `src/` against **10** `var(--seat)` uses. On desktop, DOM and SVG or canvas seats disagree in the default lighting. Even the wordmark paints #3FC3E8.
- Deferred by the sibling, as stated: Glass material, Punch's seat-tinted ground (its base values ship un-tinted), and Lumen's stage.
- **Type:** the build loads Instrument Sans, Geist Mono and Comfortaa from `fonts.googleapis.com`. The MOB reference embeds Inter with no network. The typography roles were not ported.

---

## 6. Docs against reality: spot checks

| # | Claim | Reality |
|---|---|---|
| 1 | DEV_CHECKLIST 4.4 "The client ... loads nothing external" | False. `src/00_head.html:13` loads Google Fonts |
| 2 | DEV_CHECKLIST 4.1 "499 assertions ... 21 server tests" | 791 passes, and 28 server tests |
| 3 | DEV_CHECKLIST 4.3 "Nothing merges red: BUILT" | CI gate red for 81 consecutive pushes |
| 4 | DEV_CHECKLIST 2.5 and 5.1, GAME_PLAN "six migrations" | 8 |
| 5 | DEV_CHECKLIST 3.4 "Six workflows" | True, 6 |
| 6 | WIRING_AUDIT "35 of 35 edges wired" | Regenerated: current except one row (`sqTen` is now `bandTen`) |
| 7 | THE_LOG count block, "generated, gate-checked" | True. `log.py --check` matches all 24 counts |
| 8 | THE_LOG "every note lands in PART 3 before code" | The ledger stops at round 1255. The 09-24 and 09-25 rulings (the real-numbers rule, the desktop direction, match the MOB chrome, seven lightings) are not ledgered, and no desktop entry exists in THE_LOG, BACKLOG or THE_RULINGS (last touched 09-14) |
| 9 | GAME_PLAN 09-24 "A Cloudflare Worker with D1 is live ... in CI" | Not deployed. Placeholder id, deploy only on `main`, CI red |
| 10 | GAME_PLAN 09-25 "a persistent left rail (`.sidenav`)", "790 assertions ... all green" | `.sidenav` was removed in `08d6153` (0 occurrences). CI red |
| 11 | MVP_STATUS "62 unreached", "115 canon tables", "55 holes", "28 parts", "There is no database" | 33, 126, 58, 30. The server is built, contradicting its own server rows |
| 12 | APP_MAP "No history API", "17 tools", "settings ... do not exist" | Back is built (1210) and gated. There are 19 tool keys. Settings exists |
| 13 | README "GATE 473 checks", "SERVER ... 5 tests", "1362 KB 14630 lines", "`tools/build.py`" | 791, 28, 1,227,088 B and 17,870 lines, `test/tools/build.py` |
| 14 | root CLAUDE.md "357 assertions" | 791 |
| 15 | `docs/THE_SIX_MODES.md` | **0 bytes.** 94 lines were emptied in `20b683f`, against "nothing is deleted from outputs". Recoverable from `20b683f^` |

### 6a. The four owner questions at the end of GAME_PLAN

1. **TQ.** Answered: bible **1190** (`7e5b475`, 2026-09-11 19:13, 46 minutes after GAME_PLAN was written) says "Not TQ; he said CQ." GAME_PLAN was never updated.
2. **Dictation loading.** Not ruled by the owner. Bible **1201** sets a default, status "Proposed": store the whole passage and present one line at a time. **1202** built the split tails (877 tails from 265 topics). The curation pass is still his.
3. **Backend region, provider, PIN recovery.** Not ruled on record.
   - 1201 *proposed* Supabase, US, with the code resettable through the account.
   - 1216 then *built* a Cloudflare Worker with D1, US, which contradicts that proposal.
   - PIN recovery is built as "use your account password, else Delete everything". With no server connected, every real user today gets only "Delete everything".
4. **Body typeface.** Unanswered anywhere. The build still ships Instrument Sans. The brief and MOB use Inter.

### 6b. Book-side handoffs addressed to Atüned, on branch `keen-brahmagupta-qt32zr`

`handoff/ATUNED_HANDOFF.md`, `ATUNED_SPEC.json` (09-14, with UI rulings added 09-19) and `SNIFFER_SPEC.md` (09-20) are referenced **nowhere** under `atuned/`. Measured against the build:

- "Sol Star, NOT Soul Star": the build has "Soul Star" 2 times and "Sol Star" 0.
- "The app opens on the field": Atüned boots to Home.
- Hyper-complex primary layer "the six modes": `HYPER` is keyed by 8 clinical labels (Narcissism, Bipolar Disorder, Borderline Personality Disorder, and so on). The six modes appear only as glyph names. The spec rules that a clinical label must never be shown as a diagnosis.
- "Nine registers ending on voicing": the build has 7 channels.
- Masks: spec 7, build 6. Hyper-complex modes: spec 6, build 8. Laws of integrity: spec 21, build 20.
- Crisis resource: 0 in the build. The spec lists it as missing product side.

Whether these book rulings bind Atüned is the owner's call. The fact that they never reached `atuned/` is the finding.

---

## THE GAP, foundation first

### Foundation and logic

1. **The server is not wired in.**
   - `database_id` is still the placeholder.
   - Deploy and web publish run only from `main`, and `main` has no `atuned/`.
   - Nothing sets `ATUNED_API`, so the shipped client never calls the server.
   - Needs from the owner: the Cloudflare account, the D1 id, and a ruling on region, provider and PIN (question 3). Needs from us: a merge path to `main`.
2. **The CI gate has been red for 81 pushes** since 2026-09-19. `undeclared.py` and `routes.py` hard-code `/home/user/Reboot-OS`, and runs 114 to 143 die in 3 to 4 s for a reason not readable from here. `last-green` is stuck at `76539d2`.
3. **Sync mapping drops four record kinds.** `week`, `cascade`, `applied` and `WINS` are never pushed. The server accepts `cascade` and `day`, which the client never sends.
4. **Calibrated pattern-map geometry did not migrate.** `fetter_positions.json` (113), `chakra_orbs_calibrated.json` (7) and `left_arm_nodes.json` (6) are read by nothing. The build scatters imprints by hash instead. Its register is 112 and the positions file is 113, which needs reconciling on the way in.
5. **`canon.json` ("GOVERNS") is read by nothing,** so nothing holds the build to it.
6. **The book handoffs never reached `atuned/`.** The six-modes layer against 8 clinical labels, Sol against Soul Star, 7 channels against 9 registers, the count differences, and no crisis resource. Each is the owner's call once named.
7. **The journal is not encrypted at rest** (1141 ruled encryption). The lock is a digest-checked overlay.
8. Let go: 150 topic rows are in the build against 376 dictated. Ruling 1188 (whole run or lines) was never taken by the owner.
9. `KNOWN_UNWIRED` holds 33. Of these, `clientLink` and `clientOpen` (the practitioner tier), `exportAll`, the win and ledger readers and the onboarding replay are product features built and unreached.

### UX

10. **Nine app surfaces have no desktop pass.** They include four of the eleven tab-bar destinations: Energetics/flow, Body/pain, Knowledge/kb and Games/match. The rest are patternmap, lexicon, archetypes, overlay, diag, practices, observer, avatar and source. Load and polarity also have none, and are the next item.
11. `polarity` (Balance) and `load` have no door on desktop or phone.
12. The tab bar's lit tab reflects the last click, not the screen. It boots lit on Field while showing Home.
13. Home has no tab. Tab names carry different meanings from the MOB build they came from (Energetics, Body, Summary).
14. The 901 to 1200 px range gets the phone card.
15. No gate assertion covers any desktop layout, the Field screen, or the tab bar state.

### Look

16. **Seat colours split between DOM and script in 6 of 7 lightings,** including the default Dark. There are 88 `BANDS.c` reads still on the old palette. CSS tokens are 59 of 59 correct.
17. Knowledge and Practices row descriptions render **black on near-black (contrast 1.08).** The JS emits class `prd` and the CSS styles `.tprd`. This dates from the landing, is at both widths, and shows on the Knowledge tab.
18. Glass material, Punch seat tint and the Lumen stage are deferred.
19. Typeface: Instrument Sans from Google Fonts against the brief's embedded Inter. That makes one outbound request in a product documented as having none. Question 4 is still open.

### Content and records

20. Canon: 58 schema holes. Eye and crown are empty across 12 tables and 25 saboteurs have no authorship.
21. Docs out of step with the code: README, root CLAUDE.md, MVP_STATUS, APP_MAP, GAME_PLAN (both status notes and question 1), DEV_CHECKLIST 4.1, 4.3 and 4.4, WIRING_AUDIT (one row), and MANIFEST.source.json (3 missing, 4 changed, 11 moved). `THE_SIX_MODES.md` was emptied. The THE_LOG ledger has no entries after round 1255.

### Could not verify in this container

- Why CI runs 114 to 143 fail in 3 to 4 s. The job logs are not readable here.
- Whether repository variables or secrets (`ATUNED_API`, Cloudflare) exist.
- Real D1 behaviour, because `wrangler` is not installed.
- The full text of the art-direction brief, which is not on disk. The lightings were checked against the values supplied and against MOB's own source.
