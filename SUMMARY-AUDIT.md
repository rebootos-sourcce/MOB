
# Summary audit. The Daily Summary TDD against the code

The document: `ATUNED-daily-summary-personal-mirror-TDD.md`, the expanded
version, sections 1 to 34, read in full. Its short form ends at section 27;
sections 28 to 34 are the focus group decisions, the quality scoring, the
pseudocode, the end to end scenario, the architecture, the priorities and the
final rule. The owner's instruction: "review, this is for today's build.
understand it how it wires in, what needs to be built, and where it goes in
development." This is the review. Shape follows `POINTS-AUDIT.md`,
`BECOMING-AUDIT.md` and `PRACTICE-AUDIT.md`: every requirement classed EXISTS,
PARTIAL, MISSING, CONFLICT or UNVERIFIED against the real code, because
documentation is not implementation. Those three audits are reused, not
redone. Where one of them already settled a finding it is cited by row.

## The stamp on this measurement

    commit        06f5c52, the tip of claude/laughing-feynman-xhfyj3. It carries
                  engine/practice.js and engine/trace.js, both built and merged,
                  and the Intake page restore. `node tests/engine.js` against
                  that commit read 3039 passed, 0 failed. `node tests/trace.js`
                  alone read 266 passed, `node tests/practice.js` alone read 775.
    read          ui/summary.js whole; ui/panels.js 70 to 140; ui/ui.js 1425 to
                  1440; engine/schema.js 13 to 125, 205 to 330, 418 to 455, 791
                  to 1130, 1425 to 1450; engine/ladder.js whole; engine/avatar.js
                  whole; engine/verp.js 1 to 40, 330 to 360, 565 to 592;
                  engine/sourceai.js 1 to 130; engine/practice.js 1 to 290, 840
                  to 1066; engine/trace.js 1 to 260, 437 to 575, 663 to 885;
                  engine/outbox.js 17 to 40; engine/plan.js 85 to 106; engine/core.js
                  40 to 90, 150 to 260; ui/drills.js 1015 to 1050; ui/storyui.js 351
                  to 415, 466 to 474; ui/auth.js 1 to 30; ui/rootsum.js 1 to 25;
                  engine/overlap.js 1 to 30; tests/engine.js 5620 to 5630;
                  tests/practice.js 40 to 140; .claude/skills/atuned-voice/brief.py
                  1 to 150, 1201 to 1350 and the rule list; CREATIVE-BRIEF-voice.md
                  150 to 200; DECISIONS.md 28 to 40, 160 to 168, 459 to 478, 640
                  to 655, 915 to 1010, 1365 to 1385; TASKS.md rounds FV, ME, NS, NT
                  and NU; BIBLE.md 283 to 292 and 1385 to 1400; COPY-OBJECTIONS.md
                  CO-05; DESIGN-sniffer.md question 12; AUDIT-source-tdd-v3.md
                  section 1; CLAUDE.md whole.
    measured      every number marked X in the text was run against the built
                  engine, not read. The probes are in appendix A, whole.
    not run       any browser gate (Chromium was busy). Nothing here makes a
                  claim about pixels. Section 8's layout question therefore
                  carries wireframes, not screenshots, and says so.

The built engine was written to a scratch path
(`sh atuned_src/BUILD-engine.sh <scratch>/engine.js`), so the tracked
`engine.js` is untouched. No file under `atuned_src/` changed. No schema
version moved.

## How the statuses are counted

Not typed here. A count typed into a document that the table then grows past is
the defect CLAUDE.md records twelve times. Read it off the table:

    grep -oE '\| (EXISTS|PARTIAL|MISSING|CONFLICT|UNVERIFIED) \|' SUMMARY-AUDIT.md | sort | uniq -c
    awk -F'|' '/^\| M[0-9]+ /{gsub(/ /,"",$5); c[$5]++} END{for(k in c)print k, c[k]}' SUMMARY-AUDIT.md | sort
    grep -c '^| M[0-9]' SUMMARY-AUDIT.md

The first reads every status cell in the file. The second reads only the
requirement table in section 3 and is the one to quote. The third counts the
rows. What the document itself carries, read off it the same way (appendix A,
probe X3): the event names in section 17, the forbidden phrases in section 12,
the change triggers in section 9, the acceptance criteria in section 26, the
routes in section 23, the pipeline steps in section 6.

**Terms, said once in plain words, because a term of art without its meaning is
shorthand.**

- **Sealed day.** One day's summary, written to the record once and never
  edited afterwards. The document calls it an immutable snapshot.
- **Rung.** A named step on a short ladder that is read off counts a person
  could check, such as "seen on three separate days". It replaces a number
  between 0 and 1 that nobody can check. `engine/sourceai.js` 37 already works
  this way.
- **Grounding pass.** A check run on a finished summary before it is shown or
  saved. It refuses a sentence that cites evidence that is not on the record,
  prints a number it was not given, states a cause, or tells the person who
  they are.
- **Evidence drawer.** The panel behind "Why did you say this?". It lists the
  records a sentence was built from and the chain between them.
- **Trace graph.** `engine/trace.js`. A list of typed links between things the
  record already holds: a story, an address, a release, a ritual, a practice
  event, a piece of evidence.
- **Boundary.** `validateProfile` in `engine/schema.js`. The one door every
  pasted or loaded record goes through. It refuses a bad field by name.
- **Additive.** A change an older record survives: it has none of the new field
  and is filled from the blank.
- **Seat, address, charge, fetter.** The product's own words for a place in
  the body, one of 112 points on it, what is held there, and one of nine kinds
  of held charge. They are canon, not jargon to be replaced.

---

## 1. Read this first

The findings that change what gets built. The rest of the file is evidence.

- **A Summary that reads only what exists is real today, and it is smaller
  than the document.** The record already holds dated, append only inputs:
  history rows, story entries, the ritual day log, the release meter's dated
  firsts. A pure function over them can state what moved across 7, 30 and 90
  days, what recurs, and where a said thing and a done thing differ. It cannot
  state behaviour, because nothing records behaviour (finding 2).
- **Nothing in the product records what a person did, so the document's
  evidence hierarchy has no top.** Level 1 is "direct observed behavior" and
  level 2 "explicit user statement". The Practice domain has the objects for
  both and no screen writes them (searched `ui/` for `practiceDo`,
  `traceFromRecord`, `traceApply`: no caller). The sniffer reads feelings and
  body words. Probe X4: "I postponed the conversation again.", "I handled the
  situation directly." and "I stated the concern directly." read as nothing,
  no imprint and no cue. "I put it off again and changed the subject." reads
  two cues of aversion, because "put it off" is in a six phrase list
  (`engine/verp.js` 23); "postponed" is not. The document's own scenario
  (section 31) cannot be produced from the journal.
- **The evidence drawer is buildable now, and it works.** Probe X5 built the
  scenario through the real Practice door and read it through the real trace
  graph: from a piece of evidence to its goal is two links
  (`evidence supports pattern`, `pattern obstructs goal`); from a story to a
  piece of evidence is two links through the shared address; negative evidence
  appears as a `contradicts` link. Three limits: no node type exists for an
  intention, an integrity event, an avatar item or a summary statement
  (`engine/trace.js` 67 to 70); a story that says "postponed" is not connected
  to the negative evidence record, because the sniffer read nothing in it
  (X5); and the graph re-reads every story under today's lexicon, so a drawer
  over an old summary would show today's reading, not what the person was shown
  (`engine/trace.js` 778). A sealed statement has to keep the addresses it
  read.
- **A seam defect between the two merged builds hits the drawer.** Practice
  allows a protocol to target `fetter:Fear` (`practicePatternOk`,
  `engine/practice.js` 283). The trace graph accepts only an address number.
  Probe X6: `fetter:Fear` is refused twice with "is not an address number", so
  every intent from a fetter targeted protocol is dropped from the graph. Not
  fixed here. It is the technical director's (T1, section 9).
- **Four things the document assumes are not there.** Intention, a Pattern
  with a status, an integrity event, and a model. The product has no intention
  object (the word means three other things, conflict 8), patterns are readings
  rebuilt on every call (`engine/compute.js` 266 to 322), nothing records an
  integrity event, and no model is called anywhere (`ui/storyui.js` 469 to 474,
  "Scripted. No model is called").
- **The document and the owner each wrote a Summary, and they are different
  things.** The owner ruled at round FV (`TASKS.md` 17089 to 17092): "what I
  want source to do is to take a look at all the behavioral energetics where
  they overlap, because that's the truth. And then use that as the summary."
  That shipped as the energetic summary (`ui/rootsum.js`) and the convergence
  block on the Summary tab (`ui/summary.js` 419 to 470). The document's Summary
  is a behavioural mirror over evidence. The page itself is a third thing, a
  reading of the field. One word, three meanings (conflict 11).
- **The document forbids language the owner uses, and the gate does not
  enforce the document.** Probe, section 4c: "Your soul evolution is shifting
  and your spiritual vibration is rising." passes the brief gate with no
  finding. "The ritual caused the change in how you speak." passes too. "You
  are acting courageously." passes, which is the sentence section 7 says never
  to write. The gate does flag "You're clear about what you want to do", which
  is the opening of the document's own Day 1 summary. Which of the two wins is
  owner question 1.
- **"Daily" cannot be literal without a server.** Nothing runs when the app is
  closed. Today the page recomputes on every render (`ui/ui.js` 1437, inside
  `render()` at 1041). A summary exists for a day only if the app was opened
  that day. History rows are not daily either: they are written by four events
  (`ui/intakeui.js` 748, `ui/avatarui.js` 1773, `ui/release.js` 845,
  `ui/storyui.js` 412), so a story day can carry several and a quiet day none.
- **A summary key added without its boundary entry is deleted on the next
  load.** Probe X7: a record with `summaries` set validates and the key is
  gone. Same finding `POINTS-AUDIT.md` made for `p.progress` and
  `BECOMING-AUDIT.md` for new top level keys.
- **Storage is not free.** Probe X2: a sealed summary with rendered text and
  evidence references is about 2.2 KB, so a year is about 0.8 MB; template ids
  and arguments alone are about 0.9 KB, a year about 0.3 MB. The whole record
  of every profile on the device is one storage key written whole on every save
  (`engine/schema.js` 418 to 431). A heavy year of history, stories, practice
  at three events a day and summaries is about 2.5 MB (X2), against a browser
  ceiling that is commonly about 5 MB per site and was not measured here.
- **The numeric parts of the document conflict with rulings, and the cure is
  the same each time:** a count a person can check in place of a number
  between 0 and 1 (confidence, section 13), a countable ordering in place of a
  product of five factors (the Focus Score, section 10), and counts of days and
  entries in place of "11 of 12" (house gate: "11 of your last" is stopped as a
  naked number, measured).

---

## 2. How it wires in

What the Summary engine would read, from where, today, and which section of
the document each input serves. File and line are at 06f5c52. A line number is
a place to start reading, not a promise that the file has not moved.

### 2a. The inputs

| Input | Where it lives and what writes it | Read by today | Serves TDD |
|---|---|---|---|
| The current reading `r` | `compute()` `engine/compute.js` 228, off shared state `S` and `W`. Returns CQ, DQ, tier, heaviest address, saboteurs, complexes, hyper complexes, weakest law, `unread`. The impure core: a caller needs the profile loaded | `sumRender` `ui/summary.js` 521 | 3 current state, 5A, 5C, 10 impact |
| The Summary tab | `sumRender` 521, `sumUnread` 537, `sumPlate` 590, `sumOutput` 622, `sumFull` 703, `sumStory` 226, `sumIg` 858, `sumToldHtml` 198, `sumWire` 910. Host `#sumbody` inside `#sum` (`shell/body.html` 931). Rebuilt by `render()` (`ui/ui.js` 1437) and on entry (`ui/panels.js` 280, inside `setTab` at 80). Emptied on exit (`ui/panels.js` 99 to 100) | the person | 5 whole, 14 template |
| Snapshot history | `snapshot` `engine/schema.js` 253, `snapLaws` 299, `pSnap` 450, validated at 1042 to 1083. Row keys, read off the build (X1): `t m cq dq sq pole jq rad loaded sab cx hy ch dark tier arch lawNow`. `lawNow` is the 21 laws as CQ read them, three places, null if unanswered. Written by four events; no cap. `lawSeries` 311, `seriesRead` `engine/ladder.js` 262, `SPANS` 257 (day, week, month, quarter, year, five years) | `sumIg` and the Record view | 9 change, 11 trend, 15 history, 26.7 |
| Story entries | `p.story.entries[]`, keys `t text imprints bands lex asked` (`engine/schema.js` 721), written at the commit (`ui/storyui.js` 389 to 412). `imprints` is a count, `bands` is seat to charge. Addresses are not stored: they are re-read. Never deleted (T2, `TASKS.md` 29280) | `sumToldHtml` (newest three) | 4.10, 7 levels 2 and 3, 16 |
| The sniffer | `parseStory` `engine/sniff.js` 479, `sniffStory` 1311, `sniffLaws` 1112, `sniffSaboteurs` 1074, `LEX_VERSION` 903 (a hash of the lexicon). `verpScan` `engine/verp.js` 338 counts cue phrases per gate, aversion among them. `srcPrior` `engine/sourceai.js` 102, `srcRung` 111, `srcHear` 123: recurrence as a count ladder | the Story page | 7 levels 3 and 6, 9 repeated behaviour (words only) |
| The ritual day log | `p.rituals[]`, `{t, track, band, steps, min, when, where, done}` (`engine/schema.js` 516, 649). `pracDay` `engine/ladder.js` 27, `streakRead` 46, `ledgerRead` 84, `intentionRead` 136, `ladderRead` 236. The plans, with their address, live beside the record under `atuned-ritual-active` (`ui/ritual.js` 171) and are not exported | the Ritual tab | 4.9, 7 level 4, 5D, 5F |
| The release meter | `p.meter` `{lines, unique, firsts, relLines, truthLines}`; `meterRead` `engine/schema.js` 1394; `meterFirst` 1425, a dated once only list | the release card | 8 release, 9 pattern released, 17 PATTERN_RELEASED |
| The avatar and purpose | `p.avatar {built, at, reviewedAt, pairs[{be, notbe, seat?}]}`, `p.purpose {soul, ego, sides}`. `avatarGap` `engine/avatar.js` 38, `avatarDue` 26, `purposeRead` 86, `boundaryCross` 105 (no caller). The pair to seat to load resolver `avRows` is in `ui/drills.js` 1024, in the UI half | `sumStory` paragraph three | 4.1, 4.2, 5B, 21C |
| Practice (new, merged) | `engine/practice.js`: Goal, BehaviorObjective, Protocol, ProtocolStep, Ritual, PracticeEvent, Evidence, Outcome, the log; `practiceDo` 841, `practiceMissRead` 880, `practiceEffectAffect` 907, `practiceOutcomeRead` 931, `practiceStage` 939, `practiceTraceIntents` 998. On the record as `p.practice`. **No screen writes it**, so it is empty for every real person | nothing | 4.9, 4.5, 7 levels 1, 2, 4, 5, 9, 21A, 21B, 28.5 |
| Trace graph (new, merged) | `engine/trace.js`: `traceFromRecord` 751, `traceApply` 663, `tracePath` 454, `traceNeighbors` 437, `traceOrphans` 541, `validateTrace` 578, `TRACE_RULES` 114 to 183, the cause rule 206. Stored half `p.trace`. **No screen reads or writes it** | nothing | 16, 28.2, 8 |
| The ladder's marks | `MARKS` `engine/ladder.js` 160, `ladderRead` 236. Recomputed on every read, so a mark can be un-earned (`POINTS-AUDIT.md` X9, X10) | the Record view (`ui/record.js`) | 20 finding 10 |
| Profile systems | `converge` `engine/birth.js` 191, `engine/overlap.js`, `lensWestern` and its three siblings `ui/summary.js` 6 to 50, `sumSpirit` 419, `sumNum` 473 | `sumFull` right column | 4.3, 12, 20 finding 4 |
| Becoming and Points (not built) | audited in `BECOMING-AUDIT.md` and `POINTS-AUDIT.md` | nothing | 4.1 to 4.8, 17 |

