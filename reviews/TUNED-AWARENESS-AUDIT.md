# Tuned Awareness Architecture, audited against the real code

Read only. Nothing built, nothing merged. Two passes over the document, as
asked ("review this twice"): the first pass read it on its own terms and
listed every substantive requirement, the second pass graded each one against
the shipped engine, with a measurement where a measurement was possible.

The document is `reviews/TUNED-AWARENESS-ARCHITECTURE-TDD.md`, all 1,281
lines, sections 1 to 24 including the ten open questions. It landed in the
repository at commit `30304dd`.

The model for the discipline here is `reviews/CONGRUENCY-AUDIT.md`, which
audited the other TDD in motion. Its findings are not re-derived; where this
audit depends on one it cites it and says whether it still holds, because
three of its items have changed since it was written.

Grades are the house set: EXISTS, PARTIAL, MISSING, CONFLICT, UNVERIFIED.
"Measured" means a probe was run in node against the committed `engine.js`
for this audit, not that a comment or a document said so. Every other claim
cites a file and a function, or is marked as inference.

Date: 2 October 2026.

---

## The verdict in one line

**Most of this architecture is already built under different names, and its
one new idea, tuning, is the only part that is genuinely additive; but the
document's single most load bearing claim, that CQ = (Intention x Integrity)
/ Resistance is "the existing coherence relationship", is a formula the owner
himself ruled out of this engine on 25 September, and the code has not
divided by resistance since.**

---

## Step 1. The canonical build

| | |
|---|---|
| Branch | `claude/laughing-feynman-xhfyj3` |
| Commit audited | `30304dd` (2 October 2026, the commit that added the document itself; it touches no code) |
| Last commit that touched code | `9dbf364`, the duplicate function build guard |
| Source file | `source.html`, 4,201,406 bytes, md5 `259189ae7593cfad4487c3f898ffda03` |
| Build stamp inside the file | `data-build="v1442 fbb4e91 2026-10-02 18:43"` |
| Engine file | `engine.js`, 1,162,014 bytes |
| Schema version | `SCHEMA_V` 2 |
| Graph version | `TRACE_V` 1, derivation version `TRACE_ALG` 1 |
| Lexicon version | `LEX_VERSION` `lxb8dab445` |
| Practice schema version | `PRACTICE_SCHEMA_V` 1 |
| Coherence arithmetic version | `CQ_MODEL` 2 |
| Gate run for this audit | `node tests/engine.js`, 4,436 passed, 0 failed |

The stamp still names the commit before the code it carries, which
`CONGRUENCY-AUDIT.md` step 1 recorded and which has not changed. The stamp
reads `fbb4e91` and the file contains everything up to `9dbf364`. So a stamp
cannot be used to find the source that produced the file, and that is why
this audit names the git commit separately.

---

## Step 2. What the document names, and what the code already calls it

This is the whole point of the audit. The document is written as though the
reasoning layer is being specified for the first time. It is not. Below is
every entity in its section 3.1 table, plus every object it specifies later,
set against the real implementation.

### 2.1 The nine stage sequence (section 1)

The document's spine is FIELD, AWARENESS, LOCALIZATION, TUNING, EMBODIMENT,
EXPERIENCE, PATTERN, RESISTANCE / COHERENCE, EXPRESSION.

| Stage | Real implementation | Grade |
|---|---|---|
| Field | Two different things in this product, and they are not the same thing the document means. (a) The Source field, the state before any pattern is put in, a canon concept with no arithmetic. (b) **The Field, a product surface**, which draws the nine emotional axes projected onto the 112 addresses (`compute()`, `engine/compute.js:264`) and which is **also a place a person writes charge by dragging** (`ui/ui.js:351`). The document's "the Field visualizes intelligence, it is not the source of it" is therefore already false of the shipped Field, by design and not by accident | **CONFLICT** |
| Awareness | A real readout, not a stage. `Ig` and `It` in `compute()` (`compute.js:364-365`), and the Awareness glyph in `ui/component.js:711` whose own comment says "An aperture, because awareness in this product is the width of what gets through". Also one of the six axes a person self reports per event (`VERP`, `engine/verp.js:9`) | **PARTIAL**, under a different meaning |
| Localization | Nothing in the code localizes anything. The nearest real thing is seating: a seat (one of seven bands), an address (one of 112) and a nerve place, which is where a pattern sits rather than where awareness forms | **MISSING**, and arguably out of scope for an instrument |
| Tuning | **Nothing. This is the document's one genuinely new concept.** See 2.3 | **MISSING** |
| Embodiment | The most completely built layer in the product. 112 addresses, each with a named nerve or plexus, a band, an archetype affinity and a susceptibility (`NODES`, `engine/data/nodes.js`; `suscAll`, `compute.js:13`) | **EXISTS** |
| Experience | A story entry: text, timestamp, imprint count, seat totals, lexicon version, and the onboarding answers (`ENT_KEYS`, `engine/schema.js:797`) | **EXISTS**, thinner than the document assumes |
| Pattern | A pattern is an address with a fetter. 112 fetters, 14 saboteurs (`SAB_LIB`), complexes composed in `compute()`, 6 hyper complex families (`HCX_LIB`), supercomplexes, and 6 masks of which 5 are read (`MASKS_READ`, `engine/data/canon.js:633`). Measured off the shipped engine | **EXISTS** |
| Resistance | `Rz = Math.max(1, (1 + DQ * 0.05) * verpFactor())` (`compute.js:390`). Computed, reported, and **it divides nothing** | **CONFLICT**, see 2.4 |
| Coherence | `CQ = cqSum()`, the 21 laws of moral integrity summed over 210 and nothing else (`compute.js:168`, `:416`) | **CONFLICT**, see 2.4 |
| Expression | Two real things. `EX = CQ * (1 - PULL)`, coherence times what the shadow leaves (`compute.js:422`), and `exprRead()` per band (`engine/expression.js`) | **EXISTS** |

Counted off that table rather than estimated, because the document names nine
stages and the table has ten rows (it reads RESISTANCE / COHERENCE as one
stage and the code holds them as two numbers). Of the ten rows: four exist
outright (embodiment, experience, pattern, expression), one exists under a
different meaning (awareness), one is missing by design and arguably outside
what an instrument can do (localization), one is genuinely missing and is the
document's own new idea (tuning), and three are in conflict (field,
resistance, coherence).

### 2.2 The restorative loop (section 1, section 12.2, section 21)

The document's loop is DETECTION, IDENTIFICATION, RELEASE, FLOW RESTORATION,
RETUNING, COHERENT EXPRESSION.

