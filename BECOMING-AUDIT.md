# Becoming audit

`ATUNED-becoming-system-TDD.md` read against the real code, for the Avatar page
redesign. Written as the document's own sections 2 and 42 ask: every requirement
classified as exactly one of EXISTS, PARTIAL, MISSING, CONFLICT or UNVERIFIED,
with the file and line, the data model, the dependencies, the change, the
migration and the tests.

    measured at       80c11de, clean tree, 1 October 2026
    read directly     atuned_src/engine/avatar.js, schema.js, sniff.js, sourceai.js,
                      verp.js, ladder.js, plan.js, outbox.js, core.js;
                      atuned_src/ui/avatarui.js (whole), ritual.js, drills.js,
                      account.js, panels.js, release.js, storyui.js, cone.js
    probed in node    the committed engine.js, last rebuilt at 1da7e1e, and no
                      file under atuned_src/engine has changed since, so the
                      probes in section 9 read the same engine the source builds
    not run           any browser gate. Nothing below makes a claim about pixels

The Practice, ritual, accountability and trace graph TDD
(`ATUNED-practice-ritual-accountability-trace-graph-TDD.md`) is being built in
other worktrees, as `engine/practice.js` and `engine/trace.js`, not merged. Its
sections repeat in this document's sections 20 to 28. They are not audited
again here. Where the Becoming document copies them, section 6 below names what
differs. Where the Becoming document adds to them, the row says so.

---

## 1. Read this first

The findings that change what gets built. The rest of the file is evidence.

- **The document assumes five things that do not exist.** A Trace Graph, a Value
  ontology, an AI Handshake, a Pattern confirmation model and an Evidence model.
  Section 4 lists what the code has instead. The Trace Graph and the Evidence
  model are being built by the Practice builds. The other three have no builder.
- **Purpose is derived and never entered, by ruling, and the document types it.**
  `DECISIONS.md:459` "Six values in, three readings out, and a person may type
  none of the three." The document's Purpose schema stores `material.purpose`,
  `spiritual.purpose` and `unified.purpose` as sentences. That is a direct
  conflict (R12, owner question 2).
- **The page the document describes already has most of its data, and nobody can
  write it.** Nothing in `atuned_src/ui/` writes `purpose.soul`, `purpose.ego`
  or `purpose.sides`. The six values and the thirty commitments are validated,
  stored, exported and read, and the only way to fill them is to paste a record.
  The "Purpose set" mark (`engine/ladder.js:212`) cannot be earned by using the
  product (R11).
- **The Avatar page's own data does not travel with the record.** Archetype
  ratings, the starting weight that percent complete is measured from, tags and
  the daily rules live under `atuned-avatar-side`, outside the record, and an
  export drops them. Ritual plans live under `atuned-ritual-active` for the same
  reason. The document's section 32 assumes the versioned record holds it all
  (R08, R43).
- **The sniffer does not read behaviour.** The document's own evidence sentence,
  "I stated the concern directly.", reads as nothing. "I avoided telling them
  what I actually wanted." reads as nothing at the sniffer's core path and
  scores one cue at the gates. The end to end scenario in the document's
  section 37 cannot produce its candidate "avoidance" from this sniffer
  (section 9, R90).
- **Five of the document's words already mean something else in the product,**
  Pattern, Integrity, Regulation, Protocol and Trace. A second meaning in the
  same product is the defect `CLAUDE.md` calls one word per concept (R36, R49,
  R53, R39, R61 and section 7).
- **An additive field added under the current schema version is dropped silently
  by an older build.** `validateProfile` rebuilds the record from the fields it
  names and has no closed key set at the top level. A new key written by a new
  build and imported into the build before it disappears with no refusal. A
  version bump turns that silence into a named refusal, and the raw record is
  kept. That is the real argument for or against a bump, and it is the owner's
  call (owner question 9).

---

## 2. How the counts are read

Statuses are counted off the matrix in section 3, never typed. Run this from the
repository root:

    awk -F'|' '/^\| R[0-9]+ /{gsub(/ /,"",$4); c[$4]++} END{for(k in c)print k, c[k]}' BECOMING-AUDIT.md | sort

Rows are `R` followed by digits in the first column. Status is the third column
and is one of the five words, alone. Anything that qualifies a status is in the
other columns.

Slices are `S1` onward and are defined in section 11. Owner questions are `Q1`
onward, section 12. Technical questions for the Practice and Trace builds are
`T1` onward, section 11b.

**Legend.** EXISTS means code runs it today. PARTIAL means part of the
requirement runs, or the data model is there and no surface writes it. MISSING
means nothing in `atuned_src/` does it. CONFLICT means the document asks for
something a standing ruling, the code's own contract or the document itself
contradicts. UNVERIFIED means it lives somewhere this audit could not read.

---

## 3. The matrix

### A. Avatar (document sections 3 and 6)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R01 | The Avatar is the intended identity, user owned, and AI never silently invents it (3, 6.1) | PARTIAL | `engine/avatar.js:18-31`; `ui/avatarui.js:1747` avSeatAdd writes only what the person typed; no model exists, `ui/storyui.js:471` "Scripted. No model is called." | `avatar {built, at, reviewedAt, pairs[{be, notbe, seat?}]}` | none | Keep. When a suggestion path exists it goes through the epistemic labels of S5 and never writes the avatar | none | engine: no code path writes `avatar.pairs` except the person's add and edit; functional: add, edit and take off each report through `status()` |
| R02 | The Avatar record carries id, name, title, description, version, status, created and updated (6.2) | MISSING | blank at `engine/avatar.js:18-20`; the boundary rebuilds it from four names at `engine/schema.js:947-991` | none of the six | S2, Q9 | Additive: name, title, description as bounded strings, version as an integer, status. Do not add `user_id`: the profile id already owns the record and a second owner key inside it is two truths. The boundary changes in the same commit or the new fields are dropped on the next load | an older record has none: filled from the blank, status derived from `built` | engine: blank fill; export then import round trip; refusal by name for a wrong type and for an unknown status; an older fixture loads unchanged |
| R03 | Becoming categories: qualities, values, beliefs, behaviors, communication, relationships, embodiment, contribution (6.2) | CONFLICT | `engine/avatar.js:21-27` "A PAIR IS WRITTEN AS A PAIR... a value has no address"; `ui/avatarui.js:153-160` the seven areas, `187-222` the prompts | one `be` sentence per pair, one pair per seat, half a pair refused | Q1 | Not built until Q1. If seat stays the page's axis, the eight categories become an optional `kind` on a pair, or a filter, and never a storage structure | `kind` absent reads as unclassified | engine: `kind` refused by name when not one of the eight; older pairs unchanged |
| R04 | Not-becoming categories: qualities, beliefs, behaviors, patterns, conditions (6.2) | CONFLICT | `ui/avatarui.js:924-930` labels the line "To release"; `AV_ASK.Root.notbe` is "I lie awake scared about money and my legs will not keep still." | `notbe` is a present tense bad day sentence that the sniffer reads and commits to the journal (`avatarui.js:1760-1777`) | Q1 | Settle what the second line means first. The document's "who I am not becoming" is a refusal. The code's `notbe` is what is in the way now | none until decided | none until decided |
| R05 | Avatar versioning and review (6.2, 33) | PARTIAL | `engine/avatar.js:15-36` AV_MONTH, avatarDue, avatarDaysLeft; called only at `ui/drills.js:1075-1076`; nothing on the Avatar tab calls them | `at`, `reviewedAt`; no earlier avatars kept | S2 | Surface the monthly review on the Avatar tab. Add `version`, incremented only on a person confirmed revise. Whether earlier text is kept is a TD call: snapshots already carry history, a `revisions` list is a second place | additive; an older record reads version 1 | engine: version moves only on confirmed revise; `reviewedAt` moves; due and not due |
| R06 | Avatar states DRAFT, DEFINED, ACTIVE, EVOLVING, INTEGRATED (31) against draft, active, archived (6.2) | CONFLICT | the document contradicts itself; the code has the boolean `built` | `built` | S2 | One vocabulary. Stored: draft, active, archived, a declared fact. Evolving and integrated are readings, derived, never stored | `built:true` reads as active, `built:false` as draft | as R02 |
| R07 | Avatar as sniffer input with elevated relevance (6.3) | PARTIAL | the release line already goes through `applyStory` at full weight and is committed as a journal entry (`avatarui.js:1760-1777`); `avHeard` `357-373`; no avatar argument reaches `parseStory` `engine/sniff.js:479` or `sniffStory` `1311` | none | S5 | A pure function that takes entry text, avatar, boundary and prior entry counts and returns link candidates with a rationale made of counts. Weights in a table, with the reason kept beside each | none | engine: direct match; weak echo; negation guard `srcNegated`; empty avatar returns nothing; every candidate has a rationale; weights read from the table and changed in a test |
| R08 | Avatar data lives in the versioned record (32, invariant 10 round trip) | CONFLICT | `ui/avatarui.js:149` AV_KEY, `268-305` avSide and avSideWrite; `ui/avatarui.js:57-60` says the ratings and weights "survive a reload and do not travel with an export" | outside the record: `arch` per archetype 1 to 5, `load0` per pair keyed by the pair's own text, `rule` per seat, `tags` per seat | S1, S2, Q9 | Move `arch`, `load0` and `tags` onto the record, keyed by pair id once S2 gives pairs one. `rule` waits for S7, where it becomes a ritual step | on first load, read the side key once, write the record, leave the side key in place so the old path still works | engine: export then import keeps all four; the side key is read only when the record has none; round trip invariant for every moved field |
| R09 | Weighting ladder: avatar, confirmed pattern, strong behavioural evidence, repeated contextual evidence, AI inference, generic association (6.3) | MISSING | no confirmed pattern, behavioural evidence or AI inference exists to rank | none | S5 now, S10 later | The ladder as a named table. Rungs whose source does not exist yet stay inactive and say so. Each active rung has a unit test | none | engine |

### B. Purpose (document sections 7 and 8)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R10 | Two triangles, three values each; downward material and ego, upward spiritual and universal (7) | PARTIAL | `engine/avatar.js:44-93` soul is the upward three, ego the downward three, PUR_SOUL and PUR_EGO; validated at `engine/schema.js:992-1002`; read only drill at `ui/drills.js:1114-1156` | `purpose {soul[3], ego[3], sides}`, strings under 120 | S3 | The geometry and the ruling already match the document. No surface writes the six values. Add the write path. Over length is currently replaced by an empty string without a word (`schema.js:1000-1002`): refuse by name instead | none | engine: over length refused by name; functional: write six, reload, round trip |
| R11 | A way to write the six values and the thirty commitments | MISSING | searched `ui/` and `engine/` for any writer of `purpose.soul`, `.ego`, `.sides`: none. The profile sheet's "Open the avatar" (`ui/panels.js:983`) opens the read only drill. The drill says "The journal asks for it in two questions" (`ui/drills.js:1071`); no journal prompt asks them (searched for "best day": only the drill's own text). The "Purpose set" mark (`engine/ladder.js:212`) is unreachable by use | strings only | S3 | The writer. Free text per the standing ruling; no ontology in the first cut | none | functional: the mark earns when six are written; the drill's promise is corrected or removed |
| R12 | Material Purpose, Spiritual Purpose and Unified Purpose as typed sentences (7.1, 7.2, 8, 8.1) | CONFLICT | `DECISIONS.md:459-478`; `engine/avatar.js:44-67, 83-93` purposeCentre and purposeRead derive the readings; `engine/schema.js:86-88` "nothing derived is stored, because a derived value that is also stored is one that can drift"; `tests/engine.js` group 24 "PURPOSE IS DERIVED AND NEVER ENTERED" | derived on read, nothing stored | Q2 | Do not store a typed purpose until the owner amends the ruling. If amended, the person's own sentence sits beside the derived reading and never replaces it | additive optional strings | engine: derived reading unchanged; a typed sentence over its cap is refused, never cut |
| R13 | Values as `value_id` references into a Value ontology; "use the existing Atüned Value ontology if available" (8.1) | MISSING | none exists. Four tables could be mistaken for one: the 21 laws `SI` (`engine/data/canon.js`), the ten expression values `EXPR` (`engine/data/practice.js:6-10`), the nine replacement states `CHILD[].opp`, the eight compass axes with poles `MIRROR` (`engine/data/compass.js`) | free text | Q3 | No invented ids. Until Q3 a value is its own text | if an ontology arrives: exact match text to id, unmatched stays text | engine: no key appears in two tables; match rules |
| R14 | Purpose carries id, avatar_id, version and timestamps (8.1) | MISSING | `engine/avatar.js:73-75` | none | S2, S3 | One purpose per profile, so `avatar_id` is implied and not stored. Add `version` and `updated` only | additive | engine round trip |

