# PASS 1, AI director (Tomas Egilsson). Areas 1, 3, 4

Stamp: repo at c4a829f. Every probe was run in node against the built `engine.js`
on 2 October. Nothing in the repo was edited.

Privacy, checked first: nothing here needs the name or record to leave the device.
Two conditions bind it. The ledger is derived from the record, not a new joined
store. The safety result is never saved on the record, because a stored "crisis"
bit is health data and is the open question BN1 Q1 (TASKS.md:10854).

GRADE: 54/100. The direction is right. Most of the contract exists in three
places, the safety gate exists nowhere, and "verified" cannot be defined without a
sensor.

| Criterion | /10 | Evidence |
|---|---|---|
| Fits what exists | 5 | trace, daily, practice already hold provenance and grounding |
| Explainability kept | 8 | hits carry offset, seat, `inferred`; edges carry `why` |
| Evaluable, no labelled set | 4 | agreement and invariance tests work; safety recall needs a hand set |
| Honest about what is learnable | 4 | "verified" and "weakened" overclaim from self report |
| Safety gate as proposed | 5 | right idea, seven classes too many; nothing screens text today |
| Privacy | 7 | fine if derived and never stored joined |
| Host free purity | 9 | all pure functions of text and record |
| MVP size realism | 5 | "orchestrator" is a heavy name for a small fix |

## Where modules disagree today (run, not read)

| Text | parseStory (feeds the field) | Source AI |
|---|---|---|
| "I was not angry at him" | Anger 6.0 lands | `srcHear` hears nothing |
| "I am not afraid of dying" | afraid 16 at root, dying 26 at heart | hears heart only |
| "I was never ashamed of it, I am not scared" | four imprints | hears nothing |
| "I always freeze when someone challenges me" (his own example) | reads nothing | `srcDims` marks behaviour answered |

- Four negation handlers: none in `parseStory`, `lawNegated` (3 words, counts
  "did"), `srcNegated` (2 words, not "did"), `leanNegated` (`verp.js:382`).
- Frozen versus re-read: `srcPrior` uses bands stored at commit; `trace.js:775` and
  `dlyReadOf` (`daily.js:568`) re-parse under today's lexicon, which `daily.js:564`
  admits. Three answers to "what did Tuesday's entry say".
- "Verified" has three meanings: `practiceStage` (`practice.js:940`) says only a
  non-user source; `practiceReleaseVerify` says a meter line; the proposal says a
  later self report. `DLY_RANK` ranks observed, known and user_confirmed equal.
- "Confidence" has three: the saboteur ramp value, the unused `evidence.confidence`,
  and a key `daily.js` refuses by name.
- Two safety paths that never meet: `darkRead` (`data/compass.js:365`) refers a
  clinician from CQ and malignancy, and nothing reads what was written.

So the competition is duplicate code, not autonomous agents: pure functions, no live
model. A coordinator with its own state would be a fourth model beside the engine,
the reason `trace.js` refused V3's graph.

## AREA 1, orchestrator and contract

- Exists: `srcNext` (a stated order, `sourceai.js`), `dlyGroundOne`
  (`daily.js:1012`), `TRACE_PROMOTE` (`trace.js:211`), `TRACE_CAUSE_SRC`. That last
  trio IS "an agent cannot turn an inference into a fact", written three times.
- Adds: one shared reading, one arbiter for what the person is told.
- Conflicts: none with rulings. `ARCHITECTURE-RESEARCH.md` warns off orchestration
  cost, so build a library, never a service.
- MVP cut: (a) `readEntry(text, soulKey)`, parse once, negation inside, stamped with
  `LEX_VERSION`, consumed by `srcHear`, trace, daily, avatar, summary. (b)
  `sayNext(state)`, an ordered choice of safety, ask, listen, release, ritual,
  summary. An order, never a score.
- Size M. No dependencies. Risk: touches every reader; run `tools/equiv.py`.

Contract, pure, `engine/reading.js` after `sniff.js` in MANIFEST:

```
Observation {id, agent, src, of:{type,id}, at, lex,
             claim:{seat, band, fetter|null, ord:'low|mid|high'}, negated}
Report      {agent, v, input:[entry ids], observations,
             uncertainty:[{gap,ask}], hypotheses:[proposal],
             recommendation:[{move, because:[obs ids]}]}
agentCeil = {sniffer:'inferred', sourceai:'inferred', trace:'inferred',
             summary:'inferred', meter:'observed', person:'user_confirmed'}
```

`obsValid` refuses an observation whose `src` outranks its agent's ceiling.
Promotion only through `traceApply`. No numeric confidence: grounds are counts a
person can check, as `srcRung` does.

## AREA 3, evidence and verification

- Exists: the graph is the ledger in shape; Evidence and Outcome objects
  (`practice.js:225-252`); the `inferred` flag (`sniff.js:572`).
- Adds: Hypothesis (none in `engine/`), frozen observations, an honest word for
  "verified".
