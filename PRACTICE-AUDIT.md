# Practice audit. The Practice TDD against the code

The document: `ATUNED-practice-ritual-accountability-trace-graph-TDD.md`, 2075
lines, read in full. Its own section 40 asks for every requirement to be
classed EXISTS, PARTIAL, MISSING, CONFLICT or UNVERIFIED against the real
implementation, and says "The AI must never infer that documentation equals
implementation." This is that table.

## The stamp on this measurement

    commit        1968880, the base of this branch. Line numbers below are
                  at that commit, so they stay true for the files this build
                  did not touch.
    read          ui/ritual.js whole; engine/ladder.js whole; engine/schema.js
                  whole; ui/release.js 1 to 250 and 700 to 870, and every
                  declaration by name; engine/data/practice.js whole;
                  ui/avatarui.js 140 to 360 and 1820 to 1865; ui/auth.js 1 to
                  60; engine/core.js 205 to 222; engine/export.js whole;
                  reviews/SPEC-ritual-accountability.md parts 0, 2, 4, 5, 6
                  and 7 and pass 5 whole; PRIORITY.md section 21 whole;
                  TASKS.md rounds NS to NW; DECISIONS.md every line matching
                  ritual, accountab or streak; the DESIGN-ritual.md and
                  RITUAL-RECONCILE.md headings.
    searched      atuned_src for trace graph, ReleaseSession, ReleaseQueue,
                  ReleaseEvent, handshake, sync, fetch, goal, protocol,
                  evidence, outcome, reframe.
    measured      every claim marked measured was run against the built
                  engine, not read. The probes and the gate are in
                  tests/practice.js.

## How the statuses are counted

Not typed here. A count typed into a document that the table then grows past
is the defect CLAUDE.md records twelve times. Read it off the table:

    grep -oE '\| (EXISTS|PARTIAL|MISSING|CONFLICT|UNVERIFIED) \|' PRACTICE-AUDIT.md | sort | uniq -c

"Built here" in the Required change column means engine/practice.js in this
branch carries it, host free, with the gate named in the last column.

## The table

