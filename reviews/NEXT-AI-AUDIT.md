# Next AI handoff, audited against the real code

Read only for the product. Nothing built into the app from this document,
nothing merged. The two documents are
`reviews/ATUNED-Next-AI-Experience-Measurement-Handshake.md` (1,638 lines,
sections 1 to 27, read in full) and `reviews/ATUNED-Next-AI-Documentation-Index.md`
(333 lines, read in full). They landed at round QR, commit `eacc3b0`.

The models for the discipline are `reviews/CONGRUENCY-AUDIT.md` and
`reviews/TUNED-AWARENESS-AUDIT.md`. Both already audited the canonical chain
this document restates (story, observation, mirror, confirm, release, verify),
so that chain is **not re-graded here**. Section 2 below lists every part of it
with a pointer and says only whether the finding has moved since. The grades
in this file are for what the document adds.

Grades are the house set: EXISTS, PARTIAL, MISSING, CONFLICT, UNVERIFIED.
"Measured" means a probe was run for this audit, in node against the
committed `engine.js` or in real Chromium against the committed
`source.html`, not that a comment said so. Every other claim cites a file and
a function. Date: 3 October 2026.

---

## The verdict in one line

**The document's genuinely new idea, a user reported intensity for one named
signal taken before a release and again after it, is real, cheap and missing,
and the engine already has a write-once slot for it; almost everything around
that idea collides with something the owner has already ruled:** the signal
test as a pick-list is the exact shape he struck in round SIG, the three
direction bands reuse the word Oscillating for a different range than the ten
shipped tiers, "gap = 100 minus CQ" reverses a deliberate change from CQ
headroom to expression headroom, and the results screen's example ("CQ 62 to
66 after one release") is about 360 times what this engine produces, measured.

**The addendum, in one line (3.7):** nothing shows how sure a single reading
is beyond the onboarding mirror's "you named" and "a guess"; a tolerance
figure was shown once and he struck it; and the "why" he wants already exists
in the engine as separate signals that sort cleanly into the person's input
and the engine's own guessing, with the masked dictation bug as the first
input side case.

---

## Step 1. The canonical build

| | |
|---|---|
| Branch | `claude/laughing-feynman-xhfyj3` |
| Commit audited | `eacc3b0` (3 October, round QR log; the last commit touching code is the claims gate merge `d1594c9`) |
| Source file | `source.html`, 4,202,454 bytes, md5 `d939aafe229bd74486d1c69f2cf503de` |
| Build stamp in the file | `data-build="v1471 d1594c9 2026-10-02 23:03"` |
| Versions in the engine | `SCHEMA_V` 2, `CQ_MODEL` 2, `TRACE_V` 1, `TRACE_ALG` 1, `PRACTICE_SCHEMA_V` 1, `DLY_SCHEMA_V` 1, `LEX_VERSION` read off the tables |
| Gate run for this audit | `node tests/engine.js`, 4,436 passed, 0 failed |

Branches read and not touched, because tonight's builds overlap this
document: `flow3-qn` (`14e6b64`, the three column Flow page and its
suggested rituals), `storyboard-faq-nav` (`81b7c29`, the FAQ and the value
felt question), `release-carousel` (`f164f17`, the full screen release),
`onboarding-real-skin` (the full screen onboarding skin). None is merged at
`eacc3b0`. Each is cited by branch where it matters.

---

## Step 2. Already audited, not re-graded

The document's own section 1 says its canonical path is unchanged, and its
index says "do not replace this architecture with the new onboarding
sequence". So the chain stays where it was graded. What moved since, checked:

| Document item | Graded in | What it said | Since then, checked at `eacc3b0` |
|---|---|---|---|
| Evidence ledger, observation, hypothesis (sections 1, 12, 13) | `CONGRUENCY-AUDIT.md` 2.2, 2.8, 5.2 | MISSING as a contract, PARTIAL as parts | Unchanged. Still two observation contracts specified and none built (`TUNED-AWARENESS-AUDIT.md` C6). This document adds a third, `SignalObservation` (section 4), which is a different object again. See 3.1 |
| Story, sniffer | `CONGRUENCY-AUDIT.md` 2.1 | PARTIAL | Unchanged. One new measured defect below, from the masked dictation bug: stars are turned into spaces before the scan (Step 6) |
| Mirror, confirm, correct (beat 08) | `CONGRUENCY-AUDIT.md` 2.3 | CONFLICT on correction and on the No's charge | F16 still open: the Yes and Not me still do not reach the graph (`TUNED-AWARENESS-AUDIT.md` measured confirmed 0, unanswered 13) |
| Release engine (beat 10, rule 2) | `CONGRUENCY-AUDIT.md` 2.4 | EXISTS, one engine | Unchanged. `release-carousel` rebuilds the screen, not the engine |
| What changed (beat 13) | `CONGRUENCY-AUDIT.md` 2.5 | MISSING | **Landed.** `releaseVerify` (`engine/journey.js:134`), `RV_ANSWERS` and `RV_SAY` (`engine/practice.js:183-191`), asked on the finished card (`ui/release.js:817`). The document's five words match `RV_SAY` exactly, except "I'm not sure", which the product says as "Not sure" on purpose |
| Persistence and reload | `CONGRUENCY-AUDIT.md` 2.6 | CONFLICT, the `ob` refusal | **Fixed.** `ENT_KEYS` carries `ob`, `vEntryOb` validates it (`engine/schema.js:797-847`) |
| Field and history (beat 17) | `CONGRUENCY-AUDIT.md` 2.7 | CONFLICT | Unchanged, with one correction to that audit: history rows **do** carry an arithmetic stamp, `m: CQ_MODEL`, since `dd0bf23` on 25 September (`snapshot`, `engine/schema.js:287`). See 3.6 |
| Memory, next decision | `CONGRUENCY-AUDIT.md` 5.2 | MISSING | Unchanged |
| Safety | `CONGRUENCY-AUDIT.md` 2.12 | MISSING, J0 | Unchanged. J0 still open |
| Storyboard beats 01, 02, About page, FAQ, animations, the claims rules (sections 9, 17 to 21, 23, rules 14 to 16) | Round QO, `TASKS.md` (the Creative Storyboard TDD, read twice) | Black field look shipped with the onboarding skin; FAQ, nav and value felt dispatched; claims boundary gated | FAQ and value felt are on `storyboard-faq-nav`, unmerged. The claims gate is merged (`d1594c9`). This document's About page order and FAQ answers add the gap and direction words, which are graded in 3.3 and 3.4 and should not be copied into the FAQ until those rulings are made |