### C. Boundary (document section 9)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R15 | Six domains, five non-negotiables each, count configurable (9) | PARTIAL | `engine/avatar.js:69-70` PUR_SIDES and PUR_PER_SIDE, `95-104` boundaryCount; a sixth entry on a side is refused by name at `engine/schema.js:1008-1010`; counts only on screen at `ui/drills.js:1148-1159` | `purpose.sides[side]` list of strings under 200, at most five | S3 | The count is one constant read by boundary and drill. No write path (R11) | none | engine: refused by name at one past the cap; changing the constant moves boundary and surface together |
| R16 | Domain names self, relationship, family, friends, work, community | CONFLICT | stored keys are partner, family, friends, community, coworkers, alone: `engine/avatar.js:69`; `DECISIONS.md:479-482` | stored keys | Q4 | Stored keys never rename. A label map is enough. A rename is read by an older build as no commitments at all, because it reads only the sides it knows (`schema.js:1004`) | label map only, no data migration | engine: the map covers all six both ways; a gate fails when a key is added without a label |
| R17 | Boundary as its own object with id, user_id, purpose_id, version, status (9.2) | CONFLICT | boundary is stored inside purpose (`purpose.sides`): the record key named `purpose` holds boundary data (`schema.js:86-89`) | nested | S4 | Keep the storage. Expose Boundary as a read model. Moving it renames a persisted key | none | engine: read model equals stored sides |
| R18 | Boundary geometry, six facets, each exposing its non-negotiables (9.1, 29 layer C) | MISSING | no hexagon is drawn anywhere. "The Boundary overlay on it is held to the backlog by his own words (JQ)" (`DECISIONS.md:2218`, about the Compass) | none | S8 | Section 13, the brief | none | monitor: renders on a blank and a loaded profile at 1600 and 390 |
| R19 | Boundary signals from the journal (11) | PARTIAL | `engine/avatar.js:105-117` boundaryCross names the side an entry lands on; exported at `engine/export.js:29`; no caller in `ui/` | none | S5 | Call it from the read model. It resolves only a named person: "wife", "boss". "them" resolves to nothing (measured, section 9) | none | engine: each side's words; null on no match |

### D. Non-negotiables (document section 10)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R20 | NonNegotiable object: statement, behavior, priority, state, evidence_ids, violation_ids | MISSING | commitments are bare strings with no id (`engine/schema.js:1011-1013`) | strings | S4, Q9 | New object with a stable id. Existing strings get ids on first load. Keep `purpose.sides` as a projection so an older build still reads thirty commitments: a stored derived value, named, tested, and the owner's schema call | each string becomes `{id, side, statement}`, array order as the default order | engine: ids survive save and load; projection equals statements; a statement over its cap is refused, not cut |
| R21 | States defined, active, tested, established; established requires evidence (10, 10.1) | MISSING | no evidence model | none | Q5, S10 | Store only what the person declares: defined, active, paused. Derive tested and established from evidence on read. Storing `state` beside `evidence_ids` is two truths | none | engine: derived state moves when evidence moves; no stored value can claim established |
| R22 | `evidence_ids` and `violation_ids` on a non-negotiable | MISSING | no ids exist on entries or on evidence | none | S10, Practice build | Reference by stable id. A violation is evidence of type negative (document section 22) | none | engine |
| R23 | Priority integer inside a domain | MISSING | order is array order | none | S4 | Priority is the order. Do not store both | none | engine |
| R24 | AI may suggest language, never silently establish a boundary (10) | PARTIAL | no AI path; Source AI is scripted (`engine/sourceai.js`); enforced by absence | none | S5, S16 | Epistemic label on every suggestion; a test that no suggestion writes sides | none | engine |

### E. Journal (document section 11)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R25 | Journal entries as an intelligence input | PARTIAL | commit at `ui/storyui.js:351` stCommit; entry keys `t, text, imprints, bands, lex, asked` (`engine/schema.js` ENT_KEYS); `sniffStory` computes laws, gates, lean, saboteurs and offer but is called only by `ui/tutorial.js:187`, never by the Story commit | `story.entries[]` | S5 | A commit yields charge at seats and a lexicon stamp. The rest of `sniffStory` is computed on demand by the read model and stored nowhere | none | engine |
| R26 | An entry has a stable id, so evidence and journal_event nodes can point at it | MISSING | entries have no id; `atomIndex` keys by array position (`ui/wheel.js:230`). Committed entries are never deleted (T2, `TASKS.md` round NS), so position is stable in practice | none | S2, T6 | Mint an id. ENT_KEYS is a closed set, so the boundary changes in the same commit | existing entries get an id on first load, written once | engine: unique, stable across export and import |
| R27 | Outputs of an entry: observations, behaviors, emotions, beliefs, decisions, context, boundary signals, integrity signals, pattern candidates, evidence (11) | PARTIAL | emotions as charge: `parseStory`; integrity signals as law violations: `sniffLaws` `engine/sniff.js:1112`; empathy and accountability lean: `engine/verp.js:437` leanScan; avoidance as the averse gate: VERPCUE; boundary side: R19. Behaviours, beliefs, decisions, context: nothing | none stored | S5, S14, Q12 | Compute on read; store nothing derived. New cues only if Q12 says so | none | engine |
| R28 | AI interpretations never become facts; confirmation, corroboration, repetition or an existing relationship, by type (11) | MISSING | the only confirmation in the product is pressing Commit on a read before charge lands, with undo (`stCommit`, `engine/undo.js`) | none | S6 | A decision store: the person confirms or rejects a link, dated | additive | engine |

### F. Sniffer (document section 12)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R29 | The sniffer inspects avatar, purpose, boundary, non-negotiables, journal, practice events, evidence, patterns, ritual history, integrity, context and regulation | PARTIAL | `engine/sniff.js` reads text only; `engine/sourceai.js:123` srcHear reads text and prior bands | none | S5 | A pure function in a new engine file, placed after `sniff.js` and `sourceai.js` in MANIFEST. Do not grow `sniff.js`, which is lexicon arithmetic | none | hostfree gate in BUILD-engine.sh; engine group |
| R30 | Signal: recurrence | EXISTS | `engine/sourceai.js:102` srcPrior, `111` srcRung | a count ladder, rung 7 to 10 | none | Reuse as the recurrence input | none | existing groups |
| R31 | Signals: contradiction, boundary conflict, identity conflict, behavioural repetition, context transfer, context failure, successful alignment, pattern reduction, emerging pattern | MISSING | `parseStory` reads no negation on its core path (`AUDIT-source-tdd-v3.md` section 1); behaviour sentences read as nothing (section 9) | none | S5 in part, S14, S10 | A signal is built only when its input exists. The rest return unread with the reason, the way `sniffFlow` returns its two unread lenses, never a clean reading | none | engine: every unreadable signal returns unread and a reason |
| R32 | Pattern activation and reduction | PARTIAL | `ui/wheel.js:1067` hotTrack keeps the direction of the last real change; used by `avRunning` (`ui/avatarui.js:428-443`) | loading, releasing or steady, in memory | S5 | Reuse; promote the reading to the engine only if S5 needs it | none | functional |
| R33 | Pipeline: parse, extract, classify, match against the user model, weight, search the graph, candidates, confidence, user confirmation, update graph, propose (12.1) | PARTIAL | first stages exist: `scanStory` `engine/sniff.js:293`, `parseStory` `479` | none | S5, S6, S12 | Stages after classify are S5, S6 and S12 | none | engine |
| R34 | `sniff()` returns relevance, recurrence, evidence_strength, avatar_weight, boundary_weight, contextual_weight, recent_activation, historical_persistence and a rationale (12.2) | CONFLICT | named confidence bands were measured and rejected as a label that lies when uncalibrated (`AUDIT-source-tdd-v3.md` section 1); the product's posture is a count a person can check (`engine/sourceai.js` header: "Every rung is a count a person could check"). `sniffSaboteurs` does return a confidence and a because | confidence and because on saboteur rows | S5 | Return the counts and the rungs that fired. No blended score, no confidence shown to the person | none | engine: the output lists which rungs fired |

### G. Pattern (document sections 13 and 31)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R35 | PatternCandidate object (13) | MISSING | none; the nearest rows with a because are `sniffSaboteurs` and `sniffAxes` | none | S5, S6 | Computed on read. Only the person's decision is stored | additive | engine |
| R36 | What a Pattern is (13, 24.1, 31) | CONFLICT | "pattern" already means the address or fetter (GLOSS "Fetter", 112), the billed unit ("One pattern is one sentence", `DECISIONS.md`), a saboteur (GLOSS "Saboteur": "One of 33 named patterns"), and, in the owner's own words, a domain or archetype (`DESIGN-pattern-signal.md`: "Architect... Nature... Sage") | several | Q8 | A candidate's target is typed: `{kind: fetter or saboteur or address or domain, id}`, pointing at an existing table. The document's examples "avoidance", "people-pleasing" map to the Avoider and the Pleaser saboteurs, not to new names | none | engine |
| R37 | The existing Pattern confirmation model (13) | MISSING | none exists | none | S6 | Define it small: confirm or reject by the person, with a date | additive | engine |
| R38 | Pattern states candidate, confirmed, active, reducing, inactive, resolved or replaced (31) against proposed, confirmed, rejected (13) | CONFLICT | the document contradicts itself. "Resolved" is also an open ruling: "Released" against "Run complete" (`DECISIONS.md`, open block) | hotTrack direction, in memory | Q8 | Stored: the decision only. Active and reducing are derived from hotTrack | none | engine |

### H. Protocol, release and reframe (document sections 14 and 15)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R39 | Protocol object (14) | MISSING | in the product "protocol" is the release protocol, the run (`ui/release.js` header) | none | Practice build | Wait for `engine/practice.js` Protocol; do not define a second one | none | engine |
| R40 | Protocol classes RELEASE, REFRAME, BEHAVIORAL_CONDITIONING, INTEGRITY_CONDITIONING, EMBODIMENT, OBSERVATION, CUSTOM | CONFLICT | the Practice TDD section 6 names ten classes (release, behavior, integrity, communication, body, attention, relationship, goal, presence, custom); section 6 below | none | Practice build | One enum, owned by the Practice build. Becoming supplies a mapping, not a list | none | engine |
| R41 | Release integration; no second release session, pattern, event, queue or verification (15) | PARTIAL | the door exists: `relPick(nodeIds)` `ui/release.js:230`, already called from the Avatar page (`ui/avatarui.js:1690`); the session is `RUN` (`release.js:154`); `RUN.log` is memory only (`REVIEW-architecture-schema.md`); what persists is the meter counters and dated firsts. A persisted Release Event, Queue or verification does not exist | `meter {lines, unique, firsts, relLines, truthLines}` | Practice build | Resolve a confirmed target to address ids and call `relPick`. Do not build a second session. The document assumes persisted release objects; there are none | none | functional |
| R42 | Reframe system (2, 14) | PARTIAL | reframe is the second mechanic inside every release: the `truth` phase of `CHAN`, and `relCoolDown` installs the opposite at 62 percent (`ui/release.js` header, `705`); `truthLines` counts it | counter only | S5 | Do not model REFRAME as a separate protocol class unless the owner rules it | none | engine |

