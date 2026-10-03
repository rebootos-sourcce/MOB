# Points audit. The Points, Achievements and Unlocks TDD against the code

The document: `ATUNED-points-achievements-unlocks-TDD-v2.md`, 1210 lines, read
in full. The file name says v2 and its own header says Version 1.0. Its
section 38 says a system is ready when "every reward originates from a
validated event" and its section 1 says it "does not score the person's worth".
The owner's instruction: "review this to the plan or the queue." This is the
review. Shape follows `PRACTICE-AUDIT.md` and `BECOMING-AUDIT.md`: every
requirement classed EXISTS, PARTIAL, MISSING, CONFLICT or UNVERIFIED against
the real code, because documentation is not implementation.

## The stamp on this measurement

    commit        2dd3823, the tip of claude/laughing-feynman-xhfyj3. It carries
                  engine/practice.js and engine/trace.js, both built, and
                  neither written by any surface yet (searched ui/ for
                  practiceDo, practiceFromLegacy, traceApply: no caller).
    read          engine/ladder.js whole; engine/schema.js 13 to 120, 139 to
                  215, 253 to 300, 418 to 455, 791 to 1131, 1132 to 1450 by
                  function; engine/practice.js 1 to 160, 250 to 285, 356 to 383,
                  841 to 1030; engine/trace.js 1 to 80 and 680 to 700;
                  engine/plan.js 1 to 110 and 269 to 300; engine/compute.js 255
                  to 400; engine/outbox.js 17 to 40; ui/cone.js 3120 to 3190;
                  ui/ritual.js 278 to 290, 500 to 610, 1082 to 1160;
                  ui/storyui.js 395 to 420; ui/release.js 825 to 850;
                  ui/sound.js 515 to 545; ui/auth.js 1 to 40.
    read, records DECISIONS.md every line matching badge, achievement, points,
                  score, streak, ladder, leaderboard, sight, and the sections
                  around each; TASKS.md blocks GB, LD, AP, RL, RB (two), GM, AK,
                  AE, SIG17, round OE; PRIORITY.md 21.J2, 22.K18 and the
                  "not doing" list; DESIGN-gamification.md sections 6 and 12;
                  DESIGN-progression.md sections 2 to 4; DESIGN-ladder.md
                  sections 1, 4; PRACTICE-AUDIT.md and BECOMING-AUDIT.md heads.
    measured      the probes in appendix A, run against an engine built from
                  atuned_src into a scratch path, so the tracked engine.js was
                  not touched. `node tests/engine.js` against the same build:
                  3039 passed, 0 failed.
    not run       any browser gate (Chromium was busy). Nothing here makes a
                  claim about pixels. `tools/loopsim.js` was run and its own
                  validation fails (see conflict C12), so no retention figure
                  below was re-measured today.

## How the statuses are counted

Not typed here. A count typed into a document that the table then grows past is
the defect CLAUDE.md records twelve times. Read them off the file:

    grep -oE '\| (EXISTS|PARTIAL|MISSING|CONFLICT|UNVERIFIED) \|' POINTS-AUDIT.md | sort | uniq -c
    grep -oE '\| (DERIVABLE|PRACTICE|NOTHING) \|' POINTS-AUDIT.md | sort | uniq -c
    grep -oE '\| (IMPOSSIBLE|BOUNDED|OPEN) \|' POINTS-AUDIT.md | sort | uniq -c

The first reads the requirement table. The second reads the event table in
section 3. The third reads the anti gaming table in section 6. What the
document itself carries, read off it the same way:

    sed -n '/type ProgressEventType/,/;/p' ATUNED-points-achievements-unlocks-TDD-v2.md | grep -c '| "'
                      the event types in section 5
    awk '/^## [0-9]+\./{split($2,a,".");s=a[1]+0} /^```/{b=!b;next} b && s>=10 && s<=17 && NF && !/↓/ && !/:$/ && !/^RELEASED|^TRIGGER|^OLD RESPONSE|^NEW RESPONSE|^REPEATED|^STABLE|^EMBODIED$/ && (s!=16 || /^CQ /) {n[s]++; t++} END{for(k in n)print k,n[k]; print "total",t}' ATUNED-points-achievements-unlocks-TDD-v2.md | sort -n
                      the named achievements, by section, 10 to 17. Section 23
                      adds six Turn achievements on top of that total.

## 1. Read this first

The findings that change what gets built. The rest of the file is evidence.

- **The document is mostly inside the hard line, and that is to its credit.**
  This product reads somebody's nervous system and I will not use a
  manipulation pattern on it. The document's own rules (no negative balance, no
  leaderboard, no urgency, evidence behind every award, no purchase of
  transformation with points) are the rules I would have written. It crosses
  the line in three places, all named below: a rarity target that becomes a
  scarcity signal if it is shown (C9), "tune unlock timing" in phase 7 if the
  tuning target is return visits (C10), and a printed points total beside a
  reading (C6). The owner's own earlier words cross it a fourth time, and that
  one is not the document's: RB9v, "If I fail an accountability I lose points."
  The document says the opposite, and the document is right (C1).
- **Half of this system already exists, under other names, and the document
  does not know.** `engine/ladder.js` is a pure projection of the record into
  counters, a streak, a ledger and sixteen earned marks in three families, each
  with an icon and a seat colour. `meter.firsts` is a dated, once only,
  validated list of firsts. Both are the "event sourcing" the document asks
  for, done the way this repository does it: derive from the record, store only
  what cannot be derived. A stored immutable event ledger is a second source of
  truth beside them (section 5 argues the alternative).
- **The streak the document tells you to use is broken, and measured.** Section
  10: "Streak definitions must use the canonical accountability engine." The
  canonical engine counts a day when a ritual was set and never done. Thirty
  days set, none done, earns First run, Seven days and Thirty days (probe X2).
  Ninety days dated in the future earns Ninety days (X7). `PRIORITY.md` 21.J2
  queued it "Now, small" and it has not landed. Nothing in this document can be
  built on `pracDays` until it does.
- **A mark can be lost, and the document says achievements do not expire.**
  The ladder recomputes every mark on every read. One axis falling back
  un-earns First clearing (X10). Deleting one day of a thirty day run un-earns
  Thirty days (X9). Section 27 rule 6 and section 36 both forbid this. The fix
  is a small stored set of grants, written once, like `meter.firsts`.
- **Saboteurs, complexes, hyper complexes and masks are readings, not things.**
  `compute()` rebuilds them from the current charge on every call
  (`engine/compute.js` 266 to 322). They have no id and no state. A complex is
  named "A + B" from a sort order. The document's sections 12 to 15 and 18 give
  them a lifecycle (detected, mapped, released, resolved, integrated) that
  nothing stores and nothing observes. Most of the event types in section 5
  have no emitter and cannot be emitted by the Practice or Trace builds either
  (count them with the command in section 3). The saboteur, complex, hyper
  complex and mask achievements, and the +15, +30, +75 and +50 point rows, rest
  on entities that do not exist.
- **CQ cannot be "verified", and the document pays points for it anyway.**
  CQ is the answered laws summed over 210. Answer all 21 laws 10 with nothing
  carried and CQ reads 100, Mastery, with no work done (X13). One step on every
  answer moves it 70 to 80 and back (X14). The only part of CQ that action
  moves is the release lift, `LIFT_R` 0.00077 a pattern (`engine/compute.js`
  150), which is real and slow. Section 7 pays "+1 CQ +1 verified", section 4
  says "CQ ≠ Points", section 27 rule 10 says "Readings do not become XP". The
  document contradicts itself, and the standing rule agrees with sections 4 and
  27 (C4).
- **Unlocks that hide a reading conflict with a ruling, and the rulings
  disagree with each other.** `engine/plan.js` 21: "SIGHT IS NOT FOR SALE.
  Ruled." `DECISIONS.md` 1429: "Sight by tier is real." Section 20 gates Complex
  Map, System View and Mask View on achievements. Which ruling stands decides
  whether an unlock may withhold anything (C5, question 5).
- **Nothing here can be tamper proof on a device the person owns.** The record
  is a file the person exports, edits and imports. The boundary accepts 500
  junk ground keys (X4), duplicate firsts (X6), dates ninety days ahead (X7) and
  an unknown top level key it then silently drops (X11, which also means a
  `p.progress` added without a validator is deleted on the next load). That is
  harmless while nothing earned can be spent. It becomes forgery the day points
  buy patterns, which `TASKS.md` AE1 says they do (C2). That is the single
  decision that sizes the whole build.