| # | Requirement | Current implementation | Status | File and line | Data dependency | Required change | Tests required |
|---|---|---|---|---|---|---|---|
| A1 | Pattern system (s2) | Addresses in the node table, the nine fetters, the saboteurs and the sniffer all exist. There is no Pattern object and no pattern id. The release keys an address as addr:N for its dated firsts | PARTIAL | engine/core.js 11 (BY); engine/data/canon.js 301 (CHARGES); ui/release.js 837 | NODES, CHARGES | A pattern id is addr:N or fetter:Name, checked against the tables. Built here, practicePatternOk | Unknown address and Joy refused (built) |
| A2 | Story system (s2) | Story entries are validated at the boundary and read by sniffStory | EXISTS | engine/schema.js 705 to 774; engine/sniff.js | story.entries | None for P0 | Existing gates |
| A3 | Trace Graph (s2, s15, rule 6) | None. No file or declaration in atuned_src names a trace graph (searched). PRIORITY.md section 21 records it as not doing | MISSING | none | none | Built here: practiceTraceIntents returns intents to the graph contract. The graph is the parallel build | Worked example intents (built) |
| A4 | Evidence model (s2) | None. The word appears only in comments | MISSING | none | none | Built here | Evidence suite (built) |
| A5 | Release Protocol system: ReleaseSession, ReleasePattern, ReleaseQueue, ReleaseEvent, registry (s2, s8) | The release engine exists as functions: meterPlan, meterRerunPlan, meterRun, meterRerun, meterBudget and releaseWork, run by relPick and relCoolDown. None of the five named objects exists (searched). A run's log is RUN.log, in memory, gone when the card closes | PARTIAL | engine/schema.js 1117, 1182, 1197, 1244, 1250; engine/compute.js 177; ui/release.js 154, 230, 705 to 867 | meter.unique, RUN | Built here: a release class protocol plans through meterPlan or meterRerunPlan and verifies on meter.unique. A persisted per run record is 19.C2 and not this build | Plan equals meterPlan exactly (built) |
| A6 | Reframe system (s2) | The truth channels are the reframe half of a release, bucketed as Reframe, counted as meter.truthLines. No Reframe object | PARTIAL | ui/release.js 36, 988; engine/schema.js 70 | meter.truthLines | ProtocolStep type reframe exists (built). Running a reframe step stays the release card's | Step type enum (built) |
| A7 | Ritual system (s2) | Two stores. Plans beside the record under atuned-ritual-active, keyed by profile id, not exported. A day log on the record, p.rituals, one entry a day set or done | PARTIAL | ui/ritual.js 38 to 48, 171 to 231; engine/schema.js 100, 504 to 700 | side store, p.rituals | Mapped by practiceFromLegacy, stated and tested and not run (see below) | Migration suite (built) |
| A8 | Accountability system (s2) | streakRead, ledgerRead, intentionRead and the marks. intentionRead is on no surface | PARTIAL | engine/ladder.js 32 to 145, 160 | p.rituals | Its surface is 21.J6. The streak defect is 21.J2 | None here |
| A9 | Longitudinal intelligence (s2) | History snapshots carrying CQ_MODEL, lawSeries, seriesRead, dated firsts | PARTIAL | engine/schema.js 241 to 313; engine/ladder.js 262 | history, meter.firsts | None in P0 | None here |
| A10 | Client side persistence (s2) | A bound store; pPersist reports a failed write; an unreadable store is set aside, never overwritten | EXISTS | engine/schema.js 322 to 416 | STORE | Practice persists inside the profile through it (built) | Round trip (built) |
| A11 | Versioned user record (s2) | SCHEMA_V 2, validateProfile, pImport atomic | EXISTS | engine/schema.js 13, 775 to 1076, 1407 to 1420 | profile | p.practice added, additive, no SCHEMA_V bump, which is the owner's call (built) | Older record fills the blank (built) |
| A12 | Server synchronization (s2, s37, s41 P0 sync) | None. ui/auth.js says "It does not sync". The app gains network at one seam, sign in | CONFLICT | ui/auth.js 13 to 20; CLAUDE.md, "What this project is becoming" | none | Not built. Syncing practice records needs the owner's ruling against "Storage is still the person's own browser for everything except the quiz record" | None until ruled |
| A13 | Entitlement and payment boundary (s2) | The plan refuses customer, subscription, email, key, secret and token by name; the record refuses token, session, password and email | EXISTS | engine/schema.js 917 to 946, 1074 | p.plan | Every practice object refuses account, payment and session fields by name (built) | Every name on every kind (built) |
| A14 | AI Handshake architecture (s2, s26) | None. The one hit is a comment in drills.js naming a document | MISSING | ui/drills.js 1302 | none | P1. The provenance and generated_by fields built here are its prerequisite | None here |
| A15 | Somatic events under release (s8) | Heavy marks during a run live in RUN.heavy, keyed by plan index, and are gone when the card closes; the finished card marks the address | PARTIAL | ui/release.js 1000 to 1016, 788 to 792; engine/schema.js 1167 | RUN.heavy | Not P0. A persisted run record would carry them (19.C2) | None here |
| A16 | Pattern replacement under release (s8) | A release empties the address and installs its opposite pole | EXISTS | ui/release.js 441 to 482; engine/schema.js 105 | axes opp | None | Existing gates |
| A17 | Release verification (s8) | The TDD names it as existing and does not say what it is. The code has the settle (two minutes) and the heavy marks, and the meter records what was opened. Which of these the document means cannot be told from it | UNVERIFIED | ui/release.js 109, 636, 1255 | meter.unique | Built here: practiceReleaseVerify reads meter.unique, observed. Whether that is the document's verification is the owner's to confirm | Verify after meterRun (built) |
| A18 | The parallel Trace Graph's traceApply (task contract) | Not in this tree. Coded against the stated contract only | UNVERIFIED | none | none | The lead wires practiceTraceIntents into traceApply after the merge | Intent shape against PR_NODE, PR_EDGE, PR_SRC (built) |
| B1 | Goal (s4) | None. The avatar's pairs and the purpose map are the nearest things. The Ritual chain labels the called practice "Goal" | MISSING | engine/avatar.js; ui/ritual.js 766 to 768 | avatar.pairs | Built here: schema, statuses, events. See conflict 8 for the word | Schema and state suites (built) |
| B2 | BehaviorObjective (s5) | None | MISSING | none | none | Built here | Schema and state suites (built) |
| B3 | Protocol (s6) | None. Nearest: a plan's step list, and the teachers' step lists | MISSING | ui/ritual.js 217 to 225; engine/data/practice.js 183 to 216 | PRACTICE | Built here, with a status field and versions | Protocol suite (built) |
| B4 | ProtocolStep (s7) | A plan's steps are practice library keys; the timer is plan.tm; an affirmation exists only as the Avatar's "say it" rule with its own days | PARTIAL | ui/ritual.js 62 to 69, 257; ui/avatarui.js 1828 to 1851 | PRACTICE | Built here; step.practice names the library row instead of copying it | Unknown practice refused (built) |
| B5 | Release Protocol integration (s8) | A release schedule's day is marked done when a run on its address finishes; the release card hands its log to ritOpen | PARTIAL | ui/ritual.js 397, 548 to 559; ui/release.js 853, 1560 | plan.rel | Built here: class release calls the engine and must carry an address and a release step | Release refusals (built) |
| B6 | Ritual (s9) | A plan {id, steps, when, where, days, from, stop, band, track, rel, tc, tags, on, tm}, off the record and never exported | PARTIAL | ui/ritual.js 185 to 231 | side store | Ritual object built. Plans onto the record is 19.C5 and the UI build's | Migration suite (built) |
| B7 | PracticeEvent (s10) | A day entry {t, track, band, steps, min, when, where, done}, two states: set, and done | PARTIAL | engine/schema.js 504, 637 to 700; ui/ritual.js 321 to 325, 528 | p.rituals | Built here | State suite (built) |
| B8 | Accountability measures intention, practice, observation, evidence, outcome (s11) | Intention against practice only (intentionRead). Nothing records an observation, evidence or an outcome | PARTIAL | engine/ladder.js 135 to 145 | p.rituals | Evidence and Outcome built here | Evidence suite (built) |
| B9 | Evidence (s12) | None | MISSING | none | none | Built here, with a dimension field (see decisions) | Evidence suite (built) |
| B10 | Effect and affect measured separately (s13, rule 15) | None | MISSING | none | none | Built here: dimension on every piece of evidence; a practice's quality read as affect; the two never summed | Effect and affect suite (built) |
| B11 | Outcome (s14) | None | MISSING | none | none | Built here. A claim of change with no evidence of effect is refused at the boundary | Evidence suite (built) |
| B12 | Never infer resolved from a successful ritual (s14) | compute() never reads p.rituals. Measured in PRIORITY.md section 21: thirty days done moved no reading | EXISTS | PRIORITY.md 2655 to 2666 | none | Keep. Practice objects write no axis, law or charge | Shared tables unchanged (built) |
| C1 | Required relationships (s15) | No graph | MISSING | none | none | Built here as intents, one per fact, in section 17's direction | Every relation present (built) |
| C2 | Graph node types (s16) | No graph | MISSING | none | none | Intents typed from it | Read off the TDD (built) |
| C3 | Graph edge types (s17) | No graph | MISSING | none | none | Intents edged from it | Read off the TDD (built) |
| D1 | Goal decomposition (s19) | None | MISSING | none | none | P1. Needs A14 and a ruling on where inference runs | None here |
| D2 | Pattern prioritization (s20) | The heaviest seat decides the practice; the release offers the heaviest address. Not the twelve factors | PARTIAL | ui/ritual.js 82 to 117; ui/release.js 1017 | compute() | P1 | None here |
| D3 | Protocol selection (s21) | ritFor calls the lightest practice under a tier ceiling. Measured in PRIORITY.md 21.J5: 5 of 17 practices reachable | PARTIAL | ui/ritual.js 82 to 117 | PRACTICE | P1, after T4 | None here |
| D4 | Protocol consolidation (s22) | Starting the same steps twice wakes one ritual. Consolidation by accident (19.C7) | PARTIAL | ui/ritual.js 355 to 374 | side store | P1 | None here |
| D5 | Progression, with regression (s23) | A teacher's ritual opens held steps as the charge drops. No levels, no regression | PARTIAL | engine/data/practice.js 207 to 216; ui/ritual.js 418 to 423 | DQ | Built here: advance and deescalate revisions and their events. The engine that decides when is P1 | Protocol suite (built) |
| D6 | Adaptive accountability, classification and proposals (s24) | None. The streak halves a run rather than asking why | MISSING | engine/ladder.js 46 to 75 | p.rituals | Built here: practiceInvestigate, the adapt action, the decision on the log | Miss suite (built) |
| D7 | A miss is not a lack of motivation (s25, rule 12) | A copy posture only ("A miss is data" in one practice). Nothing classifies a miss | PARTIAL | engine/data/practice.js 148 to 152 | none | Built here: no classification reads motivation, and the word is refused by name | Miss suite and its bite (built) |
| E1 | Accountability state machine (s25) | Set and done only. Missed is drawn per day by the calendar and never stored | PARTIAL | ui/ritual.js 278, 677 to 686 | p.rituals | Built here, as a table that refuses by name | Every pair of 8 statuses (built) |
| E2 | Miss path: missed, threshold, investigate, adapt (s25) | intentionRead lists broken commitments with a seat. No threshold, no investigation | PARTIAL | engine/ladder.js 135 to 145 | p.rituals | Built here: practiceMissRead, derived and not stored | Miss suite (built) |
| E3 | Goal, behavior, protocol and ritual statuses | A ritual's active is derived from from, days and stop | PARTIAL | ui/ritual.js 235 to 237 | side store | Built here | State suite (built) |
| F1 | PracticeHandshake contract (s26) | None | MISSING | none | none | P1 | None here |
| F2 | Five provenance states, never collapsed (s26, rule 9) | The sniffer marks a fetter stated or inferred; S2 ruled "ask, never silently show" | PARTIAL | engine/sniff.js 544; TASKS.md round NU, S2 | none | Built here: src on every object, moved only by accept or confirm | Provenance suite (built) |
| F3 | Protocol versions historically immutable; events keep their version (s27, rule 11) | None | MISSING | none | none | Built here | Older versions checked action by action (built) |
| F4 | schema, contract, protocol and algorithm versions (s27) | The record has SCHEMA_V; a story entry has its lexicon version; a history row has CQ_MODEL, an algorithm version in all but name | PARTIAL | engine/schema.js 13, 243; engine/sniff.js 897 to 903 | none | Built here on every practice object | Newer schema refused (built) |
| F5 | generated_by and approved_by (s27) | None | MISSING | none | none | Built here | Provenance suite (built) |
| G1 | The seven lists on the versioned user record (s28) | p.rituals exists and means a day log, not Ritual objects. Plans are off the record | PARTIAL | engine/schema.js 100; ui/ritual.js 171 | profile | Built here as p.practice, with protocol_steps as an eighth list (see decisions) | Round trip (built) |
| G2 | Use the existing persistence and sync boundary (s28) | Persistence yes; sync none (A12) | PARTIAL | engine/schema.js 775, 1407 | profile | Built here through validateProfile and pImport | Atomic refusal (built) |
| G3 | No personal Practice data in Canon (s28) | Canon is static tables built at load and never written per person | EXISTS | engine/data/canon.js | none | Keep | Tables unchanged after a full scenario (built) |
| G4 | No payment credentials in Practice objects (s28) | No practice objects; the posture exists for the plan and the record | PARTIAL | engine/schema.js 944 to 945, 1074 | none | Built here, by name, on every kind | Every name on every kind (built) |
| G5 | Future server tables (s29) | None, and the TDD itself defers them | MISSING | none | none | Not P0 by the TDD's own words | None |
| G6 | Browser closes during practice: continue, restart, mark interrupted (s37) | The timer is never kept: "a timer is a moment, not a record" | MISSING | ui/ritual.js 68 to 69 | RIT.run | Built here: interrupted goes back to started or closes as partial. Persisting the moment is the UI build's | State suite (built) |
| G7 | Network failure, queue synchronization (s37) | No sync | CONFLICT | ui/auth.js 13 to 20 | none | Waits on A12 | None |
| G8 | Sync conflict: never silently overwrite newer state (s37) | One device. A refused record is kept verbatim; an unreadable store is set aside before anything writes | PARTIAL | engine/schema.js 345 to 415 | STORE | Waits on A12 | None |
| G9 | Protocol modification: instances keep their version (s37) | None | MISSING | none | none | Built here | Protocol suite (built) |
| H1 | Event vocabulary, emitted on every meaningful transition (s30) | None. Undo labels and status() lines are the nearest | MISSING | engine/undo.js | none | Built here: an append only log, numbered, every entry in the vocabulary | State suite and its bite (built) |
| H2 | Analytics funnel and metrics (s38) | The outbox carries question, bug, rating and feedback only, and its deny list keeps personal data on the device | MISSING | engine/outbox.js 23 to 34 | none | Not built. Any off device form needs a ruling (conflict 12) | None |
| H3 | Rule 16 and s38: the metric is change, not streak length; do not optimise for completion | The streak and the Seven, Thirty and Ninety day marks are the progression the owner ruled, and the streak counts days set and never done (21.J2) | CONFLICT | engine/ladder.js 32 to 36, 160 to 177; DECISIONS.md 1814 to 1816 | p.rituals | Named, not resolved (conflict 7) | None here |
| I1 | Information architecture: Practice, Release, Accountability, Intelligence (s31) | The loop is discover, play, flow, embody, and Ritual is in Flow (T3) | CONFLICT | engine/core.js 214 to 218; TASKS.md round NS, T3 | TABDEF | Named, not resolved (conflict 3) | None |
| I2 | Practice builder, three modes (s32) | Mode C in part: the builder picks practices, seats, a timer, weekdays, a when and a where | PARTIAL | ui/ritual.js 925 to 1005 | PRACTICE | P1 UX | None here |
| I3 | Ritual builder: what, when, how long, what to notice, what counts (s33) | What, when, how long. No observation and no verification | PARTIAL | ui/ritual.js 925 to 1005 | side store | P1 UX. Steps of type observation and verification exist (built) | None here |
| I4 | Today screen (s34) | Rings for today's active rituals, the streak in the middle | PARTIAL | ui/ritual.js 778 to 805 | side store | P1 UX | None here |
| I5 | 30, 60 and 90 day change record (s35) | The Record view compares snapshots; seriesRead has spans. Nothing per goal | PARTIAL | ui/record.js 47; engine/ladder.js 257 to 288 | history | P1 UX | None here |
| I6 | Context transfer (s36) | None | MISSING | none | none | CONTEXT_TRANSFERRED is in the vocabulary and nothing emits it yet. P1 | None here |
| J1 | Testing requirements (s39) | The ritual bag has boundary gates | PARTIAL | tests/engine.js | none | Built here: schema, state, protocol, evidence, persistence, migration, graph intents. Offline, sync, conflict and the 30 to 90 day tests wait on A12 and the UI | tests/practice.js |
| J2 | P0 integration: Pattern, Release, Reframe to Protocol; Ritual to Accountability; Accountability to Evidence; Evidence and Outcome to the graph (s41) | Ritual to Accountability through the ladder only | PARTIAL | engine/ladder.js | p.rituals | Built here: patterns on protocols, the release class, reframe steps, evidence and outcome intents. Ritual to Accountability through PracticeEvents is the UI build's | Intents and release suites (built) |
| K1 | Rule 1: Ritual is execution, not intelligence | The practice a state calls for is decided inside the Ritual surface (ritFor) | PARTIAL | ui/ritual.js 82 to 117 | compute() | Move ritFor's decision into the engine when protocol selection is built (P1). Port, do not rebuild | None here |
| K2 | Rule 10: user goals stay user owned | No goals | MISSING | none | none | Built here: a goal is known or user_confirmed or it is refused | Provenance suite and its bite (built) |
| K3 | Rule 13: adapt the intervention, do not punish | The streak halves rather than resets (Bible 1133), which softens a penalty and is still one | PARTIAL | engine/ladder.js 46 to 75 | p.rituals | Built here: the adapt path. The streak is the owner's | None here |
| K4 | Ritual.tags as free strings (s9) | Tags are a closed set of the seven seats, ruled TG4 | CONFLICT | ui/ritual.js 56 to 61, 208 to 209 | BANDS | Built here to the ruling, not the TDD (conflict 6) | Free text tag refused (built) |
| K5 | user_id on Goal, PracticeEvent and Evidence (s4, s10, s12) | The record carries no account id, by the privacy ruling | CONFLICT | engine/schema.js 71 to 84, 1063 to 1075 | none | Built here to the ruling: user_id refused by name (conflict 5) | Refused on every kind, and its bite (built) |
| K6 | PracticeEvent as the authoritative execution record (s10, rule 3) | The Ritual tab deletes day entries: Delete on the record, and taking back a press on any day but the first | CONFLICT | ui/ritual.js 506 to 520, 593 to 604 | p.rituals | Named, not resolved (conflict 2). This build has no delete | None here |
| K7 | One word per concept for Ritual | p.rituals is a day log; a TDD Ritual is a schedule. Two meanings, one word, on one record | CONFLICT | engine/schema.js 100 | profile | Named (conflict 9). The new objects sit under p.practice so nothing collides on the record | None here |