### I. Ritual and practice elements (document sections 16 and 17)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R43 | Ritual object with avatar_id, protocol_id, domain, chakra, elements, cadence, duration, active (16.1) | PARTIAL | log rows `engine/schema.js:637` vRitual, RIT_KEYS `501`; plans beside the record, `ui/ritual.js:171-228` | log row `{t, track, band, steps[], min, when, where, done}`; plan `{id, steps, from, days, stop, on, tm, tags, rel, tc, band, track, when, where}`, outside the record and outside the export | Practice build; `PRIORITY.md` 19.C5 moves plans onto the record | Add the avatar link as an optional field on the Practice build's Ritual. No second ritual writer | plans move in the Practice build | engine, functional |
| R44 | RitualElement with six types, targets and an evidence flag (16.2) | CONFLICT | existing steps are `PRACTICE` keys, four tracks Mind, Body, Energy, Somatic (`engine/data/practice.js`, PTRACK); Practice TDD section 7 names eight step types; this document names six | step keys | Practice build | One step vocabulary, owned by the Practice build | none | engine |
| R45 | Rituals connect to avatar, purpose, value, boundary, non-negotiable, pattern, protocol, chakra, practice event (16) | PARTIAL | ritual to seat: `band` and a closed set of seven tags (TG4) EXIST; ritual to a release address: `plan.rel` EXISTS; avatar pair to a held address: `ritBecoming` `ui/ritual.js:622` EXISTS; teacher practice: `tc` EXISTS. Value, boundary, non-negotiable, pattern, protocol, practice event: none | see R43 | S7 | Optional `targets` on the ritual, by stable id | additive | engine |
| R46 | Coloured ticks per chakra, one per ritual element, clickable, with a navigation chain from avatar to practice (17) | PARTIAL | the page already draws ticks: 72 ring ticks `ui/avatarui.js:656`, a story tick per seat, day dashes `avs-days` `1015`, cycle rings `1141-1155`. Ritual rows are coloured by track, four colours (`PTRACK`), not six types; a press on a ritual row toggles the queue (`data-avrit`), it does not navigate | none | S7, S8 | Six type colours are a design ruling, section 13. No new hues without the art director | none | monitor |
| R47 | One writer of a daily practice; the affirmation lives inside the ritual (content chain, `PRIORITY.md` T5) | CONFLICT | the Avatar page keeps its own "Release, once a day" and "Say it, once a day" rules, days in `AV_KEY` `rule.done`, never in `CURP.rituals` (`ui/avatarui.js:1000-1025, 1828-1851`); `PRIORITY.md` 21.J3 records the duplicate and T5 asks to confirm the merge. The document's section 16 would add a third place | `rule {k, days, from, done[]}` per seat | S7, Practice build step type affirmation | The Avatar rules become ritual steps and the page writes through the ritual writer | `rule.done` days become done entries, once, idempotent | engine, functional |
| R48 | Ritual completion is not transformation (3, 40.19) | EXISTS | ruled T1 option A (`TASKS.md` round NS): a completed ritual moves its own progress, never a seat's charge; `avCycles` `ui/avatarui.js:332` reads practised days | none | none | Keep. Test that no ritual write reaches the charge arithmetic | none | engine |

### J. Regulation (document section 18)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R49 | Regulation as a state layer: upregulated, regulated, transitional, downregulated, unknown | CONFLICT | "regulation" already names the Compass overlay of the three highest and three lowest of the 21 laws (`ui/cone.js:2411` coneRegLaws; owner at `cone.js:494`: "Up means up regulation, down means down regulation"). The owner then said of the Regulation button that he does not know what it does (`TASKS.md`, the Compass list, item T4) | the laws, read live | Q8 | A second word, or fold into the existing one | none | engine |
| R50 | RegulationState with signals, evidence ids and confidence (18.1) | MISSING | none | none | S15, Practice build | Store signal events only. State is derived. No confidence number | additive | engine |
| R51 | No false numeric precision; the Kundalini framework stays conceptual (18, 44) | CONFLICT | the owner's ruling asks for the bar: "progress bars of the kundalini snaking around the chakras" and a derived percent (`DESIGN-avatar.md` sections 16 and 17; `proto/avatar/` only, not in `atuned_src`). The glossary defines Kundalini by cleared addresses (`engine/data/kb.js` GLOSS) | none in the build | Q6, S9 | Q6 in section 12 | `rise0` is additive and write once (`DESIGN-avatar.md` section 19) | engine |
| R52 | A regulation or Kundalini visual layer (41 P3) | MISSING | not in `atuned_src`. The Body page's "snake going around the seven chakras" was ruled at round JZ (`DECISIONS.md:2311`) and the Body rebuild has no owner | none | S9, S15 | The brief, section 13 | none | monitor |

### K. Integrity (document section 19)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R53 | The word Integrity | CONFLICT | GLOSS "Integrity": "All of your coherence, added up... measured by how closely you keep the 21 Laws of Moral Integrity". CQ is built from the laws. `DESIGN-integrity.md` | the 21 laws, `p.laws` | Q8 | Name the document's assessment something else (its own layer D is labelled Alignment), or ask the owner to take the word | none | none |
| R54 | IntegrityAssessment: intended against observed, alignment enum, evidence, context (19.1, 19.2) | MISSING | the nearest parts: `avatarGap` `engine/avatar.js:38`, `sniffLaws`, the Duty law, "do what you say" | none | S11, S10 | Derived on read. Stored only when the person confirms | additive | engine |
| R55 | The system does not moralize (19.2, 39) | PARTIAL | `engine/verp.js` lean header "not a verdict on a person"; the drill says "Nothing here is a diagnosis" (`ui/drills.js`); the voice gate `python3 .claude/skills/atuned-voice/check.py --objections` | none | every slice | Voice gate on every new string | none | voice gate |
| R91 | Integrity signals from a journal entry read the same 21 laws the intake measures (11, 19) | CONFLICT | `engine/lexicon.js:614` LAWCUE and `engine/sniff.js:1132` LAWVIO name Ownership and Wisdom; `SI` in `engine/data/canon.js` names Responsibility and Accountability and has neither of the first two. Found by comparing the three tables in node | the cue tables are keyed by law name; `sniffLaws` is not persisted, and history `lawNow` refuses a name outside `SI` | S5 | One name per law. Key LAWCUE and LAWVIO to the `SI` names with a rename map the way `LAW_WAS` carries the earlier two, and add a gate that fails when a name is in one table and not another. Without it a document level "integrity signal" can name a law the intake never measured | none, the names are not stored | engine: a three table comparison gate |

### L. Practice, evidence, outcome (document sections 20 to 23, owned by the Practice builds)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R56 | PracticeEvent (20) | MISSING | day rows with `done` in `CURP.rituals`; `ledgerRead` `engine/ladder.js:84` | day rows | Practice build | Take the Practice TDD's shape (section 10: execution, quality). This document's is flat | none | Practice build |
| R57 | Effect against affect (21) | MISSING | none; identical in intent to Practice TDD section 13 | none | Practice build | Reference, do not copy | none | Practice build |
| R58 | Evidence, with negative evidence first class (22) | MISSING | nearest: `atomIndex` `ui/wheel.js:230`, a UI function keyed by array position that re-parses under today's lexicon; `meter.firsts`, dated and append only; history snapshots `engine/schema.js:241` | none | Practice build | The field list equals Practice TDD section 12. Becoming needs a reference to an avatar item or a non-negotiable, which that list lacks (it has pattern, protocol, ritual and goal only): T2 | none | Practice build |
| R59 | Outcome (23) | MISSING | none; identical to Practice TDD section 14. `goal_id` is required and this document never defines Goal | none | Practice build, T1 | Reference | none | Practice build |

### M. Trace Graph and AI Handshake (document sections 24 and 25)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R60 | An existing Trace Graph (2, 5, 40.16) | MISSING | none in `atuned_src`. `PRIORITY.md` 20.H9 "Not doing"; reversed by the owner, `TASKS.md` round OF; `AUDIT-source-tdd-v3.md` section 1 "No generic graph exists". Being built as `engine/trace.js` elsewhere, not merged | canon tables and about forty numbers per person | Trace build | None here | none | Trace build |
| R61 | Node types, edge types and the canonical relationships (24.1 to 24.3) | CONFLICT | section 24.3 uses verbs absent from section 24.2: excludes, contains, practiced_by, violated_by, suggests, addressed_by, executed_by, supported_by. The Practice TDD sections 16 and 17 give different lists again | none | Trace build, T5 | One list, owned by the Trace build. Becoming adds the node types avatar, purpose, value, boundary, non_negotiable, ritual_element, integrity_assessment, regulation_state, journal_event and the edges defines, expresses, protects, violates, informs | none | Trace build |
| R62 | Graph integrity: orphans, cycles, version consistency (36) | MISSING | none | none | Trace build | none here | none | Trace build |
| R63 | AI Handshake (25) | MISSING | no model: `ui/storyui.js:471`; `AUDIT-source-tdd-v3.md` section 4; `PRIORITY.md` 19.D9. The word also names the receiving AI's process handshake (`SOURCE-TDD.md` section 47) | none | S16 | No consumer until a model is bound. Until then the epistemic labels of S5 | none | engine |
| R64 | Every machine proposal carries an epistemic status: known, inferred, proposed, user confirmed, observed (25, 39.8) | PARTIAL | a `because` array on sniff rows | because | S5 | The five labels on every candidate; inferred never prints as known | none | engine |
| R65 | The interfaces the Practice and Trace builds expose to Becoming | UNVERIFIED | in other worktrees | unknown | section 11 | Section 11 lists exactly what each slice needs | none | integration after merge |
| R66 | Synchronization (2, 36) | MISSING | `ui/auth.js` header: "It does not sync" | none | none | Persistence tests for sync, conflict and rollback cannot be written | none | none |
| R67 | Entitlement boundaries for Becoming features (2) | UNVERIFIED | `engine/plan.js` PLAN_ALWAYS names the reading, the archetypes, the pain map, the tools and the journal; avatar, purpose and boundary are not named; no ruling found | none | Q10 | Ask | none | engine |

### N. Adaptive accountability, adaptation, context (document sections 26 to 28)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R68 | Missed ritual causes and adaptations, the user decides (26) | MISSING | "Missed" exists as a word on the Ritual page, with due separated from active (`ui/ritual.js:248` ritDue) | none | Practice build | Reference Practice TDD section 24. This document adds `investigate_pattern` | none | Practice build |
| R69 | Accountability state machine (26) | CONFLICT | the machine has VERIFIED, EVIDENCE, OUTCOME and ADAPTATION; the PracticeEvent status enum in section 20 has no `verified` | none | Practice build | Take the Practice TDD's section 25 | none | Practice build |
| R70 | Adaptation algorithm (27) | MISSING | none. A formula that fakes a change was ruled out for rituals (`PRIORITY.md` T1 option B, not chosen) | none | Practice build | Reference | none | Practice build |
| R71 | Context transfer: home, work, relationship, social, high pressure (28) | MISSING | no context field. The nearest context vocabulary is the six boundary sides (`engine/avatar.js:105`); the document's five match neither those nor the seven seats | none | T3, S14 | Decide the vocabulary once; recommend the boundary sides | none | engine |