| Step | Real implementation | Grade |
|---|---|---|
| Detection | `scanStory` then `parseStory` (`engine/sniff.js:372`, `:572`): 281 lexicon entries, 22 phrase rows, 16 degree words, 11 place words, longest match first, a phrase outranking the words inside it. Plus `srcHear` (`engine/sourceai.js:123`), which counts return rather than weight | **EXISTS** |
| Identification | The onboarding mirror, `obMirrorCard` (`ui/onboard.js`), which separates what the person said, what the engine read and what it guessed, per address, with Yes and Not me | **EXISTS** on one of four doors into a story; `CONGRUENCY-AUDIT.md` 2.3 and D3 still hold |
| Release | One engine, `relPick` (`ui/release.js:254`), reached from every door, four channels (`CHAN`, `release.js:36`), the ruled six verb sentence (`C3_STEM`, `engine/data/cards.js`) | **EXISTS** |
| Flow restoration | `relWrite` (`compute.js:207`) lowers the axis by a computed share and clamps to 0 through 10 | **EXISTS**, at axis level and not address level, which matters below |
| Retuning | **This already exists under the product's own name.** The two mechanics: Release lowers the charge, then Embodied Truth installs the quality the pattern was blocking, at the same address, at 62 percent of what was removed (`relWrite`: `S.replace[n.cf] += share * 0.62`). The glossary calls it the Replacement state | **EXISTS** as the second mechanic; **MISSING** as the document's larger "what expression is now available" |
| Coherent expression | `EX`, and `exprRead()` per band | **PARTIAL** |

The restorative loop is therefore not an addition. It is the product. The
document's contribution to it is the word retuning for a thing already
called Embodied Truth, and one real gap: nothing asks, after a release, what
is now available rather than what has gone.

### 2.3 Tuning, and the TuningState object (sections 5, 16, 20)

This is the document's central claim and the only concept with no existing
name in the code. Field by field:

| `TuningState` field | Real implementation | Grade |
|---|---|---|
| `native_configuration` | Real, and explicitly not a reading. The stated four letter type writes charge onto the nine axes (`SEED16`, `engine/seed.js`), whose own header says "A four letter type is the ego's own account of itself. It is not a reading, so this module never claims to have detected one". Plus the blueprint side: domains, archetypes, gates and placements from date, time and place (`engine/birth.js`, `engine/astro.js`, `engine/numerology.js`) | **PARTIAL**: it is stated or computed from birth data, never inferred from behaviour as section 9 proposes |
| `current_configuration` | The nine axes held, `S.charge`, and the 112 addresses derived from them | **EXISTS** |
| `active_patterns` | `loopRead(p).patterns` (`engine/loop.js:68`), one row per pattern the record touches, with state, named, weight, lines, truths, protocols, rituals and what the person said changed | **EXISTS** |
| `aperture` | No number. See 2.6, which is a conflict with an owner ruling and not a gap | **CONFLICT** |
| `dominant_attention` | `pathOf().dwell`, the seat a story returns to most (`sniff.js:518`). Per entry, not per person | **PARTIAL** |
| `energetic_state` | No separate reading. Soma and the aura are canon words the product deliberately does not measure (glossary, `engine/data/kb.js`) | **MISSING**, deliberately |
| `somatic_state` | The 112 address weights, `n.sq`. Also a graph node type, `somatic_state` (`TRACE_NODE_TYPES`) | **EXISTS** |
| `psychological_state` | Saboteurs, complexes, hyper complexes, supercomplexes, masks, the two real axes shape and control, and the governing quadrant (`compute()`) | **EXISTS** |
| `intention_vector` | **Does not exist as a measurement, and the owner has ruled why.** His words, recorded in `DECISIONS.md`: "Intention is the output of what you're trying to get done. You can be traumatized by your childhood memories and there's no action behind that. No intention." The team's reading beneath it: "**So intention is not read off charge directly.** It is the gap between what a person said they would do and what they did." Nothing in the engine measures that gap. The nearest thing is one self reported axis per event, `VERP` `intent`, "It rose and it did not move me off what I was doing" (`verp.js:11`) | **MISSING**, and it is the reason the document's CQ formula is not computable |
| `integrity_state` | The 21 laws, `S.law`, each 0 to 10, plus the release lift (`lawNow`, `compute.js:166`) | **EXISTS** |
| `resistance_profile` | `Rz`, `DQ`, `dist`, `drag`, the per seat weights, and the six axis cost multipliers (`VERPMULT`, `verp.js`) | **EXISTS** as numbers, **MISSING** as a profile object |

**Tuning drift (section 5.3).** `seedShare(p)` (`engine/seed.js:80`) already
measures exactly one drift: how much of the nine axis field is still the
stated seed, against how far it has moved. It is a single ratio over the nine
axes. There is no drift reading against the blueprint side (domains,
archetypes, placements), and no drift over time, because nothing compares a
present configuration with a past one except `history[]`, whose snapshots
carry no algorithm stamp (`CONGRUENCY-AUDIT.md` 2.7, still true).

**Grade for tuning as a whole: PARTIAL, and far more built than the document
assumes.** Nine of eleven `TuningState` fields have a real implementation
today. Two do not: `aperture` (a conflict) and `intention_vector` (ruled
out). What is missing is not the parts. It is the composition, a single
derived read, and a drift measure wider than the nine axes.

### 2.4 The coherence engine, and the headline conflict (sections 2.4, 10)

The document states, twice, that `CQ = (Intention x Integrity) / Resistance`
is "the existing coherence relationship" and gives it "a home inside a named
coherence engine".

**It is not the existing relationship. It was removed, on the owner's own
ruling, on 25 September.**

The code, `engine/compute.js:392-416`, says so in its own comment:

> This was `clamp(It*Ig/Rz)`. Ig was the law mean and It was the band mean of
> the same 21 laws, so the laws were counted twice and CQ went as their
> square: every law at 5 read 25 where his ruling reads 50. And both factors
> carried poleMean and JQ, so installing an opposite past 6 pushed JQ up and
> CQ down: a release lowered CQ in 22 of 10,000 random fields.

And at `:386-388`, on resistance:

> Resistance is still computed and reported, because the gates drill names
> it, but **it divides nothing any more**: the owner ruled CQ is the 21 laws
> and nothing else, and `verpFactor` stops multiplying anything in CQ with
> it.

The owner's ruling is recorded verbatim in `DECISIONS.md`:

> **CQ is the 21 laws of integrity and nothing else.** Each law 0 to 10, and
> the 21 together sum to 100 percent. [...] Neither engine's current formula
> is this: MOB squares the law mean and divides by resistance, the desktop
> takes the law mean and divides by a story count. Both fold the shadow into
> CQ. He has ruled the shadow out of it.

**Measured for this audit**, on the committed `engine.js`, all 21 laws
answered at 7, nothing else changed but the charge on all nine axes:

| Axes held | CQ | Resistance `Rz` | Shadow `DQ` | Expression `EX` | Shadow pull |
|---|---|---|---|---|---|
| 0 | 70.00 | 1.000 | 0.0 | 70.00 | 0.000 |
| 5 | 70.00 | 2.070 | 21.4 | 68.10 | 0.027 |
| 10 | 70.00 | 3.140 | 42.8 | 46.98 | 0.329 |

CQ is identical to three decimal places while resistance triples. Resistance
acts on **expression**, through a fitted bell curve (`leverPull`,
`compute.js`), not on coherence. That is the owner's lever: "CQ 100 SQ 0 ...
one pulls down the other, it's a lever."