- **Section 28's reference numbers have no source in the repository.** "First
  Complex about 24%, First Hyper-Complex about 8%, First Mask about 11%, CQ +10
  about 11%": searched every file, no such simulation exists. The nearest
  harness is `tools/loopsim.js`, which fails its own validation at this commit.
  Those four numbers are UNVERIFIED.

## 2. The table

Columns: requirement with the document's section, what the code has now, the
status, file and line at 2dd3823, and the change. "Slice" names the build step
in section 5. A line number is a place to start reading, not a promise that the
file has not moved.

| # | Requirement | Current implementation | Status | File and line | Change and slice |
|---|---|---|---|---|---|
| P01 | Core principle: celebrate action and verified change, never score the person (s1) | The ladder's header rules it: "a reading is never a score". Marks name ground and practice, never the person | EXISTS | engine/ladder.js 4 to 16; DECISIONS.md 646 to 651 | Keep. Every new string goes through `check.py`. Slice 0 |
| P02 | Pipeline: activity, ledger, achievements, points, unlocks (s2, s22, s24) | `ladderRead` projects the record into marks. No ledger, no points, no unlock stage | PARTIAL | engine/ladder.js 236 to 244 | Derived events, grants, then optional points and unlocks. Slices 1 to 4 |
| P03 | Four outputs kept distinct: points, achievements, readings, unlocks (s2, s34) | Readings and the record are separate in the engine. The ladder reads axis state for three marks (nine, clear, five clear), which is a reading by another route | PARTIAL | engine/ladder.js 102 to 103, 200 to 223 | State the three as "state" marks, keep them out of any sum. Slice 1 |
| P04 | The ontology chain: charge, fetter or address, saboteur, complex, hyper complex, character or mask (s3) | The chain exists as readings: nine fetters (CHILD), 112 addresses, 14 library saboteurs plus 33 range saboteurs, six hyper complex families, six masks of which five are read. "Fetter" and "address" are used as one thing by the document and are two in the code | PARTIAL | engine/data/canon.js 291 (CHILD), 525 (MASKS); engine/core.js 11 (BY); engine/data/nodes.js 7; engine/compute.js 266 to 322 | Ruling on the word fetter (question 4). Slice 3 |
| P05 | Derived structures carry CANONICAL, INFERRED, EMERGENT or PROVISIONAL (s3) | The Practice and Trace builds carry five states: known, inferred, proposed, user_confirmed, observed. Two vocabularies for one idea, one word shared | CONFLICT | engine/practice.js 43; engine/trace.js 75 | Use the five. Map the four onto them in the document, not the code. Slice 3 |
| P06 | Progression has breadth, depth and consistency, independent (s4) | Breadth: ground is `meter.unique`, a count of thought lines, not places. Consistency: the streak. Depth: nothing | PARTIAL | engine/ladder.js 106; engine/schema.js 1133 | Count addresses from firsts for breadth; define depth in words before code. Slice 1 |
| P07 | State change observed separately from activity (s4) | History rows carry cq, dq, sq, loaded, sab, cx, hy per snapshot, stamped with the CQ model | PARTIAL | engine/schema.js 253 to 260, 1042 to 1083; engine/compute.js 84 | Keep readings out of the ledger (C4). Slice 1 |
| P08 | ProgressEvent record with id, userId, type, occurredAt, source, subject, evidence, metadata, schemaVersion (s5) | None. The nearest is the Practice log: seq, type, at, ref, src, data, no user id, no free text | MISSING | engine/practice.js 255 to 265 | Derived events with a deterministic id, no userId. Slice 1 |
| P09 | userId on every event and on UserProgress (s5, s30) | The record carries no account id by ruling. The Practice build refuses user_id by name on every kind | CONFLICT | engine/practice.js 100; DECISIONS.md 133 to 144, 669 ("the name never leaves the device and a key replaces it") | Drop the field. An event belongs to the record that holds it. Slice 1 |
| P10 | Event identity and a stable id to dedupe on (s5, s6) | A story entry and a ritual day are identified by their timestamp only. Two stamped the same instant get #1, #2. An entry with no readable time is keyed by position and reported as a gap | PARTIAL | engine/trace.js 685 to 693 | Reuse `traceTimeIds`. Id is type plus that key. Slice 1 |
| P11 | The event types (s5) | See section 3: each type classed DERIVABLE, PRACTICE or NOTHING | PARTIAL | section 3 | Emit the derivable ones, which the section 3 command counts. Slice 1 |
| P12 | `Evidence[]` on each event (s5) | The type is used and never defined by the document. The Practice Evidence kind has source, type, dimension and a pattern id and is the nearest thing | UNVERIFIED | engine/practice.js 52 to 53, 88 | The document owns defining it. Use Practice's. Slice 1 |
| P13 | Every other type the document leans on is defined (s5, s9, s19, s25) | SubjectType, EventSource, RequirementExpression, RarityTarget, UnlockPayload, AchievementTrigger, EvidenceTrigger and the projection engine are named and never defined | UNVERIFIED | the TDD, sections 5, 9, 19, 24 | Section 7 lists what to ask the document's author for |
| P14 | Ledger is append only and immutable (s5, s6) | Nothing for progress. The Practice log is numbered with no gap and is append only by its writer. The Ritual tab deletes day entries and takes back a press | CONFLICT | engine/practice.js 500; ui/ritual.js 506 to 527, 593 to 596 | Append only is a property of a writer on a device the person owns, not a guarantee. State it that way. C3 |
| P15 | Idempotent: the same event never awards twice (s6, s27.1, s33 replay) | Marks are derived so they cannot pay twice. `meterFirst` is once per key. Import accepts two firsts with one key (X6) | PARTIAL | engine/schema.js 1425 to 1433, 899 to 909 | Grants are a set keyed by achievement id, duplicates refused by name. Slice 2 |
| P16 | Validated before any reward is calculated (s6) | The boundary exists and refuses by name. It accepts junk ground keys, future dates and unbounded counts | PARTIAL | engine/schema.js 791 to 1131; probes X4, X5, X7 | Section 5, boundary list. Slice 0 |
| P17 | Timestamped and attributable to a source action (s6) | Entries are stamped. The source action is not recorded except the Practice log's `src` | PARTIAL | engine/schema.js 722 to 735 | Event carries its source kind and the key of the record it came from. Slice 1 |
| P18 | Points are an additive celebration currency; no negative balance (s7) | No points exist. The shipped currency is patterns, granted by plan, spent by opening new ground | CONFLICT | engine/plan.js 50 to 66, 273; TASKS.md RB9v, AE1, AK2, RL9 | Questions 1 and 2. Slice 4 if ruled in |
| P19 | The value table (s7) | Absent. The owner's earlier table is DESIGN-gamification 6.4: 1, 1, 5, 5, 8 patterns, paid after the fact | MISSING | DESIGN-gamification.md section 6.4 | Rates in a data table, versioned. Slice 4 |
| P20 | Points for CQ movement: +1, +5, +10, +15, +20 (s7, s16) | None, and the document forbids it elsewhere | CONFLICT | s4, s27.10, s36 against s7; DECISIONS.md 646 to 651 | Strike the rows. C4. Question 3 |
| P21 | pointsBalance and lifetimePoints as separate fields (s30) | Two fields imply a spend. Section 7 defines no spend | UNVERIFIED | the TDD, sections 7 and 30 | Ask. Question 2 |
| P22 | Points reward evidence of action; opening, viewing, reading, clicking do not (s8, s27.3) | No mark reads a view. The sound layer reads marks and never writes one | EXISTS | engine/ladder.js 160 to 228; ui/sound.js 518 to 540 | Keep. A gate: no event type derives from a render. Slice 1 |
| P23 | Track total executions, unique patterns, unique nodes, unique domains (s8) | Executions: `meter.lines`, reruns included. Unique: `meter.unique` keys. Nodes: derivable from the key. Domains: undefined (19 soul domains, 7 seats, or catalogue groups) | PARTIAL | engine/schema.js 57 to 69, 1133; engine/data/canon.js 368 (DOMAINS) | Define domain. Question 4. Slice 1 |
| P24 | AchievementDefinition: id, family, name, description, requirement, repeatable, pointReward, unlockIds, rarityTarget, schemaVersion (s9) | `MARKS`: k, fam, b (seat), nm, d, ic, and a test function. No version, no repeatable, no reward, no unlock | PARTIAL | engine/ladder.js 160 to 228 | Add version and make the test data. Slice 3 |
| P25 | Eight families: activity, fetter, saboteur, complex, hypercomplex, mask, transformation, integration (s9) | Three families, each with a seat colour: Practice at the root, Ground at the throat, Structure at the heart. DESIGN-gamification adds Cleared, Held, Moved, Closed as awards, designed and not built | CONFLICT | engine/ladder.js 147 to 158; DESIGN-gamification.md 6.2 | A family has an icon family and a colour. Eight need eight, or fold onto seats. Question 4 |
| P26 | Activity achievements: Protocols, Rituals, Journal, Accountability ladders (s10) | First run, Sixty minutes, First story, Ten stories, Seven, Thirty and Ninety days exist. The count ladders 3, 5, 10, 25, 50, 100 do not | PARTIAL | engine/ladder.js 162 to 198 | Add as data once grants exist. Slice 3 |
| P27 | Streak definitions use the canonical accountability engine (s10) | `streakRead` counts days set, not done. Marks read `best`, the strict consecutive run. The page shows `run`, the forgiving one. Every other day for 90 days reads run 45 and best 1 (X8) | CONFLICT | engine/ladder.js 32 to 36, 46 to 75; PRIORITY.md 21.J2; TASKS.md LD3 | Fix 21.J2 first. Marks on days practised. Slice 0, question 6 |
| P28 | Fetter volume: First, 5, 10, 25, 50, 100 (s11) | There are nine fetters. A hundred of them cannot be released. If fetter means address, 100 of 112 is near every address, a count against a total in the person's head | CONFLICT | engine/data/canon.js 291; engine/schema.js 1133 | Question 4. DESIGN-progression 3.1 forbids any completion share over the 112 |
| P29 | Fetter depth: new node, 3 nodes, complete a node, complete a domain (s11) | A first at an address and a first at a seat are recorded. Sweep (every channel at one address) is derivable. Node completion and domain completion are undefined | PARTIAL | ui/release.js 835 to 841; DESIGN-progression.md 2.5 | Slice 3 after the domain word |
| P30 | Saboteur achievements: identified, released, across contexts, integrated (s12) | A saboteur is present or absent in the current reading, with its three addresses. Identified has no first time. Released and integrated have no event | MISSING | engine/compute.js 266 to 297; engine/data/nodes.js 7 | Release of a saboteur's three addresses is derivable from keys. Slice 3 |
| P31 | Complex as a first class entity: detected, mapped, released, resolved, integrated (s13, s18) | A complex is a pair of saboteurs of one family, formed by sort order. Names are stable for a given charge and change when the order does. No id, no state, no history. Snapshots carry only a count | MISSING | engine/compute.js 298 to 310 | Not buildable as a thing until Becoming or Practice defines it. Slice 5 |
| P32 | Hyper complex: same, plus "Root System Resolved" (s14) | Same. A hyper complex is the complexes of one family when there are two, or one running at 6.5 or more. "Root System" is undefined | MISSING | engine/compute.js 311 to 321 | Slice 5 |
| P33 | Mask and character achievements, and never an identity diagnosis (s15) | Six masks, five read, each a seat weight. No reveal, no release, no state. The "never a diagnosis" posture is ruled | MISSING | engine/compute.js 322 to 326; DECISIONS.md 646 to 651 | Posture EXISTS. Entity does not. Slice 5 |
| P34 | Transformation achievements: CQ +1 to +20, then 50, 75, 90, 100 (s16) | Nothing awards a CQ move. CQ is self report. All laws at 10 reads 100 (X13) | CONFLICT | engine/compute.js 388; DESIGN-progression.md 3.2 | Question 3. Slice 5, if at all |
| P35 | CQMilestone: baseline, baselineAt, newHigh, newHighAt, sustained (s16) | No baseline. The first reading is taken while the intake is still being answered, and CQ sums only answered laws, so answering more laws raises CQ with no change in the person | MISSING | engine/compute.js 84, 388; engine/schema.js 253 | Baseline is the first row after `intake.completedAt`, compared only inside one `m`. Slice 5 |
| P36 | Integration achievements: the chain from released to embodied (s17) | None. Nothing records a trigger encountered or a response interrupted. Practice Evidence can carry behavioural evidence and an Outcome, with no writer | MISSING | engine/practice.js 52 to 54 | Slice 5, behind question 8 |
| P37 | Universal state machine, eight states, per entity type (s18) | The Practice build has a different machine (scheduled to completed, missed, skipped). Registration is not causation is ruled: nothing may be inferred resolved from a charge falling | CONFLICT | engine/practice.js 112 to 119; engine/trace.js 49 to 53 | Do not store a state per reading. Slice 5 |
| P38 | UnlockDefinition: capability, knowledge, perspective, with a deterministic trigger (s19) | None. Surfaces are open to every person | MISSING | engine/core.js 160 to 216 | Slice 4 |
| P39 | Transformational unlocks are never bought with points (s19, s36) | True by absence. Plan tier buys supply only | EXISTS | engine/plan.js 21 to 34 | Keep. A gate: no function maps points to an unlock |
| P40 | Capability unlocks: Pattern Map, Complex Map, Integration Tracker, Protocol Customization, Advanced Ritual Builder (s19) | None of the five names is a surface. Nearest: Field and Body, none, none, none, the Ritual builder (open to all) | MISSING | engine/core.js 160 to 216; ui/ritual.js | Question 5 |
| P41 | Knowledge unlocks: Saboteur Library, Complex, Hyper Complex, Mask knowledge (s19, s21) | The Knowledge tab is open to all and its rows follow the person's own reading | PARTIAL | ui/knowledge.js 72, 617, 690 | An unlock here is an introduction, not a gate. Slice 4 |
| P42 | Perspective unlocks: Pattern, System, Mask views, Avatar Comparison, Embodiment View (s19) | Character (masks) and Avatar exist and are open to all. System View, Embodiment View do not exist | PARTIAL | engine/core.js 160 to 216 | Slice 4, behind question 5 |
| P43 | Core unlock rules, e.g. First Complex gives Complex Map, CQ 100 gives CQ Mastery visualization (s20) | Mastery is the top band, 91 and up, and is reachable with no work (X13) | CONFLICT | engine/plan.js 21 to 34; DECISIONS.md 884, 1429; DESIGN-progression.md 4.1 | Question 5 |
| P44 | Knowledge surfaces when the person has context (s21) | Rows are driven by the person's reading. No surfacing on an event | PARTIAL | ui/knowledge.js 72 | Slice 4 |
| P45 | The Turn model is authoritative and a closed circle is one Turn (s23) | The Turn is ruled (TASKS LD1) and designed (DESIGN-ladder). `turnRead` is not in the code. The word is open (LD10) and so is whether it is printed (LD11) | UNVERIFIED | TASKS.md LD1, LD8, LD10, LD11; DESIGN-ladder.md 1 | Build `turnRead` as a pure read. Slice 1, question 11 |
| P46 | `processProgressEvent`: append, evaluate, project, grant once, unlock (s24) | None. The ladder is one read function | MISSING | engine/ladder.js 236 | Slices 1 to 4 as pure functions over the record |
| P47 | Declarative requirements: eventCount, entityState, entityComponentCount, uniqueCount (s25) | Every mark is a JavaScript function over the ledger, the streak and the profile | PARTIAL | engine/ladder.js 158 to 228 | An interpreter for four operators, held equal to the old tests by an equivalence gate. Slice 3 |
| P48 | AchievementEvidence retained, and "Why did I earn this?" (s26) | A mark has a description and no stored evidence. A first has a date and a label. The sound layer remembers which marks it has played, in memory | MISSING | engine/ladder.js 160 to 228; engine/schema.js 1425 | Grants carry event ids and the rule version. Slice 2, UI in slice 6 |
| P49 | Anti farming 2: count unique patterns, nodes, domains (s27.2) | The `ten` and `fifty` marks say addresses and test thought lines. Ten lines at one address earn Ten addresses (X5) | PARTIAL | engine/ladder.js 106, 183 to 190; TASKS.md LD4 | Count distinct addresses from the key. Slice 1 |
| P50 | Anti farming 4: setbacks do not subtract points (s27.4) | There are no points. A mark does un-earn when its state falls (X9, X10) | CONFLICT | engine/ladder.js 236 to 244 | Grants. Slice 2 |
| P51 | Anti farming 5: do not reward near misses (s27.5) | `ladderRead` names one next mark and none beyond. Thresholds are fixed | EXISTS | engine/ladder.js 230 to 244 | Keep |
| P52 | Anti farming 6: achievements do not expire (s27.6, s36) | They vanish on a recompute (X9, X10) | CONFLICT | engine/ladder.js 236 to 244 | Grants. Slice 2 |
| P53 | Anti farming 7 and 8: no leaderboard, no forced competition (s27) | None built. Ruled: "A practitioner panel sorted by coherence is a leaderboard with a licence" | EXISTS | DECISIONS.md 513 to 514, 663 to 667 | Keep |
| P54 | Anti farming 9: points cannot substitute for evidence (s27) | True by absence | EXISTS | n/a | Keep |
| P55 | Anti farming 10: readings do not become XP (s27) | Contradicted by the document's section 7 and 16 (P20, P34) | CONFLICT | s27.10 against s7 | C4 |
| P56 | Rarity targets, six classes (s28) | None. The four reference figures have no source | UNVERIFIED | searched all md and js | Question 9 |
| P57 | API surface, the routes under /v1/progress, /v1/achievements, /v1/unlocks (s29) | The Worker serves auth and billing. No progress route. The app has one network seam and does not sync | MISSING | ui/auth.js 1 to 40; CLAUDE.md "What this project is becoming" | Not before an accounts ruling. Slice 7 |
| P58 | UserProgress: balance, lifetime, achievement and unlock ids, streakState, cqMilestones, eleven counters (s30) | Counters: `ledgerRead` has rituals, minutes, ground, lines, clear, snaps. `streakState` is `streakRead`. The rest are not countable (complexes, masks, integrations) | PARTIAL | engine/ladder.js 84 to 107 | Counters are projections. Slice 1 |
| P59 | Projections rebuildable from the ledger (s31, s38) | The architecture is derive from the record, so a projection is rebuilt by calling the function. Grants cannot be rebuilt once the record changes (that is the point of storing them) | PARTIAL | engine/ladder.js 17 to 20; engine/trace.js 1 to 48 | Say which side of the line each item is on. Slice 2 |
| P60 | A 1,000 person 90 day simulation with five personas (s32, s37 phase 6) | `tools/loopsim.js` and `tools/ritualsim.js` run a weighted 1,000 person ICP panel for 90 days. Different personas. Its own validation fails at this commit | PARTIAL | tools/loopsim.js; C12 | Repair the harness before quoting it. Slice 6 |
| P61 | Anti gaming simulations, six scenarios (s33) | Run on paper against the real data model in section 6. Not a harness | PARTIAL | section 6 | A gate that replays the six against the built engine. Slice 3 |
| P62 | Progress Hub: points, achievements, unlocked, current readings, "Do not combine these into one score" (s34) | The record is drawn by `ladderHtml` on the Compass and on the Ritual page. The Hub puts a reading beside a points total, in capitals | CONFLICT | ui/cone.js 3120 to 3190; ui/ritual.js 1082 | C6. Slice 6 |
| P63 | Achievement card with evidence, unlock card (s34) | A mark prints its icon, name and meaning. No evidence line, no unlock | PARTIAL | ui/cone.js 3175 to 3185 | Slice 6 |
| P64 | Copy rules: sentence case, no all caps, no soft wellness language, no em dashes (house rules) | The document uses all caps labels (FIRST COMPLEX, POINTS) and title case names | CONFLICT | s34 against CLAUDE.md "Voice" | Every string re-cased and run through `check.py`. Slice 6 |
| P65 | Every named thing has an icon, in a family, in a colour (house rules) | Marks have an `ic` path and a seat. Points, grants, unlocks, the eight families have none | MISSING | engine/ladder.js 160 to 228 | Slice 6 |
| P66 | Analytics: activation, time to first achievement, medians, coverage, depth to breadth ratio (s35) | The outbox carries a question, a bug, a rating or feedback and refuses `history`, `meter`, `cq` and `avatar` by name | CONFLICT | engine/outbox.js 28 to 34 | Local counters only until ruled. Question 9 |
| P67 | Never rank people; never imply a total is worth (s36) | No ranking exists. No gate yet reads copy for the second | PARTIAL | tools/terms.py | Add "points", "level", "rank", "score" to the ban set once the word is ruled. Slice 6 |
| P68 | Never manufacture urgency around achievements (s36) | No timer, expiry or season that can be lost. DESIGN-ladder anti design 8 | EXISTS | DESIGN-ladder.md section 4 | Keep. A gate on the unlock card copy |
| P69 | Never treat an inferred complex as a diagnosis (s36) | Copy keeps the clinical correspondence internal and shows a plain line | EXISTS | engine/compute.js 298 to 304 | Keep |
| P70 | Never reward endless repetition over meaningful depth (s36) | A free rerun is unbounded by ruling, and `meter.lines` counts every one | PARTIAL | engine/schema.js 1211 to 1260 | A rerun pays nothing, or one a day an address. Slice 4 |
| P71 | Crisis posture: the product may hide what it sells and never what it measures (DESIGN-progression 4) | `careState` is designed and not in the code (searched atuned_src) | MISSING | DESIGN-progression.md 4.1 to 4.3 | Not in the document. A Hub must obey it. Slice 6 |
| P72 | Phase order and definition of done (s37, s38) | Assessed in section 5 | PARTIAL | section 5 | Re-ordered |