### O. The page, the navigation, the surface (document sections 29 and 30)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R72 | Layer A, identity | PARTIAL | the ring of seven seats with the selected seat's symbol at the core, two boxes beside it: `ui/avatarui.js:653` avRing, `981` avHero | pairs | S8 | Section 13 | none | monitor; functional |
| R73 | Layer B, purpose: material, spiritual, unified | MISSING | not on the Avatar tab. The read only drill is reached from the profile sheet (`ui/panels.js:983`), not from the tab | purpose | S3, S8, Q2 | Section 13 | none | monitor |
| R74 | Layer C, boundary: six facets | MISSING | same | purpose.sides | S3, S4, S8 | Section 13 | none | monitor |
| R75 | Layer D, alignment: regulation, integrity, active patterns | PARTIAL | the Running card, the running saboteurs with a direction word (`ui/avatarui.js:1074`) and the closure percent exist; regulation and integrity do not | derived | S5, S9, S11, S15 | Section 13 | none | monitor |
| R76 | Layer E, practice: coloured ritual markers | PARTIAL | Cycles `ui/avatarui.js:1141`, the Rituals queue `1098`, the per seat rule `1000` | plans and rules, outside the record | S7, S8 | Section 13 | none | monitor |
| R77 | The page answers six questions (29) | PARTIAL | section 13a table | none | S8 | Section 13 | none | functional |
| R78 | A living becoming map, not a conventional profile (29) | PARTIAL | the owner rejected the built hero as "a bunch of text boxes" (`DECISIONS.md:2063`); the current ring is the round KH to LV result | none | S8 | Section 13 | none | design gate |
| R79 | A Become section; five logical groups (30) | CONFLICT | the loop is discover, play, flow, embody (`CLAUDE.md`); `TABDEF` carries those sections (`engine/core.js:162-215`); Ritual in Flow ruled (T3, round KT); Avatar in Discover by the owner's own order at round LV; the Practice TDD section 31 gives a different grouping again | `TABDEF[].sec` | Q7 | Q7 | none | functional; monitor |
| R80 | A new surface takes the next free tab integer and every lookup learns it | PARTIAL | the next free integer is after PRACTITIONER 12 (`engine/core.js:55-70`); TABOF, TABEXTRA and TABREAL must all know a new surface, "which has happened twice" (`CLAUDE.md`). The Avatar is `TAB.INTAKE`, integer 5; the door called Intake is `TAB.ENERGY` | `TAB`, `TABDEF`, `TABEXTRA` | S13 | Look up by `.k`, never by position | none | monitor reads TABDEF and TABEXTRA |

### P. Persistence, versioning, events, analytics, tests (document sections 32 to 36)

| ID | Requirement | Status | Existing file and line | Existing data model | Dependencies | Required change | Migration | Tests required |
|---|---|---|---|---|---|---|---|---|
| R81 | Arrays of objects on the versioned user record (32) | PARTIAL | one record per profile; `validateProfile` `engine/schema.js:776` rebuilds from named fields and has no closed key set at the top, so an unknown key is dropped silently; closed sets exist only on nested bags (`vKeys` `486`) | fixed key set | S1 to S4, Q9 | Every new top-level key gets its boundary entry in the same commit. Arrays are capped and refused by name when over the cap | additive | engine: unknown nested key refused; round trip |
| R82 | Personal practice data never in Canon; no payment credentials in practice objects (32) | PARTIAL | canon is static data in `engine/data`; `plan` refuses customer, subscription, email, key, secret and token (`schema.js:944`); `OB_NEVER` names avatar, purpose, story, journal and history (`engine/outbox.js:30`) | none | every slice | Add each new key's name to `OB_NEVER` and to the record's refusal list on the day the key exists | none | engine: the gate that asserts every `OB_NEVER` name is refused inside the new bags |
| R83 | Historical PracticeEvents stay immutable when a protocol changes (22, 33) | MISSING | precedent: `meter.firsts` append only; entries never deleted (T2); entries carry the lexicon version that read them | none | Practice build | Reference | none | Practice build |
| R84 | Versions on avatar, purpose, boundary, protocol, ritual, AI proposals, schema and algorithms; `generated_by` and `approved_by` (33) | PARTIAL | `SCHEMA_V` `engine/schema.js:13`, `LEX_VERSION` `engine/sniff.js:903`; no per object versions | none | S2, Q9 | Per object `version` additive; `generated_by` only when a generator exists | additive | engine |
| R85 | Events for meaningful transitions (34) | MISSING | no event log; writes report through `status()` | none | Practice build | Decide whether events are a stored log or derived from records. Derived is the smaller | none | engine |
| R86 | Analytics: observed change per unit of practice; resemblance to the avatar (35) | MISSING | `ui/analytics.js` reads the ladder and history. The ladder counts days a ritual was set, not only done (`PRIORITY.md` 21.J2) | none | S5, S10 | Not before evidence exists | none | engine |
| R87 | Do not optimise for streak length (35, 40.24) | CONFLICT | the ladder has Streak and the Seven, Thirty and Ninety day marks (`engine/ladder.js:46`), and the owner asked for a sticky badge and award system (`TASKS.md` GM2) | `meter`, `rituals` | Q11 | Q11 | none | none |
| R88 | 30, 60 and 90 day retention (35) | UNVERIFIED | server side; the `reboot-os` repository is not in this session | none | none | none | none | none |
| R89 | The testing requirements (36) | PARTIAL | harness: `tests/engine.js` groups, `tests/functional.js`, `tools/monitor.js`, `tests/design.js`. No longitudinal harness | none | each slice | Each slice adds an engine group; monitor reads TABDEF and TABEXTRA at run time | none | as stated |
| R90 | The end to end scenario and the example trace (37, 38) | MISSING | measured in section 9: the sniffer reads fear at the root for "afraid of conflict", reads "I avoided telling them what I actually wanted." as nothing, and reads "I stated the concern directly." as nothing | none | S14 or Q12 | Q12 | none | engine: a fixture of the document's own sentences |

---

## 4. What the document assumes exists, and what the code has

| The document assumes | What is there | Where checked |
|---|---|---|
| An existing Trace Graph (2, 5, 24, 40.16) | None. Relationships are fixed canon tables, the same for everyone. `PRIORITY.md` 20.H9 ruled "not doing"; the owner reversed it at round OF and it is being built as `engine/trace.js`, unmerged | `AUDIT-source-tdd-v3.md` section 1; `TASKS.md` round OF |
| An existing Value ontology (5, 8.1) | None as one table. Four partial ones: the 21 laws, the ten expression values, the nine replacement states, the eight compass axes. The soul's values in the ruling, "freedom, free will, knowledge, wisdom", and the ego's, "health, fitness, financial stability, wealth, family", are examples in a prompt string and not a table | `engine/data/canon.js`, `engine/data/practice.js:6-10`, `engine/data/compass.js`; `engine/avatar.js:71-72` |
| An existing AI Handshake (2, 25) | None. No model is called anywhere. A different document of the same name is a process contract for a building AI | `ui/storyui.js:471`; `SOURCE-TDD.md` section 47 |
| An existing Pattern confirmation model (13) | None. The only confirmation is Commit on a read, with undo. The person leads and Source AI does not dig (round GO) | `ui/storyui.js:351`; `engine/sourceai.js` header |
| An existing Evidence model (2, 5, 22) | None. The closest is `atomIndex`, in the UI, keyed by array position | `ui/wheel.js:230` |
| An existing Reframe system (2, 14) | Reframe is the second half of every release run, not a system of its own | `ui/release.js` header and `relCoolDown` |
| Persisted Release Session, Release Event, Release Queue and release verification (15) | A run is `RUN`, in memory. `RUN.log` is memory only. What persists is meter counters and dated firsts. No verification exists: "cleared" is a threshold on a formula | `ui/release.js:154`; `REVIEW-architecture-schema.md`; `AUDIT-source-tdd-v3.md` section 2, item (b) |
| A Goal object (Evidence.goal_id, Outcome.goal_id, node type goal) | Not defined in this document. Defined in the Practice TDD section 4 | the two documents |
| A Value schema | Value is a concept (3) and a node type (24.1) and `Purpose.values` holds ids, and no section defines a Value | the document |
| Synchronization and entitlement boundaries (2) | No sync. Entitlement is the plan ladder, which names neither avatar, purpose nor boundary | `ui/auth.js` header; `engine/plan.js:104-106` |
| Persistence that extends the versioned user record (32) | True for the avatar pairs and the purpose map. False for the Avatar page's ratings, starting weights, tags and rules, and for ritual plans: they sit under two side keys, not exported | `ui/avatarui.js:149`; `ui/ritual.js:171` |

---

## 5. Conflicts with standing rulings

Each one names the ruling and where it is written. None is silently resolved.

| # | The document says | The standing ruling | Where | Rows |
|---|---|---|---|---|
| 1 | Purpose centres are sentences the person writes (7, 8.1) | "Six values in, three readings out, and a person may type none of the three" | `DECISIONS.md:459-478`; `engine/avatar.js:44-67` | R12 |
| 2 | An avatar of free lists in eight categories, items need no address (6.2) | "The left side is a value and a value has no address... That is why neither half is written alone" | `engine/avatar.js:21-27`; half a pair is refused at `schema.js:958-983` | R03, R04 |
| 3 | The sniffer returns a blended relevance and confidence (12.2, 13) | Named confidence bands measured and rejected; counts a person can check | `AUDIT-source-tdd-v3.md` section 1; `engine/sourceai.js` header | R34 |
| 4 | Kundalini kept conceptual, no number (18, 44) | The avatar's primary goal is "to reconnect people's kundalini", drawn as progress bars snaking round the chakras, with a derived percent | `DESIGN-avatar.md` sections 16 and 17; `DECISIONS.md:2311` | R51 |
| 5 | A Become section among five groups (30) | The loop is discover, play, flow, embody, a circle; Ritual belongs in Flow; Avatar sits in Discover in the owner's own order | `CLAUDE.md`; `TASKS.md` round NS (T3), round LV | R79 |
| 6 | The system optimises for meaningful change, not streak length (35, 40.24) | A sticky badge, award and reward system is ruled and built on streak and day marks | `TASKS.md` GM2; `engine/ladder.js:46` | R87 |
| 7 | A second ritual writer with the avatar linked (16) | "None of them is a second mechanism"; the Avatar's rules and the Ritual page are two writers already and T5 asks to merge them | `ui/ritual.js` header; `PRIORITY.md` 21.J3 and T5 | R47 |
| 8 | Free text descriptions on candidates, assessments and elements (13, 16.2, 19.1) | Tags are a closed set validated against a table: "no to free text tags on measured grounds", because the practitioner model would later have to hide a free field | `ui/ritual.js:57-79` (TG4) | R35, R54, R44 |
| 9 | Integrity as a declared against observed assessment (19) | Integrity is the 21 Laws, measured by the intake, and CQ is built from them | GLOSS "Integrity"; `DESIGN-integrity.md` | R53 |
| 10 | Regulation as a five state layer (18) | Regulation is the Compass overlay of the laws lifting and pulling down | `ui/cone.js:494, 2411` | R49 |
| 11 | Evidence, outcomes and practice events kept for the record, and a journal event as a graph node (24) | The record and the story are never held joined (`DECISIONS.md:36`); a later ruling stores the story for recovery and never shares it (`DECISIONS.md:1373-1380`). The two lines disagree on the page and the later reads as the one that stands. A graph that joins evidence to journal events is the joined shape | `DECISIONS.md` | R22, R58, Q10 |
| 12 | A practitioner can be shown Becoming data, by implication (2, 40) | A cohort lead sees fetters, saboteurs, complexes, hyper complexes and analytics; not the story cloud, not "the spiritual material" | `engine/plan.js:97-98` | R67, Q10 |
| 13 | Ritual progress tied to avatar change (4) | A completed ritual moves its own progress on the avatar and never a seat's charge (T1, option A) | `TASKS.md` round NS | R48 holds; the document does not conflict if it stays so |
| 14 | A percent regulation or integrity score (implied) | No printed count against a total, "3 of 14"; archetypes carry no percent; the figure is drawn, not printed | `engine/ladder.js` header; `ui/avatarui.js:518-533` | R51, brief |