### 2b. What the existing Summary already is

The page is a deterministic, template written reading. Every sentence in
`sumStory` is conditional on the value it names existing, and the page says so:
"Nothing here is generated from anything the instrument has not measured"
(`ui/summary.js` 326). That is the same posture as the document's "no
fabricated evidence", and it is why the composer in section 4 is an extension
of the page's own method and not a new kind of thing.

What it does that the document wants, by section:

| It already does | TDD |
|---|---|
| Their own words first, the reading after: "evidence goes first" (`ui/summary.js` 707 to 710) | 7, 20 finding 3, 28.2 |
| Names the avatar pair still blocked and the charge blocking it (279 to 300) | 5B, 5C, 4.2 |
| A next action: the protocol this state calls for, release this first, next marker (`sumOutput` 622) | 5E, 14 TRY THIS |
| Integrity over time, day to five years (`sumIg` 858) | 5G, 11, 15 |
| Silent on an unread record: a dash and four doors, never a figure off a default (`sumUnread` 537) | 13 suppress weak, 26.3 |
| Profile systems as five readings and a count of how many point the same way (419 to 470) | 12 "several parts of your profile point toward the same themes", 20 finding 4 |

What it does not do: no sentence about change over time, no evidence behind a
sentence, no contradiction, no summary stored, no intention, no per day unit.

### 2c. What the Practice and Trace builds give, and what they do not