One naming defect in the index itself: it calls the canonical source
`ATUNED_System_Congruency_TDD.md`. The file in this repository is
`reviews/ATUNED-System-Congruency-MVP-TDD.md`.

---

## Step 3. What is new, graded

### 3.1 The signal test (sections 3, 4, beats 03, 04)

The document's signal test: notice, pick a feeling word from a list (tense,
heavy, afraid, frustrated, numb, unclear, something else), pick a place from a
list (chest, stomach, throat, head, shoulders, elsewhere), and the Field
responds, all before any story.

**The owner has already ruled what the signal test is, and it is not this.**
`TASKS.md` section SIG, his words: "This is not the signal test. The signal
test is very personal. It has nothing to do with any of this text here." His
specification, SIG1 to SIG6: turn the senses inward, think yes ten times,
think no ten times, feel the difference in quality. And SIG5, verbatim: "We
all feel it differently and the words we would use will be different. **So
the test may not ask a person to pick from a list of words**, which is close
to what the current build does and is why it is wrong." SIG10 rejects a
location list for the same reason. He then rewrote the script twice (round
JY, then round KD: "move your awareness to your throat ... think yes ten
times, feel its quality, then think no ten times") and said in round KE "it
doesn't need to be anything impressive. This is a moment for them to stop."
The research behind it is `RESEARCH-signal.md` and the prototype is
`proto/signal/signal.html`. The onboarding mockup carries his version
(`mockups/onboarding-v2/src/js/01-data.js:78`, "Think yes, ten times. Notice
how it feels there.").

**And the shipped onboarding cut the signal test.** `ui/onboard.js:33-38`:
"THE SIGNAL TEST, round MP's breath script, is gone from this sheet." What
ships instead, before the story, is steps 3 and 4 of eight: Feel ("What are
you feeling?") and Body ("Where do you notice it?", the document's own
sentence, word for word).

| Requirement | Real | Grade |
|---|---|---|
| A pre-story beat that notices a feeling | Feel, step 3, `ui/onboard.js:189-193`; Settle before it, "Notice what is here." (`:183`) | PARTIAL |
| Pick from ordinary feeling words | `OB_FEELS` is Heavy, Tight, Numb, Restless, Hollow, Hot, plus Not sure (`engine/data/onboarding.js:49`, `obChips` `ui/onboard.js:147`). Two of the document's seven words overlap (heavy, numb). And the owner ruled against a word list for the signal test (SIG5) | CONFLICT |
| Pick a body place | `OB_PLACES`, seven places one per seat (`engine/data/onboarding.js:57`). The document's "shoulders" has no seat in this model and "elsewhere" is not offered (Not sure is). Stomach is seated at Solar here and at Sacral by the engine's own `SOMA_PLACE` (`CONGRUENCY-AUDIT.md` D5, still open) | PARTIAL |
| The Field responds immediately | The sheet is a card over the app; the Field does not move on a tap (`CONGRUENCY-AUDIT.md` 2.10). The mockup's canvas Field was deliberately not ported (`ui/onboard.js:10-16`) | MISSING |
| AHA, "there it is", the area lights | Nothing | MISSING |
| `SignalObservation` stored, `source: user_report`, intensity | The two taps are stored as positions on the story entry (`ob.feel`, `ob.place`, `engine/schema.js:798-804`), **only if a story is committed**: "I would rather not say" leaves the sheet with nothing written (`ui/onboard.js:581`). No intensity is asked. No id of its own | PARTIAL |
| Keep user reported apart from system inferred, and never fabricate objectively measured | The taps "are kept as exactly that, a tap, never dressed up as something the engine found" (`ui/onboard.js:40-44`); imprints carry `stated`/`inferred`; evidence carries `source:'user'`; the glossary states what the instrument does not measure | EXISTS |

**One word, now three meanings.** "Signal test" already names (a) the
owner's yes and no exercise, unbuilt in the app; (b) a practice row,
`{k:'sig', nm:'The Signal Test', d:'Proof that a word with no quality of its
own moves your body', how:'Built into the app ...'}`
(`engine/data/practice.js:37`), which promises an exercise the app no longer
contains; and (c) the Account button "Run the signal test again"
(`ui/account.js:164`), which opens the onboarding, which no longer contains
it, under a comment that says "nothing it does writes to the nine axes" when
the onboarding now commits a real entry (`ui/onboard.js:23-30` says so). The
document would add (d). This is the one word per concept rule, failing in
shipped copy today, independent of this document.

**Precision first, said plainly.** A list of six feeling words read as a
signal is a forced choice, and a forced choice always returns an answer. The
record cannot tell a person who felt "tense" from one who tapped the nearest
word to get to the next screen. That is the owner's SIG5 in measurement
terms, and it is why the before and after pair below uses the person's own
number on a signal they named, not a category the product chose.

### 3.2 Baseline and re-test (sections 7, 8, 16, beats 05, 12)

| Requirement | Real | Grade |
|---|---|---|
| A user reported intensity for one named signal, **before** a release | Nothing asks one. Searched `ui/release.js`, `ui/onboard.js`, `ui/storyui.js` and the engine for an intensity, a "how strong", a 0 to 10 before the run: none | MISSING |
| The **same** signal asked **after** | "What changed?" is after only, five closed words, no number, no reference to a before (`releaseVerify`). The value felt question on `storyboard-faq-nav` (`engine/valuefelt.js`) is also after only, and asks about the session, not the signal | MISSING |
| Before and after shown together | Partly, for numbers the engine owns: the finished release card prints "Expression up X, now Y" off `RUN.ex0` taken before the run (`ui/release.js:907`, `:1697`); Analytics prints "CQ up X since last session" and only across rows of the same `CQ_MODEL` (`ui/analytics.js:159`); `ui/record.js` compares any two snapshots. Never a signal pair | PARTIAL |
| The baseline is immutable | **The mechanism already exists.** Practice evidence has no edit action: the action table offers `evidence_record` and nothing that rewrites one (`PR_ARGS`, `engine/practice.js:882-900`), and the log is append only (`:560`). Evidence already carries `before`, `after` and `later` fields (`:291`), validated, unused by any writer | PARTIAL (store EXISTS, writer MISSING) |
| Persist signal before, after, reason for change (section 16) | `before`/`after` slots exist; no reason field; nothing writes them | MISSING |
| Never force a positive result | `RV_ANSWERS` keeps Nothing changed and Not sure as answers; a skip writes nothing; a verification never becomes a graph edge (`engine/practice.js:147-181`) | EXISTS |
| Baseline CQ at first use, before the story (beat 05) | **Not computable.** CQ is the 21 laws answered and nothing else; a person who has answered none is `unread` and CQ reads 0 with no tier (`compute.js:428-440`, measured: blank profile CQ 0.00, `complete` false, `unread` true, tier null). The onboarding asks no law. The funnel quiz asks up to a hundred questions and is readable from 21 (`funnel/quiz.html:383-402`), so a first CQ exists only after the quiz or the intake | CONFLICT |
| CQ before and after one release is worth showing (section 8 example: 62 to 66, gap 38 to 34) | **Measured**: one address, four lines, at CQ 62: 62.0000 to 62.0111, printed 62 to 62. The onboarding's own three address mini release: 62.0000 to 62.0333, printed 62 to 62. Six addresses, 24 lines, at 50: +0.087. The engine gate already holds this as the owner's sentence, "you may not see CQ move, but it may move 0.1 or 0.05" (`tests/engine.js`, the fifteen thousand pattern walk). The document's example is about 360 times one address's real move | CONFLICT |

**The one genuinely additive thing in the document is here, and it is the
cheapest item in this audit.** One question before the run ("How strong is it
right now, 0 to 10?") about the signal the person already named on the Feel
and Body steps or in the mirror, and the same question after, written as one
evidence record with `before` and `after`, through `practiceDo`, beside the
`releaseVerify` record the same run already writes. No schema change: every
field exists. The pair is user reported and is labelled so; it is the only
before and after in this product that can move inside one session, because
CQ cannot (measured above) and expression is the engine's arithmetic, not the
person's report.

**What would make it wrong, and can we detect it.** Three things.
(a) Demand: a person asked "how strong now?" right after a guided release
will lean lower; nothing in the product can separate that from change, so
the surface says "you said 7, now you say 4", never "it dropped 3".
(b) Anchoring: showing the before number while asking the after pulls the
answer to it; ask the after blind, then show both. (c) A different signal:
the after must name the same feeling and place the before named, read off the
before record, or the pair compares two things. All three are checkable by
the gate on the record, and none needs a labelled set, because the claim made
is only what the person said, twice.

### 3.3 The CQ direction bands (section 5, the index's core model)

The document proposes 0 to 39 Descending, 40 to 60 Oscillating, 61 to 100
Ascending, and says itself that these "must not be represented as existing
implementation until audited". **Confirmed: they are not implemented
anywhere.** Searched `atuned_src`, `funnel` and the engine for descending,
ascending, contracting and expanding as a reading of CQ: none.

**Refuted: the implicit premise that CQ has no words yet.** It has ten, ruled
by the owner, shipped, each with five fields, and one of them is already
called Oscillating.

`TIERDEF`, `engine/data/canon.js:740-800`, "Ten bands of ten each, so the word
moves at every tenth point" (the owner's ruling, `:656-664`): Mastery 91,
Embodied 81, Compounding 71, Gaining 61, Even 51, **Oscillating 41**,
Incoherent 31, Corrupt 21, Severe 11, Collapsed 0. Each carries `state`,
`soma`, `def`, `energy` and `toward`, and its own colour (`TIERCOL`). The
word is printed beside the number on the Field rail with its meaning in plain
words (`ui/ui.js:1061-1070`), on the quiz result (`funnel/quiz.html:432`) and
in Summary. `tierOf` reads the printed, rounded number so a word never
disagrees with the figure beside it (`canon.js:802-825`). The median range,
40 to 60, is a separate named constant (`MEDIAN_LO`, `MEDIAN_HI`,
`canon.js:803`), drawn as the waist of the Compass cone (`ui/cone.js:437`).

| Requirement | Real | Grade |
|---|---|---|
| Three direction bands on CQ | Ten tiers, ruled. **Measured**: "Oscillating" means different things in the two tables at 11 of the 101 printed values (40, and 51 to 60). At 55 a person would read Even on the rail and Oscillating on the new screen | CONFLICT |
| The document's own example, CQ 62 "OSCILLATING" (sections 7, beat 05) | By the document's own bands 62 is Ascending. The document contradicts itself. The shipped tier at 62 is Gaining, state Tuned | CONFLICT (internal) |
| "Direction" as a reading | Direction already exists in the product as a claim about **two points in time**, never about one level: `seriesRead` returns `dir` up, down or level and returns null with one reading, "direction is only a claim when there are two ends to compare" (`engine/ladder.js:310-311`), drawn on the Compass's "Coherence over time" (`ui/cone.js:2694-2735`). The document derives "you're expanding" from a single level, so a person at 62 who has fallen for a month would be told they are expanding | CONFLICT |
| Human language per band | Shipped per tier (`soma`, `def`, `energy`, `toward`) and marked "a draft for the owner to rule on", tier names his call (`canon.js:650-654`) | EXISTS under other words |
| Do not introduce a second numeric coherence scale (rule 7) | One CQ, 0 to 100, one function (`cqSum`, `compute.js:168`) | EXISTS |
| Boundary handling | The document gives integers. CQ is not an integer; the shipped table rounds before banding because 35 of 625 runs once printed a number outside the band beside it (`canon.js:805-812`). Any new band would have to use `cqShown` or repeat that defect | MISSING |

The honest version, if the owner wants three words: they name the median
range and either side of it ("below the middle", "in the middle range",
"above it"), they are a level and say so, and the word "direction" stays on
`seriesRead`, which already earns it.

### 3.4 Gap = 100 minus CQ (section 6, beat 05, FAQ)

| Requirement | Real | Grade |
|---|---|---|
| A user facing "gap" off CQ | **Removed on purpose.** `engine/compute.js:535-557`: "THIS WAS cqCeiling. CQ is the laws and nothing else, and the part of it a release moves is too slow for one run to show, so the ceiling is read on expression." The gap that ships is expression headroom, `exHeadroom`, printed on the release card ("Release has about 1.2 points left to give you", `ui/release.js:1697-1708`) and in Summary (`ui/summary.js:968-973`, "a CQ headroom read almost 0 for everybody") | CONFLICT |
| "Here's what is creating the gap": pattern gaps, body or address load, story, action (section 6) | Under the owner's 25 September ruling none of those enters CQ. CQ is the 21 laws over 210 (`cqSum`); load acts on expression through `leverPull`, never on CQ (`TUNED-AWARENESS-AUDIT.md` 2.4, measured: CQ identical at 70.000 while resistance tripled). So 100 minus CQ is made only of laws not yet at 10. Telling a person their body load is creating it is false of this engine | CONFLICT |
| The word "gap" | Already taken twice: the Avatar's gap, "the distance between who somebody is and who they are becoming ... a number at an address" (`avatarGap`, `engine/avatar.js:34-42`), on the product's centrepiece; and the release headroom above. A third meaning breaks one word per concept | CONFLICT |
| Not unread | **Measured**: a blank profile would read gap 100.0. A partial CQ (some laws answered) is not a reading (`compute.js:428-434`) and a gap off it would be a number about unanswered questions | MISSING (no guard, because no gap) |

### 3.5 Ritual detected, and the anonymous claim (sections 10, 11, beats 14 to 16)

| Requirement | Real | Grade |
|---|---|---|
| A ritual suggested off the work done | `ritFor(r)` names the practice the heaviest seat calls for at the person's load tier (`ui/ritual.js:109-140`); on `flow3-qn`, `ritSuggest` lists three sources, the field, the Avatar's stories and the bank, deduplicated (`ui/ritstage.js:41-120`, unmerged) | PARTIAL |
| Offered after the release, before any account | The finished release card offers "Build a ritual" (`ui/release.js:1714`), which opens the builder seeded with the run's log (`:1834`, `ritOpen(lg)`). The person builds it; nothing is "detected" and the onboarding's bridge offers none | PARTIAL |
| Detection decided in the engine, not the frontend (index, critical rule) | `ritFor` and `ritSuggest` are host files under `ui/`. The rule that picks a ritual is the frontend's | CONFLICT |
| Ritual as a real persisted domain object with provenance | Three stores (`CONGRUENCY-AUDIT.md` D11, still true): `p.rituals` entries carry `t`, `steps`, `min`, `when`, `where`, `done`, `track`, `band` and no link to a story, a signal or a release (`ritEntryOf`, `ui/ritual.js:359`); the active plan sits off the record under `atuned-ritual-active` (`:209`) carrying the place only; `p.practice.rituals` is validated and has no writer | PARTIAL |
| Value before an account (rule 10) | The door offers continuing without an account, and everything runs on the device (`ui/login.js:278-300`) | EXISTS |
| Do not make the person re-tell the story (rule 12) | On one device, true by construction: signing in moves nothing, "It does not sync. Every story, reading and imprint stays in this browser exactly as before" (`ui/auth.js:13-16`). On a second device, the story is not there at all | PARTIAL |
| A temporary anonymous session, claimed atomically into the account (`POST /session/claim`) | No server holds first use work, so there is nothing to claim. `auth.js` carries sign up, sign in, reset, sign out and the plan, and nothing else | MISSING |
| Frontend to backend contract carrying raw input, evidence, release, ritual (section 12); backend computes `FirstUseResult` (section 13) | The engine is on the device by design and the app has one network seam (`CLAUDE.md`, `ui/auth.js:6-11`). A backend that computes the reading and hands it to the frontend reverses that architecture | CONFLICT |
| Order: account last | Today the door comes first: `loginEnter` runs after sign in or "continue without", and only then opens the onboarding (`ui/login.js:278-295`) | CONFLICT, soft: the door does not require an account |

**Privacy, checked first rather than last.** The earlier ruling that "the
record and the story are never held joined" is **superseded** in
`DECISIONS.md` ("Sight, tiers and the private record"): "the story is stored,
for recovery, never shared, and used only for modelling". So a claim that
moves first use work to an account is permitted in principle. The conditions
the team attached are not met by anything built: consent asked rather than a
policy assumed, encryption at rest, de-identification before anything touches
a model, and the one seam staying one seam. The billing rule also stands:
"The store writes five fields and nothing else". A claim endpoint is
therefore a record store build with a consent screen in front of it, not an
onboarding step, and it is the owner's to schedule.

### 3.6 Algorithm versioning (section 14)

The document asks for ten named versions. Five exist under the product's own
names, one partially, and four name algorithms that do not exist, which is a
version with nothing to version.

| Document name | Real | Grade |
|---|---|---|
| `COHERENCE_ALGORITHM_VERSION` | `CQ_MODEL` 2 (`compute.js:84`), stamped on every history row as `m` (`snapshot`, `schema.js:287`), on every daily summary day (`daily.js:1098`), and compared before Analytics says "CQ up since last session" (`ui/analytics.js:159`) | EXISTS |
| `TRACE_ALGORITHM_VERSION` | `TRACE_ALG` 1 and `TRACE_V` 1 (`trace.js:60-64`), stamped on daily days as `alg` | EXISTS |
| `SNIFFER_ALGORITHM_VERSION` | `LEX_VERSION`, a hash of every table the scanner reads (`sniff.js:990-996`), stamped on every story entry as `lex`. Its own comment: a change to `scanStory`'s or `parseStory`'s rules with no table change does not move it | PARTIAL |
| Schema versions (section 12) | `SCHEMA_V` 2, `PRACTICE_SCHEMA_V` 1, `DLY_SCHEMA_V` 1; practice objects carry `algorithm_version` and `contract_version` fields (`practice.js:220`) | EXISTS. `releaseVerify` writes them as null |
| Build ID | `data-build` on the root element, a commit count, short hash and time (`atuned_src/BUILD.sh:48-74`) | EXISTS for `source.html`; `CONGRUENCY-AUDIT.md` 2.14 found five surfaces with none, not re-measured |
| `RELEASE_ALGORITHM_VERSION` | `relWrite`'s coefficients (0.21, 2, 0.62) and `LIFT_R` carry no version (`compute.js:150`, `:208-215`) | MISSING |
| `PATTERN_ALGORITHM_VERSION` | `onbMiniPlan`, `stRelModel`, `loopRead().next`: four selection rules (`CONGRUENCY-AUDIT.md` D7), none versioned | MISSING |
| `RITUAL_DETECTION_VERSION` | `ritFor` and `ritSuggest`, unversioned host code | MISSING |
| `SIGNAL_INTERPRETATION_VERSION`, `GAP_ALGORITHM_VERSION`, `MEMORY_ALGORITHM_VERSION`, `DECISION_ALGORITHM_VERSION` | No such algorithm exists. The taps are deliberately never interpreted; no gap; no memory; no decision engine | MISSING, and not to be created ahead of the thing it versions |

Two corrections to earlier audits, measured here. History rows are stamped
(`m`), contrary to `CONGRUENCY-AUDIT.md` 2.7 and 5.3 test 5. But `seriesRead`,
which draws "Coherence over time" and its up or down word, does not check
`m` (`engine/ladder.js:286-312`), so a row from before 25 September compared
with one after reads as the person moving. Small, real, and the exact case
the stamp exists to prevent.

### 3.7 Model accuracy, variance, and why (round QR addendum)

Added after the first push, at the owner's request in the same round. His
words: "I want you to show model accuracy. Plus the variance. And then the
tooltip, I want the Y behind the variance. To see if it's a user input thing
or if it's a code thing."

**The question this number would answer, in one sentence:** how far should
a person trust this one reading of their story, and is the doubt in what
they gave the instrument or in the instrument itself.

**What exists today, per reading and per profile:**

| Piece | Where | What it shows | Who sees it |
|---|---|---|---|
| Named or guessed, per address | `parseStory` imprint `stated`/`inferred` (`sniff.js:636-658`); the onboarding mirror tags each row "you named shame" or "a guess", and says why: "It did not name a feeling, so what follows is a guess" (`ui/onboard.js:332-369`) | A two valued confidence with its cause in words | Onboarding only; the Story tab, tutorial and Avatar doors do not show it (`CONGRUENCY-AUDIT.md` D3) |
| Evidence of return, per seat | `srcRung` 0 to 10 (`sourceai.js:111`), drawn as ten pips beside "Next question" (`srcPips`, `ui/storyui.js:818`, `:879`) and on the Story chart's lanes (`:1252`) | How often the text comes back to a seat: a count, not a confidence | Story tab, unlabelled pips (`aria-hidden`) |
| Saboteur confidence, with its citation | `sniffStory` ranked rows, `confidence` plus `because` on every row (`sniff.js:1142-1191`) | A real 0 to 1 number with the words that produced it | Called only from `ui/tutorial.js:219`, which is off by default (`DEV_PLAY_TUTORIAL=false`) |
| "Accuracy", per profile | `accuracy(r)` (`compute.js:577-600`): a fitted figure plus a `band`, the interval, built from named causes. Drawn as the Accuracy ring on the Field (`ui/personas.js:428-440`); its drill lists what widens it: laws not answered, little signal, no expression, "pairs of patterns too alike to tell apart" (`runAccDrill`) | How closely the field matches a named family. **Not the sniffer's accuracy**, and a fit (5.68 mean absolute error, `compute.js:562-565`), not a measurement against truth | Field, Summary, Analytics. The interval is computed and not shown |

**The variance was shown once, and he struck it.** The Accuracy ring printed
"of 100, plus or minus 12" and Analytics printed "58% plus or minus 11". His
words, recorded in `COPY-OBJECTIONS.md:55`: "100 plus minus 12, swing 11.
That shit has to all go." Ruled again 26 September (CH): "we just want the
word accuracy, we don't need anything else after that." Both came off
(`ui/personas.js:388-400`, `ui/analytics.js:160-170`), and the voice gate now
**fails any figure with a tolerance on it** (`.claude/skills/atuned-voice/
SKILL.md:34`, run by `check.py --objections`). His new request reverses that
ruling. It is his to reverse; it is not the team's to quietly route around,
and a build of it as worded fails a gate that encodes his own objection.

**And "model accuracy" for the sniffer is not learnable from this data.**
`DESIGN-sniffer.md:373`: "whether a reading is right. There is no ground truth
here and there is not going to be one." No labelled set exists, and the
privacy ruling keeps the person and the story apart for modelling, so no
outcome can ever be joined back to a reading to calibrate it. A figure labelled
accuracy on a reading would be arithmetic presented as a measurement, which is
the failure the `inferred` flag exists to prevent. What can be shown honestly
is **evidence strength**: how much of this reading the person's own words
carried, and a named reason for every part they did not.

**The cause categories already exist in the engine, unnamed as such.** Every
reason a reading is unsure is either in what was given, or in what the engine
does with it. Measured or cited, each one:

| Reason | Side | Detectable today by |
|---|---|---|
| Words hidden behind stars by dictation | the person's input, via their device | `maskedRuns` (on `sniffer-mask-fix`) |
| No feeling word, so the address is the fallback's choice | the person's input | `imprint.inferred` with no `stated` hit in its clause |
| Too little written: few words, one seat | the person's input | word count; `srcRung` 1 to 6, heard once |
| A feeling named, but no word names an address, so the four addresses on that axis are the engine's pick | the engine | `stated` true on an axis, address chosen by `parseStory`'s modal fetter rule (`DESIGN-sniffer.md` question 13: "I was furious" returns four addresses with the flag green) |
| Negation in the sentence, which the sniffer does not read | the engine | `srcNegated` true on a hit `parseStory` charged (`sniff.js:726`; `CONGRUENCY-AUDIT.md` D4) |
| The place word seated differently by two tables | the engine | `OB_PLACES` against `SOMA_PLACE` (D5) |
| Read under an older lexicon | the engine | `entry.lex` not equal to `LEX_VERSION`; `restated` in the graph |
| Patterns too alike to tell apart | the engine | `accuracy().deg` |

So the masked dictation bug is the first worked case of the user input side,
and the categorisation the tooltip needs should be one engine function that
returns these reasons, each tagged input or engine, and the mask line under
the Journal box should become one of its rows rather than a second mechanism.

| Requirement | Real | Grade |
|---|---|---|
| A model accuracy figure for a sniffer reading | Nothing per reading. The profile's Accuracy ring is family identification, not the sniffer, and is a fit. A measured sniffer accuracy cannot exist on this data | MISSING |
| The variance beside it | Computed (`accuracy().band`) and removed from every screen on his own ruling, which a gate now enforces | CONFLICT |
| A tooltip saying why, input or code | Causes are named in words in two places, the mirror's "a guess" per row and the accuracy drill's list, and neither sorts them into the person's side and the engine's side | PARTIAL |

---

## Step 4. Every new requirement, graded

Only what this document adds. The chain in Step 2 is not counted.

| # | Requirement | Grade | Evidence |
|---|---|---|---|
| N1 | Signal test as a pre-story beat | CONFLICT | Owner ruling SIG1 to SIG6, JY, KD, KE; cut from onboarding (`onboard.js:33`) |
| N2 | Feeling picked from an ordinary word list | CONFLICT | SIG5; `OB_FEELS` differs (2 of 7 overlap) |
| N3 | Body place picked from a list | PARTIAL | `OB_PLACES`; no shoulders seat; D5 stomach |
| N4 | Field responds immediately to the signal | MISSING | sheet over app; canvas not ported |
| N5 | AHA beat | MISSING | nothing |
| N6 | Signal observation stored as user report with intensity | PARTIAL | `ob.feel`, `ob.place` only with a committed story; no intensity |
| N7 | User reported, inferred, measured kept apart | EXISTS | `stated`/`inferred`; `source:'user'`; glossary |
| N8 | "Signal test" one meaning | CONFLICT | three meanings shipped (`practice.js:37`, `account.js:164`) |
| N9 | Pre-release intensity for one named signal | MISSING | searched |
| N10 | Re-test of the same signal after | MISSING | `RV_ANSWERS` has no number, no before |
| N11 | Before and after shown together | PARTIAL | expression on the card, CQ in Analytics, never a signal |
| N12 | Baseline immutable | PARTIAL | evidence write-once and `before`/`after` exist, unused |
| N13 | Signal before, after, reason for change | MISSING | no reason field |
| N14 | Never force a positive result | EXISTS | `RV_ANSWERS`, skip writes nothing |
| N15 | Baseline CQ before the story at first use | CONFLICT | CQ unread until 21 laws; onboarding asks none |
| N16 | CQ before and after one release as the proof | CONFLICT | measured +0.011 at one address |
| N17 | Three direction bands | CONFLICT | ten ruled tiers, Oscillating 41 to 50 |
| N18 | The bands' own example | CONFLICT | 62 is Ascending by its own table |
| N19 | Direction read from one level | CONFLICT | `seriesRead` direction needs two points |
| N20 | Human words per band | EXISTS | `TIERDEF` fields, draft for his ruling |
| N21 | One coherence scale | EXISTS | `cqSum` |
| N22 | Band boundary rule | MISSING | integers given; `cqShown` needed |
| N23 | Gap = 100 minus CQ | CONFLICT | `cqCeiling` replaced by `exHeadroom` on purpose |
| N24 | Gap contributors include body load and patterns | CONFLICT | load does not enter CQ |
| N25 | "Gap" one meaning | CONFLICT | Avatar gap, release headroom |
| N26 | Reading revealed progressively in first use (laws, addresses, saboteurs, order) | MISSING | onboarding mirror is seats and addresses only; no laws exist yet to show |
| N27 | First release is one address | CONFLICT | `ONB_MINI_ADDRS` 3, ruled round PA, "The mini release is 12 lines" |
| N28 | Pause, no automatic advance after release | EXISTS | `COOLING`; the card waits for Done (`release.js:1650-1716`) |
| N29 | No countdown | CONFLICT | ruled 27 September, "there should be a two minute countdown", `REL_SETTLE_S` and its dial (`release.js:670-705`) |
| N30 | Ritual suggested off the work | PARTIAL | `ritFor`; `ritSuggest` on `flow3-qn` |
| N31 | Ritual offered after release, before account | PARTIAL | "Build a ritual", person built |
| N32 | Detection in the engine | CONFLICT | host files under `ui/` |
| N33 | Ritual persisted with provenance | PARTIAL | three stores, no links |
| N34 | Value before account | EXISTS | continue without one; local first |
| N35 | No re-telling the story | PARTIAL | true on one device, by construction |
| N36 | Anonymous session claimed atomically | MISSING | `auth.js` does not sync |
| N37 | Backend computes the first use result | CONFLICT | on device engine, one seam |
| N38 | Account last in the order | CONFLICT | door first, not required |
| N39 | Coherence version | EXISTS | `CQ_MODEL` on rows |
| N40 | Trace version | EXISTS | `TRACE_ALG`, `TRACE_V` |
| N41 | Sniffer version | PARTIAL | `LEX_VERSION`, tables only |
| N42 | Release, pattern, ritual detection versions | MISSING | none |
| N43 | Signal, gap, memory, decision versions | MISSING | nothing to version |
| N44 | Do not overwrite readings after an algorithm change | PARTIAL | rows stamped; `seriesRead` ignores the stamp |
| N45 | One authoritative CQ, never in the frontend | EXISTS | `cqSum`; the quiz inlines the same `engine.js` |
| N46 | Model accuracy shown for a sniffer reading (addendum) | MISSING | 3.7; not measurable on this data, evidence strength is |
| N47 | The variance shown beside it (addendum) | CONFLICT | 3.7; his own "100 plus minus 12 ... has to all go", enforced by the voice gate |
| N48 | A tooltip naming the cause, input or code (addendum) | PARTIAL | 3.7; causes named in words, never sorted by side |

**Tally, counted off the table above, row by row: 9 EXISTS, 11 PARTIAL, 11
MISSING, 17 CONFLICT, 0 UNVERIFIED.** Forty eight rows, forty eight grades.
Rows N1 to N45 are the two documents; N46 to N48 are the owner's addendum in
the same round.

Seventeen conflicts is high, and the reason matters more than the count:
eleven of the seventeen (N1, N2, N15, N16, N17, N23, N24, N27, N29, N37, N47)
are a request against a ruling the owner has already made: SIG, CQ is the 21
laws and nothing else, the ten tiers, the mini release size, the two minute
countdown, the on device engine with one seam, and no tolerance figure on a
reading. Of the other six, one is the document against itself (N18), one is
the document against its own rule (N32), and four are the product against
itself or a word already taken (N8, N19, N25, N38). The same failure both earlier audits found
holds here: a document written from an earlier picture of the product
becomes a requirement against the product's own later rulings.

---

## Step 5. What this audit did not verify

- The real browser speech service was not run. Step 6 is reproduced with a
  stand-in recognizer, which proves what this code does with a transcript and
  cannot prove which vendor masked his.
- The account seam, a signed in reload and a second device: no outbound
  access to the record store from here, same as both earlier audits.
- The four unmerged branches were read, not run.
- `CONGRUENCY-AUDIT.md`'s Chromium journey was not repeated.

---

## Step 6. Found in passing: the masked dictation defect, and what it does to the sniffer

His Journal screenshot, round QR: "I used to just ******* hate", "I was really
****** ***". Traced, and **not this codebase's own bug.**

- Nothing in `atuned_src` masks a word. Searched for profanity, censor,
  swear, and any replacement producing stars.
- The Journal's Record button uses the browser's Web Speech API
  (`stMic`, `ui/storyui.js:1903-1941`), which is a vendor network service.
  Chrome's filters profanity by default and gives the page no way to turn it
  off; Gboard voice typing does the same by default ("Block offensive words");
  formats differ, first letter kept or not.
- **Reproduced in real Chromium** against the committed build, with the
  recognizer replaced by a stand-in that hands the page a fixed transcript:
  a starred transcript lands in the box byte for byte, and so does an
  uncensored one ("fucking", "pissed off"). This code passes both through
  unchanged. With stars, the status line said only "Recording. Press again to
  stop." Nothing told the person.

**What the stars do to the reading, measured.** `normMap` turns every non
letter into a space before the scan (`sniff.js:285-312`), so a hidden word is
not a gap the sniffer knows about, it is nothing: "I was really ****** ***"
reaches the scanner as "i was really". And "I was really ****** furious"
reaches it as "really furious", which puts the degree word "really" (1.4)
against a word the person did not put it against: solar 33.6, against 24.0
with the word typed in. A mask can raise a reading, not only lose one.

Also in passing: neither sentence would have been read even uncensored.
"hate" and "pissed" are not in the lexicon (`LEX` 281 entries; "angry" and
"furious" are). That is a lexicon recall gap for the sniffer seat, recorded
here rather than fixed, because a lexicon change moves `LEX_VERSION` and is
its own reviewed change.

The fix is on branch `sniffer-mask-fix` (`4f4bd32`), not merged. Detection
and honest handling only, because a vendor's redaction cannot be reversed
from the page: `maskedRuns` and `maskedSay`, host free in `engine/sniff.js`;
a line under the Journal box and the onboarding's story box while stars
remain; one status line when a recording brings new stars in; and a commit
with stars still in it says they could not be read. `tests/engine.js` holds
the runs, the sentence and the degree word measurement above.

---

## Step 7. First steps, ordered, cheapest and highest value first

1. **Signal before and after, on the evidence that already exists.** One
   question before the run and the same one after, about the signal the
   person named, written as one `evidence_record` with `before` and `after`
   through `practiceDo`, beside the `releaseVerify` record the same run
   already writes, and shown as "you said 7, now you say 4". No schema
   change, no new store, write-once by construction. The after asked blind,
   then both shown. Gate: write, reload, read the pair back; refuse an after
   with no before by name. This is the document's one real idea and its proof
   of value, and it is about 150 lines across `engine/journey.js`,
   `ui/release.js` and `tests/engine.js`. It touches `ui/release.js`, which
   `release-carousel` owns, so it lands after that merge.
2. **Why a reading is unsure, sorted by side (the addendum, N46 to N48).**
   One host free engine read, beside `parseStory`, that takes the text and
   its parse and returns every reason in the 3.7 table that applies, each
   tagged the person's input or the engine, with the words it came from:
   hidden words (`maskedRuns`, already built on `sniffer-mask-fix`, becomes
   its first row), no feeling named, too little written, a named feeling with
   a guessed address, unread negation, the stomach seat disagreement, an older
   lexicon. Beside each reading, the evidence strength said as two counts a
   person can check ("named by your words: 1, guessed: 12") and a tooltip
   listing the reasons under two headings, "in what you wrote" and "in how
   the instrument reads it". The masking line under the Journal box becomes
   that read's first user input row, so there is one mechanism and not two.
   No number labelled accuracy and no tolerance until he rules (below): the
   reasons ship either way, because they are the "why" he asked for and they
   pass every gate. About 120 engine lines, 80 renderer lines, an engine gate
   group with a null case (a story fully named reads no reasons) and an
   adversarial one (stars plus negation reads one row on each side).
3. **Rule the three words, not build them.** One owner decision, asked with
   the picture: keep the ten tiers and drop the three bands; or let three
   words name the median range and either side (40 to 60 already exists as
   `MEDIAN_LO`, `MEDIAN_HI`) under a word other than Oscillating; and keep
   "direction" for `seriesRead`'s up, down or level over time. Same decision
   for "gap": expression headroom stays the gap a release can close, or 100
   minus CQ is shown as "laws still open", with no claim that body load makes
   it. Nothing should be written into the FAQ or About page before this.
4. **Fix the one word that is already wrong in shipped copy.** "Run the
   signal test again" (`ui/account.js:164`) opens an onboarding with no
   signal test, under a comment that says it writes nothing, and the practice
   row `sig` promises an exercise "built into the app" that is not. Rename
   the button to what it opens, correct the comment, and mark the practice
   row as not yet built. Copy only, through the voice gate; an hour.
5. **Fix `seriesRead` to respect `m`.** Compare only rows of the same
   `CQ_MODEL`, and say where the comparable run begins, the way `lawSeries`
   already does. Twenty lines and a gate group.
6. **Build the owner's signal test, not the document's.** SIG1 to SIG6 and
   the KD script, at the throat, yes ten times then no ten times, no word
   list, capturing at most a timestamp and the person's own word (SIG18 is
   still his open question: does it produce a number at all). The prototype
   exists (`proto/signal/signal.html`). This replaces the document's N1 to N6
   rather than adding to them.
7. **Ritual provenance, inside the cutover already named.** When the ritual
   cutover to `p.practice.rituals` runs (`CONGRUENCY-AUDIT.md` D11), the
   ritual carries the release keys and the entry's `t` it came from, and the
   detection rule moves into the engine with a version. Not before the
   cutover, or it becomes a fourth store.
8. **Blocked, and his.** The anonymous claim and any server copy of first use
   work: a record store build behind consent, encryption at rest and
   de-identification, per the superseding privacy ruling. The order of the
   door against the onboarding. Whether the first release is one address
   (this document) or three (his round PA). Whether the two minute countdown
   stays (his 27 September ruling) against this document's "no countdown". And whether a figure labelled accuracy, with a
   tolerance beside it, comes back on a reading: it reverses his own "100 plus
   minus 12, swing 11. That shit has to all go", which the voice gate fails
   today, and a measured sniffer accuracy cannot exist on this data, so the
   honest figure is evidence strength (step 2), not accuracy.

---

## Measured for this audit

- `node tests/engine.js` at `eacc3b0`: 4,436 passed, 0 failed.
- `releaseWork` on fresh records: one address, four lines, at CQ 62 moved
  CQ 0.0111; three addresses, twelve lines, 0.0333; six addresses, 24 lines,
  at 50, 0.0872. Printed CQ unchanged in all three.
- `tierOf` against the proposed bands over every printed CQ 0 to 100: the
  word Oscillating disagrees at 11 values (40, 51 to 60). At 62: shipped
  Gaining, proposed Ascending, the document's example Oscillating.
- Blank profile: CQ 0.00, complete false, unread true, tier null.
- `parseStory`: "I was really ****** furious" solar 33.6; "I was really
  fucking furious" 24.0; his two sentences, starred or not, 0 hits.
- Chromium, committed build, stand-in recognizer: starred and uncensored
  transcripts both land in the Journal box unchanged; no warning shown.