- Conflicts: `p.rituals` against practice objects is already "two truths" until
  cutover (`practice.js` header). A new ledger would be a third.
- MVP cut: the ledger is a VIEW, `ledgerOf(record)`, derive don't store. Stored
  additions are only the person's confirmations, which fit `p.trace`. A hypothesis
  is derived: a `proposed` edge plus supporting and contradicting edges, status
  read from counts over distinct days and contexts. No new record key, so no
  schema v2 question.
- Rename "verified" to "repeated across contexts, by report". With no sensor only
  meter lines and practice timestamps are independent; self report corroborates.
- "Pattern weakened" is not learnable from fewer words: people stop writing,
  wording drifts, the lexicon changes. Compare same-`lex` entries per entry
  written, and say "written about less".
- "Challenge triggers withdrawal" needs a relation the lexicon cannot extract.
  Propose it only when trigger and behaviour cues share a clause, quote the clause,
  mark `proposed`.
- Size M, depends on Area 1(a).

## AREA 4, safety gate and the sniffer

Measured live. No distress screen exists.

| Text | Result |
|---|---|
| "I feel suicidal", "I want to kill myself", "I want to end it all", "I have no reason to live", "I have been cutting myself again" | empty reading, nothing kept |
| "I wish I could disappear" | scored heart 26 and a release offered (`PHRASES` idiom) |
| "I cannot keep going" | scored as exhaustion, solar 28 |
| "I have chest pain and my left arm is numb" | read as the feeling "numb" |
| "He hits me when he is drunk and I am scared to go home" | Fear only |
| "I was abused as a child" | nothing |

- Exists: `lexicon.js:331` and `daily.js` non-claims. BN1 (TASKS.md:10785) logged
  the gap on 25 September, unbuilt.
- Adds: a stage before reading. `safetyScreen(text)` returns `{level, cues}`.
- MVP cut: four response levels, not seven content classes: none, care, crisis,
  route (medical, substance, abuse name a kind of outside help, no label). Ordinary
  and activated discomfort stay the sniffer's reading.
- Rules from the cost of each error:
  1. Crisis inverts my usual rule: a miss costs more than a false alarm, so lean to
     recall. Affordable only if a false alarm is cheap: dismissible, never
     blocking, no score, not saved, reading unchanged.
  2. Negation is not honoured for crisis cues ("I am not suicidal" still routes to
     care). The opposite policy to the sniffer, set per consumer.
  3. Third person ("she wants to die") reaches care at most.
  4. Recognition only. A body word stays a seat and the fetter stays `null` unless a
     word named it. "Addicted to alcohol" opens a pathway; it never names a disorder.
- Not mine to settle: cue list and response text need a clinician and a locale
  (BN1 Q1). The wheel (`FEELINGS-WHEEL.md`) is feeling vocabulary, not a risk list.
- Size S for the function, M with surface and review.

## Arithmetic dressed as intelligence

- The 0 to 10 per seat is a hand set word weight (12 to 28) over three. Nobody can
  defend 22 over 24. Show low, mid, high.
- `srcRung` 9 and 10 count an earlier entry if its band was above zero at all
  (`srcPrior`). `srcRung(1,2,3)` returns 10: one faint word in two old entries plus
  one mention reads "root candidate". Recurrence is not a root; weigh by amount.
- Saboteur confidence is a membership ramp, never a chance. `darkRead` should not
  be the only trigger of a clinician referral (SF6 open).
- `ADJ2CHG` files "addicted" and "craving" under the charge `joy` (`lexicon.js:228`).
  Verify before it feeds a reading.

## Honest evaluation

1. Agreement test: over the story bank every consumer reports the same seat set per
   entry. Today it is not zero. Target zero.
2. Invariance: adding "not" never raises a seat; a paraphrase set keeps seats.
3. A gate hand set, written by someone other than the lexicon author, frozen before
   tuning. The lexicon grew from failing test sentences, so the story bank is
   training data (leakage). With 60 positives and no misses the miss rate is still
   only bounded near 5 percent, so recall claims stay modest.
4. A hand counted false alarm audit on ordinary entries.

## RISKS

- A coordinator built before one shared reading freezes today's duplicates.
- A new ledger beside trace: two truths again.
- Copy saying "verified" or "weakened" that self report cannot show.
- A cue list written by engineers; a missed crisis is the worst failure.
- A stored safety bit becoming health data.

## RECOMMENDED ORDER

1. `safetyScreen` and a clinician owned cue list (S, MVP, no dependencies).
2. `readEntry` with negation and `lex` stamp, consumers moved over (M, MVP).
3. Agreement and invariance gates, proving step 2 (S, MVP).
4. `obsValid` and the ceiling table, merging three copies of the rule (S).
5. `ledgerOf` view, Hypothesis, rename verified (M, MVP cut only).
6. `sayNext` arbiter (S).
7. Later: arbitration across entries, relation extraction, any learned model (needs
   the story-only, key-not-name path the owner ruled).