## What the Ritual tab stores today, and what happens to it

Reuse and migrate, never duplicate. Two stores exist and neither is moved.

- **p.rituals**, the day log on the record. The Ritual tab writes it, the
  ladder counts it (streak, ledger, marks), and the Avatar's cycles read it.
- **The plans**, beside the record under `atuned-ritual-active`, keyed by
  profile id. Not exported, never through the boundary (19.C5).

`practiceFromLegacy(p, plans, now)` states how both map into the new objects,
and the gate holds it to that: a plan is one Protocol v1 and one Ritual; a plan
with an address is a release protocol on it, release step first; a day entry
is one PracticeEvent; done stamped is completed and known; done false past the
late mark is missed and observed; done false and still markable is scheduled;
an entry from before done existed is completed and inferred; an entry no plan
covers gets an inferred, inactive ritual of its own. Nothing is dropped, and
the two stores are not touched.

**It is not run on load, and that is deliberate.** Running it now writes a
second copy of every day while the Ritual tab keeps writing the first, which is
two truths about the same day. The cutover belongs to the UI build that moves
the Ritual tab's writer onto PracticeEvents, so there is one writer at every
moment. What the migration loses, said so: a done stamp does not say whether a
press or a finished release wrote it (`ritMarkOn` writes both), so a release day
reads known and not observed; and the log starts empty, because writing events
dated in the past would invent a history.