## 3. What the document needs from the other builds

The Practice domain (`engine/practice.js`, built, no writer) and the Trace graph
(`engine/trace.js`, built, no writer) are in this tree at the stamped commit.
The Becoming build is audited in `BECOMING-AUDIT.md` and is not built.

### 3a. The event types of section 5, and who can emit each

DERIVABLE means the facts sit on the record today and a pure function could
return the event. PRACTICE means the Practice build names an event or a
transition that could carry it, once a surface writes `p.practice`. NOTHING means
no emitter exists in any build.

| Event | Source in the code | Verdict | Note |
|---|---|---|---|
| journal.entry.completed | `p.story.entries`, written at the story commit (ui/storyui.js 405 to 412) | DERIVABLE | No qualification rule. One letter 50 times qualifies (X3) |
| journal.day.completed | the same entries, folded by `pracDay` | DERIVABLE | One per day is the natural cap |
| ritual.completed | `p.rituals` entries with a done stamp | DERIVABLE | After 21.J2. Also RITUAL_COMPLETED and PRACTICE_COMPLETED once a surface writes the Practice log |
| protocol.completed | PR_EVENTS has no PROTOCOL_COMPLETED. A protocol is accepted, never finished | PRACTICE | Collides with ritual.completed: the same act pays +5 and +10. Needs a definition |
| protocol.pattern.executed | `meter.unique` keys, and `practiceReleaseVerify` reads them as observed | DERIVABLE | Keys only. A rerun is free and unbounded, so it must not pay |
| accountability.day.completed | the day list in `pracDays` | DERIVABLE | After 21.J2. "Completed" has no definition in the document |
| fetter.released | `meter.firsts` key `addr:N`, dated, once per address | DERIVABLE | A line spoken is not a charge cleared. The word fetter (question 4) |
| node.completed | keys per address, sweep first | DERIVABLE | Not defined by the document. A node is an address here |
| saboteur.identified | present in `r.sabs` now. No first time | NOTHING | Snapshots carry a count only |
| saboteur.released | none | NOTHING | Derivable if defined as all three addresses opened |
| saboteur.integrated | none | NOTHING | |
| complex.detected | `r.cxs` now | NOTHING | No id, no first time |
| complex.mapped | none | NOTHING | No mapping action exists |
| complex.released | none | NOTHING | TASKS 22.K18: "his open question" |
| complex.resolved | none | NOTHING | A fall in charge is not evidence (ui/record.js 11 to 16) |
| complex.integrated | none | NOTHING | |
| hypercomplex.detected | `r.hys` now | NOTHING | |
| hypercomplex.mapped | none | NOTHING | |
| hypercomplex.released | none | NOTHING | |
| hypercomplex.resolved | none | NOTHING | |
| hypercomplex.integrated | none | NOTHING | |
| mask.revealed | the mask ring weights in `compute()` | NOTHING | A weight, not a reveal |
| mask.released | none | NOTHING | |
| character.embodied | the avatar's embodied pin reads three archetypes | NOTHING | A rating, not an event |
| cq.baseline.recorded | first history row after `intake.completedAt` | DERIVABLE | Rows are stamped with the model, compare inside one `m` only |
| cq.milestone.reached | a band or CQ crossing across history rows | DERIVABLE | Allowed as a dated fact only (C4) |
| cq.improvement.verified | none | NOTHING | Nothing verifies a self report |
| turn.closed | four streams all carry a timestamp (TASKS LD2) | DERIVABLE | `turnRead` is not built |
| integration.verified | none | NOTHING | Needs an observation writer |