---

## 6. The document against itself and against the Practice TDD

### 6a. The document contradicts itself

| # | Where | What disagrees |
|---|---|---|
| 1 | 6.2 against 31 | Avatar status: draft, active, archived against draft, defined, active, evolving, integrated |
| 2 | 9.2 against 10.1 against 31 | Boundary has its own status; the machine called Boundary in section 31 is the Non-Negotiable machine of 10.1 |
| 3 | 13 against 31 | Pattern: proposed, confirmed, rejected against candidate, confirmed, active, reducing, inactive, resolved or replaced. `rejected` is gone from the machine |
| 4 | 27 against 31 | Protocol effectiveness has four classes, the machine has three outcomes and a new one, inappropriate |
| 5 | 20 against 26 | PracticeEvent status has no `verified`, the accountability machine does; the miss path has states that are not statuses |
| 6 | 24.2 against 24.3 | Edge vocabulary: eight verbs used in 24.3 are not in 24.2 |
| 7 | 24, 22, 23 | Goal, Behavior and Value are node types or references and are never defined |
| 8 | 14, 16.2, 17 | The six intervention types are spelt three ways: RELEASE and BEHAVIOR (17), `behavioral_conditioning` (16.2), BEHAVIORAL_CONDITIONING (14) |
| 9 | 1, 4, 30, 43 | Four loops: the identity chain in 1, the diagram in 4, the questions in 30, and the verb chain in 43 that ends open. `CLAUDE.md` rules that a loop closes |
| 10 | 12.1 against 12.2 | The pipeline has user confirmation, graph search and propose; the algorithm returns candidates only. The header lists twelve things it searches for and the algorithm detects nine, under other names |
| 11 | 2 and 5 against 22 | Section 2 says an Evidence model exists and must not be duplicated; section 22 then specifies one in full |
| 12 | 17 against 29 layer E | The same ritual marker spec, twice |

### 6b. Where this document copies the Practice TDD and differs

| Object | Practice TDD | This document | Consequence |
|---|---|---|---|
| Protocol classes | ten: release, behavior, integrity, communication, body, attention, relationship, goal, presence, custom (6) | seven: RELEASE, REFRAME, BEHAVIORAL_CONDITIONING, INTEGRITY_CONDITIONING, EMBODIMENT, OBSERVATION, CUSTOM (14) | one enum, owned by Practice |
| Step or element types | eight: release, reframe, affirmation, behavior, timer, observation, real_world_action, verification (7) | six (16.2) | one vocabulary |
| Ritual | `protocol_id` required, `cadence {type}`, `days[]`, timer, order, tags (9). "Comparatively lightweight" | `protocol_id` nullable, `avatar_id`, `domain`, `chakra`, `elements[]`, `cadence` string (16.1) | the Becoming ritual carries intelligence the Practice ritual refuses |
| PracticeEvent | nested `execution` and `quality` (10) | flat (20) | take Practice's |
| Evidence | same fields (12) | same (22) | copy, so reference |
| Outcome | same fields (14) | same (23) | copy, so reference |
| Graph node types | fifteen, including story, impression and somatic_state (16) | twenty one, including avatar, purpose, value, boundary, non_negotiable, ritual_element, journal_event, integrity_assessment, regulation_state; no story, impression or somatic_state (24.1) | one list; `journal_event` against `story` is one concept with two names |
| Graph edge types | includes causes, associated_with, generalizes_to (17) | includes defines, expresses, protects, violates, informs, contradicts, reinforces (24.2) | one list |
| Handshake | `PracticeHandshake` with `known_state`, `proposed`, `expected_signals`, `validation` (26) | `AIHandshake` with `known`, `inferred`, `proposed`, `user_confirmed`, `observed`, `constraints`, `proposed_changes` (25) | one contract |
| Information architecture | DISCOVER, PRACTICE, RELEASE, ACCOUNTABILITY, INTELLIGENCE (31) | DISCOVER, BECOME, PRACTICE, REFLECT, INTELLIGENCE (30) | one map |
| Additions in this document | Regulation (18) and Integrity (19) are not in the Practice TDD | new | audited above |

---

## 7. Words that already mean something

| The document's word | What the product already means by it | Where |
|---|---|---|
| Pattern | an address or fetter (112); the billed unit, one sentence; a saboteur, "one of 33 named patterns"; and the owner's own use for a domain or archetype | GLOSS; `DECISIONS.md`; `DESIGN-pattern-signal.md` |
| Integrity | the 21 Laws of Moral Integrity, and CQ built from them | GLOSS; `DESIGN-integrity.md` |
| Regulation | the Compass overlay of the three highest and three lowest laws | `ui/cone.js:2411` |
| Protocol | the release protocol, the run; and "your protocol" in the practice library | `ui/release.js` header; `engine/data/practice.js` |
| Trace | a geometric overlay on the Compass point cloud (round NY); the Story page's route line (`proto/story-redesign2`); and the document's graph | `TASKS.md` round NY |
| Ritual | a saved day row, and separately a plan that runs for days | `engine/schema.js:637`; `ui/ritual.js:185` |
| Handshake | a process contract for a receiving AI | `SOURCE-TDD.md` section 47 |
| Becoming | the Avatar tab's first subtab; the teachers' "rituals of becoming" (`BECOMING`, `engine/data/practice.js`); the document's whole system | `ui/avatarui.js:1313`; `engine/data/practice.js` |
| Journal | the Story tab; entries are "committed" | `ui/storyui.js` |
| Archetype | twelve, on the left rail picker (primary and secondary) and on the Avatar page's own subtab, rated one to five | `shell/body.html:720`; `ui/avatarui.js:1165` |

---

## 8. What the Avatar page holds today that the document never mentions

Each one needs a ruling on what happens to it, because the redesign could lose
work the owner asked for, in his words.

| Element | Where | His words | Under the document |
|---|---|---|---|
| The ring of seven seats, root to crown, one story per seat | `ui/avatarui.js:653`, `153-160` | "Let's do the seven seats, I like that" (EI); "the hero graphic... take up the majority of the space" (KH) | the document has no seats on the Avatar. Q1 in section 12 |
| Two boxes, "To release" left, "To embody" right | `avatarui.js:924-976` | "on the left side, it's the patterns to release. And on the right side, it's the patterns to embody" (JQ, LO) | maps to not_becoming and becoming only if Q1 goes one way |
| The prompt that cycles, three a seat | `avatarui.js:187-222` | "a prompt that you can cycle through to kind of drag that out of you" (JP) | not in the document |
| Tags from the lexicon, added and removed | `avatarui.js:695-916` | "tags associated with those chakras... that person can add more tags or remove tags" (KH) | the document has no tags; free text candidates conflict with the closed set |
| A rule: a release or "say it", a day, a week or two weeks | `avatarui.js:1000-1025` | "set up rules for affirmations or releases that you can do for a week or two weeks or a day" (JP) | R47 |
| Cycles: three rings, three turns each, a tick per cycle | `avatarui.js:1141-1155` | "I want three cycles, three revolutions per cycle" (JP) | not in the document |
| Percent complete per seat, from the starting weight | `avatarui.js:350-354`, side store `load0` | "the percent complete, that's good" (HG) | the document has no seat percent; it lives outside the record (R08) |
| Running saboteurs, with loading and releasing | `avatarui.js:428-443`, `1074` | "where you're visualizing it, the pleaser with the releasing loading, that's really excellent" (HG) | layer D in part |
| Archetype wheel, 1 to 5, embodied pin, no percent | `avatarui.js:1165-1241` | "People may not see their full potential" (HG); "Let's take the percentages off archetypes" (KH) | not in the document |
| Situations: moral dilemmas written as intake answers | `avatarui.js:1272-1295`, `1853` | "You see a beggar on the street..." (JQ) | not in the document; a second writer of intake answers, named as a cost in its own comment |
| The Rituals card, queue and "Task these" | `avatarui.js:1098-1121` | "which rituals I can queue up here, and task my rituals" (HG) | layer E |

---

## 9. Probes, so nothing here is a guess about the sniffer

Run in node against the committed `engine.js`, with no change to any file.

| Sentence | Source | Imprints | Heard | Gates | Saboteur named |
|---|---|---|---|---|---|
| I didn't tell them because I was afraid of conflict. | the document, 37 | four at the root, Fear | root, one mention | none | Innocent, confidence 0.36 |
| I avoided telling them what I actually wanted. | the document, 6.3 | none | unread | averse, one cue | none |
| I stated the concern directly. | the document, 38 | none | unread | none | none |
| I held the line today and told her no. | made up, same kind | none | unread | none | none |
| I said yes when I wanted to say no. | made up, same kind | four | read | none | none |
| I did not speak up in the meeting and my throat was tight. | made up, same kind | four | read | none | none |

What it shows. The sniffer reads a feeling or a body word. A behaviour sentence
that carries neither, positive or negative, is unread. `boundaryCross` returned
nothing for "them", so a boundary side is named only when a person is named.
The saboteur the engine offered for the first sentence is not Avoider or Pleaser.

---

## 10. Where the schema is today, as a table

The shape is not written down in one place. This is it.

| Where | Key | Shape | Writer | Validated by | Exported | Removed on profile delete |
|---|---|---|---|---|---|---|
| record | `avatar` | `{built, at, reviewedAt, pairs[{be<200, notbe<200, seat?}]}` | `ui/avatarui.js` avSeatAdd, avTake | `engine/schema.js:947-991`; half a pair and an unknown seat refused by name | yes | yes |
| record | `purpose.soul`, `purpose.ego` | three strings under 120 | none | `schema.js:995-1002`; over length becomes an empty string, silently | yes | yes |
| record | `purpose.sides` | six lists, five strings under 200 each | none | `schema.js:1003-1013`; a sixth refused by name; empties and over length dropped silently | yes | yes |
| record | `rituals[]` | day rows, closed key set `t, track, band, steps, min, when, where, done` | `ui/ritual.js` ritWrite | `schema.js:637` vRitual | yes | yes |
| record | `story.entries[]` | `t, text, imprints, bands, lex, asked`; no id | `ui/storyui.js` stCommit; `ui/avatarui.js:1768` | `schema.js` vEntry | yes | yes |
| record | `meter`, `history` | counters and dated firsts; snapshots | engine | `schema.js` | yes | yes |
| beside the record | `atuned-avatar-side` | per profile id: `arch`, `load0` keyed by the pair's own text, `rule` per seat, `tags` per seat | `ui/avatarui.js` | `avSide` on read, `avatarui.js:272-297`, not the boundary | **no** | yes, `accForget` `ui/account.js:315` |
| beside the record | `atuned-ritual-active` | per profile id: plans `{id, steps, from, days, stop, on, tm, tags, rel, tc, band, track, when, where}` | `ui/ritual.js` ritPlanPut | `ritPlanOk` on read | **no** | yes, `accForget` |

Three consequences for the design.

- **A pair's identity is its own text.** `load0` is keyed by `be` and `notbe`
  joined. Editing the words is a new pair that starts again, which the code
  says and handles, and two pairs with the same words collide. Pairs, entries
  and commitments all need a stable id before anything can point at one.