## Conflicts with standing rulings, named and not resolved

1. **T1, a ritual moves its own avatar track and never fakes seat charge.**
   No conflict with the TDD, which says the same thing in rules 4 and 5. It
   binds this build: no practice object writes an axis, a law or anything
   compute() reads, and the gate asserts the shared tables are unchanged after
   a full scenario. The risk is at the UI build, if an Outcome or a piece of
   Evidence is ever drawn as a seat's load moving.
2. **T2, a committed journal entry is never deleted.** The TDD has no
   deletion and neither does this build (abandoned is the way out, the log
   only grows). But the Ritual tab today deletes ritual day entries
   (`ritDelEntry`, and `ritLog` splicing a taken back press), which T2 does not
   cover and the TDD's rule 3 does: the execution record is authoritative.
   Whether a practice event may be deleted is his. Records off the device will
   also carry a deletion obligation.
3. **T3, Ritual belongs in Flow.** Section 31's information architecture
   groups Practice, Release, Accountability and Intelligence, which is a
   different spine from discover, play, flow, embody. The loop ruling wins
   until he says otherwise.
4. **Server synchronization** (sections 2, 37 and 41's P0 sync) against
   CLAUDE.md's "Storage is still the person's own browser for everything except
   the quiz record" and auth.js's "It does not sync". Not built.
5. **user_id on Goal, PracticeEvent and Evidence** against the privacy
   ruling that the record carries no account id. Built to the ruling: a
   practice object belongs to the record that holds it, and user_id is refused
   by name.
6. **Ritual.tags as free strings** against TG4, "no to free text tags... yes to
   a closed field validated against a table". Built to the ruling: tags are
   the seven seats.
7. **Rule 16, change and not streak length**, against his EI ruling, "the
   accountability tracker is the progression", and the streak and the day
   marks built on it. Sharpened by 21.J2: the streak counts days set and never
   done.
8. **"Goal" as a word.** Round LT ruled the Ritual chain's third node "Goal",
   and it names the practice the seat calls for. The TDD's Goal is what the
   person wants to change. One word per concept: one of the two has to move,
   and the label is his.
9. **"Ritual" as a word.** p.rituals is a log of days; the TDD's Ritual is a
   schedule. The new objects live under p.practice so nothing collides on the
   record, but the same word now means two things in one file.
10. **reviews/SPEC-ritual-accountability.md proposed a schema v3**, p.ritual
    with cards, marks and a season, and engine/rite.js. None of it was built
    (searched). It and this TDD are two designs for the same data. Neither is
    retired here; which one the Ritual page follows is his.
11. **"Automated detection, never automated release"** (that spec, 4.7) against
    the TDD's generated protocols. Compatible as built: a generated release
    protocol is proposed until a person accepts it, and practiceReleasePlan only
    plans. A run is still a person's press.
12. **The analytics funnel** (section 38) would carry practice behaviour off
    the device. The outbox exists for feedback only and its deny list keeps
    personal data home. Any telemetry of practice events needs his ruling.
13. **Documentation is not implementation.** Section 2 lists a Trace Graph, an
    Evidence model, ReleaseSession, ReleaseQueue, ReleaseEvent, a protocol
    registry, an AI Handshake and server sync as existing foundations. None of
    them is in the code (rows A3, A4, A5, A12, A14).
