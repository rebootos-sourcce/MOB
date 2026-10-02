# PASS 1, AI director (Tomas Egilsson). Areas 1, 3, 4

Stamp: repo at c4a829f. Every probe below was run in node against the built
`engine.js` on 2 October. Nothing in the repo was edited.

Privacy ruling, checked first: nothing proposed here needs the name or the record
to leave the device. Two conditions bind it. The ledger is derived from the record
and not a new joined store. The safety result is never saved on the record, because
a stored "crisis" bit is health data and is the open question BN1 Q1 in TASKS.md
(is a practitioner ever told).

GRADE: 54/100 ready to build as proposed.

The direction is right. Most of the contract already exists in three places. The
safety gate exists nowhere. "Verified" cannot be defined without a sensor.

| Criterion | /10 | Evidence |
|---|---|---|
| Fits what exists | 5 | `trace.js`, `daily.js` and `practice.js` already hold provenance, evidence and grounding |
| Explainability kept | 8 | Every hit carries offset, seat and an `inferred` flag; trace edges carry `why` |
| Evaluable with no labelled set | 4 | Agreement and invariance tests work; safety recall needs a hand set |
| Honest about what is learnable | 4 | "Verified" and "pattern weakened" overclaim from self report |
| Safety gate, as proposed | 5 | Right idea, seven classes is too many; today nothing screens text |
| Privacy | 7 | Fine if derived, never stored joined |
| Host free purity | 9 | All of it can be pure functions of text and record |
| MVP size realism | 5 | The orchestrator is a heavy name for a small fix |

## What is already there

- `engine/sourceai.js` (366 lines): `srcHear` counts returns of a seat, `srcRung`
  gives 0 to 10, `srcDims` finds which of nine dimensions an entry answers,
  `srcNext` picks the smallest useful question by a stated order. It never names
  a definition. This is the "next best action" half, built, for questions only.
- `engine/trace.js:60-262`: the graph. Provenance on every node and edge is one of
  known, inferred, proposed, user_confirmed, observed (`TRACE_SRC`).
  `TRACE_PROMOTE` (line 211) says an inference may only become confirmed or
  observed, never "known". Causes may only be proposed or the person's own
  (`TRACE_CAUSE_SRC`). That IS "an agent cannot turn an inference into a fact".
- `engine/daily.js:1012-1065` (`dlyGroundOne`): a statement may be no stronger than
  the weakest thing it cites, may not state a cause unless proposed, must show
  uncertainty at one record. A second copy of the same rule.
- `engine/practice.js:225-252`: Evidence (source, type, before, after, later) and
  Outcome objects. `practiceStage` (line 940) defines "verified".
- `parseStory` (`sniff.js:572`): the `inferred` flag, with the comment that a
  fallback address is "arithmetic presented as a finding about somebody's
  character".
- `lexicon.js:331`: an entry may never assert a saboteur, a diagnosis or a person.

No `hypothesis` object exists anywhere in `engine/`. That is the one genuinely new
type.

## Where modules give different answers today (run, not read)

| Text | parseStory (feeds the field) | srcHear (what Source AI asks about) |
|---|---|---|
| "I was not angry at him" | Anger 6.0 lands | hears nothing |
| "I am not afraid of dying" | afraid 16 at root, dying 26 at heart | not run, same parse |
| "I was never ashamed of it, I am not scared" | four imprints | hears nothing |
| "I always freeze when someone challenges me" (his own example) | reads nothing | `srcDims` marks behaviour answered (`freeze` is in `SRC_DO`) |

- Four negation handlers: none in `parseStory`, `lawNegated` (3 words, counts
  "did"), `srcNegated` (2 words, not "did"), `leanNegated` (`verp.js:382`). The
  same sentence is negated or not depending on who asks.
- Frozen versus re-read. `srcPrior` reads the bands stored at commit
  (as shown). `trace.js:775` and `dlyReadOf` (`daily.js:572`) re-parse the text
  under today's lexicon. `daily.js:567` names the risk itself. Three answers to
  "what did Tuesday's entry say".