**Why this matters more than a wrong equation.** Three documents in this
repository now assert the removed formula: this new TDD (sections 2.4 and
10), `CLAUDE.md` ("`CQ = (Intention x Integrity) / Resistance`. Resistance is
a floor of 1 plus DQ"), and the team's own round QF log in `TASKS.md`. The
`CLAUDE.md` half about the resistance floor is still correct;
the division is not. The most likely reading, and it is marked as inference:
**the document was written from `CLAUDE.md` rather than from the code**, which
is the same failure mode `CONGRUENCY-AUDIT.md` found in the other TDD, where
section 6's fourteen word matcher turned out to be the mockup's stub and not
the product. A stale sentence in a project document becomes a requirement in
the next document written from it.

Grade: **CONFLICT**, the most consequential in this audit. Building the
document's coherence engine as written would reverse an owner ruling, make a
release able to lower coherence again, and square the 21 laws.

### 2.5 The sniffer and the SignalObservation contract (section 6)

The document's statement of the sniffer's job is the best thing in it, and
the code already agrees with it in two places.

> Its job is not to declare what something "is." Its job is to detect
> movement and recurrence.

`engine/sourceai.js` is built on exactly that, and says so:

> So this scale is **evidence of return**. A pattern is something that comes
> back, and the rung counts how much of that the text actually shows.

The rungs: 0 nothing read or every mention negated; 1 to 6 heard once in this
entry; 7 the entry returns to the same seat a second time; 8 a third time or
more; 9 an earlier committed entry touched this seat too; 10 it returns
across entries and again inside this one, the root candidate (`srcRung`,
`sourceai.js:111`). Every rung is a count a person could check by reading
their own words.

And it was evaluated without a labelled set, which is the actual situation
here: the module's own header records that the obvious alternative scale, the
sniffer's own 0 to 10, has a median single word reading of 7.33 and 149 of
219 words clear seven alone, so "ask at seven and over" on that number would
have asked about roughly two thirds of every line the sniffer reads at all.
That is a real negative result, measured, and it is why the rung ladder
exists.

Now the output contract, field by field:

| `SignalObservation` field | Real implementation | Grade |
|---|---|---|
| `source` | `srcHear().seats[].words`, the person's own letters through `normMap`, so what is quoted back is what they typed | **EXISTS** |
| `timestamp` | `entry.t` on a committed entry. Not on an observation, because no observation is stored | **PARTIAL** |
| `domain` | The seat and the band, `K2BAND`, seven bands | **EXISTS** |
| `direction` | `pathOf()` gives `net`, `drop`, `rise`, `start`, `end`, positive meaning downward toward the root (`sniff.js:518-570`). Per entry, over the text, not per signal | **PARTIAL** |
| `intensity` | `imprints[].amt`, `bands[seat]`, `srcHear().seats[].reading` | **EXISTS** |
| `persistence` | **Nothing.** How long a seat has carried is not measured anywhere. The record holds what is needed (every entry has `t` and `bands`, `meter.firsts` dates every address first opened, `history[]` snapshots the axes) and nothing reads it as duration | **MISSING** |
| `recurrence` | `srcRung`'s mentions within an entry and `srcPrior`'s count of earlier entries per seat (`sourceai.js:102`) | **EXISTS**, at seat level |
| `coupling` | **Nothing.** Which seats move together is not measured. `pathOf().steps[].seats` records a single word reaching two seats, which is co-location in one word and not coupling across a history | **MISSING** |
| `trigger` | `srcDims()` reads a trigger dimension off cues: when, after, because, as soon as, the moment, right before, just before (`SRC_DIM_CUE`, `sourceai.js:229`) | **EXISTS**, as present or absent, not as a value |
| `response` | The same function's `behaviour` dimension, ported from `VERPCUE` plus a stated doing verb list (`SRC_DO`) | **EXISTS**, same shape |
| `trajectory` | `pathOf()`: `steps`, `span`, `net`, `dwell`, `kink`, `floor`, both ends of the charge reported because which end is the block is unruled | **EXISTS**, per entry |
| `confidence` | Two real things and they are not the same. Per imprint, the booleans `inferred` and `stated` (`sniff.js:636-658`), which is the most important evidence boundary in the codebase. Per saboteur, a `confidence` number inside `sniffStory` (`sniff.js:1404`), which is called from one place only, `ui/tutorial.js`, for display | **PARTIAL** |

**Measured for this audit**, the same story `CONGRUENCY-AUDIT.md` used, typed
into the committed engine:

> I snapped at my co-founder in front of the team and I cannot stop replaying
> it. My chest is tight and I feel ashamed.

13 imprints, 1 named by the person's own words, 12 chosen by the fallback.
Path: 5 steps, span 61.12, net 0, dwell solar, start solar, end solar, the
highest charge at the heart and the lowest at the sacral. So nine of twelve
`SignalObservation` fields already have a real producer, two are missing
outright, and the twelfth, confidence, exists twice under two meanings.

Grade: **PARTIAL**, and the contract itself is **MISSING**. There is no
single object. There are three producers (`parseStory`, `pathOf`, `srcHear`)
and nothing composes them.

**And a conflict the document does not know it has.** The other TDD already
in motion specifies an `Observation` object with its own different fields
(`id`, `sessionId`, `source`, `userSaid`, `extracted`, `hypothesis`,
`userVerification`, `downstream`), graded **MISSING as a contract, PARTIAL as
parts** by `CONGRUENCY-AUDIT.md` 2.2. **Two documents now specify two
different observation contracts for one sniffer, and neither is built.** This
is the exact "one word per concept" defect the project rules forbid, arriving
as two documents rather than two code paths. Resolving it is a ruling, not a
build, and it must happen before either is built or the product acquires two
observation objects.

### 2.6 Aperture, and the second conflict (sections 2.3, 18)

The document insists aperture and tuning are independent:

> Aperture and tuning can change independently. A system may have broad
> aperture with distorted tuning; narrow aperture with relatively coherent
> tuning [...]

**The owner has already ruled on aperture, and his ruling makes it dependent
on the load.** `TASKS.md` rows QT3 and QT6, his words:

> **QT3. IQ, awareness.** "It is the aperture of awareness, and your ability
> to problem solve rapidly. How much of the patterns can you see, recognise
> that it is a pattern."

> **QT6.** "Fetters narrow awareness. We probably have a more realistic
> measure of awareness, of IQ, based off the fetters a person adds to their
> system."

Under that ruling aperture is computed from what is held, which is the same
quantity resistance is computed from (`DQ`, the 112 address weights summed).
So aperture and resistance cannot vary independently, and "broad aperture
with highly distorted tuning" is not a state this product can represent
without contradicting him. The document's section 2.3 and the owner's QT6
are two different models of the same word.

**And the product already has two other meanings of access, which is why a
third needs a ruling rather than a build.**

1. **Awareness**, a reading. `Ig` and `It` in `compute()`, and the glyph
   comment that calls it an aperture outright (`ui/component.js:711`).
   Separately, the glossary: "Awareness. How far open the soul's window is."
2. **Sight**, a purchase. `SIGHT` rows gated by the tier a person is on
   (`engine/plan.js:97`, `planSees`, `sightRows`). What a person may see of
   their own reading is an entitlement, not an aperture.

Depth is a third unrelated use of the word: the four depths are drawing
presets and geometry on the wheel (`ui/wheel.js:637`), and "profile depth" in
`engine/exdepth.js` means a worked example's bank and vault.

Grade: **CONFLICT**, against an owner ruling rather than against code, and
a one word per concept collision with Awareness and with sight by tier.

### 2.7 The graph, and the third conflict (sections 7, 8, 16)

The document specifies 24 node types and 16 edge types.

The shipped graph has 15 node types and 19 edge types, taken from the other
TDD "exactly, and in that order" by its own comment, with a rule table that
refuses any triple outside it by name (`TRACE_NODE_TYPES`,
`TRACE_EDGE_TYPES`, `TRACE_RULES`, `engine/trace.js:67-187`).

**Measured overlap.** Of the document's 24 node types, three are named
identically in the shipped graph: `story`, `pattern`, `release`. Of its 16
edge types, one is: `reinforces`. So 21 of 24 node types and 15 of 16 edge
types are new vocabulary for a graph that already refuses unknown types at
the profile boundary (`validateTrace`, `TRACE_KEYS` is exactly `v`, `nodes`,
`edges`; `TRACE_NODE_KEYS` is `type`, `id`, `src`, `was`).

Worse in the other direction. Twelve of the fifteen shipped node types have
no counterpart in the document's list: `impression`, `goal`, `behavior`,
`protocol`, `ritual`, `practice_event`, `observation`, `evidence`, `outcome`,
`context`, `somatic_state`, `reframe`. That list is the entire evidence and
practice spine, which is the half of the graph the Congruency work is
currently building on. **Adopting the document's vocabulary literally would
delete the provenance layer**, because there would be no `evidence` node for
an `evidence supports pattern` edge to come from, and no `observation` node
at all.

**And a structural conflict, not a vocabulary one.** The document's pipeline
(section 8) ends GRAPH NODE / EDGE UPDATE, then TUNING MODEL UPDATE, then
COHERENCE / RESISTANCE ANALYSIS. That assumes a stored, mutating graph and a
stored tuning model. The shipped graph is a stated refusal of that, with a
reason:

> **DERIVE, DON'T STORE.** `meterNext` in `engine/schema.js` says it plainly:
> a stored cursor and a stored list are two answers to one question and they
> drift. So the graph is a pure function of the record plus one small stored
> set, `p.trace`.

Verified: nothing outside `engine/trace.js` and the export table calls
`traceAddNode` or `traceAddEdge`. `p.trace` is created blank by
`blankProfile` and validated on import, and for a real person it stays empty;
the graph is rebuilt from the record on every read by `traceFromRecord`.

Grade: **CONFLICT**, on vocabulary and on storage model. The provenance set
the document is missing entirely, `TRACE_SRC` = known, inferred, proposed,
user_confirmed, observed, with `TRACE_PROMOTE` saying an inferred edge can
only become user_confirmed by being confirmed and must keep what it was in
`was`, is the thing that makes the graph safe to show a person. The document
has no equivalent.

### 2.8 The release engine (section 12)

| Document requirement | Real | Grade |
|---|---|---|
| "Release is designed to remove obstructions in the transmission path. It does not manufacture the underlying flow" | Exactly what `relWrite` does: lowers the axis by a computed share and installs the opposite at 62 percent | **EXISTS** |
| Generic release loop: detect, locate, observe, differentiate awareness from pattern, allow, reduce resistance, restore flow, re establish tuning, express | Detect `parseStory`; locate the address; observe the mirror; the release script's own lines; `relWrite`; `relCoolDown`; the second mechanic. "Differentiate awareness from pattern" is the release sentence's own job, "I am letting go of believing, perceiving, thinking, behaving, acting, and feeling that I am ..." | **EXISTS** |
| Direction of change, open flow to crystallization and back | No state is held for a pattern. See 2.10 | **MISSING** |

One correction to carry forward rather than repeat: `CONGRUENCY-AUDIT.md`
found that the other TDD's release sentence was the mockup's and not the
owner's ruled one. This document does not quote a release sentence at all,
so it introduces no new conflict there.

**What changed since that audit, and it is the important update.** Its
"single next task" has landed. `releaseVerify` in `engine/journey.js:134`
writes one practice evidence record per address the run worked, through the
existing `practiceDo` door, with a closed set of five answers (`RV_ANSWERS`:
`feel_different`, `see_differently`, `something_moved`, `nothing_changed`,
`not_sure`) under the metric `release_verification`. `ui/release.js:817-830`
asks "What changed?" on the finished card, and a skip records nothing.
`loopRead` reads the answers back per pattern as `said`, counted by answer
and never added to support (`loop.js:123-130`). **Measured for this audit**:
a verification written against address 46 comes back on that pattern's row as
`{n:1, by:{something_moved:1}, last:"something_moved"}`.

So the document's FEEDBACK step (section 14) and its section 13 question
"what expression is now available" have their first real instrument already,
and it was built on the evidence model that already existed rather than on a
new one.

### 2.9 Resistance and structure (section 10.3)

The document lists thirteen potential sources of resistance: fear,
avoidance, identification, conflicting stories, somatic contraction,
habitual pattern, suppressed expression, over control, obligation,
entitlement, justification, perfection, other acquired structures.

**Eleven of the thirteen are already named addresses or canon mechanics in
this engine**, measured against the shipped `NODES` and glossary:

| Document source | Real |
|---|---|
| fear | Axis `Fear`; address 1, Root |
| avoidance | Address 24 Avoidance Of Pleasure, 62 Avoidance Of Grief; the `averse` axis in `VERP` |
| identification | The Tag mechanic, glossary: "The moment something that hit you hard gets a name and gets stored at an address"; the `attach` axis |
| conflicting stories | Story entries, and the imprints that disagree |
| somatic contraction | `n.sq`, the weight at an address |
| habitual pattern | Saboteur, glossary: "a fetter squeezed into a habit you keep repeating" |
| suppressed expression | Address 65 Self-Silencing, 22 Shame Of Desire; `exprRead()`'s leak |
| over control | Address 4 Control, 41 Force, 42 Rigidity |
| obligation | Address 58 Expectation, 54 Martyrdom |
| entitlement | Address 38 Entitlement |
| justification | The Justification mechanic, glossary, a named defence of the pattern |
| perfection | Address 40 Perfectionism |
| other acquired structures | Masks, complexes, hyper complexes, supercomplexes |

Grade: **EXISTS**. There is nothing to build here. There is a mapping to
write down once so the document's list and the address table are not two
answers to one question.

### 2.10 The state machine (section 15)

Seven states: Coherent, Activated, Contracted, Crystallized, Distorted
expression, Observing, Flow restored, Coherent expression.

Nothing in the engine holds a state for a pattern or a person. The nearest
real state vocabularies, and each is about something else:

| Real state set | Where | What it is about |
|---|---|---|
| `new`, `storied`, `continuing` | `journeyRead`, `engine/journey.js:44` | where a person is on the way in |
| `idle`, `run`, `cool`, `done` | `RUN.phase`, `ui/release.js` | one release session, in memory, never stored |
| `unanswered`, `confirmed` | `loopRead`, `engine/loop.js:150` | whether the person said yes to a pattern |
| `improved`, `unchanged`, `worsened`, `unclear` | `PR_OUT_ST`, `engine/practice.js:54` | a practice outcome |
| `known`, `inferred`, `proposed`, `user_confirmed`, `observed` | `TRACE_SRC` | where a claim came from |

Grade: **MISSING**, and a warning attached. The record cannot currently tell
Contracted from Crystallized, because neither persistence nor recurrence over
time is measured (2.5). A seven state machine built on a record that can
distinguish three states would be arithmetic presented as a reading, which is
the failure `parseStory`'s `inferred` flag exists to prevent. Fewer states,
each one a count a person could check, is the honest version and it is
smaller.

### 2.11 BeingState (section 20)

| Branch | Real | Grade |
|---|---|---|
| `field_reference`, `awareness_state`, `localization_state` | nothing, nothing, nothing | MISSING |
| `tuning {native, current, drift}` | `p.seed.axes`, `p.axes`, `seedShare(p)` | **PARTIAL**, nine axes only |
| `aperture` | ruled, unbuilt, conflicted (2.6) | CONFLICT |
| `embodiment {nervous_system, somatic_state, energetic_state, behavioral_state}` | the nerve place per address, `n.sq`, nothing, `srcDims().behaviour` | PARTIAL |
| `cognition {attention, interpretation, identification}` | `pathOf().dwell`, `parseStory`, `entry.ob.yes/no` | PARTIAL |
| `structure {patterns, stories, fetters, saboteurs, complexes, character}` | every one of these is a real table | **EXISTS** |
| `coherence {intention, integrity, resistance, expression}` | no intention; laws; `Rz`; `EX` | PARTIAL |
| `history {experiences, releases, transitions}` | `story.entries`, `meter.unique` and `meter.firsts`, `history[]` snapshots with no stamp and no link | PARTIAL |

Grade: **PARTIAL**. `BeingState` is close to a rename of the profile record
plus two derived reads. It should not become a stored object: that is the
derive, don't store rule and the reason is in 2.7.

### 2.12 Harmonic analysis (section 17)

"Definition = localization handle. Behavior = dynamic signal." This is the
same argument `DESIGN-sniffer.md` already makes and the same one
`engine/sourceai.js` is built on. It is a restatement, not a requirement, and
there is nothing to grade except agreement.

One live item it touches: the owner has already asked for research into
whether the 112 addresses are harmonic as well as geometric, with frequencies
corresponding to the length of the nervous system at each address
(`DECISIONS.md`), and `reviews/NEUROHARMONICS-SPEC.md` is that work in
progress. The document's section 17 does not add to it.

---

## Step 3. Every substantive requirement, graded

| # | Requirement | Grade | Evidence |
|---|---|---|---|
| R1 | One field, many expressions (2.1) | **EXISTS** as canon | glossary Source, Consciousness |
| R2 | Localization is not distortion (2.2) | **EXISTS** as canon, unimplemented | nothing localizes |
| R3 | Tuning distinct from aperture (2.3) | **CONFLICT** | 2.6, owner's QT3/QT6 |
| R4 | Resistance as obstruction, not absence of energy (2.4) | **EXISTS** | glossary Resistance; `Rz` |
| R5 | `CQ = (Intention x Integrity) / Resistance` (2.4, 10) | **CONFLICT** | 2.4, measured; `DECISIONS.md` ruling |
| R6 | Release as restoration, not purpose (2.5, 12) | **EXISTS** | `relWrite`, the two mechanics |
| R7 | The nine stage sequence (1, 4.1, 21) | **PARTIAL** | 2.1 |
| R8 | `TuningState` object (5.1) | **PARTIAL**, 9 of 11 fields have producers | 2.3 |
| R9 | Native versus acquired (5.2) | **PARTIAL** | `seed.js`, `birth.js` native; charge and saboteurs acquired |
| R10 | Tuning drift (5.3) | **PARTIAL** | `seedShare`, nine axes, no time dimension |
| R11 | Sniffer detects movement and recurrence, not identity (6.1) | **EXISTS** | `srcRung`, `srcHear`, and its own measured justification |
| R12 | `SignalObservation` contract (6.3) | **PARTIAL** parts, **MISSING** contract, **CONFLICT** with the other TDD's `Observation` | 2.5 |
| R13 | Persistence as a signal field (6.1, 6.3) | **MISSING** | nothing measures duration |
| R14 | Coupling as a signal field (6.1, 6.3) | **MISSING** | nothing measures co movement |
| R15 | Graph node types (7.2) | **CONFLICT** | 3 of 24 names overlap; 12 shipped types absent |
| R16 | Graph edge types (7.3) | **CONFLICT** | 1 of 16 names overlap |
| R17 | Sniffer to graph pipeline with a stored update step (8) | **CONFLICT** | derive, don't store |
| R18 | `detectTuning` algorithm (9) | **MISSING** | no composition exists |
| R19 | "Inferred native configuration is a hypothesis rather than an unquestionable fact" (9) | **PARTIAL**, and not the same gap the other audit found | Step 4, C5 |
| R20 | Intention as a reading (10.1) | **MISSING**, ruled | 2.3 |
| R21 | Integrity as a reading (10.2) | **EXISTS** | the 21 laws |
| R22 | The thirteen resistance sources (10.3) | **EXISTS** | 2.9, eleven of thirteen are named addresses |
| R23 | Free will as unobstructed transmission (10.4) | **EXISTS** as the lever | `EX = CQ * (1 - PULL)` |
| R24 | Embodiment chain, nervous system as the interface (11) | **EXISTS** | every address carries a nerve or plexus |
| R25 | "This should remain a model claim unless separately established" (11) | **EXISTS** as practice | the glossary already says the instrument does not measure the aura, soma or biophoton field |
| R26 | Retuning (13) | **PARTIAL** | the second mechanic exists; "what is now available" does not |
| R27 | Feedback loop closes (14) | **PARTIAL**, newly | `releaseVerify` landed; the mirror's answer still does not close (F16) |
| R28 | Seven state machine (15) | **MISSING**, and not yet supportable | 2.10 |
| R29 | Tuning as a graph level property (16) | **CONFLICT** | 2.7 |
| R30 | Harmonic analysis (17) | **EXISTS** as method | 2.12 |
| R31 | Separation of concerns, eight concepts kept distinct (18) | **PARTIAL** | aperture collides with Awareness and with sight; tuning is new and clean |
| R32 | Never assume more awareness equals better tuning (19) | **EXISTS** as posture | the product already refuses to collapse CQ, DQ and SQ into one level |
| R33 | `BeingState` (20) | **PARTIAL** | 2.11 |
| R34 | The ten open questions stay explicit (23) | **EXISTS** as a rule this repository already follows | Step 5 |

Counted off the table above, row by row, not estimated: 13 EXISTS, 9 PARTIAL,
5 MISSING, 7 CONFLICT, 0 UNVERIFIED. Thirty four rows, thirty four grades.
R12 carries three grades in its own row and is counted once here at the worst
of them, CONFLICT, because parts of the contract exist and the contract
itself collides with the other TDD's.

---

## Step 4. The conflicts, named

### C1. The CQ formula. The document against the owner's own ruling.

Covered in 2.4. Measured. CQ does not divide by resistance and has not since
25 September. The document presents the removed formula as existing, and
`CLAUDE.md` and the round QF log both carry the same stale sentence.
**Highest consequence conflict in the audit.** The fix is in two parts: do
not build the formula, and correct `CLAUDE.md`, because the document was most
likely written from it (inference, marked).

### C2. Aperture. The document against `TASKS.md` QT3 and QT6.

Covered in 2.6. The document needs aperture independent of resistance; the
owner's ruling computes aperture from the fetters, which is the same quantity
resistance is computed from. Also a one word per concept collision with
Awareness (a reading) and sight (a purchase).

### C3. The graph vocabulary. The document against the shipped schema and against the other TDD.

Covered in 2.7. Three of 24 node types and one of 16 edge types overlap. The
twelve shipped types the document omits are the evidence and practice spine.
`validateTrace` refuses anything else by name, so this is not a naming
preference, it is a boundary.

### C4. Derive against store. The document against a stated architectural rule.

Covered in 2.7. The document's pipeline assumes a stored graph and a stored
tuning model. The shipped graph is a pure function of the record, by a rule
with a reason: two answers to one question drift.

### C5. The hypothesis gap, and it is NOT the same one the other audit found.

The task asked whether the document's "inferred native configuration is a
hypothesis, not an unquestionable fact" is the Congruency audit's missing
`Hypothesis` object seen from another angle. Checked. **It is a different
thing.**

- The Congruency audit's gap is about **an acquired reading**: the engine
  produces a claim about a pattern and has no first class object to hold the
  claim, its confidence and its evidence. Its pieces exist (`inferred`,
  `stated`, `TRACE_SRC`, `TRACE_PROMOTE`, the practice `confirm` act), and
  four different vocabularies of "confirmed" exist with no bridge (its D10).
- This document's gap is about **a native reading**: inferring what a person
  natively is from persistent low resistance behaviour, and holding that as
  provisional.

They are not the same gap, and the second is strictly harder, because of what
is already written down in `DESIGN-sniffer.md`:

> And one thing that is not learnable from any amount of data: whether a
> reading is right. There is no ground truth here and there is not going to be
> one. [...] it is why every claim has to be sourced to the person's own words
> rather than validated against an outcome.

A native configuration inferred from behaviour cannot be sourced to the
person's own words, because the person did not say it. It also cannot be
validated, because the privacy ruling is structural: the name never leaves
the device, a key replaces it, and the record is never held joined to the
story, so no supervised label exists and no calibration against an outcome is
possible. **Checked first rather than last, as the rule requires: the privacy
ruling permits inferring a native configuration on the device for one person,
and permanently forbids learning or validating the inference across people.**

So section 9's `inferNativeConfiguration` is implementable as an on device
heuristic that must always be labelled a guess, and is not implementable as
anything that could ever be shown to be right. That is a harder constraint
than the document's "treat it as a hypothesis" acknowledges, and it argues
for the product keeping its existing answer: native configuration is
**stated** by the person (the seed) or **computed from birth data** (the
blueprint), never inferred from behaviour.

### C6. Two observation contracts.

Covered in 2.5. The other TDD's `Observation` and this one's
`SignalObservation` are two different objects for one sniffer and neither is
built. This is the cheapest conflict to resolve and the most expensive to
leave, because whichever gets built first becomes the schema.

### C7. "The Field visualizes intelligence, it is not the source of it."

The shipped Field is both. It draws axis level charge projected onto every
address of an axis (`compute.js:264`), and a drag on it writes the person's
charge directly (`ui/ui.js:351`), as do the charge fields and the all axes
sliders (`ui/panels.js:69`, `:77`). `CONGRUENCY-AUDIT.md` 2.7 found this and
it is unchanged. The document restates the principle without knowing the
product breaks it.

---

## Step 5. The document's ten open questions, against what is already open

The document is right that these should stay explicit. Six of them are
already open in this repository, two are substantially answered in code, and
two are new.

| # | Question | Status here |
|---|---|---|
| 1 | How is native tuning distinguished from a deeply habituated acquired pattern? | **NEW, and the hardest.** Bounded by C5: not learnable, only assertable on device. Related but not the same as `DESIGN-sniffer.md` question 1 (event or stance) |
| 2 | Which observations belong to tuning versus aperture? | **Blocked by C2.** Cannot be answered before the owner reconciles his QT3/QT6 aperture with the document's |
| 3 | Can tuning be a vector, topology, harmonic signature or graph substructure? | **NEW.** Note it interacts with the neuroharmonics research already running (`reviews/NEUROHARMONICS-SPEC.md`) and with C4: a graph substructure would be a stored tuning model |
| 4 | How should the sniffer distinguish recurrence from coincidence? | **Substantially ANSWERED in code** and the answer is measured: `srcRung`'s ladder, where a second mention inside one entry is rung 7 and a return across entries is rung 9 or 10, with the alternative scale rejected on a measurement (2.5). What is open is the threshold for coupling and persistence, which do not exist yet |
| 5 | What constitutes sufficient evidence for a graph edge? | **ANSWERED in code**: `TRACE_RULES` refuses any from type, edge, to type triple it does not name, every node and edge carries one of five provenances, and `TRACE_PROMOTE` says an inferred edge becomes user_confirmed only by being confirmed and keeps what it was. The document has no equivalent and should adopt this rather than restate the question |
| 6 | How should conflicting intentions be represented? | **Already open, differently.** Intention is not read off charge at all (2.3), so there is nothing yet to conflict |
| 7 | How should integrity be represented without reducing it to a simple score? | **Already settled against the document.** Integrity is 21 scores, each 0 to 10, each with three intake questions, and the owner ruled it is nothing else. The document is reopening a closed ruling |
| 8 | Which release mechanisms act on which resistance structures? | **Already open** as the four channels question and the depth button names, both named in `CLAUDE.md` as his |
| 9 | What constitutes successful retuning? | **Newly answerable.** `RV_ANSWERS` is the first instrument for it, five closed answers per address, landed this session. What is open is whether `nothing_changed` and `not_sure` may ever lower a pattern's standing, which `CONGRUENCY-AUDIT.md` already named as the owner's |
| 10 | Which parts are phenomenological models, structural analogies, mechanistic hypotheses or empirically testable claims? | **Already answered for the whole product**, surface by surface, and it is the strictest thing this codebase does. The glossary states, in the product, that the aura is not measured, that biophotons are real and carry nothing of the nerves, that chakra to nerve bundle mapping dates from 1927, and that DQ is derived. `BOOK-ERRATA.md` holds every place the codex and the engine disagree. The document should inherit this practice rather than propose it |

**Thirteen questions it does not know about.** `DESIGN-sniffer.md` holds
thirteen measured, unanswered questions about the sniffer this document plans
to build a tuning layer on top of. The most consequential, its own words, is
question 13: `inferred:false` says the person named the **axis**, and no word
ever names an **address**, so "I was furious" currently returns four imprints
named Pride, Arrogance, Competition and Anger with the flag reading green.
**A tuning layer built on that sniffer inherits that defect at a higher
altitude**, where it would read as a claim about who a person natively is
rather than about what they are carrying. Question 13 should be answered
before, not after.

---

## Step 6. What is already satisfied, what is additive, what is premature

### Already satisfied by work in motion or already landed

- The restorative loop as a whole (2.2). It is the product.
- Retuning's first half, the second mechanic, Embodied Truth.
- The sniffer's job as movement and recurrence, with a measured
  justification (`srcRung`).
- Evidence for a graph edge, provenance, and promotion (the document's
  question 5).
- The feedback step, "what changed", landed as `releaseVerify` plus the
  finished card's question plus `loopRead`'s `said`.
- The resistance sources list, eleven of thirteen already named addresses.
- The empirical honesty rule (the document's question 10).

### Genuinely additive, in value order

1. **Persistence.** How long a seat has carried. Nothing measures it; the
   record already holds what it needs. This is the highest value item in the
   document and needs no model, no new store and no schema change.
2. **Coupling.** Which seats move together across a history. Same situation,
   one step harder, and a precision risk: a false coupling asserts a
   relationship between two parts of somebody's body.
3. **One derived tuning read.** A single function that composes what already
   exists into the document's `TuningState`, reporting the two fields that do
   not exist as unknown by name rather than filling them.
4. **Drift wider than the nine axes.** `seedShare` covers the stated type.
   Nothing compares the blueprint side with the present configuration.
5. **A per pattern state**, with as many states as the record can actually
   distinguish and no more.
6. **"What is now available"** after a release, the half of retuning that
   does not exist.

### Premature until the Congruency chain closes

- **Anything that reads the person's confirmation.** F16 is the live next
  closure: the mirror's Yes and Not me never reach the graph or the Field.
  **Measured for this audit** on the committed engine, a record carrying this
  audit's story, a Yes on address 46, a Not me on address 17 and one
  verification: the record now validates with `ob` (the boundary fix landed),
  `loopRead` reports 13 patterns, and **confirmed 0, unanswered 13**, with
  address 17 listed as unanswered after the person said Not me. Any tuning
  read built now would inherit that and tell a person their tuning is drifting
  on a pattern they rejected.
- **Aperture as a number.** Blocked on C2, which is the owner's.
- **Native configuration inferred from behaviour.** Blocked on C5 and on
  `DESIGN-sniffer.md` question 13.
- **A new graph vocabulary.** Blocked on C3 and C4, and it should not be
  built at all as written.
- **The seven state machine.** Blocked on persistence and coupling existing
  first; see 2.10.

---

## Step 7. The plan of attack, blocked out

Ordered. Each block names its size, its dependencies, the existing module it
extends, and which of the document's ten open questions it forces a decision
on. No block creates a parallel system: every one extends a module that
already exists, because the audit above found an existing owner for every
piece except persistence and coupling, and those two extend
`engine/sourceai.js`, which is already the recurrence module.

**Block 0 is not mine and is already in motion. Nothing below starts before
it lands.**

### Block 0. F16. The mirror's answer reaches the graph.

Already named as the next closure of the Congruency chain. In motion, not
this audit's work. `entry.ob.yes` and `ob.no` become a stored
`user_confirmed` edge in `p.trace` (which already exists for exactly this:
"every edge a person confirmed", `trace.js:30-40`), so `loopRead` stops
reporting confirmed 0 after a Yes. Everything below reads confirmation, so
everything below waits.

*Dependency: none. Forces: nothing in this document. Measured as still open
above.*

### Block 1. One page. Reconcile the two observation contracts, and correct the stale formula.

**Document only, no code.** Four things, each one sentence to a paragraph:

1. One observation contract, chosen between the other TDD's `Observation`
   and this document's `SignalObservation`, with the field by field mapping
   in 2.5 as the starting table. Whichever is chosen, the other document is
   marked as superseded on that point so the next document written from
   either does not revive it.
2. The CQ correction, in `CLAUDE.md`, in the round QF log, and as an
   erratum beside this document. The sentence that is wrong is the division,
   not the resistance floor.
3. The resistance source mapping from 2.9, so the document's thirteen and
   the address table are one answer.
4. A note that the document's graph vocabulary is not adopted, with C3 and
   C4 as the reason.

*Size: about 150 lines of markdown, no code, no gate. Dependency: none, it can
run beside Block 0. Forces: the document's questions 2, 5 and 10 to be
recorded as answered or redirected rather than re-asked.*

**Why first.** It is the cheapest block and the only one that prevents a
defect rather than fixing one. Two observation contracts and a stale formula
in three documents are both cases of the same failure this repository has
been bitten by repeatedly: a number or a sentence typed into a document that
the code then grows past.

### Block 2. Persistence, measured off the record.

Extends `engine/sourceai.js`, which already owns recurrence.

A new host free read, `srcPersist(entries, now)`, that answers one question
in one sentence: **for each seat, how long has it been carrying, and when was
it last touched.** Every figure a count or a span of days the person could
check by reading their own entries:

- first seen: the earliest entry whose `bands` carry the seat.
- last seen: the latest.
- span: days between them.
- entries touching it, and the gap since the most recent.
- released since: whether `meter.firsts` dates a release at an address in
  that band after the last mention, which is the only way the record can say
  a thing was worked on and came back anyway.

It reads `entry.t` and `entry.bands` and `meter.firsts` only, never the text
of an earlier entry, so it stays inside the narrowest reading of
`DESIGN-sniffer.md` question 12, which is still unruled.

Then `loopRead` carries it per pattern, the way it already carries `said`,
and nothing renders it yet.

*Size: about 120 lines in `engine/sourceai.js`, about 20 in `engine/loop.js`,
plus a group in `tests/engine.js` asserting the ladder day by day on a built
record and asserting that a record with one entry reports a span of zero and
not a null read as zero. Dependency: Block 0, because it reports per pattern.
Forces: the document's question 4, the half of it that is still open.*

**What would make it wrong, and can we detect it.** Two things. An entry
whose `bands` were written under an older lexicon says the seat was touched
when today's lexicon might not agree; `traceFromRecord` already detects
exactly this and reports it as `restated`, so persistence reports the same
count beside its answer rather than hiding it. And a person who writes
nothing for a month has a seat that looks persistent and is only unobserved;
the read reports the gap since the last entry so a surface can say "not
written about since" rather than "still carrying".

### Block 3. Coupling, with precision before recall.

Extends the same module.

`srcCouple(entries)`: which pairs of seats appear in the same entry more
often than either appears alone would predict. Stated minimum support, a
stated minimum number of entries before any pair is reported at all, and the
pair's own count and total always returned beside it so the figure is never
printed without its denominator.

**It reports no pair at all below the minimum, and says so by name.** A false
coupling is worse than a missed one here, because it asserts that two parts of
somebody's body move together, which is a claim a person has no way to check.
That asymmetry sets the threshold, not a balanced score.

*Size: about 100 lines plus a gate group that includes a null case (a record
with too few entries reports nothing and says why) and an adversarial case (a
seat that appears in every entry couples with nothing, because it predicts
nothing). Dependency: Block 2, same module, same record read. Forces: the
document's question 4 fully, and question 5 again in a new place, because a
coupling is the first candidate for a derived edge nobody confirmed.*

### Block 4. `tuningRead(p)`. One derived read, nothing stored.

A new engine module, `engine/tuning.js`, host free and pure, that composes
what already exists. It holds no reading of its own, exactly as
`engine/loop.js` holds none: every field is read off a function that already
owns it.

| `TuningState` field | Read from |
|---|---|
| `native_configuration` | `p.seed.axes` plus the blueprint side off `engine/birth.js`, each labelled stated or computed, never inferred |
| `current_configuration` | `p.axes` held |
| `drift` | `seedShare(p)` for the nine axes, plus a per axis delta so one ratio is not the whole answer |
| `active_patterns` | `loopRead(p).patterns` |
| `aperture` | **`null`, with `why` naming QT3 and QT6 as unruled.** Not a number |
| `dominant_attention` | `pathOf().dwell` of the most recent entry, plus `srcPersist`'s most touched seat |
| `somatic_state` | the band weights |
| `psychological_state` | the saboteur and complex chain off `compute()` |
| `intention_vector` | **`null`, with `why` quoting the owner's ruling** |
| `integrity_state` | the 21 laws as answered |
| `resistance_profile` | `DQ`, `dist`, the per band weights, the six axis multipliers, and `Rz` labelled as reported and not dividing |

Two fields return null with a reason. That is the point of the block: a
tuning read that fills them would be the instrument saying something about
somebody off arithmetic nobody ruled.

*Size: about 200 lines plus a gate group asserting purity (the record is byte
identical after the call, which `tests/journey.js` already does for
`journeyRead`), asserting both nulls carry a reason, and asserting a blank
profile reads unread rather than zero. Dependency: Blocks 0, 2, 3. Forces:
the document's questions 1, 2, 3 and 9. Question 2 in particular cannot be
dodged here, because the read either has an aperture field or does not.*

### Block 5. The surface, and every term unpacked.

One block on an existing surface. Sequenced around what is already in flight:
the three column call from the same round (left for input, right for the
accountability tracker, centre for the ritual) is live work, and the release
carousel build dispatched at round QG holds `ui/release.js`. So this block
proposes no new page and does not touch either of those files. It extends
`ui/loopread.js`, which already draws the pattern rows that would carry
persistence and what the person said.

Every label carries its plain meaning in the same place, per the 2 October
ruling: tuning, drift, native, persistence and coupling are each a term of
art and none of them may stand alone. Drafted through the voice gate before
anything is built.

*Size: about 150 lines of renderer plus copy, plus `tests/unpack.js` and
`tools/monitor.js` runs. Dependency: Block 4. Forces: nothing new; it is the
first place the owner sees the read and the first place he can say the words
are wrong.*

### Block 6. A per pattern state, with as many states as the record can hold.

Only after Blocks 2 and 3, because the document's seven states need
persistence and recurrence to be distinguishable at all.

The honest mapping, derived and not stored, each state a count:

| Document state | What the record can actually say |
|---|---|
| Coherent | nothing read at this address |
| Activated | read once, this entry |
| Contracted | read twice or more in one entry (`srcRung` 7 or 8) |
| Crystallized | read across entries (`srcRung` 9 or 10) with a span, which is Block 2 |
| Distorted expression | not distinguishable; `exprRead()`'s leak is per band, not per pattern |
| Observing | the person answered the mirror about it, which is Block 0 |
| Flow restored | lines opened at the address, `meter.unique` |
| Coherent expression | a verification answer of `feel_different` or `see_differently`, which is `RV_ANSWERS` |

Six of eight are reachable. One is not, and one (Coherent) is the absence of
the rest. **The block ships six states and names the two it cannot read**,
rather than seven states where one is invented.

*Size: about 120 lines in `engine/tuning.js` plus a gate group walking every
state on a built record. Dependency: Blocks 0, 2, 3, 4. Forces: the
document's question 9.*

### Blocked, not scheduled, and whose call

- **Aperture as a number.** Owner's, C2. Until he reconciles QT3 and QT6 with
  the document, `tuningRead` returns null with a reason.
- **Native configuration inferred from behaviour.** Owner's, C5. The
  recommendation from this seat is explicit: keep it stated or computed from
  birth data. An inference that can never be shown to be right should not be
  presented to a person as what they natively are.
- **The document's graph vocabulary and a stored tuning model.** Recommended
  against, C3 and C4. If the owner wants it anyway it is a schema change and a
  `TRACE_V` bump, and it is his.
- **CQ rewritten to the document's formula.** Recommended against, C1. It
  reverses a 25 September ruling and reintroduces a measured defect (a release
  lowering coherence in 22 of 10,000 random fields, which the code's own
  comment records).
- **The frame layer**, which `DESIGN-sniffer.md` specifies and deliberately
  did not build, and which is a bigger lever on this document's whole premise
  than anything above: 91 percent of the owner's own prose currently reads as
  nothing. A tuning layer over a sniffer that reads nothing from most real
  sentences is a tuning layer over silence. Not in this plan because question
  1 of the thirteen is unanswered, and named here so the plan is not read as
  complete without it.

---

## Measured for this audit

- `node tests/engine.js` on the committed tree: 4,436 passed, 0 failed.
- CQ against resistance, three charge levels, all 21 laws answered at 7: CQ
  identical at 70.000 while `Rz` went 1.000, 2.070, 3.140 and `DQ` went 0.0,
  21.4, 42.8. Expression moved, coherence did not.
- `parseStory` on this audit's story: 13 imprints, 1 named, 12 inferred,
  path of 5 steps, span 61.12, net 0, dwell solar, highest charge at the
  heart, lowest at the sacral.
- A record carrying that story, the mirror answers `yes:[46]`, `no:[17]`,
  and one `releaseVerify` answer: `validateProfile` true (the boundary now
  takes `ob`), `releaseVerify` ok, `loopRead` 13 patterns, confirmed 0,
  unanswered 13, address 46 `said` one `something_moved`, address 17
  unanswered. F16 open, by measurement.
- Table sizes off the shipped `engine.js`: `NODES` 112, `LEX` 281,
  `PHRASES` 22, `LEXMOD` 16, `SOMA_PLACE` 11, `SAB_LIB` 14, `HCX_LIB` 6,
  `MASKS` 6, `SINAMES` 21, `CHARGES` 9, `TRACE_NODE_TYPES` 15,
  `TRACE_EDGE_TYPES` 19, `TRACE_SRC` 5, `RV_ANSWERS` 5, `LEX_DEAD` 2.
- Graph vocabulary overlap, counted by hand against the document's lists: 3
  of 24 node types, 1 of 16 edge types.
- Callers of `traceAddNode` and `traceAddEdge` outside `engine/trace.js` and
  the export table: none.
- Callers of `practiceDo` outside `engine/practice.js`: two,
  `engine/journey.js:146` (`releaseVerify`, a real person's path, new since
  the Congruency audit) and `engine/pracex.js:74` (worked examples).

## Unverified

- Nothing was run in a browser for this audit. The release card's "What
  changed?" question is read off `ui/release.js:817-830` and the
  `relAnswer` wiring, not driven by hand. `CONGRUENCY-AUDIT.md`'s Chromium
  journey was not repeated.
- The packed handover file's stamp was not re-checked. It was 50 commits
  behind at the Congruency audit and the branch has moved 47 commits since,
  so it is very likely further behind, but that is inference and not a
  measurement.
- Whether the document's section 17 harmonic claim agrees with
  `reviews/NEUROHARMONICS-SPEC.md` was not graded; that spec has its own
  verdict recorded this session.
- The funnel quiz and the account seam were not exercised, same as the
  previous audit.
