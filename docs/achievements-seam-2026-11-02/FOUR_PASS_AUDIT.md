# ATUNED achievements and scoring: four-pass mainline audit

Date: 2026-11-02. Baseline: rebootos-sourcce/MOB main at b6f4c1610f814a75c133d38173a52297d7e64dbf. Isolation branch: feat/achievements-seam-2026-11-02. This audit is not a claim of deployment.

## Pass 1 of 4: architecture and runtime paths
Question: where is the authority, and how do we avoid a duplicate store?
- CLAUDE.md defines the one-file product and host-free engine. atuned_src/MANIFEST is the load-bearing module order. BUILD.sh makes the browser product; BUILD-engine.sh makes the headless product.
- MANIFEST currently places engine/schema.js before engine/ladder.js, then engine/daily.js. The candidate engine/progress.js belongs after ladder and before daily. It is intentionally NOT in MANIFEST on this seam branch.
- engine/ladder.js already derives practice days, streak, ledger and transient marks. It now fixes set-but-not-done, future days, and distinct addresses. Reuse these reads, do not fork them.
- engine/schema.js owns profiles. engine/undo.js does not capture progress. engine/export.js assigns module.exports, so later modules must extend exports, not replace them.
- ui/cone.js owns the Compass record panel through ladderHtml; ui/ritual.js owns Ritual records through ritMarksHtml. Adapt these instead of inventing a new Hub. Do not put points on Daily Summary or Trace.
Result: one host-free progression module, one optional profile bag, thin UI adapters; no new backend/database. Confidence: 0.98 in placement, 0.86 in all call-site coverage.

## Pass 2 of 4: schema, migration and durability
Question: which facts survive editing, importing and old builds?
- Real ritual rows are p.rituals with t, done (false, ISO or missing legacy), min and steps. RIT_KEYS currently has no floor.
- Real stories are p.story.entries with t, imprints and bands. Only imprinted story days earn activity points. Marks may count a recorded story even without an imprint.
- Real releases are p.meter.firsts with {k,t,nm}: addr:<n> and seat:<seat>, written from ui/release.js by meterFirst. meter.unique counts lines, not addresses.
- Real snapshots are p.history with t but no per-snapshot UUID. Reading events can use an index+stamp for evidence, never for paid event ids.
- There is no p.progress in blankProfile or validateProfile on main. An older build drops unrecognized progress on load. This backward-compatibility limitation must be stated, not concealed.
- New bag: p.progress={v:1,credits:[],marks:[],seen:[]}; credits are {id,n,r,at}, marks are {k,at,v,ev}, introductions are {k,at}. No stored point total, balance, stage, streak, turn count or user identifier.
- validateProfile runs on import and boot. It must call progressValidate before any build writes progress. Invalid bags are refused by name, but pStore must retain refused records verbatim. Deleted source evidence MUST NOT invalidate credited receipts.
- Transaction boundary: pSave invokes saveProfile then pPersist. Progress settlement belongs inside the same successful durable write. An independent after-save write can fail or falsely announce an unsaved mark. Audit direct pPersist writers too.
- Backfill: missing bag yields blank then once-only settle from current correct events, dated from original act stamps; legacy state marks may be undated. Published old rates never mutate.
Result: never ship MANIFEST addition separately from schema/validator/atomic-save integration. Confidence: 0.97 for data shape; 0.83 for final writer placement pending full call-site gates.