- "Verified" means three things: `practiceStage` says only a non-user source
  verifies; `practiceReleaseVerify` says a meter line; the proposal says a later
  self report. `DLY_RANK` collapses observed, known and user_confirmed to one rank.
- "Confidence" means three things: saboteur ramp value (not a probability, the
  spec's 94 and 73 were not reproducible), `evidence.confidence` 0 to 1 (no writer),
  and a key `daily.js` refuses by name.
- Two safety paths that never meet: `darkRead` (`data/compass.js:365`) fires a
  clinician referral from CQ and malignancy; nothing reads what was written.
- Not run, read only: `ui/summary.js:173` `sumWords` repaints by word regex while
  `marksOf` paints by offset.

So the competition is between duplicate code, not between autonomous agents. They
are pure functions with no runtime and no live model (the security review says the
Source prompt is never sent). A coordinator with its own state would be a fourth
model beside the real engine, the exact reason `trace.js` refused V3's graph.

## AREA 1, orchestrator and agent contract

- Exists: `srcNext`'s stated precedence, `dlyGround`, `TRACE_PROMOTE`.
- Adds: one shared reading and one arbiter for what the person is told.
- Conflicts: none with rulings. It cuts against `ARCHITECTURE-RESEARCH.md`
  ("cost of orchestration"); build a library, not a service.
- MVP cut, two pieces. (a) `readEntry(text, soulKey)`: parse once, negation inside
  it, stamped with `LEX_VERSION`; `srcHear`, trace, daily, avatar and summary
  consume it. (b) `sayNext(state)`: one ordered choice of safety, ask, listen,
  release, ritual, summary. A stated order, never a score, like `srcNext`.
- Later: hypothesis arbitration across entries.
- Size: M. Depends on nothing. Risk: touches every reader, so run `tools/equiv.py`.

The contract, as pure functions (`engine/reading.js` after `sniff.js` in MANIFEST):

```
Observation {id, agent, src, of:{type,id}, at, lex,
             claim:{seat, band, fetter|null, ord:'low|mid|high'}, negated}
Report      {agent, v, input:[entry ids], observations, uncertainty:[{gap,ask}],
             hypotheses:[proposal], recommendation:[{move, because:[obs ids]}]}
agentCeil = {sniffer:'inferred', sourceai:'inferred', trace:'inferred',
             summary:'inferred', meter:'observed', person:'user_confirmed'}
```

`obsValid(report)` refuses any observation whose `src` is above its agent's
ceiling. Promotion only through the existing `traceApply`. Two deliberate choices:
no numeric confidence (grounds are counts a person can check, as `srcRung` does),
and the agent field is mandatory so "why do you think that" has a named speaker.

## AREA 3, evidence and verification

- Exists: the graph is the ledger in shape. Evidence and Outcome objects exist.
- Adds: Hypothesis, frozen observations, an honest word for "verified".
- Conflicts: `p.rituals` against practice objects is already "two truths" until
  cutover (`practice.js` header). A fourth ledger would be a fifth.
- MVP cut: a ledger is a VIEW, `ledgerOf(record)`, derive don't store. The only
  stored additions are the person's confirmations, which fit `p.trace` stored edges.
  A hypothesis is a derived object: a `proposed` edge, plus its supporting and
  contradicting edges, status read from counts over distinct days and contexts
  (open, supported, weakened). No new record key, so no schema v2 question.
  Detector output is stamped with `lex`, not re-read.
- Rename "verified" to "repeated across contexts, by report". On a device with no
  sensor, only meter lines and practice timestamps are independent. Self report
  corroborates; it does not verify.
- "Pattern weakened" is not learnable from fewer words about it: people stop
  writing, wording drifts, lexicon changes. Compare same-`lex` entries only,
  per entries written, and say "less written about" not "healed".
- "Challenge triggers withdrawal" needs a relation the lexicon cannot extract.
  Only propose it when trigger and behaviour cues sit in one clause, quote the
  clause, mark `proposed`.
- Size: M for the view and Hypothesis, S for the rename. Depends on Area 1(a).

## AREA 4, safety gate and the sniffer

Measured live. No distress screen exists.

| Text | Result |
|---|---|
| "I feel suicidal", "I want to kill myself", "I want to end it all", "I have no reason to live", "I have been cutting myself again" | empty reading, nothing kept |
| "I wish I could disappear" | scored heart 26, a release offered (lexicon idiom `wanting to disappear`) |
| "I cannot keep going" | scored as exhaustion, solar 28, Apathy |
| "I have chest pain and my left arm is numb" | read as the feeling "numb" |
| "He hits me when he is drunk and I am scared to go home" | Fear only |
| "I was abused as a child" | nothing |

- Exists: `lexicon.js` and `daily.js` non-claims; BN1 (TASKS.md:10785) recorded the
  gap on 25 September, unbuilt.
- Adds: a stage before reading. `safetyScreen(text)` returns `{level, cues}`.
- MVP cut, four response levels, not seven content classes: none, care, crisis,
  route (medical, substance, abuse name the kind of outside help, no label). Ordinary
  and activated discomfort stay the sniffer's existing reading.
- Rules that follow from the cost of each error:
  1. Crisis inverts my usual rule. A miss costs more than a false alarm, so the
     screen leans to recall. That is only affordable if a false alarm is cheap:
     dismissible, never blocks, no score, not saved, no change to the reading.
  2. Negation is NOT honoured for crisis cues ("I am not suicidal" still routes
     to care). Opposite policy to the sniffer, set per consumer.
  3. Third person ("she wants to die") reaches care at most.
  4. Recognition only. No sentence names a condition. A body word stays a seat,
     and the fetter stays `null` unless a word named it (the `inferred` flag).
- Not mine to settle: the cue list and the response text need a clinician and a
  locale (BN1 Q1, open). The wheel (`FEELINGS-WHEEL.md`) is feeling vocabulary
  ("worthless", "despair"), not a risk list; do not use it as one.
- Size: S for the engine function, M with the gate and clinician review.
  Risk: the gate sees every entry, so run it once, never per keystroke into storage.

## Arithmetic dressed as intelligence

- The 0 to 10 reading per seat is a hand set word weight (12 to 28) divided by
  three. Nobody can defend 22 over 24. Show it as low, mid, high.
- `srcRung` 9 and 10 count an earlier entry if its band was above zero at all
  (`srcPrior`, `bands[k]>0`). One faint word in two old entries plus one mention
  today reads "root candidate". Recurrence is not a root; weight by amount.
- Saboteur "confidence" is a membership ramp, not a chance. Do not feed it to the
  ledger as a probability.
- `darkRead` decides a clinician referral from two derived numbers (SF6 open).
  Arithmetic must not be the only trigger for that.
- `ADJ2CHG` files "addicted" and "craving" under the charge `joy`. Verify.

## What honest evaluation takes

1. Agreement test: over the story bank every consumer must report the same seat
   set per entry. Today the rate is not zero. Target zero.
2. Invariance tests: adding "not" never raises a seat; a paraphrase set keeps seats.
3. A hand set for the gate, written by someone other than the lexicon author, frozen
   before tuning. The lexicon grew from failing test sentences, so the story bank is
   training data (leakage). With 60 positives and zero misses the miss rate is still
   only bounded below about 5 percent, so recall claims stay modest.
4. A false alarm audit on ordinary entries, counted by hand.

## RISKS

- Building a coordinator before one shared reading: it freezes today's duplicates.
- A new ledger beside trace: two truths again.
- "Verified" and "weakened" copy that claims what self report cannot show.
- Gate cue list written by engineers; a missed crisis is the worst failure here.
- A stored safety bit becoming health data and a practitioner field.

## RECOMMENDED ORDER

1. `safetyScreen` and a clinician-owned cue list (S, MVP, no dependencies).
2. `readEntry` with negation and `lex` stamp, consumers moved over (M, MVP).
3. Agreement and invariance gates (S, MVP, prove step 2).
4. `obsValid` and the ceiling table, merging three copies of the rule (S).
5. `ledgerOf` view and Hypothesis, rename verified (M, MVP cut only).
6. `sayNext` arbiter (S).
7. Later: hypothesis arbitration, relation extraction, any learned model, which
   needs the story-only, key-not-name training path the owner ruled.