### 3b. What the Practice build already emits that section 5 has no type for

`engine/practice.js` 61 lists the Practice vocabulary. Section 5 uses none of its names.
Those with a bearing on progress, and what a progress system must do with them:

- PRACTICE_STARTED, PRACTICE_PARTIAL, PRACTICE_INTERRUPTED: a partial is not a
  completion and pays nothing. An interrupted practice pays nothing and costs
  nothing.
- RITUAL_SKIPPED, RITUAL_MISSED: they may never subtract, and they may never be
  classed as low motivation (rule 12, `PR_MOTIVE` refuses the words).
- EVIDENCE_RECORDED, OUTCOME_RECORDED: the only route to integration.verified,
  and only when the outcome has evidence of effect and not only of completion
  (`PR_COMPLETION`).
- PROTOCOL_ADVANCED: depth, if the document defines depth as progression
  through a protocol (the Practice TDD's progression, with regression).
- PATTERN_LINKED: a confirmed link between a story and a pattern, the nearest
  thing to "complex mapped" that exists, at the level of one pattern.

Dependency: `practiceFromLegacy` is deliberately not run on load. Until the
Ritual tab's writer is moved onto PracticeEvents there is one source of ritual
days, `p.rituals`, and the ledger must read that.

### 3c. What the Trace graph gives

It gives relationships, not events. A node carries a type, an id, a source and
`was`, and no time. So it cannot supply an `occurredAt`. It can supply the
evidence drawer ("Why did I earn this?", section 26): walk from the story to the
pattern it supports, to the release that addressed it, to the practice event
that produced the evidence. `traceFromRecord` derives story, pattern, release,
reframe, ritual and practice_event nodes from the record with provenance, and
registration is not causation. Do not put achievements in the graph. They are
grants about the record, not objects in the person's pattern system.

### 3d. What the Becoming build owes

Complex, hyper complex and mask as things with ids and states are not in any
build. `BECOMING-AUDIT.md` R11 records that nothing writes the six values or
the thirty commitments, so the Purpose set mark (`engine/ladder.js` 212) cannot
be earned by use. Integration (section 17) needs an observation writer that no
audited build proposes. Until then the mask, character and integration
families, and the point rows beside them, have nothing under them.

### 3e. What nothing builds

The complex, hyper complex and mask lifecycles. Verification of a CQ change.
Integration. A per entity state store. Definition of "domain". Server side
anything.

## 4. Conflicts with standing rulings

Named, quoted, and not resolved. Each one ends with the owner question that
resolves it.

**C1. Loss of points on a failed accountability.** TDD section 7: "There is no
negative point balance. A setback does not remove previously earned points."
Section 36: "remove earned progress because of setbacks" is forbidden. Against
`TASKS.md` RB9v: "If I fail an accountability I lose points. If I succeed I
gain." which the same block records as reversing "a refusal made earlier
today". The hard line, stated because it is crossed: this product reads
somebody's nervous system, and a loss framed score on a missed day is the
pattern that installs the load the product claims to reduce. The repository's
own model prices declining it at 2.9 percentage points of the weighted thousand
still active at day 30, on a base of 20.7 (DESIGN-gamification.md 6.6, last measured 27 September). The
document wins. Question 1.

**C2. Points buy patterns.** TDD section 7: points are "accumulated verified
activity". Against `TASKS.md` AE1: "Points buy patterns for somebody who will
not pay." AK2: "The coin is karma, for now." AK4: "Achievements and badges pay
karma." RL9: "Karma earned and spent. Blocked on the currency ruling." And
`DESIGN-progression.md` 2.2 rules one currency, patterns, with a build gate
against a second. The
document's own section 30 has `pointsBalance` and `lifetimePoints`, which only
makes sense if something is spent. If points mint supply, the record must not
be the place they are minted, because the record is editable (probes X4, X6,
X7, X11). Minting belongs behind the one network seam. Question 2.

**C3. An immutable ledger on a device the person owns.** Sections 5 and 6:
"immutable event ledger", "append-only". `PRIORITY.md` "Not doing this round":
"the marks are fixed at 21.J2 rather than rebuilt as an event system". The
owner has since reversed the same seat's call on the trace graph, so this is
not settled either way. And `ui/ritual.js` deletes entries by design: "Delete"
on the record and taking back a press (506 to 527, 593 to 596). The Practice
audit raised the same thing as its conflict 2.

**C4. CQ and any reading as a reward.** TDD section 7 pays +1, +5, +10, +15, +20
for CQ moves, and section 16 makes "CQ +1" to "CQ 100" achievements. Section 4
says "CQ ≠ Points". Section 27 rule 10 says "Readings do not become XP".
Section 36 says never "turn CQ into XP". The standing rulings: "Regardless of our
score" (DECISIONS.md 646 to 651, "no surface may imply that a person at a low
reading is further from becoming a better person"), and `ladder.js` 4 to 16, "a
reading is never a score". `DESIGN-progression.md` 3.2: "No first, no marker, no
line of copy anywhere in the system may be of the form 'coherence up ten'."
DESIGN-gamification 6.2 allows a dated band crossing, in either direction, as a
fact. The two designs differ and neither is ruled. Question 3.

**C5. Unlocks that withhold a reading.** TDD section 20: "First Complex, Complex
Map", "First Hyper-Complex, System View", "First Mask, Character / Mask View".
`engine/plan.js` 21 to 34: "SIGHT IS NOT FOR SALE. Ruled. Everybody sees the
whole reading at every tier, free included." `DECISIONS.md` 884 repeats it.
`DECISIONS.md` 1429 then rules the opposite: "Sight by tier is real... the tier
controls how much you can see." TASKS round OE records the first as the ruling
"the pay journey was just built against". `DESIGN-progression.md` 4.1: "the
product may hide what it sells, it may never hide what it measures." Two
rulings disagree before this document adds a third gate. Question 5.

**C6. A points total on the same card as a reading.** Section 34's Hub prints
POINTS 247 above CURRENT READINGS, CQ 74. The standing rule is no count against a
total and "a reading is not a score". A weighted sum is neither an event count
nor a shape. `TASKS.md` LD11 and the karma balance line ask whether a person sees
a balance as a number, and both are open. The Hub also uses all capitals. The
reading lives on Summary and the Field; the record lives where the ladder
already draws it. Question 11.

**C7. The streak.** `DECISIONS.md` 1815: "the accountability tracker is the
progression." `PRACTICE-AUDIT.md` H3 and `BECOMING-AUDIT.md` R87 record that
the Practice and Becoming documents say the metric is change, not streak
length, and BECOMING Q11 asked it. This document inherits the streak as its
consistency dimension and tells the builder to use the canonical engine, which
counts days set (probe X2). Question 6.

**C8. No score of worth, and pay by depth.** Section 7 pays 15 for a saboteur,
30 for a complex, 75 for a hyper complex, 50 for a mask. Those are paid for the
heaviness of what a person carries. `DESIGN-ladder.md` anti design 6: "An award
for getting worse." Measured on the invented roster (`E.PEOPLE`): Gordon (CQ 18) reads 39
saboteurs, 19 complexes, 6 hyper complexes, so he earns the whole family first
and fastest; the members who read no complex (Marcus, Rosa, Wren and
Abraham; probe X15 prints the counts) are shut out of the family, which is `TASKS.md` LD5, "No award family may be
gated on a release run." The roster is invented people, not a population.

**C9. Rarity, and the hard line.** TDD section 28 sets "Rare 1 to 3%" and
"Exceptional <1%" as targets. Section 9 puts `rarityTarget` on the definition.
If a person is ever shown that a mark is held by one percent, it is a scarcity
and a social comparison nudge, both on my list, and `DESIGN-progression.md` 2.5
says "No rarity, no count of how many exist." Tuning thresholds so a mark is
rare is manufacturing scarcity out of the person's work. Question 9.

**C10. Tuning unlock timing, and the hard line.** Section 37 phase 7: "Tune
point values, thresholds, rarity, unlock timing, caps". An unlock that arrives
when return visits are low is a resource drip gating a session, which is on my
list. Unlock timing may be set by the evidence, and by nothing else.

**C11. Words.** `DESIGN-progression.md` 2.1 bans "points, XP, score, level,
badge, achievement, trophy, streak, coin" from every surface, and
`tools/terms.py` does not yet enforce it (searched). The owner himself uses
badge, achievement, points, karma and streak (GM2, AK4, RB9v, the ritual page's
own "Streak" label, ruled one word). One word per concept: the thing the ladder
draws today is called a mark. Question 2.

**C12. The harness under every retention figure fails.** `node tools/loopsim.js`
at this commit: 44 checks passed, 6 failed, "validation failed. report
suppressed." The six: the plan read back on the card, the record on the Ritual
surface, one practice on the card, and three that pin the nine levels. Every
number quoted from DESIGN-gamification in this file is the last recorded one and
was not re-run.

## 5. Build order

Rule under all of it: derive, do not store, except what cannot be derived. That
is what `ladderRead`, `meter.firsts` and the Trace graph already do, and it is
what lets a record that changes under a person never contradict itself. The
document's phase 1 is a stored immutable ledger with idempotency. I recommend
the opposite split. Events are a pure function of the record. Only grants are
stored.

### The ledger, where it lives, what the boundary refuses

Host free, in `atuned_src/engine/progress.js`, after `ladder.js` and `practice.js`
in `MANIFEST` and before `export.js`. No `document`, no `fetch`, no `localStorage`.
`hostfree.py` checks it.

    progressEvents(p)       the derived list. id is type plus the record's own
                            key (traceTimeIds), so the same event is the same id
                            on every call, which is idempotency by construction
    progressGrants(p, now)  the stored set, plus any mark now earned and not
                            yet stored, returned for the host to write
    progressCount(p)        counters. Pure.

Stored, on the profile, one new field and one only:

    p.progress = { v:1, grants:[ { k, at, ev:[eventId...], rule:'ladder.1' } ] }

`k` is the achievement id. `at` is the moment of first sight and is null for a
mark that was already earned when grants started, because dating it today would
claim a date the work did not have. `ev` is the event ids the rule used. A set,
not a list: a second grant for one `k` is refused by name.

What `validateProfile` must refuse, by name and never by clamping:

- an unknown key under `progress`, and `progress` on a record from a build that
  does not know it (today it is dropped with nothing said, probe X11, and that
  is the first thing to fix);
- a grant whose `k` is not in `MARKS` or whose `rule` is a version this build does
  not read, so a mark cannot be invented by editing the file;
- two grants with one `k`, and two firsts with one `k` (probe X6);
- a grant whose evidence ids do not resolve against the record that holds it,
  the same posture as `work.n` against `meter.unique` (engine/schema.js 913 to
  928). A grant for "Thirty days" with no thirty days in `p.rituals` is refused;
- `userId`, `user_id`, `balance`, `points` as a stored field. A total is a
  projection, never a stored number (the document's own section 30 says counters
  are projections);
- a stored date more than a day after the moment of the read (probe X7). Refuse
  new grants on it. For an existing record, ignore the entry in the streak and
  keep the record readable, so one wrong clock never sets a person's record
  aside;
- a ground key that is not `address:channel:line` for an address in the table
  (probes X4, X5), and a count above what the key space can hold.

What stays on the person's side of the line: the boundary cannot stop someone
editing their own file. It can only make forgery cost more than the thing
forged is worth. That is the reason points must not mint supply on this device.

### Slices

Retention figures are the repository's own model on a synthetic ICP panel, last
recorded 27 September and not re-run (C12). They are not shipped game data and
are not promises. Where I estimate and the repository has no figure, I say so.
Sizes are lines of source and gate, my estimate, against `engine/practice.js` at
1,135 lines with 713 of gate as the nearest comparison.

| Slice | What | Needs | Size | Retention, and what it does to the loop |
|---|---|---|---|---|
| 0 | Fix 21.J2: `pracDays` skips an entry with done false, First run reads done entries; the day count ignores a date more than a day ahead; a gate with a set and not done fixture. Boundary: unique firsts by key, ground key shape, `progress` refused by name | Nothing | 60 lines, 25 asserts, engine only | Unestimated. Direction: a displayed run falls for anyone with set and not done days, then stops claiming days nobody did (PRIORITY.md 21.J2). Loop: play and flow become honest |
| 1 | `progress.js`: `progressEvents` for the ten derivable events, `progressCount`, `turnRead`; distinct addresses for breadth; a journal day qualifies on one imprint or more, once a day | Slice 0. The word for a fetter and a domain (question 4) | 300 lines, 40 asserts, engine only | None by itself, nothing is shown. Gate: no event derives from a render |
| 2 | Grants: `p.progress.grants`, the validator above, a backfill with `at: null`, an equivalence gate that the earned list matches the old `ladderRead` on every roster profile | Slice 1 | 150 lines, 30 asserts | Marks stop vanishing. The repository prices deliberate loss framing at a 2.9 percentage point gain and declines it, so an accidental one is a cost I estimate at 0 to 1 point at day 30. My estimate, unmodelled |
| 3 | Marks as data with a version and four operators; the count ladders of section 10 on days practised (TASKS LD3 and LD4); the six anti gaming scenarios as a gate; the Cleared, Held, Moved, Closed awards of DESIGN-gamification only if ruled | Slice 2. Questions 4, 6 | 250 lines, 45 asserts | Day count marks are worth the Diane case: 22 days practised in 90 earns none of Seven, Thirty and Ninety today (TASKS LD3, measured). Unmodelled here |
| 4 | Points as a pure projection, only if ruled in: rates in a versioned table, never stored, never spent, never negative, paid after the fact, reruns pay nothing. Unlocks as introductions | Slice 3. Questions 1, 2, 5 | 90 lines, 20 asserts | Section 7 as a price list shown before the act is an announced reward. The repository measures that at minus 3.4 percentage points at day 30 (DESIGN-gamification 6.3, 27 September). Paid after the fact, shown as a record line, it is not that arm. DESIGN-gamification quotes Deci, Koestner and Ryan 1999, d minus 0.40, as the outside benchmark |
| 5 | Complex, hyper complex, mask, integration, CQ milestones | Entities that do not exist (P31 to P37). Questions 3, 4, 8 | not sizeable until defined | Not estimated. Shut to the calm (C8) until defined by action |
| 6 | UI: the record on one surface, evidence drawer ("Why did I earn this?"), unlock introduction card, copy, icons in rings, `careState` | Slice 2 or 3. Question 11 | 200 lines UI, CSS, `shots.js` both widths, `design.js`, `monitor.js`, `functional.js` | Watch one person who has never seen it. The first ninety seconds, the two minute visit and the twenty minute visit are not in the document |
| 7 | Server mirror, cross device grants, minted supply, aggregate telemetry, practitioner sight, push | An accounts ruling. The Worker has no progress route | Not sized | Not before the fork is built. Records off device mean a controller exists |

Slices 0 to 4 and the engine half of 6 need no backend. Slice 7 and anything
that lets earned work change what a person is granted need accounts.

Definition of done (section 38), re-read against this order: "every reward
originates from a validated event" holds from slice 1; "every unlock has a
deterministic trigger" holds from slice 4; "Complex and Hyper-Complex are first
class entities" cannot hold until slice 5; "the 1,000 person simulation passes"
cannot hold until the harness is repaired (C12).

## 6. Anti gaming, run on paper against the real data model

Section 33's six scenarios and four that the document does not list. IMPOSSIBLE
means the data model refuses it today. BOUNDED means the interface limits it and
the boundary does not. OPEN means nothing stops it. Probe ids are appendix A.

| Scenario | What the real model does | Verdict | Fix |
|---|---|---|---|
| Ritual spam, one ritual many times (s33) | The interface writes one entry per distinct step list per day (ui/ritual.js 284 to 287). Distinct lists are limited only by the 25 practices, so that is not a cap. The boundary accepts 300 entries in one day (X1). Breadth: First run only, run 1, day 1. Depth: nothing to trigger. But a count of entries would reach "100 Rituals" in a day | BOUNDED | A ritual counts once per day, from the day list, not from the entries |
| Journal spam (s33) | 50 entries of the letter x earn First story and Ten stories (X3). Ten entries inside ten minutes earn Ten stories (X3, TASKS LD4). No length, no imprint, no day rule | OPEN | One journal day per day. Qualify on an imprint of one or more. Distinct days for the ten |
| Pattern spam (s33) | A rerun adds to `meter.lines` and never to `meter.unique`, and is free by ruling, so executions rise and unique ground does not. Breadth is safe if counted from firsts. Ten thought lines at one address earn Ten addresses (X5), because the mark counts keys | BOUNDED | Count addresses. A rerun pays nothing |
| Point injection (s33) | No points exist. A pasted record is accepted with 500 junk keys (X4), duplicate firsts (X6), 90 future days (X7). It earns marks and nothing else. Transformational unlocks do not exist yet | OPEN | Harmless while nothing earned is spendable. The reason supply must not be minted on the device |
| CQ oscillation 70, 75, 70, 75 (s33) | CQ is the answered laws over 210. One step on every law moves it 70 to 80 and back (X14). Twelve snapshots alternating 70 and 75 are accepted and earn Ten snapshots (X12). Nothing rewards CQ today, so nothing is farmed. When it does, answering more laws raises CQ with no change in the person (P35) | OPEN | Do not reward CQ (C4). If a band crossing is kept, one dated fact per band, a baseline after the intake is complete, compared only inside one model stamp |
| Achievement replay (s33) | Marks are derived, so the same evidence cannot pay twice. The first of an address is once per key in the engine, and the import path accepts two (X6) | IMPOSSIBLE | The set of grants refuses a duplicate by name. The marks themselves cannot replay |
| Delete and re-add a day | A deleted day takes its mark with it (X9), and re-pressing writes a new stamp. A press on a done day takes it off and the next press puts it on, the same day (ritLog, ritual.js 506 to 527). The release path only ever turns a day on (ritMarkOn, ritual.js 528) | BOUNDED | Id is the plan key plus the day, not the stamp |
| Set the device clock | The interface only marks today and yesterday, relative to the clock. Move the clock a day at a time and 90 days take 90 minutes. Dates ahead are accepted on import (X7) | OPEN | Nothing on a device defends the clock. Harmless without spend |
| Lose a mark by recovering | A fall in one axis un-earns First clearing (X10) | OPEN | Grants, slice 2 |
| Self catch pays (section 17) | Old Response Interrupted and New Response Demonstrated are the person's own report. `TASKS.md` SIG17: "incentivising self catching produces over reporting" (39 of 790 studies) | OPEN | Record them, pay nothing, unlock nothing (question 8) |

## 7. What the document does not say

- **Types it uses and never defines.** `Evidence`, `SubjectType`, `EventSource`,
  `RequirementExpression`, `RarityTarget`, `UnlockPayload`, `AchievementTrigger`,
  `EvidenceTrigger`, the projection engine, and "domain".
- **What a qualifying journal entry is.** Section 8 says "write qualifying
  journal entry". Section 33 says "qualification rules prevent unlimited
  farming". No rule is given.
- **How a protocol and a ritual differ for pay.** Section 7 pays 5 for a ritual
  and 10 for a protocol. In the Practice build a ritual executes a protocol.
- **The first session.** Section 28 has an Onboarding class at 70 to 95 percent
  and names no onboarding achievement. Nothing designs the first ninety seconds
  or what the first mark is.
- **Session shape.** What a two minute visit gives and what a twenty minute one
  gives. Nothing in the document is punished at either, and nothing is designed
  for either.
- **Absence.** Nothing says what the product says, or does not say, after a
  fortnight away. The ladder's rule is that absence is never mentioned and the
  return is marked (DESIGN-ladder anti design 5).
- **A bad month.** The crisis posture of DESIGN-progression 4: counters and
  upsells absent at acute, the person's own record staying. A Hub that prints a
  total at acute breaks it.
- **The observer tap.** TASKS SIG17 is open: the one honest signal the signal
  test collects must not be paid.
- **Per profile or per person.** One browser holds several profiles. A person
  can start a new one and reset everything. The document has `userId` and the
  product has no user.
- **What happens to a grant when the record is imported or undone.** Undo
  restores the reading and leaves the bill (TASKS FB7), so an undone release
  leaves its first and its grant. That agrees with "setbacks do not subtract".

## 8. Questions for the owner

Written for the person who holds the vision. Each quotes the part it is about,
gives the ways it could go with what each costs, and a recommendation. A way he
may not have an answer to is left open and never answered for him.

**1. Does a missed accountability cost points?**
The document: "There is no negative point balance. A setback does not remove
previously earned points." Your own line in the queue: "If I fail an
accountability I lose points. If I succeed I gain."
- A. Never subtract. Cost: the repository's model says the loss framed version
  would hold 2.9 percentage points more of the panel still active at day 30, on
  a base of 20.7. That is the
  price of the hard line, and it is a seventh of the design.
- B. Subtract on a miss. Cost: it installs the load this instrument is meant to
  release, on a person who reads their own nervous system here. I will not ship
  it.
- C. A miss is recorded and asks why (the Practice build's investigate and adapt
  path), and points only ever rise.
Recommendation: A, delivered as C.

**2. Do points exist, what are they called, and can they buy anything?**
The document: "Points are an additive celebration currency." Section 30 carries
both `pointsBalance` and `lifetimePoints`. The queue: "Points buy patterns for
somebody who will not pay", "The coin is karma, for now", and the design
rules one currency, patterns.
- A. No points. The record is marks, firsts and awards, with no sum. Cost: no
  number to watch, which is the point.
- B. Points are a count with no spend, shown after the fact. Cost: a number to
  chase, and a weighted one.
- C. Points or karma are patterns earned, one unit, spent on new ground. Cost:
  the record must not be where they are minted, so it needs the accounts seam
  and a server that signs them.
Recommendation: A for the first build. If you want a coin, C, and not before
accounts.

**3. May a change in CQ earn anything?**
The document pays +1 to +20 for CQ and makes "CQ 100" an achievement, and also
says "CQ is not Points" and "Readings do not become XP". Measured: all 21 laws
answered 10 reads CQ 100, Mastery, with nothing carried.
- A. No. CQ and every band stay readings. Cost: no transformation family.
- B. A dated band crossing, in either direction, as a fact with no points
  (DESIGN-gamification's Moved award). Cost: a person watches a number cross a
  line, and a crossing downward is true and not kind.
- C. Only the part action moves: the lift from releases. Cost: it is real and
  small, about 0.5 of a CQ point per 400 patterns for a law answered 6.
Recommendation: A, with B only if you rule it.

**4. Are complexes, hyper complexes and masks things a person works on, or
readings?**
The document: "A Complex is where saboteurs join. A Hyper-Complex is where
complexes join", with detected, mapped, released, resolved and integrated.
Today they are recomputed from the charge each time and have no id. Also "100
Fetters" when there are nine fetters and 112 addresses, and "unique domains"
when domain is undefined.
- A. Give them identity and state. Cost: a Practice or Becoming build that does
  not exist, and an inferred complex the person can mark. Large.
- B. Award only what a person did to them: the three addresses of a saboteur
  opened, a sweep of a family. Cost: no "resolved". Small. Works for the calm.
- C. Leave the three families out until Becoming defines them.
And one word: is a fetter one of the nine, or any of the 112 addresses?
Recommendation: B, and fetter means address in this system.

**5. May an unlock withhold a reading?**
The document: "First Complex, Complex Map", "First Hyper-Complex, System View".
The code: "SIGHT IS NOT FOR SALE. Ruled." The records: "Sight by tier is real."
Two rulings disagree and this is a third gate.
- A. An unlock is an introduction: a guided first look and the knowledge that
  goes with it, and nothing is withheld. Cost: no gate to want.
- B. Evidence gates sight. Cost: it hides what the product measures, which the
  progression design ruled out, and it stacks on a plan gate.
- C. Plan gates sight only, no evidence gate.
Recommendation: A. And please say which of the two sight rulings stands.

**6. Does the streak count days a ritual was done, and do the day marks count
days practised?**
The document: "Streak definitions must use the canonical accountability
engine." The engine counts days set, not done: thirty days set and none done
earns Thirty days. And "the accountability tracker is the progression."
- A. Done only, day marks on days practised. Cost: some people's displayed run
  falls the day it ships.
- B. Leave it. Cost: the achievement is paid for days nobody did, and a person
  with 22 days practised in 90 earns none of the day marks.
- C. Done only, and the document's own measure (change per unit of practice)
  beside it.
Recommendation: A now, as slice 0.

**7. Is an earned mark kept for ever, even after the state it records has
gone?**
The document: "Achievements do not expire." A mark today vanishes when an axis
falls back or a day is deleted.
- A. Kept, dated, and shown as a fact about a date ("held on 12 March"), never
  as a current state. Cost: a wall of marks about states a person has left, which
  DESIGN-gamification question 8 names as its own cruelty.
- B. Current state only. Cost: a mark is lost with a setback.
- C. Both lines: the kept mark and the current state.
Recommendation: A.

**8. Do integration marks pay anything?**
The document, section 17: "Old Response Interrupted", "New Response
Demonstrated". These are the person reporting on themselves. The queue's SIG17:
"incentivising self catching produces over reporting."
- A. Recorded, never paid, never unlock anything. Cost: no reason to log.
- B. Paid. Cost: the one honest signal becomes a thing to claim.
Recommendation: A.

**9. May a mark's rarity be shown or tuned, and who produces the numbers?**
The document: "Rare 1 to 3%", "Exceptional <1%", and four reference figures from
"the synthetic 1,000-person simulation". No such simulation is in the
repository.
- A. Never shown, never tuned toward. The mark is a fact about the work. Cost:
  none to the person.
- B. Shown. Cost: it turns a person's work into a comparison.
And measurement: the system's own question is whether it deepened engagement.
- C. Local counters only, and watch the first hundred real people.
- D. Opt in aggregate counters through the outbox. Needs a ruling, since the
  outbox refuses `history` and `meter` by name today.
Recommendation: A and C.

**10. What counts, and what does a rerun pay?**
The document: "qualification rules prevent unlimited farming", and "execution
points may accumulate within policy." Reruns are free and unbounded by your
ruling.
- A. One journal day per day, qualified by one imprint. A rerun pays nothing.
- B. A minimum length. Cost: a person writing two true words is refused.
- C. A daily cap on pay.
Recommendation: A.

**11. Where does the record live, is the turn counted as a number, and is the
Hub one card?**
The document's Hub: "POINTS 247, ACHIEVEMENTS 19, UNLOCKED 7, CURRENT READINGS
CQ 74". The queue asks twice whether the turn is printed and where the record
lives.
- A. One surface for the record, the reading stays on Summary and the Field, the
  turn is drawn as four quarters, not printed.
- B. A Hub as drawn. Cost: a reading beside a score.
Recommendation: A.

**12. Does any progress leave the device before sign in?**
The document, section 29: the `/v1/progress`, `/v1/achievements` and `/v1/unlocks` routes. The Worker serves
auth and billing and the app does not sync.
- A. Device only, carried by Export, until the accounts build. Cost: a new device
  starts empty.
- B. Mirror to the account. Cost: a controller exists, with access, deletion and
  breach obligations, and the practitioner question follows.
Recommendation: A.

## Appendix A. The probes

Run from the repo root. Build the engine into a scratch path so the tracked
`engine.js` is untouched, then:

    sh atuned_src/BUILD-engine.sh /tmp/engine.js
    ENGINE=/tmp/engine.js node probe.js

`probe.js`, whole (each line prints one result; "valid false" is a refusal by the
boundary):

    const E=require(process.env.ENGINE||'/tmp/engine.js');
    const DAY=86400000, NOW=Date.UTC(2026,9,1,12,0,0), iso=t=>new Date(t).toISOString();
    const base=()=>JSON.parse(JSON.stringify(E.blankProfile('probe')));
    const via=p=>E.validateProfile(JSON.parse(JSON.stringify(p)));
    const rit=(t,done)=>({t:iso(t),track:'Body',band:'Root',steps:['box'],min:5,when:'',where:'',done:done});
    const ent=(t,text,im)=>({t:iso(t),text:text,imprints:im,bands:{}});
    const show=(id,p,note)=>{const v=via(p); if(!v.ok){console.log(id,'valid false',v.errs.slice(0,2).join('; '));return;}
     const L=E.ladderRead(v.profile,NOW);
     console.log(id,'valid true','marks',L.earned.map(m=>m.k).join(',')||'none','run',L.streak.run,'best',L.streak.best,'days',L.streak.days,'done',L.ledger.done,'ground',L.ledger.ground,note||'');};
    let p;
    p=base(); for(let i=0;i<300;i++)p.rituals.push(rit(NOW-1000*i,false)); show('X1 300 entries, one day, none done',p);
    p=base(); for(let d=0;d<30;d++)p.rituals.push(rit(NOW-d*DAY,false)); show('X2 30 days set, none done',p);
    p=base(); for(let i=0;i<50;i++)p.story.entries.push(ent(NOW-1000*i,'x',0)); show('X3 50 entries of one letter',p);
    p=base(); p.meter.unique=[]; for(let i=0;i<500;i++)p.meter.unique.push('k'+i); show('X4 500 junk ground keys',p);
    p=base(); p.meter.unique=[]; for(let i=0;i<10;i++)p.meter.unique.push('4:Rlimit:'+i); show('X5 ten keys, one address',p);
    p=base(); p.meter.firsts=[{k:'addr:4',t:iso(NOW),nm:'a'},{k:'addr:4',t:iso(NOW+1000),nm:'b'}];
     {const v=via(p); console.log('X6 duplicate first','valid',v.ok,'kept',v.ok&&v.profile.meter.firsts.length);}
    p=base(); for(let d=1;d<=90;d++)p.rituals.push(rit(NOW+d*DAY,true)); show('X7 90 days dated in the future',p);
    p=base(); for(let d=0;d<90;d+=2)p.rituals.push(rit(NOW-d*DAY,true)); show('X8 every other day for 90 days',p);
    p=base(); for(let d=0;d<30;d++)p.rituals.push(rit(NOW-d*DAY,true));
     {const a=E.ladderRead(p,NOW).earned.map(m=>m.k).join(','); p.rituals.splice(10,1); console.log('X9 one entry deleted from 30','before',a,'after',E.ladderRead(p,NOW).earned.map(m=>m.k).join(','));}
    p=base(); p.axes.Fear={held:0,opp:5}; {const a=E.ladderRead(p,NOW).earned.map(m=>m.k).join(','); p.axes.Fear={held:0,opp:2};
     console.log('X10 an axis falls back','before',a,'after',E.ladderRead(p,NOW).earned.map(m=>m.k).join(',')||'none');}
    p=base(); p.progress={points:99999}; {const v=via(p); console.log('X11 unknown top level key progress','valid',v.ok,'kept',!!(v.profile&&v.profile.progress));}
    p=base(); for(let i=0;i<12;i++){p.history.push({t:iso(NOW-i*1000),m:E.CQ_MODEL,cq:70+(i%2)*5,dq:0,sq:0,pole:0,jq:0,rad:0,loaded:0,sab:0,cx:0,hy:0,ch:0,dark:'Heart',tier:'Practicing',arch:''});}
     show('X12 twelve snapshots, cq 70 and 75 alternating',p,'series '+(E.seriesRead(via(p).profile,'quarter',NOW).pts.map(x=>x.cq).join(',')));
    const S=E.S; const set=(held,law)=>{S.doms=[0];S.arcs=[0,1];S.roots=[];E.buildSoul();
     E.CHARGES.forEach(c=>{S.charge[c]=held;S.replace[c]=0;}); E.SINAMES.forEach(l=>{S.law[l]=law;E.LAW_UNSET[l]=false;}); return E.compute();};
    console.log('X13 all 21 laws answered 10, nothing carried: CQ',set(0,10).CQ,'complexes',set(0,10).cxs.length);
    const a=set(0,7).CQ,b=set(0,8).CQ,c=set(0,7).CQ; console.log('X14 one answer step 7,8,7 on every law: CQ',a,b,c);
    const R=require(require('path').resolve('proto/ladder/roster.js')); let n=0,cx=0,hy=0,sab=0;
    E.PEOPLE.forEach(per=>{const r=R.loadPerson(E,per); n++; if(r.sabs.length)sab++; if(r.cxs.length)cx++; if(r.hys.length)hy++;});
    console.log('X15 roster of',n,'with a saboteur',sab,'with a complex',cx,'with a hyper complex',hy);

Output at 2dd3823, in full:

    X1 300 entries, one day, none done valid true marks first run 1 best 1 days 1 done 0 ground 0
    X2 30 days set, none done valid true marks first,week,month run 30 best 30 days 30 done 0 ground 0
    X3 50 entries of one letter valid true marks told,kept run 0 best 0 days 0 done 0 ground 0
    X4 500 junk ground keys valid true marks ten,fifty run 0 best 0 days 0 done 0 ground 500
    X5 ten keys, one address valid true marks ten run 0 best 0 days 0 done 0 ground 10
    X6 duplicate first valid true kept 2
    X7 90 days dated in the future valid true marks first,week,month,season,hour run 90 best 90 days 90 done 90 ground 0
    X8 every other day for 90 days valid true marks first,hour run 45 best 1 days 45 done 45 ground 0
    X9 one entry deleted from 30 before first,week,month,hour after first,week,hour
    X10 an axis falls back before turned after none
    X11 unknown top level key progress valid true kept false
    X12 twelve snapshots, cq 70 and 75 alternating valid true marks watched run 0 best 0 days 0 done 0 ground 0 series 75,70,75,70,75,70,75,70,75,70,75,70
    X13 all 21 laws answered 10, nothing carried: CQ 100 complexes 0
    X14 one answer step 7,8,7 on every law: CQ 70 80 70
    X15 roster of 14 with a saboteur 12 with a complex 10 with a hyper complex 10

The sizes of the tables the requirement rows quote (nine fetters, the address
table, the saboteur libraries, the hyper complex families, the masks, the
roster) are read off the build, not typed:

    node -e "const E=require('/tmp/engine.js');for(const k of ['CHILD','NODES','SAB_LIB','SAB33','HCX_LIB','MASKS','MASKS_READ','PEOPLE','PRACTICE','MARKS'])console.log(k,E[k].length)"

The lift arithmetic in question 3 is `engine/compute.js` 150 to 151:
`10 - (10 - answer) x (1 - 0.00077)^n`. At an answer of 6 and n of 400 that is
10 - 4 x 0.735 = 1.06 on one law, which is 0.5 of a CQ point (1.06 over 210,
times 100).

Run the count commands in "How the statuses are counted" for the tallies. Not
typed here on purpose.