- **A third side key means a third thing `accForget` must know.** It lists the
  two keys by name. A new key it does not list leaves part of a deleted profile
  in the browser, which `ACC_HELD` (`ui/account.js:380`) also would not name to
  the person.
- **The boundary drops, without a word, what it does not know.** Top level keys
  it does not name; an over length purpose value; empty or over length
  commitments. Everything this audit adds has to be named at the boundary in
  the same commit.

### 10b. Drift found while reading

Where the surface and the schema disagree today, before any of this is built.
Each is a defect with a later fuse.

| Drift | Where | What it does | Slice |
|---|---|---|---|
| The sniffer's law cue and violation tables name Ownership and Wisdom; the measured twenty one name Responsibility and Accountability | `engine/lexicon.js:614`, `engine/sniff.js:1132`, `engine/data/canon.js` | a text reading can name a law the intake never measured; the rename map `LAW_WAS` carries two earlier renames and not these | S5, R91 |
| A purpose value over its length is replaced by an empty string with no refusal | `engine/schema.js:1000-1002` | the boundary's own rule is refuse by name, never clamp; this clamps to nothing | S3 |
| Commitments that are empty or over their length are dropped without a word | `engine/schema.js:1011-1013` | a boundary quietly truncated is a boundary a person thinks they set, in the comment above it | S3 |
| An unknown top level key is dropped on load | `engine/schema.js:776` onward; closed sets exist only on nested bags | a record from a newer build loses its new fields in an older one, with no refusal | Q9 |
| "Purpose set" cannot be earned, and says "The compass has something to point at" | `engine/ladder.js:212`; searched `ui/cone.js`, nothing reads purpose | a mark whose precondition no surface can meet, and a promise about the Compass that is false | S3 |
| The drill promises two journal questions that nothing asks | `ui/drills.js:1071-1073`; searched for "best day" | the drill says the journal asks them; no journal prompt does | S3 |
| Two surfaces are called the avatar | the tab, `ui/avatarui.js`; the drill, `ui/drills.js:1048`, opened by the profile sheet (`ui/panels.js:983-985`) and by the door in `ui/component.js:832, 851` | the door a stranger meets opens the older read only page, which carries the purpose map and the boundary; the tab carries neither | S8 |
| The monthly review exists and the Avatar tab never shows it | `engine/avatar.js:26-36`, called only at `ui/drills.js:1075` | the revise upward loop the owner ruled has no prompt on the page built for it | S2 |
| A pair is identified by its own text | `ui/avatarui.js:306` avKey; `load0` keyed on it | two pairs with the same words collide; a ritual, a rule or evidence cannot point at one | S2 |
| `sniffStory` computes laws, gates, depth and offer, and only the tutorial reads it | `ui/tutorial.js:187`; `ui/storyui.js:351` | the Story commit calls three of the sniffer's passes and not the rest, so the document's "integrity signals" are computed nowhere a person sees | S5 |
| Two side stores, one deleter that names both | `ui/account.js:315` accForget | a third side key leaves part of a deleted profile in the browser | every slice |

---

## 11. Build order, the smallest coherent path

Slices small enough for one build agent. Each says what it touches, what proves
it, what must land first, and what it needs of the Practice and Trace builds.
`atuned_src/engine/schema.js` is touched by S1 to S4, S6, S10 and S15, and the
Practice build touches it as well, so those slices land after the Practice
build's schema commits and rebase onto them. Nothing here is built in this
document.

**Order.** S1 to S5 can start now and need nothing from Practice or Trace, apart
from sharing `schema.js`. S6 follows S5. S7, S10, S11, S12 and S15 wait for the
builds. S8 starts as soon as S3 has landed and finishes in layers. S9 does not
depend on Practice. S13, S14 and S16 wait for the owner or for a model.

| Slice | What it does | Files touched | Tests | Must land before | Needs from the Practice build | Needs from the Trace build | Owner gate |
|---|---|---|---|---|---|---|---|
| S1 | Move the avatar's side data onto the record: archetype ratings, starting weights, tags. Rules stay until S7 | `engine/schema.js`, `engine/avatar.js`, `ui/avatarui.js` (read switches to the record), `ui/account.js` (keeps `accForget` for the old key) | engine group: export then import keeps all three; the side key is read once only when the record has none; boundary refuses wrong shapes by name. `tools/equiv.py` not needed | the Practice build's `schema.js` commits | none | none | Q9 |
| S2 | Stable ids and order for pairs and journal entries; avatar `version`, `status`, `name`, `title`, `description`; review clock surfaced | `engine/schema.js`, `engine/avatar.js`, `ui/avatarui.js` | engine: ids unique and stable; an older fixture loads unchanged; version moves on confirmed revise only; closed key sets refuse unknown nested keys | S1 | none | none | Q1, Q9 |
| S3 | The write path for purpose and boundary on the existing shape, free text, no ontology. Fix the silent empty string on over length; label map for the six sides; correct the drill's promise of journal questions | `ui/avatarui.js` or a new `ui/becoming.js` added to MANIFEST after it, `engine/schema.js`, `ui/drills.js` | engine: over length refused by name; functional: write six and thirty, reload, round trip; the "Purpose set" mark earns; monitor | S2 | none | none | Q2, Q3, Q4 |
| S4 | NonNegotiable objects: id, statement, behavior, order, declared state defined, active or paused; `purpose.sides` kept as a projection | `engine/schema.js`, `engine/avatar.js` | engine: ids survive; projection equals statements; refusal by name at the cap; an older record migrates once, idempotent | S3 | none | none | Q5, Q9 |
| S5 | The becoming read model, pure and host free: joins avatar, purpose, boundary and the field; link candidates from words shared with the person's own lines, `boundaryCross`, seat gap and recurrence; epistemic labels; weighting table; rungs that fired. Stores nothing | a new `engine/becoming.js` placed after `sniff.js` and `sourceai.js` in `atuned_src/MANIFEST`; `engine/export.js` | engine: direct match, weak echo, negation guard, empty avatar, rationale on every candidate, weights read from the table, unread signals say so; BUILD-engine.sh host free check | S2 | none | none | none |
| S6 | Decisions: the person confirms or rejects a link, dated. The first Pattern confirmation model | `engine/schema.js`, `engine/becoming.js`, `ui/avatarui.js` | engine: a decision is the only stored fact; rejected stays rejected; the candidate recomputes without it | S5 | none | none | Q8, Q12 |
| S7 | Ritual to avatar link; the Avatar rules become ritual steps; one writer for a daily practice (T5) | `ui/avatarui.js`, `ui/ritual.js`, `engine/schema.js` | engine: `rule.done` migrates once and idempotent; no ritual write reaches the charge arithmetic; functional: Say it appears on the Ritual page and in the streak | S2, and the Practice build | Ritual with a stable id and its plan on the record (the `PRIORITY.md` 19.C5 move); ProtocolStep with the type `affirmation` (Practice TDD 7); an extension point for `targets` | none | T5 confirmed |
| S8 | The Avatar page as five layers, in the redesign's order: A identity, B purpose, C boundary first; E practice after S7; D alignment with what exists | `ui/avatarui.js`, `shell/head.html` or the injected sheet, `engine/core.js` only if a tab integer is added | monitor: every surface renders on a blank and a loaded profile at 1600 and 390; design gate; `python3 tools/terms.py`; voice gate; look at the shots | S3, S4 for B and C; S7 for E; S5 for D | for E: the ritual id | none | the redesign, section 13 |
| S9 | Kundalini as a drawn, derived bar: port `proto/avatar/rise.js` into the engine; optional write once `rise0` | `engine/compute.js` or a new engine file, `engine/schema.js`, `ui/avatarui.js` | engine: the rise against `compute()` on the reference people; nothing printed as a percent unless Q6 says so; `rise0` refused by name when out of range; equiv.py if a body moves | S2 | none | none | Q6 |
| S10 | Evidence references: a non-negotiable's tested and established read off evidence; a violation is negative evidence | `engine/becoming.js`, `engine/schema.js` | engine: derived state moves with evidence; nothing stored can claim established; thresholds read from a table the owner fills | S4, and the Practice build | Evidence (Practice TDD 12) and PracticeEvent (10), with a reference to an avatar item and a non-negotiable, which Practice's Evidence lacks | none | Q5 |
| S11 | The alignment reading, the document's Integrity: intended against observed, derived on read, stored only when confirmed | `engine/becoming.js` | engine | S10, S6 | Evidence, PracticeEvent, Outcome | the graph, to read relations | Q8 |
| S12 | Register the Becoming nodes and edges with the graph: avatar, purpose, value, boundary, non_negotiable, ritual_element, integrity_assessment and the edges defines, expresses, protects, violates, informs | `engine/becoming.js`, the Trace build's registry | engine: ids from S2 and S4; no orphan; no cycle; version consistency | S2, S4, S6 | Ritual and Protocol ids | `engine/trace.js` with a typed node and edge API that accepts new types; the vocabulary reconciled (T5) | none |
| S13 | The Become section and a tab integer for any new surface | `engine/core.js` TAB, TABDEF, TABEXTRA, TABREAL, TABOF; `shell/body.html` | monitor reads TABDEF and TABEXTRA; functional: nav placement | S8 | none | none | Q7 |
| S14 | Behaviour cues in the lexicon, with their own provenance and a lexicon version bump | `engine/lexicon.js`, `engine/sniff.js` | engine: every cue's false positives on the story bank; the document's own sentences read; `tools/equiv.py` | the owner | none | none | Q12 |
| S15 | RegulationState from signals: signal events stored, state derived, no number | `engine/becoming.js`, `engine/schema.js` | engine | S10 | Evidence and PracticeEvent | the graph | Q6, Q8 |
| S16 | The AI Handshake object, when a model is bound | a new engine file, `ui/auth.js` seam | contract tests; no model, no slice | a model | none | none | none |

**What the Practice and Trace builds must give Becoming, stated as interfaces
and not as a schedule.**

- A Ritual with a stable id, on the record, with `band` or a chakra, and an
  optional extension for `targets`.
- ProtocolStep with the step type `affirmation`, and a done record that the
  Avatar page's Say it can write into.
- Evidence with a generic reference list, so an avatar item or a non-negotiable
  can be pointed at without a new field each time.
- A Trace registry that accepts node and edge types it did not ship with.

All four are UNVERIFIED (R65): neither build is merged.

### 11b. Questions for the technical director and the Practice builds

These are not the owner's.

- **T1.** Is an avatar pair a Goal, or does a Goal point at one? The Becoming
  document says avatar "requires" outcomes, and Outcome measures a Goal.
- **T2.** Evidence must be able to cite an avatar item or a non-negotiable.
  Add a generic reference list, or a field for each?
- **T3.** One context vocabulary: the six boundary sides, or the document's
  five, or neither?
- **T4.** Ritual id and plans on the record before S7. Is that the 19.C5 move?
- **T5.** Node and edge vocabularies: one list, owned by the Trace build.
  `journal_event` and `story` are one concept.
- **T6.** Entry ids: minted by S2, or by the Practice build's graph work? One
  of them, once.
- **T7.** Sequencing of `schema.js` edits between the Practice builds and S1 to
  S4.

---

## 12. The questions only the owner can answer

Ranked by how much each one decides. Questions 1 to 5 are needed before the first
slices that touch the page. Each one says what it is in plain words, quotes the
thing it is about, gives the ways it could go with what each costs, and says
which slices wait on it. Where there is a recommendation it is labelled as one,
and the choice is his.

### Q1. Is the Avatar one person described in eight kinds of line, or seven seats each with a pair?