## Pass 3 of 4: scoring algorithms, marks and guardrails
Question: can a verified act award once without manipulating behavior?
- Stable paying ids: rd:<local day> at 5 points for done ritual day; sd:<local day> at 2 points for one imprinted story day; ad:<node id> at 5 points for a first opened address. Nonpaying evidence events: st:<seat>, rg:<index>:<stamp>, tn:<ordinal>.
- Points are receipts for action, never worth. CQ, SQ, DQ and the 21 Laws measurement are separate. No reward for CQ oscillation, paying, revisiting, scrolling, repeated addresses, self-rated integration, or a turn.
- Store only immutable credit receipts, earned marks, and shown introductions. Every new rate appends a rule version. A deterministic event ID plus duplicate validation blocks repeat awards. Points do not go down after undo/delete; a mark never expires.
- The v3 mark table defines 21 active marks, including seven/thirty/ninety non-consecutive practice days, poled replacing turned, Every seat opened, and first/ten full turns. The floor mark is deferred until a ritual floor flag is added.
- Turn algorithm combines discovered story, play ritual, flow marked-done, and embody snapshot stamps, closes a circle only after all four distinct quarters appear. Future acts beyond one-day grace are not counted.
- Unlocks are one-time introductions once tier-visible content exists, not secondary access restrictions. Care hides intros, points, marks, sound and the next mark, but recording continues.
- Counter anti-farming: one act per day for story and ritual; one per address for release; no per-line rewards; no countdown, leaderboard, rarity manipulation or negative balance.
- Candidate engine/progress.js on the isolation branch passed 36 isolated JS assertions (36/36) covering pure settle, duplicates, dates, deletion persistence, rate validator, future/newer rules, care and tier gating. This is not an integrated-engine test.
Result: deterministic local algorithm with bounded exceptions for time-zone day shifts. Confidence: 0.94 in isolated invariants; 0.73 in main-engine equivalence until full runtime gates.

## Pass 4 of 4: merge seam and acceptance tests
Question: what precisely does the next AI change?
1. Rebase the seam branch on current main; diff MANIFEST, schema, ladder, Compass, Ritual, Release, Story and sound code before applying.
2. Add progressBlank to blankProfile and progressValidate to validateProfile. Keep SCHEMA_V unchanged for an optional additive field. Insert engine/progress.js after ladder and before daily IN THE SAME merge.
3. Integrate atomic progress settlement with pSave after saveProfile and before pPersist. On a failed write revert only tentative progress receipt changes and suppress the mark sound. Handle first successful boot/import migration and any direct persistence paths.
4. Change Compass and Ritual projections to progressRead persisted receipts; display names, meanings, earned dates, one next mark, and a "what earned it" evidence drawer. Do not add points to Summary, pageview scoring or a new Hub.
5. Wire one-time introductions only after real content is shown, gated by plan sight and care; do not gate paid feature access on marks.
6. Run test gate tests/progress-seam.js (added), engine build, full tests, browser functional/collision/design/monitor/funnel/boot, both 1600 and 390 viewport, import/export, storage failure, future date, clock rollback, example-person isolation, tier downgrade and care suppression.
7. Log the actual commit and check outcomes. Mainline integration is NOT complete until merge plus tests succeed. Do not let another AI mistake candidate code for deployed code.
Result: seam-ready but deliberately unmerged and unwired. Confidence: 0.90 in plan, 0.70 in browser integration before tests.

## Evidence and limitations
Directly reviewed from main: ATUNED-points-achievements-unlocks-TDD-v3.md; POINTS-AUDIT.md; DESIGN-gamification.md; CLAUDE.md; atuned_src/MANIFEST; engine/schema.js, ladder.js, undo.js, export.js; ui/ritual.js, release.js, storyui.js, cone.js. Baseline was Oct 2 v3 plus Nov 2 current source. V3 historical "missing first-run" and "future date" gaps are already repaired in main. Do not restore them. Retention benchmark from Sep 27 was not rerun; the Oct 2 model harness previously failed 6 checks. No retention impact is claimed.
Unverified: candidate under entire current engine, Node/Chromium gates, merged persistent storage, all render paths, possible concurrent updates. Owner wording ("Marks"/"Achievements"), turn name, floor, deferred Becoming family, and backend spend do not block slices 0-5.

## Ratings
Architecture map: 0.98. Schema map: 0.93. Isolated algorithm assessment: 0.94. Merge contract: 0.90. Actual runtime integration verification: 0.00, not run. Overall seam engineering confidence: 0.87. These are engineering judgments, not product completion percentages.