They give, host free and gated, the objects and the graph the document's
sections 4.5, 4.9, 12, 14, 16 and 28 describe: negative evidence as a first
class type, a provenance of five states that never collapse, a refusal to
derive a cause, a numbered append only log, a boundary that refuses payment and
account fields by name. They do not give a writer. Until the Ritual tab's
writer moves onto PracticeEvents (`PRACTICE-AUDIT.md` "What the Ritual tab
stores today"), `p.practice` is empty, and every Summary slice that reads it
must say "no record yet" and not "no change".

---

## 3. The requirement table

Columns: requirement with the document's section, what the code has now, the
status, file and line at 06f5c52, and the change. The change names a slice from
section 4 (D1 to D11 start now with no server; A1 to A4 wait for the accounts
decision) or says it waits on another build.

| # | Requirement | Current implementation | Status | File and line | Change and slice |
|---|---|---|---|---|---|
| M01 | The Summary is a daily mirror: what is operating, changing, in the way, deserves attention (s1) | A reading of current state in prose, an output row, a chart. Nothing in sentences about change or attention over time | PARTIAL | ui/summary.js 226, 622, 703 | D3 composer, D7 surface |
| M02 | Generate a fresh daily summary (s2 P0.1, s6) | The page recomputes on every render. No unit is a day, and no summary exists for a day nobody opened the app | PARTIAL | ui/ui.js 1437; ui/panels.js 280; ui/summary.js 521 | D3, D6. Owner question 3 |
| M03 | Explain the current behavioural state in plain language (s2 P0.2) | `sumStory` writes three paragraphs off charge, seat and avatar gap. It reads feelings and body words, not behaviour (X4) | PARTIAL | ui/summary.js 226 to 326; engine/sniff.js 479 | Keep. Behaviour waits on D11 and owner question 8 |
| M04 | Connect desired identity to actual behaviour (s2 P0.3) | The avatar pair resolves to a seat and a load: identity to field, never to behaviour | PARTIAL | ui/summary.js 279 to 300; ui/drills.js 1024; engine/avatar.js 38 | D2 carries the resolver into the engine. Behaviour waits |
| M05 | Show what is changing and what still interferes (s2 P0.4) | A chart of CQ over a span; what is held is in prose. No sentence about change | PARTIAL | ui/summary.js 858; engine/ladder.js 262; engine/schema.js 311 | D2, D3 |
| M06 | Incorporate intention (s2 P0.5, s4.7) | None. The word names the laws' band mean, the ritual said against done, and one of six gates | MISSING | engine/ladder.js 110 to 145; engine/verp.js 11 | D8 and owner question 4. Word conflict 8 |
| M07 | Incorporate integrity as intention against behaviour (s2 P0.5, s4.8) | Ritual said against done over seven days, ruled 25 September, on no surface. In this product integrity already means the 21 laws | PARTIAL | engine/ladder.js 136 to 145; DESIGN-integrity.md | D2 reads `intentionRead`. Word conflict 8 |
| M08 | Connect patterns to rituals and observed outcomes (s2 P0.6) | Practice carries target patterns, evidence and outcomes; no screen writes them. The day log carries a seat and no pattern | PARTIAL | engine/practice.js 177 to 253, 998; engine/schema.js 516, 649 | Waits on the Practice writer. D2 reads it when present |
| M09 | Preserve daily summaries as historical snapshots (s2 P0.7, s15) | History rows are numbers only, written by events, not daily, no text | PARTIAL | engine/schema.js 253 to 259, 450 to 452 | D6, a separate list. Not `p.history` (section 4) |
| M10 | Detect meaningful change across time (s2 P0.8, s9) | A direction over a span, per law and for CQ. No threshold for material | PARTIAL | engine/ladder.js 262 to 288; engine/schema.js 311 | D2 |
| M11 | Identify the highest leverage area (s2 P0.9, s10) | The heaviest address is offered to release first | PARTIAL | ui/summary.js 622 to 700; ui/ritual.js 82 | D2 ordering. Conflict 4 |
| M12 | Keep interpretation separate from evidence (s2 P0.10, s7) | Words first, reading after. No typed separation per sentence | PARTIAL | ui/summary.js 326, 707 to 711 | D3 provenance on every statement |
| M13 | Not diagnose, not predict, not rank a person's worth, not a points dashboard (s2 non goals, s27) | A house rule, mechanically checked: diagnosis, shame, certainty and identity rules in the brief gate | EXISTS | .claude/skills/atuned-voice/brief.py 1227, 1268, 1300, 1318; BIBLE.md 289 | Keep. D4 runs it on the output |
| M14 | Profile systems are context, never measurement (s2, s4.3, s20 F4, s12) | The page states five systems "read independently off one birth date" and how many point the same way | PARTIAL | ui/summary.js 419 to 470; engine/overlap.js 1 to 30 | Keep. Composer says "point toward" only |
| M15 | Person object with avatar_id, purpose_id, boundary_id, profile_ids (s4.1) | The record is the person. A second owner key inside it is two truths | CONFLICT | engine/schema.js 15; BECOMING-AUDIT.md R02 | Do not build. Conflict 7 |
| M16 | Avatar as lists of qualities, values, behaviours, traits, anti traits (s4.2) | Seven seat pairs, each `be` and `notbe`; half a pair is refused | CONFLICT | engine/avatar.js 18 to 25; engine/schema.js 967 to 1007 | Becoming Q1. Conflict 7 |
| M17 | Energetic and profile configuration with inputs and confidence (s4.3) | Derived on read from soul and birth data; nothing stored. A confidence float conflicts | PARTIAL | engine/birth.js 191; engine/overlap.js | Keep derived |
| M18 | Archetype with desired expressions and shadow relationships (s4.4) | Twelve archetypes on the soul. The page's 1 to 5 rating sits beside the record and is not exported | PARTIAL | engine/data/canon.js 407; ui/avatarui.js 149, 268 | Becoming S1 |
| M19 | Shadow or interference relationship with strength and evidence ids (s4.5) | Trace holds `pattern obstructs goal` and `pattern obstructs behavior`, with provenance, and evidence that supports or contradicts a pattern. No strength, by design | PARTIAL | engine/trace.js 114 to 183; engine/practice.js 998 to 1024 | Read through D5 |
| M20 | Pattern object with status and weight (s4.6) | A pattern is a reading rebuilt on every call. No id, no status. Trace has one node per address and no state | MISSING | engine/compute.js 266 to 322; engine/trace.js 729 | Not P0. D2 reports counts only |
| M21 | Intention object (s4.7) | None | MISSING | none | D8, owner question 4 |
| M22 | Integrity event object (s4.8) | None. Derivable only from ritual said against done | MISSING | none | D2 derives; the object waits |
| M23 | Ritual with target patterns, behaviours and archetypes (s4.9) | Practice Ritual and Protocol carry target patterns. The legacy ritual carries a seat. The plan's address lives beside the record | PARTIAL | engine/practice.js 177 to 253; ui/ritual.js 171 to 231 | Waits on the Ritual writer cutover |
| M24 | Journal event with detected patterns, behaviours, intentions and boundary events (s4.10) | Entry has a count and seat charges; patterns re-read; no behaviours; `boundaryCross` has no caller | PARTIAL | engine/schema.js 721; ui/storyui.js 389 to 412; engine/avatar.js 105 | D2 reads on demand, stores nothing |
| M25 | Daily Summary Snapshot object (s4.11) | None | MISSING | none | D1, D6 |
| M26 | `language_confidence` as a number (s4.11, s13) | None. A named confidence band was measured and rejected as "a label that lies" | CONFLICT | AUDIT-source-tdd-v3.md 24; engine/sourceai.js 37 | A rung name, never a float. Refused by name. Conflict 4 |
| M27 | A. Today: date, one sentence mirror, state, most noticeable (s5A) | The plate: first name, band, direction out. No sentence. Unread shows four doors | PARTIAL | ui/summary.js 537, 590 to 620 | D7. Owner question 2 |
| M28 | B. What is expressing (s5B) | "Every seat your avatar depends on is passing" and the seat that flows | PARTIAL | ui/summary.js 279 to 300 | D3 |
| M29 | C. What is interfering (s5C) | Heaviest seat, loudest saboteur, where flow stops | PARTIAL | ui/summary.js 259 to 275 | D3 |
| M30 | D. What is changing (s5D) | The integrity chart only | PARTIAL | ui/summary.js 858 | D2, D3 |
| M31 | E. What needs attention, with a suggested practice (s5E, s14 TRY THIS) | The output row: the protocol this state calls for, release this first, next marker | PARTIAL | ui/summary.js 622 to 700; ui/ritual.js 82 | D3 keeps it. Pattern linked advice waits |
| M32 | F. Today's intention (s5F) | None | MISSING | none | D8 |
| M33 | G. History: snapshots, 7, 30 and 90 day trends, transitions (s5G, s15) | Spans day to five years drawn as one line of CQ. No "since the beginning" | PARTIAL | engine/ladder.js 257 to 288; ui/summary.js 858 | D7 |
| M34 | H. Explore: from any statement to pattern, ritual, evidence, avatar, purpose, boundary, archetype, knowledge, achievement (s5H, s16) | Presses on the page open drills for a seat, the core, a number. None lands on evidence | PARTIAL | ui/summary.js 910 to 954 | D5, D7 |
| M35 | Pipeline 1 to 9: collect state, evidence, avatar, purpose, boundary, intentions, rituals, patterns, archetypes, integrity (s6) | `compute`, entries, avatar, purpose, day log, history are read by the page. Practice exists and is empty | PARTIAL | engine/compute.js 228; engine/schema.js; engine/practice.js | D2 |
| M36 | Pipeline 10: compare historical snapshots (s6) | `lawSeries`, `seriesRead` | PARTIAL | engine/schema.js 311; engine/ladder.js 262 | D2 |
| M37 | Pipeline 11 to 13: detect changes, relationships, rank interventions (s6, s30) | No such function. `ritFor` picks by the heaviest seat | MISSING | ui/ritual.js 82 | D2 |
| M38 | Pipeline 14: generate a grounded interpretation (s6, s30) | `sumStory` is a deterministic template composer over the reading, not over evidence or change | PARTIAL | ui/summary.js 226 | D3 |
| M39 | Pipeline 15: language safety and grounding pass on the output (s6, s30) | The voice gate reads source strings at build time. Nothing checks the sentence a person is shown | PARTIAL | .claude/skills/atuned-voice/brief.py; check.py 751 | D4 |
| M40 | Pipeline 16: attach evidence (s6) | None | MISSING | none | D3, D5 |
| M41 | Pipeline 17: save an immutable daily snapshot (s6) | None | MISSING | none | D6 |
| M42 | Deterministic draft step, no model in the pipeline (s30 `compose_grounded_summary`) | No model anywhere; the engine is host free and the build enforces it | EXISTS | ui/storyui.js 469 to 474; atuned_src/BUILD-engine.sh | Keep. Model seam A3 |
| M43 | Evidence hierarchy of eight ranked sources (s7) | Levels 6, 7, 8 exist (sniffer, compute, systems). Levels 3 and 4 in part. Levels 1, 2, 5 have no writer | PARTIAL | engine/sourceai.js 102 to 123; engine/ladder.js 84 | D2: a table with a `have` flag per level |
| M44 | A lower level never overrides a stronger direct one (s7) | No ranking exists | MISSING | none | D2 table and a test |
| M45 | Relationship model: desired expression, interference, pattern, behaviour, evidence (s8) | Trace has the edge types. A release to a pattern is an observed `addresses` edge. Nothing says interference was reduced | PARTIAL | engine/trace.js 114 to 183, 751 to 885 | D5 |
| M46 | Describe relations as observed over time, not proven causal (s8, s21A, s28.5) | The graph refuses to derive a cause; a cause is only proposed or user confirmed | PARTIAL | engine/trace.js 200 to 210 | D4 rule `no_unsupported_causality` |
| M47 | Change trigger: pattern status changes (s9) | None. Patterns have no status | MISSING | none | Waits |
| M48 | Change trigger: pattern weight changes materially (s9) | History rows hold DQ, counts of saboteurs, complexes, hyper complexes, loaded addresses and the heaviest seat. No weight per pattern | PARTIAL | engine/schema.js 253 to 259 | D2 on what exists. D10 adds the nine axes to a row |
| M49 | Change trigger: repeated behaviour changes (s9) | None. Words only: six aversion cues | MISSING | engine/verp.js 23 | D11, owner question 8 |
| M50 | Change trigger: a ritual produces new evidence (s9) | Practice evidence exists and has no writer | PARTIAL | engine/practice.js 177 to 253 | Waits on the writer |
| M51 | Change trigger: integrity alignment changes (s9) | A law moving over time is read per law. Ritual said against done is read for seven days | PARTIAL | engine/schema.js 311; engine/ladder.js 136 | D2 |
| M52 | Change trigger: an intention repeatedly succeeds or fails (s9) | None | MISSING | none | D8 |
| M53 | Change trigger: a boundary repeatedly maintained or violated (s9) | `boundaryCross` names a side only when a person is named ("boss", "wife"); no maintained or violated event | PARTIAL | engine/avatar.js 105 | Waits (X4) |
| M54 | Change trigger: a new relationship across several evidence points (s9) | None | MISSING | none | D2 later |
| M55 | Change trigger: a previously dominant pattern stops appearing (s9) | The heaviest seat is on every history row; seats per entry are in the story | PARTIAL | engine/schema.js 253 to 259; engine/schema.js 721 | D2 |
| M56 | Change trigger: a weak behaviour becomes consistent (s9) | None | MISSING | none | Waits |
| M57 | Compress noise: surface only meaningful change (s9, s28.4) | None | MISSING | none | D3 silence and novelty rules |
| M58 | Focus score: a product of five factors minus three (s10) | None. The product ranks by the heaviest address | CONFLICT | engine/sourceai.js 37; reviews/SPEC-source-ai.md 313 | A countable ordering, never a stored number. Conflict 4 |
| M59 | Trend algorithm: baseline window, current window, consistency over opportunities, never from one event (s11) | One reading is not a line: `seriesRead` returns none, one or line. No opportunity count | PARTIAL | engine/ladder.js 262 to 288 | D2 |
| M60 | Four trend statuses, including "needs attention" (s11) | None. "Needs attention" is a verdict on the person's day | MISSING | none | D2 uses neutral words. Owner question 10 |
| M61 | Seven forbidden default phrases (s12) | No gate enforces them (probe, section 4c). The canon words are on no list | CONFLICT | .claude/skills/atuned-voice/SKILL.md 964 to 966 | Conflict 1. Owner question 1 |
| M62 | Preferred vocabulary and translation examples (s12) | The brief's mirror rules: observation, pattern, possible meaning, next exploration. The gate flags "You're clear" | PARTIAL | CREATIVE-BRIEF-voice.md 157 to 180; brief.py 1227 | D3 templates, D4 |
| M63 | Confidence model, numeric bands, suppress below 0.35 (s13) | Named bands were measured and rejected. The product posture is a count a person can check | CONFLICT | AUDIT-source-tdd-v3.md 24; engine/sourceai.js 37 | D3 rung table. Conflict 4 |
| M64 | Weak signals suppressed (s13, s26.3) | The unread posture exists for the whole record | PARTIAL | ui/summary.js 537; BIBLE.md 285 to 291 | D3 silence rules |
| M65 | Daily template of eight blocks (s14) | None as such | MISSING | none | D3 block table, D7 |
| M66 | Each summary is immutable; compare, never rewrite (s15) | History rows are appended and no code edits one, but nothing seals them and the boundary rebuilds each row from a whitelist | PARTIAL | engine/schema.js 1042 to 1083 | D6 |
| M67 | Views: today, 7, 30, 90 days, since the beginning (s15) | Spans day, week, month, quarter, year, five years | PARTIAL | engine/ladder.js 257 to 261 | D7 |
| M68 | Eight historical questions (s15) | What changed and what reversed: partly, per law and CQ. Which patterns lost influence, which behaviours became consistent, where intention became behaviour, which rituals correlate, what returns: none | PARTIAL | engine/schema.js 311; engine/ladder.js 262 | D2 for the first two |
| M69 | A trace graph exists (s16, s2) | Built, merged and gated | EXISTS | engine/trace.js 751; tests/trace.js | Read only |
| M70 | Every statement traceable to evidence, journal, ritual, pattern, intention, integrity event, avatar attribute, knowledge object (s16) | The graph has no node type for an intention, an integrity event, an avatar item, a knowledge object or a summary statement | PARTIAL | engine/trace.js 67 to 70 | D5: two kinds of reference |
| M71 | "Why did Atüned say this?" returns the evidence (s16, s28.2) | A chain from evidence to goal and from a story to a piece of evidence resolves (X5). A story that says "postponed" is not tied to the negative evidence record | PARTIAL | engine/trace.js 454 | D5 |
| M72 | Append only event ledger (s17) | The Practice log is append only and numbered. Other product events are not logged; they are derivable from the record | PARTIAL | engine/practice.js 61 to 69, 255 to 265 | Derive, do not log (section 4) |
| M73 | The twenty event names of section 17 | Three are in the Practice vocabulary (X3); seventeen are not | PARTIAL | engine/practice.js 61 to 69 | D2 derives the ones the record can state |
| M74 | The loop ends in a new intention and starts again (s18, s32) | The ruled loop is discover, play, flow, embody, a circle | CONFLICT | CLAUDE.md "The loop, and the centre"; engine/core.js 150 to 160 | Conflict 10 |
| M75 | A synthetic cohort of 1,000 people for 90 days (s19, s20) | No run exists for this document. Earlier panels are labelled simulated; `tools/loopsim.js` fails its own validation | UNVERIFIED | tools/loopsim.js; POINTS-AUDIT.md "not run" | Do not quote the findings as measured |
| M76 | Gap A: sequence is not proof of cause (s21A) | Graph: registration is not causation. Composer rule missing | PARTIAL | engine/trace.js 200 to 210 | D4 |
| M77 | Gap B: conflicting signals are stated, not resolved (s21B, s28.3) | The graph holds `contradicts`; the said against done gap exists; no detector | PARTIAL | engine/trace.js 114; engine/ladder.js 136 | D2 detector |
| M78 | Gap C: AVATAR_REVIEW_REQUIRED (s21C) | A monthly review clock exists and shows only in the old drill | PARTIAL | engine/avatar.js 26 to 36; ui/drills.js 1075 | D2 reads it |
| M79 | Gap D: diversity constraints against fixation on one pattern (s21D) | None | MISSING | none | D3 |
| M80 | Gap E: retention policy, deletion, evidence visibility, export, audit trail (s21E) | Export and whole record delete exist. No retention policy, no per item control, no model so no model audit | PARTIAL | ui/account.js 648; engine/schema.js 453 | Owner question 6; A2 |
| M81 | Gap F: model, prompt and rule version, data snapshot on every summary (s21F) | `SCHEMA_V`, `CQ_MODEL`, `LEX_VERSION`, `TRACE_ALG`, `PRACTICE_SCHEMA_V` exist (X7). No rule version. Model and prompt have nothing to name | PARTIAL | engine/sniff.js 903; engine/compute.js 84 | D1, D6. Conflict 9 |
| M82 | Pattern state machine with regress (s22) | None | MISSING | none | Waits |
| M83 | Intention state machine (s22) | None | MISSING | none | D8 |
| M84 | Summary pipeline states collecting to published (s22) | A pure synchronous function has no such states: a day is sealed or it is not | MISSING | none | Not built as stored states |
| M85 | API surface of thirteen routes (s23) | None. `ui/auth.js` is the only file that calls fetch and "does not sync" | CONFLICT | ui/auth.js 8 to 24; CLAUDE.md "What this project is becoming" | A1. Conflict 12 |
| M86 | User corrections as first class evidence (s23, s24) | None | MISSING | none | D6 |
| M87 | Six response options on every summary (s24) | None | MISSING | none | D6, D7. Owner question 11 |
| M88 | Corrections never silently rewrite history (s24, s28.6) | A committed journal entry is never deleted (T2). Nothing for summaries yet | PARTIAL | TASKS.md 29280 | D6 append only |
| M89 | Unit, integration, safety and UX tests (s25) | The engine gate is headless and has a group per module. None for the summary | PARTIAL | tests/engine.js 5625 to 5629; tools/monitor.js | D1 to D6, tests/daily.js |
| M90 | Safety tests: no fabricated evidence, no diagnosis, no deterministic spiritual claims, no unsupported causality, no worth scoring, no hidden inference as fact (s25) | The brief gate covers diagnosis, shame, certainty, identity. It does not cover causality, and cannot cover fabrication | PARTIAL | brief.py 1227 to 1350 | D4 |
| M91 | UX tests: read in under 60 seconds, evidence in two interactions, fact distinct from interpretation (s25) | The brief grades reading level. No timing or interaction test | UNVERIFIED | tests/functional.js; tests/design.js | Measure at D7 |
| M92 | Ritual recommendations tied to actual active patterns (s26.8, s20 F6) | `ritFor` picks by heaviest seat. The plan's address is beside the record | PARTIAL | ui/ritual.js 82; ui/ritual.js 171 | Waits on the Ritual cutover |
| M93 | Summary quality scoring on eight internal dimensions (s29) | None. Coverage, traceability, readability and novelty can be computed in the gate; correction rate is per device and may not leave it | MISSING | engine/outbox.js 30 | D4 for four of them; the rest wait. Never telemetry |
| M94 | Nothing personal in the outbox or the cohort lead's view (s21E, s33 P2) | The outbox deny list names story, journal, history, meter, avatar, purpose and not the new key. The lead's hidden list names the story cloud | PARTIAL | engine/outbox.js 30; engine/plan.js 97 to 98 | D1 adds the names (X7) |
| M95 | The architecture chain from avatar to daily mirror to new intention (s32) | Avatar to seat, seat to release, story to imprint exist. Evidence and integrity do not | PARTIAL | ui/drills.js 1024; ui/release.js; engine/trace.js | Follows the slices |
| M96 | The Summary never becomes "Atüned's opinion of you" (s34, s27) | The brief's mirror rules, mechanically checked | EXISTS | brief.py 1227 | Keep |
| M97 | A summary exists for every day, Day 1 to Day 90 (s15, s31) | A day nobody opened the app has no summary and cannot be made later | MISSING | none | Said plainly. Owner question 3 |

Acceptance criteria of section 26, read across to the rows (a cross reference,
not more rows): 1 is M02, M35. 2 is M70, M71. 3 is M64. 4 is M77. 5 is M86,
M88. 6 is M91. 7 is M33, M67. 8 is M92. 9 is M14. 10 is M13, M58. 11 is M71.
12 is M68.

---

## 4. What needs to be built

Slices small enough for one build agent. D1 to D11 start now and need no
server. A1 to A4 wait for the accounts decision. Nothing here is built in this
document.

### 4a. The engine module

**Name.** `engine/daily.js`, function prefix `dly`, constant prefix `DLY_`.
Checked: no declaration in `atuned_src` starts with `dly` or `DLY`. Not named
`summary` (the UI file `ui/summary.js` owns the `sum` prefix and a duplicate
function name in one concatenated scope silently overrides, it does not throw)
and not `mirror` (`MIRROR` is the Compass axis table, `engine/data/compass.js`
32, `mirrorAt` 324, `mirrorYou` `ui/personas.js` 654).

**Where in `atuned_src/MANIFEST`.** Immediately after `engine/ladder.js`, before
`engine/outbox.js`. It needs `PR_NEVER`, `practicePatternOk` and
`practiceTraceIntents` (after `engine/practice.js`), `parseStory`, `verpScan`,
`srcPrior`, `pracDay`, `intentionRead`, `seriesRead`, `spanOf`, `avatarGap`
(all earlier), and a top level `var` that reads any of them is evaluated at
load, so it must come after. Functions hoist, so `schema.js` can call
`dlyValidate` at run time from its earlier position, the way it already calls
`practiceValidate` and `validateTrace`. `engine/export.js` stays last. The
module is host free: no `document`, `window`, `navigator`, `localStorage`,
`fetch`; the moment is passed in, never read, as `engine/ladder.js` does.

**What lives on the profile.** One new top level key, additive, no
`SCHEMA_V` bump (which is the owner's call):

    p.summaries = {
      v:     1,                     DLY_SCHEMA_V, refused above, never clipped
      days:  [ sealed day, ... ],   append only, one per local day
      fixes: [ correction, ... ]    append only, numbered
    }

A sealed day:

    { id:'sum:2026-10-04', d:'2026-10-04', t:<iso, when it was sealed>,
      rv:1,                         DLY_RULES, the rule version, an integer set by hand
      lex:<LEX_VERSION>, cq:<CQ_MODEL>, alg:<TRACE_ALG>,
      generated_by:{system:'rules', model_version:null, timestamp:<iso>},
      basis:{ h:<history rows used>, e:<entries>, r:<ritual days>, p:<practice events> },
      st:[ statement, ... ] }       at most eight

A statement:

    { k:'today'|'expressing'|'interfering'|'changing'|'attention'|'try'|'why',
      tpl:<template id>,
      text:<the sentence as it was shown>,
      ev:[ {type, id}, ... ],       at most twelve, see the two kinds below
      read:[ {addr, band}, ... ],   the addresses a cited story was read at, as shown
      src:'known'|'inferred'|'proposed'|'user_confirmed'|'observed',
      rung:<a name from DLY_RUNGS> }

A correction:

    { seq:<1 and rising>, at:<iso>, sid:'sum:2026-10-04', st:<index>,
      kind:'accurate'|'partly'|'not'|'why'|'context'|'correct', note:<text, at most 600> }

Why a separate list and not `p.history`. History rows are strictly typed
numbers, a closed whitelist, and `ledgerRead` counts them for the "Ten
snapshots" mark (`engine/ladder.js` 84 to 100, and the `watched` mark at 225),
so a summary written there would move a mark. Their writer is four events, not
a day. A summary is text, references and a rule version, and it carries a
different privacy class (it is built from the story). Different shape,
different writer, different mutability: a different list. Derived values are
not stored: whether a day has been corrected is a fold over `fixes`; a
statement's current standing is the latest correction for it.

**What `validateProfile` must refuse, by name** (path first, the way
`practiceValidate` writes them, never clamped, never dropped):

| Refused | Name it carries |
|---|---|
| `summaries` not an object, `v` not 1 to `DLY_SCHEMA_V`, a newer `v` | `summaries.v is N, newer than this build reads` |
| `days` not a list, more than the cap | `summaries.days holds N, the cap is M` |
| a day whose `id` is not `sum:` plus its own `d`, a `d` that is not a real calendar day, a day dated after the moment of import | `summaries.days[i].d ...` |
| the same day twice | `summaries.days[i] repeats day D, a sealed day is never replaced` |
| a statement count over eight, `text` over its length, `ev` over twelve, an unknown `k`, `src` or `rung` | by path |
| an `ev` reference that is neither a trace node key nor a record reference (below) | `...ev[j] names no kind of evidence this build holds` |
| any numeric field named `confidence`, `language_confidence`, `score`, `focus`, `rank`, `weight`, `percent` | `...may not carry score. A reading is not a score` |
| any key in `PR_NEVER` (`user_id customer email key secret token session password card payment stripe` and the rest), on a day, a statement or a correction | `...may not carry user_id` |
| `generated_by.model_version` not null while `system` is `rules`; a `prompt_version` of any value | `...claims a model wrote a rules summary` |
| a correction whose `sid` names no sealed day, whose `st` is out of range, whose `kind` is not one of the six, whose `seq` does not rise by one, whose `note` is over its length | by path |
| a `text` that contains the record's own `name` as a whole word (checked in the composer's gate, and again here as a refusal) | `...text carries the person's name` |

Also in the same commit, because a name left out is a silent hole (X7): add
the key's name to `OB_NEVER` (`engine/outbox.js` 30), add "the daily summary"
to `LEAD_HIDDEN` (`engine/plan.js` 98), name the new key in `blankProfile`
(`engine/schema.js` 106 to 115) and in the export list, and add a round trip
test: export, import, equal.

Two kinds of evidence reference, because the graph is closed over its node
types:

- A **graph reference** is a trace node key: `story:<t>`, `pattern:<n>`,
  `evidence:<id>`, `practice_event:<id>`, `ritual:<id>`, `goal:<id>`,
  `release:<key>`. Resolved by `traceNeighbors` and `tracePath`.
- A **record reference** names something the graph has no node for:
  `history:<t>` (a row), `law:<name>` (a series), `first:<key>` (a dated
  first), `ritualday:<t>` (a row of the day log), `avatar:<seat>`. The avatar
  has no id for a pair today (`BECOMING-AUDIT.md` R02, S2); until Becoming
  gives pairs ids the avatar reference is the seat and the resolver says the
  pair's text, never an id it does not have.

### 4b. The deterministic composer

**There is no model in the browser, and `compose_grounded_summary` is rules
and templates over the record.** Section 30's pseudocode reads like a model
call. It is not one here. `dlyCompose(p, now)` is a pure function: the same
record and the same moment give the same sentences, byte for byte, in any
order of the inputs (a test shuffles them). It extends what `sumStory` already
does: every sentence is conditional on the value it names existing.

The pipeline, in the document's own steps:

| Function | Does | Document step |
|---|---|---|
| `dlyContext(p, now)` | Windows over `SPANS` (1, 7, 30, 90 days, read from `spanOf`, not retyped), history rows bucketed by local day (`pracDay`), entries, ritual days, meter firsts, practice events, one `traceFromRecord(p, practiceTraceIntents(p.practice))` per call | 1 to 10 |
| `DLY_RANK` | The eight evidence levels as a table, each with a `have(p)` that says whether any source for it exists. Printed by the tests. Level 1 and 2 read `p.practice.evidence`; 3 reads `srcPrior`; 4 reads the day log and practice events; 5 reads `intentionRead`; 6 to 8 read the sniffer, `compute` and the systems | 7 |
| `dlyChanges(ctx)` | One detector per input that exists. Each returns a change with its references, or `{unread, why}` when its input is absent, the way `sniffFlow` returns unread lenses. Never a zero it did not measure | 9, 11 |
| `dlyContra(ctx)` | Pairs of references that disagree: ritual said against done; practice negative evidence against positive evidence on one pattern; later, an intention against an observation | 21B, 28.3 |
| `dlyFocus(cands)` | Orders candidates by a tuple of counts (conflict 4), and returns the tuple so "why this one" can be printed | 10, 13 |
| `dlyCompose(p, now)` | Chooses templates from `DLY_TPL`, fills slots from typed arguments only, applies the silence and novelty rules, returns `{state:'unread'\|'thin'\|'ok', st, silent, meta}` | 14, 30 |
| `dlyGround(draft, p, now)` | The grounding pass (4c) | 15, 30 |
| `dlySeal(p, draft, now)` | Appends one sealed day. Refuses a day already sealed, refuses a draft the grounding pass did not pass, reports through the return value so the caller can call `status()` | 17 |
| `dlyCorrect(p, sid, st, kind, note, now)` | Appends a correction | 24 |
| `dlyWhy(p, graph, ref)` | The drawer (4d) | 16 |
| `dlyValidate(errs, o, base)` | The boundary (4a) | 21E |

**The templates.** `DLY_TPL` is a table: id, block (the document's eight:
today, what is showing up, what is getting in the way, what is changing, what
needs attention, today's intention, try this, why), the detector kinds it
needs, a sentence with typed slots, and a hedged variant used when the rung is
low. A slot takes a count, a day, a name from a canon table (a seat, a law, an
address name) and never free text. The person's own words are not copied into
sealed text. They appear in the drawer, read live from the entry the reference
names, so the summary holds no second copy of the story. The sentence shapes
come from the brief's mirror layer, observation then pattern then possible
meaning then next exploration (`CREATIVE-BRIEF-voice.md` 157 to 180).

**The rungs.** `DLY_RUNGS`, a short ordered table read off counts: for
example `once` (one record), `repeated` (two or more records on two or more
separate days), `windowed` (present in the current window and absent in the
baseline, or the reverse), `contradicted` (an opposing record exists). The
document's four bands (0.90, 0.75, 0.55, 0.35) are not used. The rule "below
the lowest rung, do not surface" becomes: a template whose needs are not met at
`once` or above is not chosen, and the composer says nothing. Silence is a
result, and it carries its reason (`silent:[{why}]`) so a test can read it.

**The silence and novelty rules, all derived from the record, none stored:**

- An unread record (`r.unread`) composes nothing and the page keeps the four
  doors (`ui/summary.js` 537). A single story with no history composes at most
  one `once` sentence, hedged.
- A sentence about the same relation that was sealed within the last seven
  days composes only if a count in it changed (section 28.4). The check reads
  `p.summaries.days`, so novelty is a function of what was already sealed.
- No sentence restates a template and arguments identical to any sealed one in
  the last N days, which is the same rule with a window.
- At most one block per domain until each domain has had one (section 21D),
  where a domain is a boundary side or a seat.

**What a model would add, later, and where it sits.** Three things and no
more: variety of phrasing, so day 40 does not read like day 3; classification
of journal text into behaviours, which is the gap the sniffer leaves (X4); and
proposed relationships a person has not noticed. It sits outside `engine/`, in
`ui/` beside `ui/auth.js`, the only file that may call `fetch`, behind the
sign in seam, and it needs a server because the key cannot sit in
`source.html` (`QUESTIONS.md` D17). The engine's side of the seam is what
exists already: the structured context goes out (references and counts, not
story text unless the owner rules, `DESIGN-sniffer.md` question 12 and
`DECISIONS.md` 1377); proposals come back as data; every proposal is marked
`proposed` and goes through `dlyGround` exactly as a template does, with the
extra rule that it may cite only references that were offered; a person
confirms before it becomes `user_confirmed`. `generated_by {system, model_version,
timestamp}` is the shape `engine/practice.js` already carries on every object.
The model never writes the record. Slice A3; owner question 7.

### 4c. The grounding pass, as a runnable check

Two stages, one in node and one in python, because two different things can go
wrong.

**Stage one, structural, in the engine (`dlyGround`, run by `tests/daily.js`
and by `dlySeal` before it writes).** Every rule is a name and a refusal:

| Rule | Refuses | Document |
|---|---|---|
| `no_fabricated_evidence` | a statement with no reference; a reference that resolves to nothing on the record or in the graph; a digit in `text` that is not an argument the template was given; an address in `read` the entry was not read at | 25, 30 |
| `no_unsupported_causality` | caused, made you, led to, because of, due to, as a result, therefore, in a statement not marked `proposed` or `user_confirmed`. "After you began" is allowed: it states a sequence | 8, 21A, 28.5 |
| `no_deterministic_profile_claims` | a profile system named outside the one block that says "point toward" | 12, 20 F4 |
| `no_personal_worth_scoring` | a percent, a rating, a rank, a number for the person, a count against a total ("3 of 4") | 10, 26.10, BIBLE.md 289 |
| `no_hidden_inference` | a statement whose `src` is stronger than its weakest reference | 26 |
| `grounded_language` | any of the seven phrases of section 12, in composed prose | 12 |
| `show_uncertainty` | a statement at the lowest rung that is not the hedged variant | 13 |
| `preserve_user_agency` | "you need to", "you must", "you should" | 20 F7 |
| `no_name` | the record's own name in the text | `DECISIONS.md` 28 to 40 |

Each rule has a failing sentence beside it in `tests/daily.js`, and the gate
does what `tests/practice.js` does for its own rules: it runs against copies of
`engine.js` with one rule deliberately broken and asserts the suite that guards
it fails. A gate that cannot fail is not a gate.

**Stage two, the voice, reusing `.claude/skills/atuned-voice/check.py --brief`
from the copy engine.** Every template, in every hedge variant, expanded with a
fixture, is a string the brief engine can judge as layer `mirror`:

    python3 .claude/skills/atuned-voice/check.py --brief --line "<sentence>" --layer mirror

Measured (appendix A, voice probes), what it does and does not catch today:

| Sentence | Result |
|---|---|
| "You're clear about what you want to do, but fear is still interfering with follow-through. ..." (the document's Day 1) | `[flag] mirror-identity  "You're clear"` |
| "You started 11 of your last 12 conversations directly." | `[stop] house:naked number` |
| "Three conversations were started and one was postponed in the last 14 days." | no findings |
| "Your soul evolution is shifting and your spiritual vibration is rising." | no findings |
| "The ritual caused the change in how you speak." | no findings |
| "You are acting courageously." | no findings |
| "Your universe is telling you to act, and your energy guarantees it." | `[flag] certainty  "guarantees"` |

So the gate is half of the grounding pass: identity, diagnosis, shame,
certainty, the naked count. It lacks causality and the seven phrases. Two
edits close that, both in the voice seat's files and neither made here:

1. `brief.py` `FILES` (line 115 onward) needs one entry for the new module, or
   its strings are unclassified: `'atuned_src/engine/daily.js': ('sum',
   ('all', 'mirror'), '<one sentence of why>')`. `test_brief.py` requires the
   host named to exist in `TABDEF` or `TABEXTRA`; `sum` does.
2. Two rules in `brief.py`, with a failing and a fixed line beside each:
   `causal-verb` (section 8, 28.5) and `deterministic-profile` (section 12).
   Whether the seven phrases join the avoid list is owner question 1; the
   structural stage enforces them in composed prose either way.

The existing `summary.js` is a measured baseline for the same tool: 92 strings
read, 4 findings (1 flag, 3 review), the flag being the numerology line that
prints "Karmic debt" (`ui/summary.js` 514), which section 12 forbids by
default. The new module's gate target is no stop and no flag.

### 4d. The evidence drawer, on the trace graph

`dlyWhy(p, graph, ref)` returns for a reference: the shortest chain to every
other reference the statement cites (`tracePath` with `undirected`), the
neighbours with their edge and provenance (`traceNeighbors`), and whether any
story on the chain was read under a different lexicon than the one it was
sealed under (the graph's own `restated` list, `engine/trace.js` 778).

Built on probe X5, it already returns, for the document's own scenario: from
evidence `e1` to goal `g1`, "supports pattern, obstructs goal"; from the first
story to `e1`, "story supports pattern, evidence supports pattern"; and the
negative evidence `e2` with its `contradicts` link. Seven rules for it:

1. Registration is not causation. The drawer prints the edge's own verb and
   its provenance word, never "caused".
2. A sealed statement keeps `read`, the addresses each cited story was read at
   when it was shown. The drawer shows those, and says "read again today it
   lands at ..." only when they differ. Without this the drawer would answer
   from today's lexicon, which the graph declares it does.
3. Two clicks, counted: the statement, then "Why". The chain is on that one
   panel. The document's UX test is evidence in two interactions (section 25).
4. A record reference with no node has its own resolver (a history row, a law
   series, a dated first, a ritual day), listed as such.
5. `traceOrphans` is run on the same graph and a statement citing an isolated
   node is flagged in the drawer as unconnected, never hidden.
6. Evidence drawn from `p.practice` is shown only when there is any. Absent is
   "no record yet", not "no change".
7. A node of type `story` shows the person's own entry, read live. Entries are
   never deleted (T2), so the reference holds.

The graph needs two repairs from the technical director before the drawer is
complete: the fetter identifier (probe X6) and, if the owner wants avatar and
intention in the chain, node types for them, which belongs to the trace build
and to Becoming S12.

### 4e. Immutable daily snapshots, and their size

**Extend `p.history` or a separate list: a separate list** (reasons in 4a).

**Size, measured (X1, X2).** One history row is 565 bytes with the laws
answered; a year of one row a day is 206 KB. One sealed summary of six
statements with rendered text and three references each is 2,228 bytes, a year
is 813 KB. The same with template ids and arguments only is 924 bytes, a year
337 KB. Story entries at 500 characters, a year, are 216 KB. Practice, one
event with its log entries is 1,176 bytes (`node tests/practice.js` prints it),
which is 429 KB a year at one event a day and 1.29 MB at three, the same as the
1.3 MB the practice build reported (that figure is not in `PRACTICE-AUDIT.md`;
it is re-measured here). All four together for a heavy year is 2.5 MB (X2).
Browsers commonly allow about 5 MB per site in localStorage and the whole
profile list is one key written whole on every save (`engine/schema.js` 418 to
431). The ceiling was not measured here. A save that cannot land returns false
with `SAVE_ERR` set, which `status()` must say.

**Stored text or stored template ids.** Store the rendered text and the
template id both. The text is what the person was shown, which is the thing
that must not change when a template is edited in a later build (document 21F).
Ids alone would let an old day change its wording under the person. The cost is
the 0.5 MB a year difference above.

**The cap.** `PR_CAP` in `engine/practice.js` 149 sets the posture: a cap is
refused above and never truncated. A cap on days is a retention decision and
the owner's (question 6). Until it is ruled, `dlySeal` returns an error at the
cap and the page says so; nothing is trimmed, and nothing old is compacted,
because rewriting an old day is the thing the design refuses.

**When a day is sealed.** On the first entry to the Summary tab each local day
(`ui/panels.js` 280, the entry branch of `setTab`), never inside `sumRender`,
which `render()` calls on every state change (`ui/ui.js` 1437): a write inside
it would be a write per slider move, and a failed write inside a render has
nowhere to speak. The first composition of a day is the one sealed; later
opens that day recompute live and may differ, and the page can say how many
entries have been added since the sealed one. No day before the first open is
back filled (`PRACTICE-AUDIT.md`: writing events dated in the past would invent
a history). A roster persona or a profile that is not in the record list is
never sealed, the guard `pSnap` already has (`engine/schema.js` 450 to 452,
`NotARecord`).

### 4f. User corrections

Corrections are events. `p.summaries.fixes` is append only and numbered. A
correction never edits the day it is about, and the day's text is unchanged
for ever. What a statement currently reads as, "partly accurate", "not
accurate", "corrected", is a fold over the corrections for that statement and
is never stored. Rules:

- `accurate`, `partly`, `not` and `why` carry no text. `context` and
  `correct` carry the person's own words, bounded, refused over the bound.
  Those words are the person's story class of data: on the device, in
  `OB_NEVER`, hidden from a cohort lead.
- A correction is evidence the composer reads: a statement marked `not` is not
  composed again from the same references; a `correct` is a `user_confirmed`
  reference for later days. It is not copied into `p.practice.evidence`, which
  has fields for a practice's effect, not for a verdict on a sentence. Whether
  it should be is a question for the technical director (T4, section 9).
- The write goes through `pSave` and reports through `status()` before the
  control claims it landed.

### 4g. The slices

| Slice | What it does | Files | Proven by | Starts when | Needs from other builds | Owner gate |
|---|---|---|---|---|---|---|
| D1 | The shape and the boundary: `p.summaries` blank, `dlyValidate`, refusals by name, the names added to `OB_NEVER` and `LEAD_HIDDEN`, round trip | `engine/daily.js` (new), `engine/schema.js` (blank, validate), `engine/export.js`, `engine/outbox.js`, `engine/plan.js`, `atuned_src/MANIFEST`, `tests/daily.js` (new), `tests/engine.js` (one line) | refusal by name for every row of the table in 4a; older record fills the blank; export then import equal; a key not named at the boundary is caught (X7 repeated for the new key) | now | none | none |
| D2 | The reader and the detectors over what exists: windows, laws, CQ and DQ by `CQ_MODEL`, counts, heaviest seat, new addresses opened, story cue rates and seat recurrence per window, ritual said against done from the `done` flag, avatar review due. Unread with a reason where an input is absent. No text | `engine/daily.js` | engine group: each detector on a fixture; unread says why; a window of one reading is not a line; the said against done reading does not use `pracDays` (conflict 13) | D1 | none | none |
| D3 | The composer: `DLY_TPL`, `DLY_RUNGS`, silence, novelty, diversity, provenance on every statement | `engine/daily.js` | determinism; shuffled inputs give the same sentences; an unread record composes nothing; every digit is an argument | D2 | none | language, owner question 1 |
| D4 | The grounding pass and the voice stage | `engine/daily.js`, `tests/daily.js`, `.claude/skills/atuned-voice/brief.py` (two rules and one `FILES` entry, the voice seat's) | each rule fails on its own bad sentence; a broken copy of the engine fails its suite; `check.py --brief` over every expanded template reads no stop and no flag | D3 | the voice seat | none |
| D5 | The drawer resolver `dlyWhy` and the two kinds of reference | `engine/daily.js` | the three X5 chains; `restated` surfaces; an isolated node is flagged | D3 | the fetter identifier repair (T1) for fetter targeted protocols | none |
| D6 | Sealing and corrections: `dlySeal`, `dlyCorrect`, the fold | `engine/daily.js`, `engine/schema.js` | a sealed day is never replaced; the same day twice refused; a failed write reports; a correction never changes a sealed day | D1, D4 | none | retention, owner question 6 |
| D7 | The page: the daily block inside `sumFull` and `sumUnread`, the drawer, the History view, the response controls | `ui/summary.js` (one string builder called from `sumFull`) or a new `ui/daily.js` after it in `MANIFEST`, `shell/head.html` | `tools/monitor.js` on blank and loaded at 1600 and 390; `tests/functional.js`; `tests/design.js`; `python3 tools/terms.py`; the voice gate; **look at the shots** | D5, D6 | none | owner questions 2, 9, 10, 11 |
| D8 | Intention capture, a new daily act | `ui/ritual.js` or `ui/daily.js`, `engine/daily.js` | engine: said against done on the new record | owner questions 4 and 8 | the Practice writer, if intention is a practice event | the word and the act, owner question 4 |
| D9 | The 7, 30 and 90 day relationship view | `ui/daily.js` | monitor, design | D7 | none | none |
| D10 | The nine axes on each history row, so "weight changed" can be said per axis. Additive; an older build drops the key at its next save (the posture of `lawNow`, `engine/schema.js` 267 to 295) | `engine/schema.js` (`snapshot`, the row whitelist) | an older row loads unchanged; a new row round trips; the row stays small (about 60 bytes) | after D2 shows it is needed | none | schema version, the owner's call |
| D11 | Behaviour cues, with provenance and a lexicon version bump | `engine/lexicon.js`, `engine/sniff.js` | the document's own sentences read; every cue's false positives measured on the story bank; `tools/equiv.py` | Becoming S14 | the voice and sniffer seats | owner question 8 |
| A1 | The thirteen routes of section 23 | `ui/auth.js` seam, a server | contract tests | the accounts decision | the reboot-os Worker | accounts |
| A2 | Retention beyond the device, deletion on request, breach duties | server | none here | the accounts decision | the controller question in CLAUDE.md | accounts |
| A3 | A model behind the seam: phrasing, behaviour classification, proposals | `ui/` seam file | contract tests, grounding on every proposal | a server and a key | the key (`QUESTIONS.md` D17) | owner question 7 |
| A4 | Reminders for an intention, cohort level analytics | server | none here | the accounts decision | push | "A notification never states a reading the person has not produced" (`BIBLE.md` 1388 to 1392) |

---

## 5. Conflicts with standing rulings

Each names the ruling, quotes it, and says where it is written. None is
silently resolved. A conflict with a ruling is the owner's to settle; what is
proposed here is the smallest build that does not decide for him.

**1. The forbidden language list against the product's own canon.**
The document, section 12: "Avoid user-facing language such as: divine energy,
cosmic destiny, soul evolution, spiritual vibration, karmic certainty, your
universe is telling you, your energy guarantees ... unless the user explicitly
requests that language." The house voice, `.claude/skills/atuned-voice/SKILL.md`
964 to 966: "The avoid list leaves the canon alone, on purpose. Soul,
spiritual, source, energy, seat, charge, balance and coherence are his words and
are on no list." His own words on the product, `DECISIONS.md` 640 to 646: "A
mirror held up to you with the practice that aids the spiritual journey ...
showing your true nature, revealed. Without judgment." And against that,
`BRAND.md` 180: "This book is not mystical or magic." And his round ME ask
(`TASKS.md` 26733 to 26745), about the Summary: "Claude, AI, when it doesn't
have my parameters, for energy reading, it needs to go to the net for deep
research. Before it articulates the overlapping spiritual behaviors that it's
perceiving. That's part of the summary. That influences copy downstream."
Measured: the page prints "The spiritual layer" (`ui/summary.js` 419), a tile
named energy (`sumGlance`, 71 onward) and a karmic debt line the brief gate
already flags (514). The seven phrases are not enforced by any gate (4c).
Proposal: the composed prose is grounded and refuses the seven phrases; the
canon words stay as the names of the existing parts of the page, which the
composer links to and never narrates. The document's "unless the user
explicitly requests" is a setting, and no setting exists. Owner question 1.

**2. "Never expose a score" and "a reading is not a score", against CQ on the
Summary.** `BIBLE.md` 289: "A reading is not a score. Never print a count
against a total." `BIBLE.md` 1395: "A reading is not a score. No rank, no
percentile, no 'you are ahead of'." `DECISIONS.md` 646 to 651: "Regardless of
our score" settles "whether coherence is a rank: it is not." The document is
consistent in intent (sections 10, 26.10, 29) and the Summary page already
breaks the rule's visual grammar, which his own complaint names:
`reviews/COPY-summary-context.md` 1188 to 1190, "What has to give is the
arrangement that prints `13` in the largest type on the page, in a ring, as the
first thing under a person's name, which is the visual grammar of a score no
matter what the words around it say." The daily block must therefore carry no
number except a count of days, entries or addresses, and no count against a
total: "11 of 12" is stopped by the house gate, measured, and the document's own
Day 14 and Day 45 evidence is written that way (`COPY-OBJECTIONS.md` CO-05:
"every time you add that 11 of 12, why."). Proposal: separate facts, "Three
conversations were started and one was postponed". The plate is not this
build's to change.

**3. A one sentence mirror, against the Summary page's ruled layout.** The
document, section 5A: "One-sentence mirror" first. The page: `ui/summary.js`
570, the plate's "one job before any other and that job is to say this is
you"; 707 to 710, "THE CENTRE IS THE STORY. Ruled. Their own words first ...
the reading is a claim about the person and the story is the evidence for it,
and evidence goes first."; round LV and NT, "organised, symmetrical and
clean", and (`TASKS.md` 29331 to 29335) "The layout is not organized well. It's
not symmetrical. It's not on a grid." The document's section 27 says the
product "should not tell the user who you are", and the plate says this is
you. Evidence first is the document's own finding 3 (section 20), so the two
agree on order and differ on what sits on top. Owner question 2, with
wireframes.

**4. The Focus Score, and the confidence bands.** The document, section 10: a
product of five factors minus three, and section 13: bands from 0.90 down.
The standing posture: `engine/sourceai.js` 37, "Every rung is a count a person
could check by reading their own words, which is the explainability duty";
`reviews/SPEC-source-ai.md` 313, "The rung is drawn and never printed, because
a reading is not a score."; `AUDIT-source-tdd-v3.md` 24, a named confidence
band "was measured and rejected ... Calling an uncalibrated 0.9 'VERIFIED' is a
label that lies", CONFLICT "if ever shown to a person"; `BECOMING-AUDIT.md`
conflict 3, the same finding for the sniffer. The document says the score is
internal and not shown. It would still sit in the stored snapshot
(`language_confidence`, section 4.11), which the person can export and read,
and its five factors have no calibration. Proposal: an ordering by a tuple of
counts (distinct days of evidence, windows it appears in, days since last
shown, whether it is the person's own avatar line, then a fixed tie break),
returned so the "why this one" is readable, never stored as a number. The
rung names are stored.

**5. Immutable snapshots, against a Summary that is rebuilt on exit and on
every render.** `ui/panels.js` 87 to 100: "A HIDDEN SURFACE THAT KEEPS ITS LAST
RENDER IS STILL ASSERTING IT ... They are emptied on the way out rather than
left to go stale." `ui/ui.js` 1437 rebuilds the page on every `render()`. The
two do not conflict when the stored thing is in the record and the page is a
view. They conflict if a sealed day is written inside `sumRender`, or held in
the DOM. Rules: sealing is on tab entry, not in render (4e); a past day drawn
in History is drawn from the record while the tab is open and emptied on exit
and on a profile change, which `tests/functional.js` already sweeps for stray
figures on a cleared field.

**6. Where the app opens.** `DECISIONS.md` 921, "The app opens on Summary", is
superseded. `CLAUDE.md`: "The app opens on the Field, ruled 19 September,
reversing Summary. `core.js` has `tab:TAB.FIELD`." (`engine/core.js` 310;
`ui/ui.js` 1633 calls `setTab(TAB.FIELD)`.) So "a fresh summary when the app
opens" is not "when the Summary opens". Sealing therefore waits for the first
entry to the Summary tab (4e), and `CLAUDE.md`'s next sentences bind the new
block: "Anything that renders there renders to somebody who has entered
nothing. Both surfaces that print a reading now silence themselves on
`r.unread`." The composer returns silence on an unread record and on thin
evidence, and the page keeps the four doors.

**7. The document's Person, Avatar, Purpose and Boundary objects, against the
record.** Person with `avatar_id`, `purpose_id`, `boundary_id`: the record is
the person, and a second owner key inside it is two truths (`BECOMING-AUDIT.md`
R02). Avatar as lists: `engine/avatar.js` 21 to 24, "A PAIR IS WRITTEN AS A
PAIR. The left side is a value and a value has no address." Purpose as typed
sentences: `DECISIONS.md` 459 to 478, "Six values in, three readings out, and a
person may type none of the three." Boundary as its own object: stored inside
`purpose.sides` (`BECOMING-AUDIT.md` R17). All four are Becoming's to settle
(questions 1 to 4 there). The Summary reads them in the shape they have and
adds no object.

**8. Intention, against three meanings the word already has.** `engine/ladder.js`
110 to 127: "the product's existing 'intention' readout is It, the band mean of the
laws, and putting a second number under the same word before he names one is the
defect one word per concept exists to stop." Its ruling, 25 September: "You
either did the thing you said you were gonna do or you didn't, and the reason
why is going to be, there's a story in there from the SQ somewhere in the body."
And, in the same ruling: "you can have an emotion without an intention." The
sixth gate in `engine/verp.js` 11 is named Intention. The document's intention
is a sentence chosen for a day. Integrity has the same collision: it already
means the 21 laws (`BECOMING-AUDIT.md` R53). The product's own meaning of "said
against done" is the ritual commitment, and the Practice event is its better
home. Owner question 4.

**9. `model_version`, `prompt_version`, `rule_version`, against the stamps the
product has.** `LEX_VERSION` is a hash of the lexicon (`engine/sniff.js` 897 to
903) stamped on every entry; `CQ_MODEL` is an integer on every history row
(`engine/compute.js` 84); `TRACE_ALG` stamps a derived graph;
`PRACTICE_SCHEMA_V` and `SCHEMA_V` stamp the objects. There is no model and no
prompt to name, so those two fields are absent, not empty strings, and the
boundary refuses a value (4a). The rule version is new: `DLY_RULES`, an
integer set by hand and bumped with any template or detector change, sealed on
every day with the three product stamps. Drift is real here and not only in
principle: `engine/trace.js` 778, "THE READING IS TODAY'S. An entry read under
another lexicon ... is re-read under this one, so its edges are what the
sniffer says now and not what the person was shown then." Hence `read` on every
cited story (4d, rule 2).

**10. The document's loop, against the ruled one.** `CLAUDE.md`: "The process
is discover, play, flow, embody ... And it is a circle, never a list ...
Anywhere the four appear together they close." The document's loop (sections 18
and 32) runs story, listen, detect, ritual, act, evidence, summary, mirror, new
intention. It is a second spine, the same finding as `BECOMING-AUDIT.md` 6a row
9. Compatible if the Summary is the embody station's mirror and a new
intention returns to Discover; that is a statement about the circle, not a new
list. Not decided here.

**11. Three things called the Summary.** The tab (`ui/summary.js`), the
energetic summary of round FV (`ui/rootsum.js`, quoted in finding 1), and the
document's daily mirror. And the word the code uses for the compass axis table,
`MIRROR`. `CLAUDE.md`: "One word per concept." Owner question 9.

**12. A server API and sync, against "no backend".** `ui/auth.js` 13 to 20: "It
does not sync. Every story, reading and imprint stays in this browser exactly as
before." `CLAUDE.md`: "The app gains network at exactly one seam, fetching a
record at sign in." and "Records off device mean a controller exists. Access,
deletion and breach obligations attach." Section 23 and the cohort analytics of
sections 29 and 33 are the accounts decision. Not built.

**13. Streaks and points as evidence.** Section 20, finding 10: "You completed 6
rituals this week." The ladder's day count counts a day a ritual was set and
never done (`POINTS-AUDIT.md` probe X2, `PRIORITY.md` 21.J2, queued "Now,
small", not landed). The Summary reads the `done` flag on the day log
(`intentionRead`, `engine/ladder.js` 136), never `pracDays`. Achievements are
grants about the record and not nodes in the person's graph (`POINTS-AUDIT.md`
3c), so the graph carries none.

**14. Privacy of a derived join.** `DECISIONS.md` 28 to 40: "the record and the
story are never held joined"; superseded at 1377: "Ruled: the story is stored,
for recovery, never shared, and used only for modelling", with the team's
addition that "used for modelling" is consent asked and not assumed. A summary
is a derived join of both, so it takes the story's class: on the device, never
shared, not seen by a cohort lead (`engine/plan.js` 87 to 98, "The story is the
one thing that never crosses"). Reading earlier entries to compose it is the
open grant of `DESIGN-sniffer.md` 139 to 150, question 12: "Reading one entry
against that person's own earlier entries, on their own device, is a different
grant from a corpus leaving it ... It needs ruling." Composing on the device
from counts and references does not send anything and does not need the grant
decided; composing from the entries' words does. This build reads counts and
seats and the cue phrases, and quotes nothing into sealed text.

---

## 6. Where it goes in development

### 6a. One dependency graph across the five builds

    PRACTICE  (engine merged, gated; no writer)
       |   writer: Ritual tab onto PracticeEvents, the 19.C5 move
       |   needed by: Summary levels 1, 2, 4, 5; Becoming S7, S10; Points
       v
    TRACE GRAPH  (engine merged, gated; no reader or writer in ui/)
       |   seam defect: fetter ids refused (X6)           <- repair first
       |   needed by: Summary drawer D5; Becoming S12; Points evidence drawer
       v
    BECOMING  (audited, not built)
       |   S1 to S4 change existing blocks of schema.js (avatar, purpose)
       |   S2 gives pairs and entries ids; S5 is the read model that joins
       |   avatar, purpose, boundary and the field
       v
    DAILY SUMMARY  (this audit)
       |   D1 to D6 are append only on the shared files and read all of the above
       |   if present; D5 and the avatar references take S2 when it lands
       v
    POINTS AND ACHIEVEMENTS  (audited, not built)
           needs: a stored set of grants (a mark can be un-earned today),
           the streak repair 21.J2, and the owner's ruling on whether points
           can be spent (POINTS-AUDIT.md C2)

    Arrows are "must exist before". Summary D1 to D6 can start before every
    box above it, because they read what exists and say so where an input does
    not.

### 6b. What can start in parallel, in separate worktrees, today

| Worktree | Work | Files it shares with the others |
|---|---|---|
| A. Summary engine | D1, D2, D3, D4, D5, D6, in that order | `atuned_src/MANIFEST` (one line), `engine/schema.js` (blank and boundary), `engine/export.js`, `engine/outbox.js`, `engine/plan.js`, `tests/engine.js` (one line). New: `engine/daily.js`, `tests/daily.js` |
| B. Becoming | S1 to S4, then S5 | `engine/schema.js` (it rewrites the avatar and purpose blocks, about lines 967 to 1013), `engine/export.js`, `engine/avatar.js`, `ui/avatarui.js`, `ui/account.js`, `tests/engine.js` |
| C. Practice writer | Move the Ritual tab's writer onto PracticeEvents, per `PRACTICE-AUDIT.md`; repair the fetter identifier in `engine/trace.js` or `engine/practice.js`; the streak repair 21.J2 in `engine/ladder.js` | `ui/ritual.js`, `engine/ladder.js`, `engine/schema.js` only if the cutover reads `p.rituals` |
| D. Voice | The two brief rules and the `FILES` entry (D4's second half) | `.claude/skills/atuned-voice/brief.py`, `test_brief.py`. No overlap with the others |
| not yet | Points | waits on 21.J2 and on the forgery ruling |

### 6c. What they conflict on, and who merges first

The two builds already merged each touched the same four shared files and
nothing else. Read off `git show --stat` on `f38e0d8` (practice), `8ff0d49`
(trace) and `2289e9c` (the trace gate):

    file                          practice f38e0d8   trace 8ff0d49   trace gate 2289e9c
    atuned_src/MANIFEST           1 line             1 line          none
    atuned_src/engine/export.js   16 lines           14 lines        none
    atuned_src/engine/schema.js   15 lines           11 lines        none
    tests/engine.js               2 lines            none            4 lines

Every build appends at the same places: the end of `validateProfile` just
before `return errs.length?...` (`engine/schema.js` 1097 to 1105 is where the
last one landed), the tail of the `blankProfile` literal (106 to 115), the
tail of the export list, the last `require('./x.js')` lines of
`tests/engine.js` (5625 to 5629), and one line in `MANIFEST`. They will
conflict at those hunks each time. All of them are additive and the resolution
is keep both.

Order:

1. **The seam repairs first** (fetter identifier, streak). They are small, they
   change existing code, and the drawer and the Summary's said against done
   reading both rest on them.
2. **Becoming S1 to S4 before the append only builds if it is ready first.**
   It edits existing blocks (avatar, purpose, entries), which are the hunks
   most likely to move under an append. An edit that lands before an append
   means the append rebases onto its final text. If it is not ready, it does
   not hold the Summary: D1 to D6 do not touch those blocks.
3. **Summary D1 to D6 next.** Pure appends.
4. **Points last.** It reads history and the ladder, adds `p.progress`, and
   needs the grants set.

Whoever merges second rebases and re-runs `node tests/engine.js`; the
`MANIFEST` line for `engine/daily.js` goes after `engine/ladder.js`, so a
Points module placed after the ladder goes after it.

### 6d. The smallest slice of the Summary that is real today and honest

D1 to D3 with the detectors that have inputs, drawn as a block of two to four
sentences in the centre column, under the story and above the output row (so
evidence still goes first, `ui/summary.js` 707 to 710), silent when the record
is unread or thin. It states only:

- what moved in a law the person answered, across 7, 30 or 90 days, as their
  own answers lifted by releases (`lawSeries`), compared inside one
  `CQ_MODEL` only;
- which seat carried the most, and whether that changed (`dark` on the rows);
- addresses opened for the first time in the window, with their dates
  (`meter.firsts`), observed;
- how many entries in the window touched each seat, and which seats recur,
  inferred and labelled so, with the person's cue phrases counted and not
  quoted (`verpScan`: "put it off", "kept going");
- the ritual days set and the days marked done, as two facts, from the `done`
  flag;
- the avatar line whose seat still holds charge, with how often that seat
  appeared in recent entries, a relationship the engine already records
  (`avatarGap`, `parseStory`), stated as a count and not as a cause;
- the avatar review being due (`avatarDue`).

That is the document's section 28.1, relationships before scores, and section
9, change, restricted to inputs that exist. No behaviour is stated, no cause,
no pattern state, no intention. Each statement has a drawer reference.

### 6e. What it must wait for, and what it cannot honestly say until then

| It cannot say | Because | Until |
|---|---|---|
| "You are acting more directly", "avoidance appears less often" | no behaviour is recorded; the sniffer reads feelings and body (X4); six aversion phrases are a words count and not behaviour | the Practice evidence writer (a person enters what they did), or D11 behaviour cues |
| "Fear is less often determining what you do" | a cause, and no per pattern history exists to compare | D10 for the weight; a cause is never derived, only proposed or confirmed |
| "The ritual produced the change" | sequence is not proof (21A); `compute()` never reads the day log | never as a statement of cause; "the behaviour changed after you began" needs evidence of the behaviour |
| "A pattern was released, weakened, reappeared" | patterns have no state and no id | a Pattern object, not in P0 |
| "Your intention matched your behaviour" | there is no intention and no behaviour | D8 and the writer |
| "A boundary was maintained or violated" | `boundaryCross` names a side only for a named person; no event | Becoming S3 to S5 |
| "Your integrity improved" | the laws are the person's own answers, and CQ cannot be verified (`POINTS-AUDIT.md` X13: all 21 answers 10 reads CQ 100) | stated only as "your answers moved", never as improvement of the person |
| "12 conversations, 11 initiated" | nothing counts conversations | person entered evidence with a metric and a value |
| Anything about a day the app was not opened | nothing runs when closed | a server, or never |
| Anything the person has not written about the avatar's behaviours, purpose, boundaries | no write path (`BECOMING-AUDIT.md` R11) | Becoming S3 |

---

## 7. The section 31 scenario, run on paper against the real data model

Each step is marked possible now, possible in the engine but with no screen to
do it, or not possible, with the probe that shows it. X5 built the starting
state through the real Practice door and read the graph over it.

### Starting state

| Step | The document | Real model | Verdict |
|---|---|---|---|
| Avatar | "I want to become someone who acts directly, communicates honestly, protects my time, and follows through." | One pair: this as `be` (under 200 characters, read as nothing by the sniffer, which is right for a value), plus a `notbe` bad day sentence that parses to a seat. Half a pair is refused (`engine/schema.js` 974 to 999). Four qualities in one `be` is one pair, not four | possible now, with a second sentence the document does not have |
| Active pattern | "Avoidance around difficult conversations." | No pattern object. Nearest: the fetter Fear, the saboteurs Avoider and Pleaser (`SAB33`), an address. The sniffer read "I did not tell them because I was afraid of conflict." as Fear at the root and offered Innocent at 0.36, not Avoider (`BECOMING-AUDIT.md` section 9) | partial: a pattern id is an address; "avoidance" is a name the person gives |
| Interference | "Fear appears to reduce follow-through." | `pattern obstructs goal` is derived as `inferred` from a protocol's target and the behaviour it implements (X5: `pattern:1 obstructs goal:g1`). No strength | possible in the engine; no screen writes it |
| Intention | "Have the conversation today." | No object. Closest is a scheduled PracticeEvent on a ritual whose protocol has a `real_world_action` step, which the door accepted (X5). No screen | not possible for a person today |
| Ritual | "Release avoidance, reframe responsibility, initiate conversation." | A protocol of three steps, `release`, `reframe`, `real_world_action`, accepted by the door (X5). The release step on a protocol of class `communication` is accepted; class `release` must name an address | possible in the engine; no screen |

### Day 1 summary

"You're clear about what you want to do, but fear is still interfering with
follow-through. Today's intention is direct communication. The main opportunity
is to act before avoidance has time to build."

- "You're clear about what you want": a state claim. The gate flags it as
  `mirror-identity` (measured). Nothing measures "clear".
- "Fear is interfering": possible as a seat and a charge, with the avatar line
  and its seat (`sumStory` already says this in other words).
- "Follow-through": nothing records it.
- "Today's intention": no object.
- "Act before avoidance builds": a suggestion, which the output row already
  makes for a release.

Verdict: the clause about what is held and what is blocked is composable today;
the rest is not.

### Day 14

Evidence: 4 conversations attempted, 3 completed, 1 postponed; avoidance less
frequent.

- The four counts are person entered evidence with a metric and a value. The
  record has the fields (`engine/practice.js` evidence spec, 239 to 246) and
  validates them (X5, record validates true); no screen collects them. Without
  that, the count cannot exist: probe X4, "I postponed the conversation again."
  reads no imprint and no cue, and "I stated the concern directly." the same.
- "1 postponed" as negative evidence: a `contradicts` link to the pattern
  exists (X5, `evidence:e2 contradicts pattern:1`). The story that says
  "postponed" is not tied to it (X5, story 2 to e2 returns no chain).
- "Avoidance appears less frequently": only as a count of aversion phrases per
  window (`verpScan`), which counts "put it off" and not "postponed" (X4).
- "3 completed, 1 postponed" is allowed by the house gate as separate facts;
  "3 of 4" is not (measured on the nearby sentence).

Verdict: not possible from the journal. Possible from entered evidence once a
writer exists.

### Day 45

Evidence: 12 conversations, 11 initiated directly; pattern weight reduced;
ritual completed consistently.

- 12 and 11: as Day 14; and the sentence in the document is a count against a
  total.
- "Pattern weight reduced": history rows carry no per pattern or per axis
  weight (X1 keys). Only the heaviest seat, DQ and counts. D10 would add the
  nine axes from the day it ships; the past cannot be recovered, as with
  `lawNow` (`engine/schema.js` 287 to 295).
- "Ritual completed consistently": possible now from the `done` flag on the
  day log, if the day log is what the person uses. Not from `pracDays`.
- "Fear still appears but is less often determining what you do": a cause,
  refused (conflict 4, 4c).

Verdict: the ritual clause is possible; the rest waits.

### What the walk shows

The Day 1 to Day 45 arc is the loop the owner wants made visible. Today the
record can show the first half of it: what is held, which avatar line it
blocks, which seats recur, whether rituals were done. The second half, what the
person did and whether it changed, needs the one thing nothing records:
behaviour, entered by the person or read by a lexicon the owner has not yet
asked for in words that cover it (`TASKS.md` round NU asked for the behaviour
verbs "believe, think, feel ... behave, act and perceive").

---

## 8. Questions for the owner

You hold the vision. Each question says what it is in plain words, quotes the
part of the document or your own rulings it is about, gives the ways it could
go with what each costs, and gives my recommendation. The choice is yours. I
have not answered any of them by default.

### Q1. When the daily summary speaks, which words win: the document's grounded words, or the product's own spiritual words?

> **What it is.** The document says the summary must speak in plain behavioural
> language and must avoid a list of phrases. The product already speaks in your
> words on the Summary page: soul, spiritual, energy, seat, charge. A person
> will see both on one page.
>
> **The document.** Section 12: "Avoid user-facing language such as: divine
> energy, cosmic destiny, soul evolution, spiritual vibration, karmic
> certainty, your universe is telling you, your energy guarantees ... unless
> the user explicitly requests that language."
>
> **Your words.** "A mirror held up to you with the practice that aids the
> spiritual journey." (`DECISIONS.md` 640). "This book is not mystical or
> magic." (`BRAND.md` 180). And round ME about the Summary: "before it
> articulates the overlapping spiritual behaviors that it's perceiving. That's
> part of the summary."
>
> **Ways it could go.**
> - **A. Grounded sentences in the daily block. Your words remain as the names of
>   the parts of the page.** The seven phrases are refused in the sentences the
>   engine writes. Cost: the daily block and the spiritual layer beside it
>   sound like two voices.
> - **B. Your words throughout, with the seven phrases banned as claims.** Cost:
>   the block says "your energy" about a thing the engine cannot measure from
>   behaviour, which is the over claim the document is guarding against.
> - **C. A switch in settings: grounded by default, your own words when the
>   person asks.** This is the document's "unless the user explicitly
>   requests". Cost: a setting that does not exist yet, and every template
>   written twice.
>
> **I would pick A now and C later.** It matches "not mystical or magic" and
> costs nothing to reverse. **Unblocks** D3, D4.

### Q2. Does the summary lead with one sentence, or does the page you ruled keep its order?

> **What it is.** The document wants one sentence at the top of the Summary, a
> mirror. The page today leads with the person's name, the band and a ring, then
> their own words, then the reading. You ruled that their words come first.
>
> **The document.** Section 5A: "One-sentence mirror". **Your page.**
> `ui/summary.js` 707: "THE CENTRE IS THE STORY. Ruled. Their own words first
> ... evidence goes first." And round NT: "The layout is not organized well.
> It's not symmetrical. It's not on a grid."
>
> **The ruling asks for the drawing, side by side, both widths.** Chromium was
> busy and no screenshot was taken; these are wireframes of the centre column
> only, for the same profile. Real shots come with the build.
>
>     A. block under the story                B. sentence on top of the plate
>
>     +--------------------------+           +--------------------------+
>     | Name        band  (ring) |           | Name        band  (ring) |
>     +--------------------------+           | One sentence of the day. |
>     | What you told it         |           +--------------------------+
>     |  your words, coloured    |           | What you told it         |
>     +--------------------------+           |  your words, coloured    |
>     | Reading (three paragraphs)|          +--------------------------+
>     +--------------------------+           | Reading (three paragraphs)|
>     | Today  2 to 4 sentences  |           +--------------------------+
>     |  each with  Why          |           | protocol | release | next |
>     +--------------------------+           +--------------------------+
>     | protocol | release | next  |
>     +--------------------------+           phone: the same order, one column
>
> **Ways it could go.**
> - **A. A block under the story and above the output row.** Evidence stays
>   first; the block is two to four sentences, silent when there is nothing to
>   say. Cost: the page gets longer, and a person who wants one sentence reads
>   past the reading to find it.
> - **B. One sentence on the plate.** Matches the document. Cost: it puts a
>   claim above the evidence, against your ruling, and the plate is where the
>   instrument says "this is you", which the document's own last section says
>   not to say.
> - **C. A page of its own** after Summary, next free tab number 14. Cost: a
>   tab that is empty for a new person, and a second place to look for "the
>   summary".
> - **D. Leave the page and put the daily reading in History only.** Cost: the
>   person has to go looking, which is the failure the document names.
>
> **I would pick A.** It is the smallest change that keeps your order.
> **Unblocks** D7.

### Q3. Is the summary made once a day, or every time the person opens it?

> **What it is.** The product has no server and nothing runs while the app is
> closed. "Daily" can only mean "the first time the Summary is opened that day".
>
> **The document.** Section 15: "Day 1 ... Day 90", each summary immutable. The
> page today rebuilds on every render.
>
> **Ways it could go.**
> - **A. Made and sealed the first time the Summary is opened each day.** What
>   they first saw is kept. Later opens that day recompute live. A day nobody
>   opened has no summary and cannot be made afterwards. Cost: gaps in the
>   history, which the page says plainly.
> - **B. Made fresh every open and kept nowhere.** Always current. Cost: no
>   history of what the instrument said, no way to answer "what did you tell me
>   in March", and nothing for a correction to attach to.
> - **C. Made each day by a server, with a notification.** The only way to have
>   a summary for a day nobody opened. Cost: accounts, a server, a controller
>   with deletion and breach duties, and a notification that must never state a
>   reading the person has not produced.
>
> **I would pick A now.** C is the accounts decision. **Unblocks** D6.

### Q4. Do you want a new daily act, where the person states an intention, and what is it called?

> **What it is.** The document has the person state "Have the conversation
> today" and later compares it with what they did. That is a new step every day.
> The product already has a version of this without a new step: a ritual a
> person set and then marked done.
>
> **The document.** Section 4.7 and 5F: "Today's intention". **Your ruling,
> 25 September** (`engine/ladder.js` 110): "You either did the thing you said
> you were gonna do or you didn't, and the reason why is going to be, there's a
> story in there from the SQ somewhere in the body." And: "you can have an
> emotion without an intention."
>
> **The word.** In the product "intention" already names the average of the
> laws in one band, the ritual said against done, and one of the six gates. A
> fourth meaning breaks "one word per concept".
>
> **Ways it could go.**
> - **A. No new act. Intention is the ritual a person set, said against done.**
>   Nothing is added to the day. Cost: the document's "Have the conversation
>   today" in the person's own words has no home.
> - **B. An optional line when a ritual is scheduled** ("what will you do").
>   Cost: one more field in the ritual builder, and a decision on where it
>   lives in the Practice objects.
> - **C. A line asked on the first open each day.** Matches the document.
>   Cost: a gate in front of the summary, on a product that ruled "a strong
>   default rather than a hard gate" for the intake, and the working memory
>   limit of about four choices a screen in `CLAUDE.md`.
> - **D. Not now.**
>
> **I would pick A now and B later,** under another word: "commitment" collides
> with the thirty boundary commitments, "aim" is free. **Your call on the word.**
> **Unblocks** D8.

### Q5. May the summary show a person where what they said and what they did disagree?

> **What it is.** The document says do not smooth over a contradiction. If the
> person says they are confident and the record shows repeated avoidance, say so.
>
> **The document.** Sections 21B and 28.3: "The engine must not choose
> whichever signal sounds best. It should state the discrepancy." "Your
> intention was direct communication, but the recorded behavior shows another
> delay." **The brief**: "Never shame."
>
> **What the record can show today.** Rituals set and rituals marked done.
> Nothing about conversations or confidence (section 7).
>
> **Ways it could go.**
> - **A. Two facts, side by side, no verdict, and a button to add context.**
>   "Five rituals were set this week. Two were marked done." Cost: some will
>   read it as an accusation however it is phrased.
> - **B. Only after the same gap has shown on three separate weeks.** Cost:
>   slower, and the most useful week to say it is the first.
> - **C. Only when the person asks** ("show me where I contradict myself").
>   Cost: the document's whole point, that the mirror does not look away, is
>   given up.
>
> **I would pick A, with the wording from your own ruling that a miss is data.**
> **Unblocks** D2's contradiction detector and D3.

### Q6. Who can see the stored summaries, how long are they kept, and can the person delete one?

> **What it is.** A sealed daily summary is built from a person's own story and
> their own records. It is the most personal text the product would write. The
> document asks for a retention policy, deletion controls, evidence visibility
> controls, export and an audit trail and does not set any of them.
>
> **The document.** Section 21E: "Daily summaries may contain highly personal
> information." **Your rulings.** `DECISIONS.md` 1377: "Ruled: the story is
> stored, for recovery, never shared, and used only for modelling." A cohort
> lead sees "Fetters, saboteurs, complexes, hyper complexes. Their analytics.
> Not the spiritual material and not the story cloud" (`engine/plan.js` 87).
> `T2`: "A person cannot delete a journal entry once committed. It's part of the
> story."
>
> **Ways it could go.**
> - **A. On the device only, inside the record, exported with it, never shown
>   to a cohort lead, a cap per year the person is told about, and a delete
>   control that leaves a dated gap where the day was.** Cost: the history
>   shows the gap, which is honest and slightly uncomfortable.
> - **B. As A, but not exportable.** Cost: a person who exports to move device
>   loses their history, which is the "recover it" reason you gave for storing
>   the story at all.
> - **C. As A, but no delete,** by the same logic as the journal entry. Cost: a
>   person cannot remove something the instrument said about them that they
>   find harmful.
>
> **I would pick A.** The journal ruling is about the person's own words; a
> sentence the instrument wrote is not theirs in the same way. **Unblocks** D6
> and the cap.

### Q7. Is an AI model ever allowed to write the summary?

> **What it is.** Today every sentence is a template filled from the record.
> That is predictable and checkable and it repeats itself. A model would vary
> the wording and could notice things the rules miss. It also needs a server, a
> key that cannot sit in the file, and the person's words going somewhere.
>
> **The document.** Section 30: `compose_grounded_summary(...)` and
> `model_version=MODEL_VERSION`. **Your words**, round ME: "Claude, AI, when it
> doesn't have my parameters ... needs to go to the net for deep research."
> And the standing line, `ui/storyui.js` 469: "Scripted. No model is called."
>
> **Ways it could go.**
> - **A. Never. Rules and templates for good.** Cost: repetition after a few
>   weeks, and no behaviour read from the journal beyond the lexicon.
> - **B. A model may rephrase and may propose, behind the sign in seam. Every
>   sentence still passes the same grounding check, may cite only the records it
>   was offered, is marked proposed, and the person confirms before it counts.**
>   Cost: accounts, a server, a key, and asking consent plainly, because "used
>   for modelling" on a person's own disclosed material is not the same as
>   agreeing their words train a model (`DECISIONS.md` 1377).
> - **C. A model writes the summary.** Cost: it can make a persuasive story out
>   of weak evidence, which is the document's own named largest trust risk
>   (section 20, finding 8), and the grounding check would be judging the
>   model's fluency, not the record.
>
> **I would pick A for the first build and B once accounts exist. Never C.**
> **Unblocks** A3.

### Q8. Should the product learn to read what a person did, or ask them?

> **What it is.** The summary the document describes is about behaviour. The
> product reads feelings and body words. "I postponed the conversation again."
> reads as nothing today. Without a record of behaviour the summary can say what
> is held and what recurs, and cannot say whether anything changed in what the
> person does.
>
> **Your words**, round NU: "The sniffer needs to be updated to include sniffing
> for words within the prompt, believe, think, feel, and then behave, act and
> perceive, are kind of behaviour variables."
>
> **Ways it could go.**
> - **A. Teach the sniffer behaviour phrases,** with a measured false positive
>   rate on your story bank. Cost: the sniffer is the part you asked to be
>   protected, a lexicon version change stamps every entry, and a phrase list
>   will always miss "postponed".
> - **B. Ask.** After a ritual or at the end of a day: "what did you do". The
>   person's own answer is the evidence (level 1 and 2 of the document's own
>   ladder), entered as a count and a metric. Cost: a new, small, daily act.
> - **C. Both,** B first.
>
> **I would pick C with B first.** It is honest at once and A can be measured
> later. **Unblocks** D11 and everything that says "changed".

### Q9. Which of three things is "the Summary"?

> **What it is.** The word already names the tab, the energetic summary you
> asked for at round FV, and now the document's daily mirror. The code also
> uses "mirror" for the Compass axes.
>
> **Round FV.** "What I want source to do is to take a look at all the behavioral
> energetics where they overlap, because that's the truth. And then use that as
> the summary." **The document.** Section 1: "The Summary is not a dashboard and
> not a report card. It is a daily mirror."
>
> **Ways it could go.**
> - **A. The Summary stays the page. The new part is "Today", a block on it,
>   and the stored record is "a day's summary".** Cost: two words, but each
>   names one thing.
> - **B. Rename the new part "the mirror".** Cost: collides with the Compass
>   table and with the brief's own layer name.
> - **C. Rename the energetic summary** so the page can keep the name. Cost:
>   reopens FV.
>
> **I would pick A.** **Unblocks** naming in D3 and D7.

### Q10. Should the summary say where to put attention, and by what rule?

> **What it is.** The document ranks what to work on next and calls it the
> highest leverage area, by a formula it says is never shown. The product's
> own rule is that a reading is never a score and that a ladder rung is "a
> count a person could check".
>
> **The document.** Section 10: "The Summary needs a Focus Score, not a
> personal score." Section 11: a status called "needs attention".
>
> **Ways it could go.**
> - **A. Order by countable things:** distinct days of evidence, windows it
>   appears in, days since it was last said, whether it is a line the person
>   wrote about themselves. Say "this is where the record is thickest".
>   Cost: it will sometimes name a thing that is not the most useful, because
>   it measures evidence, not usefulness.
> - **B. The person's own avatar line first,** always. Cost: nothing is named
>   for a person with no avatar.
> - **C. The heaviest address,** as today. Cost: it names what is heaviest and
>   not what is changing.
> - **D. No ranking; show two or three candidates and let the person pick.**
>   Cost: a choice on a screen with many already.
>
> **I would pick A, B breaking ties, and never the words "needs attention",**
> which read as a verdict on the day. **Unblocks** D2's ordering.

### Q11. How many response controls does each sentence carry?

> **What it is.** The document wants six answers on every summary: "This feels
> accurate. Partly accurate. Not accurate. Why did you say this? Add context.
> Correct this." (section 24). Your notes on the page cite a working memory of
> about four choices on a screen. The summary can carry up to eight sentences.
>
> **Ways it could go.**
> - **A. Two on each sentence, "Why" and "Not right",** and the rest inside the
>   drawer. Cost: four of the six are one press further away.
> - **B. All six on each sentence.** Cost: forty eight controls on a page.
> - **C. Three on the whole day,** not on each sentence. Cost: a correction
>   cannot say which sentence it is about.
>
> **I would pick A.** **Unblocks** D7.

---

## 9. Questions for the technical director and the other builds

These are not the owner's.

- **T1. The fetter identifier.** Practice accepts `fetter:Name` as a pattern
  (`engine/practice.js` 283); the graph refuses it (X6). Which side moves? The
  graph could accept `fetter:` as a table node like `pattern`, or Practice
  could resolve a fetter to its addresses. One decision, one gate.
- **T2. The pair to seat resolver is in the UI.** `avRows` and `readSeat`
  (`ui/drills.js` 1024, 1030) resolve a pair against the live `W`. The composer
  needs it in the engine. Port it under the record's own soul, the way
  `traceWithSoul` does (`engine/trace.js` 714), or call Becoming S5 when it
  exists. One resolver, not a second.
- **T3. The document is the gate's input in the Practice build.**
  `tests/practice.js` reads its TDD from the repository root and fails on a
  checkout without it. A `tests/daily.js` that reads this document's enums
  needs the document committed; the lead said not to commit this copy here.
- **T4. Where a correction lives.** `p.summaries.fixes`, or as Practice
  evidence of type `contextual` with `source: user`. Evidence has no field for a
  verdict on a sentence.
- **T5. The nine axes on each history row (D10).** Additive, no version bump, an
  older build drops the key at its next save. Or the Becoming audit's argument
  for a named refusal instead of a silent drop (`BECOMING-AUDIT.md` section 1,
  last finding).
- **T6. The streak (21.J2).** The Summary does not read it. Points does.
- **T7. One local day.** `pracDay` uses the local offset
  (`engine/ladder.js` 27); history rows are UTC strings. A sealed day id is the
  local date, and a person who travels across a zone is in the document's
  "context transfer" and in the daylight saving hour. Decide once and test it.
- **T8. The voice seat's two rules and one `FILES` entry** (4c).

---

## Appendix A. The probes

Run from the repository root. The document is read from its path in the lead's
tree. Build the engine into a scratch path so the tracked `engine.js` is
untouched:

    sh atuned_src/BUILD-engine.sh /tmp/engine.js
    ENGINE=/tmp/engine.js TDD=ATUNED-daily-summary-personal-mirror-TDD.md node probe.js

`probe.js`, whole. Each line prints one result.

    const fs=require('fs');
    const E=require(process.env.ENGINE||'/tmp/engine.js');
    const TDD=process.env.TDD||'ATUNED-daily-summary-personal-mirror-TDD.md';
    const J=JSON.stringify, T0='2026-10-01T09:00:00.000Z', DAY=86400000;
    const sec=(a,b)=>{const t=fs.readFileSync(TDD,'utf8'); return t.split(new RegExp('^#+ '+a+'\\. ','m'))[1].split(new RegExp('^#+ '+b+'\\. ','m'))[0];};
    const line=(id,...x)=>console.log(id,...x);

    /* X1 the record's own history row, laws answered, and a year of them */
    {const p=E.blankProfile('x1'); Object.keys(p.laws).forEach((k,i)=>{p.laws[k]=3.1234+i*0.2917;}); E.loadProfile(p);
     const row=E.snapshot(p), n=J(row).length;
     line('X1 history row bytes',n,'keys',Object.keys(row).join(' '));
     line('X1 365 rows bytes',365*n);}
    /* X2 what a sealed daily summary would cost */
    {const refs=k=>Array.from({length:k},(_,i)=>'story:2026-10-0'+(i+1)+'T09:12:44.123Z');
     const st=i=>({k:'change',tpl:'chg.consistency.up',text:'x'.repeat(150+i*5),ev:refs(3),n:3,of:4,rung:'repeated'});
     const full=J({id:'sum:2026-10-01',d:'2026-10-01',t:T0,rv:1,lex:E.LEX_VERSION,cq:E.CQ_MODEL,alg:E.TRACE_ALG,st:[0,1,2,3,4,5].map(st)}).length;
     const lean=J({id:'sum:2026-10-01',d:'2026-10-01',rv:1,st:[0,1,2,3,4,5].map(()=>({tpl:'chg.consistency.up',a:[3,4],ev:refs(3)}))}).length;
     line('X2 one sealed summary, six statements, text and three refs each',full,'x365',365*full);
     line('X2 one sealed summary, template ids and arguments only',lean,'x365',365*lean);
     const story=J({t:T0,text:'x'.repeat(500),imprints:4,bands:{root:3},lex:E.LEX_VERSION}).length;
     line('X2 365 story entries at 500 characters',365*story);
     line('X2 practice, one event with its log entries is 1176 bytes (node tests/practice.js, the bytes line); a year at 1 and at 3 a day',365*1176,3*365*1176);
     line('X2 heavy year, history plus stories plus practice at 3 a day plus summaries',365*J(E.snapshot(E.blankProfile('y'))).length+365*story+3*365*1176+365*full);}
    /* X3 the document's own counts, read off the document */
    {const s17=sec('17','18'), ev=s17.match(/^[A-Z_]{4,}$/gm)||[];
     line('X3 section 17 event names',ev.length,'in PR_EVENTS',ev.filter(n=>E.PR_EVENTS.indexOf(n)>=0).join(' '));
     const s12=sec('12','13').split('## Forbidden default language')[1].split('## Preferred language')[0];
     line('X3 section 12 forbidden phrases',(s12.match(/^- /gm)||[]).length);
     line('X3 section 9 triggers',(sec('9','10').match(/^- /gm)||[]).length,'section 26 criteria',(sec('26','27').match(/^\d+\. /gm)||[]).length,
      'section 23 routes',(sec('23','24').match(/^(GET|POST) /gm)||[]).length,'section 6 steps',(sec('6','7').match(/^\d+\. /gm)||[]).length,
      'section 25 test lines',(sec('25','26').match(/^- /gm)||[]).length,'section 24 response options',(sec('24','25').match(/^- /gm)||[]).length);}
    /* X4 what the sniffer and the six gates make of the document's own sentences */
    {const p=E.blankProfile('x4'); E.loadProfile(p);
     ['I want to become someone who acts directly, communicates honestly, protects my time, and follows through.',
      'Have the conversation today.','I postponed the conversation again.','I handled the situation directly.','I stated the concern directly.',
      'I avoided telling them what I actually wanted.','I put it off again and changed the subject.','I did it anyway and had the conversation, and I kept going.',
      'I did not tell them because I was afraid of conflict.','I put off the talk with my boss.']
     .forEach(t=>{const r=E.parseStory(t), v=E.verpScan(t);
      line('X4',J(t).slice(0,64).padEnd(66),'imprints',r.imprints.length,'averse cues',v.hits.averse,'intent cues',v.hits.intent,'boundary side',J(E.boundaryCross(t)));});}
    /* X5 the section 31 scenario through the real door, and the trace graph over it; X6 a protocol aimed at a fetter */
    {const p=E.blankProfile('x5'); let P=p.practice;
     const go=(act,a,t)=>{const r=E.practiceDo(P,act,a,t||T0); if(!r.ok)line('X5 REFUSED',act,r.errs.slice(0,2).join(' | ')); else P=r.P; return r;};
     const A='addr:1';
     go('goal_create',{id:'g1',title:'Act directly in difficult conversations',desired_outcome:{description:'Have the conversation the day I plan to',measurable:false}});
     go('behavior_define',{id:'b1',goal_id:'g1',behavior:'Initiate the conversation',priority:1});
     go('protocol_add',{id:'p1',class:'communication',objective_id:'b1',target_patterns:[A],steps:[{type:'release',instruction:'Release the avoidance'},{type:'reframe',instruction:'I am responsible for saying it'},{type:'real_world_action',instruction:'Start the conversation'}],generated_by:{system:'probe',model_version:'0'}});
     go('protocol_accept',{id:'p1'}); go('ritual_create',{id:'r1',protocol_id:'p1',title:'Conversation ritual',tags:['Throat']});
     for(let d=0;d<4;d++){const t=new Date(Date.parse(T0)+d*DAY).toISOString();
      go('event_schedule',{id:'pe'+d,ritual_id:'r1',scheduled_at:t},t); go('event_move',{id:'pe'+d,to:'available'},t);
      go('event_move',{id:'pe'+d,to:'started'},t); go('event_move',{id:'pe'+d,to:'completed',duration_seconds:600},t);}
     go('evidence_record',{id:'e1',source:'user',type:'behavioral',dimension:'effect',metric:'conversations started',before:1,after:3,unit:'count',pattern_id:A,practice_event_id:'pe1'});
     go('evidence_record',{id:'e2',source:'user',type:'negative',dimension:'effect',metric:'conversation postponed',value:1,unit:'count',pattern_id:A,practice_event_id:'pe2'});
     p.practice=P;
     const txt='I put it off again because I was afraid of the conversation and my chest was tight.';
     p.story.entries=[{t:'2026-10-01T20:00:00.000Z',text:txt,imprints:8,bands:E.parseStory(txt).bands,lex:E.LEX_VERSION},
      {t:'2026-10-03T20:00:00.000Z',text:'I postponed the conversation again.',imprints:0,bands:{},lex:E.LEX_VERSION},
      {t:'2026-10-04T20:00:00.000Z',text:'I stated the concern directly.',imprints:0,bands:{},lex:E.LEX_VERSION}];
     const v=E.validateProfile(JSON.parse(J(E.saveProfile(p)))); line('X5 record validates',v.ok);
     const g=E.traceFromRecord(v.profile,E.practiceTraceIntents(v.profile.practice));
     line('X5 graph nodes',g.nodes.length,'edges',g.edges.length,'refused',g.refused.length,'restated',g.restated.length);
     const pt=(a,b)=>{const x=E.tracePath(g,a,b,{undirected:true}); return x?x.map(s=>s.from+' '+s.edge+' '+s.to).join(' ; '):null;};
     line('X5 drawer, evidence e1 to goal g1:',pt({type:'evidence',id:'e1'},{type:'goal',id:'g1'}));
     line('X5 drawer, story 1 to evidence e1:',pt({type:'story',id:'2026-10-01T20:00:00.000Z'},{type:'evidence',id:'e1'}));
     line('X5 drawer, story 2 (postponed) to evidence e2:',pt({type:'story',id:'2026-10-03T20:00:00.000Z'},{type:'evidence',id:'e2'}));
     line('X5 evidence e2 neighbours:',E.traceNeighbors(g,{type:'evidence',id:'e2'}).map(x=>x.dir+' '+x.edge+' '+x.key).join(' ; '));
     line('X5 intentionRead on the ritual day log (p.rituals is empty here):',J(E.intentionRead(v.profile,Date.parse('2026-10-05T12:00:00Z'))));
     line('X5 outcome read on pe1:',J(E.practiceOutcomeRead(v.profile.practice,'pe1')));
     /* X6 a protocol aimed at a fetter, which practice allows */
     const q=E.blankProfile('x6'); let Q=q.practice;
     const g2=(act,a)=>{const r=E.practiceDo(Q,act,a,T0); if(r.ok)Q=r.P; else line('X6 REFUSED',act,r.errs.slice(0,2).join(' | '));};
     g2('goal_create',{id:'g1',title:'t',desired_outcome:{description:'x',measurable:false}}); g2('behavior_define',{id:'b1',goal_id:'g1',behavior:'b',priority:1});
     g2('protocol_add',{id:'p1',class:'communication',objective_id:'b1',target_patterns:['fetter:Fear'],steps:[{type:'release',instruction:'r'}],generated_by:{system:'probe',model_version:'0'}}); g2('protocol_accept',{id:'p1'});
     q.practice=Q; const gg=E.traceFromRecord(q,E.practiceTraceIntents(Q));
     line('X6 a protocol aimed at fetter:Fear, practicePatternOk says',E.practicePatternOk('fetter:Fear'),'; the graph refuses',J(gg.refused.map(r=>r.why).slice(0,2)));}
    /* X7 shape of the record, the outbox deny list, the versions, and a summary key against today's boundary */
    {line('X7 top level keys of a new record',Object.keys(E.saveProfile(E.blankProfile('k'))).join(' '));
     line('X7 OB_NEVER names the summary keys?',['summaries','summary','mirror','corrections'].map(k=>k+':'+(E.OB_NEVER.indexOf(k)>=0)).join(' '));
     line('X7 versions',J({SCHEMA_V:E.SCHEMA_V,PRACTICE_SCHEMA_V:E.PRACTICE_SCHEMA_V,TRACE_V:E.TRACE_V,TRACE_ALG:E.TRACE_ALG,CQ_MODEL:E.CQ_MODEL,LEX_VERSION:E.LEX_VERSION}));
     line('X7 a summary key survives the boundary today?',(()=>{const p=E.saveProfile(E.blankProfile('u')); p.summaries={days:[]}; const v=E.validateProfile(JSON.parse(J(p))); return 'valid '+v.ok+' kept '+!!(v.profile&&v.profile.summaries);})());}

Output at 06f5c52, in full:

    X1 history row bytes 565 keys t m cq dq sq pole jq rad loaded sab cx hy ch dark tier arch lawNow
    X1 365 rows bytes 206225
    X2 one sealed summary, six statements, text and three refs each 2228 x365 813220
    X2 one sealed summary, template ids and arguments only 924 x365 337260
    X2 365 story entries at 500 characters 216445
    X2 practice, one event with its log entries is 1176 bytes (node tests/practice.js, the bytes line); a year at 1 and at 3 a day 429240 1287720
    X2 heavy year, history plus stories plus practice at 3 a day plus summaries 2523610
    X3 section 17 event names 20 in PR_EVENTS RITUAL_STARTED RITUAL_COMPLETED RITUAL_SKIPPED
    X3 section 12 forbidden phrases 7
    X3 section 9 triggers 10 section 26 criteria 12 section 23 routes 13 section 6 steps 17 section 25 test lines 24 section 24 response options 6
    X4 "I want to become someone who acts directly, communicates honest   imprints 0 averse cues 0 intent cues 0 boundary side null
    X4 "Have the conversation today."                                     imprints 0 averse cues 0 intent cues 0 boundary side null
    X4 "I postponed the conversation again."                              imprints 0 averse cues 0 intent cues 0 boundary side null
    X4 "I handled the situation directly."                                imprints 0 averse cues 0 intent cues 0 boundary side null
    X4 "I stated the concern directly."                                   imprints 0 averse cues 0 intent cues 0 boundary side null
    X4 "I avoided telling them what I actually wanted."                   imprints 0 averse cues 1 intent cues 0 boundary side null
    X4 "I put it off again and changed the subject."                      imprints 4 averse cues 2 intent cues 0 boundary side null
    X4 "I did it anyway and had the conversation, and I kept going."      imprints 0 averse cues 0 intent cues 2 boundary side null
    X4 "I did not tell them because I was afraid of conflict."            imprints 4 averse cues 0 intent cues 0 boundary side null
    X4 "I put off the talk with my boss."                                 imprints 0 averse cues 0 intent cues 0 boundary side "coworkers"
    X5 record validates true
    X5 graph nodes 21 edges 21 refused 0 restated 0
    X5 drawer, evidence e1 to goal g1: evidence:e1 supports pattern:1 ; pattern:1 obstructs goal:g1
    X5 drawer, story 1 to evidence e1: story:2026-10-01T20:00:00.000Z supports pattern:1 ; evidence:e1 supports pattern:1
    X5 drawer, story 2 (postponed) to evidence e2: null
    X5 evidence e2 neighbours: out contradicts pattern:1 ; in produces practice_event:pe2
    X5 intentionRead on the ritual day log (p.rituals is empty here): {"said":0,"did":0,"days":7,"pct":null,"broken":[]}
    X5 outcome read on pe1: {"status":null,"evidence":["e1"],"because":"there is evidence of effect, and whether it improved is read by the person"}
    X6 a protocol aimed at fetter:Fear, practicePatternOk says true ; the graph refuses ["to fetter:Fear is not an address number","from fetter:Fear is not an address number"]
    X7 top level keys of a new record v id name created updated soul axes who ui seed meter plan avatar purpose laws intake work gates story rituals history practice trace
    X7 OB_NEVER names the summary keys? summaries:false summary:false mirror:false corrections:false
    X7 versions {"SCHEMA_V":2,"PRACTICE_SCHEMA_V":1,"TRACE_V":1,"TRACE_ALG":1,"CQ_MODEL":2,"LEX_VERSION":"lx77d7eb90"}
    X7 a summary key survives the boundary today? valid true kept false

**The voice probes**, `check.py --brief --line "<sentence>" --layer mirror`, the
sentences and what each returned, are in the table in section 4c. The existing
page as a baseline: `python3 .claude/skills/atuned-voice/check.py --brief
atuned_src/ui/summary.js` read 92 strings, 4 findings (1 flag, 3 review).

**The X5 scenario, as built.** An avatar pair; a goal "Act directly in
difficult conversations"; a behaviour "Initiate the conversation"; a protocol
of class `communication` aimed at `addr:1` with steps release, reframe and
`real_world_action`, generated and then accepted; a ritual on it; four
practice events scheduled, made available, started and completed; evidence
`e1` (behavioural, effect, "conversations started", 1 to 3) and `e2` (negative,
effect, "conversation postponed", 1), both on `addr:1`; three story entries,
the first the document's fear sentence. The record then went through
`validateProfile` before the graph was read, so every link above is one the
boundary accepts.

The sizes of the tables the rows quote are read off the build, not typed:

    node -e "const E=require('/tmp/engine.js');for(const k of ['CHILD','NODES','SAB33','PEOPLE','PR_EVENTS','TRACE_RULES','TRACE_NODE_TYPES','MARKS'])console.log(k,(E[k]||[]).length)"

Run the count commands in "How the statuses are counted" for the tallies. Not
typed here on purpose.


---

# Addendum, 1 October, after the owner's rulings. This supersedes the text above where they differ.

The owner ruled (round OI), and the audit was revised by its author:

| # | Ruling | His words | What it settles |
|---|---|---|---|
| R1 | Language is universal and a soft rule | "keep it as the language as universal as possible. In the knowledge base, we can do all the correlations, awareness and soul and the operating system are one unified field source, Shiva, Brahman, or one... I don't want to be a super hard rule... part of this is educating the person and cross pollinating the language" | Conflict 1 is settled. The seven phrases of the document's section 12 are a note the check reports, never a refusal. Canon words may appear and link to their Knowledge entry. The Knowledge base does not yet carry the correlation (a search of `atuned_src` for "Shiva", "Brahman", "unified field" finds nothing): content for the copy seat, slice C1 |
| R2 | A daily intention is added | "let's add the daily intention" | A new daily act. The word and exact shape are open (Q12, Q13) |
| R3 | Written once a day, on open, frozen for the day, the previous day goes into a bank | "written on open and frozen for the day... it's like an astrology and each day goes in, previous day goes into a bank, a vault" | The unit is a frozen day. A day nobody opened has no entry and cannot be made later. Which open: Q14 |
| R4 | No model | "rules for now" | Rules and templates. The model seam (A3) is deferred |
| R5 | Points never go down | "you just don't get points for the day or for that particular thing that you didn't do" | A missed intention is no entry, never a loss. New hard rule `no_penalty_language`. Conflict 15: the streak halves on a gap and a mark can be un-earned today |

**The shape on the record, replacing section 4a's profile shape.** One new top level key, additive, no `SCHEMA_V` bump (the owner's call):

    p.summaries = { v:1, days:[frozen day, ...], events:[event, ...] }

- `days`: append only, one per local day, never edited. A frozen day carries `id:'sum:YYYY-MM-DD'`, `d`, `t`, `rv` (the rule version, set by hand), `lex` (LEX_VERSION), `cq` (CQ_MODEL), `alg` (TRACE_ALG), `generated_by:{system:'rules', model_version:null, timestamp}`, `basis:{h,e,r,p}` (counts of what was read) and `st`, at most eight statements. A statement: `{k, tpl, text, ev:[{type,id}], read:[{addr,band}], src, rung, links:[glossary terms]}`. A third `ev` kind, `kb:<term>`, is for an education statement; its provenance is `known` and it says nothing about the person.
- `events`: ONE append only, numbered list. Kinds: `intent_set {seq, at, sid, text<=200, seat?}` once per frozen day; `intent_answer {seq, at, sid, kind:'kept'|'partly'|'not'|'unknown'}` once per `intent_set`; `accurate | partly | not | why | context | correct {seq, at, sid, st, note<=600}`. The intention is an event and not a field on the day because the day is frozen and the person writes the line after it was composed. What an intention currently reads as is a fold over the events, never stored. The line is the person's own words and takes the story's privacy class: on the device, never shared, not seen by a cohort lead.
- The boundary refuses by path and never clamps: an `intent_set` over 200 characters, empty, or a second for a day; an `intent_answer` with no `intent_set` or a second answer or a kind outside the four; a `seq` that does not rise by one; any numeric field named `points`, `penalty`, `loss`, `deduct` or `streak`; a `links` term that is not a glossary term.
- Why a sibling list and not `p.history` (measured, probe X8): one frozen day with an intention and the addresses read is 2,793 bytes and a year is 1.02 MB; the same day in a history row is 3,347 bytes and 1.22 MB; four events write history rows and several a day is normal; every reader of history (`lawSeries`, `seriesRead`, `ledgerRead`) would walk the text; the "Ten snapshots" mark (`engine/ladder.js` 225) would move. A record with a year of history and stories is 425,416 bytes without the bank and 1,440,666 with it.

**When a day is frozen.** `dlyDayOpen(p, now)` returns `frozen`, `already`, `silent` (unread or thin: still written as a day with no statements) or `error` (reported through `status()` before anything claims success). Never inside `sumRender`; never in the boot path (a throw there is what `tests/boot.js` guards): after the first render, inside one try and catch. The first composition of the day is the one frozen. No day is back filled. A roster persona or a profile not in the record list is never frozen (the `pSnap` guard, `NotARecord`).

**Hard grounding rules** (structural stage `dlyGround`): `no_fabricated_evidence`, `no_unsupported_causality`, `no_deterministic_profile_claims`, `no_personal_worth_scoring`, `no_penalty_language` (new), `no_hidden_inference`, `show_uncertainty`, `preserve_user_agency`, `no_name`. Soft, a note only: `grounded_language` (the seven phrases).

**Slices, replacing section 4g.** Slice 1 is the first real slice and ships first:

| Slice | What it does | Needs | Owner gate |
|---|---|---|---|
| D1 | The shape and the boundary: `p.summaries {v, days, events}`, `dlyValidate`, every refusal above, the names added to `OB_NEVER` and `LEAD_HIDDEN`, round trip | none | none |
| D2 | The daily intention, engine: set, answer, the fold (said and did counts over 7, 30, 90 days, reads no points and writes none) | D1 | the word (Q13), the shape (Q12) |
| D3 | Detectors over what exists: laws, CQ and DQ by `CQ_MODEL`, heaviest seat, addresses newly opened, seat recurrence and cue counts per window, ritual set against done from the `done` flag, avatar review due, plus the intention fold | D1 | none |
| D4 | The composer: `DLY_TPL`, `DLY_RUNGS`, `DLY_CANON`, silence, novelty, diversity, provenance per statement, the intention sentences with no loss wording | D3 | none |
| D5 | The grounding pass, the soft language note, the canon links, the voice stage and the `brief.py` edits | D4, the voice seat | none |
| D6 | The drawer resolver `dlyWhy` with three reference kinds (graph, record, `kb`) | D4, the fetter identifier repair (T1) | none |
| D7 | The freeze, `dlyDayOpen`, guarded | D1, D5 | which open, Q14 |
| D8 | The surface: the day block, the intention line with one Skip, the answer prompt, the bank (past days) as a list, the drawer, the response controls | D6, D7 | layout Q2, controls Q11, the word Q13 |
| D9 | The 7, 30, 90 day views over the bank | D8 | none |
| C1 | Knowledge entries carrying the correlation | the copy seat | none, ruled R1 |

**Open questions for the owner after the rulings** (full text with options and costs is in the author's report, summarised here): Q2 where the day block sits (under the story, or on the plate, or its own page, or History only; recommend under the story); Q12 what the intention line is (one optional line with one Skip; the answer asked on the next open as Yes, Partly, No, Skip; recommend that); Q13 the word for the bank of past days, because "vault" is already the Story page's name for what you have released (recommend "Past days"), and the word for the intention, because "intention" already means three other things (recommend "aim"); Q14 which open freezes the day (recommend the first open of the app each local day); Q15 whether "points never go down" covers the streak and the marks (recommend yes); Q5 showing where said and done disagree (recommend two plain facts); Q6 who sees the bank, how long, delete (recommend device only, exported, never shown to a lead); Q8 read behaviour or ask (recommend ask first); Q9 which of four things is "the Summary" (recommend the page stays the Summary, the new part is "Today", the stored thing is "a day"); Q10 how the day's focus is ordered (recommend a countable tuple, never "needs attention"); Q11 response controls per sentence (recommend two on a sentence).