> **What it is.** The document describes one Avatar with lists: qualities, values, beliefs, behaviors, communication, relationships, embodiment, contribution, and a second set for who you are not becoming. The page you approved is seven rings, root to crown, and each ring holds one pair: who you want to be, and a bad day sentence about who you are when it goes wrong. The sniffer reads that second sentence and finds where it sits in the body. Those are two different ways to organise the same idea.
>
> **His words.** "the avatar page is really about building the avatar, so it's me telling the story of who I want to become, and then that populating within these fields, maybe the tags, and it's using the sniffer to sniff those fields for my stories, and then it gives me the release protocols so I can become that person" (HG). Against the code's own comment: "The left side is a value and a value has no address. The right side is a sentence about a bad day, and a sentence about a bad day parses" (`engine/avatar.js:21-24`). Against the document: `becoming: qualities: [], values: [], beliefs: [] ...` (6.2).
>
> **Ways it could go.**
> - **A. Seats stay the page. The eight kinds become a label on each line.** One optional tag a person can set or leave. Cost: small, additive, nothing he approved moves. The eight kinds are filters, not a structure.
> - **B. Two layers on one page.** An identity layer on top in the document's shape: one avatar, free lines in eight kinds, no body address. The seven seat pairs underneath as the work. Cost: a person writes in two places and may feel they said it twice. The sniffer reads only the seat pairs, because only those have an address.
> - **C. Replace the pairs with the eight kinds.** The sniffer then has to find a seat for each line. Cost: a line like "honest" has no address and releases nothing; the release line that feeds the field goes away. This is the largest change and reopens the ring he approved.
> - **D. Only add the identity header** (a name, a title, a description) above the ring. Cost: smallest; the document's categories are not adopted at all.
>
> **A second part, and it matters.** In the code the second line means what is in the way now: "I lie awake scared about money". In the document "not becoming" means who you refuse to be. Which does he mean by the second box?
>
> **What I would pick, as a recommendation only.** A with D. It keeps what he approved and gives the document's categories somewhere to live.
>
> **Look at.** `ui/avatarui.js:187-222` for the seven sets of prompts and the example lines. **Unblocks** S2, S8.

### Q2. Does a person write their purpose, or is it read out of their six values?

> **What it is.** The ruling says purpose is not typed. A person enters six values, three for the spirit and three for the body, and the product returns three readings built from them. The document's Purpose has a sentence for the material side, a sentence for the spiritual side and a Unified Purpose, all stored.
>
> **His words.** "Six values in, three readings out, and a person may type none of the three" (`DECISIONS.md:459-478`). Document: `unified: purpose: string` and "Unified: Create a stable life that gives me the capacity to help others." (8).
>
> **Ways it could go.**
> - **A. Keep it derived.** The Unified Purpose is the product's own sentence, "Where those two meet is how you make money and how you find fulfilment doing it". Cost: no personal sentence; the layer is words the product chose.
> - **B. Let the person write one sentence beside the derived reading, never instead of it.** Cost: his ruling is amended, and a typed field is now stored next to a derived one.
> - **C. A suggested sentence from Source AI that the person edits.** Cost: needs a model, which does not exist, and breaks "never entered".
>
> **What I would pick, as a recommendation only.** A for the first cut, because layer B can ship on A and B can be added later without a migration.
>
> **Unblocks** S3, layer B.

### Q3. Do the values come from a list, or are they the person's own words?

> **What it is.** The document wants each value to be an id in an existing Value ontology. There is no such list. There are four partial ones, and none of them is the list in his ruling.
>
> **His words.** Soul: "freedom, free will, knowledge, wisdom"; body: "health, fitness, financial stability, wealth, family" (`DECISIONS.md:465-469`). Document: "Use the existing Atüned Value ontology if available." (8.1).
>
> **What exists.** The 21 Laws of Moral Integrity as the intake measures them (Truth, Courage, Humility, Duty, Patience... each with a seat and an icon). The ten expression values (Peace, Wonder, Purpose, Will, Order, Beauty, Voice, Play, Devotion, Presence). The nine replacement states (Trust, Worth, Vitality and the rest). The eight compass axes with their teachers. Of his own examples, none matches a measured law by name: Wisdom is a law name in the sniffer's cue table and not in the measured twenty one (section 10b), Will is an expression value but free will is not, and health, fitness, wealth, family, freedom and knowledge are in none.
>
> **Ways it could go.**
> - **A. Free words, as ruled.** Three words each, up to 120 characters. Cost: nothing to build and no ids; every value is a string, so two spellings of one value are two values, and a value has no icon, which collides with his rule "you can't have a fetter without a symbol".
> - **B. Pick from the 21 Laws.** Cost: gives every value a seat and an icon and joins it to the intake. None of his soul examples and none of his body examples is in it.
> - **C. A new list he writes.** Cost: a new canon table, one more word set to keep apart from the laws and the expression values, and the voice pass.
> - **D. Suggestions from the laws and expression, free words accepted.** Cost: two paths; matched when the words match exactly.
>
> **What I would pick, as a recommendation only.** D, and only after he has said which words he wants to be able to type.
>
> **Unblocks** S3 and the icons in layers B and C.

### Q4. What are the six sides of the boundary called?

> **What it is.** The six sides and the five commitments each already exist and he ruled them. The document keeps six and five and changes three names.
>
> **His words.** "partner, family, friends, community, coworkers and alone, five commitments each, thirty in total" (`DECISIONS.md:479-482`). Document: Self, Relationship, Family, Friends, Work or Co-workers, Community (9).
>
> **Ways it could go.**
> - **A. Show the document's names, keep the stored keys.** Alone reads Self, Partner reads Relationship, Coworkers reads Work. Cost: none to the data; the code keeps one name and the screen another, so a person is told Self and the file says alone.
> - **B. Keep his names and change the document.** Cost: none. "Alone" and "Self" are not the same idea, so this is a real choice about meaning.
> - **C. Rename the stored keys.** Cost: an older build reads a renamed record as having no commitments at all, silently. The stored keys are identity and do not rename.
>
> **A question inside it.** Does "alone" mean "self", how I treat myself even with people around? Or only when no one else is there?
>
> **What I would pick, as a recommendation only.** A or B. Not C.
>
> **Unblocks** S3 labels.

### Q5. What has to be true before a non-negotiable counts as tested, and as established?

> **What it is.** The document gives each commitment four states and says the last needs evidence. It does not say how much. That number is not an engineering call.
>
> **His words, in the document.** "'Established' requires evidence." and "Established: longitudinal evidence indicates reliable maintenance." (10.1).
>
> **Ways it could go.**
> - **A. The person says which state it is in.** Cost: honest, no evidence model needed, and "established" then means "I say so".
> - **B. Tested is one record of the commitment holding or being crossed; established is a count of times, across a number of the six sides, over a number of days, with none crossed in the last stretch.** He names the count, the sides, the days and the stretch. Cost: needs the Practice build's evidence first, and the four numbers are his.
> - **C. Stop at tested for now.** Cost: the fourth state waits, and the page shows three.
>
> The words on the page matter too. The product's own practice already uses "held" and "crossed" for a line kept or broken ("The Line Held": "write held or crossed"). "Violation" is the document's word. Which does he want a person to read?
>
> **What I would pick, as a recommendation only.** A now, B when evidence exists, and "crossed".
>
> **Unblocks** S10.

### Q6. Does the page show a Kundalini bar before there is an evidence model for it?

> **What it is.** He ruled the Kundalini bar to be the avatar's main progress: "What you're improving is the conductivity of the kundalini. That's our primary goal with the avatar... progress bars of the kundalini snaking around the chakras... Whether it's blocked or open, and where it's blocked." (`DESIGN-avatar.md` 16). The new document says not to show it as a number and not to build it until the evidence model is defined: "Avoid unsupported statements such as: 'Your Kundalini is 73% activated.'" (18) and "the exact evidence model used to infer and display regulation/Kundalini-related state" is its largest unresolved area (44).
>
> **What exists.** The glossary already defines Kundalini by cleared addresses: "It rises from there to the top of the head once enough addresses along the way are cleared." A derivation was designed and run on the reference people (conductivity per address, seven seats in series), as a prototype only. The product says plainly that it does not measure the aura.
>
> **Ways it could go.**
> - **A. A drawn bar, no printed number, read from the stories and the releases, labelled as what the field says and not a measurement.** Available now, no new evidence model. Cost: still implies a magnitude by its height.
> - **B. Leave the layer out until evidence exists.** Cost: the page ships four layers and his ruled centrepiece is absent.
> - **C. A five state regulation per seat from practice signals.** Cost: months of evidence first; the Practice builds must land.
>
> **What I would pick, as a recommendation only.** A.
>
> **Unblocks** S9, S15, layer D.

### Q7. Is Become a fifth section, or are the new things layers on the Avatar page?

> **What it is.** The document's navigation has Become with four pages. The product's own loop is four names and closes.
>
> **His words.** "The process is discover, play, flow, embody... nothing ships that does not move a person through those four", and "a numbered column of four says the fourth one is the end, which is the opposite of a loop" (`CLAUDE.md`). Document: BECOME: Avatar, Purpose, Boundary, Integrity (30). Today Avatar sits in Discover, in his own order "story, avatar, summary, analytics" (round LV).
>
> **Ways it could go.**
> - **A. No new section. Purpose, Boundary and the rest are layers on the one Avatar page.** The document's own five layers already say this. Cost: none to navigation.
> - **B. A fifth section called Become.** Cost: a fifth point on a four step circle; the owner's loop breaks.
> - **C. Move the Avatar into Embody,** since the document's loop ends "embody, verify, become". Cost: Embody holds Knowledge today, and Avatar leaves the order he gave.
>
> **What I would pick, as a recommendation only.** A.
>
> **Unblocks** S13.

### Q8. Five words in the document already mean something in the product. Which one wins each?

> **What it is.** Naming a thing once. The same word in two places is a defect that has not happened yet.
>
> | Word | What it already means | The document's meaning | Ways |
> |---|---|---|---|
> | Pattern | an address or fetter; one billed sentence; a saboteur; and his own use for domains and archetypes | a recurring mechanism the person confirms | A. Keep the product's meaning and type each candidate by what it points at. B. He picks one meaning and the others get new names. Cost of B: the billing word and the glossary move |
> | Integrity | the 21 Laws; CQ | declared against observed behaviour | A. Call the document's idea Alignment, which is its own layer D label. B. Keep Integrity for both, which is two meanings. |
> | Regulation | the Compass overlay of laws lifting and pulling down | a five state layer | A. A second word for the five states. B. Fold them into the existing overlay |
> | Protocol | the release protocol, the run | an intervention design | A. Keep both and say which. B. Rename the document's |
> | Trace | an overlay on the point cloud; the Story route; the graph | the graph | A. Call the graph something else on screen. B. He retires the other two |
>
> **His words.** "One word per concept" (`CLAUDE.md`). He used "pattern" for the architect, nature and sage grids (`DESIGN-pattern-signal.md`).
>
> **What I would pick, as a recommendation only.** Alignment for the document's integrity; the product's meaning of pattern with typed candidates; the rest case by case.
>
> **Unblocks** every slice that names a surface. Cheapest to decide first.

### Q9. Do the new fields stay inside schema version 2, or does this become version 3?

> **What it is.** CLAUDE.md names this as his: "Schema v2. The gates bump is additive and v1 still loads, but it is the cross compatibility contract with SOURCE." The code is already at version 2. Everything proposed here is additive.
>
> **Why it is not a formality.** A build that does not know a new field drops it silently, and then saves over it. Measured by reading the boundary: it rebuilds the record from the fields it names, and has no closed key set at the top level. So a record exported from this work and imported into the build before it loses the new data with no message. A bump makes the older build refuse and keep the raw record.
>
> **Ways it could go.**
> - **A. Stay in version 2, additive.** Cost: the silent drop on an older build, and SOURCE sees fields it did not agree to.
> - **B. Bump to version 3.** Cost: a new contract with SOURCE; older builds refuse the record, which is the honest failure.
> - **C. Stay in version 2 and add a closed key set at the top level first.** Cost: one small change that makes every later addition refuse by name. Does not help builds already in the wild.
>
> **What I would pick, as a recommendation only.** C, then B when the first Becoming field lands.
>
> **Unblocks** S1 to S4, S6, S10, S15.

### Q10. Who may see the avatar, the boundary and the evidence?

> **What it is.** The practitioner model is a grant of sight over somebody's inner life. It needs consent, a visible list of who can see and a way to take it away. The plan code already hides "the spiritual material" from a cohort lead. The new document adds commitments and, later, evidence of what a person did.
>
> **His words.** A cohort lead sees "Fetters, saboteurs, complexes, hyper complexes, and their analytics. Not the spiritual material and not the story cloud." (`engine/plan.js:97-98`). And "the standing promise is that the record and the story are never held joined" (`DECISIONS.md:36`).
>
> **Ways it could go.**
> - **A. Hidden from a practitioner, all of it.** Cost: the practitioner cannot help with the thing the product is now centred on.
> - **B. The person shares item by item.** Cost: a visibility flag on every object and a list to keep honest.
> - **C. Boundary and avatar visible, evidence not.** Cost: a line to defend; commitments are exactly the "spiritual material".
>
> Also open: which tier sees the avatar features at all. No ruling names them.
>
> **What I would pick, as a recommendation only.** A until the grant surface exists. The data model can wait for it.
>
> **Unblocks** the shape of S10 and S12, not the first slices.

### Q11. Streaks and badges, or meaningful change per unit of practice?

> **What it is.** The document says "The system optimizes for meaningful change, not streak length" (40.24). The ladder counts a streak and awards day marks, and he asked for a sticky award system. A known defect: the streak counts days a ritual was set, not only done.
>
> **Ways it could go.** A. Keep the streak and marks and add the document's measure beside them. B. Replace the streak with practised days and change measured against the avatar. C. Keep both but stop the streak counting a day that was set and not done.
>
> **What I would pick, as a recommendation only.** C now.
>
> **Unblocks** analytics only. Not on the path.

### Q12. Should the sniffer read what a person did, or only how they felt?

> **What it is.** It reads feelings and body words. "I stated the concern directly." reads as nothing. The document's loop, its evidence and its Integrity assume the journal can say whether a person acted in line with the avatar.
>
> **His words.** "it doesn't use definitions, it's discerning the energy behind the story... source's job isn't to dig deeper, it's just to go cool" (round GO). Document: "EVIDENCE: 'I stated the concern directly.'" (38).
>
> **Ways it could go.**
> - **A. No. Behaviour is entered by the person as a structured record,** in the Practice build's evidence capture. The sniffer stays a body reader. Cost: more for the person to enter.
> - **B. A short list of behaviour cues, with their own provenance and a version bump.** Cost: false positives on a feelings instrument, and the lexicon version moves.
> - **C. A model reads behaviours.** Cost: a backend, a consent line and a privacy ruling; his narrowed ruling is aggregated word combinations to refine the lexicon, not a model reading a person.
>
> **What I would pick, as a recommendation only.** A.
>
> **Unblocks** S14, and decides whether the document's end to end scenario can ever run.

---

## 13. The redesign brief

For the art director, the innovation seat and the animation seat. It does not
design the page. It says what the page must answer, what to draw it in, what
moves, and what may not be made up.

### 13a. What the page has to answer

The document's six questions, against what the product can answer today. A
design that draws an answer the product cannot give is a drawing of nothing.

| Question | Answerable today from | How honest | Not to fake |
|---|---|---|---|
| Who am I becoming? | the pairs, one per seat; the archetype pins | complete for what the person wrote | a portrait. "An avatar a person reads is a portrait. An avatar a person turns is an instrument." (`DESIGN-avatar.md`) |
| Why? | the six values, the derived readings | only after S3; today nothing can write it | a purpose sentence the person did not write (Q2) |
| What protects that identity? | the thirty commitments | only after S3 and S4 | an "established" boundary (Q5) |
| What am I practicing? | active ritual plans, the per seat rule, Cycles, Today | real, from day rows and plans | completion shown as change (T1 option A) |
| What is obstructing me? | the Running saboteurs with direction; seats still carrying | real, from the field | an "avoidance" or a "people pleasing" the sniffer cannot read |
| What evidence shows change? | the share of the weight held when the pair was written that has since gone; practised days; the snapshot history | the first two are real; behavioural evidence does not exist | a behaviour result. Nothing records one |

### 13b. Which of the five layers is drawn in which existing visual language

These are the languages the product has. One of them is a mockup.

- **The Field.** The wheel of the seven seats and 112 addresses, nested frames and
  dial with callouts, segmented rings and tick rings (`ui/rings.js`). Seat
  colours from `seatCol`.
- **The Compass.** One axis, coherence at the top, decoherence at the bottom, the
  eight teachers' poles, the three laws lifting and the three pulling down drawn
  on the spine (`ui/cone.js`), and a point cloud registers view.
- **The Body.** The nerve map, one map with one overlay switch (round JZ). The
  Kundalini flow layer "the snake going around the seven chakras rising" was
  ruled there and not built.
- **The Seal masks.** UNVERIFIED as a shipped language. The owner chose Seal and
  asked for three variations (round NX). Those are standalone mockups in
  `mockups/character/` and the shipped Character page is still the pixel mask
  grids, graded D plus. A brief that borrows from Seal borrows from a mockup.

| Layer | Draw it in | Why, and what it already is |
|---|---|---|
| A. Identity | the Field's seat ring, with a Seal style core: the leading symbol at the centre and the rest orbiting at weight | the ring is built and approved; the core already wears the selected seat's symbol. Seal is the candidate for the centre only, if the owner confirms it |
| B. Purpose | the Compass's two pyramids with a gap of limbo between them | his own description: "two arrows, one pointing up, one pointing down, or two pyramids... with a little gap of limbo in between" (round HS, `DECISIONS.md`); and "the pit is a downward triangle, the same downward triangle as the Purpose map" |
| C. Boundary | the Field's segmented ring, six facets, five marks on each | six segments is a ring the Field already draws; the Boundary overlay on the Compass is held to the backlog by his own words, so do not put it there unasked |
| D. Alignment | the Body for Kundalini, if Q6 allows it; the Compass for laws lifting and pulling down; the existing tension lines for running saboteurs | each already exists as a drawing or a ruling; none of the three is on the Avatar page except the lines |
| E. Practice | the Ritual page's dash ring, "four things is four dashes", one ring per seat | the grammar already exists; the Avatar page already draws day dashes and Cycles rings. A tick per ritual element per seat is the same mark |

### 13c. What is dynamic and what is static

**Static, written by the person, changes rarely:** the avatar's name, title and
description; the pair text per seat; the six purpose words; the thirty
commitments; the structure of the ring.

**Dynamic, read from the engine or the record:**

- the arc on a seat, the share of the weight held when the pair was written that
  has since gone;
- the running saboteur lines, with a pulse that travels while loading and away
  while releasing, "never on a timer" (`ui/avatarui.js:417-427`);
- tick state: done, due, missed, active;
- Cycles, from practised days;
- the Kundalini height, if Q6 allows, from the field's conductivity;
- candidate links, once S5 exists, and only when asked for;
- a non-negotiable's tested and established, derived from evidence.

**Motion rules the owner has already given.** The laws of animation obeyed, "ease
in and out to perfection that you can feel" (EV, EZ). A motion is a direction of
a real change and never decoration. The page must hold still on a blank profile.
Motion off for people who ask for it. The pleaser loading and releasing loop he
called "really excellent" is the model.

### 13d. What must not be invented

- **No value icons or value names.** No ontology exists (Q3). His icon rule, "no text
  by itself if it describes something without an icon", cannot be met for free
  words, so this is decided before it is drawn.
- **No percent on archetypes, no "3 of 14", no printed regulation or Kundalini
  number** unless Q6 and a later ruling say so. The completion is drawn.
- **No six new hues for the six intervention types.** The product has seat colours
  and four track colours. Six types need an art direction ruling, drawn from
  existing tokens. Icons are ring, not fill. Four lightings and Punch must
  carry it.
- **No text that describes a section.** "A section never describes itself" (HS), and
  "The center column is sacrosanct for art. Not for text. The right column is for
  text. The bottom underneath the art is for text." (BIBLE 5.2a).
- **No portrait.** He rejected "a bunch of text boxes" and also a portrait: the page
  is an instrument a person turns.
- **No seat drawn as healed by a ritual.** T1 option A: a completed ritual moves its
  own progress, never a seat's charge.
- **No red for a missed ritual.** The document says never shame; he uses the word
  Missed. A missed tick is a fact, not a failure state.
- **No claim of measuring the spirit.** The product says it does not measure the aura.
- **No content on a blank profile.** "Anything that renders there renders to
  somebody who has entered nothing" (`CLAUDE.md`). The empty state is the design.
- **No new visual language.** Seal is a mockup, not yet a language.
- **No candidate that interrupts the Story.** The person leads (round GO).

### 13e. The left rail, and where the two pieces of work meet

The owner has asked for the left rail's celestial and archetype sections to be
redesigned in the Field and Compass visual language. That is separate work and
this brief does not do it. The sections are the Awareness block of root domains,
blueprint domains and primary and secondary archetypes (`shell/body.html:720`,
`data-sec="soul"`), and Root energetics at the head of the rail.

They meet in six places. Settle them before either side draws a new mark.

1. **Archetypes are on both pages.** The rail picks a primary and a secondary of
   twelve. The Avatar page's Archetypes subtab rates all twelve one to five and
   pins the three the field reads as embodied (`ui/avatarui.js:1165`). They are
   one icon set (`ARCH[].ic`). If the rail gets a new archetype mark, the Avatar
   page must get the same one.
2. **The rail's picks feed the Avatar's pins.** The embodied pin reads
   `compute().aff`, built from the soul's domain vector, which the rail edits.
   A change in the rail changes the Avatar page.
3. **Layer A may want the rail's archetype or birth-derived identity as its
   representation.** Decide whether the avatar's face is the archetype, the seat
   symbol, or both, once.
4. **Shared grammar.** Seat colours, ring and tick marks, the same segmented ring
   for six facets and for the domain wheel.
5. **First visit.** `ui/panels.js:236` opens the rail's `soul` and `lean` sections
   the first time the Field is reached. Whether the Avatar tab shows the rails at
   all is UNVERIFIED: the page covers the middle with `#iq` (`shell/head.html:4807`)
   and no browser gate was run for this audit.
6. **The word.** "Celestial" is the rail's name for birth systems. The document's
   "Avatar" and "Archetype" must not pick up that vocabulary.

---

## 14. What I could not verify

- **Any pixel.** No browser gate was run, as instructed. Nothing about the
  rendered Avatar page at 1600 or 390 is measured.
- **What the Practice and Trace builds will expose.** Neither is merged. Section 11
  names the four interfaces Becoming needs; whether they land is UNVERIFIED (R65).
- **Whether the Avatar tab shows the left and right rails.** Section 13e item 5.
- **Retention figures and anything server side.** `reboot-os` is not in this session
  (R88).
- **Whether the owner has seen the document's own scenario run.** The probes in
  section 9 are mine, on the committed `engine.js`, which has not changed in its
  source since it was last built.
- **The Seal masks as a shipped language.** Mockups only.
- **The "Today" and "Insights" pages the document names.** Neither exists, and neither
  is specified in enough detail to audit.
